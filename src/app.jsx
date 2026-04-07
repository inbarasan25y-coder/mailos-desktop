/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";

const Ic = {
  Mail: ({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Compose: ({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Star: ({s=14,c="currentColor",fill="none"})=><svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Reply: ({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
  Plus: ({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Refresh: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Download: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Inbox: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  Send: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Alert: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Zap: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronRight: ({s=12,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Users: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Eye: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Upload: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  Pen: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Folder: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Trash: ({s=14,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
};

// ── API ──────────────────────────────────────────────────────────────────────
const API = "http://localhost:5001/api";

const apiFetch = async (url, opts = {}) => {
  // HARD STOP Network Stalling
  // Default 20s (prevents SMTP hanging), Custom overrides allowed for heavy IMAP fetches
  const timeoutMs = opts.timeout || 20000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const r = await fetch(API + url, { 
      headers: { "Content-Type": "application/json" }, 
      signal: controller.signal,
      ...opts 
    });
    clearTimeout(timeoutId);
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') throw new Error("Connection Timeout - Gateway unresponsive");
    throw e;
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  const date = new Date(d); const now = new Date();
  const days = Math.floor((now - date) / 86400000);
  if (days === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};
const formatDateFull = (d) => new Date(d).toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const stripPreview = (text) => {
  if (!text) return "";
  return text
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_~`]/g, "") // STRIPS MARKDOWN SYMBOLS!
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
};

const ACCOUNT_COLORS =["#1a73e8","#e8471a","#1ae86e","#e8c41a","#8b1ae8","#1ae8d4","#e81a8b","#4287f5","#f54242","#42f587"];
const getColor = (i) => ACCOUNT_COLORS[i % ACCOUNT_COLORS.length];
const initials = (name = "", email = "") => { if (name) return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); return (email[0] || "?").toUpperCase(); };

const parseSmtpError = (errorStr) => {
  const e = String(errorStr).trim();
  if (e.includes("5.4.5") || e.includes("Daily user sending limit")) return "Daily Sending Limit Exceeded";
  if (e.includes("Authentication failed") || e.includes("5.5.1")) return "Authentication Failed";
  if (e.includes("Please log in with your web browser") || e.includes("5.7.9")) return "Browser Login Required";
  if (e.includes("Invalid credentials")) return "Invalid Credentials";
  if (e.includes("SMTPRecipientsRefused") || e.includes("Bad email address") || e.includes("5.1.1")) return "Invalid Email Address";
  if (e.includes("SMTPServerDisconnected")) return "Server Disconnected";
  if (e.toLowerCase().includes("connection timed out")) return "Connection Timeout";
  if (e.toLowerCase().includes("rate limit")) return "Rate Limited";
  if (e.length > 80) return e.slice(0, 80) + "...";
  return e;
};
const shouldBlockSender = (errType) =>["Daily Sending Limit Exceeded","Browser Login Required","Authentication Failed","Invalid Credentials","Rate Limited"].includes(errType);

const exportToCSV = (mails, filename = "emails.csv") => {
  const headers =["Date","From Name","From Email","To","Subject","Type","Preview","Folder","Read","Starred"];
  const rows = mails.map(m =>[
    formatDateFull(m.date), (m.from&&m.from.name)||"", (m.from&&m.from.email)||"",
    (m.to||[]).map(t => t.email||t.name).join("; "), m.subject||"", m.type||"normal",
    (m.preview||"").replace(/"/g,'""'), m.folder||"", m.read?"Yes":"No", m.starred?"Yes":"No",
  ]);
  const csv = [headers,...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
};

const exportEmailAsEML = (mail) => {
  const fromName  = (mail.from&&mail.from.name)||""; const fromEmail = (mail.from&&mail.from.email)||"unknown@unknown.com";
  const toList    = (mail.to||[]).map(t => t.email||t.name).join(", ")||""; const subject   = mail.subject||"(no subject)";
  const date      = new Date(mail.date).toUTCString(); const body      = mail.body||mail.preview||""; const isHTML    = /<[a-z][\s\S]*>/i.test(body);
  let eml = "";
  if (isHTML) {
    const plain = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").trim();
    eml =[ `From: ${fromName} <${fromEmail}>`, `To: ${toList}`, `Subject: ${subject}`, `Date: ${date}`, `MIME-Version: 1.0`, `Content-Type: multipart/alternative; boundary="=_mailos_boundary"`, ``, `--=_mailos_boundary`, `Content-Type: text/plain; charset=UTF-8`, `Content-Transfer-Encoding: 8bit`, ``, plain, ``, `--=_mailos_boundary`, `Content-Type: text/html; charset=UTF-8`, `Content-Transfer-Encoding: 8bit`, ``, `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`, ``, `--=_mailos_boundary--` ].join("\r\n");
  } else {
    eml =[ `From: ${fromName} <${fromEmail}>`, `To: ${toList}`, `Subject: ${subject}`, `Date: ${date}`, `MIME-Version: 1.0`, `Content-Type: text/plain; charset=UTF-8`, ``, body ].join("\r\n");
  }
  const blob = new Blob([eml], { type: "message/rfc822" }); const url  = URL.createObjectURL(blob); const a    = document.createElement("a"); a.href = url; a.download = `${subject.slice(0,60).replace(/[^a-z0-9 _\-]/gi,"_")}.eml`; a.click(); URL.revokeObjectURL(url);
};

const exportFolderAsMBOX = (mails, folderName = "emails") => {
  const mbox = mails.map(mail => {
    const fromEmail = (mail.from&&mail.from.email)||"unknown@unknown.com"; const date      = new Date(mail.date).toUTCString(); const body      = mail.body||mail.preview||""; const isHTML    = /<[a-z][\s\S]*>/i.test(body);
    return[ `From ${fromEmail} ${date}`, `From: ${(mail.from&&mail.from.name)||""} <${fromEmail}>`, `To: ${(mail.to||[]).map(t => t.email||t.name).join(", ")}`, `Subject: ${mail.subject||"(no subject)"}`, `Date: ${date}`, `MIME-Version: 1.0`, `Content-Type: ${isHTML?"text/html":"text/plain"}; charset=UTF-8`, ``, body, `` ].join("\r\n");
  }).join("\r\n");
  const blob = new Blob([mbox], { type: "application/mbox" }); const url  = URL.createObjectURL(blob); const a    = document.createElement("a"); a.href = url; a.download = `${folderName}_${new Date().toISOString().slice(0,10)}.mbox`; a.click(); URL.revokeObjectURL(url);
};

const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers  = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z]/g,""));
  const nameIdx  = headers.findIndex(h => h.includes("name"));
  const emailIdx = headers.findIndex(h => h.includes("email")||h.includes("mail"));
  const passIdx  = headers.findIndex(h => h.includes("pass")||h.includes("password")||h.includes("apppassword"));
  if (emailIdx === -1 || passIdx === -1) return null;
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const cols =[]; let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; } else if (line[i] === "," && !inQ) { cols.push(cur.trim()); cur = ""; } else cur += line[i];
    }
    cols.push(cur.trim());
    return { name: nameIdx !== -1 ? cols[nameIdx]||"" : "", email: emailIdx !== -1 ? cols[emailIdx]||"" : "", password: passIdx !== -1 ? cols[passIdx]||"" : "" };
  }).filter(r => r.email && r.password);
};

const parseCampaignCSV = (text) => {
  const parseRow = (line) => {
    const cols =[]; let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; } else if (line[i] === "," && !inQ) { cols.push(cur.trim()); cur = ""; } else cur += line[i];
    }
    cols.push(cur.trim());
    return cols.map(c => c.replace(/^"|"$/g,"").trim());
  };
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  return { headers: parseRow(lines[0]), rows: lines.slice(1).map(parseRow) };
};

const FONT_SIZES =[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,24,26,28,30,32,36,40,44,48,52,56,60,64,72,80,88,96].map(px => ({ px, label: `${px}px` }));
const FONTS      =["Arial","Arial Black","Georgia","Helvetica","Times New Roman","Courier New","Verdana","Trebuchet MS","Impact","Tahoma","Palatino Linotype","Garamond","Comic Sans MS","Lucida Console","Lucida Sans Unicode"];
const SIG_FONTS  =["Arial","Georgia","Helvetica","Times New Roman","Verdana","Trebuchet MS","Courier New","Tahoma"];
const SIG_SIZES  =[8,9,10,11,12,13,14,15,16,18,20,22,24,28,32,36];

function rgbToHex(rgb) {
  if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return null;
  const m = rgb.match(/\d+/g); if (!m || m.length < 3) return rgb; return "#" + m.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,"0")).join("");
}

function getComputedFontSizePx(editorEl) {
  try {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return "";
    let node = sel.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentElement;
    while (node && node !== editorEl) {
      if (node.style && node.style.fontSize) return node.style.fontSize.replace("px","");
      if (node.tagName === "FONT" && node.style.fontSize) return node.style.fontSize.replace("px","");
      node = node.parentElement;
    }
    if (editorEl) {
      const computed = window.getComputedStyle(editorEl).fontSize;
      return computed ? Math.round(parseFloat(computed)) + "" : "";
    }
    return "";
  } catch(e) { return ""; }
}

// ── Micro Components ─────────────────────────────────────────────────────────
function FontDropdown({ fontName, saveSelection, restoreSelection, editorRef, updateFmt }) {
  const[open, setOpen] = useState(false); const [hovered, setHovered] = useState(null); const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpen(o => !o); }} style={{ height:28, border: fontName ? "1.5px solid rgba(0,0,0,0.4)" : "1.5px solid rgba(0,0,0,0.15)", borderRadius:7, fontSize:11, color: fontName ? "#111" : "#4B5563", background: fontName ? "#f1f3f4" : "#fff", padding:"0 8px", cursor:"pointer", width:148, fontWeight: fontName ? 600 : 400, display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, outline:"none" }}>
        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{fontName || "Font"}</span>
        <span style={{ fontSize:8, opacity:0.5, flexShrink:0 }}>▼</span>
      </button>
      {open && (
        <div style={{ position:"fixed", zIndex:99999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", maxHeight:240, overflowY:"auto", minWidth:148, marginTop:2 }}
          ref={el => { if (el && ref.current) { const r = ref.current.getBoundingClientRect(); el.style.top = (r.bottom + 2) + "px"; el.style.left = r.left + "px"; } }}>
          {FONTS.map(f => (
            <div key={f} onMouseDown={(e) => { e.preventDefault(); restoreSelection(); document.execCommand("fontName", false, f); editorRef.current && editorRef.current.focus(); saveSelection(); setTimeout(updateFmt, 0); setOpen(false); }} onMouseEnter={() => setHovered(f)} onMouseLeave={() => setHovered(null)} style={{ padding:"5px 12px", fontSize:12, cursor:"pointer", fontFamily:f, background: hovered===f ? "#f1f3f4" : fontName===f ? "#e8f0fe" : "transparent", color: fontName===f ? "#1a73e8" : "#202124", fontWeight: fontName===f ? 600 : 400 }}>{f}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SizeDropdown({ currentVal, saveSelection, applyFontSize }) {
  const[open, setOpen] = useState(false); const [hovered, setHovered] = useState(null); const ref = useRef(null); const rounded = currentVal ? Math.round(Number(currentVal)) : null;
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  },[open]);

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpen(o => !o); }} style={{ height:28, border: rounded ? "1.5px solid rgba(0,0,0,0.4)" : "1.5px solid rgba(0,0,0,0.15)", borderRadius:7, fontSize:11, color: rounded ? "#111" : "#4B5563", background: rounded ? "#f1f3f4" : "#fff", padding:"0 8px", cursor:"pointer", width:112, fontWeight: rounded ? 600 : 400, display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, outline:"none" }}>
        <span>{rounded ? `${rounded}px` : "Size (px)"}</span><span style={{ fontSize:8, opacity:0.5, flexShrink:0 }}>▼</span>
      </button>
      {open && (
        <div style={{ position:"fixed", zIndex:99999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", maxHeight:240, overflowY:"auto", minWidth:112, marginTop:2 }}
          ref={el => { if (el && ref.current) { const r = ref.current.getBoundingClientRect(); el.style.top = (r.bottom + 2) + "px"; el.style.left = r.left + "px"; } }}>
          {FONT_SIZES.map(({ px, label }) => (
            <div key={px} onMouseDown={(e) => { e.preventDefault(); applyFontSize(px); setOpen(false); }} onMouseEnter={() => setHovered(px)} onMouseLeave={() => setHovered(null)} style={{ padding:"5px 12px", fontSize:12, cursor:"pointer", background: hovered===px ? "#f1f3f4" : rounded===px ? "#e8f0fe" : "transparent", color: rounded===px ? "#1a73e8" : "#202124", fontWeight: rounded===px ? 600 : 400 }}>{label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function EditorContextMenu({ x, y, onClose, editorRef }) {
  const ref = useRef();
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [onClose]);
  const sel    = window.getSelection(); const hasSel = sel && sel.toString().trim().length > 0;
  const doCmd = (cmd, val = null) => { editorRef.current && editorRef.current.focus(); document.execCommand(cmd, false, val); onClose(); };
  const groups = [[{ label:"Cut", icon:"✂", shortcut:"Ctrl+X", action:()=>doCmd("cut"), disabled:!hasSel }, { label:"Copy", icon:"⎘", shortcut:"Ctrl+C", action:()=>doCmd("copy"), disabled:!hasSel }, { label:"Paste", icon:"📋",shortcut:"Ctrl+V", action: async ()=>{ try { const t = await navigator.clipboard.readText(); editorRef.current&&editorRef.current.focus(); document.execCommand("insertText",false,t); } catch(e){ document.execCommand("paste"); } onClose(); } }, { label:"Select All", icon:"⬚", shortcut:"Ctrl+A", action:()=>doCmd("selectAll") }],[{ label:"Bold", icon:"B", shortcut:"Ctrl+B", action:()=>doCmd("bold"), disabled:!hasSel, bold:true }, { label:"Italic", icon:"I", shortcut:"Ctrl+I", action:()=>doCmd("italic"), disabled:!hasSel, italic:true }, { label:"Underline", icon:"U", shortcut:"Ctrl+U", action:()=>doCmd("underline"), disabled:!hasSel, ul:true }, { label:"Strikethrough", icon:"S", shortcut:"", action:()=>doCmd("strikeThrough"),disabled:!hasSel, strike:true }],[{ label:"Undo", icon:"↩", shortcut:"Ctrl+Z", action:()=>doCmd("undo") }, { label:"Redo", icon:"↪", shortcut:"Ctrl+Y", action:()=>doCmd("redo") }],[{ label:"Remove Formatting", icon:"✕", shortcut:"", action:()=>doCmd("removeFormat"), disabled:!hasSel }, { label:"Insert Link", icon:"🔗",shortcut:"", action:()=>{ const u=window.prompt("URL:","https://"); if(u){ editorRef.current&&editorRef.current.focus(); document.execCommand("createLink",false,u); } onClose(); } }, { label:"Insert Horizontal Line", icon:"─",shortcut:"", action:()=>{ editorRef.current&&editorRef.current.focus(); document.execCommand("insertHorizontalRule"); onClose(); } }]
  ];
  const vw = window.innerWidth, vh = window.innerHeight; const left = x + 265 > vw ? x - 265 : x; const top  = y + 330 > vh ? y - 330 : y;

  return (
    <div ref={ref} style={{ position:"fixed", left, top, zIndex:99999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.18)", minWidth:265, padding:"4px 0", animation:"ctxFadeIn 0.1s ease" }}>
      {groups.map((group, gi) => (
        <div key={gi}>{gi > 0 && <div style={{ height:1, background:"#f1f3f4", margin:"3px 0" }}/>}{group.map((item, i) => (
            <button key={i} onClick={item.disabled ? undefined : item.action} style={{ width:"100%", background:"none", border:"none", cursor:item.disabled?"default":"pointer", display:"flex", alignItems:"center", gap:10, padding:"7px 14px", fontSize:12, color:item.disabled?"#c0c0c0":"#202124", textAlign:"left", opacity:item.disabled?0.5:1 }} onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background="#f1f3f4"; }} onMouseLeave={e => { e.currentTarget.style.background="none"; }}>
              <span style={{ width:18, fontSize:13, fontWeight:item.bold?700:400, fontStyle:item.italic?"italic":"normal", textDecoration:item.ul?"underline":item.strike?"line-through":"none", flexShrink:0, textAlign:"center" }}>{item.icon}</span><span style={{ flex:1 }}>{item.label}</span>{item.shortcut && <span style={{ fontSize:10, color:"#9CA3AF" }}>{item.shortcut}</span>}
            </button>
        ))}</div>
      ))}
    </div>
  );
}

function TypeBadge({ type }) {
  const cfg = { reply:{ label:"RE", bg:"rgba(26,115,232,0.1)", color:"#1a73e8", border:"rgba(26,115,232,0.3)" }, auto:{ label:"AUTO", bg:"rgba(245,158,11,0.1)", color:"#D97706", border:"rgba(245,158,11,0.3)" }, bounce:{ label:"BOUNCE", bg:"rgba(239,68,68,0.1)", color:"#EF4444", border:"rgba(239,68,68,0.3)" }, normal:null };
  const c = cfg[type]; if (!c) return null;
  return <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.08em", padding:"2px 6px", borderRadius:"20px", background:c.bg, color:c.color, border:`1px solid ${c.border}`, flexShrink:0 }}>{c.label}</span>;
}

function Avatar({ name, email, color, size = 34 }) {
  return <div style={{ width:size, height:size, borderRadius:"50%", background:`${color}22`, border:`2px solid ${color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, color, flexShrink:0 }}>{initials(name, email)}</div>;
}

function Spinner() {
  return <div style={{ display:"flex", justifyContent:"center", padding:40 }}><div style={{ width:28, height:28, border:"2px solid rgba(0,0,0,0.15)", borderTop:"2px solid #1a73e8", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/></div>;
}

// ── Editors ──────────────────────────────────────────────────────────────────
function SignatureEditor({ value, onChange }) {
  const ref = useRef(null); const savedRange = useRef(null); const lastExternal = useRef(null);

  useEffect(() => { if (!ref.current) return; if (value !== lastExternal.current) { lastExternal.current = value; ref.current.innerHTML = value || ""; } }, [value]);
  const saveRange = () => { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { const r = sel.getRangeAt(0); if (ref.current && ref.current.contains(r.commonAncestorContainer)) savedRange.current = r.cloneRange(); } };
  const restoreRange = () => { ref.current && ref.current.focus(); const sel = window.getSelection(); if (savedRange.current && sel) { try { sel.removeAllRanges(); sel.addRange(savedRange.current); } catch(e){} } };
  const emit = () => { const html = ref.current ? ref.current.innerHTML : ""; lastExternal.current = html; onChange(html); };
  const execCmd = (cmd, val = null) => { restoreRange(); document.execCommand(cmd, false, val); ref.current && ref.current.focus(); emit(); };
  const FmtBtn = ({ cmd, title, children }) => ( <button title={title} onMouseDown={(e) => { e.preventDefault(); saveRange(); execCmd(cmd); }} style={{ background:"none", border:"1px solid transparent", borderRadius:6, cursor:"pointer", padding:"3px 7px", fontSize:12, color:"#202124", lineHeight:1 }} onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.background="none"}>{children}</button> );

  return (
    <div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}>
      <div style={{ padding:"4px 8px", borderBottom:"1px solid #e0e0e0", display:"flex", flexWrap:"wrap", gap:2, alignItems:"center", background:"#f8f9fa" }}>
        <select onMouseDown={saveRange} onChange={e => { const v = e.target.value; if (!v) return; restoreRange(); document.execCommand("fontName",false,v); ref.current&&ref.current.focus(); emit(); e.target.value=""; }} style={{ height:24, border:"1px solid #e0e0e0", borderRadius:6, fontSize:11, background:"#fff", padding:"0 5px", cursor:"pointer", width:110 }}><option value="">Font</option>{SIG_FONTS.map(f => <option key={f} value={f} style={{ fontFamily:f }}>{f}</option>)}</select>
        <select onMouseDown={saveRange} onChange={e => { const px = e.target.value; if (!px) return; restoreRange(); document.execCommand("styleWithCSS", false, false); const el = ref.current; if (el) { Array.from(el.querySelectorAll("font")).forEach(f => { if(f.getAttribute("size") === "7") f.dataset.k = "1"; }); document.execCommand("fontSize", false, 7); let changed = false; Array.from(el.querySelectorAll("font[size='7']:not([data-k='1'])")).forEach(n => { n.removeAttribute("size"); n.style.fontSize = `${px}px`; changed = true; }); Array.from(el.querySelectorAll("span")).forEach(n => { if ((n.style.fontSize.includes("xxx-large") || n.style.fontSize.includes("48px")) && n.dataset.k !== "1") { n.style.fontSize = `${px}px`; changed = true; } }); if (!changed) { document.execCommand("styleWithCSS", false, true); const hk = "HOOK_" + Date.now(); document.execCommand("fontName", false, hk); Array.from(el.querySelectorAll(`font[face="${hk}"], span[style*="${hk}"]`)).forEach(n => { n.removeAttribute("face"); n.style.fontFamily = ""; n.style.fontSize = `${px}px`; }); } Array.from(el.querySelectorAll("[data-k]")).forEach(f => f.removeAttribute("data-k")); el.focus(); } emit(); e.target.value=""; }} style={{ height:24, border:"1px solid #e0e0e0", borderRadius:6, fontSize:11, background:"#fff", padding:"0 5px", cursor:"pointer", width:74 }}><option value="">Size</option>{SIG_SIZES.map(px => <option key={px} value={px}>{px}px</option>)}</select>
        <FmtBtn cmd="bold" title="Bold"><b>B</b></FmtBtn> <FmtBtn cmd="italic" title="Italic"><i>I</i></FmtBtn> <FmtBtn cmd="underline" title="Underline"><u>U</u></FmtBtn>
        <label onMouseDown={saveRange} style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer", padding:"2px 4px", borderRadius:6 }} onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.08)"} onMouseLeave={e => e.currentTarget.style.background="none"}><span style={{ fontSize:12, fontWeight:700 }}>A</span><input type="color" defaultValue="#000000" onChange={e => { restoreRange(); document.execCommand("foreColor",false,e.target.value); ref.current&&ref.current.focus(); emit(); }} style={{ width:16, height:16, border:"1px solid #e0e0e0", borderRadius:3, padding:0, cursor:"pointer" }}/></label>
        <FmtBtn cmd="removeFormat" title="Clear">✕</FmtBtn>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning spellCheck dir="ltr" data-placeholder="e.g. Best regards, Your Name" onKeyUp={saveRange} onMouseUp={saveRange} onInput={() => { const html = ref.current ? ref.current.innerHTML : ""; lastExternal.current = html; onChange(html); }} style={{ minHeight:80, padding:"10px 14px", fontSize:14, lineHeight:1.8, color:"#202124", outline:"none", background:"#fafafa" }}/>
      <style>{`[data-placeholder]:empty:before{content:attr(data-placeholder);color:#b0bec5;pointer-events:none}`}</style>
    </div>
  );
}

function RichEditor({ editorRef, initialHTML, onChange }) {
  const[fmt, setFmt] = useState({ bold:false, italic:false, underline:false, strikeThrough:false, superscript:false, subscript:false, justifyLeft:false, justifyCenter:false, justifyRight:false, insertUnorderedList:false, insertOrderedList:false, fontName:"", fontSize:"", foreColor:"#000000" });
  const savedRange = useRef(null); const [ctxMenu, setCtxMenu] = useState(null);

  const updateFmt = useCallback(() => {
    const el = editorRef.current; if (!el) return;
    const sel = window.getSelection(); if (sel && sel.rangeCount > 0 && !el.contains(sel.anchorNode)) return;
    try {
      const get = (cmd) => { try { return document.queryCommandState(cmd); } catch(e){ return false; } };
      const val = (cmd) => { try { return document.queryCommandValue(cmd); } catch(e){ return ""; } };

      let detectedFont = "", detectedColor = "#000000";
      try { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { let node = sel.getRangeAt(0).commonAncestorContainer; if (node.nodeType === 3) node = node.parentElement; const el = editorRef.current; while (node && node !== el) { if (!detectedFont) { if (node.style && node.style.fontFamily) detectedFont = node.style.fontFamily.replace(/['"]/g,"").trim(); else if (node.tagName === "FONT" && node.face) detectedFont = node.face.replace(/['"]/g,"").trim(); } if (!detectedColor || detectedColor === "#000000") { if (node.style && node.style.color) { const c = rgbToHex(node.style.color); if (c) detectedColor = c; } } node = node.parentElement; } } } catch(e) {}

      const qFont  = val("fontName").replace(/['"]/g,"").trim(); const qColor = rgbToHex(val("foreColor"));
      setFmt({ bold:get("bold"), italic:get("italic"), underline:get("underline"), strikeThrough:get("strikeThrough"), superscript:get("superscript"), subscript:get("subscript"), justifyLeft:get("justifyLeft"), justifyCenter:get("justifyCenter"), justifyRight:get("justifyRight"), insertUnorderedList:get("insertUnorderedList"), insertOrderedList:get("insertOrderedList"), fontName: detectedFont || qFont || "", fontSize: getComputedFontSizePx(editorRef.current), foreColor: detectedColor !== "#000000" ? detectedColor : (qColor || "#000000") });
    } catch(e){}
  }, [editorRef]);

  useEffect(() => { document.addEventListener("selectionchange", updateFmt); return () => document.removeEventListener("selectionchange", updateFmt); }, [updateFmt]);
  useEffect(() => { const el = editorRef.current; if (!el) return; const onBlur = () => saveSelection(); el.addEventListener("blur", onBlur, true); return () => el.removeEventListener("blur", onBlur, true); },[]);
  useEffect(() => { if (editorRef.current) { editorRef.current.innerHTML = (initialHTML || "").replace(/<font[^>]*size=["']?7["']?[^>]*>(.*?)<\/font>/gi, '<span style="font-size:36px;">$1</span>'); } },[]);

  const saveSelection = () => { const sel=window.getSelection(); if(sel&&sel.rangeCount>0) savedRange.current=sel.getRangeAt(0).cloneRange(); };
  const restoreSelection = () => { const el=editorRef.current; if(!el)return; const range = savedRange.current; el.focus(); if(range){ const sel=window.getSelection(); if(sel){ try{ sel.removeAllRanges(); sel.addRange(range); }catch(e){} } } };
  const execCmd = (cmd, value=null) => { restoreSelection(); document.execCommand(cmd,false,value); editorRef.current&&editorRef.current.focus(); setTimeout(updateFmt,0); };

  const applyFontSize = (px) => {
    restoreSelection();
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return; const range = sel.getRangeAt(0); const el = editorRef.current; if (!el) return;

    if (range.collapsed) { const span = document.createElement("span"); span.style.fontSize = `${px}px`; span.innerHTML = "\u200B"; range.insertNode(span); const newRange = document.createRange(); newRange.setStart(span.firstChild, 1); newRange.collapse(true); sel.removeAllRanges(); sel.addRange(newRange); el.focus(); saveSelection(); setTimeout(updateFmt, 0); if (onChange) onChange(el.innerHTML); return; }

    document.execCommand("styleWithCSS", false, false);
    Array.from(el.querySelectorAll("font")).forEach(f => { if (f.getAttribute("size") === "7") f.dataset.locked = "1"; }); Array.from(el.querySelectorAll("span")).forEach(s => { if (s.style.fontSize && (s.style.fontSize.includes("xxx-large") || s.style.fontSize.includes("48px"))) s.dataset.locked = "1"; });

    document.execCommand("fontSize", false, 7);

    let replacedSome = false; Array.from(el.querySelectorAll("font[size='7']:not([data-locked='1'])")).forEach(n => { n.removeAttribute("size"); n.style.fontSize = `${px}px`; replacedSome = true; }); Array.from(el.querySelectorAll("span:not([data-locked='1'])")).forEach(s => { if (s.style.fontSize && (s.style.fontSize.includes("xxx-large") || s.style.fontSize.includes("48px"))) { s.style.fontSize = `${px}px`; replacedSome = true; } });

    if (!replacedSome) { document.execCommand("styleWithCSS", false, true); const edgeFix = "EDGE_"+Date.now(); document.execCommand("fontName", false, edgeFix); Array.from(el.querySelectorAll(`font[face="${edgeFix}"], span[style*="${edgeFix}"]`)).forEach(n => { n.removeAttribute("face"); n.style.fontFamily = ""; n.style.fontSize = `${px}px`; }); }
    Array.from(el.querySelectorAll("[data-locked]")).forEach(n => n.removeAttribute("data-locked")); el.focus(); saveSelection(); setTimeout(updateFmt, 0); if (onChange) setTimeout(() => onChange(el.innerHTML), 10);
  };

  const Btn = ({ cmd, title, active: forceActive, onClick, children }) => { const isActive = forceActive !== undefined ? forceActive : (fmt[cmd] || false); return ( <button title={title} onMouseDown={(e) => { e.preventDefault(); saveSelection(); if (onClick) onClick(); else execCmd(cmd); }} style={{ background:isActive?"rgba(26,115,232,0.12)":"none", border:isActive?"1.5px solid rgba(26,115,232,0.4)":"1px solid transparent", borderRadius:6, cursor:"pointer", padding:"4px 7px", fontSize:13, color:isActive?"#1a73e8":"#4B5563", fontWeight:isActive?700:400, minWidth:28, display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }} onMouseEnter={e => { if(!isActive) e.currentTarget.style.background="#f1f3f4"; }} onMouseLeave={e => { if(!isActive) e.currentTarget.style.background="none"; }}>{children}</button> ); };
  const Sep = () => <div style={{ width:1, height:22, background:"#e0e0e0", margin:"0 3px", alignSelf:"center" }}/>; const alignActive = fmt.justifyLeft?"left":fmt.justifyCenter?"center":fmt.justifyRight?"right":"left";

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
      <div style={{ padding:"5px 10px", borderBottom:"1px solid #e0e0e0", display:"flex", flexWrap:"wrap", gap:3, alignItems:"center", background:"#f8f9fa", flexShrink:0 }}>
        <FontDropdown fontName={fmt.fontName} saveSelection={saveSelection} restoreSelection={restoreSelection} editorRef={editorRef} updateFmt={updateFmt}/> <SizeDropdown currentVal={fmt.fontSize} saveSelection={saveSelection} applyFontSize={applyFontSize}/> <Sep/>
        <Btn cmd="bold" title="Bold (Ctrl+B)"><b style={{ fontFamily:"serif", fontSize:14 }}>B</b></Btn> <Btn cmd="italic" title="Italic (Ctrl+I)"><i style={{ fontSize:14 }}>I</i></Btn> <Btn cmd="underline" title="Underline (Ctrl+U)"><u>U</u></Btn> <Btn cmd="strikeThrough" title="Strikethrough"><s>S</s></Btn> <Btn cmd="superscript" title="Superscript"><sup style={{ fontSize:9 }}>A²</sup></Btn> <Btn cmd="subscript" title="Subscript"><sub style={{ fontSize:9 }}>A₂</sub></Btn> <Sep/>
        <label title="Text Color" style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer", padding:"2px 4px", borderRadius:6 }} onMouseEnter={e => e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e => e.currentTarget.style.background="none"}><div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}><span style={{ fontSize:13, fontWeight:700, color:fmt.foreColor!=="#000000"?fmt.foreColor:"#000", lineHeight:1 }}>A</span><div style={{ width:14, height:3, borderRadius:2, background:fmt.foreColor||"#000000" }}/></div><input type="color" value={fmt.foreColor||"#000000"} onMouseDown={saveSelection} onChange={(e) => { restoreSelection(); document.execCommand("foreColor",false,e.target.value); editorRef.current&&editorRef.current.focus(); saveSelection(); setTimeout(updateFmt,0); }} style={{ width:18, height:18, border:"1px solid #e0e0e0", borderRadius:3, padding:0, cursor:"pointer" }}/></label> <Sep/>
        <Btn cmd="justifyLeft" title="Align Left" active={alignActive==="left"} ><span style={{ fontSize:12 }}>⬅≡</span></Btn> <Btn cmd="justifyCenter" title="Center" active={alignActive==="center"}><span style={{ fontSize:12 }}>≡</span></Btn> <Btn cmd="justifyRight" title="Align Right" active={alignActive==="right"} ><span style={{ fontSize:12 }}>≡➡</span></Btn> <Sep/>
        <Btn cmd="insertUnorderedList" title="Bullet List"><span style={{ fontSize:11 }}>• ≡</span></Btn> <Btn cmd="insertOrderedList" title="Numbered List"><span style={{ fontSize:11 }}>1.≡</span></Btn> <Btn cmd="indent" title="Indent"><span style={{ fontSize:11 }}>→⊟</span></Btn> <Btn cmd="outdent" title="Outdent"><span style={{ fontSize:11 }}>←⊟</span></Btn> <Sep/>
        {[ { label:"🔗 Link", fn:()=>{ const v=window.prompt("URL:","https://"); if(v!==null) execCmd("createLink",v||""); } }, { label:"🖼 Image",fn:()=>{ const v=window.prompt("Image URL:","https://"); if(v!==null) execCmd("insertImage",v||""); } }, { label:"── Rule", fn:()=>{ saveSelection(); restoreSelection(); document.execCommand("insertHorizontalRule"); editorRef.current&&editorRef.current.focus(); } },].map(({ label, fn }) => ( <button key={label} onMouseDown={e => { e.preventDefault(); fn(); }} style={{ background:"#f8f9fa", border:"1px solid rgba(0,0,0,0.12)", borderRadius:6, cursor:"pointer", padding:"3px 9px", fontSize:11, color:"#555" }} onMouseEnter={e => e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e => e.currentTarget.style.background="#f8f9fa"}>{label}</button> ))} <Sep/>
        <Btn cmd="undo" title="Undo (Ctrl+Z)">↩</Btn> <Btn cmd="redo" title="Redo (Ctrl+Y)">↪</Btn>
        <button title="Clear formatting" onMouseDown={e => { e.preventDefault(); saveSelection(); restoreSelection(); document.execCommand("removeFormat"); editorRef.current&&editorRef.current.focus(); setTimeout(updateFmt,0); }} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:6, cursor:"pointer", padding:"3px 9px", fontSize:11, color:"#EF4444" }} onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.12)"} onMouseLeave={e => e.currentTarget.style.background="rgba(239,68,68,0.06)"}>✕ Clear</button>
      </div>
      <div 
        ref={editorRef} 
        contentEditable 
        suppressContentEditableWarning 
        spellCheck 
        dir="ltr" 
        data-placeholder="Write your message here…" 
        onKeyUp={e=>{ saveSelection(); updateFmt(); }} 
        onMouseUp={e=>{ saveSelection(); updateFmt(); }} 
        onSelect={e=>{ saveSelection(); updateFmt(); }} 
        onInput={() => { if (onChange) onChange(editorRef.current ? editorRef.current.innerHTML : ""); }} 
        onContextMenu={(e) => { e.preventDefault(); setCtxMenu({ x:e.clientX, y:e.clientY }); }} 
        onKeyDown={e => { 
          if ((e.ctrlKey||e.metaKey) && !e.shiftKey && e.key==="z") { e.preventDefault(); document.execCommand("undo"); setTimeout(updateFmt,0); return; } 
          if ((e.ctrlKey||e.metaKey) && ((e.shiftKey&&e.key==="z")||e.key==="y")) { e.preventDefault(); document.execCommand("redo"); setTimeout(updateFmt,0); return; } 
          if ((e.ctrlKey||e.metaKey) && e.key==="b") { e.preventDefault(); execCmd("bold"); return; } 
          if ((e.ctrlKey||e.metaKey) && e.key==="i") { e.preventDefault(); execCmd("italic"); return; } 
          if ((e.ctrlKey||e.metaKey) && e.key==="u") { e.preventDefault(); execCmd("underline"); return; } 
          if (e.key==="Enter" && !e.shiftKey) { 
            e.preventDefault(); 
            document.execCommand("insertLineBreak"); 
          } 
        }} 
        style={{ flex:1, minHeight:0, overflowY:"auto", padding:"14px 20px", fontSize:14, lineHeight:1.6, color:"#202124", outline:"none", background:"#fff", direction:"ltr" }}
      />
      {ctxMenu && <EditorContextMenu x={ctxMenu.x} y={ctxMenu.y} onClose={() => setCtxMenu(null)} editorRef={editorRef}/>}
      <style>{`[contenteditable][data-placeholder]:empty:before{content:attr(data-placeholder);color:#b0bec5;pointer-events:none} [contenteditable] p{margin:0;padding:0}[contenteditable] blockquote{border-left:3px solid #aaa;margin:4px 0;padding:4px 14px;background:rgba(0,0,0,0.03);color:#333;border-radius:0 8px 8px 0} [contenteditable] a{color:#1a73e8;text-decoration:underline} [contenteditable] ul,[contenteditable] ol{padding-left:24px;margin:2px 0} [contenteditable] hr{border:none;border-top:2px solid rgba(0,0,0,0.12);margin:8px 0} [contenteditable] img{max-width:100%;border-radius:6px} [contenteditable] h1{font-size:1.6em;font-weight:800;margin:6px 0 2px} [contenteditable] h2{font-size:1.3em;font-weight:700;margin:5px 0 2px}[contenteditable] h3{font-size:1.1em;font-weight:600;margin:4px 0 2px} `}</style>
    </div>
  );
}

// ── Modals & Context Menus ───────────────────────────────────────────────────
function ContextMenu({ x, y, mail, allVisibleMails, onClose, folderLabel, onToggleStar, onMarkRead, onDelete }) {
  const ref = useRef();
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [onClose]);

  const items =[
    { icon:<Ic.Trash s={13} c="#EF4444"/>, label: <span style={{color:"#EF4444"}}>Delete Message</span>, action:()=>{ onDelete(mail); onClose(); } },
    { divider: true },
    { icon:<Ic.Mail s={13}/>, label: mail.read ? "Mark as Unread" : "Mark as Read", action:()=>{ onMarkRead(mail,!mail.read); onClose(); } }, { icon:<Ic.Mail s={13}/>, label: `Mark all ${allVisibleMails.length} as Read`, action:()=>{ allVisibleMails.forEach(m => { if (!m.read) onMarkRead(m, true); }); onClose(); } }, { icon:<Ic.Star s={13}/>, label: mail.starred ? "Remove star" : "Star this email", action:()=>{ onToggleStar(mail); onClose(); } },
    { divider: true },
    { icon:<Ic.Download s={13}/>, label:"Save as .EML", action:()=>{ exportEmailAsEML(mail); onClose(); } }, { icon:<Ic.Download s={13}/>, label:"Export this email as CSV", action:()=>{ exportToCSV([mail], `email_${(mail.subject||"email").slice(0,20)}.csv`); onClose(); } },
    { divider: true },
    { icon:<Ic.Download s={13}/>, label:`Export all ${allVisibleMails.length} as .MBOX`, action:()=>{ exportFolderAsMBOX(allVisibleMails, folderLabel||"emails"); onClose(); } }, { icon:<Ic.Download s={13}/>, label:`Export all ${allVisibleMails.length} as CSV`, action:()=>{ exportToCSV(allVisibleMails, `${folderLabel||"emails"}.csv`); onClose(); } },
    
  ];
  const menuW = 295, menuH = items.length * 42; const vw = window.innerWidth, vh = window.innerHeight; const left = x + menuW > vw ? x - menuW : x; const top  = y + menuH > vh ? y - menuH : y;

  return (
    <div ref={ref} style={{ position:"fixed", left, top, zIndex:9999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:14, boxShadow:"0 8px 40px rgba(0,0,0,0.18)", minWidth:menuW, padding:"6px 0", animation:"ctxFadeIn 0.12s ease" }}>
      <div style={{ padding:"10px 14px 8px", borderBottom:"1px solid #f1f3f4" }}><div style={{ fontSize:12, fontWeight:600, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mail.subject||"(no subject)"}</div><div style={{ fontSize:10, color:"#1a73e8", marginTop:2 }}>{(mail.from&&mail.from.name)||(mail.from&&mail.from.email)}</div></div>
      {items.map((item, i) => item.divider ? <div key={i} style={{ height:1, background:"#f1f3f4", margin:"3px 0" }}/> : <button key={i} onClick={item.action} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"9px 14px", fontSize:12, color:"#202124", textAlign:"left" }} onMouseEnter={e => e.currentTarget.style.background="#f8f9fa"} onMouseLeave={e => e.currentTarget.style.background="none"}><span style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</span>{item.label}</button> )}
    </div>
  );
}



function CSVImportModal({ onClose, onImported, existingAccounts = [] }) {
  const [step, setStep] = useState(1); const[rows, setRows] = useState([]); const [results, setResults] = useState([]); const[dragOver, setDragOver] = useState(false); const [error, setError] = useState(""); const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return; const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);
      if (parsed === null) { setError("CSV must have: Name, Email, Password columns."); return; } if (parsed.length === 0) { setError("No valid rows found."); return; }
      const seenEmails = new Set(), uniqueRows =[], dupsInCSV =[];
      parsed.forEach(row => { const em = (row.email||"").trim().toLowerCase(); if (!em) return; if (seenEmails.has(em)) { dupsInCSV.push(em); return; } seenEmails.add(em); uniqueRows.push(row); });
      const alreadyAdded =[], newRows = uniqueRows.filter(row => { const em = (row.email||"").trim().toLowerCase(); const exists = existingAccounts.find(a => (a.email||"").toLowerCase() === em); if (exists) { alreadyAdded.push(em); return false; } return true; });
      const available = 500 - existingAccounts.length; const finalRows = newRows.slice(0, available); let notice = "";
      if (dupsInCSV.length) notice += `${dupsInCSV.length} duplicate(s) removed. `; if (alreadyAdded.length) notice += `${alreadyAdded.length} already added, skipped. `; if (newRows.length > available) notice += `Capped at ${available}. `; if (finalRows.length === 0) { setError("All emails already added or limit reached."); return; }
      setError(notice ? "⚠ " + notice.trim() : ""); setRows(finalRows); setStep(2);
    }; reader.readAsText(file);
  };

  const startImport = async () => {
    setStep(3); const res = new Array(rows.length).fill(null); const BATCH = 10;
    for (let b = 0; b < rows.length; b += BATCH) {
      const batch = rows.slice(b, b + BATCH);
      await Promise.all(batch.map(async (row, j) => {
        const idx = b + j;
        try { const acc = await apiFetch("/accounts", { method:"POST", body:JSON.stringify({ email:row.email, password:row.password, name:row.name }) }); res[idx] = { ...row, status:"success", account:acc }; onImported(acc); }
        catch(e) { res[idx] = { ...row, status:"error", error:e.message }; }
      }));
    }
    setResults(res.filter(Boolean)); setStep(4);
  };

  const successCount = results.filter(r => r.status==="success").length; const failCount = results.filter(r => r.status==="error").length;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={step!==3?onClose:undefined}>
      <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,0.14)", border:"1px solid #e0e0e0", width:520, maxHeight:"85vh", display:"flex", flexDirection:"column" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📊</div>
          <div><h2 style={{ fontSize:16, fontWeight:700, color:"#202124" }}>Import Accounts via CSV</h2><p style={{ fontSize:12, color:"#1a73e8", marginTop:2 }}>{step===1&&"Upload CSV"}{step===2&&`${rows.length} accounts ready`}{step===3&&"Connecting…"}{step===4&&`Done — ${successCount} connected`}</p></div>
          {step!==3 && <button onClick={onClose} style={{ marginLeft:"auto", background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", fontSize:18, width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>}
        </div>
        <div style={{ height:3, background:"#f1f3f4" }}><div style={{ height:"100%", background:"#1a73e8", width:`${(step/4)*100}%`, transition:"width 0.5s", borderRadius:2 }}/></div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {step===1&&(<> {error && <div style={{ background:error.startsWith("⚠")?"rgba(245,158,11,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${error.startsWith("⚠")?"rgba(245,158,11,0.3)":"rgba(239,68,68,0.25)"}`, borderRadius:10, padding:"10px 14px", marginBottom:16 }}><p style={{ fontSize:12, color:error.startsWith("⚠")?"#D97706":"#EF4444" }}>{error}</p></div>}
            <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}} onClick={()=>fileRef.current&&fileRef.current.click()} style={{ border:`2px dashed ${dragOver?"#1a73e8":"#d1d5db"}`, borderRadius:16, padding:"36px 20px", textAlign:"center", cursor:"pointer", background:dragOver?"#eff6ff":"#fafafa", marginBottom:16, transition:"all 0.18s" }}><div style={{ fontSize:40, marginBottom:10 }}>📂</div><p style={{ fontSize:14, fontWeight:600, color:"#202124", marginBottom:6 }}>Drop your CSV file here</p><p style={{ fontSize:12, color:"#1a73e8" }}>or click to browse</p><input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/></div> </>)}
          {step===2 && (
            <div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}><thead><tr style={{ background:"#f8f9fa" }}>{["#","Name","Email","Password"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontWeight:700, color:"#6B7280", borderBottom:"1px solid #e0e0e0", fontSize:11 }}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i} style={{ borderBottom:i!==rows.length-1?"1px solid #e0e0e0":"none" }}><td style={{ padding:"8px 12px", color:"#9CA3AF", width:30 }}>{i+1}</td><td style={{ padding:"8px 12px", color:"#202124", fontWeight:500 }}>{row.name||"—"}</td><td style={{ padding:"8px 12px", color:"#202124", fontFamily:"monospace", fontSize:11 }}>{row.email}</td><td style={{ padding:"8px 12px", color:"#9CA3AF", fontFamily:"monospace", fontSize:11 }}>{"•".repeat(Math.min(row.password.length,12))}</td></tr>)}</tbody></table></div> )}
          {step===3 && <div style={{ textAlign:"center", padding:"30px 0" }}><div style={{ width:50, height:50, border:"3px solid #e0e0e0", borderTop:"3px solid #1a73e8", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 16px" }}/><p style={{ fontSize:14, fontWeight:600, color:"#202124" }}>Connecting accounts…</p></div>}
          {step===4 && (<> <div style={{ display:"flex", gap:10, marginBottom:16 }}><div style={{ flex:1, background:"rgba(26,115,232,0.08)", border:"1px solid rgba(26,115,232,0.25)", borderRadius:10, padding:"14px", textAlign:"center" }}><div style={{ fontSize:24, fontWeight:700, color:"#1a73e8" }}>{successCount}</div><div style={{ fontSize:11, color:"#1a73e8" }}>Connected</div></div>{failCount>0 && <div style={{ flex:1, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"14px", textAlign:"center" }}><div style={{ fontSize:24, fontWeight:700, color:"#EF4444" }}>{failCount}</div><div style={{ fontSize:11, color:"#EF4444" }}>Failed</div></div>}</div><div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}>{results.map((r,i) => <div key={i} style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:i!==results.length-1?"1px solid #e0e0e0":"none", background:r.status==="success"?"rgba(26,115,232,0.03)":"rgba(239,68,68,0.03)" }}><span>{r.status==="success"?<Ic.Check s={16} c="#1a73e8"/>:<Ic.X s={16} c="#EF4444"/>}</span><div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:600, color:"#202124" }}>{r.name||r.email}</div><div style={{ fontSize:11, color:r.status==="success"?"#1a73e8":"#EF4444" }}>{r.status==="success"?r.email:r.error}</div></div></div>)}</div></>)}
        </div>
        <div style={{ padding:"16px 24px", borderTop:"1px solid #e0e0e0", display:"flex", gap:10 }}>
          {step===1 && <><button onClick={onClose} style={{ flex:1, background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13 }}>Cancel</button><button onClick={()=>fileRef.current&&fileRef.current.click()} style={{ flex:2, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:600 }}>Choose CSV File</button></>}
          {step===2 && <><button onClick={()=>setStep(1)} style={{ flex:1, background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13 }}>← Back</button><button onClick={startImport} style={{ flex:2, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:600 }}>Import {rows.length} Account{rows.length!==1?"s":""} →</button></>}
          {step===4 && <button onClick={onClose} style={{ flex:1, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:600 }}>Done ✓</button>}
        </div>
      </div>
    </div>
  );
}

function AddAccountModal({ onClose, onAdded, existingAccounts =[] }) {
  const [step, setStep] = useState(1); const [form, setForm] = useState({ email:"", password:"", name:"", imapHost:"", imapPort:993, imapSecure:true, smtpHost:"", smtpPort:587, smtpSecure:false });
  const [preset, setPreset] = useState(null); const[testing, setTesting] = useState(false); const [error, setError] = useState("");

  const LOCAL_PRESETS = { "gmail.com":{ host:"imap.gmail.com", port:993, secure:true, smtpHost:"smtp.gmail.com", smtpPort:587, smtpSecure:false }, "outlook.com":{ host:"outlook.office365.com", port:993, secure:true, smtpHost:"smtp.office365.com", smtpPort:587, smtpSecure:false }, "yahoo.com":{ host:"imap.mail.yahoo.com", port:993, secure:true, smtpHost:"smtp.mail.yahoo.com", smtpPort:465, smtpSecure:true }, "icloud.com":{ host:"imap.mail.me.com", port:993, secure:true, smtpHost:"smtp.mail.me.com", smtpPort:587, smtpSecure:false }};
  const detectPreset = async (email) => { if (!email.includes("@")) return; const domain = email.split("@")[1]?.toLowerCase() || ""; if (LOCAL_PRESETS[domain]) { const p = LOCAL_PRESETS[domain]; setPreset(p); setForm(prev => ({ ...prev, imapHost:p.host, imapPort:p.port, imapSecure:p.secure, smtpHost:p.smtpHost, smtpPort:p.smtpPort, smtpSecure:p.smtpSecure })); return; } try { const p = await apiFetch("/presets/"+encodeURIComponent(email)); if (p && p.host) { setPreset(p); setForm(prev => ({ ...prev, imapHost:p.host, imapPort:p.port, imapSecure:p.secure, smtpHost:p.smtpHost, smtpPort:p.smtpPort, smtpSecure:p.smtpSecure })); } } catch(e) {} };
  const handleTest = async () => { setTesting(true); setError(""); try { await apiFetch("/accounts/test", { method:"POST", body:JSON.stringify(form) }); setStep(3); } catch(e) { setError(e.message); } finally { setTesting(false); } };
  const handleAdd  = async () => { const emailLower = form.email.trim().toLowerCase(); const dup = existingAccounts.find(a => (a.email||"").toLowerCase() === emailLower); if (dup) { setError("Already added as "+JSON.stringify(dup.name||dup.email)); return; } if (existingAccounts.length >= 500) { setError("500-account limit reached."); return; } setTesting(true); setError(""); try { const acc = await apiFetch("/accounts", { method:"POST", body:JSON.stringify(form) }); onAdded(acc); onClose(); } catch(e) { setError(e.message); } finally { setTesting(false); } };

  const hint = { "gmail.com":{ icon:"G", note:"myaccount.google.com → App Passwords" }, "outlook.com":{ icon:"⊞", note:"account.microsoft.com → App Passwords" } }[(form.email.split("@")[1]||"").toLowerCase()];
  const inp  = { width:"100%", background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:10, color:"#202124", padding:"9px 12px", fontSize:13, outline:"none" };
  const lbl  = { fontSize:11, color:"#1a73e8", display:"block", marginBottom:7, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,0.14)", border:"1px solid #e0e0e0", padding:28, width:460, maxHeight:"90vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>✉</div>
          <div><h2 style={{ fontSize:16, fontWeight:700, color:"#202124" }}>Add Account Manually</h2><p style={{ fontSize:11, color:"#1a73e8", marginTop:2 }}>Step {step} of 3</p></div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", fontSize:18, width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ display:"flex", gap:4, marginBottom:22 }}>{["Credentials","Server","Confirm"].map((s,i) => ( <div key={s} style={{ flex:1 }}><div style={{ height:3, borderRadius:2, background:i>=step?"#f1f3f4":"#1a73e8", marginBottom:4, transition:"all 0.3s" }}/><div style={{ fontSize:10, color:i>=step?"#9CA3AF":"#1a73e8", textAlign:"center" }}>{s}</div></div> ))}</div>
        {error && <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:16 }}><p style={{ color:"#EF4444", fontSize:12 }}>⚠ {error}</p></div>}
        {step===1 && (<> <div style={{ marginBottom:14 }}><label style={lbl}>Display Name</label><input type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="John Doe" style={inp}/></div> <div style={{ marginBottom:14 }}><label style={lbl}>Email Address</label><input type="email" value={form.email} onChange={e=>{setForm(p=>({...p,email:e.target.value}));detectPreset(e.target.value);}} placeholder="you@gmail.com" style={inp}/>{hint&&<div style={{ marginTop:8, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"9px 12px" }}><p style={{ fontSize:11, color:"#1d4ed8", fontWeight:600, marginBottom:2 }}>{hint.icon} App Password Required</p><p style={{ fontSize:11, color:"#3b82f6" }}>{hint.note}</p></div>}</div> <div style={{ marginBottom:14 }}><label style={lbl}>App Password</label><input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="xxxx xxxx xxxx xxxx" style={{ ...inp, letterSpacing:"0.15em" }}/></div> </>)}
        {step===2 && (<> {preset && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"9px 12px", marginBottom:14 }}><p style={{ fontSize:11, color:"#16a34a" }}>✓ Auto-detected for {form.email.split("@")[1]}</p></div>} <div style={{ marginBottom:14 }}><label style={lbl}>IMAP Host</label><input value={form.imapHost} onChange={e=>setForm(p=>({...p,imapHost:e.target.value}))} placeholder="imap.gmail.com" style={{ ...inp, fontFamily:"monospace" }}/></div> <div style={{ display:"flex", gap:10, marginBottom:14 }}><div style={{ flex:1 }}><label style={lbl}>IMAP Port</label><input type="number" value={form.imapPort} onChange={e=>setForm(p=>({...p,imapPort:parseInt(e.target.value)}))} style={{ ...inp, fontFamily:"monospace" }}/></div><div style={{ flex:1 }}><label style={lbl}>Security</label><select value={form.imapSecure?"ssl":"starttls"} onChange={e=>setForm(p=>({...p,imapSecure:e.target.value==="ssl"}))} style={{ ...inp, height:38, cursor:"pointer" }}><option value="ssl">SSL/TLS</option><option value="starttls">STARTTLS</option></select></div></div> <div style={{ marginBottom:14 }}><label style={lbl}>SMTP Host</label><input value={form.smtpHost} onChange={e=>setForm(p=>({...p,smtpHost:e.target.value}))} placeholder="smtp.gmail.com" style={{ ...inp, fontFamily:"monospace" }}/></div> <div style={{ display:"flex", gap:10 }}><div style={{ flex:1 }}><label style={lbl}>SMTP Port</label><input type="number" value={form.smtpPort} onChange={e=>setForm(p=>({...p,smtpPort:parseInt(e.target.value)}))} style={{ ...inp, fontFamily:"monospace" }}/></div><div style={{ flex:1 }}><label style={lbl}>Security</label><select value={form.smtpSecure?"ssl":"starttls"} onChange={e=>setForm(p=>({...p,smtpSecure:e.target.value==="ssl"}))} style={{ ...inp, height:38, cursor:"pointer" }}><option value="ssl">SSL/TLS</option><option value="starttls">STARTTLS</option></select></div></div> </>)}
        {step===3 && ( <div><div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:14, padding:"24px", marginBottom:18, textAlign:"center" }}><div style={{ fontSize:40, marginBottom:8, display:"flex", justifyContent:"center" }}><Ic.Check s={40} c="#16a34a"/></div><p style={{ color:"#15803d", fontWeight:600, fontSize:14 }}>Connection verified!</p><p style={{ color:"#1a73e8", fontSize:12, marginTop:4 }}>{form.email}</p></div><div style={{ background:"#fafafa", borderRadius:12, padding:"12px 14px", border:"1px solid #e0e0e0" }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:11, color:"#6B7280" }}>IMAP</span><span style={{ fontSize:12, color:"#202124", fontFamily:"monospace" }}>{form.imapHost}:{form.imapPort}</span></div><div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:11, color:"#6B7280" }}>SMTP</span><span style={{ fontSize:12, color:"#202124", fontFamily:"monospace" }}>{form.smtpHost}:{form.smtpPort}</span></div></div></div> )}
        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          <button onClick={()=>{ if(step>1){setStep(step-1);setError("");}else onClose(); }} style={{ flex:1, background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13 }}>{step===1?"Cancel":"← Back"}</button>
          {step===1 && <button onClick={()=>{setError("");setStep(2);}} disabled={!form.email||!form.password} style={{ flex:2, background:(!form.email||!form.password)?"#e5e7eb":"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:600 }}>Continue →</button>}
          {step===2 && <button onClick={handleTest} disabled={testing||!form.imapHost} style={{ flex:2, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:600 }}>{testing?"Testing…":"Test Connection →"}</button>}
          {step===3 && <button onClick={handleAdd} disabled={testing} style={{ flex:2, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:600 }}>{testing?"Connecting…":"Add Account"}</button>}
        </div>
      </div>
    </div>
  );
}

function DelayPanel({ accId, accName, initialMin, initialMax, onChange }) {
  const toMin = (sec) => sec != null ? Math.round(sec / 60) : "";
  const[minM, setMinM] = useState(toMin(initialMin) !== "" ? toMin(initialMin) : 1);
  const [maxM, setMaxM] = useState(toMin(initialMax) !== "" ? toMin(initialMax) : 3);
  const ns = { width:80, height:42, border:"2px solid #e0e0e0", borderRadius:10, fontSize:18, fontWeight:800, color:"#202124", textAlign:"center", outline:"none", background:"#fafafa", padding:"0 8px", fontFamily:"monospace" };
  const lb = { fontSize:11, color:"#1a73e8", display:"block", marginBottom:7, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" };
  const hMin = (raw) => { const v=Math.max(0,parseInt(raw)||0), nm=maxM<v?v:maxM; setMinM(v); setMaxM(nm); onChange("minDelay",v*60); onChange("maxDelay",nm*60); };
  const hMax = (raw) => { const v=Math.max(minM,parseInt(raw)||0); setMaxM(v); onChange("maxDelay",v*60); };
  return (
    <div>
      <p style={{ fontSize:13, fontWeight:700, color:"#202124", marginBottom:4 }}>⏱ Wait Delay Config — {accName}</p>
      <p style={{ fontSize:11, color:"#6B7280", marginBottom:16 }}>Random wait between Min and Max continuously executing inside Queue engine loop uniquely for this account.</p>
      <div style={{ display:"flex", gap:20, alignItems:"flex-end", flexWrap:"wrap" }}>
        <div><label style={lb}>Min (minutes)</label><input type="number" min="0" max="1440" value={minM} onChange={e=>hMin(e.target.value)} onBlur={e=>hMin(e.target.value)} style={ns}/></div>
        <div style={{ paddingBottom:8, fontSize:20, color:"#d1d5db" }}>—</div>
        <div><label style={lb}>Max (minutes)</label><input type="number" min="0" max="1440" value={maxM} onChange={e=>hMax(e.target.value)} onBlur={e=>hMax(e.target.value)} style={ns}/></div>
      </div>
      <div style={{ marginTop:16, padding:"12px 16px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10 }}><p style={{ fontSize:13, color:"#1d4ed8", fontWeight:600 }}>⏱ After sending each mail, it sleeps individually for <b>{minM===maxM?`${minM} min`:`${minM}–${maxM} min`}</b> autonomously</p>{minM===0&&maxM===0&&<p style={{ fontSize:11, color:"#EF4444", marginTop:5 }}>⚠ Zero delay drastically spikes ban rates! Not recommended.</p>}</div>
    </div>
  );
}

function AccountSettingsModal({ accounts, signatures, accountSettings, onSignatureChange, onAccountSettingChange, onClose, onAddManual, onAddCSV, onRemove, getColor }) {
  const [confirmDelete, setConfirmDelete] = useState(null); 
  const [tab, setTab] = useState("accounts"); 
  const [openPanel, setOpenPanel] = useState(null);
  const [accountSearch, setAccountSearch] = useState("");

  const handleRemove = (acc) => { if (confirmDelete===acc.id){ onRemove(acc.id); setConfirmDelete(null); } else setConfirmDelete(acc.id); };

  // Advanced Search Logic (Supports Comma-Separated Values)
  const searchTerms = accountSearch.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const filteredAccounts = accounts.filter(acc => {
    if (searchTerms.length === 0) return true;
    const em = (acc.email || "").toLowerCase();
    const nm = (acc.name || "").toLowerCase();
    return searchTerms.some(term => em.includes(term) || nm.includes(term));
  });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,0.14)", border:"1px solid #e0e0e0", width:580, maxHeight:"88vh", display:"flex", flexDirection:"column" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚙</div>
          <div><h2 style={{ fontSize:16, fontWeight:700, color:"#202124" }}>Account Settings</h2><p style={{ fontSize:12, color:"#1a73e8", marginTop:2 }}>{accounts.length} account{accounts.length!==1?"s":""} connected</p></div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", fontSize:18, width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ display:"flex", borderBottom:"1px solid #e0e0e0", padding:"0 24px" }}>
          {[{id:"accounts",label:"Accounts ("+accounts.length+")"},{id:"add",label:"Add Accounts"}].map(t => ( 
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"12px 16px", fontSize:13, fontWeight:tab===t.id?600:400, color:tab===t.id?"#1a73e8":"#6B7280", borderBottom:tab===t.id?"2px solid #1a73e8":"2px solid transparent", transition:"all 0.15s" }}>{t.label}</button> 
          ))}
        </div>
        
        {/* NEW: Search Bar Area */}
        {tab === "accounts" && (
          <div style={{ padding: "12px 24px", borderBottom: "1px solid #f1f3f4", background: "#fdfdfd" }}>
            <input 
              value={accountSearch} 
              onChange={e => setAccountSearch(e.target.value)} 
              placeholder="Search by email or name (e.g. john@, admin@...)" 
              style={{ width: "100%", padding: "9px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 13, outline: "none", color: "#202124" }}
            />
          </div>
        )}

        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {tab==="accounts" && filteredAccounts.length===0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"#9CA3AF" }}><div style={{ fontSize:40, marginBottom:12 }}>📭</div><p style={{ fontSize:13 }}>No accounts found</p></div>}
          {tab==="accounts" && filteredAccounts.map((acc, i) => {
            const color=getColor(i), isConfirm=confirmDelete===acc.id, accSet=accountSettings[acc.id]||{}, hasSig=!!signatures[acc.id], sigOpen=openPanel===acc.id+":sig", delayOpen=openPanel===acc.id+":delay";
            return ( 
              <div key={acc.id} style={{ borderBottom:"1px solid #f1f3f4" }}>
                <div style={{ padding:"14px 24px", display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:`${color}18`, border:`2px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color, flexShrink:0 }}>{(acc.name||acc.email).slice(0,2).toUpperCase()}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{acc.name||acc.email.split("@")[0]}</div>
                    <div style={{ fontSize:11, color:"#1a73e8", marginTop:2, fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{acc.email}</div>
                    <div style={{ display:"flex", gap:5, marginTop:5, flexWrap:"wrap" }}>
                      <span style={{ fontSize:10, background:"#f1f3f4", color:"#6B7280", borderRadius:6, padding:"2px 7px" }}>● Connected</span>
                      {hasSig && <span style={{ fontSize:10, background:"#fef3c7", color:"#D97706", borderRadius:6, padding:"2px 7px" }}>✍ Sig</span>}
                      {accSet.minDelay!=null && <span style={{ fontSize:10, background:"#eff6ff", color:"#1a73e8", borderRadius:6, padding:"2px 7px" }}>⏱ {Math.round(accSet.minDelay/60)}–{Math.round((accSet.maxDelay||0)/60)}m</span>}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={()=>setOpenPanel(sigOpen?null:acc.id+":sig")} style={{ background:sigOpen?"#eff6ff":"#f8f9fa", border:`1px solid ${sigOpen?"#bfdbfe":"#e0e0e0"}`, color:sigOpen?"#1a73e8":"#6B7280", cursor:"pointer", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:500 }}>✍ Sig</button>
                    <button onClick={()=>setOpenPanel(delayOpen?null:acc.id+":delay")} style={{ background:delayOpen?"#eff6ff":"#f8f9fa", border:`1px solid ${delayOpen?"#bfdbfe":"#e0e0e0"}`, color:delayOpen?"#1a73e8":"#6B7280", cursor:"pointer", borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:500 }}>⏱</button>
                    {isConfirm ? <div style={{ display:"flex", gap:5, alignItems:"center" }}><span style={{ fontSize:11, color:"#EF4444", fontWeight:500 }}>Sure?</span><button onClick={()=>handleRemove(acc)} style={{ background:"#EF4444", border:"none", color:"#fff", cursor:"pointer", borderRadius:6, padding:"4px 9px", fontSize:11, fontWeight:600 }}>Yes</button><button onClick={()=>setConfirmDelete(null)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:6, padding:"4px 9px", fontSize:11 }}>No</button></div> : <button onClick={()=>handleRemove(acc)} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:8, padding:"5px 10px", fontSize:11 }}>✕</button>}
                  </div>
                </div>
                {sigOpen && <div style={{ margin:"0 24px 16px", padding:16, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:14 }}><div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}><div><p style={{ fontSize:13, fontWeight:600, color:"#202124" }}>Signature — {acc.name||acc.email.split("@")[0]}</p><p style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>Used as <code style={{ background:"#f1f3f4", padding:"1px 5px", borderRadius:4, fontSize:10 }}>{"{{Account Signature}}"}</code></p></div>{hasSig && <button onClick={()=>onSignatureChange(acc.id,"")} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:8, padding:"4px 10px", fontSize:11 }}>Clear</button>}</div><SignatureEditor key={acc.id} value={signatures[acc.id]||""} onChange={html=>onSignatureChange(acc.id,html)}/>{hasSig && <div style={{ marginTop:10, padding:"10px 14px", background:"#fff", border:"1px dashed #e0e0e0", borderRadius:10 }}><p style={{ fontSize:10, color:"#6B7280", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Preview</p><div style={{ fontSize:13 }} dangerouslySetInnerHTML={{ __html:signatures[acc.id] }}/></div>}</div>}
                {delayOpen && <div style={{ margin:"0 24px 16px", padding:16, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:14 }}><DelayPanel key={acc.id+":delay"} accId={acc.id} accName={acc.name||acc.email.split("@")[0]} initialMin={accSet.minDelay} initialMax={accSet.maxDelay} onChange={(key,val)=>onAccountSettingChange(acc.id,key,val)}/></div>}
              </div> 
            );
          })}
          {tab==="add" && ( <div style={{ padding:"8px 24px" }}>{[{ icon:<Ic.Upload s={22} c="#fff"/>, label:"Import via CSV", sub:"Bulk add multiple accounts at once.", note:"✓ Recommended for multiple accounts", fn:()=>{ onClose(); onAddCSV(); } }, { icon:<Ic.Pen s={22} c="#fff"/>, label:"Add Manually", sub:"Add a single account with IMAP/SMTP config.", fn:()=>{ onClose(); onAddManual(); } }].map((item, i) => ( <div key={i} style={{ border:"1px solid #e0e0e0", borderRadius:14, padding:"20px", marginBottom:14, cursor:"pointer", background:"#fff", transition:"all 0.18s" }} onClick={item.fn} onMouseEnter={e=>{ e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.transform="translateY(-1px)"; }} onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.transform="translateY(0)"; }}><div style={{ display:"flex", alignItems:"center", gap:14 }}><div style={{ width:46, height:46, borderRadius:14, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</div><div><div style={{ fontSize:14, fontWeight:600, color:"#202124" }}>{item.label}</div><div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>{item.sub}</div>{item.note&&<div style={{ fontSize:11, color:"#1a73e8", marginTop:5, fontWeight:500 }}>{item.note}</div>}</div></div></div> ))}</div> )}
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #e0e0e0" }}><button onClick={onClose} style={{ width:"100%", background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:500 }}>Close</button></div>
      </div>
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────
const MailRow = memo(({ mail, isSelected, accColor, onSelect, onRightClick, onStar }) => (
  <div className="mail-row" onClick={()=>onSelect(mail)} onContextMenu={e=>onRightClick(e,mail)} style={{ padding:"11px 14px", cursor:"pointer", borderBottom:"1px solid #f1f3f4", background:isSelected?"#eff6ff":"transparent", position:"relative", transition:"background 0.1s" }}>
    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
      <div style={{ position:"relative" }}><Avatar name={mail.from&&mail.from.name} email={mail.from&&mail.from.email} color={accColor} size={34}/>{!mail.read && <div style={{ position:"absolute", top:-1, right:-1, width:8, height:8, borderRadius:"50%", background:"#1a73e8", border:"2px solid #fff" }}/>}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2 }}><span style={{ fontSize:13, fontWeight:mail.read?400:600, color:mail.read?"#6B7280":"#1a2535", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{(mail.from&&mail.from.name)||(mail.from&&mail.from.email)||"Unknown"}</span><span style={{ fontSize:10, color:"#9CA3AF", flexShrink:0, marginLeft:8 }}>{formatDate(mail.date)}</span></div>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}><TypeBadge type={mail.type}/><span style={{ fontSize:12, color:mail.read?"#9CA3AF":"#374151", fontWeight:mail.read?400:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mail.subject||"(no subject)"}</span></div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><span style={{ fontSize:11, color:"#9CA3AF", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{stripPreview(mail.preview)}</span><div style={{ display:"flex", gap:3, marginLeft:4 }}>{mail.hasAttachment && <span style={{ color:"#9CA3AF", fontSize:10 }}>📎</span>}<button className="star-btn" onClick={e=>{e.stopPropagation();onStar(mail,e);}} style={{ background:"none", border:"none", cursor:"pointer", opacity:mail.starred?1:0, fontSize:13, color:mail.starred?"#F59E0B":"#d1d5db", padding:"0 2px", transition:"all 0.15s" }}>★</button></div></div>
      </div>
    </div>
  </div>
));

const ROW_H = 74;
const VirtualMailList = memo(({ mails, selectedMailId, accounts, onSelect, onRightClick, onStar }) => {
  const outerRef = useRef(null); const rafRef = useRef(null); const [scrollTop, setScrollTop] = useState(0); const [containerH, setContainerH] = useState(600);

  useEffect(() => { if (!outerRef.current) return; const ro = new ResizeObserver(entries => { if (entries[0]) setContainerH(entries[0].contentRect.height); }); ro.observe(outerRef.current); setContainerH(outerRef.current.clientHeight || 600); return () => ro.disconnect(); },[]);
  const handleScroll = useCallback(() => { if (!outerRef.current) return; const top = outerRef.current.scrollTop; if (rafRef.current) return; rafRef.current = requestAnimationFrame(() => { setScrollTop(top); rafRef.current = null; }); },[]);
  useEffect(() => { const el = outerRef.current; if (!el) return; el.addEventListener("scroll", handleScroll, { passive:true }); return () => el.removeEventListener("scroll", handleScroll); }, [handleScroll]);

  const { visibleMails, offsetTop, totalH } = useMemo(() => { const BUFFER = 8, total = mails.length * ROW_H; const start = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER); const end = Math.min(mails.length, Math.ceil((scrollTop + containerH) / ROW_H) + BUFFER); return { visibleMails:mails.slice(start,end), offsetTop:start*ROW_H, totalH:total }; }, [mails, scrollTop, containerH]);
  const accColorMap = useMemo(() => { const map = {}; accounts.forEach((a, i) => { map[a.id] = getColor(i); }); return map; }, [accounts]);

  return ( <div ref={outerRef} style={{ flex:1, overflowY:"auto", position:"relative" }}><div style={{ height:totalH, position:"relative" }}><div style={{ position:"absolute", top:offsetTop, left:0, right:0 }}>{visibleMails.map(mail => ( <MailRow key={mail.id} mail={mail} isSelected={selectedMailId===mail.id} accColor={accColorMap[mail.accountId]||"#6B7280"} onSelect={onSelect} onRightClick={onRightClick} onStar={onStar}/> ))}</div></div></div> );
});

function ComposeModal({ accounts, defaultAccountId, replyTo, onClose, onSent }) {
  const availableAccs = accounts && accounts.length ? accounts : [];
  const defaultAccIdSafe = defaultAccountId || (availableAccs[0] ? availableAccs[0].id : "");

  const [from, setFrom] = useState(defaultAccIdSafe);
  const [to, setTo] = useState((replyTo&&replyTo.from&&replyTo.from.email)||"");
  const [cc, setCc] = useState(""); 
  const [bcc, setBcc] = useState(""); 
  const [subject, setSubject] = useState(replyTo?"RE: "+(replyTo.subject||""):""); 
  const [sending, setSending] = useState(false); 
  const [showCc, setShowCc] = useState(false); 
  const [showBcc, setShowBcc] = useState(false); 
  const [error, setError] = useState(""); 
  
  const editorRef = useRef(null);

  const replyHTML = replyTo 
      ? '<br><br><div style="margin-top:24px"><hr tabindex="-1" style="display:inline-block; width:100%; border:0; border-top:1px solid #b5c4df;" /></div>' +
        '<div dir="ltr" style="font-family:Calibri,sans-serif; font-size:11pt; color:#000; line-height:1.5; margin-bottom:16px;">' +
        '<b>From:</b> ' + (replyTo.from?.name ? replyTo.from.name + ' &lt;' + replyTo.from.email + '&gt;' : replyTo.from?.email || "") + '<br>' +
        '<b>Sent:</b> ' + new Date(replyTo.date).toLocaleString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}) + '<br>' +
        '<b>To:</b> ' + (replyTo.to?.map(t=>t.name?`${t.name} <${t.email}>`:t.email).join(', ') || "") + '<br>' +
        '<b>Subject:</b> ' + (replyTo.subject||"") + 
        '</div>' +
        '<div>' + (replyTo.body||replyTo.preview||"") + '</div>'
      : '';
  
  const handleSend = async () => { 
    if (availableAccs.length === 0) return setError("Please add a sender account to compose.");
    if (!from) return setError("A Sender ID account is absolutely required.");
    if (!to.trim()) return setError("To field is required."); 
    if (!subject.trim()) return setError("Subject is required."); 
    const html = editorRef.current ? editorRef.current.innerHTML : ""; 
    if (!html || html === "<br>" || html.trim() === "") return setError("Message body cannot be empty."); 
    
    setSending(true); setError(""); 
    
    try { 
      await apiFetch("/accounts/" + senderId + "/send", { method: "POST", timeout: 120000, body: JSON.stringify({ to: historyNode.toEmail, cc: "", bcc: "", subject: resolvedSubject, body: threadedHTML, replyTo: null }) });
      onSent && onSent(); 
      onClose(); 
    } catch(e) { 
      setError(e.message); 
    } finally { 
      setSending(false); 
    } 
  };

  const FR = { display:"flex", alignItems:"center", borderBottom:"1px solid #f1f3f4" }; 
  const FI = { flex:1, background:"transparent", border:"none", color:"#202124", padding:"10px 16px", fontSize:13, outline:"none" }; 
  const CB = (a) => ({ background:a?"#eff6ff":"transparent", border:"none", borderRadius:4, color:a?"#1a73e8":"#9CA3AF", cursor:"pointer", padding:"4px 10px", fontSize:12, fontWeight:500, marginRight:2 });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.38)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#fff", borderRadius:12, width:"min(90vw,1080px)", height:"min(88vh,750px)", display:"flex", flexDirection:"column", boxShadow:"0 8px 40px rgba(0,0,0,0.22)", overflow:"hidden" }}>
        
        {/* CHANGED TO BLUE HEADER */}
        <div style={{ padding:"12px 18px", background:"#1a73e8", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ fontSize:15, fontWeight:600, color:"#fff", flex:1 }}>{replyTo?"Reply":"New Message"}</span>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#fff", cursor:"pointer", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}><Ic.X s={14} c="#fff"/></button>
        </div>

        <div style={{ flexShrink:0, borderBottom:"1px solid #e0e0e0" }}>
          <div style={FR}><select value={from} onChange={e=>setFrom(e.target.value)} style={{ flex:1, background:"transparent", border:"none", color:"#202124", padding:"10px 16px", fontSize:13, outline:"none", cursor:"pointer" }}>{availableAccs.map(a => <option key={a.id} value={a.id}>{a.name?""+a.name+" <"+a.email+">":a.email}</option>)}</select><div style={{ display:"flex", paddingRight:12 }}><button onClick={()=>setShowCc(!showCc)} style={CB(showCc)}>CC</button><button onClick={()=>setShowBcc(!showBcc)} style={CB(showBcc)}>BCC</button></div></div>
          <div style={FR}><input value={to} onChange={e=>setTo(e.target.value)} placeholder="To" style={FI}/></div>{showCc && <div style={FR}><input value={cc} onChange={e=>setCc(e.target.value)} placeholder="CC" style={FI}/></div>}{showBcc && <div style={FR}><input value={bcc} onChange={e=>setBcc(e.target.value)} placeholder="BCC" style={FI}/></div>}<div style={{ ...FR, borderBottom:"none" }}><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" style={{ ...FI, fontSize:14, fontWeight:500 }}/></div>
        </div>
        {error && <div style={{ padding:"7px 16px", background:"rgba(239,68,68,0.06)", borderBottom:"1px solid rgba(239,68,68,0.12)", flexShrink:0, display:"flex", alignItems:"center", gap:6 }}><Ic.Alert s={13} c="#EF4444"/><span style={{ fontSize:12, color:"#EF4444" }}>{error}</span></div>}
        
        {/* Editor remains identical to campaign pitch editor automatically */}
        <RichEditor editorRef={editorRef} initialHTML={replyHTML}/>
        
        <div style={{ padding:"10px 18px", borderTop:"1px solid #e0e0e0", display:"flex", alignItems:"center", background:"#fff", flexShrink:0 }}><button onClick={onClose} style={{ background:"transparent", border:"1px solid #e0e0e0", color:"#555", cursor:"pointer", borderRadius:20, padding:"7px 18px", fontSize:13, fontWeight:500 }}>Discard</button><button onClick={handleSend} disabled={sending} style={{ marginLeft:"auto", background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:20, padding:"8px 24px", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}><Ic.Send s={13} c="#fff"/>{sending?"Sending...":"Send"}</button></div>
      </div>
    </div>
  );
}

// ── NEW DEDICATED LIVE LOG VIEWER COMPONENT ──
const LiveLogViewer = ({ campId, engineRefs }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const logs = (engineRefs.current[campId] && engineRefs.current[campId].logs) ? engineRefs.current[campId].logs : [];

  return (
    <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:2, background:"#f8f9fa", borderRadius:12, padding:8, border:"1px solid #e0e0e0" }}>
      <div style={{ display:"grid", gridTemplateColumns:"50px minmax(120px,1fr) minmax(120px,1fr) 140px", gap:8, padding:"8px 12px", fontSize:11, color:"#6B7280", fontWeight:700, textTransform:"uppercase", borderBottom:"1px solid #e0e0e0", position:"sticky", top:0, background:"#f8f9fa", zIndex:2 }}>
        <span>Row</span><span>Sender ✉</span><span>Recipient</span><span>Status</span>
      </div>
      {logs.length === 0 ? (
        <div style={{ padding:40, textAlign:"center", color:"#9CA3AF", fontSize:13 }}>
          Initiating execution queues...
        </div>
      ) : (
        logs.map((log, i) => {
          const waitTime = log.wakeTime ? Math.max(0, Math.ceil((log.wakeTime - Date.now()) / 1000)) : 0;
          return (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"50px minmax(120px,1fr) minmax(120px,1fr) 140px", gap:8, padding:"8px 12px", borderRadius:8, background:"#fff", border:"1px solid #f1f3f4", fontSize:12, alignItems:"center" }}>
              <span style={{ color:"#9CA3AF", fontFamily:"monospace" }}>{log.row}</span>
              <span style={{ color:"#202124", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.fromEmail}</span>
              <span style={{ color:"#1a73e8", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{log.email}</span>
              <span style={{ fontWeight:800, fontFamily:"monospace", fontSize:11, color: log.status==="error"?"#EF4444":log.status==="sent"?"#22c55e":"#D97706" }}>
                {log.status === "error" ? "❌ ERR" : 
                 log.status === "sent" ? "✅ SENT" : 
                 log.status === "sending" ? "⚡ SENDING..." :
                 `⏱ WAIT [${String(Math.floor(waitTime/60)).padStart(2,"0")}:${String(waitTime%60).padStart(2,"0")}]`}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

// ── Campaigns Page ───────────────────────────────────────────────────────────
function CampaignsPage({ accounts, signatures, accountSettings, campaigns, onUpdateCampaigns, getColor, isVisible }) {
  const [selectedId,      setSelectedId]      = useState(null);
  const [tab,             setTab]             = useState("csv");
  const [fuTab,           setFuTab]           = useState("pitch");
  const [previewRow,      setPreviewRow]      = useState(0);
  const [fuPreviewRow,    setFuPreviewRow]    = useState(0);
  const [previewSender,   setPreviewSender]   = useState(null);
  const [dragOver,        setDragOver]        = useState(false);
  const [editingName,     setEditingName]     = useState(false);
  const [fuSubject,       setFuSubject]       = useState("");
  const [showSkipPopup,   setShowSkipPopup]   = useState(false);
  
  // NEW SEARCH HOOKS
  const [senderSearch,    setSenderSearch]    = useState("");
  const [csvSearch,       setCsvSearch]       = useState("");
  const [historySearch,   setHistorySearch]   = useState("");

  const [progressMap,     setProgressMap]     = useState({});
  const engineRefs = useRef({}); 

  const pitchRef   = useRef(null);
  const fuPitchRef = useRef(null);
  const csvFileRef = useRef(null);

  const selected = campaigns.find(c => c.id === selectedId) || null;

  useEffect(() => {
    if (!selectedId) return;
    const camp = campaigns.find(c => c.id === selectedId);
    if (!camp) return;
    try { const t = localStorage.getItem("mailOS_tab_" + selectedId); if (t) setTab(t); } catch(e) {}
    try { const fs = localStorage.getItem("mailOS_draft_fu_subject_" + selectedId); setFuSubject(fs != null ? fs : camp.fuSubject || ""); } catch(e) { setFuSubject(camp.fuSubject || ""); }
  }, [selectedId]);

  const getSendHistory  = (id) => { try { return JSON.parse(localStorage.getItem("mailOS_history_" + id) || "[]"); } catch(e) { return[]; } };
  const update          = (updates) => { if (!selected) return; onUpdateCampaigns(campaigns.map(c => c.id === selected.id ? { ...c, ...updates } : c)); };
  const savePitch       = () => { if (pitchRef.current)   update({ pitch:   pitchRef.current.innerHTML   || "" }); };
  const saveFuPitch     = () => { if (fuPitchRef.current) update({ fuPitch: fuPitchRef.current.innerHTML || "", fuSubject }); };

  const parseEmails = (text) => {
    if (!text) return new Set();
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(regex) || [];
    return new Set(matches.map(m => m.toLowerCase()));
  };

  const newCampaign = () => {
    const id = "camp_" + Date.now();
    const c  = { id, name:"Untitled Campaign", subject:"", emailCol:-1, csvHeaders:[], csvRows:[], pitch:"", fuPitch:"", fuSubject:"", skipListText:"", senderIds:[], status:"draft" };
    onUpdateCampaigns([...campaigns, c]);
    setSelectedId(id); setTab("csv");
  };

  const deleteCampaign = (id) => {
    ["mailOS_sentRows_","mailOS_history_","mailOS_draft_pitch_","mailOS_draft_fu_pitch_","mailOS_draft_fu_subject_","mailOS_tab_"].forEach(k => { try { localStorage.removeItem(k + id); } catch(e) {} });
    onUpdateCampaigns(campaigns.filter(c => c.id !== id));
    if (selectedId === id) { setSelectedId(null); }
  };

  const buildRowMap = (rowIdx, camp) => {
    const map = {}, src = camp || selected;
    if (!src || !src.csvHeaders || !src.csvRows) return map;
    const rowObj = src.csvRows[rowIdx] ||[];
    src.csvHeaders.forEach((h, i) => { if(h) { map[String(h).trim().toLowerCase()] = rowObj[i] || ""; }});
    return map;
  };

  const buildRowMapArr = (rowArr, headers) => {
    const map = {};
    (headers ||[]).forEach((h, i) => { if(h) { map[String(h).trim().toLowerCase()] = (rowArr || [])[i] || ""; }});
    return map;
  };

  const resolveAll = (text, rowMap, passes = 5) => {
    let out = typeof text === "string" ? text : ""; 
    for (let p = 0; p < passes; p++) {
      const prev = out;
      out = out.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (m, name) => { const k = String(name).trim().toLowerCase(); return k in rowMap ? rowMap[k] : m; });
      if (out === prev) break;
    }
    return out;
  };

  const resolvePitch = (html, rowIdx, senderId) => {
    if (!selected || !html) return html || "";
    const rowMap = buildRowMap(rowIdx);
    let out = resolveAll(html, rowMap);
    const sig = senderId && signatures[senderId] ? signatures[senderId] : '<em style="color:#9CA3AF">[Signature]</em>';
    out = out.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, sig);
    out = out.replace(/\{\{([^}]+)\}\}/g, '<span style="background:#fef3c7;color:#D97706;padding:1px 4px;border-radius:4px;font-family:monospace;font-size:0.85em">{{$1}}</span>');
    return out;
  };

  const handleCSVFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { const { headers, rows } = parseCampaignCSV(e.target.result); update({ csvHeaders:headers||[], csvRows:rows||[] }); setTab("pitch"); };
    reader.readAsText(file);
  };

  const toggleSender = (id) => {
    if (!selected) return;
    const ids = (selected.senderIds||[]).includes(id) ? (selected.senderIds||[]).filter(x => x !== id) :[...(selected.senderIds||[]), id];
    update({ senderIds:ids });
  };

  const insertPH = (name, targetRef) => {
    const el = targetRef.current; if (!el) return;
    const text = "{{" + name + "}}";
    
    el.focus();
    const sel = window.getSelection();
    
    if (sel && sel.rangeCount > 0) { 
      const r = sel.getRangeAt(0); 
      // Ensure the selection is actually inside the active editor
      if (!el.contains(r.commonAncestorContainer)) {
        const r2 = document.createRange(); r2.selectNodeContents(el); r2.collapse(false);
        sel.removeAllRanges(); sel.addRange(r2);
      }
    } else if (sel) {
      // Fallback to end of content
      const r2 = document.createRange(); r2.selectNodeContents(el); r2.collapse(false);
      sel.removeAllRanges(); sel.addRange(r2);
    }
    
    document.execCommand("insertText", false, text);
  };

  const getGlobalPairs  = ()      => { try { return new Set(JSON.parse(localStorage.getItem("mailOS_global_sent_pairs") || "[]")); } catch(e) { return new Set(); } };
  const addGlobalPair   = (se,te) => { try { const p = getGlobalPairs(); p.add((se||"").toLowerCase() + "::" + (te||"").toLowerCase()); localStorage.setItem("mailOS_global_sent_pairs", JSON.stringify([...p])); } catch(e) {} };

  const initEngine = (cId) => {
    if (!engineRefs.current[cId]) engineRefs.current[cId] = { abort: false, pause: false, logs: [], blocked: new Set() };
    engineRefs.current[cId].abort = false;
    engineRefs.current[cId].pause = false;
    engineRefs.current[cId].logs = [];
    engineRefs.current[cId].blocked = new Set();
  };

  const updateProg = (cId, payload) => {
    setProgressMap(prev => {
      const cur = prev[cId] || {};
      return { ...prev, [cId]: { ...cur, ...payload } };
    });
  };

  const individualDelay = async (ms, cId) => {
      const eRef = engineRefs.current[cId];
      let endTime = Date.now() + ms;
      while(Date.now() < endTime) {
         if(eRef.abort) return false;
         while(eRef.pause && !eRef.abort) { await new Promise(r => setTimeout(r, 200)); endTime += 200; }
         if(eRef.abort) return false;
         await new Promise(r => setTimeout(r, Math.min(250, Math.max(10, endTime - Date.now()))));
      }
      return true;
  }

  // ── PARALLEL OUTREACH FIRST TOUCH ENGINE ──
  const sendCampaign = async () => {
    const cId = selectedId;
    const snap = { ...selected, pitch:(pitchRef.current ? pitchRef.current.innerHTML : "") || selected.pitch || "" };
    if (!snap.pitch.replace(/<[^>]+>/g,"").trim()) return alert("Pitch is empty.");
    if (!snap.subject || !snap.subject.trim()) return alert("Subject line is required.");
    const emailCol = snap.emailCol >= 0 ? snap.emailCol : (snap.csvHeaders||[]).findIndex(h => /email|mail/i.test(h||""));
    if (emailCol < 0) return alert("No email column found.");
    const validSenders = snap.senderIds ||[];
    if (validSenders.length === 0) return alert("Select at least one sender.");

    const rows = snap.csvRows ||[];
    const sentKey = "mailOS_sentRows_" + snap.id;
    const initSent = (()=>{ try { return new Set(JSON.parse(localStorage.getItem(sentKey) || "[]")); } catch(e) { return new Set(); } })();
    
    // NEW: Shared Queue with Failover Tracking
    let sharedQueue = Array.from({length: rows.length}, (_,i)=>i)
      .filter(i => !initSent.has(i))
      .map(rowId => ({ rowId, failedSenders: new Set() }));

    if (sharedQueue.length === 0) return alert("Campaign already complete. Zero remaining prospects.");

    initEngine(cId);
    engineRefs.current[cId].errors = []; 
    setTab("progress"); 
    let masterSentTracker = initSent.size;
    updateProg(cId, { type: 'first', status: 'running', sent: masterSentTracker, total: rows.length, errors: [], startTime: new Date(), endTime: null });

    const getNextLead = (sId) => {
        for (let i = 0; i < sharedQueue.length; i++) {
            if (!sharedQueue[i].failedSenders.has(sId)) {
                return sharedQueue.splice(i, 1)[0]; 
            }
        }
        return null;
    };

    await Promise.all(validSenders.map(async (senderId) => {
        const eRef = engineRefs.current[cId];
        while (!eRef.abort && !eRef.blocked.has(senderId)) {
           while(eRef.pause && !eRef.abort) { await new Promise(r=>setTimeout(r, 200)); }
           if (eRef.abort || eRef.blocked.has(senderId)) return;
           
           const lead = getNextLead(senderId);
           if (!lead) break; 

           const taskRowId = lead.rowId;
           const targetEmail = ((rows[taskRowId]||[])[emailCol] || "").trim();
           if(!targetEmail) continue; 
           
           const targetAccData = accounts.find(a=>a.id === senderId) || {};
           const indyConfig = accountSettings[senderId] || {};
           const sMinMs = (indyConfig.minDelay != null ? indyConfig.minDelay : 60) * 1000;
           const sMaxMs = (indyConfig.maxDelay != null ? indyConfig.maxDelay : 180) * 1000;
           const delayMsWait = sMinMs + (Math.random()*(sMaxMs-sMinMs)); 

           eRef.logs = [{ row: taskRowId+1, email: targetEmail, fromEmail: targetAccData.email||senderId, status: "waiting", wakeTime: Date.now() + delayMsWait }, ...eRef.logs].slice(0, 2000);
           
           const didWakeCleanly = await individualDelay(delayMsWait, cId);
           if (!didWakeCleanly) return; 

           const idx = eRef.logs.findIndex(l => l.row === taskRowId+1);
           if (idx !== -1) eRef.logs[idx].status = "sending";
           updateProg(cId, {}); 

           const rowValuesMapping = buildRowMap(taskRowId, snap);
           let finalHTMLBody = resolveAll(snap.pitch, rowValuesMapping);
           const accLocalSignatureHTML = signatures[senderId] ? signatures[senderId] : "";
           finalHTMLBody = finalHTMLBody.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, accLocalSignatureHTML).replace(/\{\{[^}]+\}\}/g, "");
           const subjectStringMappedSafe = resolveAll(snap.subject||"", rowValuesMapping);

           try {
              await apiFetch("/accounts/" + senderId + "/send", { method:"POST", timeout: 120000, body:JSON.stringify({ to:targetEmail, subject:subjectStringMappedSafe, body:finalHTMLBody }) });
              
              initSent.add(taskRowId);
              masterSentTracker++; 
              try { localStorage.setItem(sentKey, JSON.stringify([...initSent])); } catch(e){}
              
              const hK = "mailOS_history_" + snap.id; 
              try { const sHT=JSON.parse(localStorage.getItem(hK)||"[]"); sHT.push({ rowIdx:taskRowId, sentAt:new Date().toISOString(), senderEmail:targetAccData.email||senderId, senderName:targetAccData.name||senderId, toEmail:targetEmail, subject:subjectStringMappedSafe, bodyHTML:finalHTMLBody, rowData:rows[taskRowId], touchType:"first" }); localStorage.setItem(hK, JSON.stringify(sHT)); } catch(e) {}
              addGlobalPair(targetAccData.email||senderId, targetEmail);
              
              const idx2 = eRef.logs.findIndex(l => l.row === taskRowId+1);
              if(idx2 !== -1) eRef.logs[idx2].status = "sent";
              updateProg(cId, { sent: masterSentTracker });
           } catch(apiExcp) {
              const strErrTypeMapped = parseSmtpError(apiExcp.message);
              eRef.errors = [{ senderEmail: targetAccData.email||senderId, toEmail: targetEmail, reason: strErrTypeMapped }, ...eRef.errors].slice(0, 50);
              
              const idx2 = eRef.logs.findIndex(l => l.row === taskRowId+1);
              if(idx2 !== -1) { eRef.logs[idx2].status = "error"; eRef.logs[idx2].reason = strErrTypeMapped; }
              
              lead.failedSenders.add(senderId);
              
              if(shouldBlockSender(strErrTypeMapped)) {
                 eRef.blocked.add(senderId);
                 if (lead.failedSenders.size < validSenders.length) sharedQueue.push(lead); 
                 updateProg(cId, { errors: eRef.errors });
                 return; 
              }
              if (lead.failedSenders.size < validSenders.length) sharedQueue.push(lead); 
              updateProg(cId, { errors: eRef.errors });
           }
        }
    }));

    updateProg(cId, { status: engineRefs.current[cId].abort ? "stopped" : "done", endTime: new Date() });
    onUpdateCampaigns(campaigns.map(c => c.id === snap.id ? { ...c, status: masterSentTracker >= rows.length ? "sent" : c.status } : c));
  };

  // ── PARALLEL OUTREACH FOLLOW UP ENGINE ──
  const sendFollowup = async () => {
    if (!selected) return;
    const cId = selected.id;
    const fuBody = (fuPitchRef.current ? fuPitchRef.current.innerHTML : "") || selected.fuPitch || "";
    if (!fuBody.replace(/<[^>]+>/g,"").trim()) return alert("Write the follow-up pitch first."); 
    
    const blockList = parseEmails(selected.skipListText || "");
    const historyLogs = getSendHistory(cId);
    
    const firstTouches = historyLogs.filter(h => (!h.touchType || h.touchType === "first") && !blockList.has((h.toEmail || "").toLowerCase()));
    if (firstTouches.length === 0) return alert("No original send history records mapped! Cannot reply without an original root."); 

    const fuSentCache = new Set(historyLogs.filter(h => h.touchType === "followup").map(h => (h.toEmail||"").toLowerCase()));
    const pendingFuTouches = firstTouches.filter(h => !fuSentCache.has((h.toEmail||"").toLowerCase()));

    if (pendingFuTouches.length === 0) return alert("All valid recipients have already received a follow-up!");

    const queueBySender = {};
    selected.senderIds.forEach(sid => queueBySender[sid] = []);
    pendingFuTouches.forEach(h => {
       const acc = accounts.find(a => a.email === h.senderEmail);
       if (acc && selected.senderIds.includes(acc.id)) queueBySender[acc.id].push(h);
    });

    initEngine(cId);
    engineRefs.current[cId].errors = [];
    setTab("progress"); 
    let masterFuSent = 0;
    updateProg(cId, { type: 'fu', status: 'running', sent: 0, total: pendingFuTouches.length, errors: [], startTime: new Date(), endTime: null });
    
    await Promise.all(selected.senderIds.map(async (senderId) => {
        const eRef = engineRefs.current[cId];
        const myQueue = queueBySender[senderId];
        if (!myQueue || myQueue.length === 0) return;

        for (let i = 0; i < myQueue.length; i++) {
            if(eRef.abort || eRef.blocked.has(senderId)) return;
            while(eRef.pause && !eRef.abort) await new Promise(r=>setTimeout(r, 200)); 
            if(eRef.abort) return;

            const historyNode = myQueue[i];
            const senderConfig = accountSettings[senderId] || {};
            
            const minMs = (senderConfig.minDelay != null ? senderConfig.minDelay : 60) * 1000;
            const maxMs = (senderConfig.maxDelay != null ? senderConfig.maxDelay : 180) * 1000;
            const delayMsWait = minMs + Math.round(Math.random()*(maxMs-minMs)); 

            eRef.logs = [{ row: historyNode.rowIdx+1, email: historyNode.toEmail, fromEmail: historyNode.senderEmail, status: "waiting", wakeTime: Date.now() + delayMsWait }, ...eRef.logs].slice(0, 2000);
            
            const didWakeCleanly = await individualDelay(delayMsWait, cId);
            if (!didWakeCleanly) return; 

            const idx1 = eRef.logs.findIndex(l => l.row === historyNode.rowIdx+1);
            if (idx1 !== -1) eRef.logs[idx1].status = "sending";
            updateProg(cId, {});

            const rmTargetAlloc = buildRowMapArr(historyNode.rowData||[], selected.csvHeaders||[]);
            let activeBodyHTML = resolveAll(fuBody, rmTargetAlloc);
            const signatureHTML = signatures[senderId] ? signatures[senderId] : "";
            
            activeBodyHTML = activeBodyHTML.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, signatureHTML).replace(/\{\{[^}]+\}\}/g, "");
            let cleanBody = activeBodyHTML.trim().replace(/(?:<p><br><\/p>|<p>&nbsp;<\/p>|<br\s*\/?>|&nbsp;|\s)+$/, "");

            const resolvedSubject = (fuSubject||"").trim() ? resolveAll(fuSubject||"", rmTargetAlloc) || fuSubject : "RE: " + (historyNode.subject||"");

            const sentDate = new Date(historyNode.sentAt);
            const formattedDate = sentDate.toLocaleDateString("en-US", {weekday:"long",year:"numeric",month:"long",day:"numeric"}) + " " + sentDate.toLocaleTimeString("en-US", {hour:"2-digit",minute:"2-digit",hour12:true});
            
            const threadedHTML = '<div style="font-family: Calibri, sans-serif; font-size: 11pt; color: #000000; margin: 0;">' + cleanBody + '</div>' +
                '<div style="margin-top: 12px; margin-bottom: 12px;">' +
                '<hr tabindex="-1" style="display: inline-block; width: 100%; border: 0; border-top: 1px solid #b5c4df;" />' +
                '</div>' +
                '<div dir="ltr" style="font-family: Calibri, sans-serif; font-size: 11pt; color: #000000; line-height: 1.5; margin-bottom: 16px;">' +
                '<b>From:</b> ' + (historyNode.senderName ? historyNode.senderName + ' &lt;' + historyNode.senderEmail + '&gt;' : historyNode.senderEmail) + '<br/>' +
                '<b>Sent:</b> ' + formattedDate + '<br/>' +
                '<b>To:</b> ' + historyNode.toEmail + '<br/>' +
                '<b>Subject:</b> ' + historyNode.subject + 
                '</div>' +
                '<div>' + historyNode.bodyHTML + '</div>';

            try {
               await apiFetch("/accounts/" + senderId + "/send", { 
                   method: "POST", 
                   timeout: 120000, 
                   body: JSON.stringify({ 
                       to: historyNode.toEmail, 
                       cc: "", 
                       bcc: "", 
                       subject: resolvedSubject, 
                       body: threadedHTML, 
                       replyTo: null 
                   }) 
               });
               masterFuSent++;
               
               const idx2 = eRef.logs.findIndex(l => l.row === historyNode.rowIdx+1);
               if(idx2 !== -1) eRef.logs[idx2].status = "sent";
               
               try { const xHK = "mailOS_history_" + selected.id; const hsxTr = JSON.parse(localStorage.getItem(xHK)||"[]"); hsxTr.push({ rowIdx:historyNode.rowIdx, sentAt:new Date().toISOString(), senderEmail:historyNode.senderEmail, senderName:historyNode.senderName, toEmail:historyNode.toEmail, subject:resolvedSubject, bodyHTML:threadedHTML, rowData:historyNode.rowData||[], touchType:"followup" }); localStorage.setItem(xHK, JSON.stringify(hsxTr)); } catch(ee) {}

               updateProg(cId, { sent: masterFuSent });
            } catch (e) {
                const strErr = parseSmtpError(e.message);
                eRef.errors = [{ senderEmail: historyNode.senderEmail, toEmail: historyNode.toEmail, reason: strErr }, ...eRef.errors].slice(0, 50);
                
                const idx3 = eRef.logs.findIndex(l => l.row === historyNode.rowIdx+1);
                if(idx3 !== -1) { eRef.logs[idx3].status = "error"; eRef.logs[idx3].reason = strErr; }
                
                if(shouldBlockSender(strErr)) {
                    eRef.blocked.add(senderId);
                    updateProg(cId, { errors: eRef.errors });
                    return; 
                }
                updateProg(cId, { errors: eRef.errors });
            }
        }
    }));

    updateProg(cId, { status: engineRefs.current[cId].abort ? "stopped" : "done", endTime: new Date() });
  };

  const togglePause = () => { if (!selectedId) return; const eRef = engineRefs.current[selectedId]; if (eRef) { eRef.pause = !eRef.pause; updateProg(selectedId, { status: eRef.pause ? "paused" : "running" }); }};
  const abortCampaign = () => { if (!selectedId) return; const eRef = engineRefs.current[selectedId]; if (eRef) { eRef.abort = true; eRef.pause = false; updateProg(selectedId, { status: "stopped", endTime: new Date() }); }};

  const selCSVHeaders = selected?.csvHeaders || [];
  const selCSVRows = selected?.csvRows ||[];
  const selSenderIds = selected?.senderIds ||[];
  
  const hasCSV     = selCSVHeaders.length > 0;
  const hasPitch   = selected && selected.pitch && selected.pitch.replace(/<[^>]+>/g,"").trim().length > 10;
  const hasSenders = selSenderIds.length > 0;
  
  const curProg = progressMap[selectedId];

  // LOGIC FOR SEARCH FILTERS IN TABS
  const senderTerms = senderSearch.toLowerCase().split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  const filteredAccounts = accounts.filter(acc => {
    if (senderTerms.length === 0) return true;
    return senderTerms.some(term => (acc.email || "").toLowerCase().includes(term) || (acc.name || "").toLowerCase().includes(term));
  });

  const csvTerms = csvSearch.toLowerCase().split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  const mappedCSVRows = selCSVRows.map((r, i) => ({ origIdx: i, data: r }));
  const filteredCSVRows = mappedCSVRows.filter(item => {
    if (csvTerms.length === 0) return true;
    const rowStr = (item.data || []).join(" ").toLowerCase();
    return csvTerms.some(term => rowStr.includes(term));
  });

  const TabBtn = ({ id, icon, label, done }) => (
    <button onClick={() => { 
      savePitch(); saveFuPitch(); setTab(id); 
      if (id === "followup") { setFuTab("pitch");  }
      try { if (selectedId) localStorage.setItem("mailOS_tab_" + selectedId, id); } catch(e) {} 
    }}
      style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 16px", fontSize:13, fontWeight:tab===id?600:400, color:tab===id?"#1a73e8":"#6B7280", borderBottom:tab===id?"2px solid #1a73e8":"2px solid transparent", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
      <span>{icon}</span>{label}
      {done && <span style={{ width:6, height:6, borderRadius:"50%", background:"#1a73e8" }}/>}
    </button>
  );

  return (
    <div style={{ display:isVisible?"flex":"none", flex:1, overflow:"hidden" }}>
      <div style={{ width:256, background:"#fff", borderRight:"1px solid #e0e0e0", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"16px 14px", borderBottom:"1px solid #e0e0e0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"#202124" }}>📢 Campaigns</span>
            <span style={{ fontSize:11, color:"#1a73e8" }}>{campaigns.length} total</span>
          </div>
          <button onClick={newCampaign} style={{ width:"100%", background:"#1a73e8", border:"none", borderRadius:10, color:"#fff", cursor:"pointer", padding:"9px 14px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>+ New Campaign</button>
        </div>
        <div style={{ flex:1, overflowY:"auto" }}>
          {campaigns.length === 0 && <div style={{ textAlign:"center", padding:"40px 16px", color:"#9CA3AF" }}><div style={{ fontSize:36, marginBottom:8 }}>📭</div><p style={{ fontSize:12 }}>No campaigns yet</p></div>}
          {campaigns.map(c => {
            const isActive = selectedId === c.id;
            return (
              <div key={c.id} onClick={() => { setSelectedId(c.id); setFuTab("pitch"); try { const t = localStorage.getItem("mailOS_tab_" + c.id); setTab(t || "csv"); } catch(e) { setTab("csv"); } }}
                style={{ padding:"12px 14px", cursor:"pointer", borderLeft:isActive?"3px solid #1a73e8":"3px solid transparent", background:isActive?"#eff6ff":"transparent", borderBottom:"1px solid #f1f3f4", transition:"all 0.12s" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8f9fa"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:"#1a73e8", marginTop:4 }}>{(c.csvRows||[]).length} rows · {(c.senderIds||[]).length} sender{(c.senderIds||[]).length!==1?"s":""}</div>
                    <div style={{ display:"flex", gap:4, marginTop:6 }}>
                      {[["CSV",(c.csvHeaders||[]).length>0],["Pitch",!!c.pitch],["Senders",(c.senderIds||[]).length>0]].map(([l,ok]) => (
                        <span key={l} style={{ fontSize:9, padding:"1px 5px", borderRadius:4, background:ok?"#dbeafe":"#f1f3f4", color:ok?"#1d4ed8":"#9CA3AF", fontWeight:600 }}>{ok?"✓":"○"} {l}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteCampaign(c.id); }} style={{ background:"none", border:"none", color:"#d1d5db", cursor:"pointer", fontSize:14, padding:"0 2px", marginLeft:4 }} onMouseEnter={e=>e.currentTarget.style.color="#EF4444"} onMouseLeave={e=>e.currentTarget.style.color="#d1d5db"}>×</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!selected ? (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
          <div style={{ fontSize:72, opacity:0.06 }}>📢</div>
          <p style={{ color:"#9CA3AF", fontSize:14, fontWeight:500 }}>Select or create a campaign</p>
          <button onClick={newCampaign} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:600 }}>+ New Campaign</button>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"14px 22px", borderBottom:"1px solid #e0e0e0", background:"#fff", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>📢</div>
            {editingName
              ? <input value={selected.name||""} autoFocus onChange={e=>update({name:e.target.value})} onBlur={()=>setEditingName(false)} onKeyDown={e=>{if(e.key==="Enter")setEditingName(false);}} style={{ fontSize:16, fontWeight:700, color:"#202124", border:"none", borderBottom:"2px solid #1a73e8", outline:"none", background:"transparent", flex:1 }}/>
              : <h2 onClick={()=>setEditingName(true)} style={{ fontSize:16, fontWeight:700, color:"#202124", cursor:"text", flex:1 }} title="Click to rename">{selected.name} ✎</h2>
            }
            <div style={{ display:"flex", gap:8 }}>
              <span style={{ fontSize:11, color:"#1a73e8", background:"#eff6ff", borderRadius:8, padding:"4px 10px" }}>{selCSVRows.length} recipients</span>
              {curProg && curProg.status === "running" && <span style={{ fontSize:11, color:curProg.type==="fu"?"#D97706":"#1a73e8", background:curProg.type==="fu"?"#fef3c7":"#eff6ff", borderRadius:8, padding:"4px 10px", fontWeight:600 }}>⚡ {curProg.type==="fu"?"Follow-up...":"Sending..."}</span>}
            </div>
          </div>

          <div style={{ display:"flex", borderBottom:"1px solid #e0e0e0", padding:"0 22px", overflowX:"auto", background:"#fff", flexShrink:0 }}>
            <TabBtn id="csv"      icon={<Ic.Upload s={13}/>} label="CSV"             done={hasCSV}/>
            <TabBtn id="pitch"    icon={<Ic.Pen s={13}/>}    label="Pitch"           done={hasPitch}/>
            <TabBtn id="senders"  icon={<Ic.Users s={13}/>}  label="Senders"         done={hasSenders}/>
            <TabBtn id="preview"  icon={<Ic.Eye s={13}/>}    label="Preview & Send"  done={false}/>
            <TabBtn id="followup" icon={<Ic.Reply s={13}/>}  label="Follow-up"       done={false}/>
            <TabBtn id="history"  icon={<Ic.Check s={13}/>}  label="History"         done={false}/>
            {curProg && (
              <TabBtn id="progress" icon={<Ic.Zap s={13}/>} label="Live Progress" done={false}/>
            )}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"22px" }}>
            {tab==="csv" && (
              <div>
                <div style={{ marginBottom:18 }}><h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Upload Recipients CSV</h3><p style={{ fontSize:12, color:"#6B7280" }}>Column headers become placeholders like <code style={{ background:"#f1f3f4", padding:"1px 6px", borderRadius:5, fontSize:11 }}>{"{{Column Name}}"}</code></p></div>
                <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleCSVFile(e.dataTransfer.files[0]);}} onClick={()=>csvFileRef.current&&csvFileRef.current.click()}
                  style={{ border:"2px dashed " + (dragOver?"#1a73e8":selCSVHeaders.length?"#93c5fd":"#d1d5db"), borderRadius:16, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:selCSVHeaders.length?"#f0f9ff":"#fafafa", transition:"all 0.18s" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>{selCSVHeaders.length > 0 ? <Ic.Check s={36} c="#1a73e8"/> : <Ic.Folder s={36} c="#9CA3AF"/>}</div>
                  {selCSVHeaders.length > 0
                    ? <><p style={{ fontSize:13, fontWeight:700, color:"#202124", marginBottom:4 }}>CSV loaded — {selCSVRows.length} recipients, {selCSVHeaders.length} columns</p><p style={{ fontSize:11, color:"#6B7280" }}>Click or drag to replace</p></>
                    : <><p style={{ fontSize:14, fontWeight:600, color:"#202124", marginBottom:6 }}>Drop your CSV here</p><p style={{ fontSize:12, color:"#1a73e8" }}>or click to browse</p></>
                  }
                  <input ref={csvFileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>handleCSVFile(e.target.files&&e.target.files[0])}/>
                </div>
                {selCSVHeaders.length > 0 && (<>
                  <div style={{ display:"flex", gap:8, marginTop:10 }}>
                    <button onClick={e=>{e.stopPropagation();csvFileRef.current&&csvFileRef.current.click();}} style={{ flex:1, background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", borderRadius:10, padding:"7px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>🔄 Replace CSV</button>
                    <button onClick={e=>{e.stopPropagation();update({csvHeaders:[],csvRows:[],emailCol:-1});}} style={{ flex:1, background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", borderRadius:10, padding:"7px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Clear CSV</button>
                  </div>
                  <div style={{ marginTop:16, marginBottom:16 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:"#6B7280", marginBottom:8 }}>📌 Placeholders (click to copy):</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {selCSVHeaders.map(hdr => <button key={hdr} onClick={()=>navigator.clipboard&&navigator.clipboard.writeText("{{"+hdr+"}}")} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{"}{hdr}{"}}"}</button>)}
                      <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText("{{Account Signature}}")} style={{ background:"#fef3c7", border:"1px solid #fcd34d", color:"#D97706", borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{Account Signature}}"}</button>
                    </div>
                  </div>
                  
                  <div style={{ border:"1px solid #e0e0e0", borderRadius:14, overflow:"hidden" }}>
                    <div style={{ padding:"10px 14px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#6B7280" }}>Preview</span>
                      <span style={{ fontSize:11, color:"#1a73e8" }}>{selCSVRows.length} rows · {selCSVHeaders.length} cols</span>
                    </div>
                    {/* CSV SEARCH BAR */}
                    <div style={{ padding: "8px 14px", borderBottom: "1px solid #e0e0e0", background: "#fff" }}>
                      <input value={csvSearch} onChange={e => setCsvSearch(e.target.value)} placeholder="Search recipients in CSV..." style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 12, outline: "none" }} />
                    </div>
                    
                    <div style={{ overflowX:"auto", maxHeight:300, overflowY:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                        <thead style={{ position:"sticky", top:0 }}><tr style={{ background:"#f8f9fa" }}>
                          <th style={{ padding:"7px 10px", textAlign:"left", color:"#6B7280", borderBottom:"1px solid #e0e0e0", fontSize:10 }}>#</th>
                          {selCSVHeaders.map((h,kxxIdx) => <th key={`hk${kxxIdx}`} style={{ padding:"7px 10px", textAlign:"left", color:"#202124", fontWeight:700, borderBottom:"1px solid #e0e0e0", fontSize:10, fontFamily:"monospace" }}>{"{{"}{h}{"}}"}</th>)}
                        </tr></thead>
                        <tbody>{filteredCSVRows.map((item) => (
                          <tr key={`rv${item.origIdx}`} style={{ borderBottom:"1px solid #f1f3f4", background:item.origIdx%2===0?"transparent":"#fafafa" }}>
                            <td style={{ padding:"6px 10px", color:"#9CA3AF", fontFamily:"monospace" }}>{item.origIdx+1}</td>
                            {selCSVHeaders.map((_,ci) => <td key={`cd${ci}`} style={{ padding:"6px 10px", color:"#202124", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{(item.data||[])[ci]||""}</td>)}
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                  <div style={{ marginTop:16, textAlign:"right" }}><button onClick={()=>setTab("pitch")} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Next: Write Pitch →</button></div>
                </>)}
              </div>
            )}

            {tab==="pitch" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#202124" }}>Write Your Pitch</h3>
                <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"12px 16px" }}>
                  <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Subject Line <span style={{ color:"#EF4444" }}>*</span></label>
                  <input value={selected.subject||""} onChange={e=>update({subject:e.target.value})} placeholder="e.g. Quick question about {{Company Name}}" style={{ width:"100%", height:36, border:"1px solid #e0e0e0", borderRadius:8, fontSize:13, color:"#202124", background:"#fafafa", padding:"0 12px", outline:"none" }}/>
                </div>
                {selCSVHeaders.length > 0 && (
                  <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"10px 14px" }}>
                    <p style={{ fontSize:11, color:"#9CA3AF", marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Click to insert at cursor</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {selCSVHeaders.map((hdr,khiidx) => (
                        <button key={`hx_${khiidx}`} onMouseDown={e => { e.preventDefault(); insertPH(hdr, pitchRef); }} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>
                          {"{{"}{hdr}{"}}"}
                        </button>
                      ))}
                      <button onMouseDown={e => { e.preventDefault(); insertPH("Account Signature", pitchRef); }} style={{ background:"#fef3c7", border:"1px solid #fcd34d", color:"#D97706", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>
                        {"{{Account Signature}}"}
                      </button>
                    </div>
                  </div>
                )}
                <div style={{ border:"1px solid #e0e0e0", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:420, background:"#fff" }}>
                  <RichEditor key={selected.id} editorRef={pitchRef} initialHTML={(()=>{ try { const d = localStorage.getItem("mailOS_draft_pitch_" + selected.id); return d != null ? d : selected.pitch || ""; } catch(e) { return selected.pitch || ""; } })()} onChange={html=>{ try { localStorage.setItem("mailOS_draft_pitch_" + selected.id, html); } catch(e) {} }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <button onClick={()=>{ update({ pitch:(pitchRef.current?pitchRef.current.innerHTML:"")||"", subject:selected.subject||"" }); alert("Saved ✓"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:600 }}>💾 Save Pitch</button>
                  <button onClick={()=>{ update({ pitch:(pitchRef.current?pitchRef.current.innerHTML:"")||"", subject:selected.subject||"" }); setTab("senders"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Next: Senders →</button>
                </div>
              </div>
            )}

            {tab==="senders" && (
              <div>
                <div style={{ marginBottom:18 }}><h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Select Sender Accounts</h3></div>
                
                {/* BULK SEARCH TEXTAREA */}
                <div style={{ marginBottom: 16 }}>
                  <textarea
                    value={senderSearch}
                    onChange={e => setSenderSearch(e.target.value)}
                    placeholder="Search or paste sender emails here (separated by commas or new lines) to easily filter and bulk select..."
                    style={{ width: "100%", height: 80, padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "monospace", color: "#202124", background: "#fcfcfc" }}
                  />
                </div>

                <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                  <button onClick={()=>update({senderIds: [...new Set([...selSenderIds, ...filteredAccounts.map(a => a.id)])]})} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#6B7280", cursor:"pointer", borderRadius:9, padding:"6px 14px", fontSize:12 }}>Select Filtered</button>
                  <button onClick={()=>update({senderIds: selSenderIds.filter(id => !filteredAccounts.find(a => a.id === id))})} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#6B7280", cursor:"pointer", borderRadius:9, padding:"6px 14px", fontSize:12 }}>Deselect Filtered</button>
                  <span style={{ fontSize:12, color:"#1a73e8", alignSelf:"center" }}>{selSenderIds.length} of {accounts.length} total selected</span>
                </div>
                
                {filteredAccounts.length === 0
                  ? <div style={{ textAlign:"center", padding:"40px", color:"#9CA3AF" }}><p>No matching accounts found.</p></div>
                  : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {filteredAccounts.map((acc, ai) => {
                        const color = getColor(ai);
                        const isSel = selSenderIds.includes(acc.id);
                        const isBlocked = engineRefs.current[selectedId]?.blocked?.has(acc.id) || false;
                        
                        return (
                          <div key={acc.id} onClick={()=>toggleSender(acc.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:isSel?"2px solid "+color:"2px solid #e0e0e0", borderRadius:14, cursor:"pointer", background:isSel?color+"0d":"#fafafa", opacity:isBlocked?0.5:1, transition:"all 0.15s" }}>
                            <div style={{ width:20, height:20, borderRadius:6, border:isSel?"2px solid "+color:"2px solid #d1d5db", background:isSel?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{isSel && <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>✓</span>}</div>
                            <div style={{ width:42, height:42, borderRadius:"50%", background:color+"18", border:"2px solid "+color+"44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color, flexShrink:0 }}>{(acc.name||acc.email||"?").slice(0,2).toUpperCase()}</div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, fontWeight:600, color:isSel?color:"#202124" }}>{acc.email}</div>
                              <div style={{ fontSize:11, color:"#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{acc.name||acc.email.split("@")[0]}</div>
                            </div>
                            {isBlocked ? <span style={{ fontSize:10, background:"rgba(239,68,68,0.08)", color:"#EF4444", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>⛔ Blocked</span>
                            : signatures[acc.id] ? <span style={{ fontSize:10, background:"#fef3c7", color:"#D97706", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>✍ Sig</span>
                            : <span style={{ fontSize:10, background:"#f1f3f4", color:"#9CA3AF", borderRadius:6, padding:"2px 7px" }}>No sig</span>}
                          </div>
                        );
                      })}
                    </div>
                }
                {selSenderIds.length > 0 && <div style={{ marginTop:18, textAlign:"right" }}><button onClick={()=>setTab("preview")} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Next: Preview →</button></div>}
              </div>
            )}

            {tab==="preview" && (
              <div>
                <div style={{ marginBottom:18 }}><h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Preview & Send</h3></div>
                
                <div style={{ marginBottom:16, padding:"14px 16px", background:"#fff", border:"1px solid #e0e0e0", borderRadius:14 }}>
                  <div style={{ marginBottom:12 }}>
                    <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Subject <span style={{ color:"#EF4444" }}>*</span></label>
                    <input value={selected.subject||""} onChange={e=>update({subject:e.target.value})} placeholder="e.g. Quick question about {{Company Name}}" style={{ width:"100%", height:36, border:"1px solid #e0e0e0", borderRadius:8, fontSize:13, color:"#202124", background:"#fafafa", padding:"0 12px", outline:"none" }}/>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Email Column <span style={{ color:"#EF4444" }}>*</span></label>
                    <select value={selected.emailCol>=0?selected.emailCol:""} onChange={e=>update({emailCol:e.target.value===""?-1:Number(e.target.value)})} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:220, outline:"none" }}>
                      <option value="">— Select email column —</option>
                      {selCSVHeaders.map((h,kMxxid) => <option key={`clOpt_${kMxxid}`} value={kMxxid}>{(h||"")}{/email|mail/i.test(h||"")?" ✉ (auto-detected)":""}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
                  <div>
                    <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Preview Row</label>
                    <select value={previewRow} onChange={e=>setPreviewRow(Number(e.target.value))} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:160, outline:"none" }}>
                      {selCSVRows.map((row,kyXxRi) => <option key={`optRowX_${kyXxRi}`} value={kyXxRi}>Row {kyXxRi+1}{(row&&row[0])?" — "+row[0]:""}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Sender View Filter</label>
                    <select value={previewSender||selSenderIds[0]||""} onChange={e=>setPreviewSender(e.target.value)} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:200, outline:"none" }}>
                      {selSenderIds.map(id => { const accData = accounts.find(a => a.id === id); return <option key={id} value={id}>{accData ? (accData.email) : id}</option>; })}
                    </select>
                  </div>
                </div>

                {selected.pitch ? (() => {
                   const _eCIxSaf = selected.emailCol >= 0 ? selected.emailCol : selCSVHeaders.findIndex(h => /email|mail/i.test(h||""));
                   const targetEmail = (_eCIxSaf >= 0) ? (selCSVRows[previewRow]||[])[_eCIxSaf]||"—" : "—";
                   const currentSenderId = previewSender || selSenderIds[0];
                   const specificSenderEmail = (accounts.find(a=>a.id === currentSenderId) || {}).email || "—";
                   return (
                     <div style={{ border:"1px solid #e0e0e0", borderRadius:16, overflow:"hidden", background:"#fff", marginBottom:18 }}>
                       <div style={{ padding:"12px 18px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0" }}>
                         <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>From: <b style={{ color:"#202124" }}>{specificSenderEmail}</b></div>
                         <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>To: <b style={{ color:"#202124" }}>{targetEmail}</b></div>
                         <div style={{ fontSize:13, fontWeight:700, color:"#202124" }}>Subject: {selected.subject ? resolveAll(selected.subject||"", buildRowMap(previewRow)) : <span style={{ color:"#EF4444", fontWeight:400, fontSize:12 }}>⚠ No subject</span>}</div>
                       </div>
                       <div style={{ padding:"16px 24px", fontSize:14, lineHeight:1.6, color:"#202124" }} dangerouslySetInnerHTML={{ __html:resolvePitch(selected.pitch||"", previewRow, currentSenderId) }}/>
                     </div>
                   );
                })() : (
                  <div style={{ textAlign:"center", padding:"40px", background:"#f8f9fa", borderRadius:14, border:"1px dashed #e0e0e0", marginBottom:18 }}>
                    <p style={{ fontSize:13, color:"#9CA3AF" }}>No pitch written yet.</p>
                    <button onClick={()=>setTab("pitch")} style={{ marginTop:12, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:600 }}>Write Pitch</button>
                  </div>
                )}
                
                {selected.pitch && selSenderIds.length > 0 && selCSVRows.length > 0 && (!curProg || curProg.status === "stopped" || curProg.status === "done") && (
                    <div style={{ padding:"16px 18px", background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", borderRadius:14, marginTop:18 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                        <div>
                          <p style={{ fontSize:14, fontWeight:700, color:"#202124" }}>🚀 Ready to Launch!</p>
                          <p style={{ fontSize:12, color:"#1d4ed8", marginTop:3 }}>{selCSVRows.length} total targets · {selSenderIds.length} simultaneous active independent threads.</p>
                        </div>
                        <button onClick={sendCampaign} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"11px 28px", fontSize:14, fontWeight:700 }}>Launch Continuous Engine</button>
                      </div>
                    </div>
                )}
              </div>
            )}

            {tab === "followup" && (
              <div>
                <div style={{ display:"flex", gap:8, marginBottom:16, borderBottom:"1px solid #e0e0e0", paddingBottom:12 }}>
                  {[{id:"pitch",label:"✍ Write Follow-up"},{id:"preview",label:"👁 Preview & Send"}].map(t=>(
                    <button key={t.id} onClick={()=>{ saveFuPitch(); setFuTab(t.id); }} style={{ background:fuTab===t.id?"#1a73e8":"#f8f9fa", border:"1px solid #e0e0e0", borderRadius:8, color:fuTab===t.id?"#fff":"#6B7280", cursor:"pointer", padding:"6px 14px", fontSize:12, fontWeight:600 }}>{t.label}</button>
                  ))}
                </div>

                {fuTab === "pitch" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"12px 16px" }}>
                      <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase" }}>Follow-up Subject</label>
                      <input value={fuSubject} onChange={e=>{ setFuSubject(e.target.value); try { localStorage.setItem("mailOS_draft_fu_subject_"+selected.id, e.target.value); } catch(err){} }} placeholder={"RE: "+((getSendHistory(selected.id)[0]||{}).subject||"(original subject)")} style={{ width:"100%", height:36, border:"1px solid #e0e0e0", borderRadius:8, fontSize:13, color:"#202124", background:"#fafafa", padding:"0 12px", outline:"none" }}/>
                    </div>
                    {selCSVHeaders.length > 0 && (
                      <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"10px 14px" }}>
                        <p style={{ fontSize:11, color:"#9CA3AF", marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Click to insert at cursor</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {selCSVHeaders.map((hdr,idx)=><button key={`hzx_${idx}`} onMouseDown={e=>{e.preventDefault(); insertPH(hdr, fuPitchRef);}} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{"}{hdr}{"}}"}</button>)}
                          <button onMouseDown={e=>{e.preventDefault(); insertPH("Account Signature", fuPitchRef);}} style={{ background:"#fef3c7", border:"1px solid #fcd34d", color:"#D97706", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{Account Signature}}"}</button>
                        </div>
                      </div>
                    )}
                    <div style={{ border:"1px solid #e0e0e0", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:420, background:"#fff" }}>
                      <RichEditor key={selected.id+"_fu"} editorRef={fuPitchRef} initialHTML={(()=>{ try { const d=localStorage.getItem("mailOS_draft_fu_pitch_"+selected.id); return d!=null?d:selected.fuPitch||""; } catch(e){ return selected.fuPitch||""; } })()} onChange={html=>{ try { localStorage.setItem("mailOS_draft_fu_pitch_"+selected.id, html); } catch(e){} }}/>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <button onClick={()=>{ saveFuPitch(); alert("Saved ✓"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:600 }}>💾 Save</button>
                      <button onClick={()=>{ saveFuPitch(); setFuTab("preview"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Preview & Send →</button>
                    </div>
                  </div>
                )}

                {fuTab === "preview" && (() => {
                  const blockList = parseEmails(selected.skipListText || "");
                  const allOriginalTouches = getSendHistory(selected.id).filter(h=>(!h.touchType||h.touchType==="first"));
                  const validOriginalTouches = allOriginalTouches.filter(h => !blockList.has((h.toEmail||"").toLowerCase()));
                  
                  const skippedCount = allOriginalTouches.length - validOriginalTouches.length;
                  const currentPreviewNode = validOriginalTouches[fuPreviewRow] || null;

                  return (
                    <div style={{ display:"flex", flexDirection:"column", gap:16, position:"relative" }}>
                      
                      {/* === 🚫 EXCLUSION POPUP INTERFACE === */}
                      {showSkipPopup && (
                        <div style={{ position:"fixed", bottom:24, right:24, width:380, background:"#fff", borderRadius:12, boxShadow:"0 12px 48px rgba(0,0,0,0.18)", border:"1px solid #e0e0e0", zIndex:99999, display:"flex", flexDirection:"column", overflow:"hidden", animation:"fadeIn 0.2s" }}>
                          <div style={{ padding:"14px 16px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:14, fontWeight:700, color:"#202124" }}>🚫 Opt-Out & Exclude List</span>
                            <button onClick={() => setShowSkipPopup(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:20, padding:"0 4px" }}>×</button>
                          </div>
                          <div style={{ padding:"16px" }}>
                            <p style={{ fontSize:12, color:"#6B7280", marginBottom:10 }}>Paste emails to exclude from receiving this follow-up. Paste via lines or commas natively.</p>
                            <textarea
                              value={selected.skipListText || ""}
                              onChange={(e) => update({ skipListText: e.target.value })}
                              placeholder={"john.doe@target.com,\nbouncer@email.net"}
                              style={{ width:"100%", height:140, resize:"none", borderRadius:10, border:"1px solid #d1d5db", padding:"12px", fontSize:12, outline:"none", fontFamily:"monospace", color:"#202124", background:"#fcfcfc" }}
                            />
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
                              <span style={{ fontSize:12, fontWeight:600, color:"#1a73e8", background:"#eff6ff", padding:"4px 8px", borderRadius:6 }}>
                                ✅ {blockList.size} isolates
                              </span>
                              <button onClick={() => setShowSkipPopup(false)} style={{ background:"#1a73e8", color:"#fff", border:"none", padding:"8px 20px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Save Excludes</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {validOriginalTouches.length > 0 && (
                        <div>
                          <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase" }}>Preview Active Recipient</label>
                          <select value={fuPreviewRow} onChange={e=>setFuPreviewRow(Number(e.target.value))} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:240, outline:"none" }}>
                            {validOriginalTouches.map((rec,i)=><option key={`fuOpt_${i}`} value={i}>Row {rec.rowIdx+1} — {rec.toEmail}</option>)}
                          </select>
                        </div>
                      )}
                      
                      {currentPreviewNode && selected.fuPitch ? (() => {
                        const rmMap = buildRowMapArr(currentPreviewNode.rowData||[], selCSVHeaders);
                        let finalHTML = resolveAll(selected.fuPitch||"", rmMap);
                        
                        const senderId = (accounts.find(a=>a.email===currentPreviewNode.senderEmail)||{}).id;
                        const signatureHTML = senderId&&signatures[senderId]?signatures[senderId]:'<em style="color:#9CA3AF">[Signature]</em>';
                        
                        finalHTML = finalHTML.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi,signatureHTML).replace(/\{\{([^}]+)\}\}/g,'<span style="background:#fef3c7;color:#D97706;padding:1px 4px;border-radius:4px;font-family:monospace;font-size:0.85em">{{$1}}</span>');
                        
                        let cleanBodyPreview = finalHTML.trim().replace(/(?:<p><br><\/p>|<p>&nbsp;<\/p>|<br\s*\/?>|&nbsp;|\s)+$/, "");
                        
                        const resolvedSubj = (fuSubject||"").trim() ? resolveAll(fuSubject||"", rmMap)||fuSubject : "RE: " + (currentPreviewNode.subject||"");
                        const sentDate = new Date(currentPreviewNode.sentAt);
                        const formattedDate = sentDate.toLocaleDateString("en-US", {weekday:"long",year:"numeric",month:"long",day:"numeric"}) + " " + sentDate.toLocaleTimeString("en-US", {hour:"2-digit",minute:"2-digit",hour12:true});
                        
                        return (
                          <div style={{ border:"1px solid #e0e0e0", borderRadius:16, overflow:"hidden", background:"#fff" }}>
                            
                            <div style={{ padding:"12px 18px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0" }}>
                              <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>From: <b style={{color:"#202124"}}>{currentPreviewNode.senderEmail}</b></div>
                              <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>To: <b style={{color:"#202124"}}>{currentPreviewNode.toEmail}</b></div>
                              <div style={{ fontSize:13, fontWeight:700, color:"#202124" }}>Subject: {resolvedSubj}</div>
                            </div>
                            
                            {/* Pure White Background Standard Layout Display Area */}
                            <div style={{ padding:"32px 36px", background:"#fff", maxHeight:500, overflowY:"auto" }}>
                                
                                <div style={{ fontSize: "14.5px", fontFamily: "Calibri, sans-serif", color: "#000", lineHeight: "1.5" }} dangerouslySetInnerHTML={{ __html:cleanBodyPreview }}/>
                                
                                <div style={{ marginTop:12 }}>
                                  <hr style={{ display:"inline-block", width:"100%", border:"0", borderTop:"1px solid #b5c4df", marginBottom: "12px" }} />
                                </div>
                                
                                <div style={{ fontSize: "14.5px", fontFamily: "Calibri, sans-serif", color: "#000", lineHeight: "1.4", marginBottom: "16px" }}>
                                  <b>From:</b> {currentPreviewNode.senderName ? `${currentPreviewNode.senderName} <${currentPreviewNode.senderEmail}>` : currentPreviewNode.senderEmail}<br/>
                                  <b>Sent:</b> {formattedDate}<br/>
                                  <b>To:</b> {currentPreviewNode.toEmail}<br/>
                                  <b>Subject:</b> {currentPreviewNode.subject||""}
                                </div>

                                <div style={{ fontSize: "14.5px", fontFamily: "Calibri, sans-serif", color: "#000" }} dangerouslySetInnerHTML={{ __html: currentPreviewNode.bodyHTML||"<em>(no original body)</em>" }}/>
                                
                            </div>
                          </div>
                        );
                      })() : (
                        <div style={{ textAlign:"center", padding:"30px", background:"#f8f9fa", borderRadius:14, border:"1px dashed #e0e0e0" }}>
                          <p style={{ fontSize:13, color:"#9CA3AF" }}>{validOriginalTouches.length===0?"No send history found, or ALL contacts blocked/skipped!":"No follow-up pitch written yet."}</p>
                        </div>
                      )}
                      
                      {validOriginalTouches.length > 0 && (!curProg || curProg.status === "stopped" || curProg.status === "done") && (
                        <div style={{ padding:"18px 20px", background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", borderRadius:14 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
                            <div style={{ display: "flex", gap: "16px" }}>
                              <div>
                                <p style={{ fontSize:15, fontWeight:800, color:"#202124", letterSpacing:"-0.02em" }}>Follow Up Engine Engine</p>
                                <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:6 }}>
                                  <span style={{ fontSize:12, color:"#1a73e8", fontWeight:600 }}>{validOriginalTouches.length} targets active and ready</span>
                                  {skippedCount > 0 && (
                                    <span style={{ fontSize:11, color:"#D97706", background:"#fef3c7", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>
                                      {skippedCount} Safely Dropped (Skip List)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                               <button onClick={() => setShowSkipPopup(true)} style={{ background:"rgba(0,0,0,0.06)", border:"1px solid rgba(0,0,0,0.1)", color:"#374151", cursor:"pointer", borderRadius:12, padding:"10px 18px", fontSize:13, fontWeight:600, display:"flex", gap:6, alignItems:"center" }}>
                                🚫 Edit Skip/Exclude List
                               </button>
                               <button disabled={validOriginalTouches.length === 0} onClick={sendFollowup} style={{ background:validOriginalTouches.length === 0?"#9ca3af":"#1a73e8", border:"none", color:"#fff", cursor:validOriginalTouches.length === 0?"not-allowed":"pointer", borderRadius:12, padding:"11px 26px", fontSize:14, fontWeight:800, letterSpacing:"-0.02em" }}>
                                🚀 Launch Follow-ups
                               </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {tab === "progress" && curProg && (
              <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
                <div style={{ marginBottom:16 }}>
                    <h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Live Engine Progress</h3>
                    <p style={{ fontSize:12, color:"#6B7280" }}>Monitor asynchronous sending threads in real-time.</p>
                </div>
                <div style={{ padding:"16px 18px", background:(curProg.status==="done")?"#f0fdf4":(curProg.status==="paused")?"#fefce8":"#eff6ff", border:"1px solid "+((curProg.status==="done")?"#bbf7d0":(curProg.status==="paused")?"#fde047":"#bfdbfe"), borderRadius:14, marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                        <div>
                            <div style={{ fontSize:15, fontWeight:700, color:"#202124" }}>{(curProg.status==="done") ? "✅ Campaign Queues Completed" : (curProg.status==="stopped") ? "⛔ Engine Stopped" : (curProg.status==="paused") ? "⏸ Engine Paused" : "⚡ Engine Actively Running"}</div>
                            <div style={{ fontSize:13, color:"#1d4ed8", marginTop:4, fontWeight:600 }}>Sent: {curProg.sent || 0} / {curProg.total || 0}</div>
                        </div>
                        <div style={{ display:"flex", gap:8 }}>
                            {(curProg.status !== "done" && curProg.status !== "stopped") && (
                                <>
                                    <button onClick={togglePause} style={{ background:(curProg.status==="paused")?"#fefce8":"#eff6ff", border:"1px solid "+((curProg.status==="paused")?"#fde047":"#bfdbfe"), color:(curProg.status==="paused")?"#D97706":"#1d4ed8", cursor:"pointer", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:700 }}>{(curProg.status==="paused") ? "▶ Resume Engine" : "⏸ Pause Engine"}</button>
                                    <button onClick={abortCampaign} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:700 }}>■ Stop</button>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ height:8, background:"rgba(0,0,0,0.06)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:(((curProg.sent || 0) / Math.max(curProg.total || 1)) * 100)+"%", background:(curProg.status==="done")?"#22c55e":(curProg.status==="paused")?"#eab308":"#1a73e8", borderRadius:4, transition:"width 0.3s" }}/>
                    </div>
                    {(curProg.errors && curProg.errors.length > 0) && (
                        <div style={{ marginTop:12, maxHeight:80, overflowY:"auto", borderTop:"1px dashed rgba(239,68,68,0.2)", paddingTop:8 }}>
                            <p style={{fontSize:10,color:"#EF4444",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>⚠️ Failures:</p>
                            {curProg.errors.map((e,i) => <div key={i} style={{ fontSize:11, color:"#EF4444", fontFamily:"monospace", marginBottom:2 }}>[{e.senderEmail} → {e.toEmail}] {e.reason}</div>)}
                        </div>
                    )}
                </div>
                <LiveLogViewer campId={selectedId} engineRefs={engineRefs} />
              </div>
            )}

            {tab==="history" && (()=>{
              const historyData = getSendHistory(selected.id);
              const historyTerms = historySearch.toLowerCase().split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
              
              const filterHistory = (list) => list.filter(h => {
                if (historyTerms.length === 0) return true;
                const searchStr = `${h.toEmail} ${h.senderEmail} ${h.subject}`.toLowerCase();
                return historyTerms.some(term => searchStr.includes(term));
              });

              const fltFTList = filterHistory(historyData.filter(h => !h.touchType || h.touchType==="first"));
              const fltFUList = filterHistory(historyData.filter(h => h.touchType==="followup"));
              
              const renderTableData = (rowsList, label) => rowsList.length === 0 ? null : (
                <div style={{ marginBottom:24 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#202124", marginBottom:10 }}>{label} — {rowsList.length} sent</p>
                  <div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}>
                    <div style={{ overflowX:"auto", maxHeight:420, overflowY:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                        <thead style={{ position:"sticky", top:0 }}>
                          <tr style={{ background:"#f8f9fa" }}>
                            {["#","From","To","Subject","Sent Date","Status"].map((h)=><th key={`hdrHist_${h}`} style={{ padding:"8px 12px", textAlign:"left", fontWeight:700, color:"#6B7280", borderBottom:"1px solid #e0e0e0", fontSize:11, whiteSpace:"nowrap" }}>{h}</th>)}
                            {selCSVHeaders.map((h)=><th key={`hhCSV_${h}`} style={{ padding:"8px 12px", textAlign:"left", fontWeight:700, color:"#9CA3AF", borderBottom:"1px solid #e0e0e0", fontSize:10, fontFamily:"monospace" }}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {rowsList.map((rowItem, i)=> (
                            <tr key={`rhHist_${i}`} style={{ borderBottom: i!==rowsList.length-1?"1px solid #f1f3f4":"none", background: i%2===0?"transparent":"#fafafa" }}>
                              <td style={{ padding:"7px 12px", color:"#9CA3AF", fontFamily:"monospace", fontSize:11 }}>{i+1}</td>
                              <td style={{ padding:"7px 12px", color:"#1a73e8", fontFamily:"monospace", fontSize:11, whiteSpace:"nowrap" }}>{rowItem.senderEmail}</td>
                              <td style={{ padding:"7px 12px", color:"#202124", fontFamily:"monospace", fontSize:11, whiteSpace:"nowrap" }}>{rowItem.toEmail}</td>
                              <td style={{ padding:"7px 12px", color:"#202124", fontSize:11, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{rowItem.subject}</td>
                              <td style={{ padding:"7px 12px", color:"#6B7280", fontSize:11, whiteSpace:"nowrap" }}>{new Date(rowItem.sentAt).toLocaleString()}</td>
                              <td style={{ padding:"7px 12px" }}>
                                <span style={{ fontSize:10, background:"rgba(34,197,94,0.1)", color:"#16a34a", border:"1px solid rgba(34,197,94,0.3)", borderRadius:6, padding:"2px 8px", fontWeight:600 }}>✅ Verified</span>
                              </td>
                              {(rowItem.rowData||[]).map((val, cellIdx)=>(<td key={`cxCell_${cellIdx}`} style={{ padding:"7px 12px", color:"#6B7280", fontSize:11, maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{val}</td>))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
              return (
                <div>
                  <div style={{ marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap: "wrap", gap: 10 }}>
                    <div><h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Send Records & Timeline Metrics</h3></div>
                    
                    {/* NEW HISTORY SEARCH BAR */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input 
                        value={historySearch} 
                        onChange={e => setHistorySearch(e.target.value)} 
                        placeholder="Search history by email..." 
                        style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 12, outline: "none", minWidth: 240 }}
                      />
                      {historyData.length > 0 && (
                        <button onClick={() => {
                          const rowsExport = historyData.map(rgX=>[rgX.rowIdx+1, rgX.senderEmail, rgX.toEmail, rgX.subject, rgX.sentAt, rgX.touchType, ...(rgX.rowData||[])].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","));
                          const headersExport =["#","From","To","Subject","Sent Date","Stage", ...selCSVHeaders].map(h=>`"${h}"`).join(",");
                          const finalCsv =[headersExport, ...rowsExport].join("\n");
                          const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([finalCsv],{type:"text/csv"})); a.download = (selected.name||"log").replace(/\s+/g,"_")+"_full_execution_record.csv"; a.click();
                        }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"8px 18px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                          <Ic.Download s={13} c="#fff"/> Export Delivery Log 
                        </button>
                      )}
                    </div>
                  </div>
                  {historyData.length === 0
                    ? <div style={{ textAlign:"center", padding:"60px 20px", background:"#f8f9fa", borderRadius:14, border:"1px dashed #e0e0e0" }}><div style={{ fontSize:36, marginBottom:12, opacity:0.3 }}>📭</div><p style={{ fontSize:13, color:"#9CA3AF" }}>Records map safely rendered empty. Launch your campaign first.</p></div>
                    : <>
                        <div style={{ display:"flex", gap:12, marginBottom:18 }}>
                          <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"12px 18px", textAlign:"center" }}><div style={{ fontSize:22, fontWeight:700, color:"#1a73e8" }}>{fltFTList.length}</div><div style={{ fontSize:11, color:"#1a73e8" }}>First Touch Total</div></div>
                          {fltFUList.length > 0 && (
                            <div style={{ background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:10, padding:"12px 18px", textAlign:"center" }}><div style={{ fontSize:22, fontWeight:700, color:"#D97706" }}>{fltFUList.length}</div><div style={{ fontSize:11, color:"#D97706" }}>Follow-ups Total</div></div>
                          )}
                        </div>
                        {renderTableData(fltFTList, "🔥 Active First Touch Deliveries")}
                        {renderTableData(fltFUList, "⤴ Follow-up Chain Deliveries")}
                      </>
                  }
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT 
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activePage,       setActivePage]       = useState(() => { try { return localStorage.getItem("mailOS_activePage") || "mail"; } catch(e) { return "mail"; } });
  const [accounts,         setAccounts]         = useState([]);
  const [signatures,       setSignatures]       = useState(() => { try { return JSON.parse(localStorage.getItem("mailOS_signatures") || "{}"); } catch(e) { return {}; } });
  const [accountSettings,  setAccountSettings]  = useState(() => { try { return JSON.parse(localStorage.getItem("mailOS_accountSettings") || "{}"); } catch(e) { return {}; } });
  const [campaigns,        setCampaigns]        = useState(() => { try { return JSON.parse(localStorage.getItem("mailOS_campaigns") || "[]"); } catch(e) { return []; } });
  const [selectedFolder,   setSelectedFolder]   = useState("all-inbox");
  const [selectedMail,     setSelectedMail]     = useState(null);
  const [allMails,         setAllMails]         = useState({});
  const [loading,          setLoading]          = useState({});
  const [search,           setSearch]           = useState("");
  const [debouncedSearch,  setDebouncedSearch]  = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAdd,          setShowAdd]          = useState(false);
  const [showCSV,          setShowCSV]          = useState(false);
  const [showCompose,      setShowCompose]      = useState(false);
  const [showSettings,     setShowSettings]     = useState(false);
  const [expandedGroups,   setExpandedGroups]   = useState({ unified:true });
  const [typeFilter,       setTypeFilter]       = useState("all");
  const [refreshing,       setRefreshing]       = useState(false);
  const [contextMenu,      setContextMenu]      = useState(null);

  const searchTimer      = useRef(null);
  const settingsTimer    = useRef(null);
  const autoRefreshTimer = useRef(null);

  useEffect(() => { try { localStorage.setItem("mailOS_activePage", activePage); } catch(e) {} }, [activePage]);
  useEffect(() => { try { localStorage.setItem("mailOS_campaigns", JSON.stringify(campaigns)); } catch(e) {} },[campaigns]);

  useEffect(() => { const close = () => setContextMenu(null); document.addEventListener("scroll", close, true); return () => document.removeEventListener("scroll", close, true); },[]);

  const handleSearchChange = useCallback((val) => { setSearch(val); clearTimeout(searchTimer.current); searchTimer.current = setTimeout(() => setDebouncedSearch(val), 180); },[]);
  const persistSettings = useCallback((sigs, accSet) => { clearTimeout(settingsTimer.current); settingsTimer.current = setTimeout(() => { try { localStorage.setItem("mailOS_signatures", JSON.stringify(sigs)); localStorage.setItem("mailOS_accountSettings", JSON.stringify(accSet)); } catch(e) {} }, 300); },[]);

  const handleSignatureChange      = (id, html) => { setSignatures(p => { const n = { ...p, [id]:html }; persistSettings(n, accountSettings); return n; }); };
  const handleAccountSettingChange = (id, key, val) => { setAccountSettings(p => { const n = { ...p, [id]:{ ...(p[id]||{}), [key]:val } }; persistSettings(signatures, n); return n; }); };

  const loadMails = useCallback(async (acc, folder, refresh = false, silent = false) => {
    const key = acc.id + ":" + folder;
    if (!silent) setLoading(p => ({ ...p,[key]:true }));
    try {
      const url  = folder === "inbox" ? "/accounts/" + acc.id + "/inbox" : "/accounts/" + acc.id + "/sent";
      const msgs = await apiFetch(url + (refresh ? "?refresh=true" : ""), { timeout: 90000 });
      
      let readCache = {}; let starCache = {};
      try { readCache = JSON.parse(localStorage.getItem("mailOS_readCache") || "{}"); } catch(e){}
      try { starCache = JSON.parse(localStorage.getItem("mailOS_starCache") || "{}"); } catch(e){}

      setAllMails(p => {
        const existing = p[key] ||[]; const readMap = {}; const starMap = {};
        existing.forEach(m => { readMap[m.id] = m.read; starMap[m.id] = m.starred; });
        const merged = msgs.map(m => ({ 
          ...m, 
          read: m.id in readCache ? readCache[m.id] : (m.id in readMap ? readMap[m.id] : m.read), 
          starred: m.id in starCache ? starCache[m.id] : (m.id in starMap ? starMap[m.id] : m.starred), 
        })); 
        return { ...p, [key]: merged };
      });
    } catch(e) { console.warn("Failed to load:", key, e); } 
    finally { if (!silent) setLoading(p => ({ ...p,[key]:false })); }
  },[]);

  useEffect(() => {
    apiFetch("/accounts").then(list => {
      setAccounts(list);
      list.forEach(acc => { 
        loadMails(acc, "inbox", false, true); 
        loadMails(acc, "sent", false, true); 
      });
      
      setTimeout(() => {
        list.forEach(acc => { 
          loadMails(acc, "inbox", true, true).catch(() => {}); 
          loadMails(acc, "sent", true, true).catch(() => {}); 
        });
      }, 1000);

      if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
      autoRefreshTimer.current = setInterval(async () => { if (list.length === 0) return; try { await Promise.all(list.map(a => loadMails(a, "inbox", true, true).catch(() => {}))); } catch(e) {} }, 600000);
    }).catch(() => {});
    return () => { if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current); };
  }, [loadMails]);

  const handleAccountAdded = (acc) => { setAccounts(p => { const dup = p.find(a => (a.email||"").toLowerCase() === (acc.email||"").toLowerCase()); if (dup) return p; if (p.length >= 500) return p; return [...p, acc]; }); setExpandedGroups(p => ({ ...p, [acc.id]:true })); loadMails(acc, "inbox"); loadMails(acc, "sent"); };
  
  const handleRemoveAccount = async (id) => { 
    try {
      await apiFetch("/accounts/" + id, { method: "DELETE" }); 
      setAccounts(p => p.filter(a => a.id !== id)); 
      setAllMails(p => { const n = { ...p }; delete n[id+":inbox"]; delete n[id+":sent"]; return n; }); 
      setSignatures(p => { const n = { ...p }; delete n[id]; return n; });
      setAccountSettings(p => { const n = { ...p }; delete n[id]; return n; });
    } catch (e) {
      alert("Error: Could not delete from the database. " + e.message);
    }
  };

  const handleRefresh = async () => { setRefreshing(true); await Promise.all(accounts.flatMap(a =>[loadMails(a,"inbox",true,true), loadMails(a,"sent",true,true)])); setRefreshing(false); };

  const handleMarkRead = useCallback(async (mail, readVal = true) => {
    const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
    setAllMails(p => { const k = mail.accountId+":"+folder; return { ...p, [k]:(p[k]||[]).map(m => m.id===mail.id ? { ...m, read:readVal } : m) }; });
    setSelectedMail(prev => prev && prev.id === mail.id ? { ...prev, read:readVal } : prev);
    
    try {
      const cache = JSON.parse(localStorage.getItem("mailOS_readCache") || "{}");
      cache[mail.id] = readVal;
      localStorage.setItem("mailOS_readCache", JSON.stringify(cache));
    } catch(e) {}

    try { await apiFetch("/accounts/" + mail.accountId + "/messages/" + mail.uid + "/read", { method:"PATCH", body:JSON.stringify({ read:readVal }) }); } catch(e) {}
  },[]);

  const handleToggleStar = useCallback(async (mail, e) => {
    e && e.stopPropagation();
    const newVal = !mail.starred;
    const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
    setAllMails(p => { const k = mail.accountId+":"+folder; return { ...p, [k]:(p[k]||[]).map(m => m.id===mail.id ? { ...m, starred:newVal } : m) }; });
    setSelectedMail(prev => prev && prev.id === mail.id ? { ...prev, starred:newVal } : prev);
    
    try {
      const cache = JSON.parse(localStorage.getItem("mailOS_starCache") || "{}");
      cache[mail.id] = newVal;
      localStorage.setItem("mailOS_starCache", JSON.stringify(cache));
    } catch(e) {}

    try { await apiFetch("/accounts/" + mail.accountId + "/messages/" + mail.uid + "/star", { method:"PATCH", body:JSON.stringify({ starred:newVal, folder:mail.folder }) }); } catch(e) {}
  },[]);

  const handleDeleteMail = useCallback(async (mail) => {
    // 1. Identify which list the mail belongs to (inbox vs sent)
    const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
    const key = mail.accountId + ":" + folder;

    // 2. Instantly remove from screen (Optimistic UI -> 0ms lag)
    setAllMails(p => ({ ...p, [key]: (p[key] || []).filter(m => m.id !== mail.id) }));
    
    // 3. Auto-close the email reader or context menu if open
    if (selectedMail && selectedMail.id === mail.id) setSelectedMail(null);
    if (contextMenu && contextMenu.mail && contextMenu.mail.id === mail.id) setContextMenu(null);

    // 4. Background purge: Tell Node to permanently erase from SQLite & Webmail Server
    try {
      await apiFetch(`/accounts/${mail.accountId}/messages/${folder}/${mail.uid}`, { method: 'DELETE' });
    } catch(e) { 
      console.warn("Delete request network warn, but cached UI assumed success", e) 
    }
  }, [selectedMail, contextMenu]);

  const handleSelectMail = useCallback((mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
      setAllMails(p => { const k = mail.accountId+":"+folder; return { ...p, [k]:(p[k]||[]).map(m => m.id===mail.id ? { ...m, read:true } : m) }; });
      
      try {
        const cache = JSON.parse(localStorage.getItem("mailOS_readCache") || "{}");
        cache[mail.id] = true;
        localStorage.setItem("mailOS_readCache", JSON.stringify(cache));
      } catch(e) {}

      apiFetch("/accounts/" + mail.accountId + "/messages/" + mail.uid + "/read", { method:"PATCH", body:JSON.stringify({ read:true }) }).catch(() => {});
    }
  },[]);

  const handleRightClick = useCallback((e, mail) => {
    e.preventDefault(); e.stopPropagation();
    setContextMenu({ x:e.clientX, y:e.clientY, mail });
  },[]);

  const BOUNCE_FROM =["mailer-daemon","postmaster","mail delivery","delivery subsystem","delivery notification","smtp error"];
  const BOUNCE_SUBJ =["delivery status notification","undeliverable","delivery failure","failure notice","mail delivery failed","returned mail","message not delivered","delivery incomplete"];
  const AUTO_KW    =["auto-reply","automatic reply","out of office","ooo:","vacation reply","noreply","no-reply","do not reply","donotreply","automated response","auto response","autoreply","away message","i am out","i'm out of","on leave","on vacation","on holiday","be back","will respond when","currently unavailable"];

  const allMailsSorted = useMemo(() => {
    const flat = accounts.flatMap(acc => [
      ...(allMails[acc.id+":inbox"] || []), 
      ...(allMails[acc.id+":sent"] || [])
    ]);
    
    return flat.map(m => {
      if (m.type && m.type !== "normal") return m;
      const s = (m.subject||"").toLowerCase();
      const em = (m.from?.email||"").toLowerCase();
      const sn = (m.preview||"").toLowerCase();
      const nm = (m.from?.name||"").toLowerCase();

      if (BOUNCE_FROM.some(kw => em.includes(kw) || nm.includes(kw)) || BOUNCE_SUBJ.some(kw => s.includes(kw))) return { ...m, type:"bounce" };
      if (AUTO_KW.some(kw => s.includes(kw) || em.includes(kw) || sn.includes(kw))) return { ...m, type:"auto" };

      return m;
    }).sort((a,b) => (b.date?Date.parse(b.date):0) - (a.date?Date.parse(a.date):0));
  }, [allMails, accounts]);

  const unreadMap = useMemo(() => {
    const map = {};
    for (const m of allMailsSorted) {
      if (m.read || (m.folder||"").toLowerCase().includes("sent")) continue;
      map["all-inbox"]   = (map["all-inbox"]||0) + 1;
      if (m.type==="reply")  map["all-replies"] = (map["all-replies"]||0) + 1;
      if (m.type==="auto")   map["all-auto"]    = (map["all-auto"]||0)    + 1;
      if (m.type==="bounce") map["all-bounce"]  = (map["all-bounce"]||0)  + 1;
      if (m.type==="normal") map["all-normal"]  = (map["all-normal"]||0)  + 1;
      const aid = m.accountId;
      if (aid) {
        map[aid+"-inbox"]   = (map[aid+"-inbox"]||0)   + 1;
        if (m.type==="reply")  map[aid+"-replies"] = (map[aid+"-replies"]||0) + 1;
        if (m.type==="auto")   map[aid+"-auto"]    = (map[aid+"-auto"]||0)    + 1;
        if (m.type==="bounce") map[aid+"-bounce"]  = (map[aid+"-bounce"]||0)  + 1;
        if (m.type==="normal") map[aid+"-normal"]  = (map[aid+"-normal"]||0)  + 1;
      }
    }
    return map;
  },[allMailsSorted]);

  const totalUnread = unreadMap["all-inbox"] || 0;

  const filteredMails = useMemo(() => {
    return allMailsSorted.filter(m => {
      const isSent = (m.folder||"").toLowerCase().includes("sent");
      if      (selectedFolder==="all-inbox")   { if (isSent) return false; }
      else if (selectedFolder==="all-replies") { if (isSent||m.type!=="reply")  return false; }
      else if (selectedFolder==="all-auto")    { if (isSent||m.type!=="auto")   return false; }
      else if (selectedFolder==="all-bounce")  { if (isSent||m.type!=="bounce") return false; }
      else if (selectedFolder==="all-normal")  { if (isSent||m.type!=="normal") return false; }
      else if (selectedFolder==="all-sent")    { if (!isSent) return false; }
      else {
        const di  = selectedFolder.lastIndexOf("-");
        const aid = selectedFolder.slice(0, di);
        const sfx = selectedFolder.slice(di+1);
        if (m.accountId !== aid) return false;
        if (sfx==="sent"    && !isSent)                return false;
        if (sfx==="inbox"   && isSent)                 return false;
        if (sfx==="replies" && (isSent||m.type!=="reply"))  return false;
        if (sfx==="auto"    && (isSent||m.type!=="auto"))   return false;
        if (sfx==="bounce"  && (isSent||m.type!=="bounce")) return false;
        if (sfx==="normal"  && (isSent||m.type!=="normal")) return false;
      }
      
      if (typeFilter === "unread" && m.read) return false;
      if (typeFilter !== "all" && typeFilter !== "unread" && m.type !== typeFilter) return false;
      
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (m.subject||"").toLowerCase().includes(q) ||
               (m.from?.name||"").toLowerCase().includes(q) ||
               (m.from?.email||"").toLowerCase().includes(q);
      }
      return true;
    });
  },[allMailsSorted, selectedFolder, typeFilter, debouncedSearch]);

  const currentFolderLabel = useMemo(() => {
    const labels = { "all-inbox":"All Inboxes","all-replies":"Replies (RE:)","all-auto":"Automated","all-bounce":"Bounced","all-normal":"Personal","all-sent":"Sent" };
    if (labels[selectedFolder]) return labels[selectedFolder];
    const di  = selectedFolder.lastIndexOf("-");
    const aid = selectedFolder.slice(0, di);
    const sfx = selectedFolder.slice(di+1);
    const acc = accounts.find(a => a.id === aid);
    const sfxLabels = { inbox:"Inbox", replies:"Replies", auto:"Automated", bounce:"Bounced", normal:"Personal", sent:"Sent" };
    return acc ? (acc.name||(acc.email||"").split("@")[0]) + " · " + (sfxLabels[sfx]||sfx) : "Mail";
  },[selectedFolder, accounts]);

  const isLoadingCurrent = useMemo(() =>
    accounts.some(acc => loading[selectedFolder.includes("sent") ? acc.id+":sent" : acc.id+":inbox"]),
    [accounts, selectedFolder, loading]
  );

  const FOLDER_DEFS =[
    { suffix:"inbox",   label:"All Inboxes", icon:<Ic.Inbox s={12}/> },
    { suffix:"replies", label:"Replies",     icon:<Ic.Reply s={12}/> },
    { suffix:"auto",    label:"Automated",   icon:<Ic.Zap s={12}/>   },
    { suffix:"bounce",  label:"Bounced",     icon:<Ic.Alert s={12}/> },
    { suffix:"normal",  label:"Personal",    icon:<Ic.Mail s={12}/>  },
    { suffix:"sent",    label:"Sent",        icon:<Ic.Send s={12}/>  },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Outfit','DM Sans',system-ui,sans-serif" }} onClick={() => setContextMenu(null)}>
      <div style={{ position:"fixed", inset:0, zIndex:0, background:"#f6f8fc" }}/>

      {/* ── SIDEBAR ── */}
      <div style={{ width:sidebarCollapsed?54:244, position:"relative", zIndex:10, background:"#fff", borderRight:"1px solid #e0e0e0", display:"flex", flexDirection:"column", flexShrink:0, transition:"width 0.2s cubic-bezier(.4,0,.2,1)", overflow:"hidden", height:"100vh" }}>
        
        <div
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ padding:"14px 12px", display:"flex", alignItems:"center", gap:9, borderBottom:"1px solid #e0e0e0", flexShrink:0, cursor:"pointer", userSelect:"none", transition:"background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background="#f1f3f4"}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div style={{ width:32, height:32, borderRadius:10, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>✉</div>
          {!sidebarCollapsed && (
            <>
              <span style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.04em", color:"#202124" }}>MailOS</span>
              {totalUnread > 0 && (
                <span style={{ marginLeft:"auto", background:"#1a73e8", color:"#fff", borderRadius:12, fontSize:10, fontWeight:700, padding:"2px 8px" }}>{totalUnread}</span>
              )}
            </>
          )}
          <div style={{ marginLeft: sidebarCollapsed ? "auto" : (totalUnread > 0 ? 4 : "auto"), background:"#f1f3f4", border:"1px solid #e0e0e0", borderRadius:7, padding:"4px 6px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {sidebarCollapsed
              ? <Ic.ChevronRight s={11} c="#6B7280"/>
              : <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            }
          </div>
        </div>

        <div style={{ padding:"10px 10px 6px", display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
          <button onClick={() => { setActivePage("mail"); if (activePage === "mail") setShowCompose(true); }}
            style={{ width:"100%", background:"#1a73e8", border:"none", borderRadius:10, color:"#fff", cursor:"pointer", padding:sidebarCollapsed?"9px 6px":"9px 14px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span style={{ display:"flex", alignItems:"center" }}><Ic.Compose s={14} c="#fff"/></span>
            {!sidebarCollapsed && (activePage === "campaigns" ? "Mailbox" : "Compose")}
          </button>
          <button onClick={() => setActivePage(activePage === "campaigns" ? "mail" : "campaigns")}
            style={{ width:"100%", border:"none", borderRadius:10, color:"#fff", cursor:"pointer", padding:sidebarCollapsed?"9px 6px":"9px 14px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:activePage==="campaigns"?"#0d47a1":"#1565c0" }}>
            <span>📢</span>{!sidebarCollapsed && "Campaigns"}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div style={{ padding:"4px 10px 6px", flexShrink:0 }}>
            <div style={{ background:"#f8f9fa", borderRadius:10, border:"1px solid #e0e0e0", display:"flex", alignItems:"center", gap:7, padding:"7px 10px" }}>
              <span style={{ color:"#9CA3AF", fontSize:13 }}>⌕</span>
              <input value={search} onChange={e => handleSearchChange(e.target.value)} placeholder="Search…" style={{ background:"none", border:"none", color:"#202124", fontSize:12, width:"100%", outline:"none" }}/>
            </div>
          </div>
        )}

        <div style={{ flex:1, overflowY:"auto", padding:"4px 0", minHeight:0 }}>
          {activePage === "mail" && (
            <div>
              {!sidebarCollapsed && (
                <button onClick={() => setExpandedGroups(p => ({ ...p, unified:!p.unified }))} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7, padding:"5px 14px", color:"#9CA3AF" }}>
                  <span style={{ fontSize:9 }}>⬡</span>
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", flex:1, textAlign:"left" }}>All Inboxes</span>
                  <span style={{ fontSize:8 }}>{expandedGroups.unified ? "▼" : "▶"}</span>
                </button>
              )}
              {(expandedGroups.unified || sidebarCollapsed) && FOLDER_DEFS.map(fd => {
                const fid = "all-" + fd.suffix, cnt = unreadMap[fid] || 0, isActive = selectedFolder === fid;
                return (
                  <button key={fid} onClick={() => setSelectedFolder(fid)}
                    style={{ width:"100%", background:isActive?"#eff6ff":"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7, padding:sidebarCollapsed?"8px 16px":"7px 14px 7px 26px", color:isActive?"#1a73e8":"#6B7280", borderLeft:isActive?"2px solid #1a73e8":"2px solid transparent", transition:"all 0.1s" }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8f9fa"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                    <span style={{ flexShrink:0, display:"flex", alignItems:"center" }}>{fd.icon}</span>
                    {!sidebarCollapsed && <span style={{ fontSize:12, fontWeight:isActive?600:400, flex:1, textAlign:"left" }}>{fd.label}</span>}
                    {!sidebarCollapsed && cnt > 0 && <span style={{ background:isActive?"#1a73e8":"#e0e0e0", color:isActive?"#fff":"#6B7280", borderRadius:10, fontSize:10, fontWeight:600, padding:"1px 6px" }}>{cnt}</span>}
                  </button>
                );
              })}
              {accounts.map((acc, ai) => (
                <div key={acc.id} style={{ marginTop:4 }}>
                  {!sidebarCollapsed && (
                    <button onClick={() => setExpandedGroups(p => ({ ...p,[acc.id]:!p[acc.id] }))} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, padding:"5px 14px", color:"#9CA3AF" }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:getColor(ai), flexShrink:0 }}/>
                      <span style={{ fontSize:10, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", flex:1, textAlign:"left", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:getColor(ai) }} title={acc.email}>
                        {acc.email.toLowerCase()}
                      </span>
                      <span style={{ fontSize:8 }}>{expandedGroups[acc.id] ? "▼" : "▶"}</span>
                    </button>
                  )}
                  {(expandedGroups[acc.id] || sidebarCollapsed) && FOLDER_DEFS.map(fd => {
                    const fid = acc.id+"-"+fd.suffix, cnt = unreadMap[fid] || 0, isActive = selectedFolder === fid;
                    return (
                      <button key={fid} onClick={() => setSelectedFolder(fid)}
                        style={{ width:"100%", background:isActive?"#eff6ff":"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:7, padding:sidebarCollapsed?"8px 16px":"7px 14px 7px 30px", color:isActive?"#1a73e8":"#6B7280", borderLeft:isActive?"2px solid #1a73e8":"2px solid transparent", transition:"all 0.1s" }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8f9fa"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                        <span style={{ flexShrink:0, display:"flex", alignItems:"center" }}>{fd.icon}</span>
                        {!sidebarCollapsed && <span style={{ fontSize:12, fontWeight:isActive?600:400, flex:1, textAlign:"left" }}>{fd.label}</span>}
                        {!sidebarCollapsed && cnt > 0 && <span style={{ background:isActive?"#1a73e8":"#e0e0e0", color:isActive?"#fff":"#6B7280", borderRadius:10, fontSize:10, fontWeight:600, padding:"1px 6px" }}>{cnt}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding:"8px 10px", borderTop:"1px solid #e0e0e0", display:"flex", gap:6, flexShrink:0 }}>
          <button onClick={() => setShowSettings(true)} style={{ flex:1, background:"#f8f9fa", border:"1px solid #e0e0e0", borderRadius:9, color:"#202124", cursor:"pointer", padding:"8px", display:"flex", alignItems:"center", gap:8 }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}>
            <span style={{ display:"flex", alignItems:"center" }}><Ic.Plus s={13} c="#6B7280"/></span>
            {!sidebarCollapsed && <span style={{ fontSize:11, fontWeight:500 }}>Add / Manage</span>}
          </button>
          {!sidebarCollapsed && <button onClick={() => setShowSettings(true)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", borderRadius:9, color:"#1a73e8", cursor:"pointer", padding:"8px 10px", fontSize:14 }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}>⚙</button>}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative", zIndex:5 }}>
        
        <CampaignsPage accounts={accounts} signatures={signatures} accountSettings={accountSettings} campaigns={campaigns} onUpdateCampaigns={setCampaigns} getColor={getColor} isVisible={activePage==="campaigns"}/>

        {activePage === "mail" && (<>
          {/* Mail list */}
          <div style={{ width:selectedMail?320:390, flexShrink:0, background:"#fff", borderRight:"1px solid #e0e0e0", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"14px 14px 10px", background:"#fff" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{currentFolderLabel}</h2>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={handleRefresh} title="Refresh" style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#1a73e8", cursor:"pointer", width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <span style={{ display:"flex", alignItems:"center", animation:(refreshing || isLoadingCurrent)?"spin 0.7s linear infinite":"none" }}><Ic.Refresh s={13}/></span>
                  </button>
                  <button title="Export CSV" onClick={() => exportToCSV(filteredMails, currentFolderLabel.replace(/\s+/g,"_")+".csv")} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#1a73e8", cursor:"pointer", width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}><Ic.Download s={13}/></button>
                  <button title="Export MBOX" onClick={() => exportFolderAsMBOX(filteredMails, currentFolderLabel)} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#1a73e8", cursor:"pointer", padding:"0 8px", height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>MBX</button>
                </div>
              </div>
              <p style={{ fontSize:12, color:"#9CA3AF", marginTop:6, fontWeight:500 }}>
                {allMailsSorted.filter(m => {
                  const isSent = (m.folder||"").toLowerCase().includes("sent");
                  if (selectedFolder==="all-inbox" && isSent) return false;
                  if (selectedFolder.includes("-inbox") && isSent) return false;
                  return true;
                }).length} messages · {totalUnread} unread
              </p>
            </div>
            
            <div style={{ padding:"10px 14px", display:"flex", gap:6, borderBottom:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", overflowX:"auto", background:"#fff" }}>
              {[{val:"all",label:"All"},{val:"unread",label:"Unread"},{val:"reply",label:"RE:"},{val:"auto",label:"Auto"},{val:"bounce",label:"Bounce"},{val:"normal",label:"Personal"}].map(({ val, label }) => (
                <button key={val} onClick={() => setTypeFilter(val)}
                  style={{ background:typeFilter===val?"#1a73e8":"#fff", border:typeFilter===val?"1px solid #1a73e8":"1px solid #e0e0e0", borderRadius:20, color:typeFilter===val?"#fff":"#4B5563", cursor:"pointer", padding:"4px 14px", fontSize:12, fontWeight:500, whiteSpace:"nowrap", transition:"all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
            
            {filteredMails.length === 0
                ? <div style={{ flex:1, textAlign:"center", padding:"80px 20px", color:"#9CA3AF" }}>
                    <div style={{ display:"inline-flex", padding:16, border:"1px dashed #d1d5db", borderRadius:"50%", marginBottom:16 }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <p style={{ fontSize:13, fontWeight:500 }}>No messages found</p>
                    {isLoadingCurrent && <p style={{ fontSize:11, color:"#1a73e8", marginTop:8 }}>Syncing inboxes...</p>}
                  </div>
                : <VirtualMailList mails={filteredMails} selectedMailId={selectedMail&&selectedMail.id} accounts={accounts} onSelect={handleSelectMail} onRightClick={handleRightClick} onStar={handleToggleStar}/>
            }
          </div>

          {/* Mail viewer */}
          {selectedMail ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#fff" }} className="fade-in">
              <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0", background:"#fff", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h2 style={{ fontSize:20, fontWeight:700, color:"#202124", marginBottom:14, lineHeight:1.3 }}>{selectedMail.subject||"(no subject)"}</h2>
                    <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <Avatar name={selectedMail.from&&selectedMail.from.name} email={selectedMail.from&&selectedMail.from.email} color={getColor(accounts.findIndex(a=>a.id===selectedMail.accountId))} size={42}/>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:"#202124" }}>
                          {(selectedMail.from&&selectedMail.from.name)||(selectedMail.from&&selectedMail.from.email)}
                          {selectedMail.from&&selectedMail.from.name && <span style={{ fontSize:12, color:"#6B7280", marginLeft:8, fontWeight:400 }}>&lt;{selectedMail.from.email}&gt;</span>}
                        </div>
                        <div style={{ fontSize:12, color:"#9CA3AF", marginTop:3 }}>To: {(selectedMail.to||[]).map(t=>t.email||t.name).join(", ")||"—"} · {formatDateFull(selectedMail.date)}</div>
                      </div>
                      <TypeBadge type={selectedMail.type}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                    <button onClick={() => handleDeleteMail(selectedMail)} title="Delete Message" style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, color:"#EF4444", cursor:"pointer", padding:"8px", fontSize:14, display:"flex", alignItems:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#fee2e2"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}><Ic.Trash s={15} c="#EF4444"/></button>
                    <button onClick={() => handleToggleStar(selectedMail)} title="Star" style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, color:selectedMail.starred?"#F59E0B":"#9CA3AF", cursor:"pointer", padding:"8px", fontSize:14, display:"flex", alignItems:"center" }}><Ic.Star s={16} fill={selectedMail.starred?"#F59E0B":"none"}/></button>
                    <button onClick={() => handleMarkRead(selectedMail, !selectedMail.read)} title="Mark Unread" style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, color:"#1a73e8", cursor:"pointer", padding:"8px", fontSize:14, display:"flex", alignItems:"center" }}><Ic.Mail s={15}/></button>
                    <button onClick={() => exportEmailAsEML(selectedMail)} title="Save as .EML" style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, color:"#1a73e8", cursor:"pointer", padding:"8px 12px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}><Ic.Download s={14} c="#1a73e8"/>EML</button>
                    <button onClick={() => setShowCompose({ replyTo:selectedMail, accountId:selectedMail.accountId })} style={{ background:"#1a73e8", border:"none", borderRadius:8, color:"#fff", cursor:"pointer", padding:"8px 16px", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}><Ic.Reply s={14} c="#fff"/>Reply</button>
                    <button onClick={() => setSelectedMail(null)} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#6B7280", cursor:"pointer", borderRadius:8, fontSize:18, padding:"4px 10px" }}>×</button>
                  </div>
                </div>
              </div>
              <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", paddingLeft:10, paddingRight:10 }}>
                {selectedMail.body ? (()=>{
                  const isHTML = /<[a-z][\s\S]*>/i.test(selectedMail.body);
                  if (isHTML) {
                    return (
                      <iframe key={selectedMail.id}
                        srcDoc={"<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>body{font-family:Calibri,'Helvetica Neue',Arial,sans-serif;font-size:14.5px;line-height:1.6;color:#202124;padding:28px 40px 28px 40px;margin:0;word-break:break-word;max-width:850px;}img{max-width:100%!important;height:auto;}a{color:#1a73e8;}p{margin:0 0 10px;}table{border-collapse:collapse;max-width:100%;}blockquote{border-left:3px solid #e0e0e0;margin:10px 0;padding:6px 14px;color:#6B7280;background:#f8f9fa;border-radius:0 8px 8px 0;}pre{background:#f8f9fa;border:1px solid #e0e0e0;border-radius:6px;padding:12px 16px;font-family:monospace;font-size:13px;white-space:pre-wrap;}</style></head><body>"+selectedMail.body+"</body></html>"}
                        style={{ flex:1, width:"100%", border:"none", minHeight:0, height:"100%" }}
                        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        title="email-content"
                      />
                    );
                  }
                  const plain = selectedMail.body.replace(/<br\s*\/?>/gi,"\n").replace(/<\/p>/gi,"\n\n").replace(/<\/div>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"').replace(/\n{3,}/g,"\n\n").trim();
                  return <div style={{ flex:1, overflowY:"auto", padding:"32px 48px", fontSize:14.5, lineHeight:1.7, fontFamily:"Calibri,'Helvetica Neue',sans-serif", whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#202124", maxWidth:850 }}>{plain}</div>;
                })()
                : selectedMail.preview
                  ? <div style={{ flex:1, overflowY:"auto", padding:"32px 48px", fontSize:14.5, lineHeight:1.7, color:"#202124", whiteSpace:"pre-wrap", wordBreak:"break-word", maxWidth:850 }}>{stripPreview(selectedMail.preview)}</div>
                  : <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}><div style={{ display:"inline-flex", padding:24, border:"1px dashed #d1d5db", borderRadius:"50%" }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div><p style={{ fontSize:14, color:"#6B7280", fontWeight:500 }}>No body content available</p></div>
                }
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, background:"#f9fafb" }}>
              <div style={{ display:"inline-flex", padding:30, border:"2px dashed #e5e7eb", borderRadius:"50%", background:"#fff", boxShadow:"0 4px 20px rgba(0,0,0,0.02)" }}><svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
              <p style={{ color:"#6B7280", fontSize:15, fontWeight:600 }}>Select a message to read</p>
            </div>
          )}
        </>)}
      </div>

      {/* ── MODALS ── */}
      {showAdd      && <AddAccountModal existingAccounts={accounts} onClose={() => setShowAdd(false)} onAdded={acc => { handleAccountAdded(acc); setShowAdd(false); }}/>}
      {showCSV      && <CSVImportModal  existingAccounts={accounts} onClose={() => setShowCSV(false)} onImported={handleAccountAdded}/>}
      {showSettings && <AccountSettingsModal accounts={accounts} signatures={signatures} accountSettings={accountSettings} onSignatureChange={handleSignatureChange} onAccountSettingChange={handleAccountSettingChange} onClose={() => setShowSettings(false)} onAddManual={() => { setShowSettings(false); setShowAdd(true); }} onAddCSV={() => { setShowSettings(false); setShowCSV(true); }} onRemove={handleRemoveAccount} getColor={getColor}/>}
      {showCompose  && <ComposeModal accounts={accounts} defaultAccountId={typeof showCompose==="object"?showCompose.accountId:(accounts[0]&&accounts[0].id)} replyTo={typeof showCompose==="object"?showCompose.replyTo:null} onClose={() => setShowCompose(false)} onSent={() => { handleRefresh(); setShowCompose(false); }}/>}
      {contextMenu  && <ContextMenu x={contextMenu.x} y={contextMenu.y} mail={contextMenu.mail} allVisibleMails={filteredMails} folderLabel={currentFolderLabel} onClose={() => setContextMenu(null)} onToggleStar={handleToggleStar} onMarkRead={handleMarkRead} onDelete={handleDeleteMail}/>}

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        
        /* Thickened, Rounded Custom Scrollbars with Native Look */
        ::-webkit-scrollbar { width: 13px; height: 13px; }
        ::-webkit-scrollbar-track { background: #f8f9fa; border-radius: 8px; border-left: 1px solid #f1f3f4; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 3px solid #f8f9fa; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        
        /* Up/Down Scrollbar Arrows */
        ::-webkit-scrollbar-button:single-button { background-color: #f8f9fa; display: block; height: 16px; width: 13px; }
        ::-webkit-scrollbar-button:single-button:vertical:decrement {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M7 14l5-5 5 5z"/></svg>');
          background-repeat: no-repeat; background-position: center; background-size: 14px;
        }
        ::-webkit-scrollbar-button:single-button:vertical:increment {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat; background-position: center; background-size: 14px;
        }

        body { font-family:'Outfit','DM Sans',system-ui,sans-serif; }
        .mail-row:hover { background:#f8f9fa !important; }
        .mail-row:hover .star-btn { opacity:1 !important; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ctxFadeIn { from { opacity:0; transform:scale(0.95) translateY(-4px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .fade-in { animation:fadeIn 0.18s cubic-bezier(.4,0,.2,1); }
        select option { background:#fff; color:#202124; }
        input:focus, select:focus { border-color:#1a73e8 !important; box-shadow:0 0 0 2px rgba(26,115,232,0.12) !important; }
      `}</style>
    </div>
  );
}
