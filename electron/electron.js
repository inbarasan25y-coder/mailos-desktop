'use strict';

const { app, BrowserWindow, Tray, Menu, nativeImage,
        ipcMain, shell, dialog, safeStorage } = require('electron');
const path   = require('path');
const fs     = require('fs');
const http   = require('http');
const { fork } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';

const ROOT = app.isPackaged
  ? process.resourcesPath
  : path.join(__dirname, '..');

const SERVER_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'app.asar.unpacked', 'server.js')
  : path.join(ROOT, 'server.js');

const USER_DATA = app.getPath('userData');
const DB_PATH   = path.join(USER_DATA, 'mailOS.db');
const KEY_FILE  = path.join(USER_DATA, 'key.enc');
const ENV_PATH  = path.join(USER_DATA, '.env');

if (!app.requestSingleInstanceLock()) { app.quit(); process.exit(0); }

let mainWindow = null;
let tray       = null;
let serverProc = null;
const serverPort = 5001;

// ── Encryption key via OS Keychain ───────────────────────────
function getOrCreateMasterKey() {
  if (safeStorage.isEncryptionAvailable()) {
    if (fs.existsSync(KEY_FILE)) {
      try { return safeStorage.decryptString(fs.readFileSync(KEY_FILE)); }
      catch (e) { console.error('Key corrupted, regenerating'); }
    }
    const { randomBytes } = require('crypto');
    const keyHex = randomBytes(32).toString('hex');
    fs.mkdirSync(path.dirname(KEY_FILE), { recursive: true });
    fs.writeFileSync(KEY_FILE, safeStorage.encryptString(keyHex));
    return keyHex;
  } else {
    if (fs.existsSync(ENV_PATH)) {
      const m = fs.readFileSync(ENV_PATH, 'utf8').match(/MASTER_KEY=([a-f0-9]{64})/);
      if (m) return m[1];
    }
    const { randomBytes } = require('crypto');
    const keyHex = randomBytes(32).toString('hex');
    fs.mkdirSync(path.dirname(ENV_PATH), { recursive: true });
    fs.writeFileSync(ENV_PATH, `MASTER_KEY=${keyHex}\nPORT=${serverPort}\nDB_PATH=${DB_PATH}\n`);
    return keyHex;
  }
}

// ── Backend server ───────────────────────────────────────────
function startServer(masterKey) {
  return new Promise((resolve, reject) => {
    serverProc = fork(SERVER_PATH, [], {
      env: { ...process.env, MASTER_KEY: masterKey, DB_PATH, PORT: String(serverPort), NODE_ENV: 'production',
             NODE_PATH: app.isPackaged ? path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules') : path.join(ROOT, 'node_modules') },
      silent: true,
      cwd: app.isPackaged ? path.join(process.resourcesPath, 'app.asar.unpacked') : ROOT,
    });
    serverProc.stdout?.on('data', d => {
      const msg = d.toString();
      console.log('[SERVER]', msg.trim());
      if (msg.includes(`running on http://localhost:${serverPort}`)) resolve();
    });
    serverProc.stderr?.on('data', d => console.error('[SERVER ERR]', d.toString()));
    serverProc.on('error', reject);
    let attempts = 0;
    const check = setInterval(async () => {
      try { await pingServer(); clearInterval(check); resolve(); }
      catch { if (++attempts > 20) { clearInterval(check); reject(new Error('Server failed to start')); } }
    }, 500);
  });
}

function pingServer() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${serverPort}/api/health`, res => {
      res.statusCode === 200 ? resolve() : reject();
    });
    req.on('error', reject);
    req.setTimeout(2000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── Tray ─────────────────────────────────────────────────────
function createTray() {
  try {
    tray = new Tray(nativeImage.createEmpty());
    tray.setToolTip('MailOS');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Open MailOS', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
      { type: 'separator' },
      { label: 'Quit', click: () => { app.isQuiting = true; app.quit(); } },
    ]));
    tray.on('double-click', () => { mainWindow?.show(); mainWindow?.focus(); });
  } catch (e) { console.log('Tray error (non-critical):', e.message); }
}

// ── Main Window ───────────────────────────────────────────────
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400, height: 900, minWidth: 900, minHeight: 600,
    title: 'MailOS', backgroundColor: '#f6f8fc', show: false,
    webPreferences: {
      nodeIntegration: false, contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), webSecurity: true,
    },
  });

  if (isDev) {
    await mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.once('ready-to-show', () => { mainWindow.show(); mainWindow.focus(); });
  mainWindow.on('close', e => { if (!app.isQuiting) { e.preventDefault(); mainWindow.hide(); } });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

// ── IPC ───────────────────────────────────────────────────────
ipcMain.handle('get-app-info', () => ({ version: app.getVersion(), platform: process.platform, userData: USER_DATA, dbPath: DB_PATH }));
ipcMain.handle('show-window',  () => { mainWindow?.show(); mainWindow?.focus(); });
ipcMain.handle('minimize',     () => mainWindow?.minimize());
ipcMain.handle('maximize',     () => mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow?.maximize());
ipcMain.handle('open-external', (_, url) => shell.openExternal(url));
ipcMain.handle('show-notification', (_, { title, body }) => {
  try { const { Notification } = require('electron'); if (Notification.isSupported()) new Notification({ title, body }).show(); } catch {}
});

app.on('second-instance', () => { if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.show(); mainWindow.focus(); } });

// ── Lifecycle ─────────────────────────────────────────────────
app.whenReady().then(async () => {
  console.log('MailOS starting... packaged:', app.isPackaged);

  let masterKey;
  try { masterKey = getOrCreateMasterKey(); }
  catch (e) { dialog.showErrorBox('Encryption Error', e.message); app.quit(); return; }

  try { await startServer(masterKey); console.log('Backend ready'); }
  catch (e) { dialog.showErrorBox('Server Error', `Failed to start backend:\n${e.message}\n\nPath: ${SERVER_PATH}`); app.quit(); return; }

  createTray();
  await createWindow();
  app.on('activate', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.isQuiting = true; app.quit(); } });
app.on('before-quit', () => { app.isQuiting = true; if (serverProc) serverProc.kill('SIGTERM'); });
app.on('will-quit', () => { if (serverProc) serverProc.kill('SIGTERM'); });


const { autoUpdater } = require('electron-updater');

// After app is ready, add:
autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({ title:'Update Available', message:'A new version is downloading...' });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Update Ready',
    message: 'Update downloaded. Restart now to install?',
    buttons: ['Restart', 'Later']
  }).then(result => {
    if (result.response === 0) autoUpdater.quitAndInstall();
  });
});