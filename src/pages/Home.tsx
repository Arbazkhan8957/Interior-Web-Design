// Home.jsx — hero image increased + thumbnail strip added
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

/* Data & helpers (kept as in your file) */
const FALLBACK_IMAGE =
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'>
       <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='#fde68a'/><stop offset='50%' stop-color='#fbcfe8'/><stop offset='100%' stop-color='#f0f9ff'/></linearGradient></defs>
       <rect width='100%' height='100%' fill='url(#g)'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='34' fill='#6b7280' font-family='Arial, Helvetica, sans-serif'>Image unavailable</text>
     </svg>`
  )}`;

const GALLERY = [
  { id: 1, src: "src/assets/images/living-room.png", title: "Modern Living Room", year: 2024 },
  { id: 2, src: "src/assets/images/cafe.png", title: "Boutique Cafe", year: 2023 },
  { id: 3, src: "src/assets/images/bedroom.png", title: "Cozy Bedroom", year: 2025 },
  { id: 4, src: "src/assets/images/office.png", title: "Corporate Office", year: 2024 },
  { id: 5, src: "src/assets/images/kitchen.png", title: "Minimal Kitchen", year: 2022 },
  { id: 6, src: "src/assets/images/renovation.png", title: "Studio Renovation", year: 2025 },
  { id: 7, src: "src/assets/images/balcony.png", title: "Serene Balcony", year: 2021 },
  { id: 8, src: "src/assets/images/dinner.png", title: "Scandinavian Diner", year: 2020 },
  { id: 9, src: "src/assets/images/nook.png", title: "Reading Nook", year: 2023 },
  { id: 10, src: "src/assets/images/staircase.png", title: "Statement Staircase", year: 2022 },
  { id: 11, src: "src/assets/images/dining.png", title: "Family Dining", year: 2024 },
  { id: 12, src: "src/assets/images/studio.png", title: "Compact Studio", year: 2021 },
  { id: 13, src: "src/assets/images/bathroom.png", title: "Minimal Bathroom", year: 2024 },
  { id: 14, src: "src/assets/images/corner.png", title: "Workspace Corner", year: 2025 },
  { id: 15, src: "src/assets/images/suite.png", title: "Guest Suite", year: 2023 },
];

const SERVICES = [
  { id: "design", title: "Full Interior Design", desc: "Concept → Plans → FF&E → Execution", features: ["Concept boards", "Detailed plans", "Procurement"] },
  { id: "visual", title: "3D Visualization", desc: "Photoreal renders & walkthroughs", features: ["Renderings", "Material studies", "Lighting mockups"] },
  { id: "styling", title: "Styling & Sourcing", desc: "Curated furniture and accessories", features: ["Vendor sourcing", "Custom furniture", "Install styling"] },
  { id: "pm", title: "Project Management", desc: "Coordination until handover", features: ["Scheduling", "Quality checks", "Handover pack"] },
];

const TESTIMONIALS = [
  { id: 1, name: "R. Mehta", role: "Homeowner", text: "We loved the attention to detail and practical storage solutions." },
  { id: 2, name: "K. Singh", role: "Cafe Owner", text: "The concept matched our brand perfectly — customers notice the difference." },
];

const TEAM = [
  { id: 1, name: "Kaif", role: "Principal Designer" },
  { id: 2, name: "Zeeshan", role: "Project Lead" },
  { id: 3, name: "Aasif", role: "3D Visualiser" },
];

function useInterval(callback, ms, active = true) {
  const cbRef = useRef(callback);
  useEffect(() => { cbRef.current = callback; }, [callback]);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => cbRef.current(), ms);
    return () => clearInterval(t);
  }, [ms, active]);
}

