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
};

// ── API ──────────────────────────────────────────────────────────────────────
const API = "http://localhost:5001/api";
const apiFetch = async (url, opts = {}) => {
  const r = await fetch(API + url, { headers: { "Content-Type": "application/json" }, ...opts });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ── Formatters ───────────────────────────────────────────────────────────────
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
    .replace(/\[image:[^\]]*\]/gi, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_{2}([^_]+)_{2}/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/[-]{3,}/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
// ── Constants ────────────────────────────────────────────────────────────────
const ACCOUNT_COLORS = ["#1a73e8","#e8471a","#1ae86e","#e8c41a","#8b1ae8","#1ae8d4","#e81a8b","#4287f5","#f54242","#42f587"];
const getColor = (i) => ACCOUNT_COLORS[i % ACCOUNT_COLORS.length];
const initials = (name = "", email = "") => {
  if (name) return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (email[0] || "?").toUpperCase();
};

// ── SMTP Error Parser ────────────────────────────────────────────────────────
const parseSmtpError = (errorStr) => {
  const e = String(errorStr).trim();
  if (e.includes("5.4.5") || e.includes("Daily user sending limit")) return "Daily Sending Limit Exceeded";
  if (e.includes("Authentication failed") || e.includes("5.5.1")) return "Authentication Failed";
  if (e.includes("Please log in with your web browser")) return "Browser Login Required";
  if (e.includes("Invalid credentials")) return "Invalid Credentials";
  if (e.includes("rate limit")) return "Rate Limited";
  if (e.length > 80) return e.slice(0, 80) + "...";
  return e;
};
const shouldBlockSender = (errType) =>
  ["Daily Sending Limit Exceeded","Browser Login Required","Authentication Failed","Invalid Credentials","Rate Limited"].includes(errType);

// ── Export helpers ───────────────────────────────────────────────────────────
const exportToCSV = (mails, filename = "emails.csv") => {
  const headers = ["Date","From Name","From Email","To","Subject","Type","Preview","Folder","Read","Starred"];
  const rows = mails.map(m => [
    formatDateFull(m.date), (m.from&&m.from.name)||"", (m.from&&m.from.email)||"",
    (m.to||[]).map(t => t.email||t.name).join("; "), m.subject||"", m.type||"normal",
    (m.preview||"").replace(/"/g,'""'), m.folder||"", m.read?"Yes":"No", m.starred?"Yes":"No",
  ]);
  const csv = [headers,...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const exportEmailAsEML = (mail) => {
  const fromName  = (mail.from&&mail.from.name)||"";
  const fromEmail = (mail.from&&mail.from.email)||"unknown@unknown.com";
  const toList    = (mail.to||[]).map(t => t.email||t.name).join(", ")||"";
  const subject   = mail.subject||"(no subject)";
  const date      = new Date(mail.date).toUTCString();
  const body      = mail.body||mail.preview||"";
  const isHTML    = /<[a-z][\s\S]*>/i.test(body);
  let eml = "";
  if (isHTML) {
    const plain = body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").trim();
    eml = [
      `From: ${fromName} <${fromEmail}>`, `To: ${toList}`, `Subject: ${subject}`, `Date: ${date}`,
      `MIME-Version: 1.0`, `Content-Type: multipart/alternative; boundary="=_mailos_boundary"`, ``,
      `--=_mailos_boundary`, `Content-Type: text/plain; charset=UTF-8`, `Content-Transfer-Encoding: 8bit`, ``, plain, ``,
      `--=_mailos_boundary`, `Content-Type: text/html; charset=UTF-8`, `Content-Transfer-Encoding: 8bit`, ``,
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`, ``, `--=_mailos_boundary--`,
    ].join("\r\n");
  } else {
    eml = [`From: ${fromName} <${fromEmail}>`, `To: ${toList}`, `Subject: ${subject}`, `Date: ${date}`,
      `MIME-Version: 1.0`, `Content-Type: text/plain; charset=UTF-8`, ``, body].join("\r\n");
  }
  const blob = new Blob([eml], { type: "message/rfc822" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `${subject.slice(0,60).replace(/[^a-z0-9 _\-]/gi,"_")}.eml`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportFolderAsMBOX = (mails, folderName = "emails") => {
  const mbox = mails.map(mail => {
    const fromEmail = (mail.from&&mail.from.email)||"unknown@unknown.com";
    const date      = new Date(mail.date).toUTCString();
    const body      = mail.body||mail.preview||"";
    const isHTML    = /<[a-z][\s\S]*>/i.test(body);
    return [
      `From ${fromEmail} ${date}`,
      `From: ${(mail.from&&mail.from.name)||""} <${fromEmail}>`,
      `To: ${(mail.to||[]).map(t => t.email||t.name).join(", ")}`,
      `Subject: ${mail.subject||"(no subject)"}`, `Date: ${date}`,
      `MIME-Version: 1.0`, `Content-Type: ${isHTML?"text/html":"text/plain"}; charset=UTF-8`, ``, body, ``,
    ].join("\r\n");
  }).join("\r\n");
  const blob = new Blob([mbox], { type: "application/mbox" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `${folderName}_${new Date().toISOString().slice(0,10)}.mbox`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── CSV parsers ──────────────────────────────────────────────────────────────
const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers  = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z]/g,""));
  const nameIdx  = headers.findIndex(h => h.includes("name"));
  const emailIdx = headers.findIndex(h => h.includes("email")||h.includes("mail"));
  const passIdx  = headers.findIndex(h => h.includes("pass")||h.includes("password")||h.includes("apppassword"));
  if (emailIdx === -1 || passIdx === -1) return null;
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const cols = []; let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; }
      else if (line[i] === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else cur += line[i];
    }
    cols.push(cur.trim());
    return {
      name:     nameIdx  !== -1 ? cols[nameIdx]||""  : "",
      email:    emailIdx !== -1 ? cols[emailIdx]||"" : "",
      password: passIdx  !== -1 ? cols[passIdx]||""  : "",
    };
  }).filter(r => r.email && r.password);
};

const parseCampaignCSV = (text) => {
  const parseRow = (line) => {
    const cols = []; let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; }
      else if (line[i] === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else cur += line[i];
    }
    cols.push(cur.trim());
    return cols.map(c => c.replace(/^"|"$/g,"").trim());
  };
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  return { headers: parseRow(lines[0]), rows: lines.slice(1).map(parseRow) };
};

// ── Font / Size constants ────────────────────────────────────────────────────
const FONT_SIZES = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,24,26,28,30,32,36,40,44,48,52,56,60,64,72,80,88,96].map(px => ({ px, label: `${px}px` }));
const FONTS      = ["Arial","Arial Black","Georgia","Helvetica","Times New Roman","Courier New","Verdana","Trebuchet MS","Impact","Tahoma","Palatino Linotype","Garamond","Comic Sans MS","Lucida Console","Lucida Sans Unicode"];
const SIG_FONTS  = ["Arial","Georgia","Helvetica","Times New Roman","Verdana","Trebuchet MS","Courier New","Tahoma"];
const SIG_SIZES  = [8,9,10,11,12,13,14,15,16,18,20,22,24,28,32,36];

// ── Color utils ──────────────────────────────────────────────────────────────
function rgbToHex(rgb) {
  if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return null;
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return rgb;
  return "#" + m.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,"0")).join("");
}
function getComputedFontSizePx(editorEl) {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return "";
    let node = sel.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === 3) node = node.parentElement;
    while (node && node !== editorEl) {
      // Check inline style first
      if (node.style && node.style.fontSize) return node.style.fontSize.replace("px","");
      // Check <font size="..."> legacy tag
      if (node.tagName === "FONT" && node.style.fontSize) return node.style.fontSize.replace("px","");
      node = node.parentElement;
    }
    // Fall back to computed style of the element itself
    if (editorEl) {
      const computed = window.getComputedStyle(editorEl).fontSize;
      return computed ? Math.round(parseFloat(computed)) + "" : "";
    }
    return "";
  } catch(e) { return ""; }
}

// ── Style helpers ────────────────────────────────────────────────────────────
const glassSidebar = () => ({ background: "#fff", borderRight: "1px solid #e0e0e0" });

// ════════════════════════════════════════════════════════════════════════════
// FONT DROPDOWN
// ════════════════════════════════════════════════════════════════════════════
function FontDropdown({ fontName, saveSelection, restoreSelection, editorRef, updateFmt }) {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpen(o => !o); }}
        style={{ height:28, border: fontName ? "1.5px solid rgba(0,0,0,0.4)" : "1.5px solid rgba(0,0,0,0.15)", borderRadius:7, fontSize:11, color: fontName ? "#111" : "#4B5563", background: fontName ? "#f1f3f4" : "#fff", padding:"0 8px", cursor:"pointer", width:148, fontWeight: fontName ? 600 : 400, display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, outline:"none" }}
      >
        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{fontName || "Font"}</span>
        <span style={{ fontSize:8, opacity:0.5, flexShrink:0 }}>▼</span>
      </button>
      {open && (
        <div
          style={{ position:"fixed", zIndex:99999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", maxHeight:240, overflowY:"auto", minWidth:148, marginTop:2 }}
          ref={el => {
            if (el && ref.current) {
              const r = ref.current.getBoundingClientRect();
              el.style.top  = (r.bottom + 2) + "px";
              el.style.left = r.left + "px";
            }
          }}
        >
          {FONTS.map(f => (
            <div key={f}
              onMouseDown={(e) => {
                e.preventDefault();
                restoreSelection();
                document.execCommand("fontName", false, f);
                editorRef.current && editorRef.current.focus();
                saveSelection();
                setTimeout(updateFmt, 0);
                setOpen(false);
              }}
              onMouseEnter={() => setHovered(f)}
              onMouseLeave={() => setHovered(null)}
              style={{ padding:"5px 12px", fontSize:12, cursor:"pointer", fontFamily:f, background: hovered===f ? "#f1f3f4" : fontName===f ? "#e8f0fe" : "transparent", color: fontName===f ? "#1a73e8" : "#202124", fontWeight: fontName===f ? 600 : 400 }}
            >{f}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIZE DROPDOWN
// ════════════════════════════════════════════════════════════════════════════
function SizeDropdown({ currentVal, saveSelection, applyFontSize }) {
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref     = useRef(null);
  const rounded = currentVal ? Math.round(Number(currentVal)) : null;

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button
        onMouseDown={(e) => { e.preventDefault(); saveSelection(); setOpen(o => !o); }}
        style={{ height:28, border: rounded ? "1.5px solid rgba(0,0,0,0.4)" : "1.5px solid rgba(0,0,0,0.15)", borderRadius:7, fontSize:11, color: rounded ? "#111" : "#4B5563", background: rounded ? "#f1f3f4" : "#fff", padding:"0 8px", cursor:"pointer", width:112, fontWeight: rounded ? 600 : 400, display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, outline:"none" }}
      >
        <span>{rounded ? `${rounded}px` : "Size (px)"}</span>
        <span style={{ fontSize:8, opacity:0.5, flexShrink:0 }}>▼</span>
      </button>
      {open && (
        <div
          style={{ position:"fixed", zIndex:99999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", maxHeight:240, overflowY:"auto", minWidth:112, marginTop:2 }}
          ref={el => {
            if (el && ref.current) {
              const r = ref.current.getBoundingClientRect();
              el.style.top  = (r.bottom + 2) + "px";
              el.style.left = r.left + "px";
            }
          }}
        >
          {FONT_SIZES.map(({ px, label }) => (
            <div key={px}
              onMouseDown={(e) => { e.preventDefault(); applyFontSize(px); setOpen(false); }}
              onMouseEnter={() => setHovered(px)}
              onMouseLeave={() => setHovered(null)}
              style={{ padding:"5px 12px", fontSize:12, cursor:"pointer", background: hovered===px ? "#f1f3f4" : rounded===px ? "#e8f0fe" : "transparent", color: rounded===px ? "#1a73e8" : "#202124", fontWeight: rounded===px ? 600 : 400 }}
            >{label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// EDITOR RIGHT-CLICK CONTEXT MENU
// ════════════════════════════════════════════════════════════════════════════
function EditorContextMenu({ x, y, onClose, editorRef }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const sel    = window.getSelection();
  const hasSel = sel && sel.toString().trim().length > 0;

  const doCmd = (cmd, val = null) => {
    editorRef.current && editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onClose();
  };

  const groups = [
    [
      { label:"Cut",        icon:"✂", shortcut:"Ctrl+X", action:()=>doCmd("cut"),       disabled:!hasSel },
      { label:"Copy",       icon:"⎘", shortcut:"Ctrl+C", action:()=>doCmd("copy"),      disabled:!hasSel },
      { label:"Paste",      icon:"📋",shortcut:"Ctrl+V", action: async ()=>{
          try { const t = await navigator.clipboard.readText(); editorRef.current&&editorRef.current.focus(); document.execCommand("insertText",false,t); } catch(e){ document.execCommand("paste"); }
          onClose();
        }
      },
      { label:"Select All", icon:"⬚", shortcut:"Ctrl+A", action:()=>doCmd("selectAll") },
    ],
    [
      { label:"Bold",          icon:"B", shortcut:"Ctrl+B", action:()=>doCmd("bold"),        disabled:!hasSel, bold:true   },
      { label:"Italic",        icon:"I", shortcut:"Ctrl+I", action:()=>doCmd("italic"),      disabled:!hasSel, italic:true },
      { label:"Underline",     icon:"U", shortcut:"Ctrl+U", action:()=>doCmd("underline"),   disabled:!hasSel, ul:true     },
      { label:"Strikethrough", icon:"S", shortcut:"",       action:()=>doCmd("strikeThrough"),disabled:!hasSel, strike:true },
    ],
    [
      { label:"Undo", icon:"↩", shortcut:"Ctrl+Z", action:()=>doCmd("undo") },
      { label:"Redo", icon:"↪", shortcut:"Ctrl+Y", action:()=>doCmd("redo") },
    ],
    [
      { label:"Remove Formatting",   icon:"✕", shortcut:"", action:()=>doCmd("removeFormat"),              disabled:!hasSel },
      { label:"Insert Link",         icon:"🔗",shortcut:"", action:()=>{ const u=window.prompt("URL:","https://"); if(u){ editorRef.current&&editorRef.current.focus(); document.execCommand("createLink",false,u); } onClose(); } },
      { label:"Insert Horizontal Line", icon:"─",shortcut:"", action:()=>{ editorRef.current&&editorRef.current.focus(); document.execCommand("insertHorizontalRule"); onClose(); } },
    ],
  ];

  const vw = window.innerWidth, vh = window.innerHeight;
  const left = x + 265 > vw ? x - 265 : x;
  const top  = y + 330 > vh ? y - 330 : y;

  return (
    <div ref={ref} style={{ position:"fixed", left, top, zIndex:99999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.18)", minWidth:265, padding:"4px 0", animation:"ctxFadeIn 0.1s ease" }}>
      {groups.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && <div style={{ height:1, background:"#f1f3f4", margin:"3px 0" }}/>}
          {group.map((item, i) => (
            <button key={i} onClick={item.disabled ? undefined : item.action}
              style={{ width:"100%", background:"none", border:"none", cursor:item.disabled?"default":"pointer", display:"flex", alignItems:"center", gap:10, padding:"7px 14px", fontSize:12, color:item.disabled?"#c0c0c0":"#202124", textAlign:"left", opacity:item.disabled?0.5:1 }}
              onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background="#f1f3f4"; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; }}
            >
              <span style={{ width:18, fontSize:13, fontWeight:item.bold?700:400, fontStyle:item.italic?"italic":"normal", textDecoration:item.ul?"underline":item.strike?"line-through":"none", flexShrink:0, textAlign:"center" }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.shortcut && <span style={{ fontSize:10, color:"#9CA3AF" }}>{item.shortcut}</span>}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
function TypeBadge({ type }) {
  const cfg = {
    reply:  { label:"RE",     bg:"rgba(26,115,232,0.1)",  color:"#1a73e8",  border:"rgba(26,115,232,0.3)"  },
    auto:   { label:"AUTO",   bg:"rgba(245,158,11,0.1)",  color:"#D97706",  border:"rgba(245,158,11,0.3)"  },
    bounce: { label:"BOUNCE", bg:"rgba(239,68,68,0.1)",   color:"#EF4444",  border:"rgba(239,68,68,0.3)"   },
    normal: null,
  };
  const c = cfg[type];
  if (!c) return null;
  return <span style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.08em", padding:"2px 6px", borderRadius:"20px", background:c.bg, color:c.color, border:`1px solid ${c.border}`, flexShrink:0 }}>{c.label}</span>;
}

function Avatar({ name, email, color, size = 34 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:`${color}22`, border:`2px solid ${color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.33, fontWeight:700, color, flexShrink:0 }}>
      {initials(name, email)}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", justifyContent:"center", padding:40 }}>
      <div style={{ width:28, height:28, border:"2px solid rgba(0,0,0,0.15)", borderTop:"2px solid #1a73e8", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SIGNATURE EDITOR
// ════════════════════════════════════════════════════════════════════════════
function SignatureEditor({ value, onChange }) {
  const ref          = useRef(null);
  const savedRange   = useRef(null);
  const lastExternal = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (value !== lastExternal.current) {
      lastExternal.current = value;
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const r = sel.getRangeAt(0);
      if (ref.current && ref.current.contains(r.commonAncestorContainer)) savedRange.current = r.cloneRange();
    }
  };
  const restoreRange = () => {
    ref.current && ref.current.focus();
    const sel = window.getSelection();
    if (savedRange.current && sel) { try { sel.removeAllRanges(); sel.addRange(savedRange.current); } catch(e){} }
  };
  const emit = () => { const html = ref.current ? ref.current.innerHTML : ""; lastExternal.current = html; onChange(html); };
  const execCmd = (cmd, val = null) => { restoreRange(); document.execCommand(cmd, false, val); ref.current && ref.current.focus(); emit(); };

  const FmtBtn = ({ cmd, title, children }) => (
    <button title={title} onMouseDown={(e) => { e.preventDefault(); saveRange(); execCmd(cmd); }}
      style={{ background:"none", border:"1px solid transparent", borderRadius:6, cursor:"pointer", padding:"3px 7px", fontSize:12, color:"#202124", lineHeight:1 }}
      onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.background="none"}
    >{children}</button>
  );

  return (
    <div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}>
      <div style={{ padding:"4px 8px", borderBottom:"1px solid #e0e0e0", display:"flex", flexWrap:"wrap", gap:2, alignItems:"center", background:"#f8f9fa" }}>
        <select onMouseDown={saveRange} onChange={e => { const v = e.target.value; if (!v) return; restoreRange(); document.execCommand("fontName",false,v); ref.current&&ref.current.focus(); emit(); e.target.value=""; }}
          style={{ height:24, border:"1px solid #e0e0e0", borderRadius:6, fontSize:11, background:"#fff", padding:"0 5px", cursor:"pointer", width:110 }}>
          <option value="">Font</option>
          {SIG_FONTS.map(f => <option key={f} value={f} style={{ fontFamily:f }}>{f}</option>)}
        </select>
        <select onMouseDown={saveRange} onChange={e => { const px = e.target.value; if (!px) return; restoreRange(); document.execCommand("fontSize",false,"7"); ref.current&&ref.current.querySelectorAll("font[size='7']").forEach(f => { f.removeAttribute("size"); f.style.fontSize=`${px}px`; }); ref.current&&ref.current.focus(); emit(); e.target.value=""; }}
          style={{ height:24, border:"1px solid #e0e0e0", borderRadius:6, fontSize:11, background:"#fff", padding:"0 5px", cursor:"pointer", width:74 }}>
          <option value="">Size</option>
          {SIG_SIZES.map(px => <option key={px} value={px}>{px}px</option>)}
        </select>
        <FmtBtn cmd="bold"      title="Bold"><b>B</b></FmtBtn>
        <FmtBtn cmd="italic"    title="Italic"><i>I</i></FmtBtn>
        <FmtBtn cmd="underline" title="Underline"><u>U</u></FmtBtn>
        <label onMouseDown={saveRange} style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer", padding:"2px 4px", borderRadius:6 }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.08)"}
          onMouseLeave={e => e.currentTarget.style.background="none"}>
          <span style={{ fontSize:12, fontWeight:700 }}>A</span>
          <input type="color" defaultValue="#000000"
            onChange={e => { restoreRange(); document.execCommand("foreColor",false,e.target.value); ref.current&&ref.current.focus(); emit(); }}
            style={{ width:16, height:16, border:"1px solid #e0e0e0", borderRadius:3, padding:0, cursor:"pointer" }}/>
        </label>
        <FmtBtn cmd="removeFormat" title="Clear">✕</FmtBtn>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning spellCheck dir="ltr"
        data-placeholder="e.g. Best regards, Your Name"
        onKeyUp={saveRange} onMouseUp={saveRange}
        onInput={() => { const html = ref.current ? ref.current.innerHTML : ""; lastExternal.current = html; onChange(html); }}
        style={{ minHeight:80, padding:"10px 14px", fontSize:14, lineHeight:1.8, color:"#202124", outline:"none", background:"#fafafa" }}/>
      <style>{`[data-placeholder]:empty:before{content:attr(data-placeholder);color:#b0bec5;pointer-events:none}`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RICH EDITOR
// ════════════════════════════════════════════════════════════════════════════
function RichEditor({ editorRef, initialHTML, onChange }) {
  const [fmt, setFmt] = useState({
    bold:false, italic:false, underline:false, strikeThrough:false,
    superscript:false, subscript:false, justifyLeft:false, justifyCenter:false,
    justifyRight:false, insertUnorderedList:false, insertOrderedList:false,
    fontName:"", fontSize:"", foreColor:"#000000",
  });
  const savedRange = useRef(null);
  const [ctxMenu, setCtxMenu] = useState(null);

  const updateFmt = useCallback(() => {
  try {
    const get = (cmd) => { try { return document.queryCommandState(cmd); } catch(e){ return false; } };
    const val = (cmd) => { try { return document.queryCommandValue(cmd); } catch(e){ return ""; } };

    // Walk DOM to get actual font/color at cursor
    let detectedFont = "", detectedColor = "#000000";
    try {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        let node = sel.getRangeAt(0).commonAncestorContainer;
        if (node.nodeType === 3) node = node.parentElement;
        const el = editorRef.current;
        while (node && node !== el) {
          if (!detectedFont) {
            if (node.style && node.style.fontFamily) detectedFont = node.style.fontFamily.replace(/['"]/g,"").trim();
            else if (node.tagName === "FONT" && node.face) detectedFont = node.face.replace(/['"]/g,"").trim();
          }
          if (!detectedColor || detectedColor === "#000000") {
            if (node.style && node.style.color) {
              const c = rgbToHex(node.style.color);
              if (c) detectedColor = c;
            }
          }
          node = node.parentElement;
        }
      }
    } catch(e) {}

    // Fall back to queryCommandValue if DOM walk found nothing
    const qFont  = val("fontName").replace(/['"]/g,"").trim();
    const qColor = rgbToHex(val("foreColor"));

    setFmt({
      bold:get("bold"), italic:get("italic"), underline:get("underline"),
      strikeThrough:get("strikeThrough"), superscript:get("superscript"), subscript:get("subscript"),
      justifyLeft:get("justifyLeft"), justifyCenter:get("justifyCenter"), justifyRight:get("justifyRight"),
      insertUnorderedList:get("insertUnorderedList"), insertOrderedList:get("insertOrderedList"),
      fontName: detectedFont || qFont || "",
      fontSize: getComputedFontSizePx(editorRef.current),
      foreColor: detectedColor !== "#000000" ? detectedColor : (qColor || "#000000"),
    });
  } catch(e){}
  }, [editorRef]);

  useEffect(() => { document.addEventListener("selectionchange", updateFmt); return () => document.removeEventListener("selectionchange", updateFmt); }, [updateFmt]);
  useEffect(() => { if (editorRef.current) editorRef.current.innerHTML = initialHTML || ""; }, [initialHTML]);

  const saveSelection    = () => { const sel=window.getSelection(); if(sel&&sel.rangeCount>0) savedRange.current=sel.getRangeAt(0).cloneRange(); };
  const restoreSelection = () => { const el=editorRef.current; if(!el)return; el.focus(); const sel=window.getSelection(); if(savedRange.current&&sel){ try{ sel.removeAllRanges(); sel.addRange(savedRange.current); }catch(e){} } };
  const execCmd = (cmd, value=null) => { restoreSelection(); document.execCommand(cmd,false,value); editorRef.current&&editorRef.current.focus(); setTimeout(updateFmt,0); };
  const applyFontSize = (px) => { restoreSelection(); document.execCommand("fontSize",false,"7"); const el=editorRef.current; el.querySelectorAll("font[size='7']").forEach(font=>{ font.removeAttribute("size"); font.style.fontSize=`${px}px`; }); el.focus(); saveSelection(); setTimeout(updateFmt,0); };

  const Btn = ({ cmd, title, active: forceActive, onClick, children }) => {
    const isActive = forceActive !== undefined ? forceActive : (fmt[cmd] || false);
    return (
      <button title={title} onMouseDown={(e) => { e.preventDefault(); saveSelection(); if (onClick) onClick(); else execCmd(cmd); }}
        style={{ background:isActive?"rgba(26,115,232,0.12)":"none", border:isActive?"1.5px solid rgba(26,115,232,0.4)":"1px solid transparent", borderRadius:6, cursor:"pointer", padding:"4px 7px", fontSize:13, color:isActive?"#1a73e8":"#4B5563", fontWeight:isActive?700:400, minWidth:28, display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}
        onMouseEnter={e => { if(!isActive) e.currentTarget.style.background="#f1f3f4"; }}
        onMouseLeave={e => { if(!isActive) e.currentTarget.style.background="none"; }}
      >{children}</button>
    );
  };
  const Sep = () => <div style={{ width:1, height:22, background:"#e0e0e0", margin:"0 3px", alignSelf:"center" }}/>;
  const alignActive = fmt.justifyLeft?"left":fmt.justifyCenter?"center":fmt.justifyRight?"right":"left";

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>
      <div style={{ padding:"5px 10px", borderBottom:"1px solid #e0e0e0", display:"flex", flexWrap:"wrap", gap:3, alignItems:"center", background:"#f8f9fa", flexShrink:0 }}>
        <FontDropdown fontName={fmt.fontName} saveSelection={saveSelection} restoreSelection={restoreSelection} editorRef={editorRef} updateFmt={updateFmt}/>
        <SizeDropdown currentVal={fmt.fontSize} saveSelection={saveSelection} applyFontSize={applyFontSize}/>
        <Sep/>
        <Btn cmd="bold"          title="Bold (Ctrl+B)"><b style={{ fontFamily:"serif", fontSize:14 }}>B</b></Btn>
        <Btn cmd="italic"        title="Italic (Ctrl+I)"><i style={{ fontSize:14 }}>I</i></Btn>
        <Btn cmd="underline"     title="Underline (Ctrl+U)"><u>U</u></Btn>
        <Btn cmd="strikeThrough" title="Strikethrough"><s>S</s></Btn>
        <Btn cmd="superscript"   title="Superscript"><sup style={{ fontSize:9 }}>A²</sup></Btn>
        <Btn cmd="subscript"     title="Subscript"><sub style={{ fontSize:9 }}>A₂</sub></Btn>
        <Sep/>
        <label title="Text Color" style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer", padding:"2px 4px", borderRadius:6 }}
          onMouseEnter={e => e.currentTarget.style.background="#f1f3f4"}
          onMouseLeave={e => e.currentTarget.style.background="none"}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
            <span style={{ fontSize:13, fontWeight:700, color:fmt.foreColor!=="#000000"?fmt.foreColor:"#000", lineHeight:1 }}>A</span>
            <div style={{ width:14, height:3, borderRadius:2, background:fmt.foreColor||"#000000" }}/>
          </div>
          <input type="color" value={fmt.foreColor||"#000000"}
            onMouseDown={saveSelection}
            onInput={(e) => { restoreSelection(); document.execCommand("foreColor",false,e.target.value); editorRef.current&&editorRef.current.focus(); saveSelection(); setTimeout(updateFmt,0); }}
            onChange={(e) => { restoreSelection(); document.execCommand("foreColor",false,e.target.value); editorRef.current&&editorRef.current.focus(); saveSelection(); setTimeout(updateFmt,0); }}
            style={{ width:18, height:18, border:"1px solid #e0e0e0", borderRadius:3, padding:0, cursor:"pointer" }}/>
        </label>
        <Sep/>
        <Btn cmd="justifyLeft"   title="Align Left"  active={alignActive==="left"} ><span style={{ fontSize:12 }}>⬅≡</span></Btn>
        <Btn cmd="justifyCenter" title="Center"       active={alignActive==="center"}><span style={{ fontSize:12 }}>≡</span></Btn>
        <Btn cmd="justifyRight"  title="Align Right"  active={alignActive==="right"} ><span style={{ fontSize:12 }}>≡➡</span></Btn>
        <Sep/>
        <Btn cmd="insertUnorderedList" title="Bullet List"><span style={{ fontSize:11 }}>• ≡</span></Btn>
        <Btn cmd="insertOrderedList"   title="Numbered List"><span style={{ fontSize:11 }}>1.≡</span></Btn>
        <Btn cmd="indent"  title="Indent"><span style={{ fontSize:11 }}>→⊟</span></Btn>
        <Btn cmd="outdent" title="Outdent"><span style={{ fontSize:11 }}>←⊟</span></Btn>
        <Sep/>
        {[
          { label:"🔗 Link", fn:()=>{ const v=window.prompt("URL:","https://"); if(v!==null) execCmd("createLink",v||""); } },
          { label:"🖼 Image",fn:()=>{ const v=window.prompt("Image URL:","https://"); if(v!==null) execCmd("insertImage",v||""); } },
          { label:"── Rule", fn:()=>{ saveSelection(); restoreSelection(); document.execCommand("insertHorizontalRule"); editorRef.current&&editorRef.current.focus(); } },
        ].map(({ label, fn }) => (
          <button key={label} onMouseDown={e => { e.preventDefault(); fn(); }}
            style={{ background:"#f8f9fa", border:"1px solid rgba(0,0,0,0.12)", borderRadius:6, cursor:"pointer", padding:"3px 9px", fontSize:11, color:"#555" }}
            onMouseEnter={e => e.currentTarget.style.background="#f1f3f4"}
            onMouseLeave={e => e.currentTarget.style.background="#f8f9fa"}
          >{label}</button>
        ))}
        <Sep/>
        <Btn cmd="undo" title="Undo (Ctrl+Z)">↩</Btn>
        <Btn cmd="redo" title="Redo (Ctrl+Y)">↪</Btn>
        <button title="Clear formatting" onMouseDown={e => { e.preventDefault(); saveSelection(); restoreSelection(); document.execCommand("removeFormat"); editorRef.current&&editorRef.current.focus(); setTimeout(updateFmt,0); }}
          style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:6, cursor:"pointer", padding:"3px 9px", fontSize:11, color:"#EF4444" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(239,68,68,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(239,68,68,0.06)"}
        >✕ Clear</button>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck dir="ltr"
        data-placeholder="Write your message here…"
        onKeyUp={updateFmt} onMouseUp={updateFmt} onSelect={updateFmt}
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
            const sel = window.getSelection();
            if (!sel || sel.rangeCount===0) return;
            const range = sel.getRangeAt(0); range.deleteContents();
            const br = document.createElement("br"); range.insertNode(br);
            if (!br.nextSibling||(br.nextSibling.nodeType===3&&br.nextSibling.textContent===""))
              br.parentNode.insertBefore(document.createElement("br"), br.nextSibling);
            const newRange = document.createRange(); newRange.setStartAfter(br); newRange.collapse(true);
            sel.removeAllRanges(); sel.addRange(newRange);
          }
        }}
        style={{ flex:1, minHeight:0, overflowY:"auto", padding:"14px 20px", fontSize:14, lineHeight:1.6, color:"#202124", outline:"none", background:"#fff", direction:"ltr" }}
      />
      {ctxMenu && <EditorContextMenu x={ctxMenu.x} y={ctxMenu.y} onClose={() => setCtxMenu(null)} editorRef={editorRef}/>}
      <style>{`
        [contenteditable][data-placeholder]:empty:before{content:attr(data-placeholder);color:#b0bec5;pointer-events:none}
        [contenteditable] p{margin:0;padding:0}
        [contenteditable] blockquote{border-left:3px solid #aaa;margin:4px 0;padding:4px 14px;background:rgba(0,0,0,0.03);color:#333;border-radius:0 8px 8px 0}
        [contenteditable] a{color:#1a73e8;text-decoration:underline}
        [contenteditable] ul,[contenteditable] ol{padding-left:24px;margin:2px 0}
        [contenteditable] hr{border:none;border-top:2px solid rgba(0,0,0,0.12);margin:8px 0}
        [contenteditable] img{max-width:100%;border-radius:6px}
        [contenteditable] h1{font-size:1.6em;font-weight:800;margin:6px 0 2px}
        [contenteditable] h2{font-size:1.3em;font-weight:700;margin:5px 0 2px}
        [contenteditable] h3{font-size:1.1em;font-weight:600;margin:4px 0 2px}
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIL CONTEXT MENU (right-click on email in list)
// ════════════════════════════════════════════════════════════════════════════
function ContextMenu({ x, y, mail, allVisibleMails, onClose, folderLabel, onToggleStar, onMarkRead }) {
  const ref = useRef();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const items = [
    { icon:<Ic.Mail s={13}/>, label: mail.read ? "Mark as Unread" : "Mark as Read", action:()=>{ onMarkRead(mail,!mail.read); onClose(); } },
    { icon:<Ic.Star s={13}/>, label: mail.starred ? "Remove star" : "Star this email", action:()=>{ onToggleStar(mail); onClose(); } },
    { divider: true },
    { icon:<Ic.Download s={13}/>, label:"Save as .EML (open in Outlook / Apple Mail)", action:()=>{ exportEmailAsEML(mail); onClose(); } },
    { icon:<Ic.Download s={13}/>, label:"Export this email as CSV", action:()=>{ exportToCSV([mail], `email_${(mail.subject||"email").slice(0,20)}.csv`); onClose(); } },
    { divider: true },
    { icon:<Ic.Download s={13}/>, label:`Export all ${allVisibleMails.length} as .MBOX`, action:()=>{ exportFolderAsMBOX(allVisibleMails, folderLabel||"emails"); onClose(); } },
    { icon:<Ic.Download s={13}/>, label:`Export all ${allVisibleMails.length} as CSV`, action:()=>{ exportToCSV(allVisibleMails, `${folderLabel||"emails"}.csv`); onClose(); } },
  ];

  const menuW = 295, menuH = items.length * 42;
  const vw = window.innerWidth, vh = window.innerHeight;
  const left = x + menuW > vw ? x - menuW : x;
  const top  = y + menuH > vh ? y - menuH : y;

  return (
    <div ref={ref} style={{ position:"fixed", left, top, zIndex:9999, background:"#fff", border:"1px solid #e0e0e0", borderRadius:14, boxShadow:"0 8px 40px rgba(0,0,0,0.18)", minWidth:menuW, padding:"6px 0", animation:"ctxFadeIn 0.12s ease" }}>
      <div style={{ padding:"10px 14px 8px", borderBottom:"1px solid #f1f3f4" }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mail.subject||"(no subject)"}</div>
        <div style={{ fontSize:10, color:"#1a73e8", marginTop:2 }}>{(mail.from&&mail.from.name)||(mail.from&&mail.from.email)}</div>
      </div>
      {items.map((item, i) => item.divider
        ? <div key={i} style={{ height:1, background:"#f1f3f4", margin:"3px 0" }}/>
        : <button key={i} onClick={item.action}
            style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"9px 14px", fontSize:12, color:"#202124", textAlign:"left" }}
            onMouseEnter={e => e.currentTarget.style.background="#f8f9fa"}
            onMouseLeave={e => e.currentTarget.style.background="none"}
          >
            <span style={{ width:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</span>
            {item.label}
          </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CSV IMPORT MODAL
// ════════════════════════════════════════════════════════════════════════════
function CSVImportModal({ onClose, onImported, existingAccounts = [] }) {
  const [step, setStep]       = useState(1);
  const [rows, setRows]       = useState([]);
  const [results, setResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError]     = useState("");
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result);
      if (parsed === null) { setError("CSV must have: Name, Email, Password columns."); return; }
      if (parsed.length === 0) { setError("No valid rows found."); return; }
      const seenEmails = new Set(), uniqueRows = [], dupsInCSV = [];
      parsed.forEach(row => {
        const em = (row.email||"").trim().toLowerCase();
        if (!em) return;
        if (seenEmails.has(em)) { dupsInCSV.push(em); return; }
        seenEmails.add(em); uniqueRows.push(row);
      });
      const alreadyAdded = [], newRows = uniqueRows.filter(row => {
        const em = (row.email||"").trim().toLowerCase();
        const exists = existingAccounts.find(a => (a.email||"").toLowerCase() === em);
        if (exists) { alreadyAdded.push(em); return false; }
        return true;
      });
      const available = 500 - existingAccounts.length;
      const finalRows = newRows.slice(0, available);
      let notice = "";
      if (dupsInCSV.length)       notice += `${dupsInCSV.length} duplicate(s) removed. `;
      if (alreadyAdded.length)    notice += `${alreadyAdded.length} already added, skipped. `;
      if (newRows.length > available) notice += `Capped at ${available}. `;
      if (finalRows.length === 0) { setError("All emails already added or limit reached."); return; }
      setError(notice ? "⚠ " + notice.trim() : "");
      setRows(finalRows); setStep(2);
    };
    reader.readAsText(file);
  };

  const startImport = async () => {
    setStep(3);
    const res = new Array(rows.length).fill(null);
    const BATCH = 10;
    for (let b = 0; b < rows.length; b += BATCH) {
      const batch = rows.slice(b, b + BATCH);
      await Promise.all(batch.map(async (row, j) => {
        const idx = b + j;
        try {
          const acc = await apiFetch("/accounts", { method:"POST", body:JSON.stringify({ email:row.email, password:row.password, name:row.name }) });
          res[idx] = { ...row, status:"success", account:acc };
          onImported(acc);
        } catch(e) { res[idx] = { ...row, status:"error", error:e.message }; }
      }));
    }
    setResults(res.filter(Boolean)); setStep(4);
  };

  const successCount = results.filter(r => r.status==="success").length;
  const failCount    = results.filter(r => r.status==="error").length;
  const modal = { background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,0.14)", border:"1px solid #e0e0e0" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={step!==3?onClose:undefined}>
      <div style={{ ...modal, width:520, maxHeight:"85vh", display:"flex", flexDirection:"column" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e0e0e0", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📊</div>
          <div>
            <h2 style={{ fontSize:16, fontWeight:700, color:"#202124" }}>Import Accounts via CSV</h2>
            <p style={{ fontSize:12, color:"#1a73e8", marginTop:2 }}>
              {step===1&&"Upload CSV"}{step===2&&`${rows.length} accounts ready`}{step===3&&"Connecting…"}{step===4&&`Done — ${successCount} connected`}
            </p>
          </div>
          {step!==3 && <button onClick={onClose} style={{ marginLeft:"auto", background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", fontSize:18, width:30, height:30, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>}
        </div>
        <div style={{ height:3, background:"#f1f3f4" }}><div style={{ height:"100%", background:"#1a73e8", width:`${(step/4)*100}%`, transition:"width 0.5s", borderRadius:2 }}/></div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {step===1&&(<>
            {error && <div style={{ background:error.startsWith("⚠")?"rgba(245,158,11,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${error.startsWith("⚠")?"rgba(245,158,11,0.3)":"rgba(239,68,68,0.25)"}`, borderRadius:10, padding:"10px 14px", marginBottom:16 }}><p style={{ fontSize:12, color:error.startsWith("⚠")?"#D97706":"#EF4444" }}>{error}</p></div>}
            <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current&&fileRef.current.click()}
              style={{ border:`2px dashed ${dragOver?"#1a73e8":"#d1d5db"}`, borderRadius:16, padding:"36px 20px", textAlign:"center", cursor:"pointer", background:dragOver?"#eff6ff":"#fafafa", marginBottom:16, transition:"all 0.18s" }}>
              <div style={{ fontSize:40, marginBottom:10 }}>📂</div>
              <p style={{ fontSize:14, fontWeight:600, color:"#202124", marginBottom:6 }}>Drop your CSV file here</p>
              <p style={{ fontSize:12, color:"#1a73e8" }}>or click to browse</p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
            </div>
          </>)}
          {step===2 && (
            <div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ background:"#f8f9fa" }}>{["#","Name","Email","Password"].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontWeight:700, color:"#6B7280", borderBottom:"1px solid #e0e0e0", fontSize:11 }}>{h}</th>)}</tr></thead>
                <tbody>{rows.map((row,i)=><tr key={i} style={{ borderBottom:i!==rows.length-1?"1px solid #e0e0e0":"none" }}><td style={{ padding:"8px 12px", color:"#9CA3AF", width:30 }}>{i+1}</td><td style={{ padding:"8px 12px", color:"#202124", fontWeight:500 }}>{row.name||"—"}</td><td style={{ padding:"8px 12px", color:"#202124", fontFamily:"monospace", fontSize:11 }}>{row.email}</td><td style={{ padding:"8px 12px", color:"#9CA3AF", fontFamily:"monospace", fontSize:11 }}>{"•".repeat(Math.min(row.password.length,12))}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          {step===3 && <div style={{ textAlign:"center", padding:"30px 0" }}><div style={{ width:50, height:50, border:"3px solid #e0e0e0", borderTop:"3px solid #1a73e8", borderRadius:"50%", animation:"spin 0.7s linear infinite", margin:"0 auto 16px" }}/><p style={{ fontSize:14, fontWeight:600, color:"#202124" }}>Connecting accounts…</p></div>}
          {step===4 && (<>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <div style={{ flex:1, background:"rgba(26,115,232,0.08)", border:"1px solid rgba(26,115,232,0.25)", borderRadius:10, padding:"14px", textAlign:"center" }}><div style={{ fontSize:24, fontWeight:700, color:"#1a73e8" }}>{successCount}</div><div style={{ fontSize:11, color:"#1a73e8" }}>Connected</div></div>
              {failCount>0 && <div style={{ flex:1, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"14px", textAlign:"center" }}><div style={{ fontSize:24, fontWeight:700, color:"#EF4444" }}>{failCount}</div><div style={{ fontSize:11, color:"#EF4444" }}>Failed</div></div>}
            </div>
            <div style={{ border:"1px solid #e0e0e0", borderRadius:12, overflow:"hidden" }}>
              {results.map((r,i) => <div key={i} style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:i!==results.length-1?"1px solid #e0e0e0":"none", background:r.status==="success"?"rgba(26,115,232,0.03)":"rgba(239,68,68,0.03)" }}><span>{r.status==="success"?<Ic.Check s={16} c="#1a73e8"/>:<Ic.X s={16} c="#EF4444"/>}</span><div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:600, color:"#202124" }}>{r.name||r.email}</div><div style={{ fontSize:11, color:r.status==="success"?"#1a73e8":"#EF4444" }}>{r.status==="success"?r.email:r.error}</div></div></div>)}
            </div>
          </>)}
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

// ════════════════════════════════════════════════════════════════════════════
// ADD ACCOUNT MODAL
// ════════════════════════════════════════════════════════════════════════════
function AddAccountModal({ onClose, onAdded, existingAccounts = [] }) {
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ email:"", password:"", name:"", imapHost:"", imapPort:993, imapSecure:true, smtpHost:"", smtpPort:587, smtpSecure:false });
  const [preset, setPreset]   = useState(null);
  const [testing, setTesting] = useState(false);
  const [error, setError]     = useState("");

  const detectPreset = async (email) => {
  if (!email.includes("@")) return;
  const domain = email.split("@")[1]?.toLowerCase() || "";
  // Try local preset first (instant, no server call)
  if (LOCAL_PRESETS[domain]) {
    const p = LOCAL_PRESETS[domain];
    setPreset(p);
    setForm(prev => ({ ...prev, imapHost:p.host, imapPort:p.port, imapSecure:p.secure, smtpHost:p.smtpHost, smtpPort:p.smtpPort, smtpSecure:p.smtpSecure }));
    return;
  }
  // Fall back to server for custom domains
  try {
    const p = await apiFetch("/presets/"+encodeURIComponent(email));
    if (p && p.host) {
      setPreset(p);
      setForm(prev => ({ ...prev, imapHost:p.host, imapPort:p.port, imapSecure:p.secure, smtpHost:p.smtpHost, smtpPort:p.smtpPort, smtpSecure:p.smtpSecure }));
    }
  } catch(e) {
    // Custom domain — user fills manually
  }
  };
  const handleTest = async () => { setTesting(true); setError(""); try { await apiFetch("/accounts/test", { method:"POST", body:JSON.stringify(form) }); setStep(3); } catch(e) { setError(e.message); } finally { setTesting(false); } };
  const handleAdd  = async () => {
    const emailLower = form.email.trim().toLowerCase();
    const dup = existingAccounts.find(a => (a.email||"").toLowerCase() === emailLower);
    if (dup) { setError("Already added as "+JSON.stringify(dup.name||dup.email)); return; }
    if (existingAccounts.length >= 500) { setError("500-account limit reached."); return; }
    setTesting(true); setError("");
    try { const acc = await apiFetch("/accounts", { method:"POST", body:JSON.stringify(form) }); onAdded(acc); onClose(); }
    catch(e) { setError(e.message); } finally { setTesting(false); }
  };

  const LOCAL_PRESETS = {
  "gmail.com":       { host:"imap.gmail.com",          port:993,  secure:true,  smtpHost:"smtp.gmail.com",          smtpPort:587, smtpSecure:false },
  "googlemail.com":  { host:"imap.gmail.com",          port:993,  secure:true,  smtpHost:"smtp.gmail.com",          smtpPort:587, smtpSecure:false },
  "outlook.com":     { host:"outlook.office365.com",   port:993,  secure:true,  smtpHost:"smtp.office365.com",      smtpPort:587, smtpSecure:false },
  "hotmail.com":     { host:"outlook.office365.com",   port:993,  secure:true,  smtpHost:"smtp.office365.com",      smtpPort:587, smtpSecure:false },
  "live.com":        { host:"outlook.office365.com",   port:993,  secure:true,  smtpHost:"smtp.office365.com",      smtpPort:587, smtpSecure:false },
  "msn.com":         { host:"outlook.office365.com",   port:993,  secure:true,  smtpHost:"smtp.office365.com",      smtpPort:587, smtpSecure:false },
  "office365.com":   { host:"outlook.office365.com",   port:993,  secure:true,  smtpHost:"smtp.office365.com",      smtpPort:587, smtpSecure:false },
  "yahoo.com":       { host:"imap.mail.yahoo.com",     port:993,  secure:true,  smtpHost:"smtp.mail.yahoo.com",     smtpPort:465, smtpSecure:true  },
  "yahoo.co.uk":     { host:"imap.mail.yahoo.com",     port:993,  secure:true,  smtpHost:"smtp.mail.yahoo.com",     smtpPort:465, smtpSecure:true  },
  "ymail.com":       { host:"imap.mail.yahoo.com",     port:993,  secure:true,  smtpHost:"smtp.mail.yahoo.com",     smtpPort:465, smtpSecure:true  },
  "icloud.com":      { host:"imap.mail.me.com",        port:993,  secure:true,  smtpHost:"smtp.mail.me.com",        smtpPort:587, smtpSecure:false },
  "me.com":          { host:"imap.mail.me.com",        port:993,  secure:true,  smtpHost:"smtp.mail.me.com",        smtpPort:587, smtpSecure:false },
  "mac.com":         { host:"imap.mail.me.com",        port:993,  secure:true,  smtpHost:"smtp.mail.me.com",        smtpPort:587, smtpSecure:false },
  "aol.com":         { host:"imap.aol.com",            port:993,  secure:true,  smtpHost:"smtp.aol.com",            smtpPort:465, smtpSecure:true  },
  "protonmail.com":  { host:"127.0.0.1",               port:1143, secure:false, smtpHost:"127.0.0.1",               smtpPort:1025,smtpSecure:false },
  "proton.me":       { host:"127.0.0.1",               port:1143, secure:false, smtpHost:"127.0.0.1",               smtpPort:1025,smtpSecure:false },
  "zoho.com":        { host:"imap.zoho.com",           port:993,  secure:true,  smtpHost:"smtp.zoho.com",           smtpPort:465, smtpSecure:true  },
  "zohomail.com":    { host:"imap.zoho.com",           port:993,  secure:true,  smtpHost:"smtp.zoho.com",           smtpPort:465, smtpSecure:true  },
  "gmx.com":         { host:"imap.gmx.com",            port:993,  secure:true,  smtpHost:"mail.gmx.com",            smtpPort:465, smtpSecure:true  },
  "gmx.net":         { host:"imap.gmx.net",            port:993,  secure:true,  smtpHost:"mail.gmx.net",            smtpPort:465, smtpSecure:true  },
  "web.de":          { host:"imap.web.de",             port:993,  secure:true,  smtpHost:"smtp.web.de",             smtpPort:587, smtpSecure:false },
  "mail.com":        { host:"imap.mail.com",           port:993,  secure:true,  smtpHost:"smtp.mail.com",           smtpPort:465, smtpSecure:true  },
  "fastmail.com":    { host:"imap.fastmail.com",       port:993,  secure:true,  smtpHost:"smtp.fastmail.com",       smtpPort:465, smtpSecure:true  },
  "fastmail.fm":     { host:"imap.fastmail.com",       port:993,  secure:true,  smtpHost:"smtp.fastmail.com",       smtpPort:465, smtpSecure:true  },
  "hey.com":         { host:"imap.hey.com",            port:993,  secure:true,  smtpHost:"smtp.hey.com",            smtpPort:587, smtpSecure:false },
  "tutanota.com":    { host:"mail.tutanota.com",       port:993,  secure:true,  smtpHost:"mail.tutanota.com",       smtpPort:465, smtpSecure:true  },
  "yandex.com":      { host:"imap.yandex.com",         port:993,  secure:true,  smtpHost:"smtp.yandex.com",         smtpPort:465, smtpSecure:true  },
  "yandex.ru":       { host:"imap.yandex.ru",          port:993,  secure:true,  smtpHost:"smtp.yandex.ru",          smtpPort:465, smtpSecure:true  },
  "mail.ru":         { host:"imap.mail.ru",            port:993,  secure:true,  smtpHost:"smtp.mail.ru",            smtpPort:465, smtpSecure:true  },
};

const HINTS = {
  "gmail.com":      { icon:"G",  note:"myaccount.google.com → Security → App Passwords" },
  "googlemail.com": { icon:"G",  note:"myaccount.google.com → Security → App Passwords" },
  "outlook.com":    { icon:"⊞", note:"account.microsoft.com → Security → App Passwords" },
  "hotmail.com":    { icon:"⊞", note:"account.microsoft.com → Security → App Passwords" },
  "live.com":       { icon:"⊞", note:"account.microsoft.com → Security → App Passwords" },
  "office365.com":  { icon:"⊞", note:"Use your Office 365 password directly" },
  "yahoo.com":      { icon:"Y!", note:"Yahoo Account Security → Generate App Password" },
  "ymail.com":      { icon:"Y!", note:"Yahoo Account Security → Generate App Password" },
  "icloud.com":     { icon:"✦", note:"appleid.apple.com → App-Specific Password" },
  "me.com":         { icon:"✦", note:"appleid.apple.com → App-Specific Password" },
  "mac.com":        { icon:"✦", note:"appleid.apple.com → App-Specific Password" },
  "protonmail.com": { icon:"🔒",note:"Requires Proton Mail Bridge app running locally" },
  "proton.me":      { icon:"🔒",note:"Requires Proton Mail Bridge app running locally" },
  "zoho.com":       { icon:"Z",  note:"Zoho Mail → Settings → Mail Accounts → IMAP" },
  "fastmail.com":   { icon:"FM", note:"FastMail → Settings → Privacy & Security → App Passwords" },
  "aol.com":        { icon:"A",  note:"AOL Account Security → Generate App Password" },
  "gmx.com":        { icon:"◉",  note:"Use your GMX password directly" },
  "gmx.net":        { icon:"◉",  note:"Use your GMX password directly" },
  "tutanota.com":   { icon:"🔐",note:"Tutanota doesn't support IMAP — use their app instead" },
  "hey.com":        { icon:"👋", note:"HEY doesn't support IMAP — limited support only" },
  "yandex.com":     { icon:"Я",  note:"Yandex Mail → Settings → Email clients → App Password" },
};
  const hint = HINTS[(form.email.split("@")[1]||"").toLowerCase()];
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
        <div style={{ display:"flex", gap:4, marginBottom:22 }}>
          {["Credentials","Server","Confirm"].map((s,i) => (
            <div key={s} style={{ flex:1 }}>
              <div style={{ height:3, borderRadius:2, background:i>=step?"#f1f3f4":"#1a73e8", marginBottom:4, transition:"all 0.3s" }}/>
              <div style={{ fontSize:10, color:i>=step?"#9CA3AF":"#1a73e8", textAlign:"center" }}>{s}</div>
            </div>
          ))}
        </div>
        {error && <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"10px 14px", marginBottom:16 }}><p style={{ color:"#EF4444", fontSize:12 }}>⚠ {error}</p></div>}
        {step===1 && (<>
          <div style={{ marginBottom:14 }}><label style={lbl}>Display Name</label><input type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="John Doe" style={inp}/></div>
          <div style={{ marginBottom:14 }}><label style={lbl}>Email Address</label><input type="email" value={form.email} onChange={e=>{setForm(p=>({...p,email:e.target.value}));detectPreset(e.target.value);}} placeholder="you@gmail.com" style={inp}/>{hint&&<div style={{ marginTop:8, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"9px 12px" }}><p style={{ fontSize:11, color:"#1d4ed8", fontWeight:600, marginBottom:2 }}>{hint.icon} App Password Required</p><p style={{ fontSize:11, color:"#3b82f6" }}>{hint.note}</p></div>}</div>
          <div style={{ marginBottom:14 }}><label style={lbl}>App Password</label><input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="xxxx xxxx xxxx xxxx" style={{ ...inp, letterSpacing:"0.15em" }}/></div>
        </>)}
        {step===2 && (<>
          {preset && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"9px 12px", marginBottom:14 }}><p style={{ fontSize:11, color:"#16a34a" }}>✓ Auto-detected for {form.email.split("@")[1]}</p></div>}
          <div style={{ marginBottom:14 }}><label style={lbl}>IMAP Host</label><input value={form.imapHost} onChange={e=>setForm(p=>({...p,imapHost:e.target.value}))} placeholder="imap.gmail.com" style={{ ...inp, fontFamily:"monospace" }}/></div>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <div style={{ flex:1 }}><label style={lbl}>IMAP Port</label><input type="number" value={form.imapPort} onChange={e=>setForm(p=>({...p,imapPort:parseInt(e.target.value)}))} style={{ ...inp, fontFamily:"monospace" }}/></div>
            <div style={{ flex:1 }}><label style={lbl}>Security</label><select value={form.imapSecure?"ssl":"starttls"} onChange={e=>setForm(p=>({...p,imapSecure:e.target.value==="ssl"}))} style={{ ...inp, height:38, cursor:"pointer" }}><option value="ssl">SSL/TLS</option><option value="starttls">STARTTLS</option></select></div>
          </div>
          <div style={{ marginBottom:14 }}><label style={lbl}>SMTP Host</label><input value={form.smtpHost} onChange={e=>setForm(p=>({...p,smtpHost:e.target.value}))} placeholder="smtp.gmail.com" style={{ ...inp, fontFamily:"monospace" }}/></div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}><label style={lbl}>SMTP Port</label><input type="number" value={form.smtpPort} onChange={e=>setForm(p=>({...p,smtpPort:parseInt(e.target.value)}))} style={{ ...inp, fontFamily:"monospace" }}/></div>
            <div style={{ flex:1 }}><label style={lbl}>Security</label><select value={form.smtpSecure?"ssl":"starttls"} onChange={e=>setForm(p=>({...p,smtpSecure:e.target.value==="ssl"}))} style={{ ...inp, height:38, cursor:"pointer" }}><option value="ssl">SSL/TLS</option><option value="starttls">STARTTLS</option></select></div>
          </div>
        </>)}
        {step===3 && (
          <div>
            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:14, padding:"24px", marginBottom:18, textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:8, display:"flex", justifyContent:"center" }}><Ic.Check s={40} c="#16a34a"/></div>
              <p style={{ color:"#15803d", fontWeight:600, fontSize:14 }}>Connection verified!</p>
              <p style={{ color:"#1a73e8", fontSize:12, marginTop:4 }}>{form.email}</p>
            </div>
            <div style={{ background:"#fafafa", borderRadius:12, padding:"12px 14px", border:"1px solid #e0e0e0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:11, color:"#6B7280" }}>IMAP</span><span style={{ fontSize:12, color:"#202124", fontFamily:"monospace" }}>{form.imapHost}:{form.imapPort}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ fontSize:11, color:"#6B7280" }}>SMTP</span><span style={{ fontSize:12, color:"#202124", fontFamily:"monospace" }}>{form.smtpHost}:{form.smtpPort}</span></div>
            </div>
          </div>
        )}
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

