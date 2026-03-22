# MailOS — Desktop Email Client & Campaign Manager

A full-stack desktop email client and bulk campaign manager built with 
Electron 30 + React 18 + Node.js + SQLite — the same architecture used 
by VS Code, Slack, and Notion. Packaged as a Windows .exe installer.

---

## What It Does

MailOS lets you manage unlimited email accounts in one place, read and 
send emails with a rich HTML editor, and run bulk email campaigns with 
CSV import, personalization, follow-up automation, and real-time tracking.

---

## Core Features

### 📬 Multi-Account Inbox
- Connect up to 500 email accounts simultaneously
- Supports Gmail, Outlook, Yahoo, iCloud, Zoho, Fastmail, ProtonMail,
  GMX, Yandex and any IMAP/SMTP provider
- Auto-detects server settings for 25+ email providers instantly
- Unified inbox — all accounts in one view
- Per-account colored avatars and folder trees

### 🧠 Smart Email Classification
- Auto-detects and labels: Replies (RE:), Bounced, Automated, Personal
- Bounce detection by sender: mailer-daemon, postmaster, Mail Delivery 
  Subsystem, delivery subsystem
- Bounce detection by subject: Delivery Status Notification, 
  Undeliverable, Delivery Failure, Message Not Delivered
- Auto detection: Out of Office, OOO, Vacation Reply, Auto-Reply, 
  No-Reply, On Leave, Currently Unavailable, Away Message
- Filter emails by type: All, RE, Auto, Bounce, Personal

### ✏️ Rich HTML Email Composer
- Full formatting toolbar: Bold, Italic, Underline, Strikethrough, 
  Superscript, Subscript
- Font family selector (15 fonts), font size selector (6px to 96px)
- Text color picker with live preview in toolbar
- Alignment: Left, Center, Right
- Lists: Bullet, Numbered, Indent, Outdent
- Insert: Links, Images, Horizontal Rules
- Undo/Redo with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- Right-click context menu with Cut, Copy, Paste, Select All, formatting
- Toolbar reflects actual formatting of text at cursor position
- CC and BCC support

### 📢 Email Campaign Manager
- Upload recipient CSV — any columns become personalization placeholders
- Placeholder format: {{Column Name}} — auto-replaced in subject + pitch
- Rich HTML pitch editor with full formatting
- Subject line with placeholder support
- Select multiple sender accounts per campaign
- Batch size control, min/max wait between batches (minutes)
- Per-account cool-down delay (min–max minutes between each email)
- Real-time send progress: batch number, sent count, schedule log
- Pause / Resume / Stop controls mid-campaign
- Global deduplication — never sends same sender→recipient twice
- Sender auto-blocking on: Daily Limit, Auth Failed, Browser Login 
  Required, Invalid Credentials, Rate Limited
- Resumes from where it stopped if interrupted

### 🔁 Follow-up Automation
- Write follow-up pitch separately from original campaign
- Sends follow-up to everyone from original campaign's send history
- Includes full email thread (From, Sent, To, Subject) like real Outlook
- Separate follow-up subject line with placeholder support
- Same batch/delay controls as main campaign
- Pause / Resume / Stop follow-up independently

### ✍️ Per-Account Signatures
- HTML signature editor per account (Bold, Italic, Font, Size, Color)
- Insert as {{Account Signature}} placeholder in pitch
- Live preview in settings panel

### 📤 Export Options
- Export any email as .EML (opens in Outlook / Apple Mail)
- Export visible emails as CSV (Date, From, To, Subject, Type, Preview)
- Export folder as .MBOX (compatible with Thunderbird, Apple Mail)
- Right-click on any email for quick export menu

### 🔒 Security
- AES-256-GCM encryption for all stored credentials
- OS Keychain via Electron safeStorage (same as 1Password, Chrome)
- Passwords never stored in plain text
- Auto-generated encryption key stored securely per machine
- Single instance lock — only one window can run at a time

### 🖥️ Desktop App
- Packaged as Windows .exe installer (NSIS)
- System tray icon with Open / Quit options
- Minimize to tray on close
- Auto-updater (electron-updater)
- Min window: 900×600, default: 1400×900
- Collapsible sidebar with smooth animation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JavaScript (JSX) |
| Desktop | Electron 30 |
| Backend | Node.js, Express.js |
| Database | SQLite (better-sqlite3) |
| Email Send | Nodemailer (SMTP/SMTP_SSL) |
| Email Receive | IMAP (node-imap) |
| Email Parse | mailparser |
| Encryption | AES-256-GCM, Electron safeStorage |
| Packaging | electron-builder (NSIS) |
| UI | Pure React inline styles, no CSS framework |

---

## Architecture
```
MailOS
├── Electron (main process)
│   ├── Manages app lifecycle, tray, window
│   ├── Generates & stores encryption key via OS Keychain
│   └── Spawns Node.js backend as child process
│
├── Node.js Backend (Express REST API on port 5001)
│   ├── /api/accounts — CRUD for email accounts
│   ├── /api/accounts/:id/inbox — IMAP email fetch
│   ├── /api/accounts/:id/sent — Sent folder fetch
│   ├── /api/accounts/:id/send — SMTP send
│   ├── /api/accounts/:id/messages/:uid/read — Mark read
│   ├── /api/accounts/:id/messages/:uid/star — Star email
│   └── /api/health — Health check
│
└── React Frontend (Electron renderer)
    ├── Unified inbox with virtual scroll (renders only visible rows)
    ├── Campaign manager with CSV parser
    ├── Rich HTML editor (contentEditable + execCommand)
    └── All state managed with React hooks (no Redux)
```

---

## Key Technical Decisions

- **Virtual scroll list** — only renders visible email rows using 
  ResizeObserver + requestAnimationFrame for smooth performance with 
  thousands of emails
- **No CSS framework** — entire UI built with inline React styles for 
  zero bundle bloat
- **contentEditable rich editor** — built from scratch without any 
  library, with full toolbar state sync via DOM walking
- **Forked backend** — Node.js server runs as a child_process fork, 
  not embedded in Electron, so it can be updated independently
- **localStorage campaign state** — campaign drafts, send history, 
  and global pairs stored in localStorage for persistence without 
  database complexity

---

## Installation

### Download
Get the latest installer from 
[GitHub Releases](https://github.com/inbarasan25y-coder/mailos-desktop/releases)

### From Source
```bash
git clone https://github.com/inbarasan25y-coder/mailos-desktop.git
cd mailos-desktop
npm install
npm start          # Development mode
npm run build      # Build Windows .exe
```

### Requirements
- Windows 10 / 11 (64-bit)
- Internet connection
- Gmail App Password or equivalent for each account

---

## Gmail / Outlook Setup

**Gmail:**
1. Go to myaccount.google.com → Security → 2-Step Verification → On
2. Then → App Passwords → Generate → Copy 16-character password
3. Use that password in MailOS (not your Gmail password)

**Outlook / Hotmail:**
1. Go to account.microsoft.com → Security → App Passwords
2. Create new app password → Copy → Use in MailOS

---

## Author

**Inbarasan A** — Self-taught full-stack developer, Bangalore
- GitHub: [@inbarasan25y-coder](https://github.com/inbarasan25y-coder)
- LinkedIn: [inbarasan-a](https://www.linkedin.com/in/inbarasan-a-686627242/)
- Email: inbarasan25y@gmail.com

---

## License
MIT License