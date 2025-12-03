// Contact.enhanced.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Contact.enhanced.jsx
 * - Adds drag/drop multi-file upload, previews, per-file validation and remove
 * - Autosave/restore draft to localStorage
 * - Category, budget and timeline optional fields
 * - Message char counter & limit
 * - Honeypot anti-spam field + demo captcha checkbox
 * - Simulated upload progress & optional SEND_ENDPOINT to POST the form (uncomment to use)
 * - Accessibility improvements and analytics hook (console.debug)
 *
 * Replace your previous Contact.jsx with this or merge selectively.
 */

/* ---------- CONFIG ---------- */
const MAP_QUERY = encodeURIComponent("Kurla Garden, Kurla, Mumbai, Maharashtra, India");
const MAP_SRC = `https://www.google.com/maps?q=${MAP_QUERY}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

// Uncomment and set to your real server endpoint if you want to actually POST
const SEND_ENDPOINT = ""; // e.g. "https://api.yourdomain.com/contact"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
const MAX_FILES = 5;
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf", "image/webp"];

const DRAFT_KEY = "contactFormDraft_v2";
const MESSAGE_LIMIT = 2000;

/* ---------- Small icons (same as you used) ---------- */
function IconPhone() { /* ...same svg as before... */ return (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V20a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.63A2 2 0 014 2h3.09a2 2 0 012 1.72c.12 1.13.4 2.24.84 3.28a2 2 0 01-.45 2.11L8.8 10.8c1.95 3.39 5.06 6.5 8.45 8.45l1.96-1.94a2 2 0 012.11-.45c1.04.44 2.15.72 3.28.84A2 2 0 0122 16.92z" />
  </svg>
); }
function IconEmail() { return (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 8l8.5 6L20 8M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12z" />
  </svg>
); }
function IconMap() { return (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.2" strokeWidth="1.2" />
  </svg>
); }
function IconUpload() { return (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12M5 10l7-7 7 7M21 21H3" />
  </svg>
); }
function IconClose() { return (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
); }

/* ---------- utils ---------- */
function makeVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Interior Studio",
    "ORG:Interior Studio;",
    "TEL;TYPE=WORK,VOICE:+918957135387",
    "EMAIL;TYPE=PREF,INTERNET:arbazkhan770300@gmail.com",
    "ADR;TYPE=WORK:;;Kurla Garden;Kurla;Mumbai;Maharashtra;India",
    "END:VCARD",
  ].join("\n");
}

function showDebug(...args) {
  // Replace console.debug with your analytics event call if desired
  console.debug("[ContactAnalytics]", ...args);
}

/* ---------- component ---------- */
export default function ContactEnhanced() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General",
    budget: "",
    timeline: "",
    message: "",
    // honeypot field (should stay empty)
    website: "",
  });

  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]); // { id, file, preview, progress, status }
  const [dragActive, setDragActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false); // demo simple captcha
  const [restoredDraft, setRestoredDraft] = useState(false);

  const fileInputRef = useRef(null);
  const mainFormRef = useRef(null);

  /* load draft on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        // restore if it has at least a name or email or message
        if (data && (data.name || data.email || data.message)) {
          setForm((s) => ({ ...s, ...data }));
          setRestoredDraft(true);
          showToast("Draft restored");
          showDebug("Draft restored", data);
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  /* autosave draft every 2s if user typed something */
  useEffect(() => {
    const id = setInterval(() => {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        budget: form.budget,
        timeline: form.timeline,
        message: form.message,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      showDebug("Draft autosaved");
    }, 2000);
    return () => clearInterval(id);
  }, [form]);

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null }));
  }

  /* file helpers */
  function addFilesFromList(list) {
    const toAdd = Array.from(list).slice(0, MAX_FILES - files.length);
    if (toAdd.length === 0) {
      showToast(`Max ${MAX_FILES} files allowed`);
      return;
    }

    const validated = [];
    for (const f of toAdd) {
      if (!ALLOWED_FILE_TYPES.includes(f.type)) {
        showToast("Unsupported file type. Allowed: PNG/JPG/WEBP/PDF.");
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        showToast("File too large. Max 5 MB per file.");
        continue;
      }
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const fileObj = { id, file: f, preview: null, progress: 0, status: "queued" };
      validated.push(fileObj);

      // create image preview if image
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setFiles((cur) => cur.map((c) => (c.id === id ? { ...c, preview: reader.result } : c)));
        };
        reader.readAsDataURL(f);
      }
    }

    if (validated.length) {
      setFiles((cur) => [...cur, ...validated]);
      showDebug("Files added", validated.map((v) => v.file.name));
    }
  }

  function handleFileInput(e) {
    addFilesFromList(e.target.files || []);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    addFilesFromList(e.dataTransfer.files || []);
  }

  function removeFile(id) {
    setFiles((cur) => cur.filter((f) => f.id !== id));
  }

  /* drag events */
  function handleDragOver(e) { e.preventDefault(); setDragActive(true); }
  function handleDragLeave(e) { e.preventDefault(); setDragActive(false); }

  /* validation */
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email looks invalid";
    if (!form.message.trim()) e.message = "Message can't be empty";
    if (form.phone.trim() && !/^\+?\d{7,15}$/.test(form.phone.trim())) e.phone = "Phone looks invalid";
    if (form.message.length > MESSAGE_LIMIT) e.message = `Message exceeds ${MESSAGE_LIMIT} characters`;
    // honeypot
    if (form.website && form.website.trim()) e.website = "Spam detected";
    if (!captchaChecked) e.captcha = "Please confirm you are human (demo checkbox)";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* simulated upload for files (progress) */
  function simulateFileUploads() {
    // start queued files, simulate progress
    setFiles((cur) => cur.map((f) => (f.status === "queued" ? { ...f, status: "uploading", progress: 4 } : f)));

    const ticker = setInterval(() => {
      setFiles((cur) => {
        const next = cur.map((f) => {
          if (f.status !== "uploading") return f;
          const inc = 6 + Math.random() * 12;
          const prog = Math.min(100, Math.round((f.progress || 0) + inc));
          return prog >= 100 ? { ...f, progress: 100, status: "done" } : { ...f, progress: prog };
        });
        return next;
      });
      // stop when all done
      setTimeout(() => {
        const allDone = files.every((f) => f.status === "done") || files.length === 0;
        if (allDone) clearInterval(ticker);
      }, 0);
    }, 220);
    // as a fallback, clear after 12s
    setTimeout(() => clearInterval(ticker), 12000);
    return ticker;
  }

  /* submit */
  async function handleSubmit(e) {
    e.preventDefault();
    if (sending) return;
    if (!validate()) {
      showToast("Please fix validation errors");
      return;
    }
    setSending(true);
    showDebug("submit_attempt", { category: form.category, hasFiles: files.length });

    // simulate upload progress if files present
    if (files.length) {
      // mark files uploading
      setFiles((cur) => cur.map((f) => (f.status === "queued" ? { ...f, status: "uploading", progress: 6 } : f)));
      // simulate
      const ticker = setInterval(() => {
        setFiles((cur) => cur.map((f) => {
          if (f.status !== "uploading") return f;
          const inc = 8 + Math.random() * 14;
          const prog = Math.min(100, Math.round((f.progress || 0) + inc));
          return prog >= 100 ? { ...f, progress: 100, status: "done" } : { ...f, progress: prog };
        }));
      }, 240);
      // automatic stop after 8s to avoid runaway
      setTimeout(() => clearInterval(ticker), 9000);
    }

    // prepare payload
    const payload = {
      ...form,
      files: files.map((f) => ({ name: f.file.name, size: f.file.size, type: f.file.type })),
      sentAt: new Date().toISOString(),
    };

    try {
      if (SEND_ENDPOINT) {
        // real upload (you should implement server side)
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        files.forEach((f, i) => formData.append(`file_${i}`, f.file));
        const res = await fetch(SEND_ENDPOINT, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Network error");
      } else {
        // fallback simulate server delay
        await new Promise((r) => setTimeout(r, 900));
        // you can also persist to localStorage for demo
        const history = JSON.parse(localStorage.getItem("contactHistory_v2") || "[]");
        history.unshift(payload);
        localStorage.setItem("contactHistory_v2", JSON.stringify(history.slice(0, 50)));
      }

      // success UX
      setSuccess(true);
      showToast("Message sent — we'll contact you soon.");
      // clear form and files, but keep draft in case of accidental navigation
      setForm({ name: "", email: "", phone: "", category: "General", budget: "", timeline: "", message: "", website: "" });
      setFiles([]);
      localStorage.removeItem(DRAFT_KEY);
      showDebug("submit_success", payload);
    } catch (err) {
      console.error(err);
      showToast("Sending failed. Please try again later.");
      showDebug("submit_fail", err.message || err);
    } finally {
      setSending(false);
    }
  }

  function handleDownloadVCard() {
    const blob = new Blob([makeVCard()], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "InteriorStudio.vcf";
    a.click();
    URL.revokeObjectURL(url);
  }

  function showToast(msg, ms = 2400) {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  }

  /* small helpers for display */
  const totalFilesSize = files.reduce((s, f) => s + (f.file?.size || 0), 0);
  const friendlyBytes = (n) => {
    if (n > 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
    if (n > 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${n} B`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Get in touch</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Tell us about your project, upload floor plans or photos, or visit Kurla Garden. We’ll help you plan, design and execute.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* FORM */}
        <form ref={mainFormRef} onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-6" noValidate>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Contact Form</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadVCard}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-gray-50"
                aria-label="Download vCard"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M7 10l5-5 5 5M5 19h14" /></svg>
                vCard
              </button>
              <div className="text-sm text-gray-500">Office hours: Mon–Sat 10am–7pm</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* name */}
            <label className="block">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Name <span className="text-rose-500">*</span></span>
                {errors.name && <span className="text-xs text-rose-600">{errors.name}</span>}
              </div>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.name ? "border-rose-500" : "border-gray-200"} focus:ring-2 focus:ring-pink-200 focus:outline-none`}
                placeholder="Full name"
                aria-required="true"
                aria-invalid={!!errors.name}
              />
            </label>

            {/* email */}
            <label className="block">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Email <span className="text-rose-500">*</span></span>
                {errors.email && <span className="text-xs text-rose-600">{errors.email}</span>}
              </div>
              <div className="relative mt-1">
                <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M3 8l8.5 6L20 8" /></svg>
                </div>
                <input
                  name="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  type="email"
                  className={`mt-1 pl-10 w-full px-3 py-2 rounded-lg border ${errors.email ? "border-rose-500" : "border-gray-200"} focus:ring-2 focus:ring-pink-200 focus:outline-none`}
                  placeholder="you@example.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
              </div>
            </label>

            {/* phone */}
            <label className="block">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Phone</span>
                {errors.phone && <span className="text-xs text-rose-600">{errors.phone}</span>}
              </div>
              <div className="relative mt-1">
                <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V20a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.63A2 2 0 014 2h3.09a2 2 0 012 1.72" /></svg>
                </div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={`mt-1 pl-10 w-full px-3 py-2 rounded-lg border ${errors.phone ? "border-rose-500" : "border-gray-200"} focus:ring-2 focus:ring-pink-200 focus:outline-none`}
                  placeholder="+91 9XXXXXXXXX"
                  aria-invalid={!!errors.phone}
                />
              </div>
            </label>

            {/* category */}
            <label className="block">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Category</span>
              </div>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              >
                <option>General</option>
                <option>Interior design</option>
                <option>Renovation</option>
                <option>Commercial</option>
                <option>Collaboration</option>
                <option>Other</option>
              </select>
            </label>

            {/* budget */}
            <label className="block">
              <div className="text-sm font-medium">Estimated budget (optional)</div>
              <input
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                placeholder="e.g. ₹50,000 - ₹2,00,000"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </label>

            {/* timeline */}
            <label className="block">
              <div className="text-sm font-medium">Timeline (optional)</div>
              <input
                value={form.timeline}
                onChange={(e) => setField("timeline", e.target.value)}
                placeholder="e.g. 2-3 months"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </label>

            {/* placeholder for alignment */}
            <div />

            {/* message (full width) */}
            <label className="block md:col-span-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Message <span className="text-rose-500">*</span></span>
                <div className="text-xs text-gray-400">{form.message.length}/{MESSAGE_LIMIT}</div>
              </div>
              <textarea
                name="message"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                rows="6"
                className={`mt-1 w-full px-3 py-3 rounded-lg border ${errors.message ? "border-rose-500" : "border-gray-200"} focus:ring-2 focus:ring-pink-200 focus:outline-none`}
                placeholder="Tell us about your space, budget and timeline..."
                aria-required="true"
                aria-invalid={!!errors.message}
              />
              {form.message.length > MESSAGE_LIMIT - 200 && <div className="mt-1 text-xs text-amber-600">You're getting near the character limit — try keeping it concise.</div>}
            </label>

            {/* honeypot field (hidden) */}
            <input
              aria-hidden="true"
              style={{ display: "none" }}
              name="website"
              value={form.website}
              onChange={(e) => setField("website", e.target.value)}
              placeholder="Leave empty"
            />
          </div>

          {/* drag & drop file area */}
          <div className="mt-4 md:mt-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-dashed rounded-lg p-4 transition ${dragActive ? "border-pink-400 bg-pink-50" : "border-gray-200 bg-white"}`}
            >
              <div className="flex items-center gap-4">
                <label htmlFor="fileInput" className="inline-flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer bg-white text-sm">
                  <IconUpload /> Upload
                </label>
                <input id="fileInput" ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf" multiple onChange={handleFileInput} />
                <div className="text-sm text-gray-600">{files.length}/{MAX_FILES} files — {friendlyBytes(totalFilesSize)}</div>
                <div className="ml-auto text-xs text-gray-400">Drag & drop files here or click Upload</div>
              </div>

              {/* list of files */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 rounded-md border p-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                        {f.preview ? <img src={f.preview} alt={f.file.name} className="object-cover w-full h-full" /> : <div className="text-xs text-gray-500 text-center px-1">{f.file.type.split("/")[1] || "file"}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium truncate">{f.file.name}</div>
                          <div className="text-xs text-gray-400">{friendlyBytes(f.file.size)}</div>
                        </div>

                        <div className="mt-2">
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div style={{ width: `${f.progress || 0}%` }} className={`h-full rounded-full transition-all ${f.status === "done" ? "bg-emerald-400" : "bg-amber-400"}`}></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        {f.status !== "done" && <button type="button" onClick={() => {
                          // mark as uploading immediately to simulate
                          setFiles(cur => cur.map(x => x.id === f.id ? { ...x, status: "uploading", progress: 6 } : x));
                        }} className="px-3 py-1 text-xs border rounded-full">Start</button>}
                        <button type="button" onClick={() => removeFile(f.id)} aria-label={`Remove ${f.file.name}`} className="p-2 rounded-full hover:bg-gray-100">
                          <IconClose />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">Max file size 5 MB. Allowed: PNG, JPG, WEBP, PDF. Max {MAX_FILES} files.</div>
          </div>

          {/* captcha demo */}
          <div className="mt-4 flex items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={captchaChecked} onChange={(e) => { setCaptchaChecked(e.target.checked); setErrors((s)=>({ ...s, captcha: null })); }} className="w-4 h-4" />
              <span className="text-sm text-gray-700">I confirm I am human (demo)</span>
            </label>
            {errors.captcha && <div className="text-xs text-rose-600">{errors.captcha}</div>}
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button type="submit" disabled={sending} className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-pink-600 to-amber-400 text-white font-medium hover:opacity-95 disabled:opacity-60 transform active:scale-95">
              {sending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

            <button type="button" onClick={() => { setForm({ name: "", email: "", phone: "", category: "General", budget: "", timeline: "", message: "", website: "" }); setFiles([]); setErrors({}); localStorage.removeItem(DRAFT_KEY); showToast("Cleared"); }} className="px-4 py-2 rounded-full border text-sm">
              Reset
            </button>

            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm hover:bg-gray-50">
              <IconMap /> Open in Google Maps
            </a>
          </div>

          <div className="mt-2 text-xs text-gray-500">We will never share your details. By sending you agree to our Terms & Privacy.</div>
        </form>

        {/* INFO + MAP */}
        <aside className="p-6 bg-gradient-to-br from-amber-50 to-pink-50 rounded-2xl shadow-lg border flex flex-col">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold">Visit the place</h3>
              <p className="text-gray-700 mt-2">Kurla Garden, Kurla, Mumbai, Maharashtra, India</p>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><IconEmail /><span>hello@.example</span></div>
                <div className="flex items-center gap-2"><IconPhone /><span>+91 8108306152</span></div>
                <div className="mt-2"><strong>Office hours:</strong> Mon–Sat 10am–7pm</div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg overflow-hidden border flex-1 min-h-[220px]">
            <div className="w-full h-0" style={{ paddingBottom: "56.25%", position: "relative" }}>
              <iframe
                title="Kurla Garden map"
                src={MAP_SRC}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2 items-center">
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-white border text-sm hover:bg-gray-50">Directions</a>
            <a href="https://wa.me/918108306152?text=Hi%20Interior%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20project" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-green-600 text-white text-sm hover:opacity-95">Message on WhatsApp</a>
          </div>
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed left-0 right-0 bottom-0 sm:hidden z-40">
        <div className="backdrop-blur-sm bg-white/90 border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a href={`tel:+918108306152`} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-pink-50 text-pink-700 border">
              <IconPhone /> Call
            </a>
            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border">
              <IconMap /> Map
            </a>
          </div>
          <a href="https://wa.me/918108306152" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-green-600 text-white">WhatsApp</a>
        </div>
      </div>

      {/* Success modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSuccess(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg">
            <button onClick={() => setSuccess(false)} className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100">
              <IconClose />
            </button>
            <h3 className="text-xl font-semibold">Message Sent</h3>
            <p className="mt-2 text-gray-600">Thank you — our team will contact you shortly. We usually reply within 24 hours.</p>
            <div className="mt-4 flex gap-3">
              <a href={MAP_LINK} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-white border">View on map</a>
              <a href="https://wa.me/918108306152" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-green-600 text-white">Message on WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && <div className="fixed right-4 bottom-24 bg-black/85 text-white px-4 py-2 rounded-md text-sm z-50">{toast}</div>}

      <style>{`
        @media (max-width: 640px) { body { padding-bottom: 120px; } }
      `}</style>
    </section>
  );
}
