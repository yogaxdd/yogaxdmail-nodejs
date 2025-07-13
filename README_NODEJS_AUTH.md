# YogaxD Email Inbox Viewer - Node.js dengan Autentikasi

Aplikasi web untuk melihat inbox email dengan sistem autentikasi user. Setiap user dapat menambahkan dan mengelola email accounts mereka sendiri.

## ✨ Fitur Utama

- 🔐 **Sistem Autentikasi** - Register, Login, Logout
- 👤 **User Management** - Setiap user punya email accounts sendiri
- 📧 **Multi Email Support** - Tambah multiple email accounts
- 🔄 **Real-time Refresh** - Update inbox secara real-time
- 🌓 **Dark Mode** - Toggle dark/light mode
- 📱 **Responsive Design** - Works on mobile & desktop
- 🔒 **Secure** - Password hashing, session management
- 🗄️ **Database** - MongoDB untuk menyimpan data user dan email accounts

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB dengan Mongoose
- **Authentication**: bcryptjs, express-session
- **Email**: IMAP protocol (imap, mailparser)
- **Template Engine**: EJS
- **Validation**: express-validator
- **Deployment**: Vercel

## 🚀 Instalasi Lokal

### 1. Prerequisites
- Node.js (v18 atau lebih baru)
- MongoDB (local atau MongoDB Atlas)
- Git

### 2. Clone & Setup
```bash
git clone <repository-url>
cd YogaxD-Smtp-Nodejs
npm install
```

### 3. Environment Variables
Buat file `.env` di root directory:
```env
MONGODB_URI=mongodb://localhost:27017/yogaxd-email
SESSION_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

### 4. Database Setup
- **Local MongoDB**: Pastikan MongoDB berjalan di localhost:27017
- **MongoDB Atlas**: Gunakan connection string dari MongoDB Atlas

### 5. Jalankan Aplikasi
```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Akses Aplikasi
- Buka browser dan kunjungi `http://localhost:3000`

## 🌐 Deployment ke Vercel

### 1. Setup MongoDB Atlas (Gratis)
1. Daftar di [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Buat cluster baru (gratis tier)
3. Buat database user
4. Dapatkan connection string

### 2. Deploy ke Vercel

#### Metode A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add SESSION_SECRET
```

#### Metode B: GitHub Integration
1. Push code ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import project dari GitHub
4. Set environment variables di Vercel dashboard:
   - `MONGODB_URI`: MongoDB connection string
   - `SESSION_SECRET`: Random secret key

### 3. Environment Variables di Vercel
Di Vercel dashboard, tambahkan environment variables:
- `MONGODB_URI`: `mongodb+srv://username:password@cluster.mongodb.net/yogaxd-email`
- `SESSION_SECRET`: `your-super-secret-key-here`

## 📧 Setup Email Accounts

### Gmail Setup
1. **Aktifkan 2-Factor Authentication**
   - Buka [Google Account Settings](https://myaccount.google.com/security)
   - Aktifkan 2-Step Verification

2. **Generate App Password**
   - Buka [App Passwords](https://myaccount.google.com/apppasswords)
   - Select app: "Mail"
   - Select device: "Other"
   - Generate password

3. **Tambahkan di Aplikasi**
   - Email: `your-email@gmail.com`
   - Username: `your-email@gmail.com`
   - Password: `App Password` (bukan password biasa)
   - IMAP Server: `imap.gmail.com`
   - IMAP Port: `993`

### Email Provider Lainnya
- **Outlook**: `outlook.office365.com:993`
- **Yahoo**: `imap.mail.yahoo.com:993`
- **Zoho**: `imap.zoho.com:993`

## 📁 Struktur Project

```
├── index.js                 # Main application
├── package.json            # Dependencies
├── vercel.json            # Vercel configuration
├── .env                   # Environment variables (local)
├── .gitignore            # Git ignore rules
├── models/
│   └── User.js           # User model dengan email accounts
├── middleware/
│   └── auth.js           # Authentication middleware
├── views/                # EJS templates
│   ├── landing.ejs       # Landing page
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Register page
│   ├── dashboard.ejs     # User dashboard
│   ├── add-email.ejs     # Add email account
│   └── inbox.ejs         # Email inbox viewer
└── README files
```

## 🔐 Keamanan

### Fitur Keamanan
- ✅ Password hashing dengan bcryptjs
- ✅ Session management dengan express-session
- ✅ Input validation dengan express-validator
- ✅ CSRF protection (built-in dengan session)
- ✅ Secure cookies di production
- ✅ MongoDB injection protection (Mongoose)

### Best Practices
- 🔒 Gunakan App Password untuk Gmail
- 🔒 Jangan share session secret
- 🔒 Gunakan HTTPS di production
- 🔒 Regular password updates
- 🔒 Monitor login attempts

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Purple gradient theme
- **Typography**: Segoe UI, Roboto, Arial
- **Components**: Cards, buttons, forms, modals
- **Animations**: Smooth transitions, hover effects
- **Responsive**: Mobile-first design

### User Experience
- 🎯 Intuitive navigation
- 📱 Mobile responsive
- ⚡ Fast loading
- 🔄 Real-time updates
- 🌓 Dark mode support
- 💬 Flash messages
- ✅ Form validation

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: 
- Cek MongoDB URI di environment variables
- Pastikan MongoDB Atlas IP whitelist sudah benar
- Cek username/password di connection string

#### IMAP Connection Error
```
Error: Invalid email credentials or IMAP settings
```
**Solution**:
- Pastikan menggunakan App Password untuk Gmail
- Cek IMAP server dan port
- Pastikan 2FA sudah diaktifkan

#### Vercel Deployment Issues
```
Error: Function timeout
```
**Solution**:
- Cek `vercel.json` maxDuration setting
- Optimize database queries
- Use connection pooling

### Debug Mode
Untuk debugging, tambahkan di `.env`:
```env
DEBUG=app:*
NODE_ENV=development
```

## 📈 Performance

### Optimizations
- ✅ Connection pooling untuk MongoDB
- ✅ Email fetching limit (20 emails)
- ✅ Lazy loading untuk email content
- ✅ Caching untuk session data
- ✅ Compressed responses

### Monitoring
- MongoDB connection status
- Email fetch performance
- User session management
- Error logging

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Monitor MongoDB performance
- Check Vercel function logs
- Backup user data
- Security audits

### Version Control
```bash
git add .
git commit -m "Update: description"
git push origin main
```

## 📞 Support

### Getting Help
1. Check troubleshooting section
2. Review error logs
3. Check MongoDB Atlas status
4. Verify environment variables

### Contributing
1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - silakan gunakan sesuai kebutuhan.

---

**Note**: Aplikasi ini menggunakan MongoDB untuk menyimpan data user dan email accounts. Pastikan untuk menggunakan MongoDB Atlas atau setup MongoDB local dengan benar. 