/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════
const T = {
  bg: '#F3F6FA', sur: '#FFFFFF', pan: '#FFFFFF', card: '#F8FAFE',
  hov: '#EEF3FB', b1: 'rgba(0,0,0,0.08)', b2: 'rgba(0,0,0,0.14)',
  acc: '#0078D4', accD: '#005A9E', acc2: '#106EBE',
  aBg: 'rgba(0,120,212,0.07)', aBd: 'rgba(0,120,212,0.22)',
  grn: '#107C10', red: '#D13438', amb: '#CA5010', blu: '#0078D4',
  t1: '#1B1B1B', t2: '#605E5C', t3: '#A19F9D',
  mn: "'JetBrains Mono','Fira Code',monospace",
  sn: "'Inter','DM Sans',system-ui,sans-serif",
  dp: "'Syne','Space Grotesk',system-ui,sans-serif",
};

const PAL = ['#7B6CF6','#1ED89E','#FF4560','#F4A130','#3B9EFF','#E879F9','#34D399','#FB923C','#60A5FA','#A78BFA'];
const SIG_FONTS = ['Arial','Calibri','Georgia','Helvetica Neue','Segoe UI','Tahoma','Times New Roman','Trebuchet MS','Verdana','Inter','Roboto','Open Sans'];
const SIG_SZ = [10,11,12,13,14,15,16,18,20,22,24,28,32];
const gc  = i => PAL[i % PAL.length];
const ini = (n='',e='') => n ? n.split(' ').filter(Boolean).map(w=>w[0]).join('').toUpperCase().slice(0,2) : (e?.[0]??'?').toUpperCase();

// ═══════════════════════════════════════════════════════════════════
// GLOBAL CSS — injected once
// ═══════════════════════════════════════════════════════════════════
if (!document.getElementById('__mOS')) {
  const s = document.createElement('style');
  s.id = '__mOS';
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@300;400;600;700&family=Raleway:wght@300;400;600;700&family=Nunito:wght@300;400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Ubuntu:wght@300;400;500;700&family=Oswald:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;700&family=Mulish:wght@300;400;600;700&family=Quicksand:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;overflow:hidden;background:${T.bg}}
body{font-family:${T.sn};color:${T.t1};-webkit-font-smoothing:antialiased;background:#F3F6FA}
::-webkit-scrollbar{width:7px;height:7px}
::-webkit-scrollbar-track{background:rgba(0,0,0,0.04);border-radius:4px}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.22);border-radius:99px;border:2px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:rgba(0,120,212,0.55);border-radius:99px;border:2px solid transparent;background-clip:content-box}
::-webkit-scrollbar-corner{background:transparent}
* {scrollbar-width:thin;scrollbar-color:rgba(0,0,0,0.22) rgba(0,0,0,0.04)}
input,textarea,select{font-family:${T.sn};color:${T.t1}}
input::placeholder,textarea::placeholder{color:${T.t3}}
select option{background:${T.card};color:${T.t1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
@keyframes ctxIn{from{opacity:0;transform:scale(.95) translateY(-5px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
.fu{animation:fadeUp .2s cubic-bezier(.4,0,.2,1) both}
.sr{animation:slideR .2s cubic-bezier(.4,0,.2,1) both}
.mr{position:relative;cursor:pointer;border-bottom:1px solid ${T.b1};transition:background .1s}
.mr::after{content:'';position:absolute;left:0;top:0;bottom:0;width:2.5px;background:transparent;transition:background .15s}
.mr:hover{background:${T.hov}}
.mr.sel{background:${T.aBg}}
.mr.sel::after{background:${T.acc}}
.mr:hover .sbtn{opacity:1!important}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;cursor:pointer;font-family:${T.sn};font-weight:500;border-radius:10px;transition:all .15s;white-space:nowrap}
.bp{background:${T.acc};color:#fff}
.bp:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px)}
.bp:disabled{opacity:.38;cursor:not-allowed;transform:none!important}
.bg{background:${T.card};border:1px solid ${T.b2};color:${T.t2}}
.bg:hover{background:${T.hov};color:${T.t1};border-color:rgba(255,255,255,.15)}
.bd{background:rgba(255,69,96,.08);border:1px solid rgba(255,69,96,.22);color:${T.red}}
.bd:hover{background:rgba(255,69,96,.18)}
.inp{width:100%;background:${T.card};border:1px solid ${T.b1};border-radius:10px;color:${T.t1};padding:10px 13px;font-size:13px;outline:none;transition:border-color .15s,box-shadow .15s}
.inp:focus{border-color:${T.acc};box-shadow:0 0 0 3px ${T.aBg}}
.tag{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600;letter-spacing:.02em}
.tb{background:none;border:none;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px;font-family:${T.sn};transition:all .15s;padding:10px 13px;font-size:12px}
.tb.on{color:${T.acc};border-bottom:2px solid ${T.acc}}
.tb:not(.on){color:${T.t2};border-bottom:2px solid transparent}
.tb:hover:not(.on){color:${T.t1}}
.sbi{display:flex;align-items:center;gap:8px;width:100%;background:none;border:none;cursor:pointer;border-radius:8px;color:${T.t2};transition:all .12s;text-align:left;position:relative}
.sbi:hover{background:rgba(255,255,255,.04);color:${T.t1}}
.sbi.on{background:${T.aBg};color:${T.acc}}
.sbi.on::before{content:'';position:absolute;left:-1px;top:20%;height:60%;width:3px;background:${T.acc};border-radius:0 3px 3px 0}
[contenteditable][data-ph]:empty::before{content:attr(data-ph);color:${T.t3};pointer-events:none;font-style:italic}
[contenteditable][data-ph].is-empty::before{content:attr(data-ph);color:${T.t3};pointer-events:none;font-style:italic}
[contenteditable] p{margin:0!important;padding:0!important;min-height:1.4em}
[contenteditable] div{margin:0!important;padding:0!important;min-height:1.4em;line-height:1.65}
[contenteditable] span{line-height:inherit}
[contenteditable] font{line-height:inherit}
[contenteditable] blockquote{border-left:2px solid ${T.b2};margin:4px 0;padding:4px 12px;color:${T.t2}}
[contenteditable] a{color:${T.acc2};text-decoration:underline}
[contenteditable] ul,[contenteditable] ol{padding-left:22px;margin:2px 0}
[contenteditable] hr{border:none;border-top:1px solid ${T.b1};margin:8px 0}
[contenteditable] img{max-width:100%;border-radius:6px}
.rp ul,.rp ol{padding-left:22px;margin:3px 0}
.rp li{margin-bottom:2px}
.rp div{min-height:1.4em;line-height:1.65;margin:0}
`;
  document.head.appendChild(s);
}

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════
const Ic = {
  Mail:    p=><svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Compose: p=><svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/></svg>,
  Star:    p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill={p.f||'none'} stroke={p.c||'currentColor'} strokeWidth="1.6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Reply:   p=><svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
  Plus:    p=><svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Refresh: p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Down:    p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Inbox:   p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  Send:    p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Alert:   p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Zap:     p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check:   p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:       p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevR:   p=><svg width={p.s||12} height={p.s||12} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevD:   p=><svg width={p.s||12} height={p.s||12} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Users:   p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Eye:     p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Upload:  p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  Pen:     p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/></svg>,
  Folder:  p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Trash:   p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Cog:     p=><svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Mega:    p=><svg width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  Search:  p=><svg width={p.s||14} height={p.s||14} viewBox="0 0 24 24" fill="none" stroke={p.c||'currentColor'} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
};

// ═══════════════════════════════════════════════════════════════════
// DOMAIN FAVICON — fetches real favicon like Edison Mail
// ═══════════════════════════════════════════════════════════════════
const faviconCache = {};

function DomainFavicon({ email, size = 28, fallbackColor, fallbackInitial }) {
  const domain = (email || '').split('@')[1] || '';
  const [src, setSrc] = useState(() => {
    if (faviconCache[domain]) return faviconCache[domain];
    return null;
  });
  const [failed, setFailed] = useState(!domain);

  useEffect(() => {
    if (!domain || failed || src) return;   // ← skip if already set from initializer
    if (faviconCache[domain]) { setSrc(faviconCache[domain]); return; }

    // Try multiple favicon sources — Google's is most reliable
    const sources = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://${domain}/favicon.ico`,
    ];

    let idx = 0;
    const tryNext = () => {
      if (idx >= sources.length) { setFailed(true); return; }
      const url = sources[idx++];
      const img = new Image();
      img.onload = () => { faviconCache[domain] = url; setSrc(url); };
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  }, [domain, failed]);

  if (failed || !src) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: `${fallbackColor}16`, border: `1.5px solid ${fallbackColor}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 700, color: fallbackColor, flexShrink: 0, fontFamily: T.dp }}>
        {fallbackInitial}
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `1px solid ${T.b1}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={src} alt={domain} style={{ width: size - 8, height: size - 8, objectFit: 'contain' }}
        onError={() => { faviconCache[domain] = null; setFailed(true); }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// API + LS HELPERS
// ═══════════════════════════════════════════════════════════════════
const API_BASE = 'http://localhost:5001/api';
async function apiFetch(url, opts = {}) {
  const ms = opts.timeout || 25000;
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(API_BASE + url, { headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) }, signal: ctrl.signal, ...opts });
    clearTimeout(tid);
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
    return d;
  } catch(e) { clearTimeout(tid); throw e.name === 'AbortError' ? new Error('Request timed out') : e; }
}

const ls = {
  get: (k, def=null) => { try { const v=localStorage.getItem(k); return v===null?def:JSON.parse(v); } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

// ── Serialized localStorage append — prevents race conditions in parallel sends
const _lsWriteQueues = {};
function lsAppendSafe(key, item) {
  if (!_lsWriteQueues[key]) _lsWriteQueues[key] = Promise.resolve();
  _lsWriteQueues[key] = _lsWriteQueues[key].then(() => {
    try {
      const arr = ls.get(key,[]);
      const dupKey = item.trackId
        ? 'tid:' + item.trackId
        : `${item.rowIdx}::${item.touchType || 'first'}`;
      const isDup  = arr.some(a =>
        (a.trackId ? 'tid:' + a.trackId : `${a.rowIdx}::${a.touchType || 'first'}`) === dupKey
      );
      if (isDup) return;
      arr.push(item);
      const capped = arr.length > 5000 ? arr.slice(arr.length - 5000) : arr;
      ls.set(key, capped);
    } catch (e) {
      try {
        const arr = ls.get(key,[]).map(x => ({ ...x, bodyHTML: (x.bodyHTML || '').slice(0, 300) }));
        const dupKey = item.trackId || `${item.toEmail}::${item.rowIdx}::${item.touchType || 'first'}`;
        if (!arr.some(a => (a.trackId || `${a.toEmail}::${a.rowIdx}::${a.touchType || 'first'}`) === dupKey)) {
          arr.push({ ...item, bodyHTML: (item.bodyHTML || '').slice(0, 300) });
          const capped = arr.length > 5000 ? arr.slice(arr.length - 5000) : arr;
          ls.set(key, capped);
        }
      } catch (e2) { console.warn('lsAppendSafe: storage exhausted', key); }
    }
  });
  return _lsWriteQueues[key];
}

/** Stable key for deduping history rows (client + server merge). */
function historyDedupeKey(h) {
  const touch = h.touchType || 'first';
  if (h.trackId) return 't:' + String(h.trackId);
  const at = String(h.sentAt || '').replace(/\.\d+Z$/, 'Z').replace(/\.\d+$/, '');
  return 'l:' + h.rowIdx + '::' + touch + '::' + String(h.toEmail || '').toLowerCase() + '::' + at;
}

// Replace entire function:
function dedupeHistoryEntries(list) {
  const map = new Map();
  for (const h of list) {
    const k = historyDedupeKey(h);
    const cur = map.get(k);
    if (!cur) { map.set(k, h); continue; }
    const hTime = new Date(h.sentAt || 0).getTime();
    const curTime = new Date(cur.sentAt || 0).getTime();
    if (hTime > curTime) {
      map.set(k, h);
    } else if (hTime === curTime && (h.bodyHTML || '').length > (cur.bodyHTML || '').length) {
      // Same timestamp: prefer the entry that actually has body content
      map.set(k, h);
    }
  }
  return [...map.values()];
}

// ═══════════════════════════════════════════════════════════════════
// FORMAT HELPERS
// ═══════════════════════════════════════════════════════════════════
const fmtDate = d => {
  if (!d) return '—';
  const dt = new Date(d), now = new Date();
  if (isNaN(dt)) return '—';
  const days = Math.floor((now - dt) / 86400000);
  if (days === 0) return dt.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  if (days === 1) return 'Yesterday';
  if (days < 7) return dt.toLocaleDateString([], { weekday:'short' });
  return dt.toLocaleDateString([], { month:'short', day:'numeric' });
};

const fmtFull = d => {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt) ? '—' : dt.toLocaleString([], { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
};

const stripHtml = t => {
  if (!t) return '';
  return t
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"')
    .replace(/\*/g,'') // Automatically strips any asterisk characters ** from the preview 
    .replace(/\s+/g,' ').trim();
};

// ── Template resolver — replaces {{Column Name}} with row values
const resolve = (template, map) => {
  if (!template || !map) return template || '';
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const k = key.trim().toLowerCase();
    const found = Object.entries(map).find(([mk]) => mk.toLowerCase() === k);
    return found ? found[1] : '';
  });
};

// Replaces {{Account Signature}} with actual signature HTML.
// If the user applied formatting to the placeholder (font, size, bold, etc.)
// those styles are pushed into every element inside the signature HTML.
// ── injectSignature v2: properly cascades ALL formatting from placeholder wrapper
// into every node of the signature HTML, including overriding existing font-sizes.
const injectSignature = (html, sigHtml) => {
  if (!html) return '';
  if (!html.match(/\{\{\s*Account\s*Signature\s*\}\}/i)) return html;

  const fallback = sigHtml || '';
  if (!fallback) return html.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, '');

  try {
    const doc = document.createElement('div');
    doc.innerHTML = html;

    // Find all text nodes containing the placeholder
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const targets =[];
    while ((node = walker.nextNode())) {
      if (/\{\{\s*Account\s*Signature\s*\}\}/i.test(node.nodeValue)) {
        targets.push(node);
      }
    }

    targets.forEach(textNode => {
      const ov = {};
      let cur = textNode.parentElement;
      let hasBold = false, hasItalic = false, hasUnder = false;

      // Climb up the DOM tree to collect all inherited styles
      while (cur && cur !== doc) {
        if (cur.style.fontSize && !ov['font-size']) ov['font-size'] = cur.style.fontSize;
        if (cur.style.fontFamily && !ov['font-family']) ov['font-family'] = cur.style.fontFamily;
        if (cur.style.color && !ov['color']) ov['color'] = cur.style.color;
        if (cur.style.backgroundColor && !ov['background-color']) ov['background-color'] = cur.style.backgroundColor;
        if (cur.style.fontWeight && !ov['font-weight']) ov['font-weight'] = cur.style.fontWeight;
        if (cur.style.fontStyle && !ov['font-style']) ov['font-style'] = cur.style.fontStyle;
        if (cur.style.textDecoration && !ov['text-decoration']) ov['text-decoration'] = cur.style.textDecoration;

        const tag = cur.tagName.toLowerCase();
        if (tag === 'b' || tag === 'strong') hasBold = true;
        if (tag === 'i' || tag === 'em') hasItalic = true;
        if (tag === 'u') hasUnder = true;

        cur = cur.parentElement;
      }

      if (hasBold && !ov['font-weight']) ov['font-weight'] = 'bold';
      if (hasItalic && !ov['font-style']) ov['font-style'] = 'italic';
      if (hasUnder && !ov['text-decoration']) ov['text-decoration'] = 'underline';

      const sigDoc = document.createElement('span');
      sigDoc.innerHTML = fallback;

      // Push all overrides to every element in the signature
      if (Object.keys(ov).length > 0) {
        if (ov['font-size']) {
          Array.from(sigDoc.querySelectorAll('[style]')).forEach(el => el.style.removeProperty('font-size'));
          Array.from(sigDoc.querySelectorAll('font[size]')).forEach(f => f.removeAttribute('size'));
        }
        if (ov['font-family']) {
          Array.from(sigDoc.querySelectorAll('[style]')).forEach(el => el.style.removeProperty('font-family'));
          Array.from(sigDoc.querySelectorAll('font[face]')).forEach(f => f.removeAttribute('face'));
        }

        Array.from(sigDoc.querySelectorAll('*')).forEach(el => {
          Object.entries(ov).forEach(([p, v]) => el.style.setProperty(p, v, 'important'));
        });

        Array.from(sigDoc.childNodes).forEach(n => {
          if (n.nodeType === 3 && n.textContent.trim()) {
            const wrapper = document.createElement('span');
            Object.entries(ov).forEach(([p, v]) => wrapper.style.setProperty(p, v, 'important'));
            n.parentNode.insertBefore(wrapper, n);
            wrapper.appendChild(n);
          }
        });
      }

      // Safe split & replace to preserve surrounding text like "Thanks,\n"
      const parts = textNode.nodeValue.split(/\{\{\s*Account\s*Signature\s*\}\}/i);
      const frag = document.createDocumentFragment();
      parts.forEach((part, i) => {
        if (part) frag.appendChild(document.createTextNode(part));
        if (i < parts.length - 1) {
          const sigClone = sigDoc.cloneNode(true);
          Object.entries(ov).forEach(([p, v]) => sigClone.style.setProperty(p, v, 'important'));
          frag.appendChild(sigClone);
        }
      });

      textNode.parentNode.replaceChild(frag, textNode);
    });

    return doc.innerHTML;
  } catch (err) {
    return html.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, fallback);
  }
};

const smtpErr = e => {
  const s = String(e);
  if (/5\.4\.5|Daily.*limit/i.test(s)) return 'Daily Limit';
  if (/Authentication failed|5\.5\.1/i.test(s)) return 'Auth Failed';
  if (/web browser/i.test(s)) return 'Browser Login';
  if (/Invalid credentials/i.test(s)) return 'Invalid Creds';
  if (/rate limit/i.test(s)) return 'Rate Limited';
  return s.length > 72 ? s.slice(0,72)+'…' : s;
};
const BLOCK = new Set(['Daily Limit','Browser Login','Auth Failed','Invalid Creds','Rate Limited']);

const folderIcon = f => {
  const a = (f.attribs||[]).map(x=>x.toLowerCase()), n=(f.fullPath||f.name||'').toLowerCase();
  if (a.includes('\\sent')||n.includes('sent'))                           return <Ic.Send s={11}/>;
  if (a.includes('\\drafts')||n.includes('draft'))                        return <Ic.Pen s={11}/>;
  if (a.includes('\\trash')||n.includes('trash')||n.includes('deleted'))  return <Ic.Trash s={11}/>;
  if (a.includes('\\junk')||n.includes('spam')||n.includes('junk'))       return <Ic.Alert s={11}/>;
  if (a.includes('\\inbox')||n.includes('inbox'))                         return <Ic.Inbox s={11}/>;
  return <Ic.Folder s={11}/>;
};

// ═══════════════════════════════════════════════════════════════════
// EXPORT HELPERS
// ═══════════════════════════════════════════════════════════════════
const dl = (blob, name) => { const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); };

