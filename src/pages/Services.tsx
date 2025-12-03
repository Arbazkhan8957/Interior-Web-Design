// ServicesEnhanced.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/* paste your ALL_SERVICES array and CATEGORIES here (kept same as your original) */
const ALL_SERVICES = [
  {
    id: "design-full",
    category: "Design",
    title: "Full Interior Design",
    short: "Turnkey service — concept → documentation → execution.",
    long:
      "Complete end-to-end interior design. Includes concept, layout plans, FF&E sourcing, procurement management and on-site supervision until handover.",
    steps: [
      "Initial briefing & site measure",
      "Concept & moodboard",
      "Detailed plans & schedules",
      "Sourcing & procurement",
      "Project supervision & handover",
    ],
    image: "src/assets/images/interior-design.png",
    tag: "Turnkey",
  },
  {
    id: "space-plan",
    category: "Design",
    title: "Space Planning",
    short: "Smart layouts to maximize use and movement.",
    long:
      "We produce multiple layout options, circulation studies and furniture plans that improve flow and usability while keeping aesthetics intact.",
    steps: ["Survey", "Option sketches", "Final layout", "Furniture plan"],
    image: "src/assets/images/space-planning.png",
    tag: "Layout",
  },
  {
    id: "styling",
    category: "Visuals",
    title: "Styling & Sourcing",
    short: "Furniture, lighting & accessory selection.",
    long:
      "We curate finishes, furniture and accessories — coordinating samples, procurement, delivery and final styling to ensure a unified look.",
    steps: ["Moodboard", "Vendor shortlist", "Sample approvals", "Install styling"],
    image: "src/assets/images/styling-sourcing.png",
    tag: "Sourcing",
  },
  {
    id: "3d-visuals",
    category: "Visuals",
    title: "3D Visualization",
    short: "Photoreal renders & walkthroughs for decisions.",
    long:
      "High-quality renders and walkthroughs help you visualise lighting, materials and proportions before any work starts — avoids costly changes on-site.",
    steps: ["Concept model", "Material studies", "Final render set"],
    image: "src/assets/images/3d-visual.png",
    tag: "Renders",
  },
  {
    id: "pm",
    category: "Execution",
    title: "Project Management",
    short: "Coordination, timelines, quality checks & handover.",
    long:
      "We manage contractors, schedule milestones, carry out quality inspections and provide a Handover Pack so the build runs smoothly and on time.",
    steps: ["Program", "Procurement tracking", "Site checks", "Handover pack"],
    image: "src/assets/images/project-management.png",
    tag: "Management",
  },
  {
    id: "material",
    category: "Design",
    title: "Material Consultation",
    short: "Finishes & palette advice — tiles, wood, metal, fabrics.",
    long:
      "We prepare a cohesive finishes palette, propose material alternatives, and coordinate samples with suppliers to ensure performance & look.",
    steps: ["Palette creation", "Sample sourcing", "Client review"],
    image: "src/assets/images/matrial-conslation.png",
    tag: "Finishes",
  },
];

const CATEGORIES = ["All", "Design", "Execution", "Visuals"];

function IconByTag(tag) {
  if (tag === "Turnkey") return "🛠️";
  if (tag === "Renders") return "🖼️";
  if (tag === "Sourcing") return "🛋️";
  return "📐";
}

