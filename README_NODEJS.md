# YogaxD Email Inbox Viewer - Node.js Version

Aplikasi web untuk melihat inbox email menggunakan Node.js dan Express.js. Aplikasi ini dapat di-deploy ke Vercel.

## Fitur

- 📧 Melihat inbox dari multiple email accounts
- 🔄 Refresh inbox secara real-time
- 🌓 Dark mode toggle
- 📱 Responsive design
- 🔒 Secure IMAP connection

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Email**: IMAP protocol dengan library `imap` dan `mailparser`
- **Template Engine**: EJS
- **Deployment**: Vercel

## Instalasi Lokal

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd YogaxD-Smtp-Nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi email**
   - Edit file `email_config.json` dengan kredensial email Anda
   - Pastikan menggunakan App Password untuk Gmail

4. **Jalankan aplikasi**
   ```bash
   npm start
   ```
   
   Atau untuk development dengan auto-reload:
   ```bash
   npm run dev
   ```

5. **Akses aplikasi**
   - Buka browser dan kunjungi `http://localhost:3000`

## Deployment ke Vercel

### Metode 1: Menggunakan Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

### Metode 2: Menggunakan GitHub Integration

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub
   - Klik "New Project"
   - Import repository dari GitHub
   - Vercel akan otomatis mendeteksi konfigurasi Node.js

### Metode 3: Drag & Drop

1. **Zip project folder**
2. **Upload ke Vercel Dashboard**
   - Buka [vercel.com](https://vercel.com)
   - Drag & drop file zip ke dashboard

## Konfigurasi Email

File `email_config.json` berisi konfigurasi untuk setiap email account:

```json
[
  {
    "email": "your-email@gmail.com",
    "imap_server": "imap.gmail.com",
    "imap_port": 993,
    "username": "your-email@gmail.com",
    "password": "your-app-password"
  }
]
```

### Setup Gmail App Password

1. Aktifkan 2-Factor Authentication di Google Account
2. Buka [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Generate App Password untuk aplikasi ini
4. Gunakan App Password sebagai password di `email_config.json`

## Struktur Project

```
├── index.js              # Main application file
├── package.json          # Dependencies dan scripts
├── vercel.json          # Vercel configuration
├── email_config.json    # Email accounts configuration
├── views/               # EJS templates
│   ├── index.ejs        # Home page template
│   └── inbox.ejs        # Inbox page template
└── README_NODEJS.md     # This file
```

## Environment Variables (Opsional)

Untuk production, Anda bisa menggunakan environment variables:

- `PORT`: Port untuk menjalankan server (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Troubleshooting

### Error IMAP Connection
- Pastikan App Password sudah benar
- Cek apakah 2FA sudah diaktifkan
- Pastikan IMAP sudah diaktifkan di Gmail settings

### Error di Vercel
- Pastikan semua dependencies ada di `package.json`
- Cek log di Vercel dashboard
- Pastikan `vercel.json` sudah benar

### Performance Issues
- Aplikasi mengambil 20 email terakhir untuk performa optimal
- Gunakan refresh manual jika perlu update data

## Keamanan

⚠️ **Peringatan Keamanan:**
- Jangan commit `email_config.json` ke repository public
- Gunakan environment variables untuk production
- App Password lebih aman daripada password biasa
- Pertimbangkan menggunakan OAuth2 untuk autentikasi yang lebih aman

## Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository atau hubungi developer.

## License

MIT License - silakan gunakan sesuai kebutuhan. 