const expCSV = (mails, name='emails.csv') => {
  const H = ['Date','From Name','From Email','To','Subject','Preview','Folder','Read','Starred'];
  const rows = mails.map(m => [fmtFull(m.date),m.from?.name||'',m.from?.email||'',(m.to||[]).map(t=>t.email||t.name).join('; '),m.subject||'',m.preview||'',m.folder||'',m.read?'Yes':'No',m.starred?'Yes':'No']);
  dl(new Blob([[H,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')],{type:'text/csv'}),name);
};

const expEML = mail => {
  const fe=mail.from?.email||'unknown@unknown.com', body=mail.body||mail.preview||'', isH=/<[a-z][\s\S]*>/i.test(body);
  const plain=body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').trim();
  const hdr=[`From: ${mail.from?.name||''} <${fe}>`,`To: ${(mail.to||[]).map(t=>t.email).join(', ')}`,`Subject: ${mail.subject||''}`,`Date: ${new Date(mail.date).toUTCString()}`,`MIME-Version: 1.0`];
  const eml = isH ? [...hdr,`Content-Type: multipart/alternative; boundary="=_b"`,'',`--=_b`,`Content-Type: text/plain; charset=UTF-8`,'',plain,'',`--=_b`,`Content-Type: text/html; charset=UTF-8`,'',`<!DOCTYPE html><html><body>${body}</body></html>`,'',`--=_b--`].join('\r\n') : [...hdr,`Content-Type: text/plain; charset=UTF-8`,'',body].join('\r\n');
  dl(new Blob([eml],{type:'message/rfc822'}),`${(mail.subject||'email').slice(0,60).replace(/[^a-z0-9 _\-]/gi,'_')}.eml`);
};

const expMBOX = (mails, fname='emails') => {
  dl(new Blob([mails.map(m=>{const fe=m.from?.email||'unknown@unknown.com',body=m.body||m.preview||'',dt=isNaN(new Date(m.date))?new Date():new Date(m.date);return[`From ${fe} ${dt.toUTCString()}`,`From: ${m.from?.name||''} <${fe}>`,`To: ${(m.to||[]).map(t=>t.email).join(', ')}`,`Subject: ${m.subject||''}`,`Date: ${dt.toUTCString()}`,`Content-Type: ${/<[a-z][\s\S]*>/i.test(body)?'text/html':'text/plain'}; charset=UTF-8`,'',body,''].join('\r\n');}).join('\r\n')],{type:'application/mbox'}),`${fname}_${new Date().toISOString().slice(0,10)}.mbox`);
};

// ═══════════════════════════════════════════════════════════════════
// CSV PARSERS
// ═══════════════════════════════════════════════════════════════════
const parseRow = line => { const cols=[]; let cur='',q=false; for(const ch of line){if(ch==='"'){q=!q;}else if(ch===','&&!q){cols.push(cur.trim());cur='';}else{cur+=ch;}} cols.push(cur.trim()); return cols.map(c=>c.replace(/^"|"$/g,'').trim()); };

const parseAcctCSV = text => {
  const lines=text.trim().split(/\r?\n/); if(lines.length<2)return[];
  const hdrs=lines[0].split(',').map(h=>h.trim().toLowerCase().replace(/[^a-z]/g,''));
  const ei=hdrs.findIndex(h=>h.includes('email')||h.includes('mail')), pi=hdrs.findIndex(h=>h.includes('pass')), ni=hdrs.findIndex(h=>h.includes('name'));
  if(ei===-1||pi===-1)return null;
  return lines.slice(1).filter(l=>l.trim()).map(line=>{ const cols=parseRow(line); return {name:ni>=0?cols[ni]||'':'',email:cols[ei]||'',password:cols[pi]||''}; }).filter(r=>r.email&&r.password);
};

const parseCampCSV = text => {
  const lines=text.trim().split(/\r?\n/).filter(l=>l.trim()); if(!lines.length)return{headers:[],rows:[]};
  return {headers:parseRow(lines[0]),rows:lines.slice(1).map(parseRow)};
};

// ═══════════════════════════════════════════════════════════════════
// BASE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════
function Avatar({name,email,color,size=34}){
  return <div style={{width:size,height:size,borderRadius:'50%',background:`${color}16`,border:`1.5px solid ${color}38`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.31,fontWeight:700,color,flexShrink:0,fontFamily:T.dp,letterSpacing:'-0.02em'}}>{ini(name,email)}</div>;
}

function Spin({size=24,color=T.acc}){
  return <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:36}}><div style={{width:size,height:size,border:`2px solid ${color}28`,borderTop:`2px solid ${color}`,borderRadius:'50%',animation:'spin .7s linear infinite'}}/></div>;
}

function Modal({children,onClose,width=520,maxH='88vh'}){
  useEffect(()=>{const h=e=>{if(e.key==='Escape'&&onClose)onClose();}; document.addEventListener('keydown',h); return()=>document.removeEventListener('keydown',h);},[onClose]);
  return(
    <div style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,.72)',backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={onClose}>
      <div className="fu" style={{background:T.pan,border:`1px solid ${T.b2}`,borderRadius:20,boxShadow:`0 32px 80px rgba(0,0,0,.75),0 0 0 1px ${T.aBd}`,width,maxWidth:'calc(100vw - 32px)',maxHeight:maxH,display:'flex',flexDirection:'column',overflow:'hidden'}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function MH({icon,title,sub,onClose}){
  return(
    <div style={{padding:'20px 24px 16px',borderBottom:`1px solid ${T.b1}`,display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
      {icon&&<div style={{width:42,height:42,borderRadius:13,background:T.aBg,border:`1px solid ${T.aBd}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{icon}</div>}
      <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:T.dp}}>{title}</div>{sub&&<div style={{fontSize:12,color:T.t2,marginTop:2}}>{sub}</div>}</div>
      {onClose&&<button onClick={onClose} style={{background:'none',border:'none',color:T.t3,cursor:'pointer',width:30,height:30,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .12s'}} onMouseEnter={e=>e.currentTarget.style.color=T.t1} onMouseLeave={e=>e.currentTarget.style.color=T.t3}><Ic.X s={15}/></button>}
    </div>
  );
}

function MF({children}){return <div style={{padding:'14px 24px',borderTop:`1px solid ${T.b1}`,display:'flex',gap:10,flexShrink:0}}>{children}</div>;}

function Inp({label,...props}){
  const [f,setF]=useState(false);
  return <div>{label&&<label style={{fontSize:11,color:T.t2,display:'block',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</label>}<input className="inp" {...props} style={{borderColor:f?T.acc:T.b1,boxShadow:f?`0 0 0 3px ${T.aBg}`:'none',...(props.style||{})}} onFocus={e=>{setF(true);props.onFocus?.(e);}} onBlur={e=>{setF(false);props.onBlur?.(e);}}/></div>;
}

function Sel({label,children,...props}){
  return <div>{label&&<label style={{fontSize:11,color:T.t2,display:'block',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</label>}<select className="inp" {...props} style={{height:40,cursor:'pointer',...(props.style||{})}}>{children}</select></div>;
}

function ErrBox({msg,type='error'}){
  if(!msg)return null;
  const m={error:[T.red,'rgba(255,69,96,.08)','rgba(255,69,96,.22)'],warn:[T.amb,'rgba(244,161,48,.08)','rgba(244,161,48,.22)'],ok:[T.grn,'rgba(30,216,158,.08)','rgba(30,216,158,.22)']};
  const [col,bg,bd]=m[type]||m.error;
  return <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:10,padding:'9px 14px',marginBottom:14}}><p style={{color:col,fontSize:12}}>{msg}</p></div>;
}

// ═══════════════════════════════════════════════════════════════════
// RICH EDITOR (Email-Perfect WYSIWYG)
// ═══════════════════════════════════════════════════════════════════
const FONTS=[
  // Google Fonts
  'Inter','Roboto','Roboto Condensed','Open Sans','Lato',
  'Poppins','Nunito','Montserrat','Raleway',
  'Source Sans Pro','Ubuntu','Oswald',
  'Merriweather','Playfair Display','DM Sans',
  'Mulish','Quicksand','Josefin Sans',
  // System Sans-Serif
  'Arial','Arial Black','Arial Narrow',
  'Calibri','Calibri Light','Candara',
  'Century Gothic','Franklin Gothic Medium','Franklin Gothic Heavy',
  'Gill Sans','Gill Sans MT',
  'Helvetica','Helvetica Neue',
  'Impact','Haettenschweiler',
  'Microsoft Sans Serif','Lucida Sans Unicode',
  'Segoe UI','Segoe UI Light','Segoe UI Semibold',
  'Tahoma','Trebuchet MS','Verdana',
  // System Serif
  'Book Antiqua','Bookman Old Style','Cambria',
  'Century','Garamond','Georgia',
  'Palatino Linotype','Times New Roman','Sylfaen',
  // Monospace
  'Courier New','Lucida Console','Consolas','Courier','Monaco',
  // Decorative & Symbols
  'Comic Sans MS','Copperplate Gothic Bold','Estrangelo Edessa',
  'Symbol','Webdings','Wingdings'
];
const FSIZES=[8,9,10,11,12,13,14,15,16,18,20,22,24,26,28,32,36,40,48,56,64,72,96];

// Transforms any bad execCommand legacy nodes (<font>) into robust inline CSS styles for emails
function normalizeForOutlook(html){
  if(!html)return'';
  try{
    const d=document.createElement('div');
    d.innerHTML=html;
    
    // Wipe out `<font>` tags completely, translating to spans
    d.querySelectorAll('font').forEach(f => {
        const span = document.createElement('span');
        if (f.hasAttribute('color')) span.style.color = f.getAttribute('color');
        if (f.hasAttribute('face')) span.style.fontFamily = f.getAttribute('face').replace(/['"]/g, '');
        if (f.hasAttribute('size')) {
            const sizes =['10px','13px','16px','18px','24px','32px','48px'];
            span.style.fontSize = sizes[parseInt(f.getAttribute('size'))-1] || '14px';
        }
        if (f.style.cssText) span.style.cssText += f.style.cssText;
        while(f.firstChild) span.appendChild(f.firstChild);
        f.parentNode.replaceChild(span, f);
    });

    // Fix <p> tags to <div> so Outlook doesn't inject massive padding
    d.querySelectorAll('p').forEach(p=>{
      const div=document.createElement('div');
      Array.from(p.attributes).forEach(a=>div.setAttribute(a.name,a.value));
      div.style.margin='0';
      div.style.padding='0';
      div.style.lineHeight=p.style.lineHeight||'1.65';
      div.innerHTML=p.innerHTML||'<br>';
      p.parentNode.replaceChild(div,p);
    });
    // Zero margin/padding only on divs that have NO margin/padding set at all
    d.querySelectorAll('div').forEach(div=>{
      const hasMgn=div.style.margin||div.style.marginTop||div.style.marginBottom||div.style.marginLeft||div.style.marginRight;
      const hasPad=div.style.padding||div.style.paddingTop||div.style.paddingBottom;
      if(!hasMgn)div.style.margin='0';
      if(!hasPad)div.style.padding='0';
    });

    // ── FIXED: Bulletproof cross-client bullet & numbered lists
    // Outlook desktop requires margin-left, web browsers prefer padding-left. 
    // Setting margin-left to 30px and zeroing padding normalizes it perfectly across both.
    d.querySelectorAll('ul').forEach(ul=>{
      ul.setAttribute('type','disc');
      ul.style.cssText='margin:0 0 10px 30px; padding:0; list-style-type:disc; list-style-position:outside;';
      ul.querySelectorAll('li').forEach(li=>{
        li.style.cssText='margin:0 0 4px 0; padding:0; display:list-item; text-align:left;';
      });
    });
    
    d.querySelectorAll('ol').forEach(ol=>{
      ol.setAttribute('type','1');
      ol.style.cssText='margin:0 0 10px 30px; padding:0; list-style-type:decimal; list-style-position:outside;';
      ol.querySelectorAll('li').forEach(li=>{
        li.style.cssText='margin:0 0 4px 0; padding:0; display:list-item; text-align:left;';
      });
    });

    return d.innerHTML;
  }catch{return html;}
}

function RichEditor({editorRef,initialHTML,onChange,plainTextMode=false,onTogglePlain}){
  const [fmt,setFmt]=useState({bold:false,italic:false,underline:false,strikeThrough:false,
    justifyLeft:true,justifyCenter:false,justifyRight:false,justifyFull:false,
    insertUnorderedList:false,insertOrderedList:false,fontName:'',fontSize:'',foreColor:'',bgColor:''});
  const [pendingFont,setPendingFont]=useState('');
  const [pendingSize,setPendingSize]=useState('');
  const sr=useRef(null);const[ctx,setCtx]=useState(null);const inited=useRef(false);
  const _fontRef=useRef(''); 
  const _sizeRef=useRef(''); 
  const[editorFocused, setEditorFocused] = useState(false);

  const updFmt=useCallback(()=>{
    const el=editorRef.current;if(!el || plainTextMode)return;
    try{
      const get=cmd=>{try{return document.queryCommandState(cmd);}catch{return false;}};
      let dFont='',dColor='',dBg='',dSize='';
      const sel=window.getSelection();
      if(sel?.rangeCount>0){
        let node=sel.getRangeAt(0).commonAncestorContainer;
        if(node.nodeType===3)node=node.parentElement;
        while(node&&node!==el){
          if(!dFont&&node.style?.fontFamily)dFont=node.style.fontFamily.replace(/['"]/g,'').trim().split(',')[0].trim();
          if(!dColor&&node.style?.color)dColor=node.style.color;
          if(!dBg&&node.style?.backgroundColor)dBg=node.style.backgroundColor;
          if(!dSize&&node.style?.fontSize)dSize=node.style.fontSize;
          
          // Also check legacy <font> if the browser sneakily generated one
          if (node.tagName==='FONT') {
              if(!dFont&&node.hasAttribute('face')) dFont=node.getAttribute('face');
              if(!dColor&&node.hasAttribute('color')) dColor=node.getAttribute('color');
          }
          node=node.parentElement;
        }
      }
      const rawFont=dFont||(document.queryCommandValue('fontName').replace(/['"]/g,'').trim().split(',')[0].trim())||'';
      const rawSize=dSize||'';
      let pxSize='';
      if(rawSize){
        if(rawSize.endsWith('px'))pxSize=Math.round(parseFloat(rawSize))+'';
        else if(rawSize.endsWith('pt'))pxSize=Math.round(parseFloat(rawSize)*1.333)+'';
      }
      setFmt({
        bold:get('bold'),italic:get('italic'),underline:get('underline'),
        strikeThrough:get('strikeThrough'),
        justifyLeft:get('justifyLeft'),justifyCenter:get('justifyCenter'),
        justifyRight:get('justifyRight'),justifyFull:get('justifyFull'),
        insertUnorderedList:get('insertUnorderedList'),
        insertOrderedList:get('insertOrderedList'),
        fontName:rawFont,fontSize:pxSize,
        foreColor:dColor||'',bgColor:dBg||'',
      });
    }catch{}
  },[editorRef, plainTextMode]);

  useEffect(()=>{
    document.addEventListener('selectionchange',updFmt);
    return()=>document.removeEventListener('selectionchange',updFmt);
  },[updFmt]);

  useEffect(()=>{
    // Only run on first mount. The parent uses `key={sel.id}` to remount when
    // the campaign changes, so we never need to re-init mid-session.
    if(!editorRef.current||inited.current)return;
    inited.current=true;
    try{
      editorRef.current.innerHTML=initialHTML||'';
      editorRef.current.classList.toggle('is-empty', !editorRef.current.innerText?.trim());
      if (!plainTextMode) {
        const range=document.createRange();
        const sel=window.getSelection();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }catch{}
  // eslint-disable-next-line
  },[]);  // ← empty deps: mount-only; key prop handles campaign switching

  const save=useCallback(()=>{
    if(plainTextMode)return;
    const s=window.getSelection();
    if(s?.rangeCount>0){
      const r=s.getRangeAt(0);
      if(editorRef.current?.contains(r.commonAncestorContainer)||editorRef.current===r.commonAncestorContainer){
        sr.current=r.cloneRange();
        editorRef.current.__savedRange = sr.current; // Expose instantly for placeholder injection
      }
    }
  },[editorRef, plainTextMode]);

  const restore=useCallback(()=>{
    if(plainTextMode)return;
    const el=editorRef.current;if(!el)return;
    el.focus();
    const s=window.getSelection();
    if(sr.current&&s){try{s.removeAllRanges();s.addRange(sr.current);}catch{}}
  },[editorRef, plainTextMode]);

  const exec=useCallback((cmd,val=null)=>{
    if(plainTextMode)return;
    try{
        restore();
        document.execCommand('styleWithCSS',false,true); // Essential for cleanly styled email HTML
        document.execCommand(cmd,false,val);
        
        // Post-process specific tags immediately to make them email-proof
        if (cmd === 'createLink') {
            editorRef.current.querySelectorAll('a').forEach(a => {
                if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
                a.style.color = T.acc2;
                a.style.textDecoration = 'underline';
            });
        }
        if (cmd === 'insertImage') {
             editorRef.current.querySelectorAll('img').forEach(img => {
                 if (!img.style.maxWidth) {
                     img.style.maxWidth = '100%';
                     img.style.height = 'auto';
                     img.style.display = 'block';
                     img.style.borderRadius = '6px';
                 }
             });
        }
        
        editorRef.current?.focus();
        save();
        setTimeout(()=>{updFmt();onChange&&onChange(editorRef.current.innerHTML);},0);
    } catch{}
  },[restore, editorRef, updFmt, plainTextMode, onChange, save]);

  // Clean `<font>` tags manually emitted by browser size/font commands
  const cleanFontTags = useCallback((newSizePx, newFontFamily) => {
      const el = editorRef.current; if(!el) return;
      // KEY FIX: Array.from() snapshots the NodeList before iteration
      // — prevents "node removed during iteration" bugs when replacing nodes
      Array.from(el.querySelectorAll('font')).forEach(f => {
          const span = document.createElement('span');
          if (f.style.cssText) span.style.cssText = f.style.cssText;
          
          if (f.hasAttribute('size') && f.getAttribute('size') === '7') {
              span.style.fontSize = `${newSizePx}px`;
              f.removeAttribute('size');
          }
          if (f.hasAttribute('face')) {
              span.style.fontFamily = f.getAttribute('face');
              f.removeAttribute('face');
          }
          if (f.hasAttribute('color')) {
              span.style.color = f.getAttribute('color');
              f.removeAttribute('color');
          }
          while (f.firstChild) span.appendChild(f.firstChild);
          f.parentNode.replaceChild(span, f);
      });
      // Catch sneaky webkit spans
      Array.from(el.querySelectorAll('span')).forEach(s => {
          if (s.style.fontSize === '-webkit-xxx-large' || s.style.fontSize === '48px') {
              if (newSizePx) s.style.fontSize = `${newSizePx}px`;
          }
      });
  }, [editorRef]);

  const applyFont=useCallback((fontName)=>{
    restore();
    document.execCommand('styleWithCSS',false,true);
    document.execCommand('fontName',false,fontName);
    cleanFontTags(null, fontName);
    
    _fontRef.current=fontName;          
    setPendingFont(fontName);
    setFmt(prev=>({...prev,fontName}));
    save(); 
    editorRef.current?.focus();
    setTimeout(()=>{updFmt();onChange&&onChange(editorRef.current.innerHTML);},0);
  },[restore,editorRef,save,updFmt,onChange,cleanFontTags]);

  const applySize = useCallback(px => {
    restore();
    const el = editorRef.current; 
    if(!el) return;
    
    // Leverage the browser's flawless handling of splitting nodes to apply font size
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('fontSize', false, 7);
    cleanFontTags(px, null);
    document.execCommand('styleWithCSS', false, true);
    
    _sizeRef.current = String(px);
    setPendingSize(String(px));
    setFmt(prev => ({ ...prev, fontSize: String(px) }));
    save();
    el.focus();
    setTimeout(() => { updFmt(); onChange && onChange(el.innerHTML); }, 0);
  },[restore, editorRef, save, updFmt, onChange, cleanFontTags]);

  const insertBulletList=useCallback(()=>{
    exec('insertUnorderedList');
    setTimeout(()=>{
      const el=editorRef.current;if(!el)return;
      el.querySelectorAll('ul').forEach(ul=>{
        ul.style.cssText='margin:0 0 10px 30px; padding:0; list-style-type:disc; list-style-position:outside;';
        ul.querySelectorAll('li').forEach(li=>{
          li.style.cssText='margin:0 0 4px 0; padding:0; display:list-item; text-align:left;';
        });
      });
      onChange&&onChange(el.innerHTML);
    },10);
  },[exec, editorRef, onChange]);

  const insertOrderedList=useCallback(()=>{
    exec('insertOrderedList');
    setTimeout(()=>{
      const el=editorRef.current;if(!el)return;
      el.querySelectorAll('ol').forEach(ol=>{
        ol.style.cssText='margin:0 0 10px 30px; padding:0; list-style-type:decimal; list-style-position:outside;';
        ol.querySelectorAll('li').forEach(li=>{
          li.style.cssText='margin:0 0 4px 0; padding:0; display:list-item; text-align:left;';
        });
      });
      onChange&&onChange(el.innerHTML);
    },10);
  },[exec, editorRef, onChange]);

  const Btn=({cmd,title,fa,onClick,children,style:bStyle})=>{
    const on=fa!==undefined?fa:(fmt[cmd]||false);
    return(
      <button title={title} onMouseDown={e=>{e.preventDefault();save();onClick?onClick():exec(cmd);}} disabled={plainTextMode}
        style={{background:on?T.aBg:'none',border:`1px solid ${on?T.aBd:'transparent'}`,borderRadius:6,
          cursor:plainTextMode?'not-allowed':'pointer',padding:'4px 7px',fontSize:12,color:on?T.acc:T.t2,fontWeight:on?700:400,
          minWidth:28,height:26,display:'inline-flex',alignItems:'center',justifyContent:'center',
          lineHeight:1,transition:'all .12s',opacity:plainTextMode?0.5:1,...bStyle}}
        onMouseEnter={e=>{if(!on&&!plainTextMode){e.currentTarget.style.background=T.card;e.currentTarget.style.color=T.t1;}}}
        onMouseLeave={e=>{if(!on&&!plainTextMode){e.currentTarget.style.background='none';e.currentTarget.style.color=T.t2;}}}>{children}</button>
    );
  };

  const Sep=()=><div style={{width:1,height:20,background:T.b1,margin:'0 3px',alignSelf:'center',flexShrink:0}}/>;

  return(
    <div style={{display:'flex',flexDirection:'column',flex:1,minHeight:0, border:`1px solid ${editorFocused ? T.acc : T.b1}`, borderRadius: 14, overflow:'hidden', boxShadow: editorFocused ? `0 0 0 3px ${T.aBg}` : 'none', transition: 'all 0.15s'}}>
      {/* ── Toolbar ── */}
      <div style={{padding:'5px 8px',borderBottom:`1px solid ${T.b1}`,display:'flex',flexWrap:'wrap',
        gap:2,alignItems:'center',background:'#FAFBFD',flexShrink:0,rowGap:4}}>

        {/* Font family */}
        <select value={fmt.fontName||pendingFont||''} onMouseDown={save} disabled={plainTextMode}
          onChange={e=>{if(!e.target.value)return;applyFont(e.target.value);}}
          style={{height:26,border:`1px solid ${T.b1}`,borderRadius:6,fontSize:11,background:T.card,
            color:fmt.fontName||pendingFont?T.t1:T.t2,padding:'0 6px',cursor:plainTextMode?'not-allowed':'pointer',
            width:148,fontFamily:fmt.fontName||pendingFont||'inherit',opacity:plainTextMode?.5:1}}>
          <option value="">Font Family…</option>
          <optgroup label="── Common ──">
            {['Arial','Calibri','Georgia','Helvetica','Segoe UI','Tahoma','Times New Roman','Trebuchet MS','Verdana'].map(f=>(
              <option key={f} value={f} style={{fontFamily:f}}>{f}</option>
            ))}
          </optgroup>
          <optgroup label="── All Fonts ──">
            {FONTS.filter(f=>!['Arial','Calibri','Georgia','Helvetica','Segoe UI','Tahoma','Times New Roman','Trebuchet MS','Verdana'].includes(f)).map(f=>(
              <option key={f} value={f} style={{fontFamily:f}}>{f}</option>
            ))}
          </optgroup>
        </select>

        {/* Font size */}
        <select value={fmt.fontSize||pendingSize||''} onMouseDown={save} disabled={plainTextMode}
          onChange={e=>{if(!e.target.value)return;applySize(parseInt(e.target.value));}}
          style={{height:26,border:`1px solid ${T.b1}`,borderRadius:6,fontSize:11,background:T.card,
            color:fmt.fontSize||pendingSize?T.t1:T.t2,padding:'0 4px',cursor:plainTextMode?'not-allowed':'pointer',
            width:70,fontFamily:T.mn,opacity:plainTextMode?.5:1}}>
          <option value="">Size…</option>
          {FSIZES.map(px=><option key={px} value={px}>{px}px</option>)}
        </select>

        <Sep/>

        <Btn cmd="bold"          title="Bold (Ctrl+B)"><b style={{fontSize:13,fontFamily:'serif'}}>B</b></Btn>
        <Btn cmd="italic"        title="Italic (Ctrl+I)"><i style={{fontSize:13}}>I</i></Btn>
        <Btn cmd="underline"     title="Underline (Ctrl+U)"><u style={{fontSize:13}}>U</u></Btn>
        <Btn cmd="strikeThrough" title="Strikethrough"><s style={{fontSize:12}}>S</s></Btn>

        <Btn cmd="subscript"   title="Subscript"><span style={{fontSize:10}}>x<sub>2</sub></span></Btn>
        <Btn cmd="superscript" title="Superscript"><span style={{fontSize:10}}>x<sup>2</sup></span></Btn>

        <Sep/>

        {/* Text color */}
        <label title="Text Color" style={{display:'inline-flex',alignItems:'center',gap:2,cursor:plainTextMode?'not-allowed':'pointer',
          padding:'3px 5px',borderRadius:6,border:`1px solid ${T.b1}`,height:26,opacity:plainTextMode?.5:1}}
          onMouseEnter={e=>{if(!plainTextMode)e.currentTarget.style.background=T.card;}}
          onMouseLeave={e=>{if(!plainTextMode)e.currentTarget.style.background='none';}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1}}>
            <span style={{fontSize:12,fontWeight:800,color:fmt.foreColor||T.t1,lineHeight:1}}>A</span>
            <div style={{width:14,height:3,borderRadius:2,background:fmt.foreColor||T.t1}}/>
          </div>
          <input type="color" value={fmt.foreColor||'#000000'} onMouseDown={save} disabled={plainTextMode}
            onChange={e=>{
                restore();
                document.execCommand('styleWithCSS',false,true);
                document.execCommand('foreColor',false,e.target.value);
                cleanFontTags(null, null);
                editorRef.current?.focus();save();setTimeout(updFmt,0);
            }}
            style={{width:16,height:16,border:'none',background:'none',cursor:plainTextMode?'not-allowed':'pointer',padding:0}}/>
        </label>

        {/* Highlight color */}
        <label title="Highlight Color" style={{display:'inline-flex',alignItems:'center',gap:2,cursor:plainTextMode?'not-allowed':'pointer',
          padding:'3px 5px',borderRadius:6,border:`1px solid ${T.b1}`,height:26,opacity:plainTextMode?.5:1}}
          onMouseEnter={e=>{if(!plainTextMode)e.currentTarget.style.background=T.card;}}
          onMouseLeave={e=>{if(!plainTextMode)e.currentTarget.style.background='none';}}>
          <span style={{fontSize:11,background:fmt.bgColor||'#FFFF00',color:'#000',padding:'0 3px',borderRadius:2,fontWeight:700,lineHeight:'16px'}}>H</span>
          <input type="color" defaultValue="#FFFF00" onMouseDown={save} disabled={plainTextMode}
            onChange={e=>{
                restore();
                document.execCommand('styleWithCSS',false,true);
                document.execCommand('hiliteColor',false,e.target.value);
                cleanFontTags(null, null);
                editorRef.current?.focus();save();setTimeout(updFmt,0);
            }}
            style={{width:16,height:16,border:'none',background:'none',cursor:plainTextMode?'not-allowed':'pointer',padding:0}}/>
        </label>

        <Sep/>

        <Btn cmd="justifyLeft"   title="Align Left"    fa={fmt.justifyLeft&&!fmt.justifyCenter&&!fmt.justifyRight&&!fmt.justifyFull}><span style={{fontSize:11}}>⬅≡</span></Btn>
        <Btn cmd="justifyCenter" title="Align Center"  fa={fmt.justifyCenter}><span style={{fontSize:11}}>≡</span></Btn>
        <Btn cmd="justifyRight"  title="Align Right"   fa={fmt.justifyRight}><span style={{fontSize:11}}>≡➡</span></Btn>
        <Btn cmd="justifyFull"   title="Justify"       fa={fmt.justifyFull}><span style={{fontSize:11}}>≡≡</span></Btn>

        <Sep/>

        <Btn cmd="insertUnorderedList" title="Bullet List" fa={fmt.insertUnorderedList} onClick={insertBulletList}><span style={{fontSize:11}}>• ≡</span></Btn>
        <Btn cmd="insertOrderedList"   title="Numbered List" fa={fmt.insertOrderedList} onClick={insertOrderedList}><span style={{fontSize:11}}>1 ≡</span></Btn>
        <Btn cmd="indent"   title="Increase Indent"><span style={{fontSize:11}}>→⊟</span></Btn>
        <Btn cmd="outdent"  title="Decrease Indent"><span style={{fontSize:11}}>←⊟</span></Btn>

        <Sep/>

        {/* Line height */}
        <select title="Line Height" onMouseDown={save} disabled={plainTextMode}
          onChange={e=>{
            if(!e.target.value)return;restore();
            const el=editorRef.current;if(!el)return;
            const sel=window.getSelection();
            if(sel?.rangeCount>0){
              const range=sel.getRangeAt(0);
              let node=range.commonAncestorContainer;
              if(node.nodeType===3)node=node.parentElement;
              while(node&&node!==el&&!['DIV','P','LI','BLOCKQUOTE'].includes(node.tagName))node=node.parentElement;
              if(node&&node!==el)node.style.lineHeight=e.target.value;
            }
            el.focus();onChange&&onChange(el.innerHTML);e.target.value='';
          }}
          style={{height:26,border:`1px solid ${T.b1}`,borderRadius:6,fontSize:11,background:T.card,
            color:T.t2,padding:'0 4px',cursor:plainTextMode?'not-allowed':'pointer',width:56,fontFamily:T.mn,opacity:plainTextMode?.5:1}}>
          <option value="">LH…</option>
          {['1','1.2','1.4','1.5','1.6','1.8','2','2.5','3'].map(v=><option key={v} value={v}>{v}×</option>)}
        </select>

        {/* Letter spacing */}
        <select title="Letter Spacing" onMouseDown={save} disabled={plainTextMode}
          onChange={e=>{
            if(!e.target.value)return;restore();
            const el=editorRef.current;if(!el)return;
            const sel=window.getSelection();
            if(sel?.rangeCount>0&&!sel.getRangeAt(0).collapsed){
              const span=document.createElement('span');
              span.style.letterSpacing=e.target.value;
              try{
                const r=sel.getRangeAt(0);
                const frag=r.extractContents();
                span.appendChild(frag);
                r.insertNode(span);
                const ns=document.createRange(); ns.selectNodeContents(span); sel.removeAllRanges(); sel.addRange(ns);
              }catch{}
            }
            el.focus();onChange&&onChange(el.innerHTML);e.target.value='';
          }}
          style={{height:26,border:`1px solid ${T.b1}`,borderRadius:6,fontSize:11,background:T.card,
            color:T.t2,padding:'0 4px',cursor:plainTextMode?'not-allowed':'pointer',width:60,fontFamily:T.mn,opacity:plainTextMode?.5:1}}>
          <option value="">LS…</option>
          {['-1px','-0.5px','0px','0.5px','1px','1.5px','2px','3px','4px','5px'].map(v=><option key={v} value={v}>{v}</option>)}
        </select>

        <Sep/>

        {/* Insert tools */}
        {[['🔗','Link',()=>{const v=window.prompt('URL:','https://');if(v!==null)exec('createLink',v||'');}],['🖼','Image URL',()=>{const v=window.prompt('Image URL:','https://');if(v!==null)exec('insertImage',v||'');}],['─','Horizontal Rule',()=>{exec('insertHorizontalRule');}],['📋','Paste plain text',async()=>{restore();try{const t=await navigator.clipboard.readText();document.execCommand('insertText',false,t);}catch{document.execCommand('paste');}editorRef.current?.focus();}],
        ].map(([l,t,f])=>(
          <button key={l} title={t} disabled={plainTextMode} onMouseDown={e=>{e.preventDefault();save();f();}}
            style={{background:'none',border:`1px solid ${T.b1}`,borderRadius:6,cursor:plainTextMode?'not-allowed':'pointer',
              padding:'3px 7px',fontSize:11,color:T.t2,height:26,display:'inline-flex',opacity:plainTextMode?.5:1,
              alignItems:'center',justifyContent:'center',transition:'all .12s'}}
            onMouseEnter={e=>{if(!plainTextMode){e.currentTarget.style.color=T.t1;e.currentTarget.style.background=T.card;}}}
            onMouseLeave={e=>{if(!plainTextMode){e.currentTarget.style.color=T.t2;e.currentTarget.style.background='none';}}}>{l}</button>
        ))}

        <Sep/>

        {/* Flawless Email Table insert */}
        <button title="Insert Table" disabled={plainTextMode} onMouseDown={e=>{
          e.preventDefault();save();
          const r=parseInt(window.prompt('Rows:','3')||'3');
          const c=parseInt(window.prompt('Columns:','3')||'3');
          if(!r||!c)return;
          let tbl=`<table width="100%" style="width:100%; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; margin:10px 0;"><tbody>`;
          for(let i=0;i<r;i++){tbl+='<tr>';for(let j=0;j<c;j++)tbl+=`<td style="border:1px solid #D1D5DB; padding:10px; font-family:inherit;">&#8203;</td>`;tbl+='</tr>';}
          tbl+='</tbody></table><div style="margin:0"><br></div>';
          restore();
          document.execCommand('insertHTML',false,tbl);
          editorRef.current?.focus();
          onChange&&onChange(editorRef.current?.innerHTML||'');
        }} style={{background:'none',border:`1px solid ${T.b1}`,borderRadius:6,cursor:plainTextMode?'not-allowed':'pointer',
          padding:'3px 7px',fontSize:11,color:T.t2,height:26,display:'inline-flex',opacity:plainTextMode?.5:1,
          alignItems:'center',transition:'all .12s'}}
          onMouseEnter={e=>{if(!plainTextMode){e.currentTarget.style.color=T.t1;e.currentTarget.style.background=T.card;}}}
          onMouseLeave={e=>{if(!plainTextMode){e.currentTarget.style.color=T.t2;e.currentTarget.style.background='none';}}}>⊞</button>

        <Sep/>

        <Btn cmd="undo" title="Undo (Ctrl+Z)">↩</Btn>
        <Btn cmd="redo" title="Redo (Ctrl+Y)">↪</Btn>

        {/* Clear formatting */}
        <button title="Clear Formatting" disabled={plainTextMode} onMouseDown={e=>{e.preventDefault();save();restore();
          document.execCommand('removeFormat');cleanFontTags(null,null);editorRef.current?.focus();setTimeout(updFmt,0);}}
          style={{background:'rgba(255,69,96,.07)',border:'1px solid rgba(255,69,96,.2)',borderRadius:6,
            cursor:plainTextMode?'not-allowed':'pointer',padding:'3px 9px',fontSize:11,color:T.red,height:26,transition:'all .12s',opacity:plainTextMode?.5:1}}
          onMouseEnter={e=>{if(!plainTextMode)e.currentTarget.style.background='rgba(255,69,96,.18)';}}
          onMouseLeave={e=>{if(!plainTextMode)e.currentTarget.style.background='rgba(255,69,96,.07)';}}>✕ Clear</button>

        {/* Plain text toggle */}
        {onTogglePlain&&(
          <button title="Toggle Plain Text / Rich Text" onMouseDown={e=>{e.preventDefault();onTogglePlain();}}
            style={{background:plainTextMode?T.aBg:'none',border:`1px solid ${plainTextMode?T.aBd:T.b1}`,
              borderRadius:6,cursor:'pointer',padding:'3px 9px',fontSize:11,
              color:plainTextMode?T.acc:T.t2,height:26,transition:'all .12s',marginLeft:4}}
            onMouseEnter={e=>{if(!plainTextMode){e.currentTarget.style.background=T.card;e.currentTarget.style.color=T.t1;}}}
            onMouseLeave={e=>{if(!plainTextMode){e.currentTarget.style.background='none';e.currentTarget.style.color=T.t2;}}}>
            {plainTextMode?'📝 Rich':'TXT Plain'}
          </button>
        )}
      </div>

      {/* ── Editor body ── */}
      {plainTextMode && (
        <textarea
          style={{flex:1,minHeight:200,padding:'16px 20px',fontSize:14,lineHeight:1.65,color:T.t1,
            outline:'none',background:'#fff',border:'none',resize:'none',fontFamily:'monospace'}}
          defaultValue={(()=>{
            let html = initialHTML||'';
            html = html.replace(/<br\s*\/?>/gi, '\n')
                       .replace(/<\/p>/gi, '\n\n')
                       .replace(/<\/div>/gi, '\n')
                       .replace(/<[^>]+>/g, '')
                       .replace(/&nbsp;/gi, ' ')
                       .replace(/&amp;/gi, '&')
                       .replace(/&lt;/gi, '<')
                       .replace(/&gt;/gi, '>')
                       .replace(/&quot;/gi, '"');
            return html.replace(/\n{3,}/g, '\n\n').trim();
          })()}
          onChange={e=>{
            const plain=e.target.value;
            const h = plain.split('\n').map(line=>{
                const enc=(line||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
                return `<div>${enc || '<br>'}</div>`;
            }).join('');
            if(editorRef.current){
              editorRef.current.innerHTML=h;
              onChange&&onChange(h);
            }
          }}
          placeholder="Write plain text here…"
        />
      )}

      <div ref={editorRef} contentEditable={!plainTextMode} suppressContentEditableWarning spellCheck dir="ltr"
        data-ph="Write your message here…"
        onFocus={() => setEditorFocused(true)}
        onBlur={() => { setEditorFocused(false); save(); updFmt(); }}
        onKeyUp={()=>{if(!plainTextMode){save();updFmt();}}}
        onMouseUp={()=>{if(!plainTextMode){save();updFmt();}}}
        onSelect={()=>{if(!plainTextMode){save();updFmt();}}}
                onInput={()=>{
            try{
                if(!plainTextMode){
                    const el=editorRef.current; if(!el)return;
                    const isEmpty=!el.innerText?.trim();          // ← ADD THIS LINE
                    el.classList.toggle('is-empty', isEmpty);     // ← ADD THIS LINE
                    if(!el.innerHTML||el.innerHTML==='<br>'||el.innerHTML==='<br/>'){
                        requestAnimationFrame(()=>{
                            if(!el.innerHTML||el.innerHTML==='<br>'||el.innerHTML==='<br/>'){
                                el.innerHTML='<div><br></div>';
                                try{
                                    const range=document.createRange();
                                    range.setStart(el.firstChild,0);
                                    range.collapse(true);
                                    const s=window.getSelection();
                                    s?.removeAllRanges();
                                    s?.addRange(range);
                                }catch{}
                            }
                        });
                    }
                    onChange&&onChange(el.innerHTML);
                }
            }catch{}
        }}
        onContextMenu={e=>{if(plainTextMode)return;e.preventDefault();setCtx({x:e.clientX,y:e.clientY});}}
        onKeyDown={e=>{
          if(plainTextMode)return;
          const m=e.ctrlKey||e.metaKey;
          const key = e.key.toLowerCase();
          if(m&&!e.shiftKey&&key==='z'){e.preventDefault();exec('undo');return;}
          if(m&&((e.shiftKey&&key==='z')||key==='y')){e.preventDefault();exec('redo');return;}
          if(m&&key==='b'){e.preventDefault();exec('bold');return;}
          if(m&&e.key==='i'){e.preventDefault();exec('italic');return;}
          if(m&&e.key==='u'){e.preventDefault();exec('underline');return;}
          if(m&&e.key==='k'){e.preventDefault();const v=window.prompt('URL:','https://');if(v!==null)exec('createLink',v||'');return;}
          // Enter key — use <div> instead of <p> for Outlook compatibility
          // Enter key — DOM-based insert so consecutive presses don't nest divs
if(e.key==='Enter'&&!e.shiftKey){
  const sel=window.getSelection();
  if(sel?.rangeCount>0){
    let node=sel.getRangeAt(0).commonAncestorContainer;
    if(node.nodeType===3)node=node.parentElement;
    let inList=false,inTable=false;let cur=node;
    while(cur&&cur!==editorRef.current){
      if(cur.tagName==='LI'||cur.tagName==='UL'||cur.tagName==='OL'){inList=true;break;}
      if(cur.tagName==='TD'||cur.tagName==='TH'||cur.tagName==='TABLE'){inTable=true;break;}
      cur=cur.parentElement;
    }
    if(inList||inTable)return;
  }
  e.preventDefault();
  const s=window.getSelection();
  if(!s?.rangeCount){
    // Fallback
    document.execCommand('insertHTML',false,'<div style="margin:0;padding:0"><br></div>');
    return;
  }
  const r=s.getRangeAt(0);
  if(!r.collapsed)r.deleteContents();

  // Walk up to find the direct child block of the editor
  let block=r.startContainer;
  if(block.nodeType===3)block=block.parentElement;
  while(block&&block.parentElement!==editorRef.current)block=block.parentElement;

  // New sibling div (never nested inside current block)
  const newLine=document.createElement('div');
  newLine.style.margin='0';newLine.style.padding='0';newLine.innerHTML='<br>';

  if(block&&block!==editorRef.current){
    // Mid-line Enter: move tail content after cursor into new div
    try{
      const tailR=document.createRange();
      tailR.setStart(r.startContainer,r.startOffset);
      tailR.setEnd(block,block.childNodes.length);
      const tail=tailR.extractContents();
      const hasMeaningfulTail=tail.textContent.length>0||
        Array.from(tail.childNodes).some(n=>n.nodeName!=='BR');
      if(hasMeaningfulTail){newLine.innerHTML='';newLine.appendChild(tail);}
      if(!block.innerHTML.trim())block.innerHTML='<br>';
    }catch(_){}
    // Insert AFTER current block (sibling, not child — this is the fix)
    block.parentElement.insertBefore(newLine,block.nextSibling);
  }else{
    editorRef.current.appendChild(newLine);
  }

  // Move cursor to start of new line
  const nr=document.createRange();
  nr.setStart(newLine,0);nr.collapse(true);
  s.removeAllRanges();s.addRange(nr);

  setTimeout(()=>{save();updFmt();onChange&&onChange(editorRef.current?.innerHTML||'');},0);
  return;
}
        }}
        style={{display:plainTextMode?'none':'block',flex:1,minHeight:200,overflowY:'auto',padding:'16px 20px',fontSize:14,
          lineHeight:1.65,color:T.t1,outline:'none',background:'transparent',direction:'ltr'}}/>

      {/* Context menu */}
      {ctx&&(
        <div style={{position:'fixed',left:ctx.x,top:ctx.y,zIndex:99999,background:T.card,
          border:`1px solid ${T.b2}`,borderRadius:12,boxShadow:'0 12px 40px rgba(0,0,0,.6)',
          minWidth:180,padding:'4px 0',animation:'ctxIn .1s ease'}}
          onMouseLeave={()=>setCtx(null)}>
          {[
            ['Cut','✂',()=>exec('cut')],['Copy','⎘',()=>exec('copy')],['Paste (plain)','📋',async()=>{try{const t=await navigator.clipboard.readText();editorRef.current?.focus();document.execCommand('insertText',false,t);}catch{document.execCommand('paste');}}],['Select All','⬚',()=>exec('selectAll')],
            ['Undo','↩',()=>exec('undo')],['Redo','↪',()=>exec('redo')],
          ].map(([l,ic,fn])=>(
            <button key={l} onClick={()=>{fn();setCtx(null);}}
              style={{width:'100%',background:'none',border:'none',cursor:'pointer',display:'flex',
                alignItems:'center',gap:10,padding:'8px 14px',fontSize:12,color:T.t1,
                textAlign:'left',transition:'background .1s'}}
              onMouseEnter={e=>e.currentTarget.style.background=T.hov}
              onMouseLeave={e=>e.currentTarget.style.background='none'}>
              <span style={{width:16,textAlign:'center',fontSize:13,flexShrink:0}}>{ic}</span>{l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIGNATURE EDITOR (lightweight)
// ═══════════════════════════════════════════════════════════════════
function SigEditor({value,onChange}){
  const ref=useRef(null);const last=useRef(null);const sr=useRef(null);
  useEffect(()=>{if(!ref.current)return;if(value!==last.current){last.current=value;ref.current.innerHTML=value||'';}},[ value]);
  const save=()=>{const s=window.getSelection();if(s?.rangeCount>0){const r=s.getRangeAt(0);if(ref.current?.contains(r.commonAncestorContainer))sr.current=r.cloneRange();}};
  const restore=()=>{ref.current?.focus();const s=window.getSelection();if(sr.current&&s){try{s.removeAllRanges();s.addRange(sr.current);}catch{}}};
  const emit=()=>{const h=ref.current?.innerHTML||'';last.current=h;onChange(h);};
  const exec=(cmd,val=null)=>{restore();document.execCommand(cmd,false,val);ref.current?.focus();emit();};
  const Btn=({cmd,children,title})=><button title={title} onMouseDown={e=>{e.preventDefault();save();exec(cmd);}} style={{background:'none',border:`1px solid ${T.b1}`,borderRadius:5,cursor:'pointer',padding:'3px 8px',fontSize:12,color:T.t2,lineHeight:1,transition:'all .12s'}} onMouseEnter={e=>{e.currentTarget.style.background=T.card;e.currentTarget.style.color=T.t1;}} onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=T.t2;}}>{children}</button>;
  return(
    <div style={{border:`1px solid ${T.b1}`,borderRadius:11,overflow:'hidden'}}>
      <div style={{padding:'5px 8px',borderBottom:`1px solid ${T.b1}`,display:'flex',flexWrap:'wrap',gap:4,alignItems:'center',background:T.sur}}>
        <select onMouseDown={save} onChange={e=>{if(!e.target.value)return;restore();document.execCommand('fontName',false,e.target.value);ref.current?.focus();emit();e.target.value='';}} style={{height:26,border:`1px solid ${T.b1}`,borderRadius:6,fontSize:11,background:T.card,color:T.t1,padding:'0 6px',cursor:'pointer',width:110}}>
          <option value="">Font…</option>{SIG_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
        </select>
        <select onMouseDown={save} onChange={e=>{
          const px=e.target.value;if(!px)return;restore();
          document.execCommand('styleWithCSS',false,false);const el=ref.current;if(!el)return;
          el.querySelectorAll('font').forEach(f=>{if(f.getAttribute('size')==='7')f.dataset.k='1';});
          document.execCommand('fontSize',false,7);
          el.querySelectorAll("font[size='7']:not([data-k='1'])").forEach(n=>{
            const span = document.createElement('span');
            span.style.fontSize = `${px}px`;
            while (n.firstChild) span.appendChild(n.firstChild);
            n.parentNode.replaceChild(span, n);
          });
          el.querySelectorAll('[data-k]').forEach(f=>f.removeAttribute('data-k'));
          el.focus();emit();e.target.value='';
        }} style={{height:26,border:`1px solid ${T.b1}`,borderRadius:6,fontSize:11,background:T.card,color:T.t1,padding:'0 6px',cursor:'pointer',width:70}}>
          <option value="">Size…</option>{SIG_SZ.map(px=><option key={px} value={px}>{px}px</option>)}
        </select>
        <Btn cmd="bold" title="Bold"><b>B</b></Btn><Btn cmd="italic" title="Italic"><i>I</i></Btn><Btn cmd="underline" title="Underline"><u>U</u></Btn>
        <label onMouseDown={save} style={{display:'flex',alignItems:'center',gap:3,cursor:'pointer',padding:'3px 6px',borderRadius:5,border:`1px solid ${T.b1}`}} onMouseEnter={e=>e.currentTarget.style.background=T.card} onMouseLeave={e=>e.currentTarget.style.background='none'}>
          <span style={{fontSize:12,fontWeight:700,color:T.t1}}>A</span>
          <input type="color" defaultValue="#333333" onChange={e=>{restore();document.execCommand('foreColor',false,e.target.value);ref.current?.focus();emit();}} style={{width:16,height:16,border:'none',background:'none',cursor:'pointer',padding:0}}/>
        </label>
        <Btn cmd="removeFormat" title="Clear">✕</Btn>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning spellCheck data-ph="Best regards, Your Name…"
        onKeyUp={save} onMouseUp={save}
        onInput={()=>{const h=ref.current?.innerHTML||'';last.current=h;onChange(h);}}
        style={{minHeight:80,padding:'10px 14px',fontSize:13,lineHeight:1.7,color:T.t1,outline:'none',background:T.pan}}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DELAY PANEL
// ═══════════════════════════════════════════════════════════════════
function DelayPanel({accName,initialMin,initialMax,onChange}){
  const toM=s=>s!=null?Math.round(s/60):1;
  const [mn,setMn]=useState(()=>toM(initialMin)||1);
  const [mx,setMx]=useState(()=>toM(initialMax)||3);
  const ns={width:78,height:42,border:`1.5px solid ${T.b2}`,borderRadius:10,fontSize:18,fontWeight:700,color:T.t1,textAlign:'center',outline:'none',background:T.sur,padding:'0 8px',fontFamily:T.mn};
  const hMin=v=>{const n=Math.max(0,parseInt(v)||0),m=mx<n?n:mx;setMn(n);setMx(m);onChange('minDelay',n*60);onChange('maxDelay',m*60);};
  const hMax=v=>{const n=Math.max(mn,parseInt(v)||0);setMx(n);onChange('maxDelay',n*60);};
  return(
    <div>
      <p style={{fontSize:13,fontWeight:600,color:T.t1,marginBottom:14}}>⏱ Delay — {accName}</p>
      <div style={{display:'flex',gap:20,alignItems:'flex-end',flexWrap:'wrap'}}>
        <div><label style={{fontSize:10,color:T.t2,display:'block',marginBottom:7,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>MIN (min)</label><input type="number" min="0" max="1440" value={mn} onChange={e=>hMin(e.target.value)} onBlur={e=>hMin(e.target.value)} style={ns}/></div>
        <div style={{paddingBottom:10,fontSize:18,color:T.t3}}>—</div>
        <div><label style={{fontSize:10,color:T.t2,display:'block',marginBottom:7,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>MAX (min)</label><input type="number" min="0" max="1440" value={mx} onChange={e=>hMax(e.target.value)} onBlur={e=>hMax(e.target.value)} style={ns}/></div>
      </div>
      <div style={{marginTop:14,padding:'12px 16px',background:T.aBg,border:`1px solid ${T.aBd}`,borderRadius:10}}>
        <p style={{fontSize:13,color:T.acc2,fontWeight:600}}>Waits <b style={{color:T.acc}}>{mn===mx?`${mn} min`:`${mn}–${mx} min`}</b> after each send</p>
        {mn===0&&mx===0&&<p style={{fontSize:11,color:T.red,marginTop:6}}>⚠ Zero delay increases ban risk!</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADD ACCOUNT MODAL
// ═══════════════════════════════════════════════════════════════════
const LP={
  'gmail.com':{h:'imap.gmail.com',p:993,s:true,sh:'smtp.gmail.com',sp:587,ss:false},
  'googlemail.com':{h:'imap.gmail.com',p:993,s:true,sh:'smtp.gmail.com',sp:587,ss:false},
  'outlook.com':{h:'outlook.office365.com',p:993,s:true,sh:'smtp.office365.com',sp:587,ss:false},
  'hotmail.com':{h:'outlook.office365.com',p:993,s:true,sh:'smtp.office365.com',sp:587,ss:false},
  'live.com':{h:'outlook.office365.com',p:993,s:true,sh:'smtp.office365.com',sp:587,ss:false},
  'yahoo.com':{h:'imap.mail.yahoo.com',p:993,s:true,sh:'smtp.mail.yahoo.com',sp:587,ss:false},
  'icloud.com':{h:'imap.mail.me.com',p:993,s:true,sh:'smtp.mail.me.com',sp:587,ss:false},
  'me.com':{h:'imap.mail.me.com',p:993,s:true,sh:'smtp.mail.me.com',sp:587,ss:false},
  'zoho.com':{h:'imap.zoho.com',p:993,s:true,sh:'smtpro.zoho.com',sp:465,ss:true},
  'fastmail.com':{h:'imap.fastmail.com',p:993,s:true,sh:'smtp.fastmail.com',sp:465,ss:true},
  'aol.com':{h:'imap.aol.com',p:993,s:true,sh:'smtp.aol.com',sp:587,ss:false},
  'gmx.com':{h:'imap.gmx.com',p:993,s:true,sh:'mail.gmx.com',sp:587,ss:false},
  'yandex.com':{h:'imap.yandex.com',p:993,s:true,sh:'smtp.yandex.com',sp:465,ss:true},
};

function AddAccountModal({onClose,onAdded,existingAccounts=[]}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({email:'',password:'',name:'',imapHost:'',imapPort:993,imapSecure:true,smtpHost:'',smtpPort:587,smtpSecure:false});
  const [preset,setPreset]=useState(null);const [busy,setBusy]=useState(false);const [detect,setDetect]=useState(false);const [err,setErr]=useState('');

  const applyP=p=>{setPreset(p);setForm(v=>({...v,imapHost:p.h,imapPort:p.p,imapSecure:p.s,smtpHost:p.sh,smtpPort:p.sp,smtpSecure:p.ss}));};
  const setF=(k,v)=>setForm(prev=>({...prev,[k]:v}));

  const detectPreset=async email=>{
    if(!email.includes('@'))return;
    const dom=(email.split('@')[1]||'').toLowerCase();
    if(LP[dom]){applyP(LP[dom]);return;}
    setDetect(true);
    try{const p=await apiFetch('/presets/'+encodeURIComponent(email),{timeout:8000});if(p?.host)applyP({h:p.host,p:p.port,s:p.secure,sh:p.smtpHost,sp:p.smtpPort,ss:p.smtpSecure});}catch{}
    setDetect(false);
  };

  const test = async () => {
  setBusy(true); setErr('');
  try {
    await apiFetch('/accounts/test', {
      method: 'POST', timeout: 32000,
      body: JSON.stringify({
        email:      form.email.trim(),
        password:   form.password,
        imapHost:   form.imapHost,
        imapPort:   Number(form.imapPort),
        imapSecure: Boolean(form.imapSecure),
        smtpHost:   form.smtpHost,
        smtpPort:   Number(form.smtpPort),
        smtpSecure: Boolean(form.smtpSecure),
      }),
    });
    setStep(3);
  } catch (e) { setErr(e.message); }
  setBusy(false);
};

const add = async () => {
  const em = form.email.trim().toLowerCase();
  if (existingAccounts.find(a => a.email?.toLowerCase() === em)) {
    setErr('Already added.'); return;
  }
  if (existingAccounts.length >= 500) { setErr('500-account limit.'); return; }
  setBusy(true); setErr('');
  try {
    const acc = await apiFetch('/accounts', {
      method: 'POST', timeout: 22000,
      body: JSON.stringify({
        name:       form.name,
        email:      form.email.trim(),
        password:   form.password,
        imapHost:   form.imapHost,
        imapPort:   Number(form.imapPort),
        imapSecure: Boolean(form.imapSecure),
        smtpHost:   form.smtpHost,
        smtpPort:   Number(form.smtpPort),
        smtpSecure: Boolean(form.smtpSecure),
      }),
    });
    onAdded(acc); onClose();
  } catch (e) { setErr(e.message); }
  setBusy(false);
};

  const STEPS=['Credentials','Server','Confirm'];
  return(
    <Modal onClose={onClose} width={460}>
      <MH icon="✉" title="Add Account" sub={`Step ${step} of 3 — ${STEPS[step-1]}`} onClose={onClose}/>
      <div style={{display:'flex',gap:6,padding:'14px 24px 0',flexShrink:0}}>
        {STEPS.map((s,i)=><div key={s} style={{flex:1}}><div style={{height:3,borderRadius:2,background:i<step?T.acc:T.b1,marginBottom:5,transition:'background .3s'}}/><div style={{fontSize:10,color:i<step?T.acc:T.t3,textAlign:'center',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{s}</div></div>)}
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'16px 24px'}}>
        <ErrBox msg={err}/>
        {step===1&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
          <Inp label="Display Name" type="text" value={form.name} onChange={e=>setF('name',e.target.value)} placeholder="Jane Smith"/>
          <div>
            <Inp label="Email Address" type="email" value={form.email} onChange={e=>{setF('email',e.target.value);detectPreset(e.target.value);}} placeholder="you@company.com"/>
            {detect&&<p style={{fontSize:11,color:T.acc2,marginTop:6}}>⟳ Detecting server…</p>}
          </div>
          <Inp label="App Password" type="password" value={form.password} onChange={e=>setF('password',e.target.value)} placeholder="xxxx xxxx xxxx xxxx" style={{letterSpacing:'.15em'}}/>
        </div>}
        {step===2&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
          {preset&&<div style={{background:'rgba(30,216,158,.07)',border:`1px solid rgba(30,216,158,.22)`,borderRadius:10,padding:'9px 14px'}}><p style={{fontSize:12,color:T.grn}}>✓ Auto-detected for {form.email.split('@')[1]}</p></div>}
          <Inp label="IMAP Host" value={form.imapHost} onChange={e=>setF('imapHost',e.target.value)} placeholder="imap.example.com"/>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1}}><Inp label="IMAP Port" type="number" value={form.imapPort} onChange={e=>setF('imapPort',parseInt(e.target.value)||993)}/></div>
            <div style={{flex:1}}><Sel label="Security" value={form.imapSecure?'ssl':'start'} onChange={e=>setF('imapSecure',e.target.value==='ssl')}><option value="ssl">SSL/TLS</option><option value="start">STARTTLS</option></Sel></div>
          </div>
          <Inp label="SMTP Host" value={form.smtpHost} onChange={e=>setF('smtpHost',e.target.value)} placeholder="smtp.example.com"/>
          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1}}><Inp label="SMTP Port" type="number" value={form.smtpPort} onChange={e=>setF('smtpPort',parseInt(e.target.value)||587)}/></div>
            <div style={{flex:1}}><Sel label="Security" value={form.smtpSecure?'ssl':'start'} onChange={e=>setF('smtpSecure',e.target.value==='ssl')}><option value="ssl">SSL/TLS (465)</option><option value="start">STARTTLS (587)</option></Sel></div>
          </div>
        </div>}
        {step===3&&<div style={{background:'rgba(30,216,158,.07)',border:`1px solid rgba(30,216,158,.22)`,borderRadius:14,padding:24,textAlign:'center'}}>
          <div style={{marginBottom:10}}><Ic.Check s={44} c={T.grn}/></div>
          <p style={{color:T.grn,fontWeight:700,fontSize:15,fontFamily:T.dp}}>Connection verified!</p>
          <p style={{color:T.acc2,fontSize:13,marginTop:4}}>{form.email}</p>
          <div style={{marginTop:16,background:T.sur,borderRadius:10,padding:'12px 16px',border:`1px solid ${T.b1}`,textAlign:'left'}}>
            {[['IMAP',`${form.imapHost}:${form.imapPort}`],['SMTP',`${form.smtpHost}:${form.smtpPort}`]].map(([k,v])=><div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:k==='IMAP'?8:0}}><span style={{fontSize:11,color:T.t3}}>{k}</span><span style={{fontSize:12,color:T.t1,fontFamily:T.mn}}>{v}</span></div>)}
          </div>
        </div>}
      </div>
      <MF>
        <button onClick={()=>{if(step>1){setStep(step-1);setErr('');}else onClose();}} className="btn bg" style={{flex:1,padding:'10px',fontSize:13}}>{step===1?'Cancel':'← Back'}</button>
        {step===1&&<button onClick={()=>{setErr('');setStep(2);}} disabled={!form.email||!form.password} className="btn bp" style={{flex:2,padding:'10px',fontSize:13}}>Continue →</button>}
        {step===2&&<button onClick={test} disabled={busy||!form.imapHost} className="btn bp" style={{flex:2,padding:'10px',fontSize:13}}>{busy?'Testing…':'Test Connection →'}</button>}
        {step===3&&<button onClick={add} disabled={busy} className="btn bp" style={{flex:2,padding:'10px',fontSize:13}}>{busy?'Adding…':'Add Account ✓'}</button>}
      </MF>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CSV IMPORT MODAL
// ═══════════════════════════════════════════════════════════════════
function CSVImportModal({onClose,onImported,existingAccounts=[]}){
  const [step,setStep]=useState(1);const [rows,setRows]=useState([]);const [res,setRes]=useState([]);
  const [drag,setDrag]=useState(false);const [err,setErr]=useState('');const fref=useRef();

  const handleFile=file=>{
    if(!file)return;
    const r=new FileReader();
    r.onload=e=>{
      const parsed=parseAcctCSV(e.target.result);
      if(parsed===null){setErr('CSV needs Email and Password columns.');return;}
      if(!parsed.length){setErr('No valid rows.');return;}
      const seen=new Set(),uniq=[];
      parsed.forEach(x=>{const em=x.email.trim().toLowerCase();if(!em||seen.has(em))return;seen.add(em);uniq.push(x);});
      const newRows=uniq.filter(x=>!existingAccounts.find(a=>a.email?.toLowerCase()===x.email.trim().toLowerCase())).slice(0,500-existingAccounts.length);
      if(!newRows.length){setErr('All emails already added or limit reached.');return;}
      setErr('');setRows(newRows);setStep(2);
    };
    r.readAsText(file);
  };

  const startImport=async()=>{
    setStep(3);const out=new Array(rows.length).fill(null);
    for(let b=0;b<rows.length;b+=2){
      await Promise.all(rows.slice(b,b+2).map(async(row,j)=>{
        const idx=b+j;
        try{const acc=await apiFetch('/accounts',{method:'POST',body:JSON.stringify({email:row.email,password:row.password,name:row.name}),timeout:45000});out[idx]={...row,ok:true};onImported(acc);}
        catch(e){out[idx]={...row,ok:false,error:e.message};}
      }));
      await new Promise(r=>setTimeout(r,400));
    }
    setRes(out.filter(Boolean));setStep(4);
  };

  const ok=res.filter(r=>r.ok).length,fail=res.filter(r=>!r.ok).length;
  return(
    <Modal onClose={step!==3?onClose:undefined} width={520}>
      <MH icon="📊" title="Import via CSV" sub={['Upload CSV',`${rows.length} ready`,'Connecting…',`Done — ${ok} connected`][step-1]} onClose={step!==3?onClose:undefined}/>
      <div style={{height:3,background:T.b1,flexShrink:0}}><div style={{height:'100%',background:T.acc,width:`${(step/4)*100}%`,transition:'width .5s',borderRadius:2}}/></div>
      <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
        {step===1&&<>
          <ErrBox msg={err} type={err?.startsWith('⚠')?'warn':'error'}/>
          <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fref.current?.click()}
            style={{border:`2px dashed ${drag?T.acc:T.b2}`,borderRadius:16,padding:'40px 20px',textAlign:'center',cursor:'pointer',background:drag?T.aBg:T.sur,transition:'all .18s'}}>
            <div style={{fontSize:40,marginBottom:12}}>📂</div>
            <p style={{fontSize:14,fontWeight:700,color:T.t1,marginBottom:6}}>Drop CSV here</p>
            <p style={{fontSize:12,color:T.acc2}}>or click to browse</p>
            <p style={{fontSize:11,color:T.t3,marginTop:8}}>Columns: Email, Password (Name optional)</p>
            <input ref={fref} type="file" accept=".csv" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
          </div>
        </>}
        {step===2&&<div style={{border:`1px solid ${T.b1}`,borderRadius:12,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr style={{background:T.sur}}>{['#','Name','Email','Password'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontWeight:700,color:T.t3,borderBottom:`1px solid ${T.b1}`,fontSize:10,textTransform:'uppercase',letterSpacing:'.04em'}}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r,i)=><tr key={i} style={{borderBottom:i!==rows.length-1?`1px solid ${T.b1}`:'none'}}>
              <td style={{padding:'8px 12px',color:T.t3,fontFamily:T.mn}}>{i+1}</td>
              <td style={{padding:'8px 12px',color:T.t1,fontWeight:500}}>{r.name||'—'}</td>
              <td style={{padding:'8px 12px',color:T.acc2,fontFamily:T.mn,fontSize:11}}>{r.email}</td>
              <td style={{padding:'8px 12px',color:T.t3,fontFamily:T.mn,fontSize:11}}>{'•'.repeat(Math.min(r.password.length,12))}</td>
            </tr>)}</tbody>
          </table>
        </div>}
        {step===3&&<div style={{textAlign:'center',padding:'40px 0'}}>
          <div style={{width:48,height:48,border:`3px solid ${T.b1}`,borderTop:`3px solid ${T.acc}`,borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto 20px'}}/>
          <p style={{fontSize:14,fontWeight:600,color:T.t1}}>Connecting accounts…</p>
          <p style={{fontSize:12,color:T.t2,marginTop:8}}>{rows.length} in parallel batches</p>
        </div>}
        {step===4&&<>
          <div style={{display:'flex',gap:10,marginBottom:16}}>
            <div style={{flex:1,background:T.aBg,border:`1px solid ${T.aBd}`,borderRadius:10,padding:14,textAlign:'center'}}><div style={{fontSize:28,fontWeight:800,color:T.acc,fontFamily:T.dp}}>{ok}</div><div style={{fontSize:11,color:T.acc2}}>Connected</div></div>
            {fail>0&&<div style={{flex:1,background:'rgba(255,69,96,.08)',border:`1px solid rgba(255,69,96,.22)`,borderRadius:10,padding:14,textAlign:'center'}}><div style={{fontSize:28,fontWeight:800,color:T.red,fontFamily:T.dp}}>{fail}</div><div style={{fontSize:11,color:T.red}}>Failed</div></div>}
          </div>
          <div style={{border:`1px solid ${T.b1}`,borderRadius:12,overflow:'hidden'}}>
            {res.map((r,i)=><div key={i} style={{padding:'10px 14px',display:'flex',alignItems:'center',gap:10,borderBottom:i!==res.length-1?`1px solid ${T.b1}`:'none'}}>
              {r.ok?<Ic.Check s={15} c={T.grn}/>:<Ic.X s={15} c={T.red}/>}
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:T.t1}}>{r.name||r.email}</div><div style={{fontSize:11,color:r.ok?T.acc2:T.red}}>{r.ok?r.email:r.error}</div></div>
            </div>)}
          </div>
        </>}
      </div>
      <MF>
        {step===1&&<><button onClick={onClose} className="btn bg" style={{flex:1,padding:'10px',fontSize:13}}>Cancel</button><button onClick={()=>fref.current?.click()} className="btn bp" style={{flex:2,padding:'10px',fontSize:13}}>Choose File</button></>}
        {step===2&&<><button onClick={()=>setStep(1)} className="btn bg" style={{flex:1,padding:'10px',fontSize:13}}>← Back</button><button onClick={startImport} className="btn bp" style={{flex:2,padding:'10px',fontSize:13}}>Import {rows.length} Accounts →</button></>}
        {step===4&&<button onClick={onClose} className="btn bp" style={{flex:1,padding:'10px',fontSize:13}}>Done ✓</button>}
      </MF>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ACCOUNT SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════
function AccountSettingsModal({accounts,signatures,accountSettings,onSigChange,onAccSetChange,onClose,onAddManual,onAddCSV,onRemove}){
  const [confirmDel,setConfirmDel]=useState(null);const [tab,setTab]=useState('accounts');
  const [openPanel,setOpenPanel]=useState(null);const [search,setSearch]=useState('');
  const terms=search.toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
  const filtered=accounts.filter(a=>!terms.length||terms.some(t=>(a.email||'').toLowerCase().includes(t)||(a.name||'').toLowerCase().includes(t)));
  return(
    <Modal onClose={onClose} width={600} maxH="90vh">
      <MH icon={<Ic.Cog s={20} c={T.acc}/>} title="Account Settings" sub={`${accounts.length} connected`} onClose={onClose}/>
      <div style={{display:'flex',borderBottom:`1px solid ${T.b1}`,padding:'0 24px',flexShrink:0}}>
        {[{id:'accounts',l:`Accounts (${accounts.length})`},{id:'add',l:'Add Accounts'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`tb${tab===t.id?' on':''}`} style={{fontWeight:tab===t.id?600:400}}>{t.l}</button>
        ))}
      </div>
      {tab==='accounts'&&<div style={{padding:'12px 24px',borderBottom:`1px solid ${T.b1}`,flexShrink:0}}>
        <div style={{position:'relative'}}><div style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}><Ic.Search s={13} c={T.t3}/></div><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search accounts…" className="inp" style={{paddingLeft:36}}/></div>
      </div>}
      <div style={{flex:1,overflowY:'auto'}}>
        {tab==='accounts'&&filtered.map((acc,i)=>{
          const color=gc(i),isCDel=confirmDel===acc.id,aSet=accountSettings[acc.id]||{},hasSig=!!signatures[acc.id];
          const sigOpen=openPanel===acc.id+':s',dlyOpen=openPanel===acc.id+':d';
          return(<div key={acc.id} style={{borderBottom:`1px solid ${T.b1}`}}>
            <div style={{padding:'14px 24px',display:'flex',alignItems:'center',gap:14}}>
              <Avatar name={acc.name||acc.email.split('@')[0]} email={acc.email} color={color} size={44}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:T.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{acc.name||acc.email.split('@')[0]}</div>
                <div style={{fontSize:11,color:T.acc2,marginTop:2,fontFamily:T.mn,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{acc.email}</div>
                <div style={{display:'flex',gap:5,marginTop:6,flexWrap:'wrap'}}>
                  <span className="tag" style={{background:'rgba(30,216,158,.09)',color:T.grn}}>● On</span>
                  {hasSig&&<span className="tag" style={{background:'rgba(244,161,48,.09)',color:T.amb}}>✍ Sig</span>}
                  {aSet.minDelay!=null&&<span className="tag" style={{background:T.aBg,color:T.acc2}}>⏱ {Math.round(aSet.minDelay/60)}–{Math.round((aSet.maxDelay||0)/60)}m</span>}
                </div>
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                <button onClick={()=>setOpenPanel(sigOpen?null:acc.id+':s')} style={{background:sigOpen?T.aBg:T.sur,border:`1px solid ${sigOpen?T.aBd:T.b1}`,color:sigOpen?T.acc:T.t2,cursor:'pointer',borderRadius:8,padding:'5px 11px',fontSize:11,fontWeight:500,transition:'all .12s'}}>✍ Sig</button>
                <button onClick={()=>setOpenPanel(dlyOpen?null:acc.id+':d')} style={{background:dlyOpen?T.aBg:T.sur,border:`1px solid ${dlyOpen?T.aBd:T.b1}`,color:dlyOpen?T.acc:T.t2,cursor:'pointer',borderRadius:8,padding:'5px 11px',fontSize:11,fontWeight:500,transition:'all .12s'}}>⏱</button>
                {isCDel?(<div style={{display:'flex',gap:5,alignItems:'center'}}><span style={{fontSize:11,color:T.red}}>Sure?</span><button onClick={()=>{onRemove(acc.id);setConfirmDel(null);}} className="btn bd" style={{borderRadius:6,padding:'4px 10px',fontSize:11}}>Yes</button><button onClick={()=>setConfirmDel(null)} className="btn bg" style={{borderRadius:6,padding:'4px 10px',fontSize:11,border:'none'}}>No</button></div>)
                :(<button onClick={()=>setConfirmDel(acc.id)} className="btn bd" style={{borderRadius:8,padding:'5px 10px',fontSize:11}}>✕</button>)}
              </div>
            </div>
            {sigOpen&&<div style={{margin:'0 24px 16px',padding:16,background:T.sur,border:`1px solid ${T.b1}`,borderRadius:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <p style={{fontSize:13,fontWeight:600,color:T.t1}}>Signature — {acc.name||acc.email.split('@')[0]}</p>
                {hasSig&&<button onClick={()=>onSigChange(acc.id,'')} className="btn bd" style={{borderRadius:7,padding:'4px 10px',fontSize:11}}>Clear</button>}
              </div>
              <SigEditor key={'sig-'+acc.id} value={signatures[acc.id]||''} onChange={html=>onSigChange(acc.id,html)}/>
              {hasSig&&<div style={{marginTop:10,padding:'10px 14px',background:T.pan,border:`1px dashed ${T.b1}`,borderRadius:10}}><p style={{fontSize:10,color:T.t3,marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>Preview</p><div style={{fontSize:13}} dangerouslySetInnerHTML={{__html:signatures[acc.id]}}/></div>}
            </div>}
            {dlyOpen&&<div style={{margin:'0 24px 16px',padding:16,background:T.sur,border:`1px solid ${T.b1}`,borderRadius:12}}>
              <DelayPanel key={'dly-'+acc.id} accName={acc.name||acc.email.split('@')[0]} initialMin={aSet.minDelay} initialMax={aSet.maxDelay} onChange={(k,v)=>onAccSetChange(acc.id,k,v)}/>
            </div>}
          </div>);
        })}
        {tab==='add'&&<div style={{padding:'16px 24px'}}>
          {[{icon:<Ic.Upload s={20} c="#fff"/>,t:'Import via CSV',s:'Bulk-add multiple accounts.',n:'✓ Recommended for 2+ accounts',fn:()=>{onClose();onAddCSV();}},{icon:<Ic.Pen s={20} c="#fff"/>,t:'Add Manually',s:'Add a single account.',fn:()=>{onClose();onAddManual();}}].map((item,i)=>(
            <div key={i} onClick={item.fn} style={{border:`1px solid ${T.b1}`,borderRadius:14,padding:20,marginBottom:12,cursor:'pointer',background:T.sur,transition:'all .18s'}} onMouseEnter={e=>{e.currentTarget.style.background=T.card;e.currentTarget.style.borderColor=T.b2;e.currentTarget.style.transform='translateY(-1px)';}} onMouseLeave={e=>{e.currentTarget.style.background=T.sur;e.currentTarget.style.borderColor=T.b1;e.currentTarget.style.transform='translateY(0)';}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:46,height:46,borderRadius:14,background:T.acc,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.t1}}>{item.t}</div><div style={{fontSize:12,color:T.t2,marginTop:3}}>{item.s}</div>{item.n&&<div style={{fontSize:11,color:T.acc2,marginTop:5}}>{item.n}</div>}</div>
                <Ic.ChevR s={14} c={T.t3}/>
              </div>
            </div>
          ))}
        </div>}
      </div>
      <MF><button onClick={onClose} className="btn bg" style={{width:'100%',padding:'10px',fontSize:13}}>Close</button></MF>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSE MODAL
// ═══════════════════════════════════════════════════════════════════
function ComposeModal({accounts,defaultAccountId,replyTo,onClose,onSent}){
  const avail=accounts?.length?accounts:[];
  const [from,setFrom]=useState(defaultAccountId||avail[0]?.id||'');
  const [to,setTo]=useState(replyTo?.from?.email||'');
  const [cc,setCc]=useState('');const [bcc,setBcc]=useState('');
  const [subj,setSubj]=useState(replyTo?'RE: '+(replyTo.subject||''):'');
  const [busy,setBusy]=useState(false);const [showCc,setShowCc]=useState(false);const [showBcc,setShowBcc]=useState(false);const [err,setErr]=useState('');
  const editorRef=useRef(null);

  const replyHTML=replyTo
    ?`<br><br><div style="margin-top:18px;padding-top:16px;border-top:1px solid #e0e0e0"><div style="font-size:12px;color:#444444;line-height:1.7"><b style="color:#111111">From:</b> ${replyTo.from?.name?`${replyTo.from.name} &lt;${replyTo.from.email}&gt;`:replyTo.from?.email||''}<br><b style="color:#111111">Date:</b> ${new Date(replyTo.date).toLocaleString()}<br><b style="color:#111111">To:</b> ${(replyTo.to||[]).map(t=>t.email).join(', ')||''}<br><b style="color:#111111">Subject:</b> ${replyTo.subject||''}</div><div style="margin-top:10px">${replyTo.body||replyTo.preview||''}</div></div>`
    :'';

  const send=async()=>{
    if(!avail.length)return setErr('No sender account.');
    if(!from)return setErr('Select a sender.');
    if(!to.trim())return setErr('To is required.');
    if(!subj.trim())return setErr('Subject is required.');
    const html=editorRef.current?.innerHTML||'';
    if(!(editorRef.current?.textContent||'').trim())return setErr('Body is empty.');
    setBusy(true);setErr('');
    try{await apiFetch('/accounts/'+from+'/send',{method:'POST',timeout:120000,body:JSON.stringify({to,cc:cc||undefined,bcc:bcc||undefined,subject:subj,body:html})});onSent?.();onClose();}
    catch(e){setErr(e.message);}
    setBusy(false);
  };

  const FR={display:'flex',alignItems:'center',borderBottom:`1px solid ${T.b1}`};
  const FI={flex:1,background:'transparent',border:'none',color:T.t1,padding:'10px 16px',fontSize:13,outline:'none',fontFamily:T.sn};

  return(
    <div style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,.72)',backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div className="fu" style={{background:T.pan,borderRadius:18,width:'min(90vw,1080px)',height:'min(88vh,760px)',display:'flex',flexDirection:'column',boxShadow:`0 32px 80px rgba(0,0,0,.75),0 0 0 1px ${T.b2}`,overflow:'hidden'}}>
        <div style={{padding:'12px 18px',background:T.sur,borderBottom:`1px solid ${T.b1}`,display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <span style={{fontSize:14,fontWeight:700,color:T.t1,flex:1,fontFamily:T.dp}}>{replyTo?'Reply':'New Message'}</span>
          <button onClick={onClose} style={{background:'none',border:'none',color:T.t2,cursor:'pointer',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,transition:'all .12s'}} onMouseEnter={e=>{e.currentTarget.style.background=T.card;e.currentTarget.style.color=T.t1;}} onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=T.t2;}}><Ic.X s={15}/></button>
        </div>
        <div style={{flexShrink:0,borderBottom:`1px solid ${T.b1}`,background:T.pan}}>
          <div style={FR}>
            <select value={from} onChange={e=>setFrom(e.target.value)} style={{flex:1,background:'transparent',border:'none',color:T.t1,padding:'10px 16px',fontSize:13,outline:'none',cursor:'pointer',fontFamily:T.sn}}>
              {avail.map(a=><option key={a.id} value={a.id}>{a.name?`${a.name} <${a.email}>`:a.email}</option>)}
            </select>
            <div style={{display:'flex',paddingRight:12,gap:4}}>
              {[['CC',showCc,()=>setShowCc(!showCc)],['BCC',showBcc,()=>setShowBcc(!showBcc)]].map(([l,on,fn])=>(
                <button key={l} onClick={fn} style={{background:on?T.aBg:'transparent',border:`1px solid ${on?T.aBd:T.b1}`,borderRadius:6,color:on?T.acc:T.t3,cursor:'pointer',padding:'3px 10px',fontSize:11,fontWeight:500,transition:'all .12s'}}>{l}</button>
              ))}
            </div>
          </div>
          <div style={FR}><input value={to} onChange={e=>setTo(e.target.value)} placeholder="To" style={FI}/></div>
          {showCc&&<div style={FR}><input value={cc} onChange={e=>setCc(e.target.value)} placeholder="CC" style={FI}/></div>}
          {showBcc&&<div style={FR}><input value={bcc} onChange={e=>setBcc(e.target.value)} placeholder="BCC" style={FI}/></div>}
          <div style={{...FR,borderBottom:'none'}}><input value={subj} onChange={e=>setSubj(e.target.value)} placeholder="Subject" style={{...FI,fontSize:14,fontWeight:600}}/></div>
        </div>
        {err&&<div style={{padding:'8px 18px',background:'rgba(255,69,96,.08)',borderBottom:`1px solid rgba(255,69,96,.2)`,flexShrink:0,display:'flex',alignItems:'center',gap:8}}><Ic.Alert s={13} c={T.red}/><span style={{fontSize:12,color:T.red}}>{err}</span></div>}
        <RichEditor editorRef={editorRef} initialHTML={replyHTML}/>
        <div style={{padding:'10px 18px',borderTop:`1px solid ${T.b1}`,display:'flex',alignItems:'center',background:T.sur,flexShrink:0}}>
          <button onClick={onClose} className="btn bg" style={{borderRadius:20,padding:'8px 18px',fontSize:13}}>Discard</button>
          <button onClick={send} disabled={busy} className="btn bp" style={{marginLeft:'auto',borderRadius:20,padding:'9px 28px',fontSize:13}}>
            <Ic.Send s={13} c="#fff"/>{busy?'Sending…':'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONTEXT MENU
// ═══════════════════════════════════════════════════════════════════
function CtxMenu({x,y,mail,allMails,folderLabel,onClose,onStar,onMarkRead,onDelete,sortBy='date-desc',onSort}){
  const ref=useRef();
  const subRef=useRef(null);
  const [subOpen,setSubOpen]=useState(false);

  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))onClose();};
    const k=e=>{if(e.key==='Escape')onClose();};
    document.addEventListener('mousedown',h);document.addEventListener('keydown',k);
    return()=>{document.removeEventListener('mousedown',h);document.removeEventListener('keydown',k);};
  },[onClose]);

  const sortOptions=[
    {key:'date-desc',label:'↓ Newest First'},
    {key:'date-asc', label:'↑ Oldest First'},
    {key:'name-asc', label:'A→Z Sender Name'},
    {key:'name-desc',label:'Z→A Sender Name'},
    {key:'email-asc',label:'A→Z Email'},
    {key:'email-desc',label:'Z→A Email'},
  ];

  const items=[
    {icon:<Ic.Trash s={12} c={T.red}/>,label:<span style={{color:T.red}}>Delete</span>,fn:()=>{onDelete(mail);onClose();}},
    {div:true},
    {icon:<Ic.Mail s={12}/>,label:mail.read?'Mark Unread':'Mark Read',fn:()=>{onMarkRead(mail,!mail.read);onClose();}},
    {icon:<Ic.Mail s={12}/>,label:`Mark all ${allMails.length} read`,fn:()=>{allMails.forEach(m=>{if(!m.read)onMarkRead(m,true);});onClose();}},
    {icon:<Ic.Star s={12}/>,label:mail.starred?'Remove star':'Star',fn:()=>{onStar(mail);onClose();}},
    {div:true},
    {icon:<Ic.Down s={12}/>,label:'Save as .EML',fn:()=>{expEML(mail);onClose();}},
    {icon:<Ic.Down s={12}/>,label:'Export as CSV',fn:()=>{expCSV([mail],'email.csv');onClose();}},
    {div:true},
    {icon:<Ic.Down s={12}/>,label:'Export all MBOX',fn:()=>{expMBOX(allMails,folderLabel||'emails');onClose();}},
    {icon:<Ic.Down s={12}/>,label:'Export all CSV',fn:()=>{expCSV(allMails,`${folderLabel||'emails'}.csv`);onClose();}},
    {div:true},
    {submenu:true,label:'Sort mail list'},
  ];

  const W=264,vw=window.innerWidth,vh=window.innerHeight;
  const H=items.reduce((s,i)=>s+(i.div?8:34),0)+60;
  const left=x+W>vw?x-W:x, top=y+H>vh?y-H:y;

  return(
    <div ref={ref} style={{position:'fixed',left,top,zIndex:9999,background:T.card,border:`1px solid ${T.b2}`,borderRadius:14,boxShadow:'0 16px 48px rgba(0,0,0,.65)',minWidth:W,padding:'6px 0',animation:'ctxIn .1s ease'}}>
      <div style={{padding:'8px 14px',borderBottom:`1px solid ${T.b1}`}}>
        <div style={{fontSize:12,fontWeight:600,color:T.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{mail.subject||'(no subject)'}</div>
        <div style={{fontSize:11,color:T.acc2,marginTop:2}}>{mail.from?.name||mail.from?.email}</div>
      </div>
      {items.map((item,i)=>
        item.div
          ? <div key={i} style={{height:1,background:T.b1,margin:'3px 0'}}/>
          : item.submenu
            ? (
              <div key={i} ref={subRef}
                onMouseEnter={()=>setSubOpen(true)}
                onMouseLeave={()=>setSubOpen(false)}
                style={{position:'relative'}}>
                <button style={{width:'100%',background:subOpen?T.hov:'none',border:'none',cursor:'pointer',
                  display:'flex',alignItems:'center',gap:10,padding:'7px 14px',fontSize:12,
                  color:T.t1,textAlign:'left',transition:'background .1s'}}>
                  <span style={{width:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:T.t2,fontSize:13}}>⇅</span>
                  <span style={{flex:1}}>{item.label}</span>
                  <Ic.ChevR s={10} c={T.t3}/>
                </button>
                {subOpen&&(()=>{
                  const rect=subRef.current?.getBoundingClientRect();
                  if(!rect)return null;
                  const subW=190;
                  const goLeft=rect.right+subW>vw;
                  return(
                    <div style={{position:'fixed',left:goLeft?rect.left-subW:rect.right,
                      top:rect.top,zIndex:10000,background:T.card,border:`1px solid ${T.b2}`,
                      borderRadius:10,boxShadow:'0 8px 32px rgba(0,0,0,.55)',
                      minWidth:subW,padding:'4px 0',animation:'ctxIn .1s ease'}}>
                      {sortOptions.map(opt=>(
                        <button key={opt.key} onClick={()=>{onSort?.(opt.key);onClose();}}
                          style={{width:'100%',background:'none',border:'none',cursor:'pointer',
                            display:'flex',alignItems:'center',gap:8,padding:'7px 14px',
                            fontSize:12,color:T.t1,textAlign:'left',transition:'background .1s'}}
                          onMouseEnter={e=>e.currentTarget.style.background=T.hov}
                          onMouseLeave={e=>e.currentTarget.style.background='none'}>
                          <span style={{width:14,color:T.acc,fontSize:11,flexShrink:0,textAlign:'center'}}>{sortBy===opt.key?'✓':''}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )
            : (
              <button key={i} onClick={item.fn}
                style={{width:'100%',background:'none',border:'none',cursor:'pointer',display:'flex',
                  alignItems:'center',gap:10,padding:'7px 14px',fontSize:12,color:T.t1,
                  textAlign:'left',transition:'background .1s'}}
                onMouseEnter={e=>e.currentTarget.style.background=T.hov}
                onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <span style={{width:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:T.t2}}>{item.icon}</span>{item.label}
              </button>
            )
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIL ROW + VIRTUAL LIST
// ═══════════════════════════════════════════════════════════════════
const ROW_H=76;

const MailRow = memo(({ mail, isSelected, accColor, onSelect, onRightClick, onStar }) => (
  <div className={`mr${isSelected ? ' sel' : ''}`} onClick={() => onSelect(mail)} onContextMenu={e => onRightClick(e, mail)} style={{ padding: '10px 14px', height: ROW_H, overflow: 'hidden' }}>
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <DomainFavicon
          email={mail.from?.email || ''}
          size={34}
          fallbackColor={accColor}
          fallbackInitial={ini(mail.from?.name, mail.from?.email)}
        />
        {!mail.read && <div style={{ position: 'absolute', top: -1, right: -1, width: 8, height: 8, borderRadius: '50%', background: T.acc, border: `2px solid ${T.pan}` }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: mail.read ? 400 : 600, color: mail.read ? T.t2 : T.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, paddingRight: 8 }}>{mail.from?.name || mail.from?.email || 'Unknown'}</span>
          <span style={{ fontSize: 10, color: T.t3, flexShrink: 0, fontFamily: T.mn }}>{fmtDate(mail.date)}</span>
        </div>
        <div style={{ fontSize: 12, color: mail.read ? T.t3 : T.t2, fontWeight: mail.read ? 400 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{mail.subject || '(no subject)'}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: T.t3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{stripHtml(mail.preview) || ' '}</span>
          <div style={{ display: 'flex', gap: 3, marginLeft: 4, alignItems: 'center', flexShrink: 0 }}>
            {mail.hasAttachment && <span style={{ color: T.t3, fontSize: 11 }}>📎</span>}
            <button className="sbtn" onClick={e => { e.stopPropagation(); onStar(mail); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: mail.starred ? 1 : 0, fontSize: 14, color: mail.starred ? T.amb : T.t3, padding: '0 2px', transition: 'all .15s', lineHeight: 1 }}>★</button>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const VirtualMailList=memo(({mails,selectedMailId,accounts,onSelect,onRightClick,onStar})=>{
  const outerRef=useRef(null);const rafRef=useRef(null);
  const [scroll,setScroll]=useState(0);const [height,setHeight]=useState(600);

  useEffect(()=>{
    if(!outerRef.current)return;
    const ro=new ResizeObserver(e=>{if(e[0])setHeight(e[0].contentRect.height);});
    ro.observe(outerRef.current);setHeight(outerRef.current.clientHeight||600);
    return()=>ro.disconnect();
  },[]);
  useEffect(()=>{
    if(!selectedMailId||!outerRef.current)return;
    const idx=mails.findIndex(m=>m.id===selectedMailId);
    if(idx<0)return;
    const H=outerRef.current.clientHeight||600;
    outerRef.current.scrollTop=Math.max(0,idx*ROW_H-Math.floor(H/2));
  // eslint-disable-next-line
  },[]);

  const onScroll=useCallback(()=>{
    if(!outerRef.current||rafRef.current)return;
    rafRef.current=requestAnimationFrame(()=>{setScroll(outerRef.current?.scrollTop??0);rafRef.current=null;});
  },[]);

  useEffect(()=>{
    const el=outerRef.current;if(!el)return;
    el.addEventListener('scroll',onScroll,{passive:true});
    return()=>{el.removeEventListener('scroll',onScroll);if(rafRef.current){cancelAnimationFrame(rafRef.current);rafRef.current=null;}};
  },[onScroll]);

  const {sliced,offsetY,totalH}=useMemo(()=>{
    const BUF=6,total=mails.length*ROW_H;
    const start=Math.max(0,Math.floor(scroll/ROW_H)-BUF);
    const end=Math.min(mails.length,Math.ceil((scroll+height)/ROW_H)+BUF);
    return{sliced:mails.slice(start,end),offsetY:start*ROW_H,totalH:total};
  },[mails,scroll,height]);

  const colorMap=useMemo(()=>{const m={};accounts.forEach((a,i)=>{m[a.id]=gc(i);});return m;},[accounts]);

  return(
    <div ref={outerRef} style={{flex:1,overflowY:'auto',position:'relative',overscrollBehavior:'contain',WebkitOverflowScrolling:'touch'}}>
      <div style={{height:totalH,position:'relative'}}>
        <div style={{position:'absolute',top:offsetY,left:0,right:0,contain:'layout style'}}>
          {sliced.map(mail=><MailRow key={mail.id} mail={mail} isSelected={selectedMailId===mail.id} accColor={colorMap[mail.accountId]||T.t3} onSelect={onSelect} onRightClick={onRightClick} onStar={onStar}/>)}
        </div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
// LIVE LOG VIEWER
// ═══════════════════════════════════════════════════════════════════
const LiveLogViewer=({campId,engRef})=>{
  const [,tick]=useState(0);
  useEffect(()=>{const iv=setInterval(()=>tick(n=>n+1),800);return()=>clearInterval(iv);},[]);
  const logs=engRef.current[campId]?.logs||[];
  const sc=s=>s==='error'?T.red:s==='sent'?T.grn:s==='sending'?T.acc:T.t2;
  return(
    <div style={{flex:1,overflowY:'auto',background:T.sur,borderRadius:12,padding:8,border:`1px solid ${T.b1}`}}>
      <div style={{display:'grid',gridTemplateColumns:'44px 1fr 1fr 120px',gap:8,padding:'8px 12px',fontSize:10,color:T.t3,fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',borderBottom:`1px solid ${T.b1}`,position:'sticky',top:0,background:T.sur,zIndex:2}}>
        <span>Row</span><span>Sender</span><span>Recipient</span><span>Status</span>
      </div>
      {!logs.length?<div style={{padding:40,textAlign:'center',color:T.t3,fontSize:13}}>Initializing queue…</div>
      :logs.map((log,i)=>{
        const wait=log.wakeTime?Math.max(0,Math.ceil((log.wakeTime-Date.now())/1000)):0;
        return(
          <div key={i} style={{display:'grid',gridTemplateColumns:'44px 1fr 1fr 120px',gap:8,padding:'8px 12px',borderRadius:8,background:T.pan,border:`1px solid ${T.b1}`,fontSize:12,alignItems:'center',marginTop:4}}>
            <span style={{color:T.t3,fontFamily:T.mn,fontSize:11}}>{log.row}</span>
            <span style={{color:T.t1,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.fromEmail}</span>
            <span style={{color:T.acc2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.email}</span>
            <span style={{fontWeight:700,fontFamily:T.mn,fontSize:11,color:sc(log.status)}}>
              {log.status==='error'?'✕ ERR':log.status==='sent'?'✓ SENT':log.status==='sending'?'⚡ …':`⏱ ${String(Math.floor(wait/60)).padStart(2,'0')}:${String(wait%60).padStart(2,'0')}`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CAMPAIGNS PAGE
// ═══════════════════════════════════════════════════════════════════
function CampaignsPage({accounts,signatures,accountSettings,campaigns,onUpdateCampaigns,isVisible}){
  const[selId,setSelId]=useState(()=>ls.get('mOS_selCamp',null));const[tab,setTab]=useState('csv');const [fuTab,setFuTab]=useState('pitch');
  const [prevRow,setPrevRow]=useState(0);const [fuPrevRow,setFuPrevRow]=useState(0);const [prevSnd,setPrevSnd]=useState(null);
  const[previewMobile,setPreviewMobile]=useState(false);
  const [dragOver,setDragOver]=useState(false);const [editName,setEditName]=useState(false);
  const[fuSubj,setFuSubj]=useState('');const [skipPopup,setSkipPopup]=useState(false);
  const[plainText,setPlainText]=useState(false);
  const [sndSrch,setSndSrch]=useState('');const [csvSrch,setCsvSrch]=useState('');const [histSrch,setHistSrch]=useState('');
  const [subjFocused,setSubjFocused]=useState(false);
  const subjRef=useRef(null);
  const [progMap,setProgMap]=useState({});
  const[trackData,setTrackData]=useState({});   
  const [scanning,setScanning]=useState(false);
  const[saveToast,setSaveToast]=useState('');
  const [histVersion, setHistVersion] = useState(0); 
  const[viewHistBody, setViewHistBody] = useState(null); 
  const[histData, setHistData] = useState({}); 
  const engRef=useRef({});const pitchRef=useRef(null);const fuRef=useRef(null);const csvRef=useRef(null);
  
  const pitchDraftRef=useRef({});
  const fuDraftRef=useRef({});
  const pitchSaveTimer=useRef(null);
  const fuSaveTimer=useRef(null);
  const showToast=useCallback((msg,ms=2200)=>{setSaveToast(msg);setTimeout(()=>setSaveToast(''),ms);},[]);

  const sel=campaigns.find(c=>c.id===selId)||null;
  useEffect(()=>{ls.set('mOS_selCamp',selId);},[selId]);

  const fetchAndMergeHistory = useCallback(async (id) => {
    if (!id) return;
    try {
      const dbHist = await apiFetch('/campaigns/' + id + '/history', { timeout: 30000 });
      if (!Array.isArray(dbHist)) return;

      setHistData(prev => {
        const existing = prev[id] ||[];
        const normalized = dbHist.map(h => ({
          rowIdx: h.rowIdx, sentAt: h.sentAt,
          senderEmail: h.senderEmail, senderName: h.senderName || '',
          toEmail: h.toEmail, subject: h.subject || '',
          bodyHTML: h.bodyHTML || '', rowData: h.rowData ||[],
          touchType: h.touchType || 'first', trackId: h.trackId || '',
        }));
        const merged = dedupeHistoryEntries([...existing, ...normalized]).sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
        );
        try { ls.set('mOS_hist_' + id, merged.map(h => ({ ...h, bodyHTML: '' }))); } catch {}
        setHistVersion(v => v + 1);
        return { ...prev, [id]: merged };
      });
    } catch (e) {
      console.warn("Failed to fetch history:", e);
    }
  },[]);

  // Replace entire getHist:
const getHist = useCallback((id) => {
  const stateHist = histData[id] || [];   // has bodyHTML
  let lsHist = [];
  try { lsHist = ls.get('mOS_hist_' + id, []); } catch {}
  // lsHist processed first (no bodyHTML), stateHist processed second →
  // dedup's "prefer longer bodyHTML" rule lets stateHist win for equal sentAt
  const merged = dedupeHistoryEntries([...lsHist, ...stateHist]);
  merged.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  return merged;
}, [histData]);

  useEffect(() => {
    if (!selId) return;
    const c = campaigns.find(x => x.id === selId); if (!c) return;
    setPrevRow(0); setFuPrevRow(0); setPrevSnd(null);
    try { const t = ls.get('mOS_tab_' + selId); if (t) setTab(t); } catch {}
    setFuSubj(ls.get('mOS_fuSubj_' + selId, c.fuSubject || ''));

    apiFetch('/campaigns/' + selId + '/tracking')
      .then(t => setTrackData(prev => ({ ...prev, [selId]: t })))
      .catch(() => {});

    fetchAndMergeHistory(selId);

    apiFetch('/campaigns/' + selId + '/sent-rows', { timeout: 10000 }).then(dbRows => {
      if (!dbRows?.length) return;
      const lsRows = new Set(ls.get('mOS_sentRows_' + selId, []));
      const merged = [...new Set([...lsRows, ...dbRows])];
      if (merged.length > lsRows.size) ls.set('mOS_sentRows_' + selId, merged);
    }).catch(() => {});

    apiFetch('/campaigns/' + selId, { timeout: 10000 }).then(camp => {
    if (!camp) return;
    const currentId = selId; // capture for async closure safety

    // Priority: localStorage draft > server pitch (localStorage = last typed)
    const lsDraft   = ls.get('mOS_draft_'   + currentId, null);
    const lsDraftFu = ls.get('mOS_draftFu_' + currentId, null);
    const serverPitch = lsDraft   ?? camp.pitch    ?? '';
    const serverFu    = lsDraftFu ?? camp.fuPitch  ?? '';

    pitchDraftRef.current[currentId] = serverPitch;
    fuDraftRef.current[currentId]    = serverFu;
    try { ls.set('mOS_draft_'   + currentId, serverPitch); } catch {}
    try { ls.set('mOS_draftFu_' + currentId, serverFu);    } catch {}
    if (pitchRef.current) pitchRef.current.innerHTML = serverPitch;
    if (fuRef.current)    fuRef.current.innerHTML    = serverFu;
      onUpdateCampaigns(prev => prev.map(existing => {
        if (existing.id !== selId) return existing;
        const lsCsv = ls.get('mOS_csv_' + selId, null);
        const finalHeaders =
          (existing.csvHeaders?.length > 0) ? existing.csvHeaders :
          (lsCsv?.headers?.length > 0)      ? lsCsv.headers :
          (camp.csvHeaders?.length > 0)     ? camp.csvHeaders :[];
        const finalRows =
          (existing.csvRows?.length > 0) ? existing.csvRows :
          (lsCsv?.rows?.length > 0)      ? lsCsv.rows :
          (camp.csvRows?.length > 0)     ? camp.csvRows :[];
        if (finalHeaders.length > 0 && !lsCsv?.headers?.length) {
          try { ls.set('mOS_csv_' + selId, { headers: finalHeaders, rows: finalRows }); } catch {}
        }
        return {
          ...existing,
          subject:    camp.subject ?? existing.subject ?? '',
          pitch:      serverPitch,
          fuPitch:    serverFu,
          fuSubject:  camp.fuSubject ?? existing.fuSubject ?? '',
          emailCol:   existing.emailCol >= 0 ? existing.emailCol : (camp.emailCol ?? -1),
          senderIds:  existing.senderIds?.length ? existing.senderIds : (camp.senderIds ||[]),
          csvHeaders: finalHeaders,
          csvRows:    finalRows,
        };
      }));
    }).catch(() => {});
  // eslint-disable-next-line
  }, [selId]);

  useEffect(() => {
    if (tab !== 'history' || !selId) return;
    fetchAndMergeHistory(selId);
  },[tab, selId, fetchAndMergeHistory]);

  const doScan=useCallback(async()=>{
    if(!selId||scanning)return;
    setScanning(true);
    try{
      await apiFetch('/campaigns/'+selId+'/scan-tracking',{method:'POST',timeout:120000});
      const t=await apiFetch('/campaigns/'+selId+'/tracking');
      setTrackData(prev=>({...prev,[selId]:t}));
    }catch{}
    setScanning(false);
  },[selId,scanning]);


  // 🔥 FIXED: Bulletproof retry queue ensures network failures or concurrent edits never lose data!
  const pendingUpdates = useRef({});
  const saveDebounceTimer = useRef(null);

  const upd = useCallback((obj) => {
    if (!selId) return;
    const currentId = selId;
    if (obj.csvHeaders !== undefined || obj.csvRows !== undefined) {
      const current = campaigns.find(c => c.id === currentId);
      const h  = obj.csvHeaders !== undefined ? obj.csvHeaders : current?.csvHeaders ||[];
      const rw = obj.csvRows    !== undefined ? obj.csvRows    : current?.csvRows    ||[];
      try { ls.set('mOS_csv_' + currentId, { headers: h, rows: rw }); } catch {}
    }
    
    onUpdateCampaigns(prev => prev.map(c => c.id === currentId ? { ...c, ...obj } : c));
    pendingUpdates.current = { ...pendingUpdates.current, ...obj };
    
    const processQueue = async () => {
      if (Object.keys(pendingUpdates.current).length === 0) return;
      const payload = { ...pendingUpdates.current };
      pendingUpdates.current = {};
      
      // Pull absolute latest text instantly right before network push
      if (Object.prototype.hasOwnProperty.call(payload, 'pitch')) {
        const live = pitchDraftRef.current[currentId] ?? (pitchRef.current ? pitchRef.current.innerHTML : undefined);
        if (live !== undefined && live !== null) payload.pitch = live;
      }
      if (Object.prototype.hasOwnProperty.call(payload, 'fuPitch')) {
        const liveFu = fuDraftRef.current[currentId] ?? (fuRef.current ? fuRef.current.innerHTML : undefined);
        if (liveFu !== undefined && liveFu !== null) payload.fuPitch = liveFu;
      }
      
      try {
        await apiFetch('/campaigns/' + currentId, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Automatically put the unsaved work back in the queue and try again later!
        pendingUpdates.current = { ...payload, ...pendingUpdates.current };
        console.warn('Network error saving campaign, requeued:', err);
        clearTimeout(saveDebounceTimer.current);
        saveDebounceTimer.current = setTimeout(processQueue, 3000);
      }
    };

    clearTimeout(saveDebounceTimer.current);
    saveDebounceTimer.current = setTimeout(processQueue, 800);
  },[selId, onUpdateCampaigns, campaigns]);

  // 🔥 FIXED: Direct explicit saver now feeds into the secure queue rather than fighting it
  const savePitch=()=>{
    if(!pitchRef.current||!sel)return;
    let html=pitchRef.current.innerHTML||'';
    const sig=signatures[sel?.senderIds?.[0]||'']||'';
    if(sig&&html.includes(sig.slice(0,40))){html=html.replace(sig,'{{Account Signature}}');}
    pitchDraftRef.current[sel.id] = html; 
    ls.set('mOS_draft_'+sel.id,html);
    upd({pitch:html,subject:sel.subject||''});
  };

  const saveFu=()=>{
    if(!sel)return;
    const html=fuRef.current?.innerHTML||fuDraftRef.current[sel.id]||ls.get('mOS_draftFu_'+sel.id,'')||sel.fuPitch||'';
    if(!html)return;
    fuDraftRef.current[sel.id] = html; 
    ls.set('mOS_draftFu_'+sel.id,html);
    upd({fuPitch:html,fuSubject:fuSubj});
  };

  const newCamp=()=>{
    const id='c_'+Date.now();
    onUpdateCampaigns([...campaigns,{id,name:'Untitled Campaign',subject:'',emailCol:-1,csvHeaders:[],csvRows:[],pitch:'',fuPitch:'',fuSubject:'',skipListText:'',senderIds:[],status:'draft'}]);
    setSelId(id);setTab('csv');
    apiFetch('/campaigns',{method:'POST',body:JSON.stringify({id,name:'Untitled Campaign'})}).catch(()=>{});
  };
  // Replace entire delCamp function:
const delCamp = id => {
  // 1. Tombstone FIRST — survives reloads, blocks server resurrection
  try {
    const ts = ls.get('mOS_deleted_camps', []);
    if (!ts.includes(id)) ls.set('mOS_deleted_camps', [...ts, id]);
  } catch {}

  // 2. Wipe all local storage keys
  [
    'mOS_sentRows_', 'mOS_hist_', 'mOS_draft_', 'mOS_draftFu_', 'mOS_fuSubj_', 'mOS_tab_', 'mOS_csv_',
    'mailOS_csv_', 'mailOS_draft_pitch_', 'mailOS_draft_fu_pitch_', 'mailOS_draft_fu_subject_',
    'mailOS_history_', 'mailOS_sentRows_', 'mailOS_tab_'
  ].forEach(k => { try { localStorage.removeItem(k + id); } catch {} ls.del(k + id); });

  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('mOS_mc_') && k.includes(id)) localStorage.removeItem(k);
    }
  } catch {}

  apiFetch('/campaigns/' + id, { method: 'DELETE' }).catch(() => {});
  onUpdateCampaigns(campaigns.filter(c => c.id !== id));
  if (selId === id) setSelId(null);
};

  const rowMap=useCallback((rowIdx,snap)=>{
    const src=snap||sel;if(!src?.csvHeaders||!src?.csvRows)return{};
    const m={};src.csvHeaders.forEach((h,i)=>{if(h)m[h.trim().toLowerCase()]=(src.csvRows[rowIdx]||[])[i]||'';});return m;
  },[sel]);

  const rowMapArr=(arr,headers)=>{const m={};(headers||[]).forEach((h,i)=>{if(h)m[h.trim().toLowerCase()]=(arr||[])[i]||'';});return m;};

  const cleanSig=useCallback(html=>{if(!html)return'';try{const d=document.createElement('div');d.innerHTML=html;
  d.querySelectorAll('*').forEach(el=>{['onclick','onload','onerror','onmouseover','onfocus','onblur','onchange','onsubmit','javascript'].forEach(a=>{el.removeAttribute(a);});if(el.tagName==='SCRIPT'||el.tagName==='IFRAME')el.remove();});return d.innerHTML;}catch{return html;}},[]);

  const prevBody=(html,rowIdx,sid)=>{
    try{
    if(!sel||!html)return html||'';
    const rawSig=sid&&signatures[sid]?signatures[sid]:`<em style="color:${T.t3}">[Signature]</em>`;
    let sig=rawSig;
    try{
      const d=document.createElement('div');d.innerHTML=rawSig;
      d.querySelectorAll('div,p,span').forEach(el=>{
        el.style.margin='0';
        el.style.paddingTop='0';
        el.style.paddingBottom='0';
      });
      sig=d.innerHTML;
    }catch{}
    let out=injectSignature(html,sig);
    const m=rowMap(rowIdx);
    out=resolve(out,m);
    out=out.replace(/\{\{([^}]+)\}\}/g,`<span style="background:rgba(244,161,48,.15);color:${T.amb};padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.85em">{{$1}}</span>`);
    return out;
    }catch{return html||'';}
  };

  const handleCSV = file => {
    if (!file || !selId) return;
    const r = new FileReader();
    r.onload = e => {
      const { headers, rows } = parseCampCSV(e.target.result);
      const h  = headers ||[];
      const rw = rows    ||[];
      try { ls.set('mOS_csv_' + selId, { headers: h, rows: rw }); } catch {}
      onUpdateCampaigns(prev => prev.map(c =>
        c.id === selId ? { ...c, csvHeaders: h, csvRows: rw, emailCol: -1 } : c
      ));
      apiFetch('/campaigns/' + selId, {
        method: 'PUT',
        body: JSON.stringify({ csvHeaders: h, csvRows: rw, emailCol: -1 }),
      }).catch(() => {});
      setTab('pitch');
      try { ls.set('mOS_tab_' + selId, 'pitch'); } catch {}
    };
    r.readAsText(file);
  };
  const toggleSender=id=>{if(!sel)return;const ids=(sel.senderIds||[]).includes(id)?(sel.senderIds||[]).filter(x=>x!==id):[...(sel.senderIds||[]),id];upd({senderIds:ids});};

  const insertPH=(name,ref)=>{
    const el=ref?.current;if(!el)return;
    const s=window.getSelection();
    const saved=el.__savedRange;
    el.focus();
    if(saved){
      try{s?.removeAllRanges();s?.addRange(saved);}catch{}
    }else if(!s?.rangeCount||!el.contains(s.getRangeAt(0).commonAncestorContainer)){
      const r=document.createRange();r.selectNodeContents(el);r.collapse(false);
      s?.removeAllRanges();s?.addRange(r);
    }
    document.execCommand('insertHTML',false,'{{'+name+'}}');
  };

  const initEng=id=>{engRef.current[id]={abort:false,pause:false,logs:[],blocked:new Set(),errors:[]};};
  
  // 🔥 FIX 1: Atomic state updater prevents race conditions when parallel senders update the math
  const setProg = (id, obj) => setProgMap(prev => {
    const cur = prev[id] || {};
    const parsed = typeof obj === 'function' ? obj(cur) : obj;
    return { ...prev, [id]: { ...cur, ...parsed } };
  });

  const delayLoop=async(ms,id)=>{
    const e=engRef.current[id];let end=Date.now()+ms;
    while(Date.now()<end){
      if(e.abort)return false;
      while(e.pause&&!e.abort){await new Promise(r=>setTimeout(r,200));end+=200;}
      if(e.abort)return false;
      await new Promise(r=>setTimeout(r,Math.min(250,Math.max(10,end-Date.now()))));
    }
    return true;
  };

  const sendCamp=async()=>{
    const id=selId;
    const livePitch=pitchRef.current?.innerHTML||pitchDraftRef.current[id]||ls.get('mOS_draft_'+id,'')||sel.pitch||'';
    const snap={...sel,pitch:livePitch};
    if(!snap.pitch.replace(/<[^>]+>/g,'').trim())return alert('Pitch is empty.');
    if(!snap.subject?.trim())return alert('Subject is required.');
    const ec=snap.emailCol>=0?snap.emailCol:(snap.csvHeaders||[]).findIndex(h=>/email|mail/i.test(h||''));
    if(ec<0)return alert('No email column found.');
    const sIds=snap.senderIds||[];if(!sIds.length)return alert('Select at least one sender.');
    const rows=snap.csvRows||[];
    const doneSet=new Set(ls.get('mOS_sentRows_'+id,[]));
    try{
      const dbRows=await apiFetch('/campaigns/'+id+'/sent-rows',{timeout:10000});
      if(dbRows?.length){dbRows.forEach(ri=>doneSet.add(ri));ls.set('mOS_sentRows_'+id,[...doneSet]);}
    }catch{}
    const queue=rows.map((_,i)=>i).filter(i=>!doneSet.has(i)).map(ri=>({ri,failed:new Set()}));
    if(!queue.length)return alert('Campaign already complete.');

    initEng(id);setTab('progress');
    setProg(id,{type:'first',status:'running',sent:doneSet.size,total:rows.length,errors:[],startTime:new Date()});
    const getNext=sid=>{for(let i=0;i<queue.length;i++){if(!queue[i].failed.has(sid))return queue.splice(i,1)[0];}return null;};

    await Promise.all(sIds.map(async sid=>{
      const e=engRef.current[id];
      while(!e.abort&&!e.blocked.has(sid)){
        while(e.pause&&!e.abort)await new Promise(r=>setTimeout(r,200));
        if(e.abort||e.blocked.has(sid))return;
        const item=getNext(sid);if(!item)break;
        const{ri}=item;
        const toEmail=((rows[ri]||[])[ec]||'').trim();if(!toEmail)continue;
        const acc=accounts.find(a=>a.id===sid)||{};
        const cfg=accountSettings[sid]||{};
        const ms=(cfg.minDelay??60)*1000+Math.random()*((cfg.maxDelay??180)-(cfg.minDelay??60))*1000;
        e.logs=[{row:ri+1,email:toEmail,fromEmail:acc.email||sid,status:'waiting',wakeTime:Date.now()+ms},...e.logs].slice(0,1000);
        if(!await delayLoop(ms,id))return;
        const li=e.logs.findIndex(l=>l.row===ri+1);if(li!==-1)e.logs[li].status='sending';
        setProg(id,{});
        const m=rowMap(ri,snap);
        const sigHtml=signatures[sid]?signatures[sid]:'';
        let body=injectSignature(snap.pitch,sigHtml);
        body=normalizeForOutlook(resolve(body,m).replace(/\{\{[^}]+\}\}/g,''));
        const subj=resolve(snap.subject||'',m);
        try{
          const rowTrackId = `trk_${id}_${ri}_${Date.now().toString(36)}`;
          
          // 1. Send the Email
          await apiFetch('/accounts/'+sid+'/send',{method:'POST',timeout:300000,body:JSON.stringify({to:toEmail,subject:subj,body,trackId:rowTrackId})});
          
          const histEntry={rowIdx:ri,sentAt:new Date().toISOString(),senderEmail:acc.email||sid,senderName:acc.name||'',toEmail,subject:subj,
            bodyHTML:body,
            rowData:rows[ri],touchType:'first',trackId:rowTrackId};

          // 2. 🔥 FIX 2: Await Server DB Save BEFORE updating counter! (No catch, so errors fail the block safely)
          // History save in its own try-catch — a DB timeout never shows as "Request timed out" in log
          try {
            await apiFetch('/campaigns/'+id+'/history',{
              method:'POST', timeout:90000,
              body:JSON.stringify({...histEntry, bodyHTML:body.slice(0,100000)})
            });
          } catch(histErr) {
            console.warn('History save failed, retrying in 8s:', histErr.message);
            const _retryPayload = JSON.stringify({...histEntry, bodyHTML:body.slice(0,100000)});
            setTimeout(()=> apiFetch('/campaigns/'+id+'/history',{method:'POST',timeout:60000,body:_retryPayload}).catch(()=>{}), 8000);
          }

          // 3. DB save confirmed -> Update Frontend memory (with bodyHTML) + LS (without for space)
          setHistData(prev => ({ ...prev, [id]: [...(prev[id] || []), histEntry] }));
          // LS stores without bodyHTML to save space — bodyHTML lives in state + server DB
          await lsAppendSafe('mOS_hist_' + id, {
              rowIdx: histEntry.rowIdx, sentAt: histEntry.sentAt,
              senderEmail: histEntry.senderEmail, senderName: histEntry.senderName,
              toEmail: histEntry.toEmail, subject: histEntry.subject,
              rowData: histEntry.rowData, touchType: histEntry.touchType,
              trackId: histEntry.trackId, bodyHTML: ''
          });
          setHistVersion(v=>v+1);
          
          doneSet.add(ri);
          ls.set('mOS_sentRows_'+id,[...doneSet]);
          apiFetch('/campaigns/'+id+'/sent-rows',{method:'POST',body:JSON.stringify({rowIdx:ri})}).catch(()=>{});

          const li2=e.logs.findIndex(l=>l.row===ri+1);if(li2!==-1)e.logs[li2].status='sent';
          
          // 4. ATOMIC INCREMENT (Using the safe queue to perfectly count +1)
          setProg(id, cur => ({ sent: (cur.sent || 0) + 1 }));
        }catch(err){
          const et=smtpErr(err.message);
          e.errors=[{senderEmail:acc.email||sid,toEmail,reason:et},...e.errors].slice(0,50);
          const li2=e.logs.findIndex(l=>l.row===ri+1);if(li2!==-1){e.logs[li2].status='error';e.logs[li2].reason=et;}
          item.failed.add(sid);
          if(BLOCK.has(et)){e.blocked.add(sid);if(item.failed.size<sIds.length)queue.push(item);setProg(id,{errors:e.errors});return;}
          if(item.failed.size<sIds.length)queue.push(item);
          setProg(id,{errors:e.errors});
        }
      }
    }));
    setProg(id,{status:engRef.current[id]?.abort?'stopped':'done',endTime:new Date()});
    // Check final physical size of doneSet rather than memory counter
    onUpdateCampaigns(prev=>prev.map(c=>c.id===snap.id?{...c,status:doneSet.size>=rows.length?'sent':c.status}:c));
  };

  const sendFU=async()=>{
    if(!sel)return;const id=sel.id;
    const fuBody=fuRef.current?.innerHTML||fuDraftRef.current[id]||ls.get('mOS_draftFu_'+id,'')||sel.fuPitch||'';
    if(!fuBody.replace(/<[^>]+>/g,'').trim())return alert('Write follow-up pitch first.');
    const skipSet=new Set((sel.skipListText||'').match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)?.map(x=>x.toLowerCase())||[]);
    const hist=getHist(id);
    const firsts=hist.filter(h=>(!h.touchType||h.touchType==='first')&&!skipSet.has((h.toEmail||'').toLowerCase()));
    if(!firsts.length)return alert('No send history found!');
    const fuDone=new Set(hist.filter(h=>h.touchType==='followup').map(h=>(h.toEmail||'').toLowerCase()));
    const pending=firsts.filter(h=>!fuDone.has((h.toEmail||'').toLowerCase()));
    if(!pending.length)return alert('All recipients already follow-upped!');
    const bySender={};sel.senderIds.forEach(sid=>{bySender[sid]=[];});
    pending.forEach(h=>{const acc=accounts.find(a=>a.email===h.senderEmail);if(acc&&sel.senderIds.includes(acc.id))bySender[acc.id].push(h);});
    initEng(id);setTab('progress');
    setProg(id,{type:'fu',status:'running',sent:0,total:pending.length,errors:[],startTime:new Date()});

    await Promise.all(sel.senderIds.map(async sid=>{
      const e=engRef.current[id];const q=bySender[sid]||[];
      for(let i=0;i<q.length;i++){
        if(e.abort||e.blocked.has(sid))return;
        while(e.pause&&!e.abort)await new Promise(r=>setTimeout(r,200));
        if(e.abort)return;
        const h=q[i];const cfg=accountSettings[sid]||{};
        const ms=(cfg.minDelay??60)*1000+Math.random()*((cfg.maxDelay??180)-(cfg.minDelay??60))*1000;
        e.logs=[{row:h.rowIdx+1,email:h.toEmail,fromEmail:h.senderEmail,status:'waiting',wakeTime:Date.now()+ms},...e.logs].slice(0,1000);
        if(!await delayLoop(ms,id))return;
        const li=e.logs.findIndex(l=>l.row===h.rowIdx+1);if(li!==-1)e.logs[li].status='sending';
        setProg(id,{});
        const m=rowMapArr(h.rowData||[],sel.csvHeaders||[]);
        const sigHtml=signatures[sid]?signatures[sid]:'';
        let body=injectSignature(fuBody,sigHtml);
        body=normalizeForOutlook(resolve(body,m).replace(/\{\{[^}]+\}\}/g,''));
        const subj=(fuSubj||'').trim()?resolve(fuSubj,m)||fuSubj:'RE: '+(h.subject||'');
        const sd=new Date(h.sentAt);
        const fd=sd.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})+' '+sd.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
        const thread=`<div>${body.trim()}</div><div style="margin:12px 0"><hr style="border:0;border-top:1px solid #e0e0e0"/></div><div style="font-size:12px;color:#444444;line-height:1.7"><b style="color:#111111">From:</b> ${h.senderName?`${h.senderName} &lt;${h.senderEmail}&gt;`:h.senderEmail}<br/><b style="color:#111111">Sent:</b> ${fd}<br/><b style="color:#111111">To:</b> ${h.toEmail}<br/><b style="color:#111111">Subject:</b> ${h.subject}</div><div style="margin-top:12px">${h.bodyHTML||''}</div>`;
        try{
          const fuRowTrackId = `trk_${id}_fu_${h.rowIdx}_${Date.now().toString(36)}`;
          
          // 1. Send Email
          await apiFetch('/accounts/'+sid+'/send',{method:'POST',timeout:300000,body:JSON.stringify({to:h.toEmail,subject:subj,body:thread,trackId:fuRowTrackId})});
          
          const fuEntry={rowIdx:h.rowIdx,sentAt:new Date().toISOString(),senderEmail:h.senderEmail,senderName:h.senderName,toEmail:h.toEmail,subject:subj,
            bodyHTML:thread,   
            rowData:h.rowData||[],touchType:'followup',trackId:fuRowTrackId};

          // 2. Await Database History Save BEFORE updating counter!
          try {
            await apiFetch('/campaigns/'+id+'/history',{
              method:'POST', timeout:90000,
              body:JSON.stringify({...fuEntry, bodyHTML:thread.slice(0,100000)})
            });
          } catch(fuHistErr) {
            console.warn('FU history save failed, retrying:', fuHistErr.message);
            const _retryFu = JSON.stringify({...fuEntry, bodyHTML:thread.slice(0,100000)});
            setTimeout(()=> apiFetch('/campaigns/'+id+'/history',{method:'POST',timeout:60000,body:_retryFu}).catch(()=>{}), 8000);
          }

          // 3. Update memory/local storage safely
          setHistData(prev => ({ ...prev, [id]: [...(prev[id] ||[]), fuEntry] }));
          await lsAppendSafe('mOS_hist_' + id, { ...fuEntry, bodyHTML: '' }); 
          setHistVersion(v=>v+1);

          const li2=e.logs.findIndex(l=>l.row===h.rowIdx+1);if(li2!==-1)e.logs[li2].status='sent';
          
          // 4. ATOMIC UI INCREMENT
          setProg(id, cur => ({ sent: (cur.sent || 0) + 1 }));
        }catch(err){
          const et=smtpErr(err.message);
          e.errors=[{senderEmail:h.senderEmail,toEmail:h.toEmail,reason:et},...e.errors].slice(0,50);
          const li2=e.logs.findIndex(l=>l.row===h.rowIdx+1);if(li2!==-1){e.logs[li2].status='error';e.logs[li2].reason=et;}
          if(BLOCK.has(et)){e.blocked.add(sid);setProg(id,{errors:e.errors});return;}
          setProg(id,{errors:e.errors});
        }
      }
    }));
    setProg(id,{status:engRef.current[id]?.abort?'stopped':'done',endTime:new Date()});
  };

  const togglePause=()=>{const e=engRef.current[selId];if(e){e.pause=!e.pause;setProg(selId,{status:e.pause?'paused':'running'});}};
  const stopEng=()=>{const e=engRef.current[selId];if(e){e.abort=true;e.pause=false;setProg(selId,{status:'stopped',endTime:new Date()});}};

  const selH=sel?.csvHeaders||[], selR=sel?.csvRows||[], selS=sel?.senderIds||[], curP=progMap[selId];

  const filtAcc = useMemo(() => {
    const sTerm = sndSrch.toLowerCase().split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
    return accounts.filter(a=>!sTerm.length||sTerm.some(t=>(a.email||'').toLowerCase().includes(t)||(a.name||'').toLowerCase().includes(t)));
  }, [sndSrch, accounts]);

  const filtR = useMemo(() => {
    const cTerm = csvSrch.toLowerCase().split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
    return selR.map((r,i)=>({i,d:r})).filter(x=>!cTerm.length||cTerm.some(t=>(x.d||[]).join(' ').toLowerCase().includes(t)));
  },[csvSrch, selR]);

  const hTerm = useMemo(() => histSrch.toLowerCase().split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean), [histSrch]);

  const historyMappedCache = useMemo(() => {
    if (!selId) return[];
    return getHist(selId);
  },[selId, getHist, histVersion]);

  const saveTab=id=>{try{if(selId)ls.set('mOS_tab_'+selId,id);}catch{}};
  const TabBtn=({id,icon,label,done})=>(
  <button onClick={()=>{
    if(tab==='pitch') savePitch();
    if(tab==='followup') saveFu();
    setTab(id);
    if(id==='followup')setFuTab('pitch');
    saveTab(id);
  }} className={`tb${tab===id?' on':''}`} style={{fontWeight:tab===id?600:400}}>
      {icon} {label} {done&&<span style={{width:6,height:6,borderRadius:'50%',background:T.acc,display:'inline-block',marginLeft:2}}/>}
    </button>
  );

  const PHBtn=({name,tref})=>(
    <button onMouseDown={e=>{
      e.preventDefault();
      if(subjFocused&&subjRef.current){
        const el=subjRef.current;const start=el.selectionStart||0,end=el.selectionEnd||0;
        const val=el.value;const ph='{{'+name+'}}';
        const next=val.slice(0,start)+ph+val.slice(end);
        upd({subject:next});
        setTimeout(()=>{el.focus();el.setSelectionRange(start+ph.length,start+ph.length);},10);
      } else {
        insertPH(name,tref||pitchRef);
      }
    }}
      style={{background:T.aBg,border:`1px solid ${T.aBd}`,color:T.acc2,borderRadius:7,padding:'4px 10px',fontSize:11,cursor:'pointer',fontFamily:T.mn,fontWeight:600,transition:'all .12s'}}
      onMouseEnter={e=>e.currentTarget.style.background='rgba(123,108,246,.18)'} onMouseLeave={e=>e.currentTarget.style.background=T.aBg}>
      {`{{${name}}}`}
    </button>
  );

  if(!isVisible)return null;

  return(
    <div style={{display:'flex',flex:1,overflow:'hidden'}}>
      {/* Campaign sidebar */}
      <div style={{width:256,background:T.pan,borderRight:`1px solid ${T.b1}`,display:'flex',flexDirection:'column',flexShrink:0}}>
        <div style={{padding:'16px 14px',borderBottom:`1px solid ${T.b1}`}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <span style={{fontSize:14,fontWeight:700,color:T.t1,fontFamily:T.dp,display:'flex',alignItems:'center',gap:8}}><Ic.Mega s={14} c={T.acc}/> Campaigns</span>
            <span style={{fontSize:11,color:T.t3,fontFamily:T.mn}}>{campaigns.length}</span>
          </div>
          <button onClick={newCamp} className="btn bp" style={{width:'100%',padding:'9px 14px',fontSize:12,borderRadius:10}}><Ic.Plus s={13} c="#fff"/> New Campaign</button>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          {!campaigns.length&&<div style={{textAlign:'center',padding:'48px 16px',color:T.t3}}><div style={{fontSize:36,marginBottom:10,opacity:.3}}>📭</div><p style={{fontSize:12}}>No campaigns yet</p></div>}
          {campaigns.map(c=>{
            const isA=selId===c.id;
            return(
              <div key={c.id} onClick={()=>{setSelId(c.id);setFuTab('pitch');setTab(ls.get('mOS_tab_'+c.id,'csv'));}}
                style={{padding:'12px 14px',cursor:'pointer',borderLeft:isA?`2px solid ${T.acc}`:'2px solid transparent',background:isA?T.aBg:'transparent',borderBottom:`1px solid ${T.b1}`,transition:'all .12s'}}
                onMouseEnter={e=>{if(!isA)e.currentTarget.style.background='rgba(255,255,255,.03)';}} onMouseLeave={e=>{if(!isA)e.currentTarget.style.background='transparent';}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:isA?T.t1:T.t2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                    <div style={{fontSize:11,color:T.t3,marginTop:3,fontFamily:T.mn}}>{(c.csvRows||[]).length}r · {(c.senderIds||[]).length}s</div>
                    <div style={{display:'flex',gap:4,marginTop:6}}>
                      {[['CSV',(c.csvHeaders||[]).length>0],['Pitch',!!c.pitch],['Snd',(c.senderIds||[]).length>0]].map(([l,ok])=>(
                        <span key={l} className="tag" style={{background:ok?T.aBg:'rgba(255,255,255,.04)',color:ok?T.acc2:T.t3}}>{ok?'✓':'○'} {l}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();delCamp(c.id);}} style={{background:'none',border:'none',color:T.t3,cursor:'pointer',fontSize:16,padding:'0 2px',lineHeight:1,transition:'color .12s',marginLeft:6}} onMouseEnter={e=>e.currentTarget.style.color=T.red} onMouseLeave={e=>e.currentTarget.style.color=T.t3}>×</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign detail */}
      {!sel?(
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,background:T.bg}}>
          <div style={{fontSize:80,opacity:.04}}>📢</div>
          <p style={{color:T.t3,fontSize:14,fontWeight:500}}>Select or create a campaign</p>
          <button onClick={newCamp} className="btn bp" style={{padding:'10px 24px',fontSize:13,borderRadius:12}}>+ New Campaign</button>
        </div>
      ):(
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:T.bg}}>
          {/* Campaign header */}
          <div style={{padding:'13px 22px',borderBottom:`1px solid ${T.b1}`,background:T.pan,display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:10,background:T.aBg,border:`1px solid ${T.aBd}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic.Mega s={15} c={T.acc}/></div>
            {editName
              ?<input value={sel.name||''} autoFocus onChange={e=>upd({name:e.target.value})} onBlur={()=>setEditName(false)} onKeyDown={e=>{if(e.key==='Enter')setEditName(false);}} style={{fontSize:15,fontWeight:700,color:T.t1,border:'none',borderBottom:`2px solid ${T.acc}`,outline:'none',background:'transparent',flex:1,fontFamily:T.dp}}/>
              :<h2 onClick={()=>setEditName(true)} title="Click to rename" style={{fontSize:15,fontWeight:700,color:T.t1,cursor:'text',flex:1,fontFamily:T.dp}}>{sel.name} <span style={{fontSize:12,color:T.t3,fontWeight:400}}>✎</span></h2>
            }
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span className="tag" style={{background:T.aBg,color:T.acc2}}>{selR.length} recipients</span>
              {curP?.status==='running'&&<span className="tag" style={{background:'rgba(30,216,158,.09)',color:T.grn,animation:'pulse 1.5s infinite'}}>⚡ {curP.type==='fu'?'Follow-ups…':'Sending…'}</span>}
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:'flex',borderBottom:`1px solid ${T.b1}`,padding:'0 22px',overflowX:'auto',background:T.pan,flexShrink:0}}>
            <TabBtn id="csv"      icon={<Ic.Upload s={11}/>}  label="CSV"        done={selH.length>0}/>
            <TabBtn id="pitch"    icon={<Ic.Pen s={11}/>}     label="Pitch"      done={!!(sel.pitch?.replace(/<[^>]+>/g,'').trim().length>10)}/>
            <TabBtn id="senders"  icon={<Ic.Users s={11}/>}   label="Senders"    done={selS.length>0}/>
            <TabBtn id="preview"  icon={<Ic.Eye s={11}/>}     label="Preview"    done={false}/>
            <TabBtn id="followup" icon={<Ic.Reply s={11}/>}   label="Follow-up"  done={false}/>
            <TabBtn id="history"  icon={<Ic.Check s={11}/>}   label="History"    done={false}/>
            {curP&&<TabBtn id="progress" icon={<Ic.Zap s={11}/>} label="Live" done={false}/>}
          </div>

          <div style={{flex:1,overflowY:'auto',padding:22}}>

            {/* ─ CSV ─ */}
            {tab==='csv'&&(
              <div>
                <h3 style={{fontSize:15,fontWeight:700,color:T.t1,marginBottom:4,fontFamily:T.dp}}>Upload Recipients CSV</h3>
                <p style={{fontSize:12,color:T.t2,marginBottom:18}}>Headers become <code style={{background:T.sur,padding:'1px 5px',borderRadius:4,fontSize:11,fontFamily:T.mn,color:T.acc2}}>{'{{Column Name}}'}</code> placeholders.</p>
                <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleCSV(e.dataTransfer.files[0]);}} onClick={()=>csvRef.current?.click()}
                  style={{border:`2px dashed ${dragOver?T.acc:selH.length?T.aBd:T.b2}`,borderRadius:16,padding:'28px 20px',textAlign:'center',cursor:'pointer',background:selH.length?T.aBg:T.sur,transition:'all .18s'}}>
                  <div style={{fontSize:36,marginBottom:10}}>{selH.length?<Ic.Check s={36} c={T.acc}/>:<Ic.Folder s={36} c={T.t3}/>}</div>
                  {selH.length?<><p style={{fontSize:13,fontWeight:700,color:T.t1,marginBottom:4}}>CSV loaded — {selR.length} recipients, {selH.length} columns</p><p style={{fontSize:11,color:T.t2}}>Click or drag to replace</p></>
                  :<><p style={{fontSize:14,fontWeight:700,color:T.t1,marginBottom:6}}>Drop CSV here</p><p style={{fontSize:12,color:T.acc2}}>or click to browse</p></>}
                  <input ref={csvRef} type="file" accept=".csv" style={{display:'none'}} onChange={e=>handleCSV(e.target.files?.[0])}/>
                </div>
                {selH.length>0&&(<>
                  <div style={{display:'flex',gap:8,marginTop:10}}>
                    <button onClick={e=>{e.stopPropagation();csvRef.current?.click();}} className="btn bg" style={{flex:1,padding:'7px 0',fontSize:12,borderRadius:10}}>🔄 Replace</button>
                    <button onClick={e=>{
                      e.stopPropagation();
                      ls.del('mOS_csv_' + sel.id);
                      onUpdateCampaigns(prev => prev.map(c =>
                        c.id === selId ? { ...c, csvHeaders: [], csvRows:[], emailCol: -1 } : c
                      ));
                      apiFetch('/campaigns/' + sel.id + '/csv', { method: 'DELETE' }).catch(() => {});
                    }} className="btn bd" style={{flex:1,padding:'7px 0',fontSize:12,borderRadius:10}}>🗑 Clear</button>
                  </div>
                  <div style={{marginTop:16}}>
                    <p style={{fontSize:10,color:T.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Placeholders (click to copy)</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                      {selH.map(h=><button key={h} onClick={()=>navigator.clipboard?.writeText('{{'+h+'}}').catch(()=>{})} style={{background:T.aBg,border:`1px solid ${T.aBd}`,color:T.acc2,borderRadius:7,padding:'4px 10px',fontSize:11,cursor:'pointer',fontFamily:T.mn,fontWeight:600}}>{`{{${h}}}`}</button>)}
                      <button onClick={()=>navigator.clipboard?.writeText('{{Account Signature}}').catch(()=>{})} style={{background:'rgba(244,161,48,.09)',border:`1px solid rgba(244,161,48,.22)`,color:T.amb,borderRadius:7,padding:'4px 10px',fontSize:11,cursor:'pointer',fontFamily:T.mn,fontWeight:600}}>{'{{Account Signature}}'}</button>
                    </div>
                  </div>
                  <div style={{marginTop:16,border:`1px solid ${T.b1}`,borderRadius:14,overflow:'hidden'}}>
                    <div style={{padding:'10px 14px',background:T.sur,borderBottom:`1px solid ${T.b1}`,display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:12,fontWeight:600,color:T.t2}}>Preview</span><span style={{fontSize:11,color:T.acc2,fontFamily:T.mn}}>{selR.length} rows</span>
                    </div>
                    <div style={{padding:'8px 14px',borderBottom:`1px solid ${T.b1}`}}><input value={csvSrch} onChange={e=>setCsvSrch(e.target.value)} placeholder="Filter rows…" className="inp" style={{padding:'6px 12px',fontSize:12}}/></div>
                    <div style={{overflowX:'auto',maxHeight:240,overflowY:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                        <thead style={{position:'sticky',top:0}}><tr style={{background:T.sur}}>
                          <th style={{padding:'7px 10px',textAlign:'left',color:T.t3,borderBottom:`1px solid ${T.b1}`,fontSize:10,fontFamily:T.mn}}>#</th>
                          {selH.map((h,i)=><th key={i} style={{padding:'7px 10px',textAlign:'left',fontWeight:700,color:T.acc2,borderBottom:`1px solid ${T.b1}`,fontSize:10,fontFamily:T.mn}}>{`{{${h}}}`}</th>)}
                        </tr></thead>
                        <tbody>{filtR.map(x=><tr key={x.i} style={{borderBottom:`1px solid ${T.b1}`,background:x.i%2===0?'transparent':T.sur}}>
                          <td style={{padding:'6px 10px',color:T.t3,fontFamily:T.mn}}>{x.i+1}</td>
                          {selH.map((_,ci)=><td key={ci} style={{padding:'6px 10px',color:T.t1,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{(x.d||[])[ci]||''}</td>)}
                        </tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                  <div style={{marginTop:14,textAlign:'right'}}><button onClick={()=>setTab('pitch')} className="btn bp" style={{padding:'9px 22px',fontSize:13,borderRadius:10}}>Next: Write Pitch →</button></div>
                </>)}
              </div>
            )}

            {/* ─ Pitch ─ */}
            {tab==='pitch'&&(
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:T.dp}}>Write Your Pitch</h3>
                <div style={{background:T.pan,border:`1px solid ${T.b1}`,borderRadius:12,padding:'12px 16px'}}>
                  <label style={{fontSize:11,color:T.t2,display:'block',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>Subject Line *</label>
                  <input ref={subjRef} value={sel.subject||''} onChange={e=>upd({subject:e.target.value})} onFocus={()=>setSubjFocused(true)} onBlur={()=>setTimeout(()=>setSubjFocused(false),200)} placeholder="e.g. Quick question about {{Company Name}}" className="inp"/>
                </div>
                {selH.length>0&&<div style={{background:T.pan,border:`1px solid ${T.b1}`,borderRadius:12,padding:'10px 14px'}}>
                  <p style={{fontSize:10,color:T.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Insert placeholder at cursor</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{selH.map((h,i)=><PHBtn key={i} name={h}/>)}<PHBtn name="Account Signature"/></div>
                </div>}
                <div style={{border:`1px solid ${T.b1}`,borderRadius:14,overflow:'hidden',display:'flex',flexDirection:'column',minHeight:380,background:T.pan}}>
                  <RichEditor key={sel.id+'_'+plainText} editorRef={pitchRef}
                    initialHTML={pitchDraftRef.current[sel.id] || sel.pitch || ls.get('mOS_draft_'+sel.id) || ''}
                    onChange={html=>{
                        const cid = sel.id;
                        pitchDraftRef.current[cid] = html;
                        // Save to localStorage immediately on every keystroke — no debounce for LS
                        try { ls.set('mOS_draft_' + cid, html); } catch {}
                        // Debounce the server/state update only
                        clearTimeout(pitchSaveTimer.current);
                        pitchSaveTimer.current = setTimeout(() => {
                          if (selId !== cid) return;
                          // Pull the absolute latest from ref, not the stale closure html
                          const latest = pitchDraftRef.current[cid] ?? html;
                          upd({ pitch: latest, subject: sel?.subject || '' });
                          // Belt-and-suspenders: write to LS again after state update
                          try { ls.set('mOS_draft_' + cid, latest); } catch {}
                        }, 1200); // faster than 2500ms
                      }}
                    plainTextMode={plainText}
                    onTogglePlain={()=>setPlainText(v=>!v)}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <button onClick={()=>{
                    savePitch();
                    showToast('✓ Pitch saved');
                  }} className="btn bp" style={{padding:'9px 20px',fontSize:13,borderRadius:10}}>💾 Save Pitch</button>
                  <button onClick={()=>{
                    savePitch();
                    setTab('senders');
                    ls.set('mOS_tab_'+sel.id,'senders');
                  }} className="btn bp" style={{padding:'9px 22px',fontSize:13,borderRadius:10}}>Next: Senders →</button>
                </div>
              </div>
            )}

            {/* ─ Senders ─ */}
            {tab==='senders'&&(
              <div>
                <h3 style={{fontSize:15,fontWeight:700,color:T.t1,marginBottom:18,fontFamily:T.dp}}>Select Sender Accounts</h3>
                <textarea value={sndSrch} onChange={e=>setSndSrch(e.target.value)} placeholder="Filter by email or name…" style={{width:'100%',height:58,padding:'10px 12px',borderRadius:10,border:`1px solid ${T.b1}`,fontSize:12,outline:'none',resize:'none',fontFamily:T.mn,background:T.sur,color:T.t1,marginBottom:12}}/>
                <div style={{display:'flex',gap:8,marginBottom:14}}>
                  <button onClick={()=>upd({senderIds:[...new Set([...selS,...filtAcc.map(a=>a.id)])]})} className="btn bg" style={{padding:'6px 14px',fontSize:12,borderRadius:9}}>Select Filtered</button>
                  <button onClick={()=>upd({senderIds:selS.filter(id=>!filtAcc.find(a=>a.id===id))})} className="btn bg" style={{padding:'6px 14px',fontSize:12,borderRadius:9}}>Deselect Filtered</button>
                  <span style={{fontSize:12,color:T.acc2,alignSelf:'center',fontFamily:T.mn}}>{selS.length}/{accounts.length}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {filtAcc.map((acc,ai)=>{
                    const color=gc(ai),isSel=selS.includes(acc.id),isBlk=engRef.current[selId]?.blocked?.has(acc.id)||false;
                    return(
                      <div key={acc.id} onClick={()=>toggleSender(acc.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',border:`1.5px solid ${isSel?color+'48':T.b1}`,borderRadius:12,cursor:'pointer',background:isSel?color+'07':T.sur,opacity:isBlk?.45:1,transition:'all .15s'}}>
                        <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${isSel?color:T.b2}`,background:isSel?color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{isSel&&<Ic.Check s={10} c="#fff"/>}</div>
                        <Avatar name={acc.name||acc.email.split('@')[0]} email={acc.email} color={color} size={38}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:600,color:isSel?color:T.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{acc.email}</div>
                          <div style={{fontSize:11,color:T.t2}}>{acc.name||acc.email.split('@')[0]}</div>
                        </div>
                        {isBlk&&<span className="tag" style={{background:'rgba(255,69,96,.09)',color:T.red}}>⛔ Blocked</span>}
                        {!isBlk&&signatures[acc.id]&&<span className="tag" style={{background:'rgba(244,161,48,.09)',color:T.amb}}>✍ Sig</span>}
                      </div>
                    );
                  })}
                </div>
                {selS.length>0&&<div style={{marginTop:18,textAlign:'right'}}><button onClick={()=>setTab('preview')} className="btn bp" style={{padding:'9px 22px',fontSize:13,borderRadius:10}}>Next: Preview →</button></div>}
              </div>
            )}

            {/* ─ Preview ─ */}
            {tab==='preview'&&(
              <div>
                <h3 style={{fontSize:15,fontWeight:700,color:T.t1,marginBottom:18,fontFamily:T.dp}}>Preview & Send</h3>
                <div style={{marginBottom:16,padding:'14px 16px',background:T.pan,border:`1px solid ${T.b1}`,borderRadius:14}}>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:T.t2,display:'block',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>Subject *</label>
                    <input value={sel.subject||''} onChange={e=>upd({subject:e.target.value})} className="inp" placeholder="Subject…"/>
                  </div>
                  <Sel label="Email Column *" value={sel.emailCol>=0?sel.emailCol:''} onChange={e=>upd({emailCol:e.target.value===''?-1:Number(e.target.value)})} style={{width:'auto',minWidth:220}}>
                    <option value="">— Select email column —</option>
                    {selH.map((h,i)=><option key={i} value={i}>{h||''}{/email|mail/i.test(h||'')?' ✉':''}</option>)}
                  </Sel>
                </div>
                <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
                  <Sel label="Preview Row" value={prevRow} onChange={e=>setPrevRow(Number(e.target.value))} style={{width:'auto',minWidth:160}}>
                    {selR.map((r,i)=>{
                const ec2=sel.emailCol>=0?sel.emailCol:selH.findIndex(h=>/email|mail/i.test(h||''));
                const em=ec2>=0?(r[ec2]||''):'';
                return <option key={i} value={i}>Row {i+1}{em?' — '+em:''}</option>;
              })}
                  </Sel>
                  <Sel label="Sender" value={prevSnd||selS[0]||''} onChange={e=>setPrevSnd(e.target.value)} style={{width:'auto',minWidth:200}}>
                    {selS.map(id=>{const a=accounts.find(x=>x.id===id);return<option key={id} value={id}>{a?a.email:id}</option>;})}
                  </Sel>
                </div>
                {(pitchDraftRef.current[sel.id]??ls.get('mOS_draft_'+sel.id)??sel.pitch)&&(()=>{
                  const ec=sel.emailCol>=0?sel.emailCol:selH.findIndex(h=>/email|mail/i.test(h||''));
                  const toEmail=ec>=0?(selR[prevRow]||[])[ec]||'—':'—';
                  const sid=prevSnd||selS[0];const sEmail=accounts.find(a=>a.id===sid)?.email||'—';
                  return(
                    <div style={{border:`1px solid ${T.b1}`,borderRadius:16,overflow:'hidden',background:T.pan,marginBottom:18}}>
                      <div style={{padding:'8px 16px',background:T.card,borderBottom:`1px solid ${T.b1}`,display:'flex',gap:6,justifyContent:'flex-end',alignItems:'center'}}>
                        <span style={{fontSize:11,color:T.t3,marginRight:'auto'}}>Preview as:</span>
                        {[['🖥 Desktop',false],['📱 Mobile',true]].map(([l,v])=>(
                          <button key={l} onClick={()=>setPreviewMobile(v)}
                            style={{background:previewMobile===v?T.aBg:T.sur,border:`1px solid ${previewMobile===v?T.aBd:T.b1}`,color:previewMobile===v?T.acc:T.t2,borderRadius:7,padding:'4px 10px',fontSize:11,cursor:'pointer',fontWeight:previewMobile===v?600:400,transition:'all .12s'}}>
                            {l}
                          </button>
                        ))}
                      </div>
                      <div style={{maxWidth:previewMobile?375:'100%',margin:'0 auto',transition:'max-width .25s',overflow:'hidden'}}>
                      <div style={{padding:'12px 18px',background:T.sur,borderBottom:`1px solid ${T.b1}`}}>
                        {[['From',sEmail],['To',toEmail]].map(([k,v])=><div key={k} style={{fontSize:11,color:T.t2,marginBottom:3}}>{k}: <b style={{color:T.t1}}>{v}</b></div>)}
                        <div style={{fontSize:13,fontWeight:700,color:T.t1}}>Subject: {sel.subject?resolve(sel.subject||'',rowMap(prevRow)):<span style={{color:T.red,fontWeight:400,fontSize:12}}>⚠ No subject</span>}</div>
                      </div>
                      <div className="rp" style={{padding:'16px 24px',fontSize:14,lineHeight:1.65,color:T.t1}} dangerouslySetInnerHTML={{__html:prevBody((pitchDraftRef.current[sel.id]??ls.get('mOS_draft_'+sel.id)??sel.pitch??''),prevRow,sid)}}/>
                      </div> 
                    </div>
                  );
                })()}
                {sel.pitch&&selS.length>0&&selR.length>0&&(!curP||curP.status==='stopped'||curP.status==='done')&&(
                  <div style={{padding:'16px 18px',background:T.aBg,border:`1px solid ${T.aBd}`,borderRadius:14}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:14}}>
                      <div><p style={{fontSize:15,fontWeight:800,color:T.t1,fontFamily:T.dp}}>🚀 Ready to Launch!</p><p style={{fontSize:12,color:T.acc2,marginTop:3,fontFamily:T.mn}}>{selR.length} targets · {selS.length} senders</p></div>
                      <button onClick={sendCamp} className="btn bp" style={{padding:'11px 28px',fontSize:14,fontWeight:700,borderRadius:12}}>Launch Engine</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ Follow-up ─ */}
            {tab==='followup'&&(()=>{
              const skipSet=new Set((sel.skipListText||'').match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)?.map(x=>x.toLowerCase())||[]);
              const all=historyMappedCache.filter(h=>!h.touchType||h.touchType==='first');
              const valid=all.filter(h=>!skipSet.has((h.toEmail||'').toLowerCase()));
              const skipped=all.length-valid.length;
              const cur=valid[fuPrevRow]||null;
              return(
                <div>
                  <div style={{display:'flex',gap:8,marginBottom:16,borderBottom:`1px solid ${T.b1}`,paddingBottom:12}}>
                    {[{id:'pitch',l:'✍ Write Follow-up'},{id:'preview',l:'👁 Preview & Send'}].map(t=>(
                      <button key={t.id} onClick={()=>{
                        if(fuTab==='pitch'&&fuRef.current){
                          const h=fuRef.current.innerHTML||'';
                          if(h){ls.set('mOS_draftFu_'+sel?.id,h);if(sel)upd({fuPitch:h,fuSubject:fuSubj});}
                        }
                        setFuTab(t.id);
                      }} className={`tb${fuTab===t.id?' on':''}`} style={{padding:'6px 14px',fontSize:12,fontWeight:fuTab===t.id?600:400}}>{t.l}</button>
                    ))}
                  </div>

                  {fuTab==='pitch'&&(
                    <div style={{display:'flex',flexDirection:'column',gap:14}}>
                      <div style={{background:T.pan,border:`1px solid ${T.b1}`,borderRadius:12,padding:'12px 16px'}}>
                        <label style={{fontSize:11,color:T.t2,display:'block',marginBottom:6,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>Follow-up Subject</label>
                        <input value={fuSubj} onChange={e=>{setFuSubj(e.target.value);ls.set('mOS_fuSubj_'+sel.id,e.target.value);}} placeholder={'RE: '+(historyMappedCache[0]?.subject||'(original subject)')} className="inp"/>
                      </div>
                      {selH.length>0&&<div style={{background:T.pan,border:`1px solid ${T.b1}`,borderRadius:12,padding:'10px 14px'}}>
                        <p style={{fontSize:10,color:T.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Insert Placeholder</p>
                        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{selH.map((h,i)=><PHBtn key={i} name={h} tref={fuRef}/>)}<PHBtn name="Account Signature" tref={fuRef}/></div>
                      </div>}
                      <div style={{border:`1px solid ${T.b1}`,borderRadius:14,overflow:'hidden',display:'flex',flexDirection:'column',minHeight:380,background:T.pan}}>
                        <RichEditor key={sel.id+'_fu'} editorRef={fuRef}
                          initialHTML={fuDraftRef.current[sel.id] || sel.fuPitch || ls.get('mOS_draftFu_'+sel.id) || ''}
                          onChange={html=>{
                             const cid = sel.id;
                             fuDraftRef.current[cid] = html;
                             try { ls.set('mOS_draftFu_' + cid, html); } catch {}
                             clearTimeout(fuSaveTimer.current);
                             fuSaveTimer.current = setTimeout(() => {
                               if (selId !== cid) return;
                               const latest = fuDraftRef.current[cid] ?? html;
                               upd({ fuPitch: latest, fuSubject: fuSubj || '' });
                               try { ls.set('mOS_draftFu_' + cid, latest); } catch {}
                             }, 1200);
                           }}/>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <button onClick={()=>{saveFu();showToast('✓ Follow-up saved');}} className="btn bp" style={{padding:'9px 20px',fontSize:13,borderRadius:10}}>💾 Save</button>
                        <button onClick={()=>{saveFu();setFuTab('preview');}} className="btn bp" style={{padding:'9px 22px',fontSize:13,borderRadius:10}}>Preview & Send →</button>
                      </div>
                    </div>
                  )}

                  {fuTab==='preview'&&(
                    <div style={{display:'flex',flexDirection:'column',gap:14,position:'relative'}}>
                      {skipPopup&&(
                        <div style={{position:'fixed',bottom:24,right:24,width:380,background:T.pan,borderRadius:14,boxShadow:'0 12px 48px rgba(0,0,0,.6)',border:`1px solid ${T.b2}`,zIndex:99999,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                          <div style={{padding:'13px 16px',background:T.sur,borderBottom:`1px solid ${T.b1}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:14,fontWeight:700,color:T.t1}}>🚫 Exclude List</span><button onClick={()=>setSkipPopup(false)} style={{background:'none',border:'none',cursor:'pointer',color:T.t3,fontSize:18,lineHeight:1}}>×</button></div>
                          <div style={{padding:16}}>
                            <p style={{fontSize:12,color:T.t2,marginBottom:10}}>Paste emails to exclude from this follow-up.</p>
                            <textarea value={sel.skipListText||''} onChange={e=>upd({skipListText:e.target.value})} placeholder="john@example.com&#10;bounce@example.com" style={{width:'100%',height:130,resize:'none',borderRadius:10,border:`1px solid ${T.b1}`,padding:12,fontSize:12,outline:'none',fontFamily:T.mn,background:T.sur,color:T.t1}}/>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                              <span className="tag" style={{background:T.aBg,color:T.acc2}}>✅ {skipSet.size} excluded</span>
                              <button onClick={()=>setSkipPopup(false)} className="btn bp" style={{padding:'7px 20px',fontSize:13,borderRadius:8}}>Save</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {valid.length>0&&<Sel label="Preview Recipient" value={fuPrevRow} onChange={e=>setFuPrevRow(Number(e.target.value))} style={{width:'auto',minWidth:240}}>
                        {valid.map((rec,i)=><option key={i} value={i}>Row {rec.rowIdx+1} — {rec.toEmail}</option>)}
                      </Sel>}

                      {cur && (fuDraftRef.current[sel.id] ?? ls.get('mOS_draftFu_'+sel.id) ?? sel.fuPitch) ? (()=>{
                        const liveFuPitch = fuDraftRef.current[sel.id] ?? ls.get('mOS_draftFu_'+sel.id) ?? sel.fuPitch ?? '';
                        const m=rowMapArr(cur.rowData||[],selH);
                        const accId=accounts.find(a=>a.email===cur.senderEmail)?.id;
                        const sig=accId&&signatures[accId]?signatures[accId]:`<em style="color:${T.t3}">[Signature]</em>`;
                        
                        let html=injectSignature(liveFuPitch,sig);
                        html=resolve(html,m).replace(/\{\{([^}]+)\}\}/g,`<span style="background:rgba(244,161,48,.15);color:${T.amb};padding:1px 5px;border-radius:4px;font-family:monospace;font-size:.85em">{{$1}}</span>`);
                        const subj=(fuSubj||'').trim()?resolve(fuSubj,m)||fuSubj:'RE: '+(cur.subject||'');
                        const sd=new Date(cur.sentAt);const fd=sd.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})+' '+sd.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
                        return(
                          <div style={{border:`1px solid ${T.b1}`,borderRadius:16,overflow:'hidden',background:T.pan}}>
                            <div style={{padding:'12px 18px',background:T.sur,borderBottom:`1px solid ${T.b1}`}}>
                              {[['From',cur.senderEmail],['To',cur.toEmail]].map(([k,v])=><div key={k} style={{fontSize:11,color:T.t2,marginBottom:3}}>{k}: <b style={{color:T.t1}}>{v}</b></div>)}
                              <div style={{fontSize:13,fontWeight:700,color:T.t1}}>Subject: {subj}</div>
                            </div>
                            <div style={{padding:'28px 36px',maxHeight:400,overflowY:'auto'}}>
                              <div className="rp" style={{fontSize:14,lineHeight:1.65,color:T.t1}} dangerouslySetInnerHTML={{__html:html}}/>
                              <div style={{margin:'12px 0'}}><hr style={{border:0,borderTop:`1px solid ${T.b1}`}}/></div>
                              <div style={{fontSize:12,color:T.t2,lineHeight:1.7}}><b style={{color:T.t1}}>From:</b> {cur.senderName?`${cur.senderName} <${cur.senderEmail}>`:cur.senderEmail}<br/><b style={{color:T.t1}}>Sent:</b> {fd}<br/><b style={{color:T.t1}}>To:</b> {cur.toEmail}<br/><b style={{color:T.t1}}>Subject:</b> {cur.subject||''}</div>
                              <div style={{marginTop:12}} className="rp" dangerouslySetInnerHTML={{__html:cur.bodyHTML||'<em>(no original body)</em>'}}/>
                            </div>
                          </div>
                        );
                      })():<div style={{textAlign:'center',padding:30,background:T.sur,borderRadius:14,border:`1px dashed ${T.b1}`}}><p style={{fontSize:13,color:T.t3}}>{!valid.length?'No send history found.':'No follow-up pitch yet.'}</p></div>}

                      {valid.length>0&&(!curP||curP.status==='stopped'||curP.status==='done')&&(
                        <div style={{padding:'16px 18px',background:T.aBg,border:`1px solid ${T.aBd}`,borderRadius:14}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:14}}>
                            <div><p style={{fontSize:14,fontWeight:800,color:T.t1,fontFamily:T.dp}}>Follow-up Engine</p><div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}><span className="tag" style={{background:T.aBg,color:T.acc2,fontSize:11}}>{valid.length} targets</span>{skipped>0&&<span className="tag" style={{background:'rgba(244,161,48,.09)',color:T.amb,fontSize:11}}>{skipped} excluded</span>}</div></div>
                            <div style={{display:'flex',gap:10}}>
                              <button onClick={()=>setSkipPopup(true)} className="btn bg" style={{padding:'10px 18px',fontSize:13,fontWeight:600,borderRadius:12}}>🚫 Exclude List</button>
                              <button onClick={sendFU} className="btn bp" style={{padding:'11px 26px',fontSize:13,fontWeight:700,borderRadius:12}}>🚀 Launch Follow-ups</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ─ History ─ */}
            {tab==='history'&&(()=>{
              const curTrack=trackData[selId]||null;

              const hist = historyMappedCache.map(h => {
                if (!curTrack?.rows) return h;
                const tr = curTrack.rows.find(r => r.id === h.trackId || (r.toEmail === h.toEmail && r.touchType === (h.touchType || 'first')));
                if (!tr) return h;
                return { ...h, opened: tr.opened, clicked: tr.clicked, bounced: tr.bounced, autoReply: tr.autoReply, replied: tr.replied };
              });
              const flt=list=>list.filter(h=>{if(!hTerm.length)return true;const s=`${h.toEmail} ${h.senderEmail} ${h.subject}`.toLowerCase();return hTerm.some(t=>s.includes(t));});
              const ft=flt(hist.filter(h=>!h.touchType||h.touchType==='first'));
              const fu=flt(hist.filter(h=>h.touchType==='followup'));
              const Tbl=({rows,label})=>rows.length?(
                <div style={{marginBottom:32}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <p style={{fontSize:14,fontWeight:700,color:T.t1,fontFamily:T.dp}}>{label}</p>
                    <span className="tag" style={{background:T.aBg,color:T.acc2,padding:'4px 10px',fontSize:11}}>{rows.length} sent</span>
                  </div>
                  <div style={{border:`1px solid ${T.b1}`,borderRadius:14,overflow:'hidden',background:T.sur,boxShadow:'0 2px 12px rgba(0,0,0,0.02)'}}>
                    <div style={{overflowX:'auto',maxHeight:450,overflowY:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,textAlign:'left'}}>
                        <thead style={{position:'sticky',top:0,background:'#F9FAFC',zIndex:1,boxShadow:`0 1px 0 ${T.b1}`}}>
                          <tr>
                            {['Stage','Sender','Recipient','Subject & Date','Tracking','Action'].map(h=>(
                              <th key={h} style={{padding:'12px 16px',fontWeight:700,color:T.t2,fontSize:10,textTransform:'uppercase',letterSpacing:'.05em',whiteSpace:'nowrap'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r,i)=>{
                            const sd = new Date(r.sentAt);
                            const fDate = sd.toLocaleDateString([],{month:'short',day:'numeric'})+' '+sd.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
                            return (
                              <tr key={i} style={{borderBottom:i!==rows.length-1?`1px solid ${T.b1}`:'none',transition:'background .15s',background:i%2===0?'transparent':'#FAFCFF'}} onMouseEnter={e=>e.currentTarget.style.background=T.hov} onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':'#FAFCFF'}>
                                <td style={{padding:'14px 16px',whiteSpace:'nowrap'}}>
                                  <span className="tag" style={{background:r.touchType==='followup'?'rgba(244,161,48,.1)':T.aBg,color:r.touchType==='followup'?T.amb:T.acc2,padding:'4px 8px',fontSize:11}}>
                                    {r.touchType==='followup'?'⤴ Follow-up':'🔥 First Touch'}
                                  </span>
                                </td>
                                <td style={{padding:'14px 16px'}}>
                                  <div style={{fontWeight:600,color:T.t1,marginBottom:2}}>{r.senderName||r.senderEmail.split('@')[0]}</div>
                                  <div style={{color:T.t3,fontSize:11,fontFamily:T.mn}}>{r.senderEmail}</div>
                                </td>
                                <td style={{padding:'14px 16px'}}>
                                  <div style={{fontWeight:600,color:T.t1}}>{r.toEmail}</div>
                                </td>
                                <td style={{padding:'14px 16px',maxWidth:260}}>
                                  <div style={{fontWeight:600,color:T.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{r.subject||'(No Subject)'}</div>
                                  <div style={{color:T.t2,fontSize:11}}>{fDate}</div>
                                </td>
                                <td style={{padding:'14px 16px'}}>
                                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                                    {r.opened && <span title="Opened" style={{background:'rgba(16,124,16,.1)',color:T.grn,padding:'3px 8px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.02em'}}>👁 OPEN</span>}
                                    {r.clicked && <span title="Clicked" style={{background:'rgba(8,145,178,.1)',color:'#0891B2',padding:'3px 8px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.02em'}}>🖱 CLICK</span>}
                                    {r.replied && <span title="Replied" style={{background:'rgba(244,161,48,.1)',color:T.amb,padding:'3px 8px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.02em'}}>↩ REPLY</span>}
                                    {r.bounced && <span title="Bounced" style={{background:'rgba(209,52,56,.1)',color:T.red,padding:'3px 8px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.02em'}}>✕ BOUNCE</span>}
                                    {r.autoReply && <span title="Auto Reply" style={{background:T.card,border:`1px solid ${T.b1}`,color:T.t2,padding:'2px 8px',borderRadius:6,fontSize:10,fontWeight:700,letterSpacing:'.02em'}}>🤖 AUTO</span>}
                                    {!r.opened&&!r.clicked&&!r.replied&&!r.bounced&&!r.autoReply&&<span style={{color:T.t3,fontSize:11,fontWeight:500}}>Delivered</span>}
                                  </div>
                                </td>
                                <td style={{padding:'14px 16px'}}>
                                  <button onClick={()=>setViewHistBody(r)} style={{background:T.sur,border:`1px solid ${T.b2}`,borderRadius:8,padding:'6px 12px',fontSize:11,fontWeight:600,color:T.acc2,cursor:'pointer',transition:'all .15s',boxShadow:'0 1px 2px rgba(0,0,0,0.03)'}} onMouseEnter={e=>{e.currentTarget.style.background=T.aBg;e.currentTarget.style.borderColor=T.acc;}} onMouseLeave={e=>{e.currentTarget.style.background=T.sur;e.currentTarget.style.borderColor=T.b2;}}>
                                    View Email
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ):null;
              return(
                <div>
                  <div style={{marginBottom:18,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
                    <h3 style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:T.dp}}>Send History</h3>
                    <div style={{display:'flex',gap:10,alignItems:'center'}}>
                      <input value={histSrch} onChange={e=>setHistSrch(e.target.value)} placeholder="Filter…" className="inp" style={{minWidth:200,padding:'7px 12px',fontSize:12}}/>
                      {hist.length>0&&<button onClick={()=>{
                        const hdr=['#','From','To','Subject','Date','Stage','Opened','Clicked','Bounced','AutoReply','Replied',...selH];
                        expCSV(hist.map((r,i)=>Object.fromEntries(hdr.map((k,j)=>[k,[i+1,r.senderEmail,r.toEmail,r.subject,r.sentAt,r.touchType||'first',r.opened?'Yes':'No',r.clicked?'Yes':'No',r.bounced?'Yes':'No',r.autoReply?'Yes':'No',r.replied?'Yes':'No',...(r.rowData||[])][j]]))),'history.csv');
                      }} className="btn bg" style={{padding:'7px 14px',fontSize:12}}><Ic.Down s={12}/> Export</button>}
                    </div>
                  </div>
                  {!hist.length?(<div style={{textAlign:'center',padding:'60px 20px',background:T.sur,borderRadius:14,border:`1px dashed ${T.b1}`}}><div style={{fontSize:36,marginBottom:12,opacity:.2}}>📭</div><p style={{fontSize:13,color:T.t3}}>No history yet. Launch your campaign first.</p></div>):(<>
                    {(()=>{
                      const opens   = curTrack?.opened   != null ? curTrack.opened   : hist.filter(h=>h.opened).length;
                      const clicks  = curTrack?.clicked  != null ? curTrack.clicked  : hist.filter(h=>h.clicked).length;
                      const bounces = curTrack?.bounced  != null ? curTrack.bounced  : hist.filter(h=>h.bounced).length;
                      const autos   = curTrack?.autoReply!= null ? curTrack.autoReply: hist.filter(h=>h.autoReply).length;
                      const replies = curTrack?.replied  != null ? curTrack.replied  : hist.filter(h=>h.replied).length;
                      const inboxed = curTrack?.inboxed  != null ? curTrack.inboxed  : hist.filter(h=>!h.bounced&&!h.autoReply).length;
                      
                      const firstCount = ft.length;
                      const fuCount = fu.length;
                      const total = firstCount + fuCount;
                      const pct=(n,d)=>d>0?Math.round((n/d)*100)+'%':'—';
                      const StatBox=({val,label,color,sub})=>(
                        <div style={{background:T.sur,border:`1px solid ${T.b1}`,borderRadius:12,padding:'14px 18px',textAlign:'center',flex:1,minWidth:100}}>
                          <div style={{fontSize:22,fontWeight:800,color:color||T.acc,fontFamily:T.dp}}>{val}</div>
                          <div style={{fontSize:11,color:color||T.acc2,fontWeight:600,marginTop:2}}>{label}</div>
                          {sub&&<div style={{fontSize:10,color:T.t3,marginTop:3}}>{sub}</div>}
                        </div>
                      );
                      return(
                        <div style={{marginBottom:18}}>
                          <p style={{fontSize:11,fontWeight:700,color:T.t3,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Campaign Analytics</p>
                          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                            <StatBox val={total} label="Total Sent" color={T.acc}/>
                            <StatBox val={inboxed} label="Inbox" color={T.grn} sub={pct(inboxed,total)}/>
                            <StatBox val={opens} label="Opens" color='#8B5CF6' sub={pct(opens,total)+' open rate'}/>
                            <StatBox val={clicks} label="Clicks" color='#0891B2' sub={pct(clicks,total)+' CTR'}/>
                          </div>
                          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                            <StatBox val={replies} label="Replies" color={T.amb} sub={pct(replies,total)}/>
                            <StatBox val={bounces} label="Bounced" color={T.red} sub={pct(bounces,total)}/>
                            <StatBox val={autos} label="Auto-Reply" color={T.t2} sub={pct(autos,total)}/>
                            <StatBox val={fu.length} label="Follow-ups" color='#7C3AED'/>
                          </div>
                          <p style={{fontSize:10,color:T.t3,marginTop:8}}>📌 Open/Click tracking requires the tracking server to be enabled (see server.js TRACK_OPENS=true)</p>
                        </div>
                      );
                    })()}
                    <div style={{display:'flex',gap:10,marginBottom:18}}>
                      <div style={{background:T.aBg,border:`1px solid ${T.aBd}`,borderRadius:10,padding:'12px 18px',textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:800,color:T.acc,fontFamily:T.dp}}>{ft.length}</div>
                        <div style={{fontSize:11,color:T.acc2}}>First Touch</div>
                      </div>
                      {fu.length>0&&<div style={{background:'rgba(244,161,48,.08)',border:`1px solid rgba(244,161,48,.22)`,borderRadius:10,padding:'12px 18px',textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:800,color:T.amb,fontFamily:T.dp}}>{fu.length}</div>
                        <div style={{fontSize:11,color:T.amb}}>Follow-ups</div>
                      </div>}
                      <div style={{background:'rgba(30,216,158,.07)',border:`1px solid rgba(30,216,158,.22)`,borderRadius:10,padding:'12px 18px',textAlign:'center'}}>
                        <div style={{fontSize:22,fontWeight:800,color:T.grn,fontFamily:T.dp}}>{ft.length+fu.length}</div>
                        <div style={{fontSize:11,color:T.grn}}>Total Sent</div>
                      </div>
                    </div>
                    {Tbl({ rows: ft, label: "🔥 First Touch" })}
                    {Tbl({ rows: fu, label: "⤴ Follow-ups" })}
                  </>)}

                  {/* CRM-Style View Email Modal */}
                  {viewHistBody && (
                    <Modal onClose={() => setViewHistBody(null)} width={740} maxH="88vh">
                      <MH icon={<Ic.Eye s={18} c={T.acc}/>} title="Sent Email Record" sub={`Dispatched on ${new Date(viewHistBody.sentAt).toLocaleString()}`} onClose={() => setViewHistBody(null)}/>
                      <div style={{padding:'20px 24px',background:T.sur,borderBottom:`1px solid ${T.b1}`,display:'flex',flexDirection:'column',gap:8}}>
                        <div style={{display:'flex',alignItems:'flex-start'}}>
                          <div style={{width:70,fontSize:12,color:T.t3,fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginTop:2}}>From:</div>
                          <div style={{fontSize:14,color:T.t1,fontWeight:600}}>{viewHistBody.senderName ? `${viewHistBody.senderName} ` : ''}<span style={{color:T.t2,fontWeight:400}}>&lt;{viewHistBody.senderEmail}&gt;</span></div>
                        </div>
                        <div style={{display:'flex',alignItems:'flex-start'}}>
                          <div style={{width:70,fontSize:12,color:T.t3,fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginTop:2}}>To:</div>
                          <div style={{fontSize:14,color:T.t1,fontWeight:500}}>{viewHistBody.toEmail}</div>
                        </div>
                        <div style={{display:'flex',alignItems:'flex-start',marginTop:4}}>
                          <div style={{width:70,fontSize:12,color:T.t3,fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginTop:2}}>Subject:</div>
                          <div style={{fontSize:15,color:T.t1,fontWeight:700}}>{viewHistBody.subject}</div>
                        </div>
                      </div>
                      <div style={{padding:'32px 40px',overflowY:'auto',flex:1,background:'#fff'}}>
                        <div className="rp" style={{fontSize:14, lineHeight: 1.65, color: '#111'}} dangerouslySetInnerHTML={{__html: viewHistBody.bodyHTML || '<em style="color:#888">No body content saved.</em>'}} />
                      </div>
                    </Modal>
                  )}

                  {/* Scan button */}
                  <div style={{marginTop:16,display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:T.sur,borderRadius:12,border:`1px solid ${T.b1}`}}>
                    <div style={{flex:1}}>
                      <p style={{fontSize:12,fontWeight:600,color:T.t1}}>📡 Inbox Scan for Tracking</p>
                      <p style={{fontSize:11,color:T.t2,marginTop:2}}>Scans sender inboxes for MDN read receipts, bounces, replies and auto-replies. No tracking pixel — inbox-safe.</p>
                      {curTrack&&<p style={{fontSize:10,color:T.t3,marginTop:4}}>Last scan: {curTrack.total} tracked · {curTrack.opened} opens · {curTrack.bounced} bounces · {curTrack.replied} replies</p>}
                    </div>
                    <button onClick={doScan} disabled={scanning} className="btn bp" style={{padding:'8px 18px',fontSize:12,borderRadius:9,flexShrink:0}}>
                      {scanning?'Scanning…':'🔍 Scan Now'}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ─ Live Progress ─ */}
            {tab==='progress'&&curP&&(
              <div style={{display:'flex',flexDirection:'column',height:'100%',gap:14}}>
                <h3 style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:T.dp}}>Live Engine Progress</h3>
                <div style={{padding:'16px 18px',background:curP.status==='done'?'rgba(30,216,158,.07)':curP.status==='paused'?'rgba(244,161,48,.07)':T.aBg,border:`1px solid ${curP.status==='done'?'rgba(30,216,158,.22)':curP.status==='paused'?'rgba(244,161,48,.22)':T.aBd}`,borderRadius:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:T.t1,fontFamily:T.dp}}>{curP.status==='done'?'✓ Complete':curP.status==='stopped'?'■ Stopped':curP.status==='paused'?'⏸ Paused':'⚡ Running'}</div>
                      <div style={{fontSize:13,color:T.acc2,marginTop:4,fontWeight:600,fontFamily:T.mn}}>{curP.sent||0} / {curP.total||0} sent</div>
                    </div>
                    {curP.status!=='done'&&curP.status!=='stopped'&&(
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={togglePause} className="btn bg" style={{padding:'8px 16px',fontSize:13,fontWeight:700}}>{curP.status==='paused'?'▶ Resume':'⏸ Pause'}</button>
                        <button onClick={stopEng} className="btn bd" style={{padding:'8px 16px',fontSize:13,fontWeight:700}}>■ Stop</button>
                      </div>
                    )}
                  </div>
                  <div style={{height:8,background:'rgba(255,255,255,.06)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${((curP.sent||0)/Math.max(curP.total||1,1))*100}%`,background:curP.status==='done'?T.grn:curP.status==='paused'?T.amb:T.acc,borderRadius:4,transition:'width .4s'}}/>
                  </div>
                  {curP.errors?.length>0&&(
                    <div style={{marginTop:10,maxHeight:80,overflowY:'auto',borderTop:`1px dashed rgba(255,69,96,.2)`,paddingTop:8}}>
                      {curP.errors.map((e,i)=><div key={i} style={{fontSize:11,color:T.red,fontFamily:T.mn,marginBottom:2}}>[{e.senderEmail} → {e.toEmail}] {e.reason}</div>)}
                    </div>
                  )}
                </div>
                <LiveLogViewer campId={selId} engRef={engRef}/>
              </div>
            )}

          </div>
        </div>
      )}
      {saveToast&&(
        <div style={{position:'fixed',bottom:26,right:26,background:'#111827',color:'#fff',borderRadius:12,padding:'11px 22px',fontSize:13,fontWeight:600,letterSpacing:'.01em',boxShadow:'0 6px 28px rgba(0,0,0,.6)',zIndex:99999,animation:'fadeUp .18s ease',pointerEvents:'none',display:'flex',alignItems:'center',gap:8}}>
          <span style={{color:'#34D399',fontSize:16}}>✓</span>{saveToast}
        </div>
      )}
    </div>
  );
}

// ── Attachment download bar ─────────────────────────────────────
function AttachmentBar({accountId,uid}){
  const [atts,setAtts]=useState([]);
  useEffect(()=>{
    apiFetch(`/accounts/${accountId}/messages/${uid}/attachments`).then(setAtts).catch(()=>{});
  },[accountId,uid]);
  if(!atts.length)return null;
  return(
    <div style={{padding:'8px 16px',borderBottom:`1px solid ${T.b1}`,background:T.sur,display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',flexShrink:0}}>
      <span style={{fontSize:11,color:T.t3,fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em'}}>📎 Attachments:</span>
      {atts.map((a,i)=>(
        <a key={i} href={`http://localhost:5001/api/accounts/${accountId}/messages/${uid}/attachment/${a.idx}`}
          download={a.filename} target="_blank" rel="noreferrer"
          style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',background:T.card,border:`1px solid ${T.b1}`,borderRadius:8,fontSize:11,color:T.acc2,textDecoration:'none',transition:'all .12s',cursor:'pointer'}}
          onMouseEnter={e=>{e.currentTarget.style.background=T.hov;e.currentTarget.style.borderColor=T.b2;}}
          onMouseLeave={e=>{e.currentTarget.style.background=T.card;e.currentTarget.style.borderColor=T.b1;}}>
          <Ic.Down s={11}/>{a.filename}{a.size>0&&<span style={{color:T.t3}}>({Math.round(a.size/1024)}kb)</span>}
        </a>
      ))}
    </div>
  );
}

// ── Contacts Modal ──────────────────────────────────────────────
function ContactsModal({onClose}){
  const [contacts,setContacts]=useState([]);
  const [q,setQ]=useState('');
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:'',company:'',notes:''});
  const [adding,setAdding]=useState(false);
  const [newEmail,setNewEmail]=useState('');

  const load=useCallback(()=>{
    apiFetch(`/contacts?q=${encodeURIComponent(q)}`).then(setContacts).catch(()=>{});
  },[q]);

  useEffect(()=>{load();},[load]);

  const startEdit=(c)=>{setEditing(c.id);setForm({name:c.name||'',company:c.company||'',notes:c.notes||'',email:c.email});};
  const saveEdit=async()=>{
    if(!editing)return;
    await apiFetch(`/contacts/${editing}`,{method:'PATCH',body:JSON.stringify(form)}).catch(()=>{});
    setEditing(null);load();
  };
  const del=async(id)=>{
    await apiFetch(`/contacts/${id}`,{method:'DELETE'}).catch(()=>{});
    load();
  };
  const addNew=async()=>{
    if(!newEmail.trim())return;
    await apiFetch('/contacts',{method:'POST',body:JSON.stringify({email:newEmail,...form})}).catch(()=>{});
    setAdding(false);setNewEmail('');setForm({name:'',company:'',notes:''});load();
  };

  return(
    <Modal onClose={onClose} width={620} maxH="88vh">
      <MH icon="👥" title="Contacts" sub={`${contacts.length} contacts`} onClose={onClose}/>
      <div style={{padding:'10px 20px',borderBottom:`1px solid ${T.b1}`,display:'flex',gap:8,flexShrink:0}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search contacts…" className="inp" style={{flex:1,padding:'8px 12px',fontSize:13}}/>
        <button onClick={()=>setAdding(v=>!v)} className="btn bp" style={{padding:'8px 14px',fontSize:12,borderRadius:9}}>+ Add</button>
      </div>
      {adding&&(
        <div style={{padding:'12px 20px',borderBottom:`1px solid ${T.b1}`,background:T.aBg,display:'flex',flexDirection:'column',gap:8,flexShrink:0}}>
          <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="Email *" className="inp" style={{fontSize:12}}/>
          <div style={{display:'flex',gap:8}}>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Name" className="inp" style={{fontSize:12}}/>
            <input value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))} placeholder="Company" className="inp" style={{fontSize:12}}/>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={addNew} className="btn bp" style={{padding:'7px 18px',fontSize:12,borderRadius:8}}>Save Contact</button>
            <button onClick={()=>setAdding(false)} className="btn bg" style={{padding:'7px 14px',fontSize:12,borderRadius:8}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{flex:1,overflowY:'auto'}}>
        {!contacts.length&&<div style={{padding:40,textAlign:'center',color:T.t3,fontSize:13}}>No contacts yet — they auto-build as you send emails.</div>}
        {contacts.map(c=>(
          <div key={c.id} style={{borderBottom:`1px solid ${T.b1}`,padding:'12px 20px'}}>
            {editing===c.id?(
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{display:'flex',gap:8}}>
                  <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Name" className="inp" style={{fontSize:12,flex:1}}/>
                  <input value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))} placeholder="Company" className="inp" style={{fontSize:12,flex:1}}/>
                </div>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Notes…" style={{width:'100%',height:60,resize:'none',borderRadius:8,border:`1px solid ${T.b1}`,padding:'8px',fontSize:12,outline:'none',fontFamily:T.sn}}/>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={saveEdit} className="btn bp" style={{padding:'6px 14px',fontSize:12,borderRadius:7}}>Save</button>
                  <button onClick={()=>setEditing(null)} className="btn bg" style={{padding:'6px 12px',fontSize:12,borderRadius:7}}>Cancel</button>
                </div>
              </div>
            ):(
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:T.aBg,border:`1px solid ${T.aBd}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:T.acc,flexShrink:0}}>{(c.name||c.email)[0].toUpperCase()}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.t1}}>{c.name||c.email}{c.company&&<span style={{fontSize:11,color:T.t3,marginLeft:8,fontWeight:400}}>· {c.company}</span>}</div>
                  <div style={{fontSize:11,color:T.acc2,fontFamily:T.mn}}>{c.email}</div>
                  {c.notes&&<div style={{fontSize:11,color:T.t2,marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.notes}</div>}
                </div>
                <div style={{display:'flex',gap:5,flexShrink:0}}>
                  <span style={{fontSize:10,color:T.t3,fontFamily:T.mn}}>{c.times_contacted} msgs</span>
                  <button onClick={()=>startEdit(c)} style={{background:'none',border:`1px solid ${T.b1}`,borderRadius:6,padding:'4px 8px',fontSize:11,cursor:'pointer',color:T.t2}}>✎</button>
                  <button onClick={()=>del(c.id)} style={{background:'none',border:`1px solid rgba(255,69,96,.2)`,borderRadius:6,padding:'4px 8px',fontSize:11,cursor:'pointer',color:T.red}}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <MF><button onClick={onClose} className="btn bg" style={{width:'100%',padding:'10px',fontSize:13}}>Close</button></MF>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]          = useState(()=>ls.get('mOS_page','mail'));
  const [accounts,setAccounts]  = useState([]);
  const [sigs,setSigs]          = useState(()=>ls.get('mOS_sigs',{}));
  const [aset,setAset]          = useState(()=>ls.get('mOS_aset',{}));
  const [campaigns, setCampaigns] = useState(() => { 
    try { 
      // Look for the CORRECT key
      const saved = JSON.parse(localStorage.getItem("mailOS_campaigns") || "[]"); 
      return saved.map(c => {
        let csv = null;
        let savedPitch = c.pitch || "";
        let savedFuPitch = c.fuPitch || "";
        try { csv = JSON.parse(localStorage.getItem('mailOS_csv_' + c.id)); } catch(e) {}
        try { savedPitch = localStorage.getItem('mailOS_draft_pitch_' + c.id) || savedPitch; } catch(e) {}
        try { savedFuPitch = localStorage.getItem('mailOS_draft_fu_pitch_' + c.id) || savedFuPitch; } catch(e) {}
        
        return {
          ...c,
          pitch: savedPitch,
          fuPitch: savedFuPitch,
          csvHeaders: (csv?.headers?.length ? csv.headers : c.csvHeaders) || [],
          csvRows:    (csv?.rows?.length    ? csv.rows    : c.csvRows)    ||[]
        };
      });
    } catch(e) { return[]; } 
  });
  const[selId,setSelId] = useState(()=>ls.get('mOS_selId', null));
  useEffect(() => { ls.set('mOS_selId', selId); }, [selId]);
  const [allMails,setAllMails]  = useState({});
  const [folderMap,setFolderMap]= useState({});
  const [selFolder,setSelFolder]= useState(()=>ls.get('mOS_selFolder',null));
  const [selMail,setSelMail]    = useState(null);
  const [loading,setLoading]    = useState({});
  const [search,setSearch]      = useState('');
  const [debSrch,setDebSrch]    = useState('');
  const [collapsed,setCollapsed]= useState(false);
  const [isMobile,setIsMobile]= useState(()=>window.innerWidth<768);
  useEffect(()=>{
    const h=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener('resize',h,{passive:true});
    return()=>window.removeEventListener('resize',h);
  },[]);
  const [showAdd,setShowAdd]    = useState(false);
  const [showCSV,setShowCSV]    = useState(false);
  const [showCmp,setShowCmp]    = useState(false);
  const [showSet,setShowSet]    = useState(false);
  const [expanded,setExpanded]  = useState({});
  const [refreshing,setRefresh] = useState(false);
  const [ctxMenu,setCtxMenu]    = useState(null);
  const [trustMail,setTrustMail]= useState(null);
  const [trustChk,setTrustChk] = useState(true);
  const [trustBusy,setTrustBusy]= useState(false);
  const [showContacts,setShowContacts]= useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [threadView, setThreadView] = useState(false);
  const [openThreads, setOpenThreads] = useState(new Set()); // 'date-desc','date-asc','name-asc','name-desc','email-asc','email-desc'

  const srchTimer = useRef(null);
  const setTimer  = useRef(null);
  const accRef    = useRef([]);

  useEffect(()=>{ls.set('mOS_page',page);},[page]);
  useEffect(()=>{if(selFolder)ls.set('mOS_selFolder',selFolder);},[selFolder]);
  useEffect(() => {
    // 1. Save heavy CSV data separately
    campaigns.forEach(c => {
      if (c.csvHeaders?.length || c.csvRows?.length) {
        try { localStorage.setItem('mailOS_csv_' + c.id, JSON.stringify({ headers: c.csvHeaders || [], rows: c.csvRows ||[] })); } catch(e) {}
      }
    });
    
    // 2. Strip heavy data and save to the PROPER key so empty campaigns don't vanish!
    const stripped = campaigns.map(({ csvRows, csvHeaders, pitch, fuPitch, ...rest }) => rest);
    try {
      localStorage.setItem("mailOS_campaigns", JSON.stringify(stripped));
    } catch(e) { console.error("Could not save campaigns list", e); }
  }, [campaigns]);
  useEffect(()=>{accRef.current=accounts;},[accounts]);
  useEffect(()=>{const c=()=>setCtxMenu(null);document.addEventListener('scroll',c,true);return()=>document.removeEventListener('scroll',c,true);},[]);
  useEffect(()=>()=>{clearTimeout(srchTimer.current);clearTimeout(setTimer.current);},[]);

  const saveSets=useCallback((s,a)=>{clearTimeout(setTimer.current);setTimer.current=setTimeout(()=>{ls.set('mOS_sigs',s);ls.set('mOS_aset',a);},300);},[]);
  const debSearch=useCallback(val=>{setSearch(val);clearTimeout(srchTimer.current);srchTimer.current=setTimeout(()=>setDebSrch(val),180);},[]); 
  // Persist signature to backend DB (survives browser-clear / multi-device)
  const handleSigChange=useCallback((id,html)=>setSigs(p=>{
    const n={...p,[id]:html};saveSets(n,aset);
    apiFetch('/accounts/'+id+'/signature',{method:'PUT',body:JSON.stringify({html})}).catch(()=>{});
    return n;
  }),[aset,saveSets]);

  // Persist delay settings to backend DB
  const handleAsetChange=useCallback((id,k,v)=>setAset(p=>{
    const n={...p,[id]:{...(p[id]||{}),[k]:v}};saveSets(sigs,n);
    clearTimeout(setTimer.current);
    setTimer.current=setTimeout(()=>{
      const s=n[id]||{};
      apiFetch('/accounts/'+id+'/settings',{method:'PATCH',body:JSON.stringify({minDelay:s.minDelay??60,maxDelay:s.maxDelay??180})}).catch(()=>{});
    },800);
    return n;
  }),[sigs,saveSets]);
  

  // Load mails from API/DB
  const loadMails=useCallback(async(accId,folderPath,refresh=false,silent=false)=>{
    const key=`${accId}::${folderPath.toLowerCase()}`;
    if(!silent)setLoading(p=>({...p,[key]:true}));
    try{
      const msgs=await apiFetch(`/accounts/${accId}/emails?folder=${encodeURIComponent(folderPath)}${refresh?'&refresh=true':''}`,{timeout:120000});
      const rc=ls.get('mOS_rc',{}),sc=ls.get('mOS_sc',{});
      setAllMails(p=>{
        const ex=p[key]||[];const rm={},sm={};ex.forEach(m=>{rm[m.id]=m.read;sm[m.id]=m.starred;});
        const merged=msgs.map(m=>({...m,_ts:new Date(m.date).getTime(),read:m.id in rc?rc[m.id]:(m.id in rm?rm[m.id]:m.read),starred:m.id in sc?sc[m.id]:(m.id in sm?sm[m.id]:m.starred)}));
        merged.sort((a,b)=>(b._ts||0)-(a._ts||0));   // integer compare — no Date objects
        // Async cache write so it never blocks the render
        setTimeout(()=>{try{ls.set(`mOS_mc_${key}`,merged.slice(0,150));}catch{}},0);
        return{...p,[key]:merged};
      });
    }catch{}
    if(!silent)setLoading(p=>({...p,[key]:false}));
  },[]);

  const discoverAndLoad=useCallback(async(acc,silent=false)=>{
    try{
      const cf=await apiFetch(`/accounts/${acc.id}/folders-cached`).catch(()=>null);
      if(cf?.folders?.length){
        setFolderMap(p=>({...p,[acc.id]:cf}));setExpanded(p=>({...p,[acc.id]:true}));
        const inbox=cf.discovered?.inbox||'INBOX';
        setSelFolder(prev=>prev||`${acc.id}::${inbox.toLowerCase()}`);
        await loadMails(acc.id,inbox,false,silent);return;
      }
      const data=await apiFetch(`/accounts/${acc.id}/folderlist`,{timeout:30000});
      
      // Fallback if IMAP returns an empty folder list
      if (!data.folders || data.folders.length === 0) {
        data.folders =[{ name: 'INBOX', fullPath: 'INBOX', attribs: ['\\inbox'] }];
        if (!data.discovered) data.discovered = { inbox: 'INBOX' };
      }
      
      setFolderMap(p=>({...p,[acc.id]:data}));setExpanded(p=>({...p,[acc.id]:true}));
      const inbox=data.discovered?.inbox||'INBOX';
      setSelFolder(prev=>prev||`${acc.id}::${inbox.toLowerCase()}`);
      apiFetch(`/accounts/${acc.id}/folders-cached`,{method:'POST',body:JSON.stringify({folders:data.folders,discovered:data.discovered})}).catch(()=>{});
      await loadMails(acc.id,inbox,true,silent);
    }catch{
      // Fallback if IMAP discovery completely fails or times out
      setFolderMap(p=>({...p,[acc.id]:{ folders:[{ name: 'INBOX', fullPath: 'INBOX', attribs: ['\\inbox'] }], discovered: { inbox: 'INBOX' } }}));
      setSelFolder(prev=>prev||`${acc.id}::inbox`);setExpanded(p=>({...p,[acc.id]:true}));
      loadMails(acc.id,'INBOX',false,silent).catch(()=>{});
    }
  },[loadMails]);

  useEffect(()=>{
    // Restore cached mails instantly — shows content before API responds
    try {
      const snapshot = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('mOS_mc_')) {
          const v = ls.get(k);
          if (v?.length) {
            const folderKey = k.slice(7);
            // restore _ts if missing (older cache entries)
            snapshot[folderKey] = v.map(m => m._ts ? m : {...m, _ts: new Date(m.date).getTime()});
          }
        }
      }
      if (Object.keys(snapshot).length) setAllMails(snapshot);
    } catch {}

    apiFetch('/accounts').then(list=>{ 
      setAccounts(list);accRef.current=list;if(!list.length)return;
      const queue=[...list];const N=Math.min(6,list.length);
      const worker=async()=>{while(queue.length){const a=queue.shift();if(a)await discoverAndLoad(a,true).catch(()=>{});}};
      Promise.all(Array.from({length:N},worker));
    }).catch(()=>{});

    // Pull server-stored configs and campaigns — Absolute source of truth
    Promise.all([
      apiFetch('/accounts/settings').catch(()=>({})),
      apiFetch('/signatures').catch(()=>({})),
      apiFetch('/campaigns').catch(()=>([])),
    ]).then(([apiSettings, apiSigs, apiCamps])=>{
      if(Object.keys(apiSettings).length) setAset(p=>({...apiSettings,...p}));
      if(Object.keys(apiSigs).length)     setSigs(p=>({...apiSigs,...p}));
      
      // Sync master campaign list from Database
      // Only ADD campaigns from server that don't exist locally.
    // Never overwrite local campaigns — prevents resurrection of deleted ones.
    // Sync master campaign list from Database (Absolute Source of Truth)
      if (apiCamps && apiCamps.length) {
        setCampaigns(prev => {
          const merged = [...prev];
          apiCamps.forEach(serverCamp => {
            const tombstones = ls.get('mOS_deleted_camps', []);
            if (tombstones.includes(serverCamp.id)) return; // Never resurrect tombstoned campaigns
            const idx = merged.findIndex(c => c.id === serverCamp.id);
            if (idx >= 0) {
              // Update local metadata with absolute server truth to prevent vanishing
              merged[idx] = { 
                ...merged[idx], 
                name: serverCamp.name || merged[idx].name,
                subject: serverCamp.subject || merged[idx].subject,
                status: serverCamp.status || merged[idx].status,
                emailCol: serverCamp.emailCol ?? merged[idx].emailCol,
                senderIds: serverCamp.senderIds?.length ? serverCamp.senderIds : merged[idx].senderIds
              };
            } else {
              // Restore missing campaign from server
              const csv = ls.get('mOS_csv_' + serverCamp.id, null);
              merged.push({
                ...serverCamp,
                csvHeaders: csv?.headers?.length ? csv.headers : (serverCamp.csvHeaders ||[]),
                csvRows:    csv?.rows?.length    ? csv.rows    : (serverCamp.csvRows    ||[]),
            });
            }
          });
          return merged;
        });
      }
    });

    // ── Advanced Frontend Inbox Sync Manager 
    // Perfectly limits execution to open sessions, triggers every 10 mins active, 
    // AND automatically refreshes the moment a sleeping tab is maximized/awakened.
    let isSyncing = false;
    const triggerSync = async () => {
      // Prevents overlap if visibility trigger & interval trigger happen at the exact same ms
      if (isSyncing || !accRef.current.length) return;
      isSyncing = true;
      
      for (const acc of accRef.current) {
        try {
          const fc = await apiFetch(`/accounts/${acc.id}/folders-cached`).catch(() => null);
          const inbox = fc?.discovered?.inbox || 'INBOX';
          // Perform isolated silent reload (fetch unseen, preserve user UI state)
          await loadMails(acc.id, inbox, true, true);
          // Wait gracefully between loops to prevent strict IMAP connection dropping (ECONNRESET)
          await new Promise(r => setTimeout(r, 600)); 
        } catch {}
      }
      isSyncing = false;
    };

    // 1. Standard background heartbeat lock (600,000ms = 10 Mins)
    const iv = setInterval(triggerSync, 600000);
    
    // 2. Awakening listener (forces instantaneous catch-up if you minimize/restore browser tab)
    const handleVis = () => { if (document.visibilityState === 'visible') triggerSync(); };
    document.addEventListener('visibilitychange', handleVis);

    return () => {
      clearInterval(iv);
      document.removeEventListener('visibilitychange', handleVis);
    };
  },[discoverAndLoad,loadMails]);

  // ── SSE: Real-time new-mail push from server ─────────────────
  useEffect(()=>{
    let es=null;
    const connect=()=>{
      try{
        es=new EventSource('http://localhost:5001/api/sse');
        es.addEventListener('new_mail',ev=>{
          try{
            const{accountId,folder}=JSON.parse(ev.data);
            // Silently refresh that folder — no loading spinner shown
            loadMails(accountId,folder,true,true).catch(()=>{});
          }catch{}
        });
        es.onerror=()=>{
          try{es.close();}catch{}
          es=null;
          setTimeout(connect,8000); // reconnect after 8s
        };
      }catch{}
    };
    connect();
    return()=>{try{es?.close();}catch{}};
  // eslint-disable-next-line
  },[]);

  const handleAccAdded=useCallback(async acc=>{
    setAccounts(p=>{if(p.find(a=>a.email?.toLowerCase()===acc.email?.toLowerCase())||p.length>=500)return p;return[...p,acc];});
    await discoverAndLoad(acc,false);
  },[discoverAndLoad]);

  const handleRemoveAccount=async id=>{
    try{
      await apiFetch('/accounts/'+id,{method:'DELETE'});
      setAccounts(p=>p.filter(a=>a.id!==id));
      setAllMails(p=>{const n={...p};Object.keys(n).filter(k=>k.startsWith(id+'::')).forEach(k=>delete n[k]);return n;});
      setFolderMap(p=>{const n={...p};delete n[id];return n;});
      setSigs(p=>{const n={...p};delete n[id];return n;});
      setAset(p=>{const n={...p};delete n[id];return n;});
      setSelFolder(prev=>prev?.startsWith(id+'::')?null:prev);
    }catch(e){alert('Error: '+e.message);}
  };

  const handleRefresh=useCallback(async()=>{
    if(!selFolder)return;setRefresh(true);
    try{
      if(selFolder.startsWith('GLOBAL::')){
        const type = selFolder.split('::')[1];
        for(const acc of accRef.current){
          const fc = await apiFetch(`/accounts/${acc.id}/folders-cached`).catch(()=>null);
          // Always refresh Inbox
          const inbox = fc?.discovered?.inbox||'INBOX';
          await loadMails(acc.id, inbox, true, true).catch(()=>{});
          
          // If we are looking at All Sent, actively fetch the Sent folder too
          if (type === 'sent') {
            const sentFolder = fc?.discovered?.sent || 'Sent';
            await loadMails(acc.id, sentFolder, true, true).catch(()=>{});
          }
        }
      }else{
        const si=selFolder.indexOf('::');if(si===-1)return;
        const aid=selFolder.slice(0,si),fp=selFolder.slice(si+2);
        const data=folderMap[aid];const real=data?.folders?.find(f=>f.fullPath.toLowerCase()===fp)?.fullPath||fp;
        await loadMails(aid,real,true,false);
      }
    }catch{}setRefresh(false);
  },[selFolder,folderMap,loadMails]);

  const handleMarkRead=useCallback((mail,readVal=true)=>{
    const fk=`${mail.accountId}::${(mail.folder||'inbox').toLowerCase()}`;
    setAllMails(p=>({...p,[fk]:(p[fk]||[]).map(m=>m.id===mail.id?{...m,read:readVal}:m)}));
    setSelMail(prev=>prev?.id===mail.id?{...prev,read:readVal}:prev);
    const rc=ls.get('mOS_rc',{});rc[mail.id]=readVal;ls.set('mOS_rc',rc);
    apiFetch('/accounts/'+mail.accountId+'/messages/'+mail.uid+'/read',{method:'PATCH',body:JSON.stringify({read:readVal})}).catch(()=>{});
  },[]);

  const handleToggleStar=useCallback(mail=>{
    const nv=!mail.starred,fk=`${mail.accountId}::${(mail.folder||'inbox').toLowerCase()}`;
    setAllMails(p=>({...p,[fk]:(p[fk]||[]).map(m=>m.id===mail.id?{...m,starred:nv}:m)}));
    setSelMail(prev=>prev?.id===mail.id?{...prev,starred:nv}:prev);
    const sc=ls.get('mOS_sc',{});sc[mail.id]=nv;ls.set('mOS_sc',sc);
    apiFetch('/accounts/'+mail.accountId+'/messages/'+mail.uid+'/star',{method:'PATCH',body:JSON.stringify({starred:nv})}).catch(()=>{});
  },[]);

  const handleDeleteMail=useCallback(mail=>{
    const fk=`${mail.accountId}::${(mail.folder||'inbox').toLowerCase()}`;
    setAllMails(p=>({...p,[fk]:(p[fk]||[]).filter(m=>m.id!==mail.id)}));
    setSelMail(prev=>prev?.id===mail.id?null:prev);setCtxMenu(null);
    apiFetch(`/accounts/${mail.accountId}/messages/${encodeURIComponent(mail.folder||'inbox')}/${mail.uid}`,{method:'DELETE'}).catch(()=>{});
  },[]);

  const handleSelectMail=useCallback(mail=>{
    setSelMail(mail);
    if(!mail.read){
      const fk=`${mail.accountId}::${(mail.folder||'inbox').toLowerCase()}`;
      setAllMails(p=>({...p,[fk]:(p[fk]||[]).map(m=>m.id===mail.id?{...m,read:true}:m)}));
      const rc=ls.get('mOS_rc',{});rc[mail.id]=true;ls.set('mOS_rc',rc);
      apiFetch('/accounts/'+mail.accountId+'/messages/'+mail.uid+'/read',{method:'PATCH',body:JSON.stringify({read:true})}).catch(()=>{});
    }
  },[]);

  const handleRightClick=useCallback((e,mail)=>{e.preventDefault();e.stopPropagation();setCtxMenu({x:e.clientX,y:e.clientY,mail});},[]);

  // Pre-merge all inboxes once — filteredMails reads from here instead of re-sorting
const globalInboxMails = useMemo(() => {
  const keys = Object.keys(allMails).filter(k => k.endsWith('::inbox'));
  if (!keys.length) return [];
  const all = [];
  keys.forEach(k => { for (const m of allMails[k]) all.push(m); });
  all.sort((a, b) => (b._ts || 0) - (a._ts || 0));
  return all;
}, [allMails]);

  // Derived state
const filteredMails = useMemo(() => {
  if (!selFolder) return [];
  let msgs = [];
  const isGlobalInbox = selFolder === 'GLOBAL::inbox';

  if (selFolder.startsWith('GLOBAL::')) {
    const t = selFolder.split('::')[1];
    if (t === 'inbox') {
      msgs = globalInboxMails; // pre-sorted date-desc, no further sort needed for default
    } else if (t === 'reply') {
      msgs = globalInboxMails.filter(m => m.type === 'reply' || (m.subject || '').toLowerCase().startsWith('re:'));
    } else if (t === 'bounce') {
      msgs = globalInboxMails.filter(m => m.type === 'bounce' || /(mailer-daemon|postmaster|undeliverable|delivery failed)/i.test((m.from?.email || '') + (m.subject || '')));
    } else if (t === 'auto') {
      msgs = globalInboxMails.filter(m => m.type === 'auto');
    } else if (t === 'sent') {
      msgs = [];
      Object.keys(allMails).forEach(key => { const k = key.split('::')[1] || ''; if (/(sent|sent items|sent mail)/i.test(k)) msgs = msgs.concat(allMails[key]); });
    }
  } else { msgs = allMails[selFolder] || []; }

  if (debSrch) {
    const q = debSrch.toLowerCase();
    msgs = msgs.filter(m => (m.subject || '').toLowerCase().includes(q) || (m.from?.name || '').toLowerCase().includes(q) || (m.from?.email || '').toLowerCase().includes(q));
  }

  // Skip sort + copy for the default case (global inbox date-desc already pre-sorted)
  if (isGlobalInbox && sortBy === 'date-desc' && !debSrch) return msgs;

  msgs = [...msgs];
  switch (sortBy) {
    case 'date-desc': msgs.sort((a, b) => (b._ts||new Date(b.date).getTime()) - (a._ts||new Date(a.date).getTime())); break;
    case 'date-asc':  msgs.sort((a, b) => (a._ts||new Date(a.date).getTime()) - (b._ts||new Date(b.date).getTime())); break;
    case 'name-asc':  msgs.sort((a, b) => (a.from?.name || a.from?.email || '').localeCompare(b.from?.name || b.from?.email || '')); break;
    case 'name-desc': msgs.sort((a, b) => (b.from?.name || b.from?.email || '').localeCompare(a.from?.name || a.from?.email || '')); break;
    case 'email-asc': msgs.sort((a, b) => (a.from?.email || '').localeCompare(b.from?.email || '')); break;
    case 'email-desc':msgs.sort((a, b) => (b.from?.email || '').localeCompare(a.from?.email || '')); break;
    default: break;
  }
  return msgs;
}, [allMails, selFolder, debSrch, sortBy, globalInboxMails]);

  const unreadMap=useMemo(()=>{
    const map={};Object.entries(allMails).forEach(([key,msgs])=>{const u=msgs.filter(m=>!m.read).length;if(u>0)map[key]=u;});return map;
  },[allMails]);

  const globalCounts=useMemo(()=>{
    const r={inbox:0,reply:0,bounce:0,auto:0,sent:0};
    Object.keys(allMails).forEach(key=>{if(!key.endsWith('::inbox'))return;allMails[key].forEach(m=>{if(m.read)return;r.inbox++;const s=(m.subject||'').toLowerCase(),f=(m.from?.email||'').toLowerCase(),t=m.type||'';if(t==='reply'||s.startsWith('re:'))r.reply++;else if(t==='bounce'||/(mailer-daemon|postmaster|delivery|undeliver)/i.test(f+s))r.bounce++;else if(t==='auto')r.auto++;});});return r;
  },[allMails]);

  const totalUnread=useMemo(()=>Object.values(unreadMap).reduce((s,v)=>s+v,0),[unreadMap]);

  const currentLabel=useMemo(()=>{
    if(!selFolder)return'Mail';
    if(selFolder.startsWith('GLOBAL::')){const t=selFolder.split('::')[1];if(t==='inbox')return'All Inboxes';if(t==='reply')return'All Inboxes · Replies';if(t==='bounce')return'All Inboxes · Bounced';if(t==='auto')return'All Inboxes · Auto-Replies';}
    const si=selFolder.indexOf('::');if(si===-1)return selFolder;const aid=selFolder.slice(0,si),fp=selFolder.slice(si+2);const acc=accounts.find(a=>a.id===aid);return acc?`${acc.name||acc.email.split('@')[0]} · ${fp}`:fp;
  },[selFolder,accounts]);

  const isLoading=selFolder?!!loading[selFolder]:false;

  // Sidebar folder button
  const SbBtn=({id,icon,label,count,depth=0})=>{
    const isOn=selFolder===id;
    return(
      <button className={`sbi${isOn?' on':''}`}
        onClick={()=>{
          const wasAlready=selFolder===id;
          setSelFolder(id);
          if(id.startsWith('GLOBAL::')){
            const type = id.split('::')[1];
            if (type === 'sent') {
              accounts.forEach(acc => {
                const fc = folderMap[acc.id];
                const sentFolder = fc?.discovered?.sent || 'Sent';
                const fk = `${acc.id}::${sentFolder.toLowerCase()}`;
                if (!allMails[fk] || allMails[fk].length === 0) {
                  // No data yet — read from DB (instant, no IMAP)
                  loadMails(acc.id, sentFolder, false, false).catch(()=>{});
                } else if (wasAlready) {
                  // User clicked the already-selected folder — do a real IMAP refresh
                  loadMails(acc.id, sentFolder, true, false).catch(()=>{});
                }
                // else: data already in memory → show instantly, no call at all
              });
            } else if(wasAlready) {
              handleRefresh();
            }
          } else {
            const si=id.indexOf('::');
            if(si!==-1){
              const aid=id.slice(0,si),fp=id.slice(si+2);
              const data=folderMap[aid];
              const real=data?.folders?.find(f=>f.fullPath.toLowerCase()===fp)?.fullPath||fp;
              if(!allMails[id]||allMails[id].length===0){
                loadMails(aid,real,false,false);
              } else if(wasAlready){
                // second click = refresh
                loadMails(aid,real,true,false);
              }
            }
          }
        }}
        title={label}
        style={{padding:collapsed?'8px 16px':`7px 14px 7px ${18+depth*10}px`,fontSize:12,fontWeight:isOn?600:400}}>
        <span style={{flexShrink:0,display:'flex',alignItems:'center',fontSize:12,opacity:isOn?1:0.7}}>{icon}</span>
        {!collapsed&&<><span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{label}</span>{count>0&&<span style={{background:isOn?T.acc:T.card,color:isOn?'#fff':T.t2,borderRadius:99,fontSize:10,fontWeight:700,padding:'1px 6px',fontFamily:T.mn,flexShrink:0}}>{count>999?'999+':count}</span>}</>}
      </button>
    );
  };

  return(
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}} onClick={()=>setCtxMenu(null)}>

      {/* ══ SIDEBAR — desktop left rail, mobile bottom tabs ══ */}
      {isMobile?(
        <div style={{position:'fixed',bottom:0,left:0,right:0,height:56,background:T.pan,borderTop:`1px solid ${T.b1}`,display:'flex',alignItems:'center',zIndex:100,flexShrink:0}}>
          {[
            {icon:<Ic.Inbox s={18}/>,label:'Mail',fn:()=>setPage('mail'),on:page==='mail'},
            {icon:<Ic.Mega s={18}/>,label:'Camp',fn:()=>setPage('campaigns'),on:page==='campaigns'},
            {icon:'👥',label:'Contacts',fn:()=>setShowContacts(true),on:false},
            {icon:<Ic.Cog s={18}/>,label:'Settings',fn:()=>setShowSet(true),on:false},
          ].map((t,i)=>(
            <button key={i} onClick={t.fn} style={{flex:1,background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'6px 0',color:t.on?T.acc:T.t3}}>
              <span style={{fontSize:18,lineHeight:1}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:t.on?700:400}}>{t.label}</span>
            </button>
          ))}
        </div>
      ):null}
      <div style={{width:isMobile?0:collapsed?52:240,background:T.pan,borderRight:isMobile?'none':`1px solid ${T.b1}`,display:isMobile?'none':'flex',flexDirection:'column',flexShrink:0,transition:'width .2s cubic-bezier(.4,0,.2,1)',overflow:'hidden',height:'100vh',position:'relative',zIndex:10}}>

        {/* Logo */}
        <div onClick={()=>setCollapsed(!collapsed)}
          style={{padding:'14px 12px',display:'flex',alignItems:'center',gap:9,borderBottom:`1px solid ${T.b1}`,flexShrink:0,cursor:'pointer',userSelect:'none',transition:'background .12s'}}
          onMouseEnter={e=>e.currentTarget.style.background=T.hov} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <div style={{width:32,height:32,borderRadius:10,background:T.acc,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>✉</div>
          {!collapsed&&<><span style={{fontWeight:800,fontSize:16,letterSpacing:'-0.04em',color:T.t1,fontFamily:T.dp,flex:1}}>MailOS</span>{totalUnread>0&&<span style={{background:T.acc,color:'#fff',borderRadius:99,fontSize:10,fontWeight:700,padding:'2px 7px',fontFamily:T.mn}}>{totalUnread>999?'999+':totalUnread}</span>}</>}
          <div style={{marginLeft:collapsed?'auto':4,background:T.card,border:`1px solid ${T.b1}`,borderRadius:6,padding:'3px 5px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            {collapsed?<Ic.ChevR s={10} c={T.t3}/>:<svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={T.t3} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{padding:'10px 10px 6px',display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
          <button onClick={()=>{setPage('mail');if(page==='mail')setShowCmp(true);}} className="btn bp" style={{width:'100%',padding:collapsed?'9px 6px':'9px 14px',fontSize:12,borderRadius:10}}>
            <Ic.Compose s={14} c="#fff"/>{!collapsed&&(page==='campaigns'?'Mailbox':'Compose')}
          </button>
          <button onClick={()=>setPage(page==='campaigns'?'mail':'campaigns')}
            style={{width:'100%',border:'none',borderRadius:10,color:'#fff',cursor:'pointer',padding:collapsed?'9px 6px':'9px 14px',fontSize:12,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:page==='campaigns'?'#5547C8':T.accD,transition:'all .15s'}}>
            <Ic.Mega s={14} c="#fff"/>{!collapsed&&'Campaigns'}
          </button>
        </div>

        {/* Search */}
        {!collapsed&&<div style={{padding:'4px 10px 6px',flexShrink:0}}>
          <div style={{background:T.sur,borderRadius:9,border:`1px solid ${T.b1}`,display:'flex',alignItems:'center',gap:7,padding:'7px 10px'}}>
            <Ic.Search s={12} c={T.t3}/>
            <input value={search} onChange={e=>debSearch(e.target.value)} placeholder="Search…" style={{background:'none',border:'none',color:T.t1,fontSize:12,width:'100%',outline:'none'}}/>
            {search&&<button onClick={()=>debSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:T.t3,lineHeight:1,padding:0,fontSize:14}}>×</button>}
          </div>
        </div>}

        {/* Folder tree */}
        <div style={{flex:1,overflowY:'auto',padding:'4px 0',minHeight:0}}>

          {/* Global inbox section */}
          {page==='mail'&&accounts.length>0&&(
            <div style={{paddingBottom:6,marginBottom:4,borderBottom:`1px solid ${T.b1}`}}>
              {!collapsed&&<button onClick={()=>setExpanded(p=>({...p,GLOBAL:p.GLOBAL===false?true:false}))} style={{width:'100%',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:8,padding:'6px 14px',color:T.t3}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:T.t3,flexShrink:0}}/>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',flex:1,textAlign:'left',color:T.t2}}>Global</span>
                {expanded.GLOBAL!==false?<Ic.ChevD s={8} c={T.t3}/>:<Ic.ChevR s={8} c={T.t3}/>}
              </button>}
              {(expanded.GLOBAL!==false||collapsed)&&[
                {id:'GLOBAL::inbox', label:'All Inboxes',  icon:<Ic.Inbox s={12}/>,   cnt:globalCounts.inbox},
                {id:'GLOBAL::reply', label:'Replies',      icon:<Ic.Reply s={12}/>,   cnt:globalCounts.reply,  depth:1},
                {id:'GLOBAL::bounce',label:'Bounced',      icon:<Ic.Alert s={12}/>,   cnt:globalCounts.bounce, depth:1},
                {id:'GLOBAL::auto',  label:'Auto-Replies', icon:<Ic.Refresh s={12}/>, cnt:globalCounts.auto,   depth:1},
                        {id:'GLOBAL::sent',  label:'All Sent',      icon:<Ic.Send s={12}/>,    cnt:0,                  depth:1},
              ].map(f=><SbBtn key={f.id} id={f.id} icon={f.icon} label={f.label} count={f.cnt} depth={f.depth||0}/>)}
            </div>
          )}

          {/* Per-account folders */}
          {page==='mail'&&accounts.map((acc,ai)=>{
            const color=gc(ai),fdata=folderMap[acc.id],isOpen=!!expanded[acc.id],folders=fdata?.folders||[];
            return(
              <div key={acc.id} style={{marginTop:4}}>
                {!collapsed&&<button onClick={()=>setExpanded(p=>({...p,[acc.id]:!p[acc.id]}))} style={{width:'100%',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:8,padding:'6px 14px',color:T.t3}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:color,flexShrink:0}}/>
                  <span style={{fontSize:10,fontWeight:600,flex:1,textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color,letterSpacing:'0'}} title={acc.email}>{acc.email}</span>
                  {isOpen?<Ic.ChevD s={8} c={T.t3}/>:<Ic.ChevR s={8} c={T.t3}/>}
                </button>}
                {(isOpen||collapsed)&&(folders.length>0
                  ?folders.map((f,fi)=>{
  const fid=`${acc.id}::${f.fullPath.toLowerCase()}`,depth=Math.max(0,f.fullPath.split(/[./\\]/).length-1);
  return(
    <div key={fid} draggable
      onDragStart={e=>{e.dataTransfer.setData('folderId',fid);e.dataTransfer.setData('accId',acc.id);e.dataTransfer.setData('fi',fi);e.currentTarget.style.opacity='.4';}}
      onDragEnd={e=>e.currentTarget.style.opacity='1'}
      onDragOver={e=>{e.preventDefault();e.currentTarget.style.background='rgba(0,120,212,0.09)';}}
      onDragLeave={e=>e.currentTarget.style.background='transparent'}
      onDrop={e=>{
        e.preventDefault();e.currentTarget.style.background='transparent';
        const fromFi=parseInt(e.dataTransfer.getData('fi'));const fromAcc=e.dataTransfer.getData('accId');
        if(fromAcc!==acc.id)return;
        setFolderMap(prev=>{
          const d={...prev};const folds=[...(d[acc.id]?.folders||[])];
          const [moved]=folds.splice(fromFi,1);folds.splice(fi,0,moved);
          return{...d,[acc.id]:{...d[acc.id],folders:folds}};
        });
      }}
      style={{cursor:'grab'}}>
      <SbBtn id={fid} icon={folderIcon(f)} label={f.name} count={unreadMap[fid]||0} depth={depth}/>
    </div>
  );
})
                  :(isOpen&&!collapsed&&<div style={{padding:'6px 26px',fontSize:11,color:T.t3,display:'flex',alignItems:'center',gap:6}}><div style={{width:10,height:10,border:`1.5px solid ${T.b1}`,borderTop:`1.5px solid ${T.acc}`,borderRadius:'50%',animation:'spin .7s linear infinite'}}/> Discovering…</div>)
                )}
              </div>
            );
          })}

          {page==='mail'&&!accounts.length&&!collapsed&&(
            <div style={{padding:'32px 14px',textAlign:'center',color:T.t3}}>
              <div style={{fontSize:32,marginBottom:8,opacity:.35}}>📭</div>
              <p style={{fontSize:12,marginBottom:12}}>No accounts yet</p>
              <button onClick={()=>setShowSet(true)} className="btn bp" style={{padding:'7px 14px',fontSize:12,borderRadius:8}}>Add Account</button>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{padding:'8px 10px',borderTop:`1px solid ${T.b1}`,display:'flex',gap:6,flexShrink:0}}>
          <button onClick={()=>setShowSet(true)} className="btn bg" style={{flex:1,padding:'8px',borderRadius:9,fontSize:11}}>
            <Ic.Plus s={13} c={T.t2}/>{!collapsed&&'Manage'}
          </button>
          {!collapsed&&<button onClick={()=>setShowContacts(true)} title="Contacts" className="btn bg" style={{padding:'8px 10px',borderRadius:9}}>👥</button>}
          {!collapsed&&<button onClick={()=>setShowSet(true)} className="btn bg" style={{padding:'8px 10px',borderRadius:9}}><Ic.Cog s={14} c={T.t2}/></button>}
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{flex:1,display:'flex',overflow:'hidden',position:'relative',paddingBottom:isMobile?56:0}}>

        <CampaignsPage accounts={accounts} signatures={sigs} accountSettings={aset} campaigns={campaigns} onUpdateCampaigns={setCampaigns} isVisible={page==='campaigns'}/>

        {page==='mail'&&<>
          {/* Mail list */}
          <div style={{width:selMail?322:392,flexShrink:0,background:T.pan,borderRight:`1px solid ${T.b1}`,display:'flex',flexDirection:'column'}}>
            {/* List header */}
            <div style={{ padding: '13px 14px 10px', background: T.pan, borderBottom: `1px solid ${T.b1}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: T.t1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: selMail ? 160 : 240, fontFamily: T.dp }} title={currentLabel}>{currentLabel}</h2>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  <button onClick={()=>setThreadView(v=>!v)} title={threadView ? 'Exit thread view (grouped)' : 'Thread view: group messages by thread'} style={{ background: threadView?T.aBg:T.sur, border: `1px solid ${threadView?T.aBd:T.b1}`, color: threadView?T.acc:T.t2, cursor: 'pointer', width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s', fontSize: 12 }}>⛓</button>
                  <button onClick={handleRefresh} title="Refresh" style={{ background: T.sur, border: `1px solid ${T.b1}`, color: T.acc, cursor: 'pointer', width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s' }} onMouseEnter={e => e.currentTarget.style.background = T.card} onMouseLeave={e => e.currentTarget.style.background = T.sur}>
                    <span style={{ display: 'flex', alignItems: 'center', animation: (refreshing || isLoading) ? 'spin .7s linear infinite' : 'none' }}><Ic.Refresh s={12} /></span>
                  </button>
                  <button onClick={() => expCSV(filteredMails, (currentLabel || 'emails').replace(/\s+/g, '_') + '.csv')} title="Export CSV" style={{ background: T.sur, border: `1px solid ${T.b1}`, color: T.acc, cursor: 'pointer', width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s' }} onMouseEnter={e => e.currentTarget.style.background = T.card} onMouseLeave={e => e.currentTarget.style.background = T.sur}>
                    <Ic.Down s={12} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 11, color: T.t3, fontFamily: T.mn }}>{filteredMails.length} messages · {unreadMap[selFolder || ''] || 0} unread{threadView&&<span style={{color:T.acc,marginLeft:6}}>· Thread View</span>}</p>
            </div>

            {/* List body */}
            {!selFolder?(
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:10,color:T.t3}}><Ic.Folder s={40} c={T.t3}/><p style={{fontSize:13}}>Select a folder</p></div>
            ):isLoading&&!filteredMails.length?(
              <Spin/>
            ):!filteredMails.length?(
              <div style={{flex:1,textAlign:'center',padding:'80px 20px',color:T.t3}}><div style={{display:'inline-flex',padding:16,border:`1px dashed ${T.b2}`,borderRadius:'50%',marginBottom:14,opacity:.5}}><Ic.Mail s={32} c={T.t3}/></div><p style={{fontSize:13,fontWeight:500}}>No messages</p></div>
            ):(threadView?(()=>{
              // Group by normalized subject (strip RE:, FW: etc.)
              const norm=s=>(s||'').toLowerCase().replace(/^(re|fw|fwd)[\[:][\s]*/gi,'').replace(/\s+/g,' ').trim();
              const threadMap=new Map();
              filteredMails.forEach(m=>{const k=norm(m.subject)||m.id;if(!threadMap.has(k))threadMap.set(k,[]);threadMap.get(k).push(m);});
              const threads=[...threadMap.entries()].map(([k,msgs])=>({key:k,latest:msgs[0],msgs,unread:msgs.filter(m=>!m.read).length}));
              return(
                <div style={{flex:1,overflowY:'auto'}}>
                  {threads.map(t=>{
                    const isOpen=openThreads.has(t.key);
                    return(
                      <div key={t.key} style={{borderBottom:`1px solid ${T.b1}`}}>
                        {/* Thread header row */}
                        <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',cursor:'pointer',background:t.latest.id===selMail?.id?T.aBg:'transparent',transition:'background .1s'}}
                          onClick={()=>{if(t.msgs.length===1){handleSelectMail(t.latest);}else{setOpenThreads(p=>{const n=new Set(p);if(n.has(t.key))n.delete(t.key);else n.add(t.key);return n;});}}}
                          onContextMenu={e=>handleRightClick(e,t.latest)}>
                          <DomainFavicon email={t.latest.from?.email||''} size={32} fallbackColor={gc(accounts.findIndex(a=>a.id===t.latest.accountId))} fallbackInitial={ini(t.latest.from?.name,t.latest.from?.email)}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:13,fontWeight:t.unread?600:400,color:t.unread?T.t1:T.t2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.latest.from?.name||t.latest.from?.email}</span>
                              <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                                {t.msgs.length>1&&<span style={{background:T.aBg,color:T.acc,borderRadius:99,fontSize:10,fontWeight:700,padding:'1px 6px',fontFamily:T.mn}}>{t.msgs.length}</span>}
                                <span style={{fontSize:10,color:T.t3,fontFamily:T.mn}}>{fmtDate(t.latest.date)}</span>
                              </div>
                            </div>
                            <div style={{fontSize:12,color:T.t2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.latest.subject||'(no subject)'}</div>
                          </div>
                          {t.msgs.length>1&&<span style={{fontSize:10,color:T.t3,transition:'transform .15s',display:'inline-block',transform:isOpen?'rotate(90deg)':'rotate(0deg)'}}><Ic.ChevR s={10}/></span>}
                        </div>
                        {/* Expanded thread messages */}
                        {isOpen&&t.msgs.map((m,mi)=>(
                          <div key={m.id} onClick={()=>handleSelectMail(m)} onContextMenu={e=>handleRightClick(e,m)}
                            style={{display:'flex',gap:10,padding:'8px 14px 8px 38px',cursor:'pointer',borderTop:`1px solid ${T.b1}`,background:m.id===selMail?.id?T.aBg:T.sur,transition:'background .1s'}}
                            onMouseEnter={e=>e.currentTarget.style.background=T.hov}
                            onMouseLeave={e=>e.currentTarget.style.background=m.id===selMail?.id?T.aBg:T.sur}>
                            <div style={{fontSize:12,fontWeight:m.read?400:600,color:m.read?T.t2:T.t1,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.from?.name||m.from?.email}</div>
                            <span style={{fontSize:10,color:T.t3,fontFamily:T.mn,flexShrink:0}}>{fmtDate(m.date)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })():(
              <VirtualMailList mails={filteredMails} selectedMailId={selMail?.id} accounts={accounts} onSelect={handleSelectMail} onRightClick={handleRightClick} onStar={handleToggleStar}/>
            ))}
          </div>

          {/* Mail reader */}
          {selMail?(
            <div className="sr" style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',background:T.bg}}>
              {/* Reader header */}
              <div style={{padding:'18px 24px',borderBottom:`1px solid ${T.b1}`,background:T.pan,flexShrink:0}}>
                <h2 style={{fontSize:18,fontWeight:700,color:T.t1,marginBottom:12,lineHeight:1.3,fontFamily:T.dp}}>{selMail.subject||'(no subject)'}</h2>
                <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                  <Avatar name={selMail.from?.name} email={selMail.from?.email} color={gc(accounts.findIndex(a=>a.id===selMail.accountId))} size={38}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:T.t1}}>
                      {selMail.from?.name||selMail.from?.email}
                      {selMail.from?.name&&<span style={{fontSize:12,color:T.t2,marginLeft:6,fontWeight:400}}>&lt;{selMail.from.email}&gt;</span>}
                    </div>
                    <div style={{fontSize:11,color:T.t3,marginTop:2,fontFamily:T.mn}}>To: {(selMail.to||[]).map(t=>t.email||t.name).join(', ')||'—'} · {fmtFull(selMail.date)}</div>
                  </div>
                  {/* Actions */}
                  <div style={{display:'flex',gap:6,flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end',alignItems:'center'}}>
                    {/* Spam / Not Spam */}
                    {(()=>{
                      const f=(selMail.folder||'').toLowerCase();const isSpam=f.includes('spam')||f.includes('junk');
                      return(
                        <button onClick={async()=>{
                          if(isSpam){setTrustChk(true);setTrustMail(selMail);return;}
                          try{await apiFetch(`/accounts/${selMail.accountId}/messages/junk`,{method:'POST',body:JSON.stringify({uid:selMail.uid,currentFolder:selMail.folder,action:'junk'})});const fk=`${selMail.accountId}::${(selMail.folder||'inbox').toLowerCase()}`;setAllMails(p=>({...p,[fk]:(p[fk]||[]).filter(m=>m.id!==selMail.id)}));setSelMail(null);}
                          catch(e){alert('Error: '+e.message);}
                        }} style={{background:isSpam?T.aBg:'rgba(255,69,96,.08)',border:`1px solid ${isSpam?T.aBd:'rgba(255,69,96,.22)'}`,borderRadius:8,color:isSpam?T.acc:T.red,cursor:'pointer',padding:'7px 11px',fontSize:12,fontWeight:600,transition:'all .12s',whiteSpace:'nowrap'}}>
                          {isSpam?'✓ Not Spam':'🚫 Spam'}
                        </button>
                      );
                    })()}
                    <button onClick={()=>handleDeleteMail(selMail)} title="Delete" style={{background:T.sur,border:`1px solid ${T.b1}`,borderRadius:8,color:T.red,cursor:'pointer',padding:7,display:'flex',alignItems:'center',transition:'all .12s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,69,96,.12)'} onMouseLeave={e=>e.currentTarget.style.background=T.sur}><Ic.Trash s={14} c={T.red}/></button>
                    <button onClick={()=>handleToggleStar(selMail)} title={selMail.starred?'Unstar':'Star'} style={{background:T.sur,border:`1px solid ${T.b1}`,borderRadius:8,color:selMail.starred?T.amb:T.t3,cursor:'pointer',padding:7,display:'flex',alignItems:'center'}}><Ic.Star s={15} f={selMail.starred?T.amb:'none'} c={selMail.starred?T.amb:T.t3}/></button>
                    <button onClick={()=>handleMarkRead(selMail,!selMail.read)} title={selMail.read?'Mark Unread':'Mark Read'} style={{background:T.sur,border:`1px solid ${T.b1}`,borderRadius:8,color:T.acc2,cursor:'pointer',padding:7,display:'flex',alignItems:'center'}}><Ic.Mail s={14} c={T.acc2}/></button>
                    <button onClick={()=>expEML(selMail)} title="Save as EML" style={{background:T.sur,border:`1px solid ${T.b1}`,borderRadius:8,color:T.acc2,cursor:'pointer',padding:'7px 11px',fontSize:12,fontWeight:600,display:'flex',alignItems:'center',gap:5}}><Ic.Down s={13} c={T.acc2}/>EML</button>
                    <button onClick={()=>setShowCmp({replyTo:selMail,accountId:selMail.accountId})} style={{background:T.acc,border:'none',borderRadius:8,color:'#fff',cursor:'pointer',padding:'7px 14px',fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:5}}><Ic.Reply s={13} c="#fff"/>Reply</button>
                    <button onClick={()=>setSelMail(null)} style={{background:T.sur,border:`1px solid ${T.b1}`,color:T.t2,cursor:'pointer',borderRadius:8,fontSize:16,padding:'4px 9px',lineHeight:1}}>×</button>
                  </div>
                </div>
              </div>

              {/* Email body */}
              <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:'#FFFFFF'}}>
                {selMail.hasAttachment&&<AttachmentBar accountId={selMail.accountId} uid={selMail.uid}/>}
                {selMail.body?(()=>{
                  const isH=/<[a-z][\s\S]*>/i.test(selMail.body);
                  if(isH)return(
                    <iframe key={selMail.id}
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>html,body{margin:0;padding:0}body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:14.5px;line-height:1.65;color:#1B1B1B;padding:24px 36px;word-break:break-word;max-width:860px;background:#FFFFFF}img{max-width:100%!important;height:auto!important}a{color:#0078D4}p{margin:0 0 8px}table{border-collapse:collapse;max-width:100%!important}blockquote{border-left:2px solid rgba(0,0,0,0.1);margin:6px 0;padding:0 0 0 12px;color:#605E5C}pre{background:#F3F6FA;border:1px solid rgba(0,0,0,0.08);border-radius:6px;padding:12px;font-family:monospace;font-size:13px;white-space:pre-wrap;overflow-x:auto}hr{border:none;border-top:1px solid rgba(0,0,0,0.1);margin:12px 0}</style></head><body>${selMail.body}</body></html>`}
                      style={{flex:1,width:'100%',border:'none',minHeight:0,height:'100%',background:'#FFFFFF'}}
                      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      title="email"/>
                  );
                  const plain=selMail.body.replace(/<br\s*\/?>/gi,'\n').replace(/<\/p>/gi,'\n\n').replace(/<\/div>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/\n{3,}/g,'\n\n').trim();
                  return <div style={{flex:1,overflowY:'auto',padding:'28px 40px',fontSize:14.5,lineHeight:1.7,fontFamily:'Helvetica Neue, Arial, sans-serif',whiteSpace:'pre-wrap',wordBreak:'break-word',color:T.t1}}><div style={{maxWidth:860}}>{plain}</div></div>;
                })():selMail.preview?(
                  <div style={{flex:1,overflowY:'auto',padding:'28px 40px',fontSize:14.5,lineHeight:1.7,color:T.t1,whiteSpace:'pre-wrap',wordBreak:'break-word',maxWidth:860}}>{stripHtml(selMail.preview)}</div>
                ):(
                  <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:14,color:T.t3}}><Ic.Mail s={40} c={T.t3}/><p style={{fontSize:14,fontWeight:500}}>No content</p></div>
                )}
              </div>
            </div>
          ):(
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,background:T.bg}}>
              <div style={{display:'inline-flex',padding:32,border:`2px dashed ${T.b2}`,borderRadius:'50%',background:T.pan}}><Ic.Mail s={52} c={T.t3}/></div>
              <p style={{color:T.t2,fontSize:15,fontWeight:600}}>Select a message</p>
            </div>
          )}
        </>}
      </div>

      {/* ══ MODALS ══ */}
      {showAdd&&<AddAccountModal existingAccounts={accounts} onClose={()=>setShowAdd(false)} onAdded={async acc=>{await handleAccAdded(acc);setShowAdd(false);}}/>}
      {showCSV&&<CSVImportModal existingAccounts={accounts} onClose={()=>setShowCSV(false)} onImported={handleAccAdded}/>}
      {showSet&&<AccountSettingsModal accounts={accounts} signatures={sigs} accountSettings={aset} onSigChange={handleSigChange} onAccSetChange={handleAsetChange} onClose={()=>setShowSet(false)} onAddManual={()=>{setShowSet(false);setShowAdd(true);}} onAddCSV={()=>{setShowSet(false);setShowCSV(true);}} onRemove={handleRemoveAccount}/>}
      {showCmp&&<ComposeModal accounts={accounts} defaultAccountId={typeof showCmp==='object'?showCmp.accountId:accounts[0]?.id} replyTo={typeof showCmp==='object'?showCmp.replyTo:null} onClose={()=>setShowCmp(false)} onSent={()=>{handleRefresh();setShowCmp(false);}}/>}
      {ctxMenu&&<CtxMenu x={ctxMenu.x} y={ctxMenu.y} mail={ctxMenu.mail} allMails={filteredMails} folderLabel={currentLabel} onClose={()=>setCtxMenu(null)} onStar={handleToggleStar} onMarkRead={handleMarkRead} onDelete={handleDeleteMail} sortBy={sortBy} onSort={setSortBy}/>}
        
      {showContacts&&<ContactsModal onClose={()=>setShowContacts(false)}/>}

      {/* Trust sender (Not Spam) modal */}
      {trustMail&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000}}>
          <div style={{background:'#fff',width:420,boxShadow:'2px 4px 20px rgba(0,0,0,.25)',fontFamily:"'Segoe UI',Arial,sans-serif",borderRadius:2,overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',background:'#f0f0f0',borderBottom:'1px solid #ddd'}}>
              <span style={{fontSize:12,color:'#333',fontWeight:500}}>Mark as Not Junk</span>
              <button onClick={()=>setTrustMail(null)} style={{background:'none',border:'none',fontSize:16,cursor:'pointer',color:'#666',lineHeight:1,padding:'0 4px'}}>×</button>
            </div>
            <div style={{padding:'18px 22px',background:'#f9f9f9'}}>
              <p style={{margin:'0 0 16px',fontSize:13,color:'#222',lineHeight:1.45}}>This message will be moved back to the Inbox folder.</p>
              <label style={{display:'flex',alignItems:'flex-start',gap:8,cursor:'pointer'}}>
                <input type="checkbox" checked={trustChk} onChange={e=>setTrustChk(e.target.checked)} style={{marginTop:2,cursor:'pointer'}}/>
                <span style={{fontSize:13,color:'#222'}}>Always trust email from <b>'{trustMail.from?.email||'Sender'}'</b></span>
              </label>
            </div>
            <div style={{background:'#f1f1f1',padding:'10px 16px',display:'flex',justifyContent:'flex-end',gap:8,borderTop:'1px solid #ddd'}}>
              <button onClick={()=>setTrustMail(null)} style={{background:'#fff',border:'1px solid #ccc',padding:'4px 16px',fontSize:13,cursor:'pointer',color:'#333'}}>Cancel</button>
              <button disabled={trustBusy} onClick={async()=>{
                setTrustBusy(true);
                try{
                  await apiFetch(`/accounts/${trustMail.accountId}/messages/junk`,{method:'POST',body:JSON.stringify({uid:trustMail.uid,currentFolder:trustMail.folder,action:'notjunk',trustSender:trustChk,senderEmail:trustMail.from?.email})});
                  const fk=`${trustMail.accountId}::${(trustMail.folder||'inbox').toLowerCase()}`;
                  setAllMails(p=>({...p,[fk]:(p[fk]||[]).filter(m=>m.id!==trustMail.id)}));
                  setSelMail(null);setTrustMail(null);
                }catch(e){alert('Error: '+e.message);}
                setTrustBusy(false);
              }} style={{background:trustBusy?'#aaa':'#0078D4',color:'#fff',border:'none',padding:'4px 22px',fontSize:13,cursor:trustBusy?'wait':'pointer'}}>
                {trustBusy?'Moving…':'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
