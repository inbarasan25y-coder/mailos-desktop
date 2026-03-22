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

  insertCampaign   : db.prepare(`INSERT INTO campaigns(id,name,subject,pitch,fu_pitch,fu_subject,email_col,csv_headers,csv_rows,sender_ids,batch_size,batch_delay_min,batch_delay_max,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  updateCampaign   : db.prepare(`UPDATE campaigns SET name=?,subject=?,pitch=?,fu_pitch=?,fu_subject=?,email_col=?,csv_headers=?,csv_rows=?,sender_ids=?,batch_size=?,batch_delay_min=?,batch_delay_max=?,status=?,updated_at=datetime('now') WHERE id=?`),
  getCampaign      : db.prepare(`SELECT * FROM campaigns WHERE id=?`),
  getAllCampaigns   : db.prepare(`SELECT * FROM campaigns ORDER BY created_at DESC`),
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
  getEmails        : db.prepare(`SELECT * FROM cached_emails WHERE account_id=? AND folder=? ORDER BY date DESC`),
  updateRead       : db.prepare(`UPDATE cached_emails SET is_read=? WHERE id=?`),
  updateStarred    : db.prepare(`UPDATE cached_emails SET is_starred=? WHERE id=?`),
  deleteAccEmails  : db.prepare(`DELETE FROM cached_emails WHERE account_id=?`),
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
  const autoKw = ['auto-reply','automatic reply','out of office','vacation reply',
                  'noreply','no-reply','do not reply','donotreply','autoreply','away message'];
  if (autoKw.some(k => s.includes(k) || e.includes(k) || p.includes(k))) return 'auto';
  if (s.startsWith('re:')) return 'reply';
  if (s.includes('undeliverable') || s.includes('delivery failed') || s.includes('bounce')) return 'bounce';
  return 'normal';
}

// ─── IMAP fetch — fetches full raw email so simpleParser decodes everything ──
async function fetchIMAPMsgs(account, folder = 'INBOX', maxMsgs = 500) {
  return new Promise((resolve, reject) => {
    const password = decrypt(account.password_enc);
    const imap = new Imap({
      user: account.email, password,
      host: account.imap_host, port: account.imap_port,
      tls: !!account.imap_secure, tlsOptions: { rejectUnauthorized: false },
      connTimeout: 20000, authTimeout: 15000,
    });
    const messages = [];
    imap.once('ready', () => {
      imap.openBox(folder, true, (err, box) => {
        if (err) { imap.end(); return reject(err); }
        const total = box.messages.total;
        if (total === 0) { imap.end(); return resolve([]); }
        const start = Math.max(1, total - maxMsgs + 1);
        // Fetch full raw message — lets simpleParser handle ALL encoding/MIME
        const fetch = imap.seq.fetch(`${start}:*`, { bodies: [''], struct: true });
        fetch.on('message', (msg, seqno) => {
          let raw = '', attrs = {};
          msg.on('body', stream => { stream.on('data', c => raw += c); });
          msg.once('attributes', a => { attrs = a; });
          msg.once('end', () => messages.push({ raw, attrs, seqno }));
        });
        fetch.once('end', () => imap.end());
        fetch.once('error', e => { imap.end(); reject(e); });
      });
    });
    imap.once('error', reject);
    imap.once('end', () => resolve(messages));
    imap.connect();
  });
}

async function parseIMAPMessage(raw, accountId, folder) {
  try {
    // simpleParser handles base64, quoted-printable, multipart — everything
    const parsed    = await simpleParser(raw.raw);
    const uid       = String(raw.attrs?.uid || raw.seqno || Math.random());
    const id        = `${accountId}:${folder}:${uid}`;
    const fromName  = parsed.from?.value?.[0]?.name    || '';
    const fromEmail = parsed.from?.value?.[0]?.address || '';
    const toArr     = (parsed.to?.value || []).map(t => ({ name: t.name||'', email: t.address||'' }));
    const subject   = parsed.subject || '';
    const bodyHtml  = parsed.html || parsed.textAsHtml || parsed.text || '';
    const preview   = (parsed.text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    const date      = (parsed.date || new Date()).toISOString();
    const hasAtt    = (parsed.attachments || []).length > 0 ? 1 : 0;
    const msgType   = classifyEmail(subject, fromEmail, preview);
    const flags     = raw.attrs?.flags || [];
    const isRead    = flags.includes('\\Seen') ? 1 : 0;
    return { id, accountId, folder: folder.toLowerCase(), uid, fromName, fromEmail,
             toArr: JSON.stringify(toArr), subject, bodyHtml, preview, date,
             isRead, isStarred: 0, hasAtt, msgType };
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
// EXPRESS APP
// ═══════════════════════════════════════════════════════════════
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── PRESETS ───────────────────────────────────────────────────
const PRESETS = {
  'gmail.com'     : { host:'imap.gmail.com', port:993, secure:true, smtpHost:'smtp.gmail.com', smtpPort:587, smtpSecure:false },
  'googlemail.com': { host:'imap.gmail.com', port:993, secure:true, smtpHost:'smtp.gmail.com', smtpPort:587, smtpSecure:false },
  'outlook.com'   : { host:'outlook.office365.com', port:993, secure:true, smtpHost:'smtp.office365.com', smtpPort:587, smtpSecure:false },
  'hotmail.com'   : { host:'outlook.office365.com', port:993, secure:true, smtpHost:'smtp.office365.com', smtpPort:587, smtpSecure:false },
  'yahoo.com'     : { host:'imap.mail.yahoo.com', port:993, secure:true, smtpHost:'smtp.mail.yahoo.com', smtpPort:587, smtpSecure:false },
  'icloud.com'    : { host:'imap.mail.me.com', port:993, secure:true, smtpHost:'smtp.mail.me.com', smtpPort:587, smtpSecure:false },
};

app.get('/api/presets/:email', (req, res) => {
  const domain = (req.params.email.split('@')[1] || '').toLowerCase();
  const p = PRESETS[domain];
  if (!p) return res.status(404).json({ error: 'No preset' });
  res.json(p);
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
      imap.once('error', reject);
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
  const preset      = PRESETS[(email.split('@')[1] || '').toLowerCase()] || {};
  try {
    stmts.insertAccount.run(id, name || email.split('@')[0], email, passwordEnc,
      imapHost || preset.host || 'imap.gmail.com',
      imapPort || preset.port || 993,
      imapSecure !== undefined ? (imapSecure ? 1 : 0) : (preset.secure ? 1 : 0),
      smtpHost || preset.smtpHost || 'smtp.gmail.com',
      smtpPort || preset.smtpPort || 587,
      smtpSecure !== undefined ? (smtpSecure ? 1 : 0) : (preset.smtpSecure ? 1 : 0));
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

// ── SIGNATURES ────────────────────────────────────────────────
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

// ── EMAIL FETCH ───────────────────────────────────────────────
async function syncFolder(accountId, folder, refresh) {
  const account = stmts.getAccount.get(accountId);
  if (!account) throw new Error('Account not found');

  if (!refresh) {
    const cached = stmts.getEmails.all(accountId, folder.toLowerCase());
    if (cached.length) return cached.map(emailRow);
  }

  const imapFolder = folder === 'sent' ? '[Gmail]/Sent Mail' : 'INBOX';
  const rawMsgs    = await fetchIMAPMsgs(account, imapFolder, 500);

  const insertMany = db.transaction(msgs => {
    for (const m of msgs) {
      if (!m) continue;
      stmts.upsertEmail.run(m.id, m.accountId, m.folder, m.uid, m.fromName, m.fromEmail,
        m.toArr, m.subject, m.bodyHtml, m.preview, m.date, m.isRead, m.isStarred, m.hasAtt, m.msgType);
    }
  });

  const parsed = await Promise.all(rawMsgs.map(r => parseIMAPMessage(r, accountId, folder)));
  insertMany(parsed.filter(Boolean));
  return stmts.getEmails.all(accountId, folder.toLowerCase()).map(emailRow);
}

app.get('/api/accounts/:id/inbox', async (req, res) => {
  try { res.json(await syncFolder(req.params.id, 'inbox', !!req.query.refresh)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/accounts/:id/sent', async (req, res) => {
  try { res.json(await syncFolder(req.params.id, 'sent', !!req.query.refresh)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── READ / STAR ───────────────────────────────────────────────
app.patch('/api/accounts/:accountId/messages/:uid/read', (req, res) => {
  stmts.updateRead.run(req.body.read ? 1 : 0, `${req.params.accountId}:inbox:${req.params.uid}`);
  res.json({ ok: true });
});

app.patch('/api/accounts/:accountId/messages/:uid/star', (req, res) => {
  const folder = (req.body.folder || 'inbox').includes('sent') ? 'sent' : 'inbox';
  stmts.updateStarred.run(req.body.starred ? 1 : 0, `${req.params.accountId}:${folder}:${req.params.uid}`);
  res.json({ ok: true });
});

// ── SEND ─────────────────────────────────────────────────────
app.post('/api/accounts/:id/send', async (req, res) => {
  const account = stmts.getAccount.get(req.params.id);
  if (!account) return res.status(404).json({ error: 'Account not found' });
  const password    = decrypt(account.password_enc);
  const { to, cc, bcc, subject, body, replyTo } = req.body;
  const transporter = nodemailer.createTransport({
    host: account.smtp_host, port: account.smtp_port, secure: !!account.smtp_secure,
    auth: { user: account.email, pass: password }, tls: { rejectUnauthorized: false },
  });
  try {
    await transporter.sendMail({
      from: `"${account.name}" <${account.email}>`,
      to, cc, bcc, subject,
      html: body, text: body.replace(/<[^>]+>/g, ''),
      inReplyTo: replyTo,
    });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── CAMPAIGNS ─────────────────────────────────────────────────
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

// ── CAMPAIGN HISTORY ──────────────────────────────────────────
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

// ── SENT ROWS ─────────────────────────────────────────────────
app.get('/api/campaigns/:id/sent-rows', (req, res) => {
  res.json(stmts.getSentRows.all(req.params.id).map(r => r.row_idx));
});
app.post('/api/campaigns/:id/sent-rows', (req, res) => {
  stmts.insertSentRow.run(req.params.id, req.body.rowIdx);
  res.json({ ok: true });
});

// ── GLOBAL PAIRS ──────────────────────────────────────────────
app.get('/api/global-pairs', (req, res) => {
  res.json(stmts.getPairs.all().map(r => `${r.sender_email}::${r.recipient_email}`));
});
app.post('/api/global-pairs', (req, res) => {
  stmts.insertPair.run((req.body.senderEmail||'').toLowerCase(), (req.body.recipientEmail||'').toLowerCase());
  res.json({ ok: true });
});

// ── HEALTH ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: DB_PATH, uptime: process.uptime() }));

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  MailOS Backend running on http://localhost:${PORT}`);
  console.log(`📁  Database: ${DB_PATH}`);
  console.log(`🔐  Encryption: AES-256-GCM\n`);
});

module.exports = app;
