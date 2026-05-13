'use strict';

const express          = require('express');
const cors             = require('cors');
const crypto           = require('crypto');
const net              = require('net');
const Imap             = require('imap');
const nodemailer       = require('nodemailer');
const { simpleParser } = require('mailparser');
const Database         = require('better-sqlite3');
const path             = require('path');
const fs               = require('fs');
const dns              = require('dns').promises;
require('dotenv').config();

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5001;
const TRACK_OPENS = process.env.TRACK_OPENS === 'true'; // set TRACK_OPENS=true to enable
const TRACK_BASE_URL = process.env.TRACK_BASE_URL || `http://localhost:${PORT}`;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'mailOS.db');
const MAX_BODY_BYTES = 4 * 1024 * 1024; // 4MB cap per email body

const MASTER_KEY_HEX = process.env.MASTER_KEY;
if (!MASTER_KEY_HEX || MASTER_KEY_HEX.length !== 64) {
  console.error('MASTER_KEY missing or wrong length in .env — run: npm run generate-key');
  process.exit(1);
}
const MASTER_KEY = Buffer.from(MASTER_KEY_HEX, 'hex');

// ═══════════════════════════════════════════════════════════════
// AES-256-GCM — versioned envelope for key rotation support
// ═══════════════════════════════════════════════════════════════
const ENC_VERSION = 'v1';

function encrypt(plaintext) {
  if (!plaintext) return '';
  const iv     = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_KEY, iv);
  const enc    = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag    = cipher.getAuthTag();
  return `${ENC_VERSION}:${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

function decrypt(stored) {
  if (!stored) return '';
  try {
    const parts = stored.split(':');
    // Handle old format (no version prefix)
    const [ivHex, tagHex, encHex] = parts.length === 4 ? parts.slice(1) : parts;
    const iv       = Buffer.from(ivHex,  'hex');
    const tag      = Buffer.from(tagHex, 'hex');
    const encData  = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_KEY, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encData, undefined, 'utf8') + decipher.final('utf8');
  } catch {
    throw new Error('Decryption failed — wrong key or corrupted data');
  }
}

// ═══════════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════════
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('cache_size = -64000');    // 64MB page cache
db.pragma('temp_store = MEMORY');
db.pragma('busy_timeout = 10000');
db.pragma('synchronous = NORMAL');   // faster than FULL, safer than OFF
db.pragma('mmap_size = 268435456');  // 256MB memory-mapped I/O

process.on('uncaughtException',  e => { /* silent — never crash */ });
process.on('unhandledRejection', e => { /* silent */ });
process.on('SIGTERM', () => { try { db.close(); } catch(_) {} process.exit(0); });
process.on('SIGINT',  () => { try { db.close(); } catch(_) {} process.exit(0); });

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id           TEXT PRIMARY KEY,
    name         TEXT    NOT NULL DEFAULT '',
    email        TEXT    NOT NULL UNIQUE,
    password_enc TEXT    NOT NULL,
    imap_host    TEXT    NOT NULL DEFAULT 'imap.gmail.com',
    imap_port    INTEGER NOT NULL DEFAULT 993,
    imap_secure  INTEGER NOT NULL DEFAULT 1,
    smtp_host    TEXT    NOT NULL DEFAULT 'smtp.gmail.com',
    smtp_port    INTEGER NOT NULL DEFAULT 587,
    smtp_secure  INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS account_settings (
    account_id     TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    min_delay_sec  INTEGER NOT NULL DEFAULT 60,
    max_delay_sec  INTEGER NOT NULL DEFAULT 180,
    signature_html TEXT    NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS account_folders (
    account_id      TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    folders_json    TEXT NOT NULL DEFAULT '[]',
    discovered_json TEXT NOT NULL DEFAULT '{}',
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
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
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id  TEXT    NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    row_idx      INTEGER NOT NULL,
    sent_at      TEXT    NOT NULL,
    sender_email TEXT    NOT NULL,
    sender_name  TEXT    NOT NULL DEFAULT '',
    to_email     TEXT    NOT NULL,
    subject      TEXT    NOT NULL DEFAULT '',
    body_html    TEXT    NOT NULL DEFAULT '',
    row_data     TEXT    NOT NULL DEFAULT '[]',
    touch_type   TEXT    NOT NULL DEFAULT 'first',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

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
`);

db.exec(`CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  times_contacted INTEGER NOT NULL DEFAULT 0,
  last_seen TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'auto',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(lower(email))`);

db.exec(`CREATE TABLE IF NOT EXISTS email_tracking (
  id TEXT PRIMARY KEY,
  campaign_id TEXT,
  row_idx INTEGER,
  to_email TEXT,
  sender_email TEXT,
  touch_type TEXT DEFAULT 'first',
  sent_at TEXT,
  opened INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  first_open_at TEXT,
  clicked INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  first_click_at TEXT,
  bounced INTEGER DEFAULT 0,
  auto_reply INTEGER DEFAULT 0,
  replied INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
)`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_et_campaign ON email_tracking(campaign_id)`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_et_email ON email_tracking(to_email)`);

// Indexes — created separately so they're idempotent
const indexes = [
  `CREATE INDEX IF NOT EXISTS idx_email_account_folder ON cached_emails(account_id, folder)`,
  `CREATE INDEX IF NOT EXISTS idx_email_date           ON cached_emails(date DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_email_acct_fold_date ON cached_emails(account_id, folder, date DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_email_uid            ON cached_emails(account_id, uid)`,
  `CREATE INDEX IF NOT EXISTS idx_history_campaign     ON campaign_history(campaign_id)`,
  `CREATE INDEX IF NOT EXISTS idx_history_touch        ON campaign_history(campaign_id, touch_type)`,
  `CREATE INDEX IF NOT EXISTS idx_email_folder_lower   ON cached_emails(account_id, lower(folder))`,
];
indexes.forEach(idx => { try { db.exec(idx); } catch(_) {} });