export default function ServicesEnhanced() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default"); // default | alpha | newest (if you had dates)
  const [tagFilter, setTagFilter] = useState(""); // filter by tag pill
  const [modal, setModal] = useState(null); // service object or null
  const [fullBleed, setFullBleed] = useState(false); // expand modal to full-width on desktop
  const [imgLoading, setImgLoading] = useState({}); // { id: boolean }
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const lastActiveRef = useRef(null);

  // derived list (memoized)
  const items = useMemo(() => {
    let list = ALL_SERVICES.slice();
    if (category !== "All") list = list.filter((s) => s.category === category);
    if (tagFilter) list = list.filter((s) => s.tag === tagFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.short.toLowerCase().includes(q) ||
          s.long.toLowerCase().includes(q)
      );
    }
    if (sort === "alpha") list.sort((a, b) => a.title.localeCompare(b.title));
    // else default order as provided
    return list;
  }, [category, search, sort, tagFilter]);

  // handle ESC to close & focus restore
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (modal) {
          setModal(null);
          setFullBleed(false);
        }
      }
      // trap tab focus when modal open
      if (modal && e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  // when open modal focus first focusable and save last active
  useEffect(() => {
    if (modal) {
      lastActiveRef.current = document.activeElement;
      setTimeout(() => {
        const focusable = modalRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.[0]?.focus();
      }, 20);
    } else {
      // restore focus
      try {
        lastActiveRef.current?.focus?.();
      } catch (e) {}
    }
  }, [modal]);

  // image load helpers
  const handleImgLoad = (id) => {
    setImgLoading((s) => ({ ...s, [id]: false }));
  };
  const handleImgStart = (id) => {
    setImgLoading((s) => ({ ...s, [id]: true }));
  };
  const handleImgError = (e) => {
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='20'%3Eimage unavailable%3C/text%3E%3C/svg%3E";
  };

  // unique tags for pill filters
  const allTags = useMemo(
    () => Array.from(new Set(ALL_SERVICES.map((s) => s.tag))).filter(Boolean),
    []
  );

  return (
    <section className="py-10 bg-transparent max-w-7xl mx-auto px-6">
      {/* heading + controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Our Services
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-xl">
            From concept to handover — we design, visualise and deliver practical
            interiors with premium finishes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-800/40 p-1 rounded-full">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                }}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  category === c
                    ? "bg-gradient-to-r from-pink-600 to-amber-400 text-white shadow"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800/60"
                }`}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm"
              placeholder="Search services..."
              aria-label="Search services"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white dark:bg-slate-900 text-sm"
              aria-label="Sort services"
            >
              <option value="default">Default</option>
              <option value="alpha">A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* tag pills */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setTagFilter("")}
          className={`px-3 py-1 rounded-full text-sm ${
            tagFilter === ""
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          }`}
        >
          All tags
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setTagFilter((prev) => (prev === t ? "" : t))}
            className={`px-3 py-1 rounded-full text-sm ${
              tagFilter === t
                ? "bg-gradient-to-r from-pink-600 to-amber-400 text-white"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
            aria-pressed={tagFilter === t}
          >
            {t}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, idx) => {
          const isLoading = imgLoading[s.id] ?? true;
          return (
            <article
              key={s.id}
              className="relative group rounded-2xl p-5 bg-white dark:bg-slate-900 border border-transparent transform transition hover:-translate-y-1 hover:shadow-xl overflow-hidden"
              aria-labelledby={`svc-${s.id}-title`}
            >
              {/* animated gradient border (subtle) */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(249,115,22,0.06), rgba(236,72,153,0.04), rgba(59,130,246,0.03))",
                  mixBlendMode: "overlay",
                }}
                aria-hidden
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-pink-50 to-amber-50 flex items-center justify-center text-2xl shrink-0">
                      {IconByTag(s.tag)}
                    </div>
                    <div>
                      <h3
                        id={`svc-${s.id}-title`}
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        {s.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {s.category} • {s.tag}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">#{idx + 1}</div>
                </div>

                <p className="mt-4 text-gray-600 dark:text-gray-300 flex-1">{s.short}</p>

                {/* card image preview (lazy) */}
                <div className="mt-3">
                  <div className="relative rounded-md overflow-hidden h-36 md:h-44 bg-slate-100 dark:bg-slate-800">
                    {/* skeleton */}
                    {isLoading && (
                      <div className="absolute inset-0 animate-pulse"></div>
                    )}

                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      onLoad={() => handleImgLoad(s.id)}
                      onError={handleImgError}
                      onLoadStart={() => handleImgStart(s.id)}
                      className={`object-cover w-full h-full transition-opacity ${
                        isLoading ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setModal(s);
                        setFullBleed(false);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm bg-pink-600 text-white hover:opacity-95 shadow"
                    >
                      View details
                    </button>

                    <button
                      onClick={() => {
                        setModal(s);
                        setFullBleed(true);
                      }}
                      title="Open expanded view (desktop)"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border"
                    >
                      Expand
                    </button>
                  </div>

                  <a
                    href="/contact"
                    className="text-sm text-pink-600 underline"
                    onClick={(e) => {
                      // keep link navigation standard; placeholder hook
                    }}
                  >
                    Book consultation
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <a
          href="/services"
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-amber-400 text-white font-semibold shadow-lg hover:opacity-95"
        >
          See full services
        </a>
      </div>

      {/* Modal */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="svc-modal-title"
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4"
        >
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setModal(null);
              setFullBleed(false);
            }}
          />
          <div
            ref={modalRef}
            className={`relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-slate-900 transition-all ${
              fullBleed ? "md:max-w-6xl md:rounded-none md:mx-4" : ""
            }`}
            style={{ maxHeight: "90vh" }}
          >
            <div className={`grid ${fullBleed ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              <div className="p-6 overflow-auto">
                <h3 id="svc-modal-title" className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {modal.title}
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-300">{modal.long}</p>

                {modal.steps && modal.steps.length > 0 && (
                  <ol className="mt-5 space-y-3">
                    {modal.steps.map((st, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="flex-none w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-medium">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{st}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                <div className="mt-6 flex gap-3">
                  <a
                    href="/contact"
                    className="px-4 py-2 rounded-md bg-pink-600 text-white font-medium"
                    onClick={() => {
                      setModal(null);
                      setFullBleed(false);
                    }}
                  >
                    Request a quote
                  </a>
                  <button
                    onClick={() => {
                      setModal(null);
                      setFullBleed(false);
                    }}
                    className="px-4 py-2 rounded-md border"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => setFullBleed((v) => !v)}
                    aria-pressed={fullBleed}
                    className="px-4 py-2 rounded-md border"
                    title="Toggle expanded view"
                  >
                    {fullBleed ? "Normal view" : "Expanded"}
                  </button>
                </div>
              </div>

              <div className="relative bg-slate-100 dark:bg-slate-800">
                <div
                  className="w-full h-64 md:h-full bg-cover bg-center"
                  role="img"
                  aria-label={modal.title}
                  style={{
                    backgroundImage: `url(${modal.image || "/service-1.jpg"})`,
                  }}
                />
                {/* when fullBleed we can show overlay text or extra gallery area later */}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