// ════════════════════════════════════════════════════════════════════════════
// DELAY PANEL
// ════════════════════════════════════════════════════════════════════════════
function DelayPanel({ accId, accName, initialMin, initialMax, onChange }) {
  const toMin = (sec) => sec != null ? Math.round(sec / 60) : "";
  const [minM, setMinM] = useState(toMin(initialMin) !== "" ? toMin(initialMin) : 1);
  const [maxM, setMaxM] = useState(toMin(initialMax) !== "" ? toMin(initialMax) : 3);
  const ns = { width:80, height:42, border:"2px solid #e0e0e0", borderRadius:10, fontSize:18, fontWeight:800, color:"#202124", textAlign:"center", outline:"none", background:"#fafafa", padding:"0 8px", fontFamily:"monospace" };
  const lb = { fontSize:11, color:"#1a73e8", display:"block", marginBottom:7, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" };
  const hMin = (raw) => { const v=Math.max(0,parseInt(raw)||0), nm=maxM<v?v:maxM; setMinM(v); setMaxM(nm); onChange("minDelay",v*60); onChange("maxDelay",nm*60); };
  const hMax = (raw) => { const v=Math.max(minM,parseInt(raw)||0); setMaxM(v); onChange("maxDelay",v*60); };
  return (
    <div>
      <p style={{ fontSize:13, fontWeight:700, color:"#202124", marginBottom:4 }}>⏱ Cool-down Delay — {accName}</p>
      <p style={{ fontSize:11, color:"#6B7280", marginBottom:16 }}>Random wait between Min and Max before each email.</p>
      <div style={{ display:"flex", gap:20, alignItems:"flex-end", flexWrap:"wrap" }}>
        <div><label style={lb}>Min (minutes)</label><input type="number" min="0" max="1440" value={minM} onChange={e=>hMin(e.target.value)} onBlur={e=>hMin(e.target.value)} style={ns}/></div>
        <div style={{ paddingBottom:8, fontSize:20, color:"#d1d5db" }}>—</div>
        <div><label style={lb}>Max (minutes)</label><input type="number" min="0" max="1440" value={maxM} onChange={e=>hMax(e.target.value)} onBlur={e=>hMax(e.target.value)} style={ns}/></div>
      </div>
      <div style={{ marginTop:16, padding:"12px 16px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10 }}>
        <p style={{ fontSize:13, color:"#1d4ed8", fontWeight:600 }}>⏱ Each email waits <b>{minM===maxM?`${minM} min`:`${minM}–${maxM} min`}</b> before sending</p>
        {minM===0&&maxM===0&&<p style={{ fontSize:11, color:"#EF4444", marginTop:5 }}>⚠ Zero delay not recommended</p>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ACCOUNT SETTINGS MODAL
// ════════════════════════════════════════════════════════════════════════════
function AccountSettingsModal({ accounts, signatures, accountSettings, onSignatureChange, onAccountSettingChange, onClose, onAddManual, onAddCSV, onRemove, getColor }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tab,       setTab]       = useState("accounts");
  const [openPanel, setOpenPanel] = useState(null);
  const handleRemove = (acc) => { if (confirmDelete===acc.id){ onRemove(acc.id); setConfirmDelete(null); } else setConfirmDelete(acc.id); };
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
        <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
          {tab==="accounts" && accounts.length===0 && <div style={{ textAlign:"center", padding:"40px 20px", color:"#9CA3AF" }}><div style={{ fontSize:40, marginBottom:12 }}>📭</div><p style={{ fontSize:13 }}>No accounts added yet</p></div>}
          {tab==="accounts" && accounts.map((acc, i) => {
            const color=getColor(i), isConfirm=confirmDelete===acc.id, accSet=accountSettings[acc.id]||{}, hasSig=!!signatures[acc.id];
            const sigOpen=openPanel===acc.id+":sig", delayOpen=openPanel===acc.id+":delay";
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
                    {isConfirm
                      ? <div style={{ display:"flex", gap:5, alignItems:"center" }}><span style={{ fontSize:11, color:"#EF4444", fontWeight:500 }}>Sure?</span><button onClick={()=>handleRemove(acc)} style={{ background:"#EF4444", border:"none", color:"#fff", cursor:"pointer", borderRadius:6, padding:"4px 9px", fontSize:11, fontWeight:600 }}>Yes</button><button onClick={()=>setConfirmDelete(null)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:6, padding:"4px 9px", fontSize:11 }}>No</button></div>
                      : <button onClick={()=>handleRemove(acc)} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:8, padding:"5px 10px", fontSize:11 }}>✕</button>
                    }
                  </div>
                </div>
                {sigOpen && (
                  <div style={{ margin:"0 24px 16px", padding:16, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:14 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                      <div><p style={{ fontSize:13, fontWeight:600, color:"#202124" }}>Signature — {acc.name||acc.email.split("@")[0]}</p><p style={{ fontSize:11, color:"#6B7280", marginTop:2 }}>Used as <code style={{ background:"#f1f3f4", padding:"1px 5px", borderRadius:4, fontSize:10 }}>{"{{Account Signature}}"}</code></p></div>
                      {hasSig && <button onClick={()=>onSignatureChange(acc.id,"")} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:8, padding:"4px 10px", fontSize:11 }}>Clear</button>}
                    </div>
                    <SignatureEditor key={acc.id} value={signatures[acc.id]||""} onChange={html=>onSignatureChange(acc.id,html)}/>
                    {hasSig && <div style={{ marginTop:10, padding:"10px 14px", background:"#fff", border:"1px dashed #e0e0e0", borderRadius:10 }}><p style={{ fontSize:10, color:"#6B7280", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Preview</p><div style={{ fontSize:13 }} dangerouslySetInnerHTML={{ __html:signatures[acc.id] }}/></div>}
                  </div>
                )}
                {delayOpen && (
                  <div style={{ margin:"0 24px 16px", padding:16, background:"#fafafa", border:"1px solid #e0e0e0", borderRadius:14 }}>
                    <DelayPanel key={acc.id+":delay"} accId={acc.id} accName={acc.name||acc.email.split("@")[0]} initialMin={accSet.minDelay} initialMax={accSet.maxDelay} onChange={(key,val)=>onAccountSettingChange(acc.id,key,val)}/>
                  </div>
                )}
              </div>
            );
          })}
          {tab==="add" && (
            <div style={{ padding:"8px 24px" }}>
              {[
                { icon:<Ic.Upload s={22} c="#fff"/>, label:"Import via CSV", sub:"Bulk add multiple accounts at once.", note:"✓ Recommended for multiple accounts", fn:()=>{ onClose(); onAddCSV(); } },
                { icon:<Ic.Pen s={22} c="#fff"/>, label:"Add Manually", sub:"Add a single account with IMAP/SMTP config.", fn:()=>{ onClose(); onAddManual(); } },
              ].map((item, i) => (
                <div key={i} style={{ border:"1px solid #e0e0e0", borderRadius:14, padding:"20px", marginBottom:14, cursor:"pointer", background:"#fff", transition:"all 0.18s" }}
                  onClick={item.fn}
                  onMouseEnter={e=>{ e.currentTarget.style.background="#f8f9fa"; e.currentTarget.style.transform="translateY(-1px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.transform="translateY(0)"; }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:46, height:46, borderRadius:14, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{item.icon}</div>
                    <div><div style={{ fontSize:14, fontWeight:600, color:"#202124" }}>{item.label}</div><div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>{item.sub}</div>{item.note&&<div style={{ fontSize:11, color:"#1a73e8", marginTop:5, fontWeight:500 }}>{item.note}</div>}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #e0e0e0" }}><button onClick={onClose} style={{ width:"100%", background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", cursor:"pointer", borderRadius:12, padding:"10px", fontSize:13, fontWeight:500 }}>Close</button></div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIL ROW + VIRTUAL LIST
// ════════════════════════════════════════════════════════════════════════════
const MailRow = memo(({ mail, isSelected, accColor, onSelect, onRightClick, onStar }) => (
  <div className="mail-row" onClick={()=>onSelect(mail)} onContextMenu={e=>onRightClick(e,mail)}
    style={{ padding:"11px 14px", cursor:"pointer", borderBottom:"1px solid #f1f3f4", background:isSelected?"#eff6ff":"transparent", position:"relative", transition:"background 0.1s" }}>
    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
      <div style={{ position:"relative" }}>
        <Avatar name={mail.from&&mail.from.name} email={mail.from&&mail.from.email} color={accColor} size={34}/>
        {!mail.read && <div style={{ position:"absolute", top:-1, right:-1, width:8, height:8, borderRadius:"50%", background:"#1a73e8", border:"2px solid #fff" }}/>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2 }}>
          <span style={{ fontSize:13, fontWeight:mail.read?400:600, color:mail.read?"#6B7280":"#1a2535", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{(mail.from&&mail.from.name)||(mail.from&&mail.from.email)||"Unknown"}</span>
          <span style={{ fontSize:10, color:"#9CA3AF", flexShrink:0, marginLeft:8 }}>{formatDate(mail.date)}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
          <TypeBadge type={mail.type}/>
          <span style={{ fontSize:12, color:mail.read?"#9CA3AF":"#374151", fontWeight:mail.read?400:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{mail.subject||"(no subject)"}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:"#9CA3AF", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{stripPreview(mail.preview)}</span>
          <div style={{ display:"flex", gap:3, marginLeft:4 }}>
            {mail.hasAttachment && <span style={{ color:"#9CA3AF", fontSize:10 }}>📎</span>}
            <button className="star-btn" onClick={e=>{e.stopPropagation();onStar(mail,e);}}
              style={{ background:"none", border:"none", cursor:"pointer", opacity:mail.starred?1:0, fontSize:13, color:mail.starred?"#F59E0B":"#d1d5db", padding:"0 2px", transition:"all 0.15s" }}>★</button>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const ROW_H = 74;
const VirtualMailList = memo(({ mails, selectedMailId, accounts, onSelect, onRightClick, onStar }) => {
  const outerRef = useRef(null);
  const rafRef   = useRef(null);
  const [scrollTop,  setScrollTop]  = useState(0);
  const [containerH, setContainerH] = useState(600);

  useEffect(() => {
    if (!outerRef.current) return;
    const ro = new ResizeObserver(entries => { if (entries[0]) setContainerH(entries[0].contentRect.height); });
    ro.observe(outerRef.current);
    setContainerH(outerRef.current.clientHeight || 600);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    if (!outerRef.current) return;
    const top = outerRef.current.scrollTop;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => { setScrollTop(top); rafRef.current = null; });
  }, []);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive:true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const { visibleMails, offsetTop, totalH } = useMemo(() => {
    const BUFFER = 8, total = mails.length * ROW_H;
    const start  = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER);
    const end    = Math.min(mails.length, Math.ceil((scrollTop + containerH) / ROW_H) + BUFFER);
    return { visibleMails:mails.slice(start,end), offsetTop:start*ROW_H, totalH:total };
  }, [mails, scrollTop, containerH]);

  const accColorMap = useMemo(() => {
    const map = {};
    accounts.forEach((a, i) => { map[a.id] = getColor(i); });
    return map;
  }, [accounts]);

  return (
    <div ref={outerRef} style={{ flex:1, overflowY:"auto", position:"relative" }}>
      <div style={{ height:totalH, position:"relative" }}>
        <div style={{ position:"absolute", top:offsetTop, left:0, right:0 }}>
          {visibleMails.map(mail => (
            <MailRow key={mail.id} mail={mail} isSelected={selectedMailId===mail.id}
              accColor={accColorMap[mail.accountId]||"#6B7280"}
              onSelect={onSelect} onRightClick={onRightClick} onStar={onStar}/>
          ))}
        </div>
      </div>
    </div>
  );
});

// ════════════════════════════════════════════════════════════════════════════
// COMPOSE MODAL
// ════════════════════════════════════════════════════════════════════════════
function ComposeModal({ accounts, defaultAccountId, replyTo, onClose, onSent }) {
  const [from, setFrom]       = useState(defaultAccountId||(accounts[0]&&accounts[0].id)||"");
  const [to, setTo]           = useState((replyTo&&replyTo.from&&replyTo.from.email)||"");
  const [cc, setCc]           = useState("");
  const [bcc, setBcc]         = useState("");
  const [subject, setSubject] = useState(replyTo?"RE: "+(replyTo.subject||""):"");
  const [sending, setSending] = useState(false);
  const [showCc, setShowCc]   = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [error, setError]     = useState("");
  const editorRef = useRef(null);

  const replyHTML = replyTo
    ? "<p><br></p><p><br></p><div style=\"border-left:3px solid #e0e0e0;padding:8px 16px;margin:12px 0;color:#6B7280;font-size:13px\"><p><b>From:</b> "+((replyTo.from&&replyTo.from.name)||"")+" &lt;"+((replyTo.from&&replyTo.from.email)||"")+"&gt;</p><p><b>Subject:</b> "+(replyTo.subject||"")+"</p><br>"+(replyTo.body||replyTo.preview||"")+"</div>"
    : "";

  const handleSend = async () => {
    if (!to.trim()) return setError("To field is required.");
    if (!subject.trim()) return setError("Subject is required.");
    const html = editorRef.current ? editorRef.current.innerHTML : "";
    if (!html || html === "<br>" || html.trim() === "") return setError("Message body cannot be empty.");
    setSending(true); setError("");
    try {
      await apiFetch("/accounts/"+from+"/send", { method:"POST", body:JSON.stringify({ to, cc, bcc, subject, body:html, replyTo:replyTo&&replyTo.id }) });
      onSent && onSent(); onClose();
    } catch(e) { setError(e.message); } finally { setSending(false); }
  };

  const FR = { display:"flex", alignItems:"center", borderBottom:"1px solid #f1f3f4" };
  const FI = { flex:1, background:"transparent", border:"none", color:"#202124", padding:"10px 16px", fontSize:13, outline:"none" };
  const CB = (a) => ({ background:a?"#eff6ff":"transparent", border:"none", borderRadius:4, color:a?"#1a73e8":"#9CA3AF", cursor:"pointer", padding:"4px 10px", fontSize:12, fontWeight:500, marginRight:2 });

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.38)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"#fff", borderRadius:12, width:"min(90vw,1080px)", height:"min(88vh,750px)", display:"flex", flexDirection:"column", boxShadow:"0 8px 40px rgba(0,0,0,0.22)", overflow:"hidden" }}>
        <div style={{ padding:"12px 18px", background:"#404040", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:500, color:"#fff", flex:1 }}>{replyTo?"Reply":"New Message"}</span>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:6 }}><Ic.X s={14} c="rgba(255,255,255,0.85)"/></button>
        </div>
        <div style={{ flexShrink:0, borderBottom:"1px solid #e0e0e0" }}>
          <div style={FR}>
            <select value={from} onChange={e=>setFrom(e.target.value)} style={{ flex:1, background:"transparent", border:"none", color:"#202124", padding:"10px 16px", fontSize:13, outline:"none", cursor:"pointer" }}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name?""+a.name+" <"+a.email+">":a.email}</option>)}
            </select>
            <div style={{ display:"flex", paddingRight:12 }}>
              <button onClick={()=>setShowCc(!showCc)} style={CB(showCc)}>CC</button>
              <button onClick={()=>setShowBcc(!showBcc)} style={CB(showBcc)}>BCC</button>
            </div>
          </div>
          <div style={FR}><input value={to} onChange={e=>setTo(e.target.value)} placeholder="To" style={FI}/></div>
          {showCc  && <div style={FR}><input value={cc}  onChange={e=>setCc(e.target.value)}  placeholder="CC"  style={FI}/></div>}
          {showBcc && <div style={FR}><input value={bcc} onChange={e=>setBcc(e.target.value)} placeholder="BCC" style={FI}/></div>}
          <div style={{ ...FR, borderBottom:"none" }}><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" style={{ ...FI, fontSize:14, fontWeight:500 }}/></div>
        </div>
        {error && <div style={{ padding:"7px 16px", background:"rgba(239,68,68,0.06)", borderBottom:"1px solid rgba(239,68,68,0.12)", flexShrink:0, display:"flex", alignItems:"center", gap:6 }}><Ic.Alert s={13} c="#EF4444"/><span style={{ fontSize:12, color:"#EF4444" }}>{error}</span></div>}
        <RichEditor editorRef={editorRef} initialHTML={replyHTML}/>
        <div style={{ padding:"10px 18px", borderTop:"1px solid #e0e0e0", display:"flex", alignItems:"center", background:"#fff", flexShrink:0 }}>
          <button onClick={onClose} style={{ background:"transparent", border:"1px solid #e0e0e0", color:"#555", cursor:"pointer", borderRadius:20, padding:"7px 18px", fontSize:13, fontWeight:500 }}>Discard</button>
          <button onClick={handleSend} disabled={sending} style={{ marginLeft:"auto", background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:20, padding:"8px 24px", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>
            <Ic.Send s={13} c="#fff"/>{sending?"Sending...":"Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CAMPAIGNS PAGE
// ════════════════════════════════════════════════════════════════════════════
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
  const [fuSending,       setFuSending]       = useState(false);
  const [fuProgress,      setFuProgress]      = useState(null);
  const [fuIsPaused,      setFuIsPaused]      = useState(false);
  const [sendProgress,    setSendProgress]    = useState(null);
  const [isSending,       setIsSending]       = useState(false);
  const [isPaused,        setIsPaused]        = useState(false);
  const [blockedSenders,  setBlockedSenders]  = useState(new Set());

  const abortRef   = useRef(false);
  const pauseRef   = useRef(false);
  const fuAbortRef = useRef(false);
  const fuPauseRef = useRef(false);
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

  const getSendHistory  = (id) => { try { return JSON.parse(localStorage.getItem("mailOS_history_" + id) || "[]"); } catch(e) { return []; } };
  const update          = (updates) => { if (!selected) return; onUpdateCampaigns(campaigns.map(c => c.id === selected.id ? { ...c, ...updates } : c)); };
  const savePitch       = () => { if (pitchRef.current)   update({ pitch:   pitchRef.current.innerHTML   || "" }); };
  const saveFuPitch     = () => { if (fuPitchRef.current) update({ fuPitch: fuPitchRef.current.innerHTML || "", fuSubject }); };

  const newCampaign = () => {
    const id = "camp_" + Date.now();
    const c  = { id, name:"Untitled Campaign", subject:"", emailCol:-1, csvHeaders:[], csvRows:[], pitch:"", fuPitch:"", fuSubject:"", senderIds:[], status:"draft", batchSize:10, batchDelayMin:15, batchDelayMax:35 };
    onUpdateCampaigns([...campaigns, c]);
    setSelectedId(id); setTab("csv");
  };

  const deleteCampaign = (id) => {
    ["mailOS_sentRows_","mailOS_history_","mailOS_draft_pitch_","mailOS_draft_fu_pitch_","mailOS_draft_fu_subject_","mailOS_tab_"].forEach(k => { try { localStorage.removeItem(k + id); } catch(e) {} });
    onUpdateCampaigns(campaigns.filter(c => c.id !== id));
    if (selectedId === id) { setSelectedId(null); setSendProgress(null); }
  };

  const buildRowMap = (rowIdx, camp) => {
    const map = {}, src = camp || selected;
    if (!src) return map;
    src.csvHeaders.forEach((h, i) => { map[h.trim().toLowerCase()] = (src.csvRows[rowIdx] || [])[i] || ""; });
    return map;
  };

  const buildRowMapArr = (rowArr, headers) => {
    const map = {};
    (headers || []).forEach((h, i) => { map[h.trim().toLowerCase()] = (rowArr || [])[i] || ""; });
    return map;
  };

  const resolveAll = (text, rowMap, passes = 5) => {
    let out = text;
    for (let p = 0; p < passes; p++) {
      const prev = out;
      out = out.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (m, name) => { const k = name.trim().toLowerCase(); return k in rowMap ? rowMap[k] : m; });
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
    reader.onload = e => { const { headers, rows } = parseCampaignCSV(e.target.result); update({ csvHeaders:headers, csvRows:rows }); setTab("pitch"); };
    reader.readAsText(file);
  };

  const toggleSender = (id) => {
    if (!selected) return;
    const ids = selected.senderIds.includes(id) ? selected.senderIds.filter(x => x !== id) : [...selected.senderIds, id];
    update({ senderIds:ids });
  };

  const insertPH   = (name) => { const el = pitchRef.current;   if (!el) return; el.focus(); document.execCommand("insertText", false, "{{" + name + "}}"); };
  const insertFuPH = (name) => { const el = fuPitchRef.current; if (!el) return; el.focus(); document.execCommand("insertText", false, "{{" + name + "}}"); };

  const waitPaused   = async () => { while (pauseRef.current   && !abortRef.current)   await new Promise(r => setTimeout(r, 500)); };
  const waitFuPaused = async () => { while (fuPauseRef.current && !fuAbortRef.current) await new Promise(r => setTimeout(r, 500)); };

  const getGlobalPairs  = ()      => { try { return new Set(JSON.parse(localStorage.getItem("mailOS_global_sent_pairs") || "[]")); } catch(e) { return new Set(); } };
  const addGlobalPair   = (se,te) => { try { const p = getGlobalPairs(); p.add((se||"").toLowerCase() + "::" + (te||"").toLowerCase()); localStorage.setItem("mailOS_global_sent_pairs", JSON.stringify([...p])); } catch(e) {} };

  const sendCampaign = async () => {
    if (!selected || isSending) return;
    if (pitchRef.current) update({ pitch: pitchRef.current.innerHTML || "" });
    const snap    = { ...selected, pitch:(pitchRef.current ? pitchRef.current.innerHTML : "") || selected.pitch || "" };
    const pitch   = snap.pitch;
    if (!pitch.replace(/<[^>]+>/g,"").trim()) { alert("Pitch is empty."); return; }
    if (!snap.subject || !snap.subject.trim()) { alert("Subject line is required."); return; }
    const emailCol = snap.emailCol >= 0 ? snap.emailCol : snap.csvHeaders.findIndex(h => /email|mail/i.test(h));
    if (emailCol < 0) { alert("No email column found."); return; }
    if (snap.senderIds.length === 0) { alert("Select at least one sender."); return; }

    const rows = snap.csvRows, senders = snap.senderIds, total = rows.length;
    const batchSize = snap.batchSize || 10;
    const bMinMs = (snap.batchDelayMin != null ? snap.batchDelayMin : 15) * 60000;
    const bMaxMs = (snap.batchDelayMax != null ? snap.batchDelayMax : 35) * 60000;
    const totalBatches = Math.ceil(total / batchSize);
    const sentKey = "mailOS_sentRows_" + snap.id;
    const sentSet = { current:(()=>{ try { const r = JSON.parse(localStorage.getItem(sentKey) || "[]"); return new Set(r); } catch(e) { return new Set(); } })() };

    setIsSending(true); setIsPaused(false); abortRef.current = false; pauseRef.current = false; setBlockedSenders(new Set());
    const sentRef = { current: sentSet.current.size }, errRef = { current: [] }, logRef = { current: [] }, localBlocked = new Set();
    setSendProgress({ sent:sentRef.current, total, errors:[], done:false, batchNum:1, totalBatches, batchWait:null, phase:"launching", scheduleLog:[] });

    const countdown = async (ms, label) => {
      const end = Date.now() + ms;
      while (Date.now() < end) {
        if (abortRef.current) return;
        await waitPaused();
        if (abortRef.current) return;
        const rem = Math.ceil((end - Date.now()) / 1000);
        setSendProgress(p => p ? { ...p, phase:"waiting", batchWait:{ label, remaining:rem } } : p);
        await new Promise(r => setTimeout(r, 1000));
      }
      setSendProgress(p => p ? { ...p, batchWait:null } : p);
    };

    const emailTask = async (rowIdx, senderId) => {
      if (abortRef.current) return;
      await waitPaused();
      if (abortRef.current) return;
      if (sentSet.current.has(rowIdx)) return;
      if (localBlocked.has(senderId)) { errRef.current = [...errRef.current, { row:rowIdx+1, email:"—", reason:"Sender blocked" }]; setSendProgress(p => p ? { ...p, errors:errRef.current } : p); return; }
      const toEmail = (rows[rowIdx][emailCol] || "").trim();
      if (!toEmail) { errRef.current = [...errRef.current, { row:rowIdx+1, email:"—", reason:"No email" }]; setSendProgress(p => p ? { ...p, errors:errRef.current } : p); return; }
      const accSet = accountSettings[senderId] || {};
      const minMs = (accSet.minDelay != null ? accSet.minDelay : 60) * 1000;
      const maxMs = (accSet.maxDelay != null ? accSet.maxDelay : 180) * 1000;
      const delay = Math.round((minMs + Math.random() * (maxMs - minMs)) / 1000);
      logRef.current = [...logRef.current, { row:rowIdx+1, email:toEmail, delaySec:delay }];
      setSendProgress(p => p ? { ...p, scheduleLog:[...logRef.current] } : p);
      await new Promise(r => setTimeout(r, delay * 1000));
      if (abortRef.current) return;
      await waitPaused();
      if (abortRef.current) return;
      const rMap = buildRowMap(rowIdx, snap);
      let body = resolveAll(pitch, rMap);
      const sig = senderId && signatures[senderId] ? signatures[senderId] : "";
      body = body.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, sig).replace(/\{\{[^}]+\}\}/g, "");
      const resolvedSubject = resolveAll(snap.subject, rMap);
      try {
        await apiFetch("/accounts/" + senderId + "/send", { method:"POST", body:JSON.stringify({ to:toEmail, subject:resolvedSubject, body }) });
        sentRef.current++;
        sentSet.current.add(rowIdx);
        try { localStorage.setItem(sentKey, JSON.stringify([...sentSet.current])); } catch(e) {}
        const sAcc = accounts.find(a => a.id === senderId) || {};
        try {
          const hk = "mailOS_history_" + snap.id;
          const hist = JSON.parse(localStorage.getItem(hk) || "[]");
          hist.push({ rowIdx, sentAt:new Date().toISOString(), senderEmail:sAcc.email||senderId, senderName:sAcc.name||senderId, toEmail, subject:resolvedSubject, bodyHTML:body, rowData:rows[rowIdx], touchType:"first" });
          localStorage.setItem(hk, JSON.stringify(hist));
        } catch(e) {}
        addGlobalPair(sAcc.email || senderId, toEmail);
        logRef.current = logRef.current.map(s => s.row === rowIdx+1 ? { ...s, sent:true } : s);
        setSendProgress(p => p ? { ...p, sent:sentRef.current, scheduleLog:[...logRef.current] } : p);
      } catch(e) {
        const errType = parseSmtpError(e.message);
        errRef.current = [...errRef.current, { row:rowIdx+1, email:toEmail, reason:errType }];
        setSendProgress(p => p ? { ...p, errors:errRef.current } : p);
        if (shouldBlockSender(errType)) { localBlocked.add(senderId); setBlockedSenders(prev => new Set([...prev, senderId])); }
      }
    };

    const firstUnsent = (() => { for (let b = 0; b < totalBatches; b++) { const bs = b*batchSize, be = Math.min(bs+batchSize, total); for (let j = bs; j < be; j++) { if (!sentSet.current.has(j)) return b; } } return totalBatches; })();

    for (let b = firstUnsent; b < totalBatches; b++) {
      if (abortRef.current) break;
      const bs = b*batchSize, be = Math.min(bs+batchSize, total);
      const used = new Set(), assignments = [];
      const gPairs = getGlobalPairs();
      for (let j = bs; j < be; j++) {
        if (sentSet.current.has(j)) continue;
        const te = ((rows[j][emailCol] || "").trim()).toLowerCase();
        let chosen = null;
        for (let k = 0; k < senders.length; k++) { const s = senders[(j+k) % senders.length]; if (!used.has(s) && !gPairs.has(s.toLowerCase() + "::" + te)) { chosen = s; break; } }
        if (!chosen) { for (let k = 0; k < senders.length; k++) { const s = senders[(j+k) % senders.length]; if (!used.has(s)) { chosen = s; break; } } }
        if (chosen) { used.add(chosen); assignments.push({ rowIdx:j, senderId:chosen }); }
      }
      logRef.current = [];
      setSendProgress(p => p ? { ...p, batchNum:b+1, phase:"launching", batchWait:null, scheduleLog:[] } : p);
      if (assignments.length > 0) await Promise.all(assignments.map(({ rowIdx, senderId }) => emailTask(rowIdx, senderId)));
      if (abortRef.current) break;
      if (b < totalBatches - 1) { const wMs = bMinMs + Math.random() * (bMaxMs - bMinMs); await countdown(wMs, "Batch " + (b+1) + "/" + totalBatches + " done — next in"); }
    }
    setIsSending(false); setIsPaused(false); pauseRef.current = false;
    setSendProgress(p => p ? { ...p, done:true, batchWait:null, phase:"done" } : p);
    onUpdateCampaigns(campaigns.map(c => c.id === snap.id ? { ...c, status:sentRef.current >= total ? "sent" : c.status } : c));
  };

  const togglePause   = () => { if (!isSending) return; const np = !isPaused; setIsPaused(np); pauseRef.current = np; setSendProgress(p => p ? { ...p, paused:np, phase:np?"paused":p.batchWait?"waiting":"launching" } : p); };
  const abortCampaign = () => { abortRef.current = true; pauseRef.current = false; setIsSending(false); setIsPaused(false); setSendProgress(p => p ? { ...p, done:true, batchWait:null, phase:"stopped" } : p); };

  const sendFollowup = async () => {
    if (!selected || fuSending) return;
    const fuBody = (fuPitchRef.current ? fuPitchRef.current.innerHTML : "") || selected.fuPitch || "";
    if (!fuBody.replace(/<[^>]+>/g,"").trim()) { alert("Write the follow-up pitch first."); return; }
    const history = getSendHistory(selected.id).filter(h => !h.touchType || h.touchType === "first");
    if (history.length === 0) { alert("No send history. Launch the original campaign first."); return; }
    const bSize = selected.batchSize || 10, total = history.length, totalB = Math.ceil(total / bSize);
    const bMinMs = (selected.batchDelayMin != null ? selected.batchDelayMin : 15) * 60000;
    const bMaxMs = (selected.batchDelayMax != null ? selected.batchDelayMax : 35) * 60000;
    setFuSending(true); fuAbortRef.current = false; fuPauseRef.current = false; setFuIsPaused(false);
    let sent = 0; const errors = [], logR = { current: [] };
    setFuProgress({ sent:0, total, errors:[], done:false, batchNum:1, totalBatches:totalB, batchWait:null, scheduleLog:[], phase:"launching" });

    const fuCountdown = async (ms, label) => {
      const end = Date.now() + ms;
      while (Date.now() < end) { if (fuAbortRef.current) return; const rem = Math.ceil((end-Date.now())/1000); setFuProgress(p => p ? { ...p, batchWait:{ label, remaining:rem }, phase:"waiting" } : p); await new Promise(r => setTimeout(r,1000)); }
      setFuProgress(p => p ? { ...p, batchWait:null } : p);
    };

    const fuTask = async (i) => {
      if (fuAbortRef.current) return;
      await waitFuPaused();
      if (fuAbortRef.current) return;
      const rec = history[i];
      const sAcc = accounts.find(a => a.email === rec.senderEmail);
      const sid  = sAcc ? sAcc.id : null;
      const aSet = sid ? (accountSettings[sid] || {}) : {};
      const minMs = (aSet.minDelay != null ? aSet.minDelay : 60) * 1000;
      const maxMs = (aSet.maxDelay != null ? aSet.maxDelay : 180) * 1000;
      const delay = Math.round((minMs + Math.random()*(maxMs-minMs))/1000);
      logR.current = [...logR.current, { idx:i, email:rec.toEmail, from:rec.senderEmail, delaySec:delay, sent:false }];
      setFuProgress(p => p ? { ...p, scheduleLog:[...logR.current] } : p);
      await new Promise(r => setTimeout(r, delay*1000));
      if (fuAbortRef.current) return;
      const rMap = buildRowMapArr(rec.rowData, selected.csvHeaders);
      let body = resolveAll(fuBody, rMap);
      const sig = sid && signatures[sid] ? signatures[sid] : "";
      body = body.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, sig).replace(/\{\{[^}]+\}\}/g, "");
      const resolvedSubj = (fuSubject||"").trim() ? resolveAll(fuSubject, rMap) || fuSubject : "RE: " + rec.subject;
      const sd = new Date(rec.sentAt);
      const fd = sd.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}) + " " + sd.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});
      const threadHTML = '<div style="font-family:Calibri,sans-serif;font-size:14px;line-height:1.6">' + body + '</div><div style="border-top:1px solid #e0e0e0;margin:20px 0 0;padding-top:14px;font-family:Calibri,sans-serif;font-size:12px;color:#6B7280"><div style="margin-bottom:8px;line-height:1.8"><b>From:</b> ' + rec.senderName + ' &lt;' + rec.senderEmail + '&gt;<br><b>Sent:</b> ' + fd + '<br><b>To:</b> ' + rec.toEmail + '<br><b>Subject:</b> ' + rec.subject + '</div><div style="font-size:14px;color:#202124">' + rec.bodyHTML + '</div></div>';
      try {
        if (!sid) throw new Error("Sender not found: " + rec.senderEmail);
        await apiFetch("/accounts/" + sid + "/send", { method:"POST", body:JSON.stringify({ to:rec.toEmail, subject:resolvedSubj, body:threadHTML }) });
        sent++;
        logR.current = logR.current.map(s => s.idx === i ? { ...s, sent:true } : s);
        try { const hk = "mailOS_history_" + selected.id; const hist = JSON.parse(localStorage.getItem(hk)||"[]"); hist.push({ rowIdx:rec.rowIdx, sentAt:new Date().toISOString(), senderEmail:rec.senderEmail, senderName:rec.senderName, toEmail:rec.toEmail, subject:resolvedSubj, bodyHTML:threadHTML, rowData:rec.rowData, touchType:"followup" }); localStorage.setItem(hk, JSON.stringify(hist)); } catch(e) {}
        setFuProgress(p => p ? { ...p, sent, scheduleLog:[...logR.current] } : p);
      } catch(e) {
        const et = parseSmtpError(e.message); errors.push({ email:rec.toEmail, reason:et });
        logR.current = logR.current.map(s => s.idx===i ? { ...s, error:true, reason:et } : s);
        setFuProgress(p => p ? { ...p, errors:[...errors], scheduleLog:[...logR.current] } : p);
      }
    };

    for (let b = 0; b < totalB; b++) {
      if (fuAbortRef.current) break;
      const bs = b*bSize, be = Math.min(bs+bSize, total);
      logR.current = [];
      setFuProgress(p => p ? { ...p, batchNum:b+1, batchWait:null, scheduleLog:[], phase:"launching" } : p);
      await Promise.all(Array.from({ length:be-bs }, (_,j) => fuTask(bs+j)));
      if (fuAbortRef.current) break;
      if (b < totalB-1) { const wMs = bMinMs + Math.random()*(bMaxMs-bMinMs); await fuCountdown(wMs, "Batch " + (b+1) + "/" + totalB + " done — next in"); }
    }
    setFuSending(false);
    setFuProgress(p => p ? { ...p, done:true, batchWait:null, phase:"done" } : p);
  };

  const hasCSV     = selected && selected.csvHeaders.length > 0;
  const hasPitch   = selected && selected.pitch && selected.pitch.replace(/<[^>]+>/g,"").trim().length > 10;
  const hasSenders = selected && selected.senderIds.length > 0;

  const TabBtn = ({ id, icon, label, done }) => (
    <button onClick={() => { savePitch(); saveFuPitch(); setTab(id); try { if (selectedId) localStorage.setItem("mailOS_tab_" + selectedId, id); } catch(e) {} }}
      style={{ background:"none", border:"none", cursor:"pointer", padding:"10px 16px", fontSize:13, fontWeight:tab===id?600:400, color:tab===id?"#1a73e8":"#6B7280", borderBottom:tab===id?"2px solid #1a73e8":"2px solid transparent", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
      <span>{icon}</span>{label}
      {done && <span style={{ width:6, height:6, borderRadius:"50%", background:"#1a73e8" }}/>}
    </button>
  );

  const SendProgressBar = ({ sp, onTogglePause, onAbort, isPaused, onDismiss }) => {
    if (!sp) return null;
    const pct = Math.round((sp.sent / Math.max(sp.total,1)) * 100);
    const isDone = sp.done;
    return (
      <div style={{ marginBottom:16, padding:"16px 18px", background:isDone?"#f0fdf4":isPaused?"#fefce8":"#eff6ff", border:"1px solid " + (isDone?"#bbf7d0":isPaused?"#fde047":"#bfdbfe"), borderRadius:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#202124" }}>
            {isDone && sp.phase==="stopped" ? "⛔ Stopped — " + sp.sent + "/" + sp.total : isDone ? "✅ Complete — " + sp.sent + "/" + sp.total : isPaused ? "⏸ Paused — " + sp.sent + "/" + sp.total : "🚀 Batch " + sp.batchNum + "/" + sp.totalBatches + " — " + sp.sent + "/" + sp.total}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {!isDone && <><button onClick={onTogglePause} style={{ background:isPaused?"#fefce8":"#eff6ff", border:"1px solid " + (isPaused?"#fde047":"#bfdbfe"), color:isPaused?"#D97706":"#1d4ed8", cursor:"pointer", borderRadius:8, padding:"4px 14px", fontSize:12, fontWeight:700 }}>{isPaused?"▶ Resume":"⏸ Pause"}</button><button onClick={onAbort} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:700 }}>■ Stop</button></>}
            {isDone && <button onClick={onDismiss} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", fontSize:18 }}>×</button>}
          </div>
        </div>
        <div style={{ height:7, background:"rgba(0,0,0,0.06)", borderRadius:4, overflow:"hidden", marginBottom:10 }}>
          <div style={{ height:"100%", width:pct+"%", background:isDone?"#22c55e":isPaused?"#eab308":"#1a73e8", borderRadius:4, transition:"width 0.3s" }}/>
        </div>
        {sp.batchWait && !isPaused && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, padding:"8px 12px", background:"rgba(255,255,255,0.6)", borderRadius:8 }}>
            <span>⏱</span><span style={{ fontSize:12, color:"#202124", fontWeight:600, flex:1 }}>{sp.batchWait.label}</span>
            <span style={{ fontSize:15, fontWeight:800, color:"#1a73e8", fontFamily:"monospace" }}>{Math.floor(sp.batchWait.remaining/60)}:{String(sp.batchWait.remaining%60).padStart(2,"0")}</span>
          </div>
        )}
        {(sp.scheduleLog||[]).length > 0 && (
          <div style={{ maxHeight:160, overflowY:"auto", display:"flex", flexDirection:"column", gap:2 }}>
            {sp.scheduleLog.map(s => (
              <div key={s.row} style={{ display:"flex", alignItems:"center", gap:8, padding:"3px 8px", borderRadius:6, background:"rgba(255,255,255,0.5)" }}>
                <span style={{ fontSize:11, minWidth:16, textAlign:"right", color:"#9CA3AF", fontFamily:"monospace" }}>{s.row}</span>
                <span style={{ fontSize:11, flex:1, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"monospace" }}>{s.email}</span>
                <span style={{ fontSize:10, color:s.sent?"#22c55e":"#1a73e8", fontWeight:600, whiteSpace:"nowrap" }}>{s.sent ? "✅ sent (" + s.delaySec + "s)" : "⏱ in " + s.delaySec + "s"}</span>
              </div>
            ))}
          </div>
        )}
        {sp.errors && sp.errors.length > 0 && (
          <div style={{ marginTop:6, maxHeight:80, overflowY:"auto" }}>
            {sp.errors.map((e,i) => <div key={i} style={{ fontSize:11, color:"#EF4444", fontFamily:"monospace", marginBottom:2 }}>❌ Row {e.row}: {e.email} — {e.reason}</div>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display:isVisible?"flex":"none", flex:1, overflow:"hidden" }}>
      {/* Sidebar */}
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
              <div key={c.id} onClick={() => { setSelectedId(c.id); try { const t = localStorage.getItem("mailOS_tab_" + c.id); setTab(t || "csv"); } catch(e) { setTab("csv"); } }}
                style={{ padding:"12px 14px", cursor:"pointer", borderLeft:isActive?"3px solid #1a73e8":"3px solid transparent", background:isActive?"#eff6ff":"transparent", borderBottom:"1px solid #f1f3f4", transition:"all 0.12s" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8f9fa"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                    <div style={{ fontSize:11, color:"#1a73e8", marginTop:4 }}>{c.csvRows.length} rows · {c.senderIds.length} sender{c.senderIds.length!==1?"s":""}</div>
                    <div style={{ display:"flex", gap:4, marginTop:6 }}>
                      {[["CSV",c.csvHeaders.length>0],["Pitch",!!c.pitch],["Senders",c.senderIds.length>0]].map(([l,ok]) => (
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

      {/* Content */}
      {!selected ? (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
          <div style={{ fontSize:72, opacity:0.06 }}>📢</div>
          <p style={{ color:"#9CA3AF", fontSize:14, fontWeight:500 }}>Select or create a campaign</p>
          <button onClick={newCampaign} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:12, padding:"10px 24px", fontSize:13, fontWeight:600 }}>+ New Campaign</button>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Header */}
          <div style={{ padding:"14px 22px", borderBottom:"1px solid #e0e0e0", background:"#fff", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"#1a73e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>📢</div>
            {editingName
              ? <input value={selected.name} autoFocus onChange={e=>update({name:e.target.value})} onBlur={()=>setEditingName(false)} onKeyDown={e=>{if(e.key==="Enter")setEditingName(false);}} style={{ fontSize:16, fontWeight:700, color:"#202124", border:"none", borderBottom:"2px solid #1a73e8", outline:"none", background:"transparent", flex:1 }}/>
              : <h2 onClick={()=>setEditingName(true)} style={{ fontSize:16, fontWeight:700, color:"#202124", cursor:"text", flex:1 }} title="Click to rename">{selected.name} ✎</h2>
            }
            <div style={{ display:"flex", gap:8 }}>
              <span style={{ fontSize:11, color:"#1a73e8", background:"#eff6ff", borderRadius:8, padding:"4px 10px" }}>{selected.csvRows.length} recipients</span>
              {isSending && <span style={{ fontSize:11, color:"#1a73e8", background:"#eff6ff", borderRadius:8, padding:"4px 10px", fontWeight:600 }}>⚡ Sending…</span>}
              {fuSending && <span style={{ fontSize:11, color:"#D97706", background:"#fef3c7", borderRadius:8, padding:"4px 10px", fontWeight:600 }}>↩ Follow-up…</span>}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid #e0e0e0", padding:"0 22px", overflowX:"auto", background:"#fff", flexShrink:0 }}>
            <TabBtn id="csv"      icon={<Ic.Upload s={13}/>} label="CSV"             done={hasCSV}/>
            <TabBtn id="pitch"    icon={<Ic.Pen s={13}/>}    label="Pitch"           done={hasPitch}/>
            <TabBtn id="senders"  icon={<Ic.Users s={13}/>}  label="Senders"         done={hasSenders}/>
            <TabBtn id="preview"  icon={<Ic.Eye s={13}/>}    label="Preview & Send"  done={false}/>
            <TabBtn id="followup" icon={<Ic.Reply s={13}/>}  label="Follow-up"       done={false}/>
          </div>

          {/* Tab content */}
          <div style={{ flex:1, overflowY:"auto", padding:"22px" }}>

            {/* CSV TAB */}
            {tab==="csv" && (
              <div>
                <div style={{ marginBottom:18 }}><h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Upload Recipients CSV</h3><p style={{ fontSize:12, color:"#6B7280" }}>Column headers become placeholders like <code style={{ background:"#f1f3f4", padding:"1px 6px", borderRadius:5, fontSize:11 }}>{"{{Column Name}}"}</code></p></div>
                <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);handleCSVFile(e.dataTransfer.files[0]);}} onClick={()=>csvFileRef.current&&csvFileRef.current.click()}
                  style={{ border:"2px dashed " + (dragOver?"#1a73e8":selected.csvHeaders.length?"#93c5fd":"#d1d5db"), borderRadius:16, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:selected.csvHeaders.length?"#f0f9ff":"#fafafa", transition:"all 0.18s" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>{selected.csvHeaders.length > 0 ? <Ic.Check s={36} c="#1a73e8"/> : <Ic.Folder s={36} c="#9CA3AF"/>}</div>
                  {selected.csvHeaders.length > 0
                    ? <><p style={{ fontSize:13, fontWeight:700, color:"#202124", marginBottom:4 }}>CSV loaded — {selected.csvRows.length} recipients, {selected.csvHeaders.length} columns</p><p style={{ fontSize:11, color:"#6B7280" }}>Click or drag to replace</p></>
                    : <><p style={{ fontSize:14, fontWeight:600, color:"#202124", marginBottom:6 }}>Drop your CSV here</p><p style={{ fontSize:12, color:"#1a73e8" }}>or click to browse</p></>
                  }
                  <input ref={csvFileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={e=>handleCSVFile(e.target.files&&e.target.files[0])}/>
                </div>
                {selected.csvHeaders.length > 0 && (<>
                  <div style={{ display:"flex", gap:8, marginTop:10 }}>
                    <button onClick={e=>{e.stopPropagation();csvFileRef.current&&csvFileRef.current.click();}} style={{ flex:1, background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#202124", borderRadius:10, padding:"7px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>🔄 Replace CSV</button>
                    <button onClick={e=>{e.stopPropagation();update({csvHeaders:[],csvRows:[],emailCol:-1});}} style={{ flex:1, background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", borderRadius:10, padding:"7px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>🗑 Clear CSV</button>
                  </div>
                  <div style={{ marginTop:16, marginBottom:16 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:"#6B7280", marginBottom:8 }}>📌 Placeholders (click to copy):</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {selected.csvHeaders.map(hdr => <button key={hdr} onClick={()=>navigator.clipboard&&navigator.clipboard.writeText("{{"+hdr+"}}")} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{"}{hdr}{"}}"}</button>)}
                      <button onClick={()=>navigator.clipboard&&navigator.clipboard.writeText("{{Account Signature}}")} style={{ background:"#fef3c7", border:"1px solid #fcd34d", color:"#D97706", borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{Account Signature}}"}</button>
                    </div>
                  </div>
                  <div style={{ border:"1px solid #e0e0e0", borderRadius:14, overflow:"hidden" }}>
                    <div style={{ padding:"10px 14px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0", display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#6B7280" }}>Preview</span>
                      <span style={{ fontSize:11, color:"#1a73e8" }}>{selected.csvRows.length} rows · {selected.csvHeaders.length} cols</span>
                    </div>
                    <div style={{ overflowX:"auto", maxHeight:300, overflowY:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                        <thead style={{ position:"sticky", top:0 }}><tr style={{ background:"#f8f9fa" }}>
                          <th style={{ padding:"7px 10px", textAlign:"left", color:"#6B7280", borderBottom:"1px solid #e0e0e0", fontSize:10 }}>#</th>
                          {selected.csvHeaders.map(h => <th key={h} style={{ padding:"7px 10px", textAlign:"left", color:"#202124", fontWeight:700, borderBottom:"1px solid #e0e0e0", fontSize:10, fontFamily:"monospace" }}>{"{{"}{h}{"}}"}</th>)}
                        </tr></thead>
                        <tbody>{selected.csvRows.map((row,ri) => (
                          <tr key={ri} style={{ borderBottom:"1px solid #f1f3f4", background:ri%2===0?"transparent":"#fafafa" }}>
                            <td style={{ padding:"6px 10px", color:"#9CA3AF", fontFamily:"monospace" }}>{ri+1}</td>
                            {selected.csvHeaders.map((_,ci) => <td key={ci} style={{ padding:"6px 10px", color:"#202124", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row[ci]||""}</td>)}
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                  <div style={{ marginTop:16, textAlign:"right" }}><button onClick={()=>setTab("pitch")} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Next: Write Pitch →</button></div>
                </>)}
              </div>
            )}

            {/* PITCH TAB */}
            {tab==="pitch" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#202124" }}>Write Your Pitch</h3>
                <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"12px 16px" }}>
                  <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Subject Line <span style={{ color:"#EF4444" }}>*</span></label>
                  <input value={selected.subject||""} onChange={e=>update({subject:e.target.value})} placeholder="e.g. Quick question about {{Company Name}}" style={{ width:"100%", height:36, border:"1px solid #e0e0e0", borderRadius:8, fontSize:13, color:"#202124", background:"#fafafa", padding:"0 12px", outline:"none" }}/>
                </div>
                {selected.csvHeaders.length > 0 && (
                  <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"10px 14px" }}>
                    <p style={{ fontSize:11, color:"#9CA3AF", marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Click to insert at cursor</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {selected.csvHeaders.map(hdr => <button key={hdr} onClick={()=>insertPH(hdr)} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{"}{hdr}{"}}"}</button>)}
                      <button onClick={()=>insertPH("Account Signature")} style={{ background:"#fef3c7", border:"1px solid #fcd34d", color:"#D97706", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{Account Signature}}"}</button>
                    </div>
                  </div>
                )}
                <div style={{ border:"1px solid #e0e0e0", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:420, background:"#fff" }}>
                  <RichEditor key={selected.id} editorRef={pitchRef}
                    initialHTML={(()=>{ try { const d = localStorage.getItem("mailOS_draft_pitch_" + selected.id); return d != null ? d : selected.pitch || ""; } catch(e) { return selected.pitch || ""; } })()}
                    onChange={html=>{ try { localStorage.setItem("mailOS_draft_pitch_" + selected.id, html); } catch(e) {} }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <button onClick={()=>{ update({ pitch:(pitchRef.current?pitchRef.current.innerHTML:"")||"", subject:selected.subject||"" }); alert("Saved ✓"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:600 }}>💾 Save Pitch</button>
                  <button onClick={()=>{ update({ pitch:(pitchRef.current?pitchRef.current.innerHTML:"")||"", subject:selected.subject||"" }); setTab("senders"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Next: Senders →</button>
                </div>
              </div>
            )}

            {/* SENDERS TAB */}
            {tab==="senders" && (
              <div>
                <div style={{ marginBottom:18 }}><h3 style={{ fontSize:15, fontWeight:700, color:"#202124", marginBottom:4 }}>Select Sender Accounts</h3></div>
                <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                  <button onClick={()=>update({senderIds:accounts.map(a=>a.id)})} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#6B7280", cursor:"pointer", borderRadius:9, padding:"6px 14px", fontSize:12 }}>Select All</button>
                  <button onClick={()=>update({senderIds:[]})} style={{ background:"#fff", border:"1px solid #e0e0e0", color:"#6B7280", cursor:"pointer", borderRadius:9, padding:"6px 14px", fontSize:12 }}>Deselect All</button>
                  <span style={{ fontSize:12, color:"#1a73e8", alignSelf:"center" }}>{selected.senderIds.length} of {accounts.length} selected</span>
                </div>
                {accounts.length === 0
                  ? <div style={{ textAlign:"center", padding:"40px", color:"#9CA3AF" }}><p>No accounts connected.</p></div>
                  : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {accounts.map((acc, ai) => {
                        const color = getColor(ai), isSel = selected.senderIds.includes(acc.id), isBlocked = blockedSenders.has(acc.id);
                        return (
                          <div key={acc.id} onClick={()=>toggleSender(acc.id)}
                            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:isSel?"2px solid "+color:"2px solid #e0e0e0", borderRadius:14, cursor:"pointer", background:isSel?color+"0d":"#fafafa", opacity:isBlocked?0.5:1, transition:"all 0.15s" }}>
                            <div style={{ width:20, height:20, borderRadius:6, border:isSel?"2px solid "+color:"2px solid #d1d5db", background:isSel?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{isSel && <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>✓</span>}</div>
                            <div style={{ width:42, height:42, borderRadius:"50%", background:color+"18", border:"2px solid "+color+"44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color, flexShrink:0 }}>{(acc.name||acc.email).slice(0,2).toUpperCase()}</div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:14, fontWeight:600, color:isSel?color:"#202124" }}>{acc.name||acc.email.split("@")[0]}</div>
                              <div style={{ fontSize:11, color:"#1a73e8", fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{acc.email}</div>
                            </div>
                            {isBlocked ? <span style={{ fontSize:10, background:"rgba(239,68,68,0.08)", color:"#EF4444", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>⛔ Blocked</span>
                            : signatures[acc.id] ? <span style={{ fontSize:10, background:"#fef3c7", color:"#D97706", borderRadius:6, padding:"2px 7px", fontWeight:600 }}>✍ Sig</span>
                            : <span style={{ fontSize:10, background:"#f1f3f4", color:"#9CA3AF", borderRadius:6, padding:"2px 7px" }}>No sig</span>}
                          </div>
                        );
                      })}
                    </div>
                }
                {selected.senderIds.length > 0 && <div style={{ marginTop:18, textAlign:"right" }}><button onClick={()=>setTab("preview")} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Next: Preview →</button></div>}
              </div>
            )}

            {/* PREVIEW & SEND TAB */}
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
                    <select value={selected.emailCol>=0?selected.emailCol:""} onChange={e=>update({emailCol:Number(e.target.value)})} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:220, outline:"none" }}>
                      <option value="">— Select email column —</option>
                      {selected.csvHeaders.map((h,i) => <option key={i} value={i}>{h}{/email|mail/i.test(h)?" ✉ (auto-detected)":""}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
                  <div>
                    <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Preview Row</label>
                    <select value={previewRow} onChange={e=>setPreviewRow(Number(e.target.value))} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:160, outline:"none" }}>
                      {selected.csvRows.map((row,i) => <option key={i} value={i}>Row {i+1}{row[0]?" — "+row[0]:""}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Sender</label>
                    <select value={previewSender||selected.senderIds[0]||""} onChange={e=>setPreviewSender(e.target.value)} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:200, outline:"none" }}>
                      {selected.senderIds.map(id => { const acc = accounts.find(a => a.id === id); return <option key={id} value={id}>{acc ? (acc.name||acc.email) : id}</option>; })}
                    </select>
                  </div>
                </div>
                {selected.pitch ? (
                  <div style={{ border:"1px solid #e0e0e0", borderRadius:16, overflow:"hidden", background:"#fff", marginBottom:18 }}>
                    <div style={{ padding:"12px 18px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0" }}>
                      <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>From: <b style={{ color:"#202124" }}>{(accounts.find(a=>a.id===(previewSender||selected.senderIds[0]))||{}).email||"—"}</b></div>
                      <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>To: <b style={{ color:"#202124" }}>{(()=>{ const ci = selected.emailCol>=0?selected.emailCol:selected.csvHeaders.findIndex(h=>/email|mail/i.test(h)); return ci>=0?(selected.csvRows[previewRow]||[])[ci]||"—":"—"; })()}</b></div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#202124" }}>Subject: {selected.subject ? resolveAll(selected.subject, buildRowMap(previewRow)) : <span style={{ color:"#EF4444", fontWeight:400, fontSize:12 }}>⚠ No subject</span>}</div>
                    </div>
                    <div style={{ padding:"16px 24px", fontSize:14, lineHeight:1.6, color:"#202124" }} dangerouslySetInnerHTML={{ __html:resolvePitch(selected.pitch, previewRow, previewSender||selected.senderIds[0]) }}/>
                  </div>
                ) : (
                  <div style={{ textAlign:"center", padding:"40px", background:"#f8f9fa", borderRadius:14, border:"1px dashed #e0e0e0", marginBottom:18 }}>
                    <p style={{ fontSize:13, color:"#9CA3AF" }}>No pitch written yet.</p>
                    <button onClick={()=>setTab("pitch")} style={{ marginTop:12, background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:8, padding:"8px 18px", fontSize:12, fontWeight:600 }}>Write Pitch</button>
                  </div>
                )}
                {selected.pitch && selected.senderIds.length > 0 && selected.csvRows.length > 0 && (<>
                  <div style={{ marginBottom:16, padding:"16px", background:"#fff", border:"1px solid #e0e0e0", borderRadius:14 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:"#6B7280", marginBottom:14, textTransform:"uppercase", letterSpacing:"0.05em" }}>⚙ Batch Settings</p>
                    <div style={{ display:"flex", gap:24, flexWrap:"wrap", alignItems:"flex-end" }}>
                      {[
                        { label:"Batch Size", extra:"emails/batch", hint:"→ "+Math.ceil((selected.csvRows.length||1)/(selected.batchSize||10))+" batches", min:1, max:500, val:selected.batchSize!=null?selected.batchSize:10, on:v=>update({batchSize:v}) },
                        { label:"Min Wait",   extra:"minutes",      min:0, max:1440, val:selected.batchDelayMin!=null?selected.batchDelayMin:15, on:v=>update({batchDelayMin:v, batchDelayMax:Math.max(v, selected.batchDelayMax!=null?selected.batchDelayMax:35)}) },
                        { label:"Max Wait",   extra:"minutes",      min:0, max:1440, val:selected.batchDelayMax!=null?selected.batchDelayMax:35, on:v=>update({batchDelayMax:Math.max(selected.batchDelayMin!=null?selected.batchDelayMin:0, v)}) },
                      ].map(({ label, extra, hint, min, max, val, on }) => (
                        <div key={label}>
                          <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:7, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>{label}</label>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <input type="number" min={min} max={max} step="1" value={val} onChange={e=>on(Math.max(min, parseInt(e.target.value)||min))} style={{ width:72, height:38, border:"2px solid #e0e0e0", borderRadius:10, fontSize:14, fontWeight:800, color:"#202124", textAlign:"center", outline:"none", background:"#fafafa", padding:"0 6px", fontFamily:"monospace" }}/>
                            <span style={{ fontSize:12, color:"#6B7280" }}>{extra}</span>
                          </div>
                          {hint && <p style={{ fontSize:10, color:"#9CA3AF", marginTop:4 }}>{hint}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <SendProgressBar sp={sendProgress} onTogglePause={togglePause} onAbort={abortCampaign} isPaused={isPaused} onDismiss={()=>setSendProgress(null)}/>
                  <div style={{ padding:"16px 18px", background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", borderRadius:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                      <div>
                        <p style={{ fontSize:14, fontWeight:700, color:"#202124" }}>Ready to launch!</p>
                        <p style={{ fontSize:12, color:"#1d4ed8", marginTop:3 }}>{selected.csvRows.length} emails · {selected.senderIds.length} sender{selected.senderIds.length>1?"s":""} · {Math.ceil((selected.csvRows.length||1)/(selected.batchSize||10))} batches</p>
                      </div>
                      <button disabled={isSending} onClick={sendCampaign} style={{ background:isSending?"#9CA3AF":"#1a73e8", border:"none", color:"#fff", cursor:isSending?"not-allowed":"pointer", borderRadius:12, padding:"11px 28px", fontSize:14, fontWeight:700 }}>
                        {isSending ? "⏳ " + (sendProgress?sendProgress.sent:0) + "/" + (sendProgress?sendProgress.total:0) + "…" : "🚀 Launch Campaign"}
                      </button>
                    </div>
                  </div>
                </>)}
              </div>
            )}

            {/* FOLLOW-UP TAB */}
            {tab==="followup" && (()=>{
              const history = getSendHistory(selected.id).filter(h => !h.touchType || h.touchType === "first");
              const fuEntry = history[fuPreviewRow] || null;
              const FuSubTab = ({ id, label }) => (
                <button onClick={()=>setFuTab(id)} style={{ background:"none", border:"none", cursor:"pointer", padding:"9px 16px", fontSize:12, fontWeight:fuTab===id?600:400, color:fuTab===id?"#1a73e8":"#6B7280", borderBottom:fuTab===id?"2px solid #1a73e8":"2px solid transparent", whiteSpace:"nowrap" }}>{label}</button>
              );
              return (
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  <div style={{ display:"flex", borderBottom:"1px solid #e0e0e0", marginBottom:18 }}>
                    <FuSubTab id="pitch"   label="✍ Write Follow-up"/>
                    <FuSubTab id="preview" label="👁 Preview & Send"/>
                  </div>
                  {fuTab==="pitch" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                      <h3 style={{ fontSize:15, fontWeight:700, color:"#202124" }}>↩ Write Follow-up Pitch</h3>
                      <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"12px 16px" }}>
                        <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Follow-up Subject</label>
                        <input value={fuSubject} onChange={e=>{ setFuSubject(e.target.value); try { localStorage.setItem("mailOS_draft_fu_subject_" + selected.id, e.target.value); } catch(err) {} }} placeholder={"RE: " + (history[0]?history[0].subject:"(original subject)")} style={{ width:"100%", height:36, border:"1px solid #e0e0e0", borderRadius:8, fontSize:13, color:"#202124", background:"#fafafa", padding:"0 12px", outline:"none" }}/>
                      </div>
                      {selected.csvHeaders.length > 0 && (
                        <div style={{ background:"#fff", border:"1px solid #e0e0e0", borderRadius:12, padding:"10px 14px" }}>
                          <p style={{ fontSize:11, color:"#9CA3AF", marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Click to insert</p>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {selected.csvHeaders.map(hdr => <button key={hdr} onClick={()=>insertFuPH(hdr)} style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{"}{hdr}{"}}"}</button>)}
                            <button onClick={()=>insertFuPH("Account Signature")} style={{ background:"#fef3c7", border:"1px solid #fcd34d", color:"#D97706", borderRadius:7, padding:"4px 10px", fontSize:11, cursor:"pointer", fontFamily:"monospace", fontWeight:600 }}>{"{{Account Signature}}"}</button>
                          </div>
                        </div>
                      )}
                      <div style={{ border:"1px solid #e0e0e0", borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", minHeight:420, background:"#fff" }}>
                        <RichEditor key={selected.id+"_fu"} editorRef={fuPitchRef}
                          initialHTML={(()=>{ try { const d = localStorage.getItem("mailOS_draft_fu_pitch_" + selected.id); return d != null ? d : selected.fuPitch || ""; } catch(e) { return selected.fuPitch || ""; } })()}
                          onChange={html=>{ try { localStorage.setItem("mailOS_draft_fu_pitch_" + selected.id, html); } catch(e) {} }}/>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <button onClick={()=>{ saveFuPitch(); alert("Saved ✓"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:600 }}>💾 Save</button>
                        <button onClick={()=>{ saveFuPitch(); setFuTab("preview"); }} style={{ background:"#1a73e8", border:"none", color:"#fff", cursor:"pointer", borderRadius:10, padding:"9px 22px", fontSize:13, fontWeight:600 }}>Preview & Send →</button>
                      </div>
                    </div>
                  )}
                  {fuTab==="preview" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                      <h3 style={{ fontSize:15, fontWeight:700, color:"#202124" }}>👁 Preview & Send Follow-up</h3>
                      {history.length > 0 && (
                        <div>
                          <label style={{ fontSize:11, color:"#6B7280", display:"block", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em" }}>Preview Recipient</label>
                          <select value={fuPreviewRow} onChange={e=>setFuPreviewRow(Number(e.target.value))} style={{ height:34, border:"1px solid #e0e0e0", borderRadius:8, fontSize:12, color:"#202124", background:"#fafafa", padding:"0 10px", cursor:"pointer", minWidth:240, outline:"none" }}>
                            {history.map((rec,i) => <option key={i} value={i}>Row {i+1} — {rec.toEmail}</option>)}
                          </select>
                        </div>
                      )}
                      {fuEntry && selected.fuPitch ? (()=>{
                        const rMap = buildRowMapArr(fuEntry.rowData, selected.csvHeaders);
                        let body = resolveAll(selected.fuPitch, rMap);
                        const sid = (accounts.find(a=>a.email===fuEntry.senderEmail)||{}).id;
                        const sig = sid && signatures[sid] ? signatures[sid] : '<em style="color:#9CA3AF">[Signature]</em>';
                        body = body.replace(/\{\{\s*Account\s*Signature\s*\}\}/gi, sig).replace(/\{\{([^}]+)\}\}/g, '<span style="background:#fef3c7;color:#D97706;padding:1px 4px;border-radius:4px;font-family:monospace;font-size:0.85em">{{$1}}</span>');
                        const resolvedSubj = (fuSubject||"").trim() ? resolveAll(fuSubject,rMap)||fuSubject : "RE: " + fuEntry.subject;
                        const sd = new Date(fuEntry.sentAt);
                        const fd = sd.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}) + " " + sd.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});
                        const threadHTML = '<div style="font-family:Calibri,sans-serif;font-size:14px;line-height:1.6">' + body + '</div><div style="border-top:1px solid #e0e0e0;margin:20px 0 0;padding-top:14px;font-family:Calibri,sans-serif;font-size:12px;color:#6B7280"><div style="margin-bottom:8px;line-height:1.8"><b>From:</b> ' + fuEntry.senderName + ' &lt;' + fuEntry.senderEmail + '&gt;<br><b>Sent:</b> ' + fd + '<br><b>To:</b> ' + fuEntry.toEmail + '<br><b>Subject:</b> ' + fuEntry.subject + '</div><div style="font-size:14px;color:#202124">' + fuEntry.bodyHTML + '</div></div>';
                        return (
                          <div style={{ border:"1px solid #e0e0e0", borderRadius:16, overflow:"hidden", background:"#fff" }}>
                            <div style={{ padding:"12px 18px", background:"#f8f9fa", borderBottom:"1px solid #e0e0e0" }}>
                              <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>From: <b>{fuEntry.senderEmail}</b></div>
                              <div style={{ fontSize:11, color:"#6B7280", marginBottom:3 }}>To: <b>{fuEntry.toEmail}</b></div>
                              <div style={{ fontSize:13, fontWeight:700, color:"#202124" }}>Subject: {resolvedSubj}</div>
                            </div>
                            <div style={{ padding:"16px 24px", fontSize:14, lineHeight:1.6, color:"#202124" }} dangerouslySetInnerHTML={{ __html:threadHTML }}/>
                          </div>
                        );
                      })() : (
                        <div style={{ textAlign:"center", padding:"30px", background:"#f8f9fa", borderRadius:14, border:"1px dashed #e0e0e0" }}>
                          <p style={{ fontSize:13, color:"#9CA3AF" }}>{history.length === 0 ? "No send history — launch original campaign first." : "No follow-up pitch written yet."}</p>
                        </div>
                      )}
                      <div style={{ padding:"16px 18px", background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"1px solid #bfdbfe", borderRadius:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                          <div>
                            <p style={{ fontSize:14, fontWeight:700, color:"#202124" }}>{history.length === 0 ? "⚠ No history yet" : "Ready to follow up!"}</p>
                            <p style={{ fontSize:12, color:"#1d4ed8", marginTop:3 }}>{history.length} recipients</p>
                          </div>
                          <button disabled={fuSending || history.length === 0} onClick={sendFollowup} style={{ background:fuSending||history.length===0?"#9CA3AF":"#1a73e8", border:"none", color:"#fff", cursor:fuSending||history.length===0?"not-allowed":"pointer", borderRadius:12, padding:"11px 28px", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
                            <Ic.Send s={14} c="#fff"/>{fuSending ? "⏳ " + (fuProgress?fuProgress.sent:0) + "/" + (fuProgress?fuProgress.total:0) + "…" : "↩ Send Follow-up (" + history.length + ")"}
                          </button>
                        </div>
                        {fuProgress && (
                          <div style={{ marginTop:14, padding:"12px 14px", background:"rgba(255,255,255,0.6)", borderRadius:10 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                              <span style={{ fontSize:13, fontWeight:600, color:"#202124" }}>{fuProgress.done?"✅ Done":"⚡ Sending…"} {fuProgress.sent}/{fuProgress.total}</span>
                              {fuProgress.done
                                ? <button onClick={()=>setFuProgress(null)} style={{ background:"none", border:"none", color:"#9CA3AF", cursor:"pointer", fontSize:18 }}>×</button>
                                : <div style={{ display:"flex", gap:6 }}>
                                    <button onClick={()=>{ const np=!fuIsPaused; setFuIsPaused(np); fuPauseRef.current=np; setFuProgress(p=>p?{...p,paused:np}:p); }} style={{ background:fuIsPaused?"#fefce8":"#eff6ff", border:"1px solid " + (fuIsPaused?"#fde047":"#bfdbfe"), color:fuIsPaused?"#D97706":"#1d4ed8", cursor:"pointer", borderRadius:8, padding:"4px 14px", fontSize:12, fontWeight:700 }}>{fuIsPaused?"▶ Resume":"⏸ Pause"}</button>
                                    <button onClick={()=>{ fuAbortRef.current=true; fuPauseRef.current=false; setFuSending(false); setFuIsPaused(false); setFuProgress(p=>p?{...p,done:true,phase:"stopped"}:p); }} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:600 }}>■ Stop</button>
                                  </div>
                              }
                            </div>
                            <div style={{ height:6, background:"rgba(0,0,0,0.06)", borderRadius:3, overflow:"hidden" }}>
                              <div style={{ height:"100%", width:((fuProgress.sent/Math.max(fuProgress.total,1))*100)+"%", background:"#1a73e8", borderRadius:3, transition:"width 0.3s" }}/>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
// FOLDER DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════
const FOLDER_DEFS = [
  { suffix:"inbox",   label:"All Inboxes", icon:<Ic.Inbox s={12}/> },
  { suffix:"replies", label:"Replies",     icon:<Ic.Reply s={12}/> },
  { suffix:"auto",    label:"Automated",   icon:<Ic.Zap s={12}/>   },
  { suffix:"bounce",  label:"Bounced",     icon:<Ic.Alert s={12}/> },
  { suffix:"normal",  label:"Personal",    icon:<Ic.Mail s={12}/>  },
  { suffix:"sent",    label:"Sent",        icon:<Ic.Send s={12}/>  },
];

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
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
  useEffect(() => { try { localStorage.setItem("mailOS_campaigns", JSON.stringify(campaigns)); } catch(e) {} }, [campaigns]);

  useEffect(() => {
    const close = () => setContextMenu(null);
    document.addEventListener("scroll", close, true);
    return () => document.removeEventListener("scroll", close, true);
  }, []);

  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(val), 180);
  }, []);

  const persistSettings = useCallback((sigs, accSet) => {
    clearTimeout(settingsTimer.current);
    settingsTimer.current = setTimeout(() => {
      try {
        localStorage.setItem("mailOS_signatures",      JSON.stringify(sigs));
        localStorage.setItem("mailOS_accountSettings", JSON.stringify(accSet));
      } catch(e) {}
    }, 300);
  }, []);

  const handleSignatureChange      = (id, html) => { setSignatures(p => { const n = { ...p, [id]:html }; persistSettings(n, accountSettings); return n; }); };
  const handleAccountSettingChange = (id, key, val) => { setAccountSettings(p => { const n = { ...p, [id]:{ ...(p[id]||{}), [key]:val } }; persistSettings(signatures, n); return n; }); };

  const loadMails = useCallback(async (acc, folder, refresh = false, silent = false) => {
    const key = acc.id + ":" + folder;
    if (!silent) setLoading(p => ({ ...p, [key]:true }));
    try {
      const url  = folder === "inbox" ? "/accounts/" + acc.id + "/inbox" : "/accounts/" + acc.id + "/sent";
      const msgs = await apiFetch(url + (refresh ? "?refresh=true" : ""));
      setAllMails(p => ({ ...p, [key]:msgs }));
    } catch(e) { console.warn("Failed:", key, e.message); }
    finally { if (!silent) setLoading(p => ({ ...p, [key]:false })); }
  }, []);

  useEffect(() => {
    apiFetch("/accounts").then(list => {
      setAccounts(list);
      list.forEach((acc, i) => {
        setExpandedGroups(p => ({ ...p, [acc.id]: i === 0 }));
        loadMails(acc, "inbox");
        loadMails(acc, "sent");
      });
      if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current);
      autoRefreshTimer.current = setInterval(async () => {
        if (list.length === 0) return;
        try { await Promise.all(list.map(a => loadMails(a, "inbox", true, true).catch(() => {}))); } catch(e) {}
      }, 600000);
    }).catch(() => {});
    return () => { if (autoRefreshTimer.current) clearInterval(autoRefreshTimer.current); };
  }, []);

  const handleAccountAdded = (acc) => {
    setAccounts(p => {
      const dup = p.find(a => (a.email||"").toLowerCase() === (acc.email||"").toLowerCase());
      if (dup) return p;
      if (p.length >= 500) { alert("500-account limit reached."); return p; }
      return [...p, acc];
    });
    setExpandedGroups(p => ({ ...p, [acc.id]:true }));
    loadMails(acc, "inbox");
    loadMails(acc, "sent");
  };

  const handleRemoveAccount = async (id) => {
    await apiFetch("/accounts/" + id, { method:"DELETE" });
    setAccounts(p => p.filter(a => a.id !== id));
    setAllMails(p => { const n = { ...p }; delete n[id+":inbox"]; delete n[id+":sent"]; return n; });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all(accounts.flatMap(a => [loadMails(a,"inbox",true,true), loadMails(a,"sent",true,true)]));
    setRefreshing(false);
  };

  const handleMarkRead = useCallback(async (mail, readVal = true) => {
    const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
    setAllMails(p => { const k = mail.accountId+":"+folder; return { ...p, [k]:(p[k]||[]).map(m => m.id===mail.id ? { ...m, read:readVal } : m) }; });
    setSelectedMail(prev => prev && prev.id === mail.id ? { ...prev, read:readVal } : prev);
    try { await apiFetch("/accounts/" + mail.accountId + "/messages/" + mail.uid + "/read", { method:"PATCH", body:JSON.stringify({ read:readVal }) }); } catch(e) {}
  }, []);

  const handleToggleStar = useCallback(async (mail, e) => {
    e && e.stopPropagation();
    const newVal = !mail.starred;
    const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
    setAllMails(p => { const k = mail.accountId+":"+folder; return { ...p, [k]:(p[k]||[]).map(m => m.id===mail.id ? { ...m, starred:newVal } : m) }; });
    setSelectedMail(prev => prev && prev.id === mail.id ? { ...prev, starred:newVal } : prev);
    try { await apiFetch("/accounts/" + mail.accountId + "/messages/" + mail.uid + "/star", { method:"PATCH", body:JSON.stringify({ starred:newVal, folder:mail.folder }) }); } catch(e) {}
  }, []);

  const handleSelectMail = useCallback((mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      const folder = (mail.folder||"").toLowerCase().includes("sent") ? "sent" : "inbox";
      setAllMails(p => { const k = mail.accountId+":"+folder; return { ...p, [k]:(p[k]||[]).map(m => m.id===mail.id ? { ...m, read:true } : m) }; });
      apiFetch("/accounts/" + mail.accountId + "/messages/" + mail.uid + "/read", { method:"PATCH", body:JSON.stringify({ read:true }) }).catch(() => {});
    }
  }, []);

  const handleRightClick = useCallback((e, mail) => {
    e.preventDefault(); e.stopPropagation();
    setContextMenu({ x:e.clientX, y:e.clientY, mail });
  }, []);

const BOUNCE_FROM = ["mailer-daemon","postmaster","mail delivery","delivery subsystem","delivery notification","smtp error"];
const BOUNCE_SUBJ = ["delivery status notification","undeliverable","delivery failure","failure notice","mail delivery failed","returned mail","message not delivered","delivery incomplete"];
const AUTO_KW    = ["auto-reply","automatic reply","out of office","ooo:","vacation reply","noreply","no-reply","do not reply","donotreply","automated response","auto response","autoreply","away message","i am out","i'm out of","on leave","on vacation","on holiday","be back","will respond when","currently unavailable"];

const allMailsSorted = useMemo(() => {
  const flat = accounts.flatMap(acc => [
    ...(allMails[acc.id+":inbox"]||[]),
    ...(allMails[acc.id+":sent"]||[])
  ]);
  return flat.map(m => {
    if (m.type && m.type !== "normal") return m;
    const s  = (m.subject||"").toLowerCase();
    const em = (m.from?.email||"").toLowerCase();
    const sn = (m.preview||"").toLowerCase();
    const nm = (m.from?.name||"").toLowerCase();

    // Bounce detection
    const isBounce =
      BOUNCE_FROM.some(kw => em.includes(kw) || nm.includes(kw)) ||
      BOUNCE_SUBJ.some(kw => s.includes(kw));
    if (isBounce) return { ...m, type:"bounce" };

    // Auto detection
    const isAuto = AUTO_KW.some(kw => s.includes(kw) || em.includes(kw) || sn.includes(kw));
    if (isAuto) return { ...m, type:"auto" };

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
  }, [allMailsSorted]);

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
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        return (m.subject||"").toLowerCase().includes(q) ||
               (m.from?.name||"").toLowerCase().includes(q) ||
               (m.from?.email||"").toLowerCase().includes(q);
      }
      return true;
    });
  }, [allMailsSorted, selectedFolder, typeFilter, debouncedSearch]);

  const currentFolderLabel = useMemo(() => {
    const labels = { "all-inbox":"All Inboxes","all-replies":"Replies (RE:)","all-auto":"Automated","all-bounce":"Bounced","all-normal":"Personal","all-sent":"Sent" };
    if (labels[selectedFolder]) return labels[selectedFolder];
    const di  = selectedFolder.lastIndexOf("-");
    const aid = selectedFolder.slice(0, di);
    const sfx = selectedFolder.slice(di+1);
    const acc = accounts.find(a => a.id === aid);
    const sfxLabels = { inbox:"Inbox", replies:"Replies", auto:"Automated", bounce:"Bounced", normal:"Personal", sent:"Sent" };
    return acc ? (acc.name||(acc.email||"").split("@")[0]) + " · " + (sfxLabels[sfx]||sfx) : "Mail";
  }, [selectedFolder, accounts]);

  const isLoadingCurrent = useMemo(() =>
    accounts.some(acc => loading[selectedFolder.includes("sent") ? acc.id+":sent" : acc.id+":inbox"]),
    [accounts, selectedFolder, loading]
  );

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Outfit','DM Sans',system-ui,sans-serif" }} onClick={() => setContextMenu(null)}>
      <div style={{ position:"fixed", inset:0, zIndex:0, background:"#f6f8fc" }}/>

      {/* ── SIDEBAR ── */}
      <div style={{ width:sidebarCollapsed?54:244, position:"relative", zIndex:10, background:"#fff", borderRight:"1px solid #e0e0e0", display:"flex", flexDirection:"column", flexShrink:0, transition:"width 0.2s cubic-bezier(.4,0,.2,1)", overflow:"hidden", height:"100vh" }}>
        {/* Logo row */}
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

        {/* Action buttons */}
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

        {/* Search */}
        {!sidebarCollapsed && (
          <div style={{ padding:"4px 10px 6px", flexShrink:0 }}>
            <div style={{ background:"#f8f9fa", borderRadius:10, border:"1px solid #e0e0e0", display:"flex", alignItems:"center", gap:7, padding:"7px 10px" }}>
              <span style={{ color:"#9CA3AF", fontSize:13 }}>⌕</span>
              <input value={search} onChange={e => handleSearchChange(e.target.value)} placeholder="Search…" style={{ background:"none", border:"none", color:"#202124", fontSize:12, width:"100%", outline:"none" }}/>
            </div>
          </div>
        )}

        {/* Folder list */}
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
                    <button onClick={() => setExpandedGroups(p => ({ ...p, [acc.id]:!p[acc.id] }))} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, padding:"5px 14px", color:"#9CA3AF" }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:getColor(ai), flexShrink:0 }}/>
                      <span style={{ fontSize:10, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", flex:1, textAlign:"left", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:getColor(ai) }}>{(acc.name||(acc.email||"").split("@")[0]).slice(0,20)}</span>
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

        {/* Sidebar footer */}
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
            <div style={{ padding:"14px 14px 10px", borderBottom:"1px solid #e0e0e0", background:"#fff" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <h2 style={{ fontSize:14, fontWeight:700, color:"#202124", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{currentFolderLabel}</h2>
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={handleRefresh} title="Refresh" style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#1a73e8", cursor:"pointer", width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}>
                    <span style={{ display:"flex", alignItems:"center", animation:refreshing?"spin 0.7s linear infinite":"none" }}><Ic.Refresh s={13}/></span>
                  </button>
                  <button title="Export CSV" onClick={() => exportToCSV(filteredMails, currentFolderLabel.replace(/\s+/g,"_")+".csv")} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#1a73e8", cursor:"pointer", width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}><Ic.Download s={13}/></button>
                  <button title="Export MBOX" onClick={() => exportFolderAsMBOX(filteredMails, currentFolderLabel)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#1a73e8", cursor:"pointer", padding:"0 8px", height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}>MBX</button>
                </div>
              </div>
              <p style={{ fontSize:11, color:"#9CA3AF", marginTop:3 }}>{filteredMails.length} messages · {filteredMails.filter(m=>!m.read).length} unread</p>
            </div>
            {/* Type filter pills */}
            <div style={{ padding:"8px 12px", display:"flex", gap:5, borderBottom:"1px solid #e0e0e0", overflowX:"auto", background:"#f8f9fa" }}>
              {[{val:"all",label:"All"},{val:"reply",label:"RE:"},{val:"auto",label:"Auto"},{val:"bounce",label:"Bounce"},{val:"normal",label:"Personal"}].map(({ val, label }) => (
                <button key={val} onClick={() => setTypeFilter(val)}
                  style={{ background:typeFilter===val?"#1a73e8":"#fff", border:"1px solid #e0e0e0", borderRadius:20, color:typeFilter===val?"#fff":"#6B7280", cursor:"pointer", padding:"3px 11px", fontSize:11, fontWeight:500, whiteSpace:"nowrap" }}>
                  {label}
                </button>
              ))}
            </div>
            {isLoadingCurrent
              ? <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner/></div>
              : filteredMails.length === 0
                ? <div style={{ flex:1, textAlign:"center", padding:"60px 20px", color:"#9CA3AF" }}><div style={{ fontSize:42, marginBottom:12, opacity:0.3 }}>◌</div><p style={{ fontSize:13 }}>{accounts.length === 0 ? "Add accounts to get started" : "No messages"}</p></div>
                : <VirtualMailList mails={filteredMails} selectedMailId={selectedMail&&selectedMail.id} accounts={accounts} onSelect={handleSelectMail} onRightClick={handleRightClick} onStar={handleToggleStar}/>
            }
          </div>

          {/* Mail viewer */}
          {selectedMail ? (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#fff" }} className="fade-in">
              <div style={{ padding:"16px 24px", borderBottom:"1px solid #e0e0e0", background:"#fff", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h2 style={{ fontSize:18, fontWeight:700, color:"#202124", marginBottom:10, lineHeight:1.3 }}>{selectedMail.subject||"(no subject)"}</h2>
                    <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                      <Avatar name={selectedMail.from&&selectedMail.from.name} email={selectedMail.from&&selectedMail.from.email} color={getColor(accounts.findIndex(a=>a.id===selectedMail.accountId))} size={38}/>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:"#202124" }}>
                          {(selectedMail.from&&selectedMail.from.name)||(selectedMail.from&&selectedMail.from.email)}
                          {selectedMail.from&&selectedMail.from.name && <span style={{ fontSize:11, color:"#9CA3AF", marginLeft:7 }}>&lt;{selectedMail.from.email}&gt;</span>}
                        </div>
                        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>To: {(selectedMail.to||[]).map(t=>t.email||t.name).join(", ")||"—"} · {formatDateFull(selectedMail.date)}</div>
                      </div>
                      <TypeBadge type={selectedMail.type}/>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                    <button onClick={() => handleToggleStar(selectedMail)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", borderRadius:9, color:selectedMail.starred?"#F59E0B":"#d1d5db", cursor:"pointer", padding:"6px 11px", fontSize:16 }}>★</button>
                    <button onClick={() => handleMarkRead(selectedMail, !selectedMail.read)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", borderRadius:9, color:"#1a73e8", cursor:"pointer", padding:"6px 12px", fontSize:12 }}>{selectedMail.read?"Unread":"Read"}</button>
                    <button onClick={() => exportEmailAsEML(selectedMail)} title="Save as .EML" style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", borderRadius:9, color:"#1a73e8", cursor:"pointer", padding:"6px 12px", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:4 }} onMouseEnter={e=>e.currentTarget.style.background="#f1f3f4"} onMouseLeave={e=>e.currentTarget.style.background="#f8f9fa"}><Ic.Download s={12} c="#1a73e8"/>EML</button>
                    <button onClick={() => setShowCompose({ replyTo:selectedMail, accountId:selectedMail.accountId })} style={{ background:"#1a73e8", border:"none", borderRadius:9, color:"#fff", cursor:"pointer", padding:"6px 16px", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:5 }}><Ic.Reply s={13} c="#fff"/>Reply</button>
                    <button onClick={() => setSelectedMail(null)} style={{ background:"#f8f9fa", border:"1px solid #e0e0e0", color:"#9CA3AF", cursor:"pointer", borderRadius:9, fontSize:18, padding:"4px 10px" }}>×</button>
                  </div>
                </div>
              </div>
              {/* Email body */}
              <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", paddingLeft:10, paddingRight:10 }}>
                {selectedMail.body ? (()=>{
                  const isHTML = /<[a-z][\s\S]*>/i.test(selectedMail.body);
                  if (isHTML) {
                    return (
                      <iframe key={selectedMail.id}
                        srcDoc={"<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>body{font-family:Calibri,'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.6;color:#202124;padding:28px 40px 28px 40px;margin:0;word-break:break-word;max-width:800px;}img{max-width:100%!important;height:auto;}a{color:#1a73e8;}p{margin:0 0 8px;}table{border-collapse:collapse;max-width:100%;}blockquote{border-left:3px solid #e0e0e0;margin:8px 0;padding:4px 12px;color:#6B7280;}pre{background:#f8f9fa;border:1px solid #e0e0e0;border-radius:6px;padding:10px 14px;font-family:monospace;font-size:13px;white-space:pre-wrap;}</style></head><body>"+selectedMail.body+"</body></html>"}
                        style={{ flex:1, width:"100%", border:"none", minHeight:0, height:"100%" }}
                        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        title="email-content"
                      />
                    );
                  }
                  const plain = selectedMail.body
                    .replace(/<br\s*\/?>/gi,"\n").replace(/<\/p>/gi,"\n\n").replace(/<\/div>/gi,"\n")
                    .replace(/<[^>]+>/g,"").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&")
                    .replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&quot;/gi,'"')
                    .replace(/\n{3,}/g,"\n\n").trim();
                  return <div style={{ flex:1, overflowY:"auto", padding:"28px 40px", fontSize:14, lineHeight:1.7, fontFamily:"Calibri,'Helvetica Neue',sans-serif", whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#202124", maxWidth:800 }}>{plain}</div>;
                })()
                : selectedMail.preview
                  ? <div style={{ flex:1, overflowY:"auto", padding:"28px 40px", fontSize:14, lineHeight:1.7, color:"#202124", whiteSpace:"pre-wrap", wordBreak:"break-word", maxWidth:800 }}>{stripPreview(selectedMail.preview)}</div>
                  : <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}><div style={{ fontSize:40, opacity:0.2 }}>📭</div><p style={{ fontSize:13, color:"#9CA3AF" }}>No content</p></div>
                }
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:72, opacity:0.04 }}>✉</div>
              <p style={{ color:"#9CA3AF", fontSize:14, fontWeight:500 }}>Select a message to read</p>
            </div>
          )}
        </>)}
      </div>

      {/* ── MODALS ── */}
      {showAdd      && <AddAccountModal existingAccounts={accounts} onClose={() => setShowAdd(false)} onAdded={acc => { handleAccountAdded(acc); setShowAdd(false); }}/>}
      {showCSV      && <CSVImportModal  existingAccounts={accounts} onClose={() => setShowCSV(false)} onImported={handleAccountAdded}/>}
      {showSettings && <AccountSettingsModal accounts={accounts} signatures={signatures} accountSettings={accountSettings} onSignatureChange={handleSignatureChange} onAccountSettingChange={handleAccountSettingChange} onClose={() => setShowSettings(false)} onAddManual={() => { setShowSettings(false); setShowAdd(true); }} onAddCSV={() => { setShowSettings(false); setShowCSV(true); }} onRemove={handleRemoveAccount} getColor={getColor}/>}
      {showCompose  && <ComposeModal accounts={accounts} defaultAccountId={typeof showCompose==="object"?showCompose.accountId:(accounts[0]&&accounts[0].id)} replyTo={typeof showCompose==="object"?showCompose.replyTo:null} onClose={() => setShowCompose(false)} onSent={() => { handleRefresh(); setShowCompose(false); }}/>}
      {contextMenu  && <ContextMenu x={contextMenu.x} y={contextMenu.y} mail={contextMenu.mail} allVisibleMails={filteredMails} folderLabel={currentFolderLabel} onClose={() => setContextMenu(null)} onToggleStar={handleToggleStar} onMarkRead={handleMarkRead}/>}

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(26,115,232,0.2); border-radius:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        body { font-family:'Outfit','DM Sans',system-ui,sans-serif; }
        .mail-row:hover { background:#f8f9fa !important; }
        .mail-row:hover .star-btn { opacity:1 !important; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ctxFadeIn { from { opacity:0; transform:scale(0.95) translateY(-4px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.6;} }
        .fade-in { animation:fadeIn 0.18s cubic-bezier(.4,0,.2,1); }
        select option { background:#fff; color:#202124; }
        input:focus, select:focus { border-color:#1a73e8 !important; box-shadow:0 0 0 2px rgba(26,115,232,0.12) !important; }
      `}</style>
    </div>
  );
}