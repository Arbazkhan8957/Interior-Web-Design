// Blog.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postsArray } from "./postsData";

/**
 * Blog.jsx — Enhanced Blog list
 * - Desktop: image left (large), content right (one row per card)
 * - Mobile: stacked (image top, content below)
 * - Accessible clickable cards (keyboard + ARIA)
 * - Staggered reveal on scroll
 * - Line-by-line reveal for excerpts
 * - Image fallback + skeleton
 */

/* configuration */
const PER_LINE_DELAY = 0.9; // seconds per line

/* Helper: split text into readable lines (keeps sentences together) */
function splitToLines(text = "") {
  // Normalize blank lines and split on sentence endings while keeping delimiters
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];
  // Break on double newlines first (paragraphs), then on sentence enders
  const paragraphs = cleaned.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const lines = [];
  paragraphs.forEach((para) => {
    // split into sentences while retaining abbreviations lightly (best-effort)
    const parts = para.split(/(?<=[.?!])\s+(?=[A-Z0-9])/g);
    parts.forEach((pt) => {
      const trimmed = pt.trim();
      if (trimmed) lines.push(trimmed);
    });
    // add a blank line separator as a visual break
    lines.push("");
  });
  // remove trailing blank if present
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/* LineReveal component: animated reveal per line */
function LineReveal({ text, delayMultiplier = PER_LINE_DELAY, className = "" }) {
  const lines = splitToLines(text);
  return (
    <div className={className} aria-hidden="false" style={{ "--per-line": `${delayMultiplier}s` }}>
      {lines.map((line, i) => {
        // blank lines render as paragraph breaks
        if (line === "") return <div key={i} className="h-2" />;
        return (
          <span
            key={i}
            className="inline-block leading-relaxed"
            style={{
              opacity: 0,
              transform: "translateY(6px)",
              animationName: "lineReveal",
              animationDuration: "420ms",
              animationFillMode: "forwards",
              animationTimingFunction: "cubic-bezier(.2,.9,.2,1)",
              animationDelay: `calc(var(--per-line, ${delayMultiplier}s) * ${i})`,
            }}
          >
            {line}
          </span>
        );
      })}
      <style>{`
        @keyframes lineReveal { to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          span[style*="animationName: lineReveal"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

/* simple SVG fallback generator */
function makeSvgDataUrl(alt = "No image", w = 1200, h = 900) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Inter, Arial, Helvetica, sans-serif' font-size='36'>${alt}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* IntersectionObserver hook to stagger reveal of items */
function useStaggeredObserver(containerRef, itemSelector = ".card-item", rootMargin = "0px 0px -12% 0px") {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll(itemSelector));
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index")) || items.indexOf(entry.target) || 0;
            entry.target.style.setProperty("--stagger-index", String(idx));
            entry.target.classList.add("card-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin, threshold: 0.14 }
    );

    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, [containerRef, itemSelector, rootMargin]);
}

/* ImageWithSkeleton: shows skeleton while loading and falls back on error */
function ImageWithSkeleton({ src, alt, className = "" }) {
  const [ready, setReady] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const fallback = makeSvgDataUrl(alt, 1200, 900);

  useEffect(() => {
    setImgSrc(src);
    setReady(false);
  }, [src]);

  return (
    <div className={`w-full h-full bg-gray-100 relative overflow-hidden ${className}`}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="w-3/4 h-3/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setReady(true)}
        onError={(e) => {
          if (e.currentTarget.src !== fallback) {
            setImgSrc(fallback);
          } else {
            setReady(true);
          }
        }}
        className="w-full h-full object-cover transition-transform duration-500 ease-out transform"
        style={{ filter: ready ? "none" : "blur(2px)", minHeight: 120 }}
      />
    </div>
  );
}

/* Main Blog component */
export default function Blog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const containerRef = useRef(null);
  useStaggeredObserver(containerRef, ".card-item");

  const categories = useMemo(() => ["All", ...Array.from(new Set((postsArray || []).map((p) => p.category || "Uncategorized")))], []);

  const filtered = useMemo(() => {
    let list = (postsArray || []).slice();
    if (category && category !== "All") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.title || "").toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q) || ((p.tags || []).join(" ").toLowerCase().includes(q)));
    }
    if (sort === "newest") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === "title") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return list;
  }, [query, category, sort]);

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      {/* header + controls */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">Design Notes & Inspiration</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">Smooth micro-interactions, responsive layout and delightful motion — built to feel premium across devices.</p>

          <div className="mt-5 flex gap-2 flex-wrap items-center">
            <input
              className="px-4 py-2 rounded-full border shadow-sm w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Search posts, tags or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search posts"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-full border">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-full border">
              <option value="newest">Newest</option>
              <option value="title">Title A → Z</option>
            </select>
          </div>
        </div>

        <aside className="hidden md:block">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 shadow-lg">
            <div className="text-sm text-pink-700 dark:text-pink-200 font-semibold">Latest</div>
            <div className="mt-3">
              {(postsArray || []).slice(0, 4).map((p) => (
                <div key={p.id} className="mt-3 text-sm">
                  <Link to={`/post/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{new Date(p.date).toLocaleDateString()} • {p.minutes}m</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* posts list */}
      <div ref={containerRef} className="grid gap-6">
        {filtered.map((p, index) => (
          <article
            key={p.id}
            data-index={index}
            className="card-item relative bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 transition-all transform focus-within:ring-2 focus-within:ring-pink-400"
            style={{ opacity: 0, transform: "translateY(10px)" }}
            aria-labelledby={`post-${p.id}-title`}
          >
            <Link to={`/post/${p.id}`} className="group block">
              <div className="flex flex-col lg:flex-row">
                {/* image area */}
                <div className="lg:w-72 w-full h-64 lg:h-auto relative flex-shrink-0 bg-gray-100 overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
                  <ImageWithSkeleton src={p.image} alt={p.title || "Post image"} />
                  <div className="absolute left-3 top-3 text-xs px-2 py-1 rounded-full bg-white/85 text-pink-600 font-semibold">{p.category}</div>
                </div>

                {/* content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 id={`post-${p.id}-title`} className="text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
                        <span className="group-hover:underline">{p.title}</span>
                      </h3>
                      <div className="text-xs text-gray-500 mt-1">{new Date(p.date).toLocaleDateString()} • {p.minutes} min read</div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="text-xs text-gray-400">#{p.id}</div>
                      <div className="mt-2 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-pink-600 text-white text-sm">Read</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-gray-700 dark:text-gray-300">
                    <LineReveal text={p.excerpt} />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex gap-2 flex-wrap mt-3">
                      {(p.tags || []).map((t) => (
                        <span key={t} className="px-2 py-1 text-xs rounded-full bg-amber-50 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500">Read • {p.minutes}m</div>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-600 dark:text-gray-300">No posts found — try a different search or category.</div>
        )}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} — Design Blog</div>

      {/* local styles for animations */}
      <style>{`
        .card-item.card-visible { animation: cardEntrance 420ms cubic-bezier(.2,.9,.2,1) forwards; animation-delay: calc(var(--stagger-index, 0) * 80ms); }
        @keyframes cardEntrance { from { opacity: 0; transform: translateY(10px) scale(.998); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .card-item .group:hover img { transform: scale(1.06); }
        .card-item .group:focus img { transform: scale(1.02); }
        @media (prefers-reduced-motion: reduce) { .card-item.card-visible, span[style*="animationName: lineReveal"] { animation: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
    </section>
  );
}
