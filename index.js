const express = require('express');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const flash = require('connect-flash');
const path = require('path');

const User = require('./models/User');
// const { isAuthenticated, isNotAuthenticated } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yogaxd-email';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration (optional, can be removed if not using server session)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use(flash());

// Global variables for templates
app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Helper function to decode MIME words
function decodeMimeWords(s) {
    if (!s) return "";
    return s.replace(/=\?([^?]+)\?([BQ])\?([^?]*)\?=/gi, (match, charset, encoding, text) => {
        if (encoding === 'B') {
            return Buffer.from(text, 'base64').toString(charset || 'utf-8');
        } else if (encoding === 'Q') {
            return text.replace(/=([0-9A-F]{2})/gi, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });
        }
        return text;
    });
}

// Function to fetch emails using IMAP
function fetchEmails(account) {
    return new Promise((resolve, reject) => {
        const imap = new Imap({
            user: account.username,
            password: account.password,
            host: account.imap_server,
            port: account.imap_port,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

        const emails = [];

        imap.once('ready', () => {
            imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    imap.end();
                    return reject(err);
                }

                imap.search(['ALL'], (err, results) => {
                    if (err) {
                        imap.end();
                        return reject(err);
                    }

                    if (results.length === 0) {
                        imap.end();
                        return resolve([]);
                    }

                    const lastEmails = results.slice(-20).reverse();
                    const fetch = imap.fetch(lastEmails, { bodies: '' });

                    fetch.on('message', (msg, seqno) => {
                        msg.on('body', (stream, info) => {
                            simpleParser(stream, (err, parsed) => {
                                if (err) return;

                                const email = {
                                    subject: decodeMimeWords(parsed.subject) || '(No Subject)',
                                    from: decodeMimeWords(parsed.from?.text) || '',
                                    date: parsed.date?.toString() || '',
                                    body: ''
                                };

                                if (parsed.text) {
                                    email.body = parsed.text;
                                } else if (parsed.html) {
                                    email.body = parsed.html.replace(/<[^>]*>/g, '');
                                }

                                emails.push(email);
                            });
                        });
                    });

                    fetch.once('error', (err) => {
                        imap.end();
                        reject(err);
                    });

                    fetch.once('end', () => {
                        imap.end();
                        resolve(emails);
                    });
                });
            });
        });

        imap.once('error', (err) => {
            reject(err);
        });

        imap.once('end', () => {
            // Connection ended
        });

        imap.connect();
    });
}

// Supabase JWT verification middleware (to be implemented)
const supabaseJwtMiddleware = require('./middleware/supabaseJwt');

// Public routes
app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Logout (just clear session/localStorage on frontend)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// Protected routes (require valid Supabase JWT)
app.get('/dashboard', supabaseJwtMiddleware, async (req, res) => {
    try {
        // req.user = { id, email } from Supabase JWT
        const user = await User.findOne({ supabaseId: req.user.id });
        res.render('dashboard', { user });
    } catch (error) {
        console.error('Dashboard error:', error);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/login');
    }
});

app.get('/inbox', supabaseJwtMiddleware, async (req, res) => {
    const emailId = req.query.email;
    try {
        const user = await User.findOne({ supabaseId: req.user.id });
        const account = user.emailAccounts.find(acc => acc._id.toString() === emailId);
        if (!account) {
            req.flash('error_msg', 'Email account not found');
            return res.redirect('/dashboard');
        }
        const emails = await fetchEmails(account);
        res.render('inbox', { emails, email_id: account.email, account });
    } catch (error) {
        console.error('Error fetching emails:', error);
        req.flash('error_msg', 'Error fetching emails');
        res.redirect('/dashboard');
    }
});

app.get('/add-email', supabaseJwtMiddleware, (req, res) => {
    res.render('add-email');
});

app.post('/add-email', supabaseJwtMiddleware, [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    body('imap_server').notEmpty(),
    body('imap_port').isInt({ min: 1, max: 65535 }),
    body('username').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error_msg', 'Please check your input');
        return res.redirect('/add-email');
    }
    try {
        const { email, password, imap_server, imap_port, username, name } = req.body;
        let user = await User.findOne({ supabaseId: req.user.id });
        if (!user) {
            // Create user doc if not exists
            user = new User({
                supabaseId: req.user.id,
                email: req.user.email,
                emailAccounts: []
            });
        }
        const existingAccount = user.emailAccounts.find(acc => acc.email === email);
        if (existingAccount) {
            req.flash('error_msg', 'Email account already exists');
            return res.redirect('/add-email');
        }
        // Test IMAP connection
        try {
            await fetchEmails({
                username,
                password,
                imap_server,
                imap_port: parseInt(imap_port)
            });
        } catch (error) {
            req.flash('error_msg', 'Invalid email credentials or IMAP settings');
            return res.redirect('/add-email');
        }
        user.emailAccounts.push({
            email,
            password,
            imap_server,
            imap_port: parseInt(imap_port),
            username,
            name: name || ''
        });
        await user.save();
        req.flash('success_msg', 'Email account added successfully!');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Add email error:', error);
        req.flash('error_msg', 'Error adding email account');
        res.redirect('/add-email');
    }
});

app.post('/remove-email/:id', supabaseJwtMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ supabaseId: req.user.id });
        user.emailAccounts = user.emailAccounts.filter(account => account._id.toString() !== req.params.id);
        await user.save();
        req.flash('success_msg', 'Email account removed successfully!');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Remove email error:', error);
        req.flash('error_msg', 'Error removing email account');
        res.redirect('/dashboard');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 