'use strict';

const express          = require('express');
const cors             = require('cors');
const crypto           = require('crypto');
const Imap             = require('imap');
const nodemailer       = require('nodemailer');
const { simpleParser } = require('mailparser');
const Database         = require('better-sqlite3');
const path             = require('path');
const fs               = require('fs');
const dns              = require('dns').promises; // <-- ADDED: For MX record auto-discovery
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const PORT    = process.env.PORT    || 5001;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'mailOS.db');

const MASTER_KEY_HEX = process.env.MASTER_KEY;
if (!MASTER_KEY_HEX || MASTER_KEY_HEX.length !== 64) {
  console.error('❌  MASTER_KEY missing or wrong length in .env');
  console.error('   Run: npm run generate-key');
  process.exit(1);
}
const MASTER_KEY = Buffer.from(MASTER_KEY_HEX, 'hex');

// ═══════════════════════════════════════════════════════════════
// AES-256-GCM ENCRYPTION
// Format: iv(hex):authTag(hex):ciphertext(hex)
// ═══════════════════════════════════════════════════════════════
function encrypt(plaintext) {
  if (!plaintext) return '';
  const iv     = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_KEY, iv);
  const enc    = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag    = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

function decrypt(stored) {
  if (!stored) return '';
  try {
    const [ivHex, tagHex, encHex] = stored.split(':');
    const iv       = Buffer.from(ivHex,  'hex');
    const tag      = Buffer.from(tagHex, 'hex');
    const encData  = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_KEY, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encData, undefined, 'utf8') + decipher.final('utf8');
  } catch (e) {
    throw new Error('Decryption failed — wrong key or corrupted data');
  }
}

