// src/pages/FAQ.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * FAQ.jsx — Responsive, polished FAQ page (single-file)
 * - No external libraries
 * - Accessible (ARIA + keyboard)
 * - Sticky sidebar on wide screens, stacked on small screens
 * - Smooth height + opacity animations for answers
 * - Search, category filter, expand/collapse all, allow-multiple-open toggle
 * - Persists UI state to localStorage (open items + filters)
 *
 * Drop into src/pages/FAQ.jsx and route to /faq
 */

/* -------------------------
   Sample FAQ data (extendable)
   ------------------------- */
const ALL_FAQS = [
  { id: "f1", q: "How long does a typical project take?", a: "Depends on scope — small rooms: 2–4 weeks; full homes: several months. We provide a project timeline with milestones in proposals.", category: "Timeline" },
  { id: "f2", q: "Do you provide 3D renderings?", a: "Yes — photorealistic 3D mockups and walkthroughs are available in our premium design packages.", category: "Design" },
  { id: "f3", q: "Can you source furniture?", a: "We can fully source furniture, handle procurement, or provide curated shopping lists tailored to your budget and style.", category: "Services" },
  { id: "f4", q: "Do you handle on-site supervision?", a: "Yes — our execution package includes on-site supervision and coordination with contractors to ensure design fidelity.", category: "Execution" },
  { id: "f5", q: "Is there a consultation fee?", a: "The first consultation is complimentary. Detailed planning sessions and site surveys may have a nominal fee.", category: "Pricing" },
  { id: "f6", q: "What payment methods do you accept?", a: "We accept bank transfers, major cards, and popular payment gateways. Payment milestones are included in our proposals.", category: "Payments" },
  { id: "f7", q: "Can you work with a strict budget?", a: "Absolutely. We specialize in phased designs and cost-priority planning so you get the most value out of your budget.", category: "Services" },
  { id: "f8", q: "Do you offer warranty on workmanship?", a: "Yes — workmanship warranties are offered on execution packages (terms apply). We’ll provide details in the contract.", category: "Execution" },
  { id: "f9", q: "How do revisions work?", a: "Revisions are included depending on the package. We’ll outline the number of review rounds in the proposal to avoid surprises.", category: "Process" },
  { id: "f10", q: "Can I request custom furniture design?", a: "Yes — we collaborate with artisans and manufacturers for custom furniture. Lead times vary by complexity.", category: "Design" },
];

/* -------------------------
   localStorage keys & helpers
   ------------------------- */
const LS = { OPEN: "faq_open_v3", FILTER: "faq_filter_v3", MULTI: "faq_multi_v3", QUERY: "faq_query_v3" };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const load = (k, fallback) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };

/* -------------------------
   Small Icons (inline SVG)
   ------------------------- */
