# MailOS — Setup Guide

## Folder Structure

```
C:\email-app\
├── client\
│   ├── public\
│   │   └── index.html
│   ├── src\
│   │   ├── App.js       ← Your main UI file
│   │   └── index.js
│   └── package.json
├── server.js            ← Backend
├── package.json         ← Backend dependencies
├── .env                 ← Your secret key (auto-generated)
└── mailOS.db            ← Database (auto-created on first run)
```

---

## First Time Setup

### Step 1 — Install backend dependencies
```cmd
cd C:\email-app
npm install
```

### Step 2 — Generate encryption key + .env file
```cmd
npm run generate-key
```

### Step 3 — Install client dependencies
```cmd
cd C:\email-app\client
npm install
```

---

## Running the App (Every Time)

Open **2 terminals**:

**Terminal 1 — Backend:**
```cmd
cd C:\email-app
node server.js
```

**Terminal 2 — Frontend:**
```cmd
cd C:\email-app\client
npm start
```

Open browser at: http://localhost:3000

---

## Building Desktop App (When Ready)

Copy all files into the mailos-desktop project structure,
then run: `npm run electron:build:win`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/accounts | List accounts |
| POST | /api/accounts | Add account |
| DELETE | /api/accounts/:id | Remove account |
| POST | /api/accounts/test | Test IMAP connection |
| GET | /api/accounts/:id/inbox | Fetch inbox |
| GET | /api/accounts/:id/sent | Fetch sent |
| POST | /api/accounts/:id/send | Send email |
| GET | /api/campaigns | List campaigns |
| POST | /api/campaigns | Create campaign |
| PUT | /api/campaigns/:id | Update campaign |
| DELETE | /api/campaigns/:id | Delete campaign |
| GET | /api/campaigns/:id/history | Send history |
| POST | /api/campaigns/:id/history | Record sent email |
| GET | /api/global-pairs | All sender::recipient pairs |
| GET | /api/health | Server health check |