// Safe migration — adds track_id if upgrading from older DB
try { db.exec(`ALTER TABLE campaign_history ADD COLUMN track_id TEXT NOT NULL DEFAULT ''`); } catch {}
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
  getAllSettings    : db.prepare(`SELECT * FROM account_settings`),

  saveFolderCache  : db.prepare(`INSERT INTO account_folders(account_id,folders_json,discovered_json,updated_at) VALUES(?,?,?,datetime('now')) ON CONFLICT(account_id) DO UPDATE SET folders_json=excluded.folders_json, discovered_json=excluded.discovered_json, updated_at=datetime('now')`),
  getFolderCache   : db.prepare(`SELECT * FROM account_folders WHERE account_id=?`),
  delFolderCache   : db.prepare(`DELETE FROM account_folders WHERE account_id=?`),

  // Paginated — never return unbounded rows
  getEmails        : db.prepare(`SELECT * FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?) ORDER BY date DESC LIMIT 500`),
  getEmailsPage    : db.prepare(`SELECT * FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?) ORDER BY date DESC LIMIT ? OFFSET ?`),
  getEmailCount    : db.prepare(`SELECT COUNT(*) as cnt FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?)`),

  upsertEmail      : db.prepare(`INSERT INTO cached_emails(id,account_id,folder,uid,from_name,from_email,to_json,subject,body_html,preview,date,is_read,is_starred,has_attachment,msg_type,fetched_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET body_html=excluded.body_html, preview=excluded.preview, is_read=excluded.is_read, is_starred=excluded.is_starred, fetched_at=excluded.fetched_at`),
  updateRead       : db.prepare(`UPDATE cached_emails SET is_read=? WHERE account_id=? AND uid=?`),
  updateStarred    : db.prepare(`UPDATE cached_emails SET is_starred=? WHERE account_id=? AND uid=?`),
  deleteAccEmails  : db.prepare(`DELETE FROM cached_emails WHERE account_id=?`),
  deleteSingleEmail: db.prepare(`DELETE FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?) AND uid=?`),
  getMaxUid        : db.prepare(`SELECT MAX(CAST(uid AS INTEGER)) as maxUid FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?)`),
  pruneFolder      : db.prepare(`DELETE FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?) AND id NOT IN (SELECT id FROM cached_emails WHERE account_id=? AND lower(folder)=lower(?) ORDER BY date DESC LIMIT 1000)`),

  insertCampaign   : db.prepare(`INSERT INTO campaigns(id,name,subject,pitch,fu_pitch,fu_subject,email_col,csv_headers,csv_rows,sender_ids,batch_size,batch_delay_min,batch_delay_max,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  updateCampaign   : db.prepare(`UPDATE campaigns SET name=?,subject=?,pitch=?,fu_pitch=?,fu_subject=?,email_col=?,csv_headers=?,csv_rows=?,sender_ids=?,batch_size=?,batch_delay_min=?,batch_delay_max=?,status=?,updated_at=datetime('now') WHERE id=?`),
  getCampaign      : db.prepare(`SELECT * FROM campaigns WHERE id=?`),
  getAllCampaigns   : db.prepare(`SELECT id,name,subject,email_col,sender_ids,status,created_at,updated_at FROM campaigns ORDER BY created_at DESC`),
  getAllCampaignsFull: db.prepare(`SELECT * FROM campaigns ORDER BY created_at DESC`),
  deleteCampaign   : db.prepare(`DELETE FROM campaigns WHERE id=?`),

  insertHistory    : db.prepare(`INSERT INTO campaign_history(campaign_id,row_idx,sent_at,sender_email,sender_name,to_email,subject,body_html,row_data,touch_type,track_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)`),
  getHistory: db.prepare(`SELECT id,row_idx,sent_at,sender_email,sender_name,to_email,subject,body_html,touch_type,row_data,track_id FROM campaign_history WHERE campaign_id=? ORDER BY sent_at ASC LIMIT 5000`),
  deleteHistory    : db.prepare(`DELETE FROM campaign_history WHERE campaign_id=?`),

  insertSentRow    : db.prepare(`INSERT OR IGNORE INTO sent_rows(campaign_id,row_idx) VALUES(?,?)`),
  getSentRows      : db.prepare(`SELECT row_idx FROM sent_rows WHERE campaign_id=?`),
  deleteSentRows   : db.prepare(`DELETE FROM sent_rows WHERE campaign_id=?`),

  insertPair       : db.prepare(`INSERT OR IGNORE INTO global_sent_pairs(sender_email,recipient_email) VALUES(?,?)`),
  getPairs         : db.prepare(`SELECT sender_email,recipient_email FROM global_sent_pairs LIMIT 10000`),
};

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function makeId() {
  return `${Date.now().toString(36)}_${crypto.randomBytes(6).toString('hex')}`;
}

function safeJson(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function accountRow(r) {
  return {
    id: r.id, name: r.name, email: r.email,
    imapHost: r.imap_host, imapPort: r.imap_port, imapSecure: !!r.imap_secure,
    smtpHost: r.smtp_host, smtpPort: r.smtp_port, smtpSecure: !!r.smtp_secure,
  };
}

function emailRow(r) {
  return {
    id: r.id, accountId: r.account_id, uid: r.uid, folder: r.folder,
    from: { name: r.from_name, email: r.from_email },
    to: safeJson(r.to_json, []),
    subject: r.subject, body: r.body_html, preview: r.preview,
    date: r.date, read: !!r.is_read, starred: !!r.is_starred,
    hasAttachment: !!r.has_attachment, type: r.msg_type,
  };
}

function truncateBody(html) {
  if (!html) return '';
  const buf = Buffer.byteLength(html, 'utf8');
  if (buf <= MAX_BODY_BYTES) return html;
  // Truncate safely at byte boundary
  return Buffer.from(html, 'utf8').slice(0, MAX_BODY_BYTES).toString('utf8')
    + '<!-- [truncated] -->';
}

function classifyEmail(subject, fromEmail, snippet) {
  const s = (subject   || '').toLowerCase();
  const e = (fromEmail || '').toLowerCase();
  const p = (snippet   || '').toLowerCase();
  const autoKw = ['auto-reply','automatic reply','out of office','vacation reply', 'no longer', 'automated message', 'maternity leave',
                  'noreply','no-reply','do not reply','donotreply','autoreply','away message', 'on vacation', 'email has changed'];
  if (autoKw.some(k => s.includes(k) || e.includes(k) || p.includes(k))) return 'auto';
  if (s.startsWith('re:') || s.startsWith('re[')) return 'reply';
  if (/(mailer-daemon|undeliverable|delivery failed|bounced|failure notice)/i.test(s + e)) return 'bounce';
  return 'normal';
}

// ═══════════════════════════════════════════════════════════════
// NETWORK RETRY HANDLER — Deep shield against ECONNRESET/Timeouts
// ═══════════════════════════════════════════════════════════════
async function networkRetry(operation, maxRetries = 3, delayMs = 2500) {
  let lastError;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (e) {
      lastError = e;
      const msg = (e.message || '').toLowerCase();
      const code = (e.code || '').toLowerCase();
      const isTransient = /econnreset|etimedout|timeout|ehostunreach|enotfound|epipe|esockettimedout|socket hang up|premature close/i.test(msg + code);
      if (!isTransient || i === maxRetries) throw e;
      await new Promise(r => setTimeout(r, delayMs * i)); 
    }
  }
  throw lastError;
}

// ═══════════════════════════════════════════════════════════════
// PROVIDER PRESETS
// ═══════════════════════════════════════════════════════════════
const PRESETS = {
  'gmail.com'      : { host:'imap.gmail.com',         port:993, secure:true,  smtpHost:'smtp.gmail.com',         smtpPort:587, smtpSecure:false },
  'googlemail.com' : { host:'imap.gmail.com',         port:993, secure:true,  smtpHost:'smtp.gmail.com',         smtpPort:587, smtpSecure:false },
  'outlook.com'    : { host:'outlook.office365.com',  port:993, secure:true,  smtpHost:'smtp.office365.com',     smtpPort:587, smtpSecure:false },
  'hotmail.com'    : { host:'outlook.office365.com',  port:993, secure:true,  smtpHost:'smtp.office365.com',     smtpPort:587, smtpSecure:false },
  'live.com'       : { host:'outlook.office365.com',  port:993, secure:true,  smtpHost:'smtp.office365.com',     smtpPort:587, smtpSecure:false },
  'yahoo.com'      : { host:'imap.mail.yahoo.com',    port:993, secure:true,  smtpHost:'smtp.mail.yahoo.com',    smtpPort:587, smtpSecure:false },
  'icloud.com'     : { host:'imap.mail.me.com',       port:993, secure:true,  smtpHost:'smtp.mail.me.com',       smtpPort:587, smtpSecure:false },
  'me.com'         : { host:'imap.mail.me.com',       port:993, secure:true,  smtpHost:'smtp.mail.me.com',       smtpPort:587, smtpSecure:false },
  'zoho.com'       : { host:'imap.zoho.com',          port:993, secure:true,  smtpHost:'smtpro.zoho.com',        smtpPort:465, smtpSecure:true  },
  'fastmail.com'   : { host:'imap.fastmail.com',      port:993, secure:true,  smtpHost:'smtp.fastmail.com',      smtpPort:465, smtpSecure:true  },
  'aol.com'        : { host:'imap.aol.com',           port:993, secure:true,  smtpHost:'smtp.aol.com',           smtpPort:587, smtpSecure:false },
  'gmx.com'        : { host:'imap.gmx.com',           port:993, secure:true,  smtpHost:'mail.gmx.com',           smtpPort:587, smtpSecure:false },
  'yandex.com'     : { host:'imap.yandex.com',        port:993, secure:true,  smtpHost:'smtp.yandex.com',        smtpPort:465, smtpSecure:true  },
};

const MX_MAPPINGS = [
  { match: 'google.com',             preset: PRESETS['gmail.com']   },
  { match: 'googlemail.com',         preset: PRESETS['gmail.com']   },
  { match: 'outlook.com',            preset: PRESETS['outlook.com'] },
  { match: 'protection.outlook.com', preset: PRESETS['outlook.com'] },
  { match: 'zoho.com',               preset: PRESETS['zoho.com']    },
  { match: 'yahoodns.net',           preset: PRESETS['yahoo.com']   },
  { match: 'fastmail.com',           preset: PRESETS['fastmail.com']},
  { match: 'secureserver.net',       preset: { host:'imap.secureserver.net',  port:993, secure:true, smtpHost:'smtpout.secureserver.net', smtpPort:465, smtpSecure:true  } },
  { match: 'titan.email',            preset: { host:'imap.titan.email',       port:993, secure:true, smtpHost:'smtp.titan.email',        smtpPort:465, smtpSecure:true  } },
  { match: 'hostinger.com',          preset: { host:'imap.hostinger.com',     port:993, secure:true, smtpHost:'smtp.hostinger.com',      smtpPort:465, smtpSecure:true  } },
];

// ═══════════════════════════════════════════════════════════════
// TCP PROBE — with timeout guard
// ═══════════════════════════════════════════════════════════════
function tcpProbe(host, port, timeoutMs = 4000) {
  return new Promise((resolve) => {
    let isDone = false;
    const socket = new net.Socket();
    
    const cleanup = (result) => {
      if (isDone) return;
      isDone = true;
      clearTimeout(timer);
      try { socket.destroy(); } catch {} 
      resolve(result);
    };

    const timer = setTimeout(() => cleanup(false), timeoutMs);
    
    socket.on('connect', () => cleanup(true));
    socket.on('timeout', () => cleanup(false));
    socket.on('error',   () => cleanup(false)); 
    socket.on('close',   () => cleanup(false));
    socket.on('end',     () => cleanup(false));
    
    try { socket.connect(port, host); } catch { cleanup(false); }
  });
}

async function discoverMailSettings(domain) {
  domain = domain.toLowerCase();
  if (PRESETS[domain]) return PRESETS[domain];

  // MX lookup with timeout
  try {
    const records = await Promise.race([
      dns.resolveMx(domain),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DNS timeout')), 5000)),
    ]);
    records.sort((a, b) => a.priority - b.priority);
    for (const record of records) {
      const exchange = record.exchange.toLowerCase();
      const match = MX_MAPPINGS.find(m => exchange.includes(m.match));
      if (match) return match.preset;
    }
  } catch {}

  // TCP probe fallback
  const imapCandidates = [`imap.${domain}`, `mail.${domain}`];
  const smtpCandidates = [`smtp.${domain}`, `mail.${domain}`];

  let imapHost = `mail.${domain}`, imapPort = 993, imapSecure = true;
  for (const host of imapCandidates) {
    if (await tcpProbe(host, 993)) { imapHost = host; imapPort = 993; imapSecure = true; break; }
    if (await tcpProbe(host, 143)) { imapHost = host; imapPort = 143; imapSecure = false; break; }
  }

  let smtpHost = `mail.${domain}`, smtpPort = 587, smtpSecure = false;
  for (const host of smtpCandidates) {
    if (await tcpProbe(host, 465)) { smtpHost = host; smtpPort = 465; smtpSecure = true; break; }
    if (await tcpProbe(host, 587)) { smtpHost = host; smtpPort = 587; smtpSecure = false; break; }
  }

  return { host: imapHost, port: imapPort, secure: imapSecure, smtpHost, smtpPort, smtpSecure };
}

// ═══════════════════════════════════════════════════════════════
// IMAP FOLDER DISCOVERY
// ═══════════════════════════════════════════════════════════════
function discoverIMAPFolders(imap) {
  return new Promise((resolve) => {
    const fallback = { inbox:'INBOX', sent:'Sent', drafts:'Drafts', trash:'Trash', spam:'Junk' };
    try {
      imap.getBoxes((err, boxes) => {
        if (err || !boxes) return resolve(fallback);
        const found = { inbox:null, sent:null, drafts:null, trash:null, spam:null };
        const ATTRIB = { '\\inbox':'inbox','\\sent':'sent','\\sentmail':'sent','\\drafts':'drafts','\\draft':'drafts','\\trash':'trash','\\deleted':'trash','\\junk':'spam','\\spam':'spam' };
        const NAMES  = { inbox:['inbox'],sent:['sent','sent items','sent mail','sent messages','outbox'],drafts:['drafts','draft'],trash:['trash','deleted','deleted items','bin'],spam:['junk','spam','bulk mail'] };

        const walk = (obj, parent) => {
          for (const key in obj) {
            const box = obj[key], sep = box.delimiter || '.';
            const fp  = parent ? `${parent}${sep}${key}` : key;
            for (const attr of (box.attribs||[]).map(a=>a.toLowerCase())) {
              if (ATTRIB[attr] && !found[ATTRIB[attr]]) found[ATTRIB[attr]] = fp;
            }
            const nl = key.toLowerCase();
            for (const [fk, kws] of Object.entries(NAMES)) {
              if (!found[fk] && kws.includes(nl)) found[fk] = fp;
            }
            if (box.children) walk(box.children, fp);
          }
        };
        walk(boxes, '');
        resolve({
          inbox  : found.inbox  || 'INBOX',
          sent   : found.sent   || 'Sent',
          drafts : found.drafts || 'Drafts',
          trash  : found.trash  || 'Trash',
          spam   : found.spam   || 'Junk',
        });
      });
    } catch { resolve(fallback); }
  });
}

function getAllIMAPFolders(imap) {
  return new Promise((resolve) => {
    try {
      imap.getBoxes((err, boxes) => {
        if (err || !boxes) return resolve([]);
        const folders = [];
        const walk = (obj, parent) => {
          for (const key in obj) {
            const box = obj[key], sep = box.delimiter || '.';
            const fp  = parent ? `${parent}${sep}${key}` : key;
            folders.push({ name:key, fullPath:fp, attribs:box.attribs||[], delimiter:box.delimiter||'.', hasChildren:!!box.children });
            if (box.children) walk(box.children, fp);
          }
        };
        walk(boxes, '');
        resolve(folders);
      });
    } catch { resolve([]); }
  });
}

// ═══════════════════════════════════════════════════════════════
// IMAP CONNECTION — with concurrency limiting
// ═══════════════════════════════════════════════════════════════
function makeImap(account) {
  const password     = decrypt(account.password_enc);
  const explicitPort = parseInt(account.imap_port, 10) || 993;
  const useImplicitTLS = explicitPort === 993 ? true : explicitPort === 143 ? false : !!account.imap_secure;
  
  const imap = new Imap({
    user: account.email, password,
    host: account.imap_host, port: explicitPort,
    tls: useImplicitTLS, autotls: 'always',
    tlsOptions: { rejectUnauthorized: false, servername: account.imap_host },
    connTimeout: 30000, authTimeout: 20000,
    socketTimeout: 60000,
  });

  // CRITICAL: Suppresses unhandled underlying stream exceptions emitted silently
  imap.on('error', () => {}); 
  return imap;
}

let _imapActive = 0;
const _imapQueue = [];
const MAX_IMAP_CONCURRENT = 12;

function imapSlot() {
  return new Promise(resolve => {
    const tryAcquire = () => {
      if (_imapActive < MAX_IMAP_CONCURRENT) {
        _imapActive++;
        resolve(() => { _imapActive--; if (_imapQueue.length) _imapQueue.shift()(); });
      } else {
        _imapQueue.push(tryAcquire);
      }
    };
    tryAcquire();
  });
}

// ═══════════════════════════════════════════════════════════════
// PARSE IMAP MESSAGE
// ═══════════════════════════════════════════════════════════════
async function parseIMAPMessage(raw, accountId, folderKey) {
  try {
    const parsed    = await simpleParser(raw.raw, { skipHtmlToText: false, skipTextToHtml: false, skipImageLinks: false });
    const fromName  = parsed.from?.value?.[0]?.name    || '';
    const fromEmail = parsed.from?.value?.[0]?.address || '';
    const uid = raw.attrs?.uid
      ? String(raw.attrs.uid)
      : crypto.createHash('md5').update((parsed.messageId||'')+(parsed.date?.toISOString()||'')+fromEmail).digest('hex').slice(0,16);

    const id      = `${accountId}:${folderKey}:${uid}`;
    const toArr   = (parsed.to?.value || []).map(t => ({ name: t.name||'', email: t.address||'' }));
    const subject = (parsed.subject || '').slice(0, 500);
    const rawBody = parsed.html || parsed.textAsHtml || parsed.text || '';
    const bodyHtml= truncateBody(rawBody);
    const preview = (parsed.text || '').replace(/\s+/g, ' ').trim().slice(0, 300);
    const date    = (parsed.date || new Date()).toISOString();
    const hasAtt  = (parsed.attachments || []).length > 0 ? 1 : 0;
    const attMeta = JSON.stringify((parsed.attachments||[]).map((a,i)=>({idx:i,filename:a.filename||`attachment_${i}`,contentType:a.contentType||'application/octet-stream',size:a.size||0})));
    const msgType = classifyEmail(subject, fromEmail, preview);
    const flags   = raw.attrs?.flags || [];
    const isRead  = flags.some(f => f === '\\Seen') ? 1 : 0;

    return { id, accountId, folder:folderKey, uid, fromName, fromEmail, toArr:JSON.stringify(toArr), subject, bodyHtml, preview, date, isRead, isStarred:0, hasAtt, msgType, attMeta };
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// INCREMENTAL IMAP FETCH
// ═══════════════════════════════════════════════════════════════
async function fetchIMAPMsgsSince(account, folderPath, sinceUid = 0) {
  const release = await imapSlot();
  return new Promise((resolve, reject) => {
    let isFinished = false;
    const imap     = makeImap(account);
    const messages =[];

    const cleanup = (error, data) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timer);
      try { imap.destroy(); } catch {} // Force-clear connections upon error
      release();
      if (error) reject(error); 
      else resolve(data);
    };

    const timer = setTimeout(() => cleanup(null,[]), 75000); // hard reset failsafe limit

    imap.once('ready', () => {
      imap.openBox(folderPath, true, (err, box) => {
        if (err || !box || box.messages.total === 0) return cleanup(null,[]);

        let criteria = sinceUid > 0 
          ? [['UID', `${sinceUid + 1}:*`]]
          : [['SINCE', (() => { 
              const d = new Date(); d.setMonth(d.getMonth() - 3); 
              return `${String(d.getDate()).padStart(2, '0')}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}-${d.getFullYear()}`; 
            })()]];

        imap.search(criteria, (e2, uids) => {
          if (e2 || !uids?.length) return cleanup(null,[]);

          const fetchUids = uids.slice(-300); // max 300 items fetching simultaneously safely
          const fetchStream = imap.fetch(fetchUids, { bodies: '', struct: true });
          
          fetchStream.on('message', msg => {
            let chunks =[], attrs = {};
            msg.on('body', stream => stream.on('data', c => chunks.push(c)));
            msg.once('attributes', a => { attrs = a; });
            msg.once('end', () => messages.push({ raw: Buffer.concat(chunks), attrs }));
          });
          
          fetchStream.once('end', () => cleanup(null, messages));
          fetchStream.on('error', e3 => cleanup(e3, null));
        });
      });
    });

    imap.on('error', e => cleanup(e, null)); // Swallows ALL ECONNRESET noise cleanly
    imap.on('end', () => cleanup(null, messages));
    imap.connect();
  });
}

// ═══════════════════════════════════════════════════════════════
// BACKGROUND IMAP DELETE — with timeout
// ═══════════════════════════════════════════════════════════════
function deleteImapEmailInBackground(account, folderPath, uid) {
  let done = false;
  const imap = makeImap(account);

  const cleanup = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    try { imap.destroy(); } catch {}
  };

  const timer = setTimeout(cleanup, 30000);

  imap.once('ready', () => {
    imap.openBox(folderPath, false, (err) => {
      if (err) return cleanup();
      imap.uid.addFlags(String(uid), '\\Deleted', (err2) => {
        if (err2) return cleanup();
        imap.expunge(cleanup);
      });
    });
  });
  imap.on('error', cleanup);
  imap.on('end', cleanup);
  imap.connect();
}

// ═══════════════════════════════════════════════════════════════
// SAVE TO IMAP SENT — with timeout
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// SAVE TO IMAP SENT — with timeout
// ═══════════════════════════════════════════════════════════════
async function saveToIMAPSent(account, rawMime) {
  return new Promise((resolve) => {
    let done = false;
    const imap = makeImap(account);

    const cleanup = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { imap.destroy(); } catch {}
      resolve();
    };

    const timer = setTimeout(cleanup, 20000);

    imap.once('ready', async () => {
      try {
        const folders    = await discoverIMAPFolders(imap);
        const sentFolder = folders.sent || 'Sent';
        imap.append(rawMime, { mailbox: sentFolder, flags: ['\\Seen'] }, cleanup);
      } catch { cleanup(); }
    });
    
    imap.on('error', cleanup);
    imap.on('close', cleanup);
    imap.on('end', cleanup);
    
    try { imap.connect(); } catch { cleanup(); }
  });
}

// ═══════════════════════════════════════════════════════════════
// IMAP INBOX MONITORING — spam-safe open/bounce/reply/auto tracking
// ═══════════════════════════════════════════════════════════════

// Classify an incoming email as MDN (read receipt), bounce, auto-reply, or reply
function classifyIncoming(parsed) {
  const subject   = (parsed.subject || '').toLowerCase();
  const fromEmail = (parsed.from?.value?.[0]?.address || '').toLowerCase();
  const ct        = (parsed.headers?.get ? parsed.headers.get('content-type') : '') || '';
  const autoH     = (parsed.headers?.get ? parsed.headers.get('x-autoreply') : '') || '';
  const autoH2    = (parsed.headers?.get ? parsed.headers.get('auto-submitted') : '') || '';
  // Fix Constraints limits mapping tracking loop to safely analyze exactly relevant meta constraints! Node scales seamlessly keeping other parallel account tasks actively clear bypassing blockages gracefully spanning over limitlessly nested histories!
  const text      = (parsed.text || '').toLowerCase().slice(0, 4500);

  // MDN = read receipt / disposition notification
  if (ct.includes('multipart/report') || ct.includes('disposition-notification') ||
      /disposition notification|read.*receipt|message.*disposition/i.test(subject) ||
      /original-message-id|disposition:/i.test(text)) {
    return 'mdn';
  }

  // Bounce
  if (/mailer-daemon|postmaster|mail delivery subsystem|undeliverable|delivery.*fail|ndrsupport|bounce|non.*delivery/i.test(fromEmail + ' ' + subject)) {
    return 'bounce';
  }

  // Auto-reply
  if (autoH || /^auto-replied$|^auto-generated$/i.test(autoH2) ||
      /out of office|auto.?reply|automatic reply|vacation|on leave|away from|maternity|i am out|no longer with/i.test(subject + ' ' + text.slice(0, 300))) {
    return 'auto';
  }

  // Reply
  if (subject.startsWith('re:') || subject.startsWith('re[')) {
    return 'reply';
  }

  return null;
}

// Extract original recipient email from bounce/MDN body
function extractOriginalRecipient(parsed) {
  const text = parsed.text || '';
  // NDR typically contains "Final-Recipient: rfc822; email@domain.com"
  const m = text.match(/Final-Recipient[^\n]*?:\s*[^\s;]+;\s*([^\r\n\s]+)/i)
          || text.match(/failed recipients?[^\n]*?([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i);
  return m?.[1]?.toLowerCase() || null;
}

// Extract original subject from reply (strip RE:)
function extractOriginalSubject(subject) {
  return (subject || '').replace(/^(re[:\[]\s*)+/gi, '').trim().toLowerCase();
}

// Extract Track-ID from received MDN
function extractTrackIdFromMDN(parsed) {
  const text = parsed.text || '';
  const headers = parsed.headers;
  // We embed X-MailOS-Track-ID header, which shows up in MDN's original-headers
  const m = text.match(/X-MailOS-Track-ID:\s*([^\r\n\s]+)/i);
  return m?.[1] || null;
}

// Scan a sender account's inbox for tracking signals
async function scanInboxForTracking(account, campaignId, trackingMap) {
  const release = await imapSlot();
  return new Promise((resolve) => {
    const imap = makeImap(account);
    const results =[]; 
    let doneProcessing = false;

    const cleanup = () => {
      if (doneProcessing) return;
      doneProcessing = true;
      clearTimeout(timer);
      try { imap.destroy(); } catch {}
      release();
      resolve(results);
    };

    const timer = setTimeout(cleanup, 60000);

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err || !box || box.messages.total === 0) return cleanup();

        const since = new Date();
        since.setDate(since.getDate() - 7);
        const dd = String(since.getDate()).padStart(2, '0');
        const mmm =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][since.getMonth()];
        const sinceStr = `${dd}-${mmm}-${since.getFullYear()}`;

        imap.search([['SINCE', sinceStr]], (e2, uids) => {
          if (e2 || !uids?.length) return cleanup();

          const toFetch = uids.slice(-200); 
          let pendingResolves = 0;
          let isFetchEnded = false;

          const checkDone = () => {
            if (isFetchEnded && pendingResolves === 0) {
              cleanup();
            }
          };

          const fetchStream = imap.fetch(toFetch, { bodies: '' });
          
          fetchStream.on('message', msg => {
            pendingResolves++;
            let chunks =[];
            msg.on('body', stream => { stream.on('data', c => chunks.push(c)); });
            
            msg.once('end', () => {
              simpleParser(Buffer.concat(chunks), { skipImageLinks: true }).then(parsed => {
                const type = classifyIncoming(parsed);
                if (!type) return;

                const fromEmail = (parsed.from?.value?.[0]?.address || '').toLowerCase();

                if (type === 'mdn') {
                  const trackId = extractTrackIdFromMDN(parsed);
                  if (trackId && trackingMap[trackId]) results.push({ trackId, type: 'open', toEmail: trackingMap[trackId].toEmail });
                } 
                else if (type === 'bounce') {
                  const recipient = extractOriginalRecipient(parsed);
                  if (recipient) {
                    const entry = Object.values(trackingMap).find(e => e.toEmail === recipient);
                    if (entry) results.push({ trackId: entry.trackId, type: 'bounce', toEmail: recipient });
                  }
                } 
                else if (type === 'auto' || type === 'reply') {
                  const origSubj = extractOriginalSubject(parsed.subject || '');
                  const entry = Object.values(trackingMap).find(e => e.toEmail === fromEmail);
                  
                  if (entry) {
                    results.push({ trackId: entry.trackId, type, toEmail: fromEmail });
                  } else {
                    const bySubj = Object.values(trackingMap).find(e =>
                      e.subject && origSubj && origSubj.includes((e.subject||'').toLowerCase().replace(/^re:\s*/i,'').slice(0, 20)));
                    if (bySubj) results.push({ trackId: bySubj.trackId, type, toEmail: bySubj.toEmail });
                  }
                }
              }).catch(() => {})
              .finally(() => {
                pendingResolves--;
                checkDone();
              });
            });
          });

          fetchStream.once('end', () => {
            isFetchEnded = true;
            checkDone();
          });
          
          fetchStream.on('error', cleanup);
        });
      });
    });

    imap.on('error', cleanup);
    imap.on('end', cleanup);
    imap.connect();
  });
}

// Persist scan results to DB
function applyTrackingResults(results) {
  const upd = db.prepare(`
    UPDATE email_tracking SET
      opened    = CASE WHEN ? = 1 THEN 1 ELSE opened END,
      open_count= CASE WHEN ? = 1 THEN open_count+1 ELSE open_count END,
      first_open_at = CASE WHEN ? = 1 AND first_open_at IS NULL THEN datetime('now') ELSE first_open_at END,
      bounced   = CASE WHEN ? = 1 THEN 1 ELSE bounced END,
      auto_reply= CASE WHEN ? = 1 THEN 1 ELSE auto_reply END,
      replied   = CASE WHEN ? = 1 THEN 1 ELSE replied END
    WHERE id = ?
  `);
  const tx = db.transaction(rows => {
    for (const r of rows) {
      const isOpen   = r.type === 'open'   ? 1 : 0;
      const isBounce = r.type === 'bounce' ? 1 : 0;
      const isAuto   = r.type === 'auto'   ? 1 : 0;
      const isReply  = r.type === 'reply'  ? 1 : 0;
      upd.run(isOpen, isOpen, isOpen, isBounce, isAuto, isReply, r.trackId);
    }
  });
  tx(results);
}

// ═══════════════════════════════════════════════════════════════
// EXPRESS
// ═══════════════════════════════════════════════════════════════
const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));
app.use(express.json({ limit: '20mb' }));

// ── Request timeout middleware
app.use((req, res, next) => {
  // Increased from 120000 to 240000 to prevent 408 timeouts on slow SMTP connections
  res.setTimeout(240000, () => {
    if (!res.headersSent) res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

// ── Health
// ── TRACKING: Open pixel ──────────────────────────────────────
app.get('/track/open/:id', (req, res) => {
  const { id } = req.params;
  try {
    const row = db.prepare('SELECT * FROM email_tracking WHERE id=?').get(id);
    if(row){
      db.prepare(`UPDATE email_tracking SET opened=1, open_count=open_count+1, first_open_at=COALESCE(first_open_at,datetime('now')) WHERE id=?`).run(id);
    }
  } catch{}
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7','base64');
  res.writeHead(200,{'Content-Type':'image/gif','Content-Length':gif.length,'Cache-Control':'no-store,no-cache,must-revalidate','Pragma':'no-cache','Expires':'0'});
  res.end(gif);
});

// ── TRACKING: Click redirect ──────────────────────────────────
app.get('/track/click/:id', (req, res) => {
  const { id } = req.params;
  const url = req.query.url ? decodeURIComponent(req.query.url) : 'about:blank';
  try {
    const row = db.prepare('SELECT * FROM email_tracking WHERE id=?').get(id);
    if(row){
      db.prepare(`UPDATE email_tracking SET clicked=1, click_count=click_count+1, first_click_at=COALESCE(first_click_at,datetime('now')) WHERE id=?`).run(id);
    }
  } catch{}
  res.redirect(302, url);
});

// ── TRACKING: Get stats for a campaign ───────────────────────
app.get('/api/campaigns/:id/tracking', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM email_tracking WHERE campaign_id=? ORDER BY sent_at DESC').all(req.params.id);
    const total = rows.length;
    const openedN   = rows.filter(r=>r.opened).length;
    const clickedN  = rows.filter(r=>r.clicked).length;
    const bouncedN  = rows.filter(r=>r.bounced).length;
    const autoN     = rows.filter(r=>r.auto_reply).length;
    const repliedN  = rows.filter(r=>r.replied).length;
    const inboxedN  = rows.filter(r=>!r.bounced).length;
    const pct = (n, d) => d > 0 ? Math.round((n / d) * 100) : 0;
    res.json({
      total, opened: openedN, clicked: clickedN, bounced: bouncedN,
      autoReply: autoN, replied: repliedN, inboxed: inboxedN,
      openRate: pct(openedN, total), clickRate: pct(clickedN, total),
      bounceRate: pct(bouncedN, total), replyRate: pct(repliedN, total),
      rows: rows.map(r => ({
        id: r.id, toEmail: r.to_email, senderEmail: r.sender_email,
        subject: r.subject, touchType: r.touch_type, sentAt: r.sent_at,
        opened: !!r.opened, openCount: r.open_count, firstOpenAt: r.first_open_at,
        clicked: !!r.clicked, bounced: !!r.bounced, autoReply: !!r.auto_reply, replied: !!r.replied,
      })),
    });
  } catch(e){ res.status(500).json({error:e.message}); }
});

// ── TRACKING: Mark bounce/auto/reply ─────────────────────────
app.patch('/api/campaigns/tracking/:id', (req, res) => {
  const { bounced, autoReply, replied } = req.body||{};
  try {
    const sets=[];const vals=[];
    if(bounced!==undefined){sets.push('bounced=?');vals.push(bounced?1:0);}
    if(autoReply!==undefined){sets.push('auto_reply=?');vals.push(autoReply?1:0);}
    if(replied!==undefined){sets.push('replied=?');vals.push(replied?1:0);}
    if(sets.length){db.prepare(`UPDATE email_tracking SET ${sets.join(',')} WHERE id=?`).run(...vals,req.params.id);}
    res.json({ok:true});
  } catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/api/health', (req, res) => {
  const cnt = db.prepare('SELECT COUNT(*) as c FROM accounts').get();
  res.json({ status: 'ok', accounts: cnt?.c || 0, uptime: Math.floor(process.uptime()) });
});

// ── Presets
app.get('/api/presets/:email', async (req, res) => {
  const domain = (req.params.email.split('@')[1] || '').toLowerCase().replace(/[^a-z0-9.-]/g,'');
  if (!domain) return res.status(400).json({ error: 'Invalid email' });
  try {
    res.json(await discoverMailSettings(domain));
  } catch {
    res.json({ host:`imap.${domain}`, port:993, secure:true, smtpHost:`smtp.${domain}`, smtpPort:587, smtpSecure:false });
  }
});

// ── Test connection
app.post('/api/accounts/test', async (req, res) => {
  const { email, password, imapHost, imapPort, imapSecure } = req.body;
  if (!email || !password || !imapHost) return res.status(400).json({ error: 'email, password, imapHost required' });
  const port = parseInt(imapPort, 10) || 993;
  const tls  = port === 993 ? true : port === 143 ? false : !!imapSecure;
  
  let done = false;
  const imap = new Imap({ user:email, password, host:imapHost, port, tls, autotls:'always', tlsOptions:{rejectUnauthorized:false,servername:imapHost}, connTimeout:25000, authTimeout:20000 });
  
  const finish = (err) => {
    if (done) return; 
    done = true;
    clearTimeout(timer);
    try { imap.destroy(); } catch {} 
    
    if (!res.headersSent) {
      if (err) res.status(400).json({ error: err.message });
      else res.json({ ok: true });
    }
  };
  
  const timer = setTimeout(() => finish(new Error('Connection timeout')), 28000);
  
  imap.once('ready', () => finish(null));
  imap.on('error', finish);
  imap.on('close', () => finish(new Error('Connection closed unexpectedly')));
  
  try { imap.connect(); } catch (e) { finish(e); }
});

// ── List accounts
app.get('/api/accounts', (req, res) => {
  res.json(stmts.getAllAccounts.all().map(accountRow));
});

// ── Add account
app.post('/api/accounts', async (req, res) => {
  let { email, password, name, imapHost, imapPort, imapSecure, smtpHost, smtpPort, smtpSecure } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  email = email.trim().toLowerCase().replace(/[^a-z0-9@._+-]/g, '');
  if (!email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  if (stmts.getAccountByEmail.get(email)) return res.status(409).json({ error: 'Account already exists' });
  const all = stmts.getAllAccounts.all();
  if (all.length >= 500) return res.status(429).json({ error: '500 account limit reached' });

  const id  = makeId();
  const enc = encrypt(password);
  const dom = email.split('@')[1] || '';

  try {
    let iH = (imapHost || '').trim(), sH = (smtpHost || '').trim();
    let iP = imapPort ? parseInt(imapPort,10) : NaN;
    let sP = smtpPort ? parseInt(smtpPort,10) : NaN;
    let iSec, sSec;

    if (!iH || !sH) {
      const p = await discoverMailSettings(dom);
      iH = iH || p.host; sH = sH || p.smtpHost;
      iP = isNaN(iP) ? p.port : iP; sP = isNaN(sP) ? p.smtpPort : sP;
      iSec = imapSecure !== undefined ? (imapSecure?1:0) : (p.secure?1:0);
      sSec = smtpSecure !== undefined ? (smtpSecure?1:0) : (p.smtpSecure?1:0);
    } else {
      iP   = isNaN(iP) ? 993 : iP; sP = isNaN(sP) ? 587 : sP;
      iSec = imapSecure !== undefined ? (imapSecure?1:0) : (iP===993?1:0);
      sSec = smtpSecure !== undefined ? (smtpSecure?1:0) : (sP===465?1:0);
    }

    // Port → security canonical rules
    if (iP === 993) iSec = 1; else if (iP === 143) iSec = 0;
    if (sP === 465) sSec = 1; else if (sP === 587 || sP === 25) sSec = 0;

    stmts.insertAccount.run(id, name || email.split('@')[0], email, enc, iH, iP, iSec, sH, sP, sSec);
    res.status(201).json(accountRow(stmts.getAccount.get(id)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Delete account
app.delete('/api/accounts/:id', (req, res) => {
  const id = req.params.id;
  stmts.deleteAccEmails.run(id);
  stmts.delFolderCache.run(id);
  stmts.deleteAccount.run(id);
  res.json({ ok: true });
});

// ── Settings
app.get('/api/accounts/settings', (req, res) => {
  const map = {};
  stmts.getAllSettings.all().forEach(r => { map[r.account_id] = { minDelay:r.min_delay_sec, maxDelay:r.max_delay_sec }; });
  res.json(map);
});

app.patch('/api/accounts/:id/settings', (req, res) => {
  const { minDelay, maxDelay } = req.body;
  const ex = stmts.getSettings.get(req.params.id) || {};
  stmts.upsertSettings.run(req.params.id, minDelay??ex.min_delay_sec??60, maxDelay??ex.max_delay_sec??180, ex.signature_html||'');
  res.json({ ok: true });
});

app.get('/api/signatures', (req, res) => {
  const map = {};
  stmts.getAllSettings.all().forEach(r => { if(r.signature_html) map[r.account_id] = r.signature_html; });
  res.json(map);
});

app.put('/api/accounts/:id/signature', (req, res) => {
  const ex = stmts.getSettings.get(req.params.id) || {};
  stmts.upsertSettings.run(req.params.id, ex.min_delay_sec||60, ex.max_delay_sec||180, req.body.html||'');
  res.json({ ok: true });
});

// ── Folder cache
app.get('/api/accounts/:id/folders-cached', (req, res) => {
  const row = stmts.getFolderCache.get(req.params.id);
  if (!row) return res.json(null);
  res.json({ folders: safeJson(row.folders_json,[]), discovered: safeJson(row.discovered_json,{}) });
});

app.post('/api/accounts/:id/folders-cached', (req, res) => {
  const { folders, discovered } = req.body;
  if (!Array.isArray(folders)) return res.status(400).json({ error: 'folders must be array' });
  stmts.saveFolderCache.run(req.params.id, JSON.stringify(folders), JSON.stringify(discovered||{}));
  res.json({ ok: true });
});

// ── Live folder discovery (IMAP)
app.get('/api/accounts/:id/folderlist', async (req, res) => {
  const account = stmts.getAccount.get(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  
  let done = false;
  const imap = makeImap(account);
  
  const finish = (err, data) => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    try { imap.destroy(); } catch {}
    
    if (!res.headersSent) {
      if (err) res.status(500).json({ error: err.message || 'Operation timed out' });
      else res.json(data);
    }
  };

  const timer = setTimeout(() => finish(new Error('Timeout')), 30000);
  
  imap.once('ready', async () => {
    try {
      const [discovered, folders] = await Promise.all([
        discoverIMAPFolders(imap), 
        getAllIMAPFolders(imap)
      ]);
      finish(null, { discovered, folders });
    } catch (e) { 
      finish(e);
    }
  });
  
  imap.on('error', finish); 
  imap.on('end', () => finish(new Error('IMAP connection ended gracefully too early')));
  imap.connect();
});

// ── Email fetch — DB-first, incremental IMAP on refresh
app.get('/api/accounts/:id/emails', async (req, res) => {
  const folderPath = (req.query.folder || 'INBOX').trim();
  const refresh    = req.query.refresh === 'true';
  const page       = Math.max(0, parseInt(req.query.page  || '0',  10));
  const limit      = Math.min(500, Math.max(20, parseInt(req.query.limit || '200', 10)));
  const account    = stmts.getAccount.get(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const folderKey = folderPath.toLowerCase();

  // Always return DB immediately if not refreshing
  if (!refresh) {
    const rows = stmts.getEmailsPage.all(req.params.id, folderKey, limit, page * limit);
    return res.json(rows.map(emailRow));
  }

  // Incremental IMAP fetch
  try {
    const maxRow   = stmts.getMaxUid.get(req.params.id, folderKey);
    const sinceUid = maxRow?.maxUid ? parseInt(maxRow.maxUid, 10) : 0;
    const rawMsgs  = await fetchIMAPMsgsSince(account, folderPath, sinceUid);

    if (rawMsgs.length > 0) {
      const parsed = (await Promise.all(rawMsgs.map(r => parseIMAPMessage(r, req.params.id, folderKey)))).filter(Boolean);
      const ins = db.transaction(msgs => {
        for (const m of msgs) {
          stmts.upsertEmail.run(m.id, m.accountId, m.folder, m.uid, m.fromName, m.fromEmail, m.toArr, m.subject, m.bodyHtml, m.preview, m.date, m.isRead, m.isStarred, m.hasAtt, m.msgType);
          if(m.attMeta&&m.attMeta!=='[]'){ try{ db.prepare(`UPDATE cached_emails SET attachments_json=? WHERE id=?`).run(m.attMeta,m.id); }catch{} }
        }
      });
      ins(parsed);
      // Prune to 1000 max per folder
      stmts.pruneFolder.run(req.params.id, folderKey, req.params.id, folderKey);
      // Push real-time notification to all browser clients
      if (parsed.length > 0) {
        ssePush('new_mail', { accountId: req.params.id, folder: folderKey, count: parsed.length });
      }
    }
    const rows = stmts.getEmailsPage.all(req.params.id, folderKey, limit, page * limit);
    res.json(rows.map(emailRow));
  } catch (e) {
    // Always fall back to DB cache on IMAP error
    const rows = stmts.getEmailsPage.all(req.params.id, folderKey, limit, page * limit);
    res.json(rows.map(emailRow));
  }
});

// ── Read / Star
app.patch('/api/accounts/:accountId/messages/:uid/read', (req, res) => {
  stmts.updateRead.run(req.body.read ? 1 : 0, req.params.accountId, req.params.uid);
  res.json({ ok: true });
});

app.patch('/api/accounts/:accountId/messages/:uid/star', (req, res) => {
  stmts.updateStarred.run(req.body.starred ? 1 : 0, req.params.accountId, req.params.uid);
  res.json({ ok: true });
});

// ── Delete email
app.delete('/api/accounts/:accountId/messages/:folder/:uid', (req, res) => {
  const { accountId, uid } = req.params;
  const folderKey = decodeURIComponent(req.params.folder).toLowerCase().replace(/[^a-z0-9@._\-/ \\]/gi, '');
  const account   = stmts.getAccount.get(accountId);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  stmts.deleteSingleEmail.run(accountId, folderKey, uid);

  // Find real case-sensitive folder path from cache
  let realFolder = decodeURIComponent(req.params.folder);
  const fc = stmts.getFolderCache.get(accountId);
  if (fc?.folders_json) {
    try { const f = safeJson(fc.folders_json,[]).find(x=>x.fullPath.toLowerCase()===folderKey); if(f) realFolder=f.fullPath; } catch {}
  }

  deleteImapEmailInBackground(account, realFolder, uid);
  res.json({ ok: true });
});

// ── Junk / Not Junk
app.post('/api/accounts/:accountId/messages/junk', async (req, res) => {
  const { uid, currentFolder, action, trustSender, senderEmail } = req.body;
  if (!uid || !currentFolder || !action) return res.status(400).json({ error: 'uid, currentFolder, action required' });

  const account = stmts.getAccount.get(req.params.accountId);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  // Resolve folder cache for real paths
  let realCurrentFolder = currentFolder;
  let spamFolder = 'Junk', inboxFolder = 'INBOX';
  const fc = stmts.getFolderCache.get(req.params.accountId);
  if (fc) {
    const disc = safeJson(fc.discovered_json, {});
    spamFolder  = disc.spam  || 'Junk';
    inboxFolder = disc.inbox || 'INBOX';
    const fList = safeJson(fc.folders_json, []);
    const folderKeyLow = (currentFolder || '').toLowerCase();
    const found = fList.find(x => x.fullPath.toLowerCase() === folderKeyLow);
    if (found) realCurrentFolder = found.fullPath;
  }

  const dstFolder = action === 'junk' ? spamFolder : inboxFolder;

  return new Promise((resolve) => {
    let done = false;
    const imap = makeImap(account);

    const cleanup = (error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { imap.destroy(); } catch {}
      if (!res.headersSent) {
        if (error) res.status(500).json({ error: typeof error === 'string' ? error : error.message || 'Operation failed' });
        else res.json({ ok: true });
      }
      resolve();
    };

    const timer = setTimeout(() => cleanup('Timeout: IMAP operation took too long'), 35000);

    imap.once('ready', () => {
      // Step 1: Open source folder in read-write mode
      imap.openBox(realCurrentFolder, false, (err) => {
        if (err) return cleanup(`Cannot open "${realCurrentFolder}": ${err.message}`);

        // Step 2: Search for the UID to confirm it exists
        imap.search([['UID', String(uid)]], (searchErr, uids) => {
          if (searchErr || !uids || uids.length === 0) {
            // Email already moved or doesn't exist — treat as success
            stmts.deleteSingleEmail.run(req.params.accountId, (currentFolder || '').toLowerCase(), String(uid));
            return cleanup(null);
          }

          // Step 3: Copy to destination folder
          imap.uid.copy(String(uid), dstFolder, (copyErr) => {
            if (copyErr) {
              // Try creating destination folder if copy fails
              imap.addBox(dstFolder, (addErr) => {
                if (addErr) return cleanup(`Cannot copy to "${dstFolder}": ${copyErr.message}`);
                // Retry copy after creating folder
                imap.uid.copy(String(uid), dstFolder, (copyErr2) => {
                  if (copyErr2) return cleanup(`Copy retry failed: ${copyErr2.message}`);
                  performDelete();
                });
              });
              return;
            }
            performDelete();
          });

          const performDelete = () => {
            // Step 4: Mark original as deleted
            imap.uid.addFlags(String(uid), '\\Deleted', (flagErr) => {
              if (flagErr) return cleanup(`Flag error: ${flagErr.message}`);

              // Step 5: Expunge
              imap.expunge((expErr) => {
                if (expErr) {
                  // Expunge failed but copy succeeded — still a partial success
                  console.warn('Expunge failed:', expErr.message);
                }

                // Step 6: Apply junk/notjunk flags on destination
                imap.openBox(dstFolder, false, (openDstErr) => {
                  if (!openDstErr) {
                    const flags = action === 'junk' ? ['\\Junk', '$Junk'] : ['\\NotJunk', '$NotJunk'];
                    imap.search([['SEEN', true], ['UNSEEN', true]], (_, newUids) => {
                      if (newUids && newUids.length) {
                        const targetUid = newUids[newUids.length - 1];
                        imap.uid.addFlags(String(targetUid), flags, () => {});
                      }
                    });
                  }

                  // Update local DB cache
                  stmts.deleteSingleEmail.run(req.params.accountId, (currentFolder || '').toLowerCase(), String(uid));

                  if (trustSender && action === 'notjunk' && senderEmail) {
                    try { stmts.insertPair.run('whitelist', senderEmail.toLowerCase().trim()); } catch {}
                  }

                  cleanup(null);
                });
              });
            });
          };
        });
      });
    });

    imap.on('error', (e) => cleanup(e));
    imap.on('end', () => { if (!done) cleanup('IMAP connection closed unexpectedly'); });
    try { imap.connect(); } catch (e) { cleanup(e); }
  });
});

// ── Send email
app.post('/api/accounts/:id/send', async (req, res) => {
  const account = stmts.getAccount.get(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const password = decrypt(account.password_enc);
  const { to, cc, bcc, subject, body, replyTo } = req.body;
  if (!to || !subject) return res.status(400).json({ error: 'to and subject required' });

  const smtpPort   = parseInt(account.smtp_port, 10) || 587;
  const smtpSecure = smtpPort === 465;

  

  

const trackId = req.body.trackId || null;

// Inject tracking pixel + wrap links with click tracking
let trackedBody = body || '';
if (trackId) {
  // 1. Open pixel (1x1 transparent GIF)
  if (TRACK_OPENS) {
    const pixelUrl = `${TRACK_BASE_URL}/track/open/${encodeURIComponent(trackId)}`;
    trackedBody += `<img src="${pixelUrl}" width="1" height="1" border="0" style="display:none;height:1px!important;width:1px!important;border-width:0!important;margin:0!important;padding:0!important" alt="" />`;
  }

  // 2. Click tracking — wrap all <a href> links
  if (TRACK_OPENS) {
    trackedBody = trackedBody.replace(
      /<a\s+([^>]*?)href=["']([^"'#][^"']*)["']([^>]*)>/gi,
      (match, pre, url, post) => {
        if (url.includes('/track/')) return match; // avoid double-wrapping
        const clickUrl = `${TRACK_BASE_URL}/track/click/${encodeURIComponent(trackId)}?url=${encodeURIComponent(url)}`;
        return `<a ${pre}href="${clickUrl}"${post}>`;
      }
    );
  }
}

const mailOptions = {
  from: `"${account.name}" <${account.email}>`,
  to, subject,
  html: trackedBody,
  text: (body || '').replace(/<[^>]+>/g, ''),
  headers: {
    'Disposition-Notification-To': account.email,
    'Return-Receipt-To': account.email,
    'X-Confirm-Reading-To': account.email,
    'X-Priority': '3',
    ...(trackId ? { 'X-MailOS-Track-ID': trackId } : {}),
    ...(req.body.listUnsubscribe ? { 'List-Unsubscribe': req.body.listUnsubscribe } : {}),
  },
};
  if (cc)  mailOptions.cc  = cc;
  if (bcc) mailOptions.bcc = bcc;

  try {
    const info = await networkRetry(async () => {
  const smtpPort   = parseInt(account.smtp_port, 10) || 587;
  const smtpSecure = smtpPort === 465;
  const transporter = nodemailer.createTransport({
    host: account.smtp_host, port: smtpPort, secure: smtpSecure,
    auth: { user: account.email, pass: password },
    tls: { rejectUnauthorized: false, servername: account.smtp_host, minVersion: 'TLSv1' },
    connectionTimeout: 45000, greetingTimeout: 20000, socketTimeout: 60000,
    pool: false,
  });
  try {
    const result = await transporter.sendMail(mailOptions);
    transporter.close();
    return result;
  } catch (err) {
    transporter.close();
    throw err;
  }
}, 1, 500);

    // Fire-and-forget: save to IMAP Sent (Isolated in its own try/catch boundary)
    const rawMime =[
      `From: "${account.name}" <${account.email}>`,
      `To: ${to}`, cc?`Cc: ${cc}`:'', bcc?`Bcc: ${bcc}`:'',
      `Subject: ${subject}`, `Date: ${new Date().toUTCString()}`,
      `MIME-Version: 1.0`, `Content-Type: text/html; charset=UTF-8`, ``,
      (trackedBody||'').slice(0, MAX_BODY_BYTES)
    ].filter(l=>l!=='').join('\r\n');
    
    // Major providers auto-save sent mail — skip IMAP append to avoid duplicates
    const AUTO_SAVE_SMTP = [
      'smtp.gmail.com','smtp.office365.com','smtp.mail.yahoo.com',
      'smtp.mail.me.com','smtpro.zoho.com','smtp.fastmail.com',
      'smtp.aol.com','mail.gmx.com','smtp.yandex.com'
    ];
    if (!AUTO_SAVE_SMTP.includes((account.smtp_host||'').toLowerCase())) {
      saveToIMAPSent(account, rawMime).catch(()=>{});
    }
    
    // Auto-add recipient to contacts
    autoContact(to, '');
    res.json({ ok: true, messageId: info.messageId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Safe migrations
try { db.exec(`ALTER TABLE email_tracking ADD COLUMN subject TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE cached_emails ADD COLUMN attachments_json TEXT NOT NULL DEFAULT '[]'`); } catch {}

// ── Attachment list for a message (from cached metadata)
app.get('/api/accounts/:accountId/messages/:uid/attachments', (req,res)=>{
  const row = db.prepare(`SELECT attachments_json FROM cached_emails WHERE account_id=? AND uid=?`).get(req.params.accountId, req.params.uid);
  res.json(safeJson(row?.attachments_json,'[]'));
});

// ── Download a specific attachment — re-fetches from IMAP on demand
app.get('/api/accounts/:accountId/messages/:uid/attachment/:idx', async (req,res)=>{
  const account = stmts.getAccount.get(req.params.accountId);
  if(!account) return res.status(404).json({error:'Account not found'});
  const row = db.prepare(`SELECT folder, attachments_json FROM cached_emails WHERE account_id=? AND uid=?`).get(req.params.accountId, req.params.uid);
  const atts = safeJson(row?.attachments_json,'[]');
  const idx = parseInt(req.params.idx)||0;
  const meta = atts[idx];
  if(!meta) return res.status(404).json({error:'Attachment not found'});

  const release = await imapSlot();
  const imap = makeImap(account);
  let done=false;
  const timer=setTimeout(()=>{ if(!done){done=true;release();try{imap.destroy();}catch{} if(!res.headersSent)res.status(504).json({error:'Timeout'});} },30000);

  imap.once('ready',()=>{
    imap.openBox(row?.folder||'INBOX',true,(err)=>{
      if(err){clearTimeout(timer);release();try{imap.destroy();}catch{} return res.status(500).json({error:err.message});}
      const f=imap.fetch([req.params.uid],{bodies:'',struct:true});
      const chunks=[];
      f.on('message',msg=>{msg.on('body',stream=>{stream.on('data',c=>chunks.push(c));});});
      f.once('end',async()=>{
        clearTimeout(timer);
        try{
          const parsed=await simpleParser(Buffer.concat(chunks));
          const att=parsed.attachments?.[idx];
          if(!att){release();try{imap.destroy();}catch{} return res.status(404).json({error:'Attachment index not found'});}
          res.setHeader('Content-Disposition',`attachment; filename="${encodeURIComponent(att.filename||'attachment')}"`);
          res.setHeader('Content-Type',att.contentType||'application/octet-stream');
          res.send(att.content);
        }catch(e){if(!res.headersSent)res.status(500).json({error:e.message});}
        release();try{imap.destroy();}catch{}
        done=true;
      });
      f.on('error',e=>{clearTimeout(timer);release();try{imap.destroy();}catch{} if(!res.headersSent)res.status(500).json({error:e.message});done=true;});
    });
  });
  imap.on('error',e=>{clearTimeout(timer);release();if(!res.headersSent)res.status(500).json({error:e.message});done=true;});
  imap.connect();
});

// ── Campaigns — lightweight list (no giant csv_rows)
app.get('/api/campaigns', (req, res) => {
  const rows = stmts.getAllCampaigns.all();
  res.json(rows.map(r => ({
    id:r.id, name:r.name, subject:r.subject, emailCol:r.email_col,
    senderIds:safeJson(r.sender_ids,[]), status:r.status,
  })));
});

app.get('/api/campaigns/:id', (req, res) => {
  const r = stmts.getCampaign.get(req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  res.json({
    id:r.id, name:r.name, subject:r.subject, pitch:r.pitch,
    fuPitch:r.fu_pitch, fuSubject:r.fu_subject, emailCol:r.email_col,
    csvHeaders:safeJson(r.csv_headers,[]), csvRows:safeJson(r.csv_rows,[]),
    senderIds:safeJson(r.sender_ids,[]), batchSize:r.batch_size,
    batchDelayMin:r.batch_delay_min, batchDelayMax:r.batch_delay_max,
    status:r.status,
  });
});

app.post('/api/campaigns', (req, res) => {
  const b=req.body, id=b.id||makeId();
  stmts.insertCampaign.run(id,b.name||'Untitled',b.subject||'',b.pitch||'',b.fuPitch||'',b.fuSubject||'',b.emailCol??-1,JSON.stringify(b.csvHeaders||[]),JSON.stringify(b.csvRows||[]),JSON.stringify(b.senderIds||[]),b.batchSize||10,b.batchDelayMin||15,b.batchDelayMax||35,b.status||'draft');
  res.status(201).json({ id });
});

app.put('/api/campaigns/:id', (req, res) => {
  const b  = req.body;
  const ex = stmts.getCampaign.get(req.params.id);
  
  if (!ex) {
    // UPSERT FIX: If the frontend has the campaign in LocalStorage but the backend lost it 
    // (e.g. DB reset, container restart), seamlessly recreate it instead of throwing 404
    // which previously caused an infinite retry loop and Foreign Key Constraint failures!
    try {
      stmts.insertCampaign.run(
        req.params.id,
        b.name || 'Restored Campaign',
        b.subject || '',
        b.pitch || '',
        b.fuPitch || '',
        b.fuSubject || '',
        b.emailCol ?? -1,
        b.csvHeaders ? (Array.isArray(b.csvHeaders) ? JSON.stringify(b.csvHeaders) : b.csvHeaders) : '[]',
        b.csvRows ? (Array.isArray(b.csvRows) ? JSON.stringify(b.csvRows) : b.csvRows) : '[]',
        b.senderIds ? (Array.isArray(b.senderIds) ? JSON.stringify(b.senderIds) : b.senderIds) : '[]',
        b.batchSize || 10,
        b.batchDelayMin || 15,
        b.batchDelayMax || 35,
        b.status || 'draft'
      );
      return res.json({ ok: true, restored: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  const name      = b.name      !== undefined ? b.name      : ex.name;
  const subject   = b.subject   !== undefined ? b.subject   : ex.subject;
  const pitch     = b.pitch     !== undefined ? b.pitch     : ex.pitch;
  const fuPitch   = b.fuPitch   !== undefined ? b.fuPitch   : ex.fu_pitch;
  const fuSubject = b.fuSubject !== undefined ? b.fuSubject : ex.fu_subject;
  const emailCol  = b.emailCol  !== undefined ? b.emailCol  : ex.email_col;
  const status    = b.status    !== undefined ? b.status    : ex.status;
  const batchSize = b.batchSize !== undefined ? b.batchSize : ex.batch_size;
  const batchDMin = b.batchDelayMin !== undefined ? b.batchDelayMin : ex.batch_delay_min;
  const batchDMax = b.batchDelayMax !== undefined ? b.batchDelayMax : ex.batch_delay_max;
  let csvHeaders = ex.csv_headers;
  let csvRows    = ex.csv_rows;
  if (b.csvHeaders !== undefined) {
    const inc = Array.isArray(b.csvHeaders) ? b.csvHeaders : safeJson(b.csvHeaders,[]);
    if (inc.length > 0 || b.clearCsv === true) csvHeaders = JSON.stringify(inc);
  }
  if (b.csvRows !== undefined) {
    const inc = Array.isArray(b.csvRows) ? b.csvRows : safeJson(b.csvRows,[]);
    if (inc.length > 0 || b.clearCsv === true) csvRows = JSON.stringify(inc);
  }
  let senderIds = ex.sender_ids;
  if (b.senderIds !== undefined) {
    const inc = Array.isArray(b.senderIds) ? b.senderIds : safeJson(b.senderIds, []);
    if (inc.length > 0 || b.clearSenders === true) senderIds = JSON.stringify(inc);
  }
  
  stmts.updateCampaign.run(name, subject, pitch, fuPitch, fuSubject,
    emailCol, csvHeaders, csvRows, senderIds,
    batchSize, batchDMin, batchDMax, status, req.params.id);
    
  res.json({ ok: true });
});

app.delete('/api/campaigns/:id', (req, res) => {
  try {
    db.prepare(`DELETE FROM campaign_history WHERE campaign_id=?`).run(req.params.id);
    db.prepare(`DELETE FROM sent_rows WHERE campaign_id=?`).run(req.params.id);
    db.prepare(`DELETE FROM email_tracking WHERE campaign_id=?`).run(req.params.id);
    db.prepare(`DELETE FROM campaigns WHERE id=?`).run(req.params.id);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/campaigns/:id/csv', (req, res) => {
  const ex = stmts.getCampaign.get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Not found' });
  try {
    db.prepare(`UPDATE campaigns SET csv_headers='[]', csv_rows='[]', email_col=-1,
      updated_at=datetime('now') WHERE id=?`).run(req.params.id);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/campaigns/:id/history', (req, res) => {
  const limit  = Math.min(10000, parseInt(req.query.limit  || '10000', 10));
  const offset = Math.max(0,     parseInt(req.query.offset || '0',     10));
  const rows = db.prepare(`
    SELECT id, row_idx, sent_at, sender_email, sender_name,
           to_email, subject, body_html, touch_type, row_data, track_id
    FROM campaign_history WHERE campaign_id=?
    ORDER BY sent_at ASC LIMIT ? OFFSET ?
  `).all(req.params.id, limit, offset);
  res.json(rows.map(r => ({
    id: r.id, rowIdx: r.row_idx, sentAt: r.sent_at,
    senderEmail: r.sender_email, senderName: r.sender_name,
    toEmail: r.to_email, subject: r.subject, bodyHTML: r.body_html || '',
    rowData: safeJson(r.row_data, []), touchType: r.touch_type, trackId: r.track_id || '',
  })));
});

app.post('/api/campaigns/:id/history', (req, res) => {
  const b = req.body;
  if (!b.toEmail || !b.sentAt) return res.status(400).json({ error: 'toEmail and sentAt required' });
  const sentAtNorm = b.sentAt.replace(/\.\d+Z$/, 'Z').replace(/\.\d+$/, '');

  try {
    const performSave = db.transaction(() => {
      if (b.trackId) {
        const trkDup = db.prepare(
          `SELECT id FROM campaign_history WHERE campaign_id=? AND track_id=? LIMIT 1`
        ).get(req.params.id, b.trackId);
        if (trkDup) return { duplicate: true };
      }
      const existing = db.prepare(`
        SELECT id FROM campaign_history
        WHERE campaign_id=? AND to_email=? AND touch_type=?
          AND strftime('%Y-%m-%dT%H:%M', sent_at)=strftime('%Y-%m-%dT%H:%M', ?)
        LIMIT 1
      `).get(req.params.id, b.toEmail, b.touchType || 'first', sentAtNorm);

      if (existing) return { duplicate: true };

      stmts.insertHistory.run(
        req.params.id, b.rowIdx, sentAtNorm,
        b.senderEmail, b.senderName || '', b.toEmail, b.subject || '',
        (b.bodyHTML || '').slice(0, 100000),
        JSON.stringify(b.rowData || []), b.touchType || 'first', 
        b.trackId || ''
      );

      // 3. Insert Tracking Record in the exact same transaction
      if (b.trackId) {
        db.prepare(`
          INSERT OR IGNORE INTO email_tracking(id,campaign_id,to_email,sender_email,subject,touch_type,sent_at)
          VALUES(?,?,?,?,?,?,?)
        `).run(b.trackId, req.params.id, b.toEmail, b.senderEmail, b.subject || '', b.touchType || 'first', sentAtNorm);
      }

      // 4. Global Pairs
      if (b.senderEmail && b.toEmail) {
        stmts.insertPair.run(b.senderEmail.toLowerCase(), b.toEmail.toLowerCase());
      }

      return { duplicate: false };
    }); // <-- Closes the db.transaction block

    // Execute the transaction
    const result = performSave();

    if (result.duplicate) {
      // #region agent log
      fetch('http://127.0.0.1:7637/ingest/31a40364-5d72-4efd-affa-1ca1d1d2bcee',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0d63d2'},body:JSON.stringify({sessionId:'0d63d2',hypothesisId:'H5',location:'server.js:POST history',message:'duplicate skipped',data:{campId:req.params.id,hasTrack:!!b.trackId,rowIdx:b.rowIdx},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return res.status(200).json({ ok: true, duplicate: true });
    }

    // #region agent log
    fetch('http://127.0.0.1:7637/ingest/31a40364-5d72-4efd-affa-1ca1d1d2bcee',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'0d63d2'},body:JSON.stringify({sessionId:'0d63d2',hypothesisId:'H5',location:'server.js:POST history',message:'inserted',data:{campId:req.params.id,hasTrack:!!b.trackId,rowIdx:b.rowIdx},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    autoContact(b.toEmail, '');
    res.status(201).json({ ok: true });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}); // <-- Closes the app.post route

// ── Scan inboxes for tracking signals (call after campaign, or on History tab open)
app.post('/api/campaigns/:id/scan-tracking', async (req, res) => {
  const campId = req.params.id;
  try {
    // Load all tracking records for this campaign
    const rows = db.prepare('SELECT * FROM email_tracking WHERE campaign_id=?').all(campId);
    if (!rows.length) return res.json({ scanned: 0, found: 0 });

    // Build map: trackId -> { toEmail, subject }
    const trackingMap = {};
    rows.forEach(r => { trackingMap[r.id] = { toEmail: r.to_email, subject: r.subject || '', trackId: r.id }; });

    // Group by sender account
    const bySender = {};
    rows.forEach(r => {
      if (!bySender[r.sender_email]) bySender[r.sender_email] = {};
      bySender[r.sender_email][r.id] = trackingMap[r.id];
    });

    let totalFound = 0;
    const senderEmails = Object.keys(bySender);

    await Promise.all(senderEmails.map(async senderEmail => {
      // Find account by email
      const account = db.prepare('SELECT * FROM accounts WHERE lower(email)=lower(?)').get(senderEmail);
      if (!account) return;
      try {
        const results = await scanInboxForTracking(account, campId, bySender[senderEmail]);
        if (results.length > 0) {
          applyTrackingResults(results);
          totalFound += results.length;
        }
      } catch {}
    }));

    res.json({ scanned: senderEmails.length, found: totalFound });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════════
// ENTERPRISE TRACKING ENGINE
// Multi-signal: MDN receipts + Bounce detection + Auto-reply + Reply
// ══════════════════════════════════════════════════════════════════

// Enhanced inbox scanner — checks ALL folders for tracking signals
async function scanAllFoldersForTracking(account, campaignId, trackingMap) {
  const release = await imapSlot();
  return new Promise((resolve) => {
    const imap = makeImap(account);
    const results = [];
    let done = false;

    const cleanup = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { imap.destroy(); } catch {}
      release();
      resolve(results);
    };

    const timer = setTimeout(cleanup, 90000);

    imap.once('ready', async () => {
      try {
        // Discover real folder paths
        const discovered = await discoverIMAPFolders(imap);
        
        // Scan these folders for signals
        const foldersToScan = [
          discovered.inbox || 'INBOX',
          discovered.sent  || 'Sent',
          discovered.spam  || 'Junk',
        ].filter(Boolean);

        for (const folderPath of foldersToScan) {
          await new Promise((folderResolve) => {
            let folderDone = false;
            const folderCleanup = () => { if (!folderDone) { folderDone = true; folderResolve(); } };
            const folderTimer = setTimeout(folderCleanup, 25000);

            imap.openBox(folderPath, true, (err, box) => {
              if (err || !box || box.messages.total === 0) {
                clearTimeout(folderTimer);
                return folderResolve();
              }

              // Search last 14 days
              const since = new Date();
              since.setDate(since.getDate() - 14);
              const dd  = String(since.getDate()).padStart(2, '0');
              const mmm = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][since.getMonth()];
              const sinceStr = `${dd}-${mmm}-${since.getFullYear()}`;

              imap.search([['SINCE', sinceStr]], (e2, uids) => {
                if (e2 || !uids?.length) {
                  clearTimeout(folderTimer);
                  return folderResolve();
                }

                const toFetch = uids.slice(-300);
                let pending = 0;
                let fetchDone = false;

                const checkFolderDone = () => {
                  if (fetchDone && pending === 0) {
                    clearTimeout(folderTimer);
                    folderResolve();
                  }
                };

                const fetchStream = imap.fetch(toFetch, { bodies: '' });

                fetchStream.on('message', msg => {
                  pending++;
                  const chunks = [];
                  msg.on('body', stream => { stream.on('data', c => chunks.push(c)); });
                  msg.once('end', () => {
                    simpleParser(Buffer.concat(chunks), { skipImageLinks: true })
                      .then(parsed => {
                        const signal = extractTrackingSignal(parsed, trackingMap);
                        if (signal) results.push(signal);
                      })
                      .catch(() => {})
                      .finally(() => { pending--; checkFolderDone(); });
                  });
                });

                fetchStream.once('end', () => { fetchDone = true; checkFolderDone(); });
                fetchStream.on('error', () => { fetchDone = true; checkFolderDone(); });
              });
            });
          });
        }
        cleanup();
      } catch { cleanup(); }
    });

    imap.on('error', cleanup);
    imap.on('end', () => { if (!done) cleanup(); });
    imap.connect();
  });
}

// Extract tracking signal from a single parsed email
function extractTrackingSignal(parsed, trackingMap) {
  const subject   = (parsed.subject || '').toLowerCase().trim();
  const fromEmail = (parsed.from?.value?.[0]?.address || '').toLowerCase().trim();
  const ct        = String(parsed.headers?.get ? (parsed.headers.get('content-type') || '') : '').toLowerCase();
  const autoSub   = String(parsed.headers?.get ? (parsed.headers.get('auto-submitted') || '') : '').toLowerCase();
  const xAutoReply= String(parsed.headers?.get ? (parsed.headers.get('x-autoreply') || '') : '').toLowerCase();
  const text      = (parsed.text || '').toLowerCase();
  const fullRaw   = subject + ' ' + fromEmail + ' ' + text.slice(0, 500);

  // ── 1. MDN (Read Receipt / Disposition Notification)
  const isMDN = ct.includes('disposition-notification') ||
    ct.includes('multipart/report') ||
    /disposition-notification|read.*receipt|mdn|delivery.*status/i.test(subject) ||
    /final-recipient|original-message-id|disposition:/i.test(text);

  if (isMDN) {
    // Try to find track ID from custom header embedded in original
    const trackMatch = text.match(/x-mailos-track-id[:\s]+([a-z0-9_]+)/i)
      || (parsed.text || '').match(/x-mailos-track-id[:\s]+([a-z0-9_]+)/i);
    if (trackMatch?.[1] && trackingMap[trackMatch[1]]) {
      return { trackId: trackMatch[1], type: 'open', toEmail: trackingMap[trackMatch[1]].toEmail };
    }
    // Match by original-message-id or recipient
    const recipMatch = text.match(/final-recipient[^:]*:[^;]*;\s*([^\r\n\s]+)/i)
      || text.match(/original-recipient[^:]*:[^;]*;\s*([^\r\n\s]+)/i);
    if (recipMatch?.[1]) {
      const recip = recipMatch[1].toLowerCase().trim();
      const entry = Object.values(trackingMap).find(e => e.toEmail === recip);
      if (entry) return { trackId: entry.trackId, type: 'open', toEmail: recip };
    }
  }

  // ── 2. Bounce / NDR
  const isBounce = /mailer-daemon|postmaster|mail delivery subsystem|undeliverable|delivery.*fail|delivery.*status|non-delivery|ndrsupport|bounced|failed delivery/i.test(fromEmail + ' ' + subject) ||
    (ct.includes('multipart/report') && ct.includes('delivery-status'));

  if (isBounce) {
    // Extract original recipient from NDR body
    const ndrPatterns = [
      /final-recipient[^:]*:[^;]*;\s*([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i,
      /failed recipient.*?([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i,
      /to:\s*([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i,
    ];
    for (const pat of ndrPatterns) {
      const m = text.match(pat);
      if (m?.[1]) {
        const victim = m[1].toLowerCase().trim();
        const entry = Object.values(trackingMap).find(e => e.toEmail === victim);
        if (entry) return { trackId: entry.trackId, type: 'bounce', toEmail: victim };
      }
    }
    // Try to match by subject containing original subject
    const cleanSubj = subject.replace(/^(undeliverable|delivery.*failed|bounced)[:\s]*/i, '').trim();
    if (cleanSubj) {
      const entry = Object.values(trackingMap).find(e =>
        e.subject && cleanSubj.includes(e.subject.toLowerCase().slice(0, 25)));
      if (entry) return { trackId: entry.trackId, type: 'bounce', toEmail: entry.toEmail };
    }
  }

  // ── 3. Auto-Reply / OOO
  const isAuto = /^auto(-|\s)?(reply|generated|responded)|out of office|vacation reply|automatic reply|i am out|away from office|maternity|currently unavailable/i.test(subject) ||
    autoSub.includes('auto-replied') || autoSub.includes('auto-generated') ||
    xAutoReply.length > 0 ||
    /out of office|auto.?reply|automatic reply|vacation|on leave|away|no longer with/i.test(text.slice(0, 300));

  if (isAuto && fromEmail) {
    const entry = Object.values(trackingMap).find(e => e.toEmail === fromEmail);
    if (entry) return { trackId: entry.trackId, type: 'auto', toEmail: fromEmail };
    // Fuzzy subject match
    const cleanSubj = subject.replace(/^(re[:\s]+|auto[:\s]+reply[:\s]+|automatic reply[:\s]+|out of office[:\s]+)+/i, '').trim();
    const bySubj = Object.values(trackingMap).find(e =>
      cleanSubj && e.subject && cleanSubj.includes((e.subject || '').toLowerCase().slice(0, 20)));
    if (bySubj) return { trackId: bySubj.trackId, type: 'auto', toEmail: bySubj.toEmail };
  }

  // ── 4. Human Reply (RE:)
  const isReply = (subject.startsWith('re:') || subject.startsWith('re[') || subject.startsWith('re :')) &&
    !isAuto && !isBounce;

  if (isReply && fromEmail) {
    const entry = Object.values(trackingMap).find(e => e.toEmail === fromEmail);
    if (entry) return { trackId: entry.trackId, type: 'reply', toEmail: fromEmail };
    // Try subject-based match
    const cleanSubj = subject.replace(/^(re[:\[]\s*)+/i, '').trim();
    const bySubj = Object.values(trackingMap).find(e =>
      cleanSubj && e.subject &&
      (e.subject.toLowerCase().includes(cleanSubj.slice(0, 25)) ||
       cleanSubj.includes((e.subject || '').toLowerCase().slice(0, 25))));
    if (bySubj) return { trackId: bySubj.trackId, type: 'reply', toEmail: bySubj.toEmail };
  }

  return null;
}

// ── Replace the old scan-tracking route entirely:
app.post('/api/campaigns/:id/scan-tracking', async (req, res) => {
  const campId = req.params.id;
  try {
    const rows = db.prepare('SELECT * FROM email_tracking WHERE campaign_id=?').all(campId);
    if (!rows.length) return res.json({ scanned: 0, found: 0, message: 'No tracking records found. Make sure you launched the campaign first.' });

    // Build per-sender tracking maps
    const bySender = {};
    rows.forEach(r => {
      const key = (r.sender_email || '').toLowerCase();
      if (!bySender[key]) bySender[key] = {};
      bySender[key][r.id] = { toEmail: r.to_email, subject: r.subject || '', trackId: r.id };
    });

    let totalFound = 0;
    const senderEmails = Object.keys(bySender);

    await Promise.all(senderEmails.map(async senderEmail => {
      const account = db.prepare('SELECT * FROM accounts WHERE lower(email)=lower(?)').get(senderEmail);
      if (!account) return;
      try {
        const signals = await scanAllFoldersForTracking(account, campId, bySender[senderEmail]);
        if (signals.length > 0) {
          applyTrackingResults(signals);
          totalFound += signals.length;
        }
      } catch (e) {
        console.warn(`Scan failed for ${senderEmail}:`, e.message);
      }
    }));

    // Return updated stats
    const updated = db.prepare('SELECT * FROM email_tracking WHERE campaign_id=?').all(campId);
    res.json({
      scanned: senderEmails.length,
      found: totalFound,
      opens: updated.filter(r => r.opened).length,
      bounces: updated.filter(r => r.bounced).length,
      replies: updated.filter(r => r.replied).length,
      autoReplies: updated.filter(r => r.auto_reply).length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Insert tracking record when campaign email is sent
app.post('/api/campaigns/:id/tracking-record', (req, res) => {
  const { trackId, toEmail, senderEmail, subject, touchType } = req.body;
  if (!trackId || !toEmail) return res.status(400).json({ error: 'trackId and toEmail required' });
  try {
    db.prepare(`INSERT OR IGNORE INTO email_tracking(id,campaign_id,to_email,sender_email,subject,touch_type,sent_at)
      VALUES(?,?,?,?,?,?,datetime('now'))`).run(trackId, req.params.id, toEmail, senderEmail, subject||'', touchType||'first');
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/campaigns/:id/sent-rows', (req, res) => {
  try { res.json(stmts.getSentRows.all(req.params.id).map(r => r.row_idx)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/campaigns/:id/sent-rows', (req, res) => {
  try { stmts.insertSentRow.run(req.params.id, req.body.rowIdx); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/global-pairs',  (req, res) => res.json(stmts.getPairs.all().map(r=>`${r.sender_email}::${r.recipient_email}`)));
app.post('/api/global-pairs', (req, res) => { stmts.insertPair.run((req.body.senderEmail||'').toLowerCase(),(req.body.recipientEmail||'').toLowerCase()); res.json({ok:true}); });

// ═══════════════════════════════════════════════════════════════════
// SSE — server-sent events for real-time new mail push
// ═══════════════════════════════════════════════════════════════════
const _sseClients = new Set();

app.get('/api/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  res.write('event: connected\ndata: {}\n\n');
  _sseClients.add(res);
  const hb = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { clearInterval(hb); _sseClients.delete(res); }
  }, 25000);
  req.on('close', () => { clearInterval(hb); _sseClients.delete(res); });
});

function ssePush(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of _sseClients) { try { c.write(msg); } catch { _sseClients.delete(c); } }
}

// ── Contacts API ──────────────────────────────────────────────
app.get('/api/contacts', (req,res)=>{
  const q=(req.query.q||'').toLowerCase();
  const rows = q
    ? db.prepare(`SELECT * FROM contacts WHERE lower(email) LIKE ? OR lower(name) LIKE ? OR lower(company) LIKE ? ORDER BY times_contacted DESC LIMIT 200`).all(`%${q}%`,`%${q}%`,`%${q}%`)
    : db.prepare(`SELECT * FROM contacts ORDER BY times_contacted DESC LIMIT 500`).all();
  res.json(rows);
});

app.post('/api/contacts', (req,res)=>{
  const{email,name='',company='',notes=''}=req.body;
  if(!email)return res.status(400).json({error:'email required'});
  const id=makeId();
  try{
    db.prepare(`INSERT INTO contacts(id,email,name,company,notes,source) VALUES(?,?,?,?,?,'manual') ON CONFLICT(email) DO UPDATE SET name=COALESCE(NULLIF(excluded.name,''),name), company=COALESCE(NULLIF(excluded.company,''),company), notes=COALESCE(NULLIF(excluded.notes,''),notes)`).run(id,email.toLowerCase().trim(),name,company,notes);
    res.status(201).json({ok:true});
  }catch(e){res.status(500).json({error:e.message});}
});

app.patch('/api/contacts/:id', (req,res)=>{
  const{name,company,notes}=req.body;
  db.prepare(`UPDATE contacts SET name=?,company=?,notes=? WHERE id=?`).run(name||'',company||'',notes||'',req.params.id);
  res.json({ok:true});
});

app.delete('/api/contacts/:id', (req,res)=>{
  db.prepare(`DELETE FROM contacts WHERE id=?`).run(req.params.id);
  res.json({ok:true});
});

// Auto-upsert contact on every send
function autoContact(email, name='') {
  if (!email) return;
  const em = email.toLowerCase().trim();
  try {
    db.prepare(`INSERT INTO contacts(id,email,name,times_contacted,last_seen,source) VALUES(?,?,?,1,datetime('now'),'auto')
      ON CONFLICT(email) DO UPDATE SET times_contacted=times_contacted+1, last_seen=datetime('now'),
      name=CASE WHEN name='' AND excluded.name!='' THEN excluded.name ELSE name END`).run(makeId(),em,name||'');
  } catch {}
}

app.listen(PORT, () => {
  console.log(`MailOS running on http://localhost:${PORT}`);
});

module.exports = app;