function IconSearch() {
  return (
    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
    </svg>
  );
}
function IconClear() {
  return (
    <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IconChevron({ open }) {
  return (
    <svg className={`w-5 h-5 transform transition-transform duration-300 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* -------------------------
   Highlight helper
   ------------------------- */
function escapeRegExp(s = "") { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function highlightParts(text = "", q = "") {
  if (!q) return [{ text, mark: false }];
  const parts = [];
  const pattern = new RegExp(`(${escapeRegExp(q)})`, "ig");
  let lastIndex = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const start = m.index;
    if (start > lastIndex) parts.push({ text: text.slice(lastIndex, start), mark: false });
    parts.push({ text: m[0], mark: true });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), mark: false });
  return parts;
}

/* -------------------------
   Main Component
   ------------------------- */
export default function FAQ() {
  // UI state (persisted)
  const [query, setQuery] = useState(() => load(LS.QUERY, ""));
  const [category, setCategory] = useState(() => load(LS.FILTER, "All"));
  const [multiOpen, setMultiOpen] = useState(() => load(LS.MULTI, true));
  const [openSet, setOpenSet] = useState(() => new Set(load(LS.OPEN, [])));
  const [toast, setToast] = useState(null);

  // persist small bits
  useEffect(() => save(LS.QUERY, query), [query]);
  useEffect(() => save(LS.FILTER, category), [category]);
  useEffect(() => save(LS.MULTI, multiOpen), [multiOpen]);
  useEffect(() => save(LS.OPEN, Array.from(openSet)), [openSet]);

  // derived categories and counts
  const categories = useMemo(() => {
    const counts = ALL_FAQS.reduce((acc, f) => { acc[f.category] = (acc[f.category] || 0) + 1; return acc; }, {});
    return [{ name: "All", count: ALL_FAQS.length }, ...Object.keys(counts).map(k => ({ name: k, count: counts[k] }))];
  }, []);

  // filtered list
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return ALL_FAQS.filter(f => {
      if (category !== "All" && f.category !== category) return false;
      if (!q) return true;
      return (f.q + " " + f.a + " " + f.category).toLowerCase().includes(q);
    });
  }, [query, category]);

  // open/close helpers
  function toggle(id) {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (!multiOpen) next.clear();
        next.add(id);
      }
      return next;
    });
  }
  function expandAll() { setOpenSet(new Set(filtered.map(f => f.id))); showToast("All expanded"); }
  function collapseAll() { setOpenSet(new Set()); showToast("Collapsed all"); }
  function clearSearch() { setQuery(""); }

  // keyboard toggle
  function handleKey(e, id) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(id); }
  }

  function showToast(msg, ms = 1200) { setToast(msg); setTimeout(() => setToast(null), ms); }

  // ensure visible area: scroll to top when category/query changes
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [category]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black/80 dark:to-gray-900/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Frequently Asked Questions</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">Quick answers to common questions. Use search or categories to find what you need.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-2xl bg-white/95 dark:bg-gray-900/75 border border-gray-100 dark:border-gray-800 p-4 shadow">
                <h2 className="text-lg font-semibold">Search & filters</h2>
                <p className="text-sm text-gray-500 mt-1">Filter FAQs or search by keyword.</p>

                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400"><IconSearch /></div>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search questions, keywords..."
                      className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-200"
                      aria-label="Search FAQs"
                    />
                    {query && (
                      <button onClick={clearSearch} aria-label="Clear search" className="absolute right-2 top-2 text-gray-500 p-1">
                        <IconClear />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border px-3 py-2">
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}{c.name !== "All" ? ` (${c.count})` : ""}</option>)}
                  </select>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={expandAll} className="flex-1 px-3 py-2 rounded-md bg-pink-600 text-white text-sm">Expand all</button>
                  <button onClick={collapseAll} className="px-3 py-2 rounded-md border text-sm">Collapse</button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <input id="multiOpen" type="checkbox" checked={multiOpen} onChange={(e) => setMultiOpen(e.target.checked)} className="w-4 h-4" />
                  <label htmlFor="multiOpen" className="select-none">Allow multiple open</label>
                </div>

                <div className="mt-3 text-xs text-gray-500">Results: <strong>{filtered.length}</strong></div>
              </div>

              <div className="rounded-2xl bg-white/95 dark:bg-gray-900/75 border border-gray-100 dark:border-gray-800 p-4 shadow">
                <h3 className="text-sm font-semibold">Still need help?</h3>
                <p className="text-sm text-gray-500 mt-2">If you can't find an answer, contact our support for quick assistance.</p>
                <a href="#contact" className="mt-3 inline-block w-full text-center px-3 py-2 rounded-md bg-white text-pink-600 border border-pink-600 hover:bg-pink-50">Contact us</a>
              </div>
            </div>
          </aside>

          {/* FAQ list */}
          <main className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(f => {
                const open = openSet.has(f.id);
                const qparts = highlightParts(f.q, query);
                const aparts = highlightParts(f.a, query);

                return (
                  <article key={f.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow p-4 transition hover:shadow-md">
                    <header>
                      <button
                        onClick={() => toggle(f.id)}
                        onKeyDown={(e) => handleKey(e, f.id)}
                        aria-expanded={open}
                        aria-controls={`ans-${f.id}`}
                        className="w-full flex items-start justify-between gap-4 text-left focus:outline-none"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {qparts.map((p, i) => p.mark ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/30 px-1 rounded">{p.text}</mark> : <span key={i}>{p.text}</span>)}
                            </h3>
                            <span className="ml-auto inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600">{f.category}</span>
                          </div>

                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {aparts.slice(0, 6).map((p, i) => p.mark ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/30 px-0.5">{p.text}</mark> : <span key={i}>{p.text}</span>)}
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-2 pt-1"><IconChevron open={open} /></div>
                      </button>
                    </header>

                    <div
                      id={`ans-${f.id}`}
                      role="region"
                      aria-labelledby={`q-${f.id}`}
                      className={`mt-3 overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-[600px] opacity-100 py-3" : "max-h-0 opacity-0 py-0"}`}
                    >
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {aparts.map((p, i) => p.mark ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/30 px-1 rounded">{p.text}</mark> : <span key={i}>{p.text}</span>)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="mt-6 p-6 text-center bg-white dark:bg-gray-900 rounded-2xl border shadow">
                <h4 className="font-semibold">No results</h4>
                <p className="text-sm text-gray-500 mt-2">Try a different search or category.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* toast */}
      {toast && <div className="fixed right-4 bottom-6 bg-black/85 text-white px-4 py-2 rounded-md text-sm z-50">{toast}</div>}

      {/* Inline CSS tweaks for animation (keeps layout consistent across browsers) */}
      <style>{`
        /* ensure the transition on max-height + opacity is smooth */
        .duration-300 { transition-duration: 300ms; }
        @media (max-width: 640px) {
          /* make sure mobile has no clipping and spacing at bottom for the sticky bar */
          body { padding-bottom: 80px; }
        }
      `}</style>
    </main>
  );
}