/* ImageSlider — unchanged (used below) */
function ImageSlider({ items = [], height = 300 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;
  useInterval(() => setIndex(i => (i + 1) % count), 4200, !paused && count > 1);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") setIndex(i => (i + 1) % count);
      if (e.key === "ArrowLeft") setIndex(i => (i - 1 + count) % count);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/6">
      <div
        className="relative w-full select-none"
        style={{ height }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {items.map((it, i) => {
          const active = i === index;
          return (
            <figure
              key={it.id}
              aria-hidden={!active}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${active ? "opacity-100 translate-y-0 z-10" : "opacity-0 -translate-y-6 z-0 pointer-events-none"}`}
            >
              <img
                loading="lazy"
                src={it.src}
                alt={it.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              {active && (
                <figcaption className="absolute left-6 bottom-6 text-white max-w-lg">
                  <h3 className="text-xl font-extrabold drop-shadow">{it.title}</h3>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <button onClick={() => setIndex((index + 1) % count)} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:scale-105 transition" aria-label="Next">›</button>
        <button onClick={() => setIndex((index - 1 + count) % count)} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:scale-105 transition" aria-label="Prev">‹</button>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex gap-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/60"}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* FloatingActions (unchanged) */
function FloatingActions({ phone = "+911234567890", whatsapp = "+911234567890" }) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4">
      <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="group" aria-label="WhatsApp">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 shadow-2xl flex items-center justify-center text-white text-lg">WA</div>
      </a>
      <a href={`tel:${phone.replace(/\D/g, "")}`} className="group" aria-label="Call">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 to-rose-500 shadow-2xl flex items-center justify-center text-white text-lg">Call</div>
      </a>
    </div>
  );
}

/* Main Home component: hero updated */
export default function Home() {
  const [filter, setFilter] = useState("all");
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });
  const [leadMsg, setLeadMsg] = useState("");
  const [expanded, setExpanded] = useState({});
  const [loaded, setLoaded] = useState({});
  const [lightboxItem, setLightboxItem] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0); // which image is main hero
  const [query, setQuery] = useState("");

  const filtered = GALLERY.filter(g => {
    if (filter === "all" && !query) return true;
    const byFilter = filter === "all" ? true : (filter === "residential" ? g.id % 2 === 1 : g.id % 2 === 0);
    const byQuery = query ? (g.title.toLowerCase().includes(query.toLowerCase()) || String(g.year).includes(query)) : true;
    return byFilter && byQuery;
  });

  function handleLead(e) {
    e.preventDefault();
    if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || !lead.message) {
      setLeadMsg("Please enter your name, a valid email and a short message.");
      return;
    }
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    leads.unshift({ ...lead, date: new Date().toISOString() });
    localStorage.setItem("leads", JSON.stringify(leads));
    setLeadMsg("Thanks — we received your request and will contact you soon.");
    setLead({ name: "", email: "", phone: "", message: "" });
  }

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    els.forEach((el, i) => setTimeout(() => el.classList.add("visible"), 80 * i));
  }, []);

  useEffect(() => {
    function onScroll() {
      const els = document.querySelectorAll("[data-parallax]");
      els.forEach((el) => {
        const speed = Number(el.getAttribute("data-parallax-speed") || 0.12);
        const rect = el.getBoundingClientRect();
        const offset = rect.top * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroItems = GALLERY.slice(0, 6); // more hero-related images for thumbnail strip

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 text-slate-900 pb-24">
      <style>{`
        .site-container{ max-width:1700px; margin-left:auto; margin-right:auto; }
        .reveal{ transform: translateY(12px); opacity:0; transition: all 560ms cubic-bezier(.2,.9,.3,1); }
        .reveal.visible{ transform: translateY(0); opacity:1; }
        .img-skeleton{ background: linear-gradient(90deg,#f3f4f6 0%, #e9ecef 50%, #f3f4f6 100%); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; }
        @keyframes shimmer{ 0%{background-position:200% 0}100%{background-position:-200% 0} }
        .cinematic { animation: cinematic-in 700ms cubic-bezier(.2,.9,.3,1) both; }
        @keyframes cinematic-in { from { opacity: 0; transform: translateY(18px) scale(.995); } to { opacity:1; transform: translateY(0) scale(1);} }
        @media (min-width: 1280px) { .hero-image { height: 640px; } } /* bigger on large screens */
        @media (min-width: 1024px) and (max-width:1279px) { .hero-image { height: 520px; } }
        @media (max-width: 1023px) { .hero-image { height: 360px; } }
        .focus-ring:focus { outline: 3px solid rgba(99,102,241,0.16); outline-offset: 3px; }
        .content-wrap { padding-top: 12px; } /* tight top like screenshot */
        .thumb { cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
        .thumb:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(15,23,42,0.12); }
        .thumb-active { box-shadow: 0 12px 30px rgba(15,23,42,0.15); transform: translateY(-6px); }
      `}</style>

      <div className="content-wrap">
        <div className="mx-auto px-6 md:px-10 lg:px-16 site-container">
          {/* HERO — text left (6 cols) and BIG image right (6 cols) + thumbnail row */}
          <header className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 py-6 reveal">
            <div className="lg:col-span-6">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-yellow-100 text-sm font-semibold text-pink-700 mb-4">Award-winning studio</div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Interiors that marry <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-yellow-400">beauty</span> with <span className="text-pink-600">function</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
                We craft calm, functional spaces with layered materials, considered lighting, and storage-first thinking. From concept to handover — premium finishes and realistic budgets.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/portfolio" className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition">View Portfolio</Link>
                <Link to="/contact" className="px-5 py-3 rounded-full border border-gray-200 bg-white hover:bg-pink-50 transition">Request Quote</Link>
                <Link to="/services" className="px-5 py-3 rounded-full border hidden sm:inline-flex items-center">Our Services</Link>
              </div>
            </div>

            {/* BIG hero visual */}
            <div className="lg:col-span-6">
              <div
                className="relative rounded-3xl overflow-hidden hero-image border-2 border-transparent"
                style={{ boxShadow: "0 18px 50px rgba(15,23,42,0.12)" }}
                onClick={() => setLightboxItem(heroItems[heroIndex] || GALLERY[0])}
              >
                {/* large image */}
                <img
                  src={(heroItems[heroIndex] && heroItems[heroIndex].src) || FALLBACK_IMAGE}
                  alt={(heroItems[heroIndex] && heroItems[heroIndex].title) || "Hero project"}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute left-6 bottom-6 text-white max-w-xs">
                  <div className="text-sm uppercase tracking-wider text-white/80">Featured • { (heroItems[heroIndex] && heroItems[heroIndex].year) || "" }</div>
                  <h3 className="text-2xl font-extrabold drop-shadow">{(heroItems[heroIndex] && heroItems[heroIndex].title) || "Project"}</h3>
                </div>
              </div>

              {/* thumbnail strip (added more visuals) */}
              <div className="mt-4 grid grid-cols-5 gap-3">
                {heroItems.map((it, i) => (
                  <div
                    key={it.id}
                    onClick={() => setHeroIndex(i)}
                    className={`thumb rounded-xl overflow-hidden ${i === heroIndex ? "thumb-active ring-2 ring-pink-300" : ""}`}
                    role="button"
                    aria-label={`Show ${it.title}`}
                  >
                    <img
                      src={it.src}
                      alt={it.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* PROCESS */}
          <section className="reveal mt-6">
            <h2 className="text-2xl font-bold mb-6">Our Process</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm tilt-hover">
                <div className="text-2xl font-semibold">1. Discovery</div>
                <p className="mt-2 text-gray-600">We listen, measure and set a realistic brief and budget.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm tilt-hover">
                <div className="text-2xl font-semibold">2. Design</div>
                <p className="mt-2 text-gray-600">Concept boards, layout plans, and photoreal visuals to decide direction.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm tilt-hover">
                <div className="text-2xl font-semibold">3. Deliver</div>
                <p className="mt-2 text-gray-600">Procurement, site supervision and final styling for a flawless handover.</p>
              </div>
            </div>
          </section>

          {/* SERVICES, GALLERY, FEATURED, TESTIMONIALS, TEAM, FAQ, CONTACT (unchanged) */}
          <section className="reveal mt-10">
            <h2 className="text-2xl font-bold mb-6">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {SERVICES.map((s) => (
                  <div key={s.id} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm tilt-hover">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-pink-50 to-yellow-50 flex items-center justify-center text-2xl">🛋️</div>
                    <div>
                      <div className="font-semibold text-lg">{s.title}</div>
                      <p className="text-gray-600 mt-1">{s.desc}</p>
                      <div className="mt-2 text-sm text-gray-500">{s.features.map((f, idx) => (<span key={idx} className="inline-block mr-3">• {f}</span>))}</div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="bg-gradient-to-br from-white/60 to-white/40 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg">Moodboard & Materials</h3>
                <p className="text-gray-600 mt-2">Color palette, finishes and material suggestions to convey the final look & feel.</p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {["#FDE68A", "#FECACA", "#FBCFE8", "#F0F9FF"].map((c, i) => (<div key={i} className="rounded-lg overflow-hidden"><div style={{ background: c }} className="h-16 w-full" /><div className="text-xs text-center py-1">{c}</div></div>))}
                </div>
                <div className="mt-4"><h4 className="font-medium">Materials</h4><div className="flex flex-wrap gap-2 mt-3">{["Oak wood","Terrazzo","Matte tile","Brushed brass","Linen"].map((m, idx)=>(<span key={idx} className="text-sm px-3 py-1 bg-white/60 rounded-full">{m}</span>))}</div></div>
                <div className="mt-4"><Link to="/services" className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white shadow-lg">View full moodboard</Link></div>
              </aside>
            </div>
          </section>

          {/* GALLERY */}
          <section className="reveal mt-10">
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            <div className="space-y-10">
              {filtered.map((g) => (
                <article key={g.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg tilt-hover">
                  <div className="flex flex-col justify-center pr-1">
                    <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Case Study • {g.year}</div>
                    <h3 className="text-2xl font-semibold mb-2">{g.title}</h3>
                    <p className="text-gray-600 mb-4">
                      A thoughtful {g.title} project focusing on daylight, warm materials and a clutter-free layout. The palette combines natural timber, soft leathers and tactile textiles for comfortable everyday living.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpanded(prev => ({ ...prev, [g.id]: !prev[g.id] }))}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-pink-600 font-medium shadow hover:scale-105 transition"
                      >
                        {expanded[g.id] ? "Hide details" : "Read more"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <Link to={`/post/${g.id}`} className="text-sm text-gray-500 hover:underline">Full case study →</Link>
                    </div>
                    <div className={`mt-4 text-gray-600 transition-all duration-500 ${expanded[g.id] ? "max-h-80" : "max-h-0 overflow-hidden"}`}>
                      <ul className="list-disc ml-5">
                        <li>Key decisions: maximize daylight, integrated storage, zoned lighting.</li>
                        <li>Materials: walnut veneer, honed terrazzo, brushed brass accents.</li>
                        <li>Outcome: improved flow, cleaner sightlines, comfortably flexible seating.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden shadow-inner cursor-zoom-in" onClick={() => setLightboxItem(g)} data-parallax data-parallax-speed="0.08">
                    {!loaded[g.id] && <div className="w-full h-64 md:h-80 img-skeleton rounded-xl" />}
                    <img
                      src={g.src}
                      alt={g.title}
                      loading="lazy"
                      onLoad={() => setLoaded(prev => ({ ...prev, [g.id]: true }))}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                        setLoaded(prev => ({ ...prev, [g.id]: true }));
                      }}
                      className={`w-full h-64 md:h-80 object-cover rounded-xl transition-all duration-700 ${loaded[g.id] ? "opacity-100 scale-100" : "opacity-0 scale-103"}`}
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 text-white text-xs backdrop-blur-sm">Featured</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* rest of the page: featured slider, testimonials, team, FAQ, contact CTA (kept same) */}
          <section className="reveal mt-10">
            <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
            <ImageSlider items={GALLERY.slice(4, 7)} height={220} />
          </section>

          <section className="reveal mt-10">
            <h2 className="text-2xl font-bold mb-4">Client feedback</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {TESTIMONIALS.map(t => (
                <blockquote key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-gray-700">“{t.text}”</p>
                  <footer className="mt-3 text-sm text-gray-500">— {t.name}, <span className="text-xs">{t.role}</span></footer>
                </blockquote>
              ))}
            </div>
          </section>

          <section className="reveal mt-10">
            <h2 className="text-2xl font-bold mb-4">Meet the team</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {TEAM.map(m => (
                <div key={m.id} className="flex gap-4 items-center bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center text-xl font-semibold">
                    {m.name.split(" ").map(x=>x[0]).slice(0,2).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-sm text-gray-500">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="reveal mt-10">
            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <div className="space-y-3">
              {[
                { q: "What is your design process?", a: "Discovery → Concept → Documentation → Procurement → Installation" },
                { q: "Do you provide budgeting?", a: "Yes — we prepare a costed sourcing plan for approval." },
                { q: "Can you work remotely?", a: "Yes — concept work & visualization can be remote; site visits scheduled as required." },
              ].map((f,i) => (
                <details key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <summary className="font-semibold">{f.q}</summary>
                  <p className="mt-2 text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="reveal rounded-3xl overflow-hidden mt-12">
            <div className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white p-8 md:flex md:items-center md:justify-between gap-6 rounded-3xl shadow-2xl">
              <div className="md:flex-1">
                <h3 className="text-2xl font-bold">Ready to start your project?</h3>
                <p className="mt-2 max-w-xl">Book a free discovery call to discuss goals, budget and timeline.</p>
              </div>

              <form onSubmit={handleLead} className="mt-4 md:mt-0 md:flex md:items-center gap-3 md:flex-1">
                <input aria-label="Name" className="px-4 py-3 rounded-md text-gray-800 w-full" placeholder="Your name" value={lead.name} onChange={(e)=>setLead({...lead,name:e.target.value})} required />
                <input aria-label="Email" className="px-4 py-3 rounded-md text-gray-800 w-full" placeholder="Email address" value={lead.email} onChange={(e)=>setLead({...lead,email:e.target.value})} required />
                <button className="px-5 py-3 rounded-md bg-white text-pink-600 font-semibold shadow-lg hover:scale-105 transition">Send</button>
              </form>
            </div>
            {leadMsg && <div className="p-3 text-center text-sm text-gray-800 bg-white border-t">{leadMsg}</div>}
          </section>
        </div>
      </div>

      <FloatingActions phone="+911234567890" whatsapp="+911234567890" />
    </div>
  );
}