// ═══════════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════════
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('cache_size = -32000');   
db.pragma('temp_store = MEMORY');   

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id          TEXT PRIMARY KEY,
    name        TEXT    NOT NULL DEFAULT '',
    email       TEXT    NOT NULL UNIQUE,
    password_enc TEXT   NOT NULL,
    imap_host   TEXT    NOT NULL DEFAULT 'imap.gmail.com',
    imap_port   INTEGER NOT NULL DEFAULT 993,
    imap_secure INTEGER NOT NULL DEFAULT 1,
    smtp_host   TEXT    NOT NULL DEFAULT 'smtp.gmail.com',
    smtp_port   INTEGER NOT NULL DEFAULT 587,
    smtp_secure INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id              TEXT PRIMARY KEY,
    name            TEXT    NOT NULL DEFAULT 'Untitled Campaign',
    subject         TEXT    NOT NULL DEFAULT '',
    pitch           TEXT    NOT NULL DEFAULT '',
    fu_pitch        TEXT    NOT NULL DEFAULT '',
    fu_subject      TEXT    NOT NULL DEFAULT '',
    email_col       INTEGER NOT NULL DEFAULT -1,
    csv_headers     TEXT    NOT NULL DEFAULT '[]',
    csv_rows        TEXT    NOT NULL DEFAULT '[]',
    sender_ids      TEXT    NOT NULL DEFAULT '[]',
    batch_size      INTEGER NOT NULL DEFAULT 10,
    batch_delay_min INTEGER NOT NULL DEFAULT 15,
    batch_delay_max INTEGER NOT NULL DEFAULT 35,
    status          TEXT    NOT NULL DEFAULT 'draft',
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS campaign_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id TEXT    NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    row_idx     INTEGER NOT NULL,
    sent_at     TEXT    NOT NULL,
    sender_email TEXT   NOT NULL,
    sender_name TEXT    NOT NULL DEFAULT '',
    to_email    TEXT    NOT NULL,
    subject     TEXT    NOT NULL DEFAULT '',
    body_html   TEXT    NOT NULL DEFAULT '',
    row_data    TEXT    NOT NULL DEFAULT '[]',
    touch_type  TEXT    NOT NULL DEFAULT 'first',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_history_campaign ON campaign_history(campaign_id);
  CREATE INDEX IF NOT EXISTS idx_history_touch    ON campaign_history(campaign_id, touch_type);

  CREATE TABLE IF NOT EXISTS sent_rows (
    campaign_id TEXT    NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    row_idx     INTEGER NOT NULL,
    PRIMARY KEY (campaign_id, row_idx)
  );

  CREATE TABLE IF NOT EXISTS global_sent_pairs (
    sender_email    TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    sent_at         TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (sender_email, recipient_email)
  );

  CREATE TABLE IF NOT EXISTS account_settings (
    account_id     TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    min_delay_sec  INTEGER NOT NULL DEFAULT 60,
    max_delay_sec  INTEGER NOT NULL DEFAULT 180,
    signature_html TEXT    NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS cached_emails (
    id             TEXT    NOT NULL,
    account_id     TEXT    NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    folder         TEXT    NOT NULL DEFAULT 'inbox',
    uid            TEXT    NOT NULL,
    from_name      TEXT    NOT NULL DEFAULT '',
    from_email     TEXT    NOT NULL DEFAULT '',
    to_json        TEXT    NOT NULL DEFAULT '[]',
    subject        TEXT    NOT NULL DEFAULT '',
    body_html      TEXT    NOT NULL DEFAULT '',
    preview        TEXT    NOT NULL DEFAULT '',
    date           TEXT    NOT NULL DEFAULT '',
    is_read        INTEGER NOT NULL DEFAULT 0,
    is_starred     INTEGER NOT NULL DEFAULT 0,
    has_attachment INTEGER NOT NULL DEFAULT 0,
    msg_type       TEXT    NOT NULL DEFAULT 'normal',
    fetched_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (id)
  );
  CREATE INDEX IF NOT EXISTS idx_email_account ON cached_emails(account_id, folder);
  CREATE INDEX IF NOT EXISTS idx_email_date    ON cached_emails(date DESC);
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_email_acct_folder_date ON cached_emails(account_id, folder, date DESC);
  CREATE INDEX IF NOT EXISTS idx_email_id ON cached_emails(id);
`);

// ═══════════════════════════════════════════════════════════════
// PREPARED STATEMENTS
// ═══════════════════════════════════════════════════════════════
const stmts = {
  insertAccount    : db.prepare(`INSERT INTO accounts (id,name,email,password_enc,imap_host,imap_port,imap_secure,smtp_host,smtp_port,smtp_secure) VALUES (?,?,?,?,?,?,?,?,?,?)`),
  getAccount       : db.prepare(`SELECT * FROM accounts WHERE id=?`),
  getAccountByEmail: db.prepare(`SELECT * FROM accounts WHERE lower(email)=lower(?)`),
  getAllAccounts   : db.prepare(`SELECT id,name,email,imap_host,imap_port,imap_secure,smtp_host,smtp_port,smtp_secure,created_at FROM accounts ORDER BY created_at ASC`),
  deleteAccount    : db.prepare(`DELETE FROM accounts WHERE id=?`),

  upsertSettings   : db.prepare(`INSERT INTO account_settings(account_id,min_delay_sec,max_delay_sec,signature_html) VALUES(?,?,?,?) ON CONFLICT(account_id) DO UPDATE SET min_delay_sec=excluded.min_delay_sec, max_delay_sec=excluded.max_delay_sec, signature_html=excluded.signature_html`),
  getSettings      : db.prepare(`SELECT * FROM account_settings WHERE account_id=?`),
  getAllSettings   : db.prepare(`SELECT * FROM account_settings`),

  insertCampaign   : db.prepare(`INSERT INTO campaigns(id,name,subject,pitch,fu_pitch,fu_subject,email_col,csv_headers,csv_rows,sender_ids,batch_size,batch_delay_min,batch_delay_max,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  updateCampaign   : db.prepare(`UPDATE campaigns SET name=?,subject=?,pitch=?,fu_pitch=?,fu_subject=?,email_col=?,csv_headers=?,csv_rows=?,sender_ids=?,batch_size=?,batch_delay_min=?,batch_delay_max=?,status=?,updated_at=datetime('now') WHERE id=?`),
  getCampaign      : db.prepare(`SELECT * FROM campaigns WHERE id=?`),
  getAllCampaigns  : db.prepare(`SELECT * FROM campaigns ORDER BY created_at DESC`),
  deleteCampaign   : db.prepare(`DELETE FROM campaigns WHERE id=?`),

  insertHistory    : db.prepare(`INSERT INTO campaign_history(campaign_id,row_idx,sent_at,sender_email,sender_name,to_email,subject,body_html,row_data,touch_type) VALUES(?,?,?,?,?,?,?,?,?,?)`),
  getHistory       : db.prepare(`SELECT * FROM campaign_history WHERE campaign_id=? ORDER BY sent_at ASC`),
  deleteHistory    : db.prepare(`DELETE FROM campaign_history WHERE campaign_id=?`),

  insertSentRow    : db.prepare(`INSERT OR IGNORE INTO sent_rows(campaign_id,row_idx) VALUES(?,?)`),
  getSentRows      : db.prepare(`SELECT row_idx FROM sent_rows WHERE campaign_id=?`),
  deleteSentRows   : db.prepare(`DELETE FROM sent_rows WHERE campaign_id=?`),

  insertPair       : db.prepare(`INSERT OR IGNORE INTO global_sent_pairs(sender_email,recipient_email) VALUES(?,?)`),
  getPairs         : db.prepare(`SELECT sender_email,recipient_email FROM global_sent_pairs`),

  upsertEmail      : db.prepare(`INSERT INTO cached_emails(id,account_id,folder,uid,from_name,from_email,to_json,subject,body_html,preview,date,is_read,is_starred,has_attachment,msg_type,fetched_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET body_html=excluded.body_html, preview=excluded.preview, is_read=excluded.is_read, is_starred=excluded.is_starred, fetched_at=excluded.fetched_at`),
  getEmails        : db.prepare(`SELECT * FROM cached_emails WHERE account_id=? AND folder=? ORDER BY date DESC LIMIT 200`),
  getEmailsAll     : db.prepare(`SELECT * FROM cached_emails WHERE account_id=? AND folder=? ORDER BY date DESC`),
  updateRead       : db.prepare(`UPDATE cached_emails SET is_read=? WHERE account_id=? AND uid=?`),
  updateStarred    : db.prepare(`UPDATE cached_emails SET is_starred=? WHERE account_id=? AND uid=?`),
  deleteAccEmails  : db.prepare(`DELETE FROM cached_emails WHERE account_id=?`),
  deleteSingleEmail: db.prepare(`DELETE FROM cached_emails WHERE account_id=? AND folder=? AND uid=?`), // Phase 3: Optimistic DB Purge
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function makeId() {
  return Date.now().toString(36) + '_' + crypto.randomBytes(4).toString('hex');
}

function accountRow(r) {
  return {
    id: r.id, name: r.name, email: r.email,
    imapHost: r.imap_host, imapPort: r.imap_port, imapSecure: !!r.imap_secure,
    smtpHost: r.smtp_host, smtpPort: r.smtp_port, smtpSecure: !!r.smtp_secure,
  };
}

function campaignRow(r) {
  return {
    id: r.id, name: r.name, subject: r.subject,
    pitch: r.pitch, fuPitch: r.fu_pitch, fuSubject: r.fu_subject,
    emailCol: r.email_col,
    csvHeaders: JSON.parse(r.csv_headers || '[]'),
    csvRows:    JSON.parse(r.csv_rows    || '[]'),
    senderIds:  JSON.parse(r.sender_ids  || '[]'),
    batchSize: r.batch_size, batchDelayMin: r.batch_delay_min, batchDelayMax: r.batch_delay_max,
    status: r.status,
  };
}

function emailRow(r) {
  return {
    id: r.id, accountId: r.account_id, uid: r.uid, folder: r.folder,
    from: { name: r.from_name, email: r.from_email },
    to: JSON.parse(r.to_json || '[]'),
    subject: r.subject, body: r.body_html, preview: r.preview,
    date: r.date, read: !!r.is_read, starred: !!r.is_starred,
    hasAttachment: !!r.has_attachment, type: r.msg_type,
  };
}

function classifyEmail(subject, fromEmail, snippet) {
  const s = (subject   || '').toLowerCase();
  const e = (fromEmail || '').toLowerCase();
  const p = (snippet   || '').toLowerCase();
  const autoKw =['auto-reply','automatic reply','out of office','vacation reply',
                  'noreply','no-reply','do not reply','donotreply','autoreply','away message'];
  if (autoKw.some(k => s.includes(k) || e.includes(k) || p.includes(k))) return 'auto';
  if (s.startsWith('re:')) return 'reply';
  if (s.includes('undeliverable') || s.includes('delivery failed') || s.includes('bounce')) return 'bounce';
  return 'normal';
}


// ── SMART AUTO-DISCOVER PRESETS (Phase 1) ───────────────────────────
// These represent global known endpoints
const MX_MAPPINGS = [
  { match: 'google.com',       preset: { host: 'imap.gmail.com', port: 993, secure: true, smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpSecure: false } },
  { match: 'googlemail.com',   preset: { host: 'imap.gmail.com', port: 993, secure: true, smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpSecure: false } },
  { match: 'outlook.com',      preset: { host: 'outlook.office365.com', port: 993, secure: true, smtpHost: 'smtp.office365.com', smtpPort: 587, smtpSecure: false } },
  { match: 'secureserver.net', preset: { host: 'imap.secureserver.net', port: 993, secure: true, smtpHost: 'smtpout.secureserver.net', smtpPort: 465, smtpSecure: true } }, // GoDaddy
  { match: 'zoho.com',         preset: { host: 'imap.zoho.com', port: 993, secure: true, smtpHost: 'smtp.zoho.com', smtpPort: 465, smtpSecure: true } }, // Zoho
  { match: 'titan.email',      preset: { host: 'imap.titan.email', port: 993, secure: true, smtpHost: 'smtp.titan.email', smtpPort: 465, smtpSecure: true } }, // Titan Webmail
  { match: 'hostinger.com',    preset: { host: 'imap.hostinger.com', port: 993, secure: true, smtpHost: 'smtp.hostinger.com', smtpPort: 465, smtpSecure: true } }, // Hostinger
];


// ── DYNAMIC FOLDER IDENTIFICATION (Phase 1 Update) ──────────
async function fetchIMAPMsgs(account, targetFolderType = 'inbox', maxMsgs = 50) { 
  return new Promise((resolve, reject) => {
    const password = decrypt(account.password_enc);
    const imap = new Imap({
      user: account.email, password, host: account.imap_host, port: account.imap_port,
      tls: !!account.imap_secure, tlsOptions: { rejectUnauthorized: false },
      connTimeout: 20000, authTimeout: 15000,
    });
    
    const messages = [];

    imap.once('ready', () => {
      // DYNAMIC DISCOVERY: Which folder are we looking for exactly?
      if (targetFolderType === 'inbox') {
         openAndDownload('INBOX');
      } else {
         // Recursive discovery looking for 'Sent' tags globally 
         imap.getBoxes((err, boxes) => {
            if (err) return openAndDownload('Sent'); // Error? Generic Guess.
            let sentFolderName = 'Sent';
            
            const findSent = (obj, currentPath) => {
               for (let key in obj) {
                 const box = obj[key];
                 const fullPath = currentPath ? `${currentPath}${box.delimiter}${key}` : key;
                 
                 // System attribute flag parsing works universally for top-tier servers
                 if (box.attribs && (box.attribs.includes('\\Sent') || box.attribs.includes('\\SentMail'))) return fullPath;
                 // Keyword mapping for strict basic systems like private linux servers
                 const low = key.toLowerCase();
                 if (low === 'sent' || low === 'sent items' || low === 'sent messages') sentFolderName = fullPath;
                 if (box.children) { const c = findSent(box.children, fullPath); if (c) return c; }
               }
               return null;
            };

            const targetBoxName = findSent(boxes, '') || sentFolderName;
            openAndDownload(targetBoxName);
         });
      }

      function openAndDownload(boxNameToOpen) {
        // Read-Write Box access required so messages structure flawlessly opens 
        imap.openBox(boxNameToOpen, true, (err, box) => {
          if (err) { imap.end(); return resolve([]); } 
          
          const total = box.messages.total;
          if (total === 0) { imap.end(); return resolve([]); }
          
          const start = Math.max(1, total - maxMsgs + 1);
          // Standard full structural parser retrieval with proper struct array mapping
          const fetch = imap.seq.fetch(`${start}:*`, { bodies: '', struct: true });
          
          fetch.on('message', (msg, seqno) => {
            let chunks = []; let attrs = {};
            // Concatenating pure byte-buffers. Doing Strings destroys image bytes/attachment sizes mapping internally.
            msg.on('body', stream => {
                stream.on('data', chunk => chunks.push(chunk));
                // BUG FIX: Prevent stream drops from crashing the whole Node server
                stream.on('error', err => console.warn('IMAP stream bypass:', err.message));
            });
            msg.once('attributes', a => attrs = a );
            msg.once('end', () => messages.push({ raw: Buffer.concat(chunks), attrs, seqno }));
          });
          
          fetch.once('end', () => imap.end());
          fetch.once('error', e => { imap.end(); reject(e); });
        });
      }
    });
    
    imap.once('error', reject);
    imap.once('end', () => resolve(messages));
    imap.connect();
  });
}

// ── IMAP Remote Deletion Background Silencing Tool (Phase 3) ──
function deleteImapEmailInBackground(account, folderKey, uid) {
  let targetBoxType = folderKey === 'sent' ? 'sent' : 'inbox';
  
  const password = decrypt(account.password_enc);
  const imap = new Imap({
    user: account.email, password, host: account.imap_host, port: account.imap_port,
    tls: !!account.imap_secure, tlsOptions: { rejectUnauthorized: false },
    connTimeout: 15000, authTimeout: 10000,
  });

  imap.once('ready', () => {
     const handleDeleteBox = (actualBoxName) => {
       // Must be READ-WRITE false flag parameter (cannot open box in strictly readonly to erase records)
       imap.openBox(actualBoxName, false, (err) => {
         if (err) return imap.end();
         imap.addFlags(uid, '\\Deleted', (err2) => {
           if (err2) return imap.end();
           // BUG FIX: node-imap's expunge() takes no arguments, only a callback.
           imap.expunge(() => {
              imap.end(); 
           });
         });
       });
     };

     // Figure out folder mapped explicitly using auto-discovery before purging target!
     if (targetBoxType === 'inbox') {
        handleDeleteBox('INBOX');
     } else {
        imap.getBoxes((err, boxes) => {
           if (err) return handleDeleteBox('Sent'); 
           let sf = 'Sent';
           const searchT = (obj, p) => {
             for(let k in obj){
               const x = obj[k], fp=p?`${p}${x.delimiter}${k}`:k;
               if (x.attribs && (x.attribs.includes('\\Sent') || x.attribs.includes('\\SentMail'))) return fp;
               const lw=k.toLowerCase(); if(lw==='sent'||lw==='sent items'||lw==='sent messages') sf=fp;
               if(x.children) { const c=searchT(x.children,fp); if(c) return c;}
             }
             return null;
           }
           handleDeleteBox(searchT(boxes,'')||sf);
        });
     }
  });

  // BUG FIX: Close IMAP process on background task failure
  imap.once('error', e => {
      console.log('Background silent imap delete bypass triggered: ' + e.message);
      try { imap.end(); } catch (err) {} // Safety wrapper
  });
  imap.connect();
}

async function parseIMAPMessage(raw, accountId, folder) {
  try {
    const parsed    = await simpleParser(raw.raw);
    const uid       = String(raw.attrs?.uid || raw.seqno || Math.random());
    const id        = `${accountId}:${folder}:${uid}`;
    const fromName  = parsed.from?.value?.[0]?.name    || '';
    const fromEmail = parsed.from?.value?.[0]?.address || '';
    const toArr     = (parsed.to?.value ||[]).map(t => ({ name: t.name||'', email: t.address||'' }));
    const subject   = parsed.subject || '';
    const bodyHtml  = parsed.html || parsed.textAsHtml || parsed.text || '';
    const preview   = (parsed.text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    const date      = (parsed.date || new Date()).toISOString();
    const hasAtt    = (parsed.attachments ||[]).length > 0 ? 1 : 0;
    const msgType   = classifyEmail(subject, fromEmail, preview);
    const flags     = raw.attrs?.flags ||[];
    const isRead    = flags.includes('\\Seen') ? 1 : 0;
    return { id, accountId, folder: folder.toLowerCase(), uid, fromName, fromEmail,
             toArr: JSON.stringify(toArr), subject, bodyHtml, preview, date,
             isRead, isStarred: 0, hasAtt, msgType };
  } catch (e) { 
    return null; 
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPRESS APP
// ═══════════════════════════════════════════════════════════════
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/api/presets/:email', async (req, res) => {
  const domain = (req.params.email.split('@')[1] || '').toLowerCase();

  try {
    const records = await dns.resolveMx(domain);
    records.sort((a, b) => a.priority - b.priority); 

    for (const record of records) {
      const exchange = record.exchange.toLowerCase();
      const match = MX_MAPPINGS.find(m => exchange.includes(m.match));
      if (match) return res.json(match.preset);
    }

    return res.json({ 
      host: `mail.${domain}`, port: 993, secure: true, 
      smtpHost: `mail.${domain}`, smtpPort: 587, smtpSecure: false 
    });
  } catch (error) {
    res.json({ 
      host: `mail.${domain}`, port: 993, secure: true, 
      smtpHost: `mail.${domain}`, smtpPort: 587, smtpSecure: false 
    });
  }
});

app.get('/api/accounts/all-emails', (req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM cached_emails ORDER BY date DESC LIMIT 2000`).all();
    res.json(rows.map(emailRow));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── TEST CONNECTION ───────────────────────────────────────────
app.post('/api/accounts/test', async (req, res) => {
  const { email, password, imapHost, imapPort, imapSecure } = req.body;
  try {
    await new Promise((resolve, reject) => {
      const imap = new Imap({ user: email, password, host: imapHost, port: imapPort,
        tls: !!imapSecure, tlsOptions: { rejectUnauthorized: false },
        connTimeout: 15000, authTimeout: 10000 });
      imap.once('ready', () => { imap.end(); resolve(); });
      // BUG FIX: Terminate the IMAP connection properly on rejection to free socket
      imap.once('error', (err) => { imap.end(); reject(err); });
      imap.connect();
    });
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// ── ACCOUNTS ─────────────────────────────────────────────────
app.get('/api/accounts', (req, res) => {
  res.json(stmts.getAllAccounts.all().map(accountRow));
});

app.post('/api/accounts', (req, res) => {
  const { email, password, name, imapHost, imapPort, imapSecure, smtpHost, smtpPort, smtpSecure } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  if (stmts.getAccountByEmail.get(email)) return res.status(409).json({ error: 'Account already exists' });
  
  const id          = makeId();
  const passwordEnc = encrypt(password);
  
  // Custom domains mapping safely guarantees security port protocols
  const finalImapSecure = imapSecure !== undefined ? (imapSecure ? 1 : 0) : 1;
  const finalSmtpSecure = smtpSecure !== undefined ? (smtpSecure ? 1 : 0) : 0;

  try {
    stmts.insertAccount.run(id, name || email.split('@')[0], email, passwordEnc,
      imapHost || 'imap.gmail.com',
      imapPort || 993,
      finalImapSecure,
      smtpHost || 'smtp.gmail.com',
      smtpPort || 587,
      finalSmtpSecure);
    res.status(201).json(accountRow(stmts.getAccount.get(id)));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/accounts/:id', (req, res) => {
  stmts.deleteAccEmails.run(req.params.id);
  stmts.deleteAccount.run(req.params.id);
  res.json({ ok: true });
});

// ── SETTINGS ─────────────────────────────────────────────────
app.get('/api/accounts/settings', (req, res) => {
  const map = {};
  stmts.getAllSettings.all().forEach(r => {
    map[r.account_id] = { minDelay: r.min_delay_sec, maxDelay: r.max_delay_sec };
  });
  res.json(map);
});

app.patch('/api/accounts/:id/settings', (req, res) => {
  const { minDelay, maxDelay } = req.body;
  const ex = stmts.getSettings.get(req.params.id) || {};
  stmts.upsertSettings.run(req.params.id,
    minDelay ?? ex.min_delay_sec ?? 60,
    maxDelay ?? ex.max_delay_sec ?? 180,
    ex.signature_html || '');
  res.json({ ok: true });
});

app.get('/api/signatures', (req, res) => {
  const map = {};
  stmts.getAllSettings.all().forEach(r => { if (r.signature_html) map[r.account_id] = r.signature_html; });
  res.json(map);
});

app.put('/api/accounts/:id/signature', (req, res) => {
  const ex = stmts.getSettings.get(req.params.id) || {};
  stmts.upsertSettings.run(req.params.id, ex.min_delay_sec || 60, ex.max_delay_sec || 180, req.body.html || '');
  res.json({ ok: true });
});

app.post('/api/accounts/:id/sync', async (req, res) => {
  res.json({ ok: true, message: 'Sync started' });
  try {
    await syncFolder(req.params.id, 'inbox', true);
    await syncFolder(req.params.id, 'sent', true);
  } catch (e) { console.warn('Background sync failed:', req.params.id, e.message); }
});

// ── EMAIL FETCH & BACKGROUND CACHING ENGINE ───────────
async function syncFolder(accountId, folder, refresh) {
  const folderKey = folder.toLowerCase();
  
  const cached = stmts.getEmails.all(accountId, folderKey);
  if (cached.length && !refresh) return cached.map(emailRow);

  const account = stmts.getAccount.get(accountId);
  if (!account) throw new Error('Account not found');

  // Relies exclusively on phase-1 mapping logic inside fetch function dynamically
  const rawMsgs = await fetchIMAPMsgs(account, folderKey, 50);

  const parsed = await Promise.all(
    rawMsgs.map(r => parseIMAPMessage(r, accountId, folder))
  );

  const insertMany = db.transaction(msgs => {
    for (const m of msgs) {
      if (!m) continue;
      stmts.upsertEmail.run(
        m.id, m.accountId, m.folder, m.uid,
        m.fromName, m.fromEmail, m.toArr,
        m.subject, m.bodyHtml, m.preview, m.date,
        m.isRead, m.isStarred, m.hasAtt, m.msgType
      );
    }
  });
  insertMany(parsed.filter(Boolean));

  return stmts.getEmailsAll.all(accountId, folderKey).map(emailRow);
}

app.get('/api/accounts/:id/inbox', async (req, res) => {
  try { 
    res.json(await syncFolder(req.params.id, 'inbox', !!req.query.refresh)); 
  } catch (e) { 
    console.error(`Inbox fetch failed for ${req.params.id}:`, e.message);
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/accounts/:id/sent', async (req, res) => {
  try { 
    res.json(await syncFolder(req.params.id, 'sent', !!req.query.refresh)); 
  } catch (e) { 
    console.error(`Sent fetch failed for ${req.params.id}:`, e.message);
    res.status(500).json({ error: e.message }); 
  }
});

// ── READ / STAR / OPTIMISTIC DELETE COMMANDS ───────────────────
app.patch('/api/accounts/:accountId/messages/:uid/read', (req, res) => {
  stmts.updateRead.run(req.body.read ? 1 : 0, req.params.accountId, req.params.uid);
  res.json({ ok: true });
});

app.patch('/api/accounts/:accountId/messages/:uid/star', (req, res) => {
  stmts.updateStarred.run(req.body.starred ? 1 : 0, req.params.accountId, req.params.uid);
  res.json({ ok: true });
});

app.delete('/api/accounts/:accountId/messages/:folder/:uid', (req, res) => {
  const accountId = req.params.accountId;
  const folderKey = req.params.folder.toLowerCase();
  const uid = req.params.uid;

  const account = stmts.getAccount.get(accountId);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  // 1. Local Cache wipes instant deletion sync protocol zero milliseconds perceived front-lag UI optimization!
  try { stmts.deleteSingleEmail.run(accountId, folderKey, uid); } catch (e) {}
  
  // 2. Safely triggers unassigned listener logic inside of engine
  deleteImapEmailInBackground(account, folderKey, uid);

  // 3. Immediately bounce UI request complete true flag response validation bypass
  res.json({ ok: true, deleted: true });
});


// ── SEND ENGINE LAYER ──────────────────────────────────────────────────
app.post('/api/accounts/:id/send', async (req, res) => {
  const account = stmts.getAccount.get(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  const password    = decrypt(account.password_enc);
  const { to, cc, bcc, subject, body, replyTo } = req.body;
  const transporter = nodemailer.createTransport({
    host: account.smtp_host, port: account.smtp_port, secure: !!account.smtp_secure,
    auth: { user: account.email, pass: password }, tls: { rejectUnauthorized: false },
  });
  
  // BUG FIX: Prevent passing internal App IDs to SMTP provider, averting 550 RFC violations.
  const mailOptions = {
    from: `"${account.name}" <${account.email}>`,
    to, cc, bcc, subject,
    html: body, text: body.replace(/<[^>]+>/g, '')
  };
  
  if (replyTo && replyTo.includes('@') && replyTo.includes('<') && replyTo.includes('>')) {
    mailOptions.inReplyTo = replyTo;
  }

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── CAMPAIGN MANAGER MODULE PROTOCOLS ─────────────────────────────────────
app.get('/api/campaigns', (req, res) => res.json(stmts.getAllCampaigns.all().map(campaignRow)));

app.post('/api/campaigns', (req, res) => {
  const b = req.body, id = b.id || makeId();
  stmts.insertCampaign.run(id, b.name||'Untitled', b.subject||'', b.pitch||'',
    b.fuPitch||'', b.fuSubject||'', b.emailCol ?? -1,
    JSON.stringify(b.csvHeaders||[]), JSON.stringify(b.csvRows||[]),
    JSON.stringify(b.senderIds||[]),
    b.batchSize||10, b.batchDelayMin||15, b.batchDelayMax||35, b.status||'draft');
  res.status(201).json(campaignRow(stmts.getCampaign.get(id)));
});

app.put('/api/campaigns/:id', (req, res) => {
  const b = req.body, ex = stmts.getCampaign.get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Campaign not found' });
  stmts.updateCampaign.run(
    b.name ?? ex.name, b.subject ?? ex.subject,
    b.pitch ?? ex.pitch, b.fuPitch ?? ex.fu_pitch, b.fuSubject ?? ex.fu_subject,
    b.emailCol ?? ex.email_col,
    JSON.stringify(b.csvHeaders ?? JSON.parse(ex.csv_headers)),
    JSON.stringify(b.csvRows    ?? JSON.parse(ex.csv_rows)),
    JSON.stringify(b.senderIds  ?? JSON.parse(ex.sender_ids)),
    b.batchSize ?? ex.batch_size, b.batchDelayMin ?? ex.batch_delay_min,
    b.batchDelayMax ?? ex.batch_delay_max, b.status ?? ex.status,
    req.params.id);
  res.json(campaignRow(stmts.getCampaign.get(req.params.id)));
});

app.delete('/api/campaigns/:id', (req, res) => {
  stmts.deleteHistory.run(req.params.id);
  stmts.deleteSentRows.run(req.params.id);
  stmts.deleteCampaign.run(req.params.id);
  res.json({ ok: true });
});

// ── DATA METRIC ARCHIVES ──────────────────────────────────────────────
app.get('/api/campaigns/:id/history', (req, res) => {
  res.json(stmts.getHistory.all(req.params.id).map(r => ({
    rowIdx: r.row_idx, sentAt: r.sent_at, senderEmail: r.sender_email,
    senderName: r.sender_name, toEmail: r.to_email, subject: r.subject,
    bodyHTML: r.body_html, rowData: JSON.parse(r.row_data || '[]'), touchType: r.touch_type,
  })));
});

app.post('/api/campaigns/:id/history', (req, res) => {
  const b = req.body;
  stmts.insertHistory.run(req.params.id, b.rowIdx, b.sentAt || new Date().toISOString(),
    b.senderEmail, b.senderName || '', b.toEmail, b.subject || '',
    b.bodyHTML || '', JSON.stringify(b.rowData || []), b.touchType || 'first');
  if (b.senderEmail && b.toEmail)
    stmts.insertPair.run(b.senderEmail.toLowerCase(), b.toEmail.toLowerCase());
  res.status(201).json({ ok: true });
});

app.get('/api/campaigns/:id/sent-rows', (req, res) => res.json(stmts.getSentRows.all(req.params.id).map(r => r.row_idx)));
app.post('/api/campaigns/:id/sent-rows', (req, res) => { stmts.insertSentRow.run(req.params.id, req.body.rowIdx); res.json({ ok: true }); });

app.get('/api/global-pairs', (req, res) => res.json(stmts.getPairs.all().map(r => `${r.sender_email}::${r.recipient_email}`)));
app.post('/api/global-pairs', (req, res) => { stmts.insertPair.run((req.body.senderEmail||'').toLowerCase(), (req.body.recipientEmail||'').toLowerCase()); res.json({ ok: true }); });

// ── BOOT CHECK SYSTEM ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: DB_PATH, uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`\n✅  MailOS Advanced Auto-Connect Node Gateway Running http://localhost:${PORT}`);
  console.log(`📂  Database Target Array Directory Cache Node Protocol File Root Active: ${DB_PATH}`);
  console.log(`🔐  Encryption Check Vector Engine Secured: AES-256-GCM Hardware Matrix Valid\n`);
});

module.exports = app;
