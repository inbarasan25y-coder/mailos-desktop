# MailOS — Desktop Email Client & Campaign Manager

> A professional desktop email client and bulk campaign manager built with React, Node.js, Electron and SQLite.

---

## Features

- **Multi-Account Support** — Gmail, Outlook, Yahoo, iCloud, Zoho, FastMail and any IMAP/SMTP provider
- **Unified Inbox** — View all accounts in one place with smart filtering
- **Email Campaigns** — Bulk email sending with CSV import and personalization
- **Follow-up Automation** — Automatically send follow-up emails to campaign recipients
- **Real-time Send Tracking** — Live progress with batch controls (pause, resume, stop)
- **Rich Text Editor** — Full formatting toolbar with fonts, sizes, colors, bold, italic
- **Smart Email Classification** — Auto-detects replies, bounces, automated emails
- **Email Signatures** — Per-account HTML signatures with live preview
- **Export Options** — Export emails as CSV, EML or MBOX format
- **Desktop App** — Packaged as a Windows installer (.exe) using Electron

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JavaScript |
| Backend | Node.js, Express |
| Database | SQLite (better-sqlite3) |
| Desktop | Electron 30 |
| Email | Nodemailer, IMAP |
| Security | AES-256 encryption, OS Keychain |

---

## Installation

### Prerequisites
- Node.js 18+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/inbarasan25y-coder/mailos-desktop.git
cd mailos-desktop

# Install dependencies
npm install

# Start in development mode
npm start
```

### Build Desktop App (Windows)

```bash
npm run build
```

Installer will be created at `dist/MailOS Setup 1.0.0.exe`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/accounts | List all accounts |
| POST | /api/accounts | Add new account |
| DELETE | /api/accounts/:id | Remove account |
| POST | /api/accounts/test | Test IMAP connection |
| GET | /api/accounts/:id/inbox | Fetch inbox emails |
| GET | /api/accounts/:id/sent | Fetch sent emails |
| POST | /api/accounts/:id/send | Send email |
| GET | /api/health | Server health check |

---

## Project Structure

```
mailos-desktop/
├── electron/
│   ├── electron.js      ← Electron main process
│   └── preload.js       ← Electron preload script
├── src/
│   ├── app.jsx          ← React frontend (main UI)
│   └── index.js         ← React entry point
├── public/
│   └── index.html       ← HTML template
├── server.js            ← Node.js backend
├── package.json         ← Dependencies & build config
└── .env                 ← Auto-generated encryption key
```

---

## Author

**Inbarasan A**
- GitHub: [@inbarasan25y-coder](https://github.com/inbarasan25y-coder)
- LinkedIn: [inbarasan-a](https://www.linkedin.com/in/inbarasan-a-686627242/)

---

## License

MIT License — feel free to use and modify.