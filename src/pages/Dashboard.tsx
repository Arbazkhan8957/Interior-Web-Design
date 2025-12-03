// Dashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Dashboard.jsx — Refined responsive & aligned version
 * - Fully responsive grid and card alignment
 * - Consistent spacing, sizes and accessible controls
 * - Keeps interactive features: mock API, chart, timeline, edit modal, drawer
 * - Designed mobile-first; scales up to tablet/desktop cleanly
 *
 * Works best with Tailwind utility classes, but will render without Tailwind.
 */

/* -------------------------
   Small helpers & mock fetch
   ------------------------- */
function fakeFetch(delay = 700, payload = null) {
  return new Promise((res) => setTimeout(() => res(payload), delay));
}
function initials(name = "") {
  if (!name) return "U";
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
function useCountUp(target = 0, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = null;
    const start = performance.now();
    const from = 0;
    const diff = Math.max(0, target - from);
    function step(ts) {
      const t = Math.min(1, (ts - start) / duration);
      setValue(Math.round(from + diff * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* -------------------------
   InteractiveChart (responsive)
   ------------------------- */
function InteractiveChart({ data = [], height = 84 }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);
  const padding = { l: 10, r: 10, t: 8, b: 14 };
  const viewW = 420;
  const viewH = height;

  if (!data || data.length < 2) return null;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = Math.max(1, max - min);

  const points = data.map((d, i) => {
    const x = padding.l + (i / (data.length - 1)) * (viewW - padding.l - padding.r);
    const y = padding.t + ((max - d.value) / range) * (viewH - padding.t - padding.b);
    return { x, y, value: d.value, label: d.label };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  function findNearest(clientX) {
    const rect = svgRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    let best = Infinity;
    let nearest = null;
    for (let i = 0; i < points.length; i++) {
      const px = (points[i].x / viewW) * rect.width;
      const dx = Math.abs(px - relX);
      if (dx < best) {
        best = dx;
        nearest = { ...points[i], clientX: rect.left + px };
      }
    }
    return nearest;
  }

  return (
    <div className="relative w-full max-w-[900px]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="none"
        className="w-full h-20 touch-none"
        onMouseMove={(e) => setHover(findNearest(e.clientX))}
        onMouseLeave={() => setHover(null)}
        onTouchMove={(e) => setHover(findNearest(e.touches[0].clientX))}
        onTouchEnd={() => setHover(null)}
        role="img"
        aria-label="Activity chart"
      >
        <g stroke="#f3f4f6" strokeWidth="0.8">
          <line x1={padding.l} x2={viewW - padding.r} y1={padding.t} y2={padding.t} />
          <line x1={padding.l} x2={viewW - padding.r} y1={(viewH - padding.b + padding.t) / 2} y2={(viewH - padding.b + padding.t) / 2} />
          <line x1={padding.l} x2={viewW - padding.r} y1={viewH - padding.b} y2={viewH - padding.b} />
        </g>

        <defs>
          <linearGradient id="gA" x1="0" x2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        <path d={`${pathD} L ${viewW - padding.r} ${viewH - padding.b} L ${padding.l} ${viewH - padding.b} Z`} fill="url(#gA)" opacity="0.12" />
        <path d={pathD} fill="none" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={hover?.label === p.label ? "#ec4899" : "#fb923c"} />
        ))}
      </svg>

      {hover && (
        <div
          className="absolute -translate-y-1/2 -translate-x-1/2 bg-white border rounded px-2 py-1 text-xs shadow"
          style={{
            left: Math.min(Math.max(12, hover.clientX - (svgRef.current?.getBoundingClientRect().left || 0)), (svgRef.current?.clientWidth || 300) - 100),
            top: 6,
            transform: "translate(-50%, -120%)",
            whiteSpace: "nowrap",
          }}
        >
          <div className="font-medium">{hover.label}</div>
          <div className="text-gray-500 text-[11px]">{hover.value} actions</div>
        </div>
      )}
    </div>
  );
}

/* -------------------------
   HorizontalTimeline (drag + snap)
   ------------------------- */
function HorizontalTimeline({ items = [], onOpen }) {
  const sc = useRef(null);
  useEffect(() => {
    const el = sc.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const down = (e) => {
      isDown = true;
      startX = e.pageX ?? e.touches?.[0]?.pageX;
      startScroll = el.scrollLeft;
      el.classList.add("dragging");
    };
    const move = (e) => {
      if (!isDown) return;
      const x = e.pageX ?? e.touches?.[0]?.pageX;
      const walk = (x - startX) * 1;
      el.scrollLeft = startScroll - walk;
    };
    const up = () => {
      isDown = false;
      el.classList.remove("dragging");
    };

    el.addEventListener("mousedown", down);
    el.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);

    return () => {
      el.removeEventListener("mousedown", down);
      el.removeEventListener("touchstart", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <div className="overflow-x-auto hide-scrollbar" ref={sc} style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="flex gap-3 py-2 snap-x snap-mandatory">
        {items.map((it) => (
          <div key={it.id} className="snap-start flex-none w-64 bg-white rounded-2xl p-3 shadow border" role="article">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white text-sm">
                {it.icon || "•"}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{it.title}</div>
                <div className="text-xs text-gray-500 mt-1">{it.when}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onOpen(it)} className="px-2 py-1 rounded-full border text-xs">Open</button>
                  <button onClick={() => navigator.clipboard?.writeText(it.title)} className="px-2 py-1 rounded-full border text-xs">Copy</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { height: 8px; }
        .hide-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 999px; }
        .dragging { cursor: grabbing !important; user-select: none; }
      `}</style>
    </div>
  );
}

/* -------------------------
   Main Dashboard component
   ------------------------- */
export default function Dashboard() {
  // local auth user
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });

  // app state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [mounted, setMounted] = useState(false);

  // modal / drawer
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    setMounted(true);
    (async function load() {
      setLoading(true);
      const dStats = await fakeFetch(700, { posts: 5, followers: 412, projects: 8, messages: 3, courseProgress: 64 });
      const dPosts = await fakeFetch(700, [
        { id: 1, title: "Top 10 Living Room Trends in 2025", date: "2025-06-14", minutes: 4 },
        { id: 2, title: "Small Bedroom Styling Tips", date: "2025-04-02", minutes: 3 },
        { id: 3, title: "Choosing the Right Lighting", date: "2025-01-30", minutes: 5 },
      ]);
      const dActivity = await fakeFetch(700, [
        { id: 1, title: "Published: Living Room Trends", when: "2 days ago", type: "post", details: "Gained 24 likes" },
        { id: 2, title: "Joined study group: Algorithms", when: "3 days ago", type: "group", details: "2 new members" },
        { id: 3, title: "Completed quiz: Data Structures", when: "5 days ago", type: "quiz", details: "Score 92%" },
      ]);
      setStats(dStats);
      setPosts(dPosts);
      setActivity(dActivity);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    setForm({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  // counts
  const postsCount = useCountUp(stats?.posts || 0);
  const followersCount = useCountUp(stats?.followers || 0);
  const projectsCount = useCountUp(stats?.projects || 0);
  const messagesCount = useCountUp(stats?.messages || 0);

  // chart data (7 days)
  const chartData = useMemo(() => {
    if (loading) return Array.from({ length: 7 }).map((_, i) => ({ label: `Day ${i + 1}`, value: 0 }));
    // mock a sequence
    const base = [1, 2, 1, 3, 2, 4, 5];
    return base.map((v, i) => ({ label: `Day ${i + 1}`, value: v + (i % 2) }));
  }, [loading]);

  // timeline items
  const timelineItems = useMemo(() => {
    return (activity || []).map((a) => ({ id: a.id, title: a.title, when: a.when, icon: a.type === "post" ? "✍️" : a.type === "quiz" ? "✅" : "👥", details: a.details }));
  }, [activity]);

  // interactions
  function openEdit() {
    setEditOpen(true);
  }
  function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const updated = { ...(user || {}), name: form.name, email: form.email };
      localStorage.setItem("authUser", JSON.stringify(updated));
      setUser(updated);
      setSaving(false);
      setEditOpen(false);
    }, 700);
  }
  function logout() {
    localStorage.removeItem("authUser");
    setUser(null);
    window.location.reload();
  }
  function addActivity(text, type = "note") {
    const id = Date.now();
    const item = { id, title: text, when: "just now", type, details: "Added manually" };
    setActivity((s) => [item, ...(s || [])]);
  }
  function openItemDrawer(item) {
    setOpenItem(item);
  }
  function closeItemDrawer() {
    setOpenItem(null);
  }

  if (!user) {
    return (
      <main className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="bg-white rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-semibold">You're not signed in</h2>
            <p className="mt-2 text-gray-600">Please sign in to view your dashboard.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => (window.location.href = "/login")} className="px-4 py-2 rounded-md bg-pink-600 text-white">Go to Login</button>
              <button onClick={() => { const demo = { name: "Arbaz Khan", email: "arbazkhan770300@gmail.com", phone: "+91 8957135387" }; localStorage.setItem("authUser", JSON.stringify(demo)); setUser(demo); }} className="px-4 py-2 rounded-md border">Use demo user</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, <span className="text-pink-600">{user.name}</span></h1>
            <p className="mt-1 text-sm text-gray-600">Aligned, responsive dashboard — mobile-first and pixel-consistent.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openEdit} className="px-3 py-2 rounded-full border text-sm">Edit profile</button>
            <button
              onClick={() => {
                const v = ["BEGIN:VCARD","VERSION:3.0",`FN:${user.name}`,`EMAIL:${user.email}`].join("\n");
                const blob = new Blob([v], { type: "text/vcard" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${(user.name||"contact").replace(/\s+/g,"_")}.vcf`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 rounded-full bg-amber-400 text-white text-sm"
            >
              vCard
            </button>
            <button onClick={logout} className="px-3 py-2 rounded-full border text-sm">Logout</button>
          </div>
        </header>

        {/* grid: left (1) / right (3) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* left column */}
          <aside className="space-y-4 lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold">
                  {initials(user.name)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-500 mt-1">{user.phone}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => addActivity("New project", "project")} className="px-2 py-2 rounded-md border text-sm">New</button>
                <button onClick={() => addActivity("Quick message", "message")} className="px-2 py-2 rounded-md bg-pink-600 text-white text-sm">Message</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="text-sm font-semibold">Course progress</div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-amber-400" style={{ width: `${stats?.courseProgress ?? 60}%`, transition: "width 800ms ease" }} />
                </div>
                <div className="text-xs text-gray-500 mt-2">{stats?.courseProgress ?? 60}% complete</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="text-sm font-semibold mb-2">Quick links</div>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => window.location.assign("/blog")} className="w-full px-3 py-2 rounded-md border text-sm text-left">Open Blog</button>
                <button onClick={() => window.location.assign("/faq")} className="w-full px-3 py-2 rounded-md border text-sm text-left">Help & FAQ</button>
                <button onClick={() => window.location.assign("/contact")} className="w-full px-3 py-2 rounded-md border text-sm text-left">Contact</button>
              </div>
            </div>
          </aside>

          {/* main */}
          <section className="lg:col-span-3 space-y-4">
            {/* stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white animate-pulse h-20 rounded-2xl" />)
              ) : (
                <>
                  <div className="bg-white rounded-2xl p-3 shadow-sm border flex flex-col justify-between">
                    <div className="text-xs text-gray-500">Posts</div>
                    <div className="text-xl font-bold">{postsCount}</div>
                    <div className="text-xs text-green-600">+2</div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 shadow-sm border flex flex-col justify-between">
                    <div className="text-xs text-gray-500">Followers</div>
                    <div className="text-xl font-bold">{followersCount}</div>
                    <div className="text-xs text-green-600">+8</div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 shadow-sm border flex flex-col justify-between">
                    <div className="text-xs text-gray-500">Projects</div>
                    <div className="text-xl font-bold">{projectsCount}</div>
                    <div className="text-xs text-green-600">+1</div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 shadow-sm border flex flex-col justify-between">
                    <div className="text-xs text-gray-500">Messages</div>
                    <div className="text-xl font-bold">{messagesCount}</div>
                    <div className="text-xs text-rose-600">-1</div>
                  </div>
                </>
              )}
            </div>

            {/* chart + timeline */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Activity (7 days)</div>
                  <div className="text-xs text-gray-500">Interactive chart and timeline</div>
                </div>
                <div className="text-xs text-gray-500">{(posts || []).length} posts</div>
              </div>

              <div className="mt-3">
                <InteractiveChart data={chartData} />
              </div>

              <div className="mt-4">
                <HorizontalTimeline items={timelineItems} onOpen={openItemDrawer} />
              </div>
            </div>

            {/* recent posts */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Recent posts</div>
                <div className="text-xs text-gray-500">{(posts || []).length} total</div>
              </div>

              <ul className="mt-3 space-y-2">
                {(posts || []).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()} • {p.minutes}m</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => window.location.assign(`/post/${p.id}`)} className="px-2 py-1 rounded border text-xs">Open</button>
                      <button onClick={() => navigator.clipboard?.writeText(window.location.origin + `/post/${p.id}`)} className="px-2 py-1 rounded border text-xs">Copy link</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* drawer */}
      {openItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeItemDrawer} />
          <div className="relative bg-white rounded-t-xl sm:rounded-2xl p-4 max-w-3xl w-full shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold">{openItem.title}</h4>
                <div className="text-xs text-gray-500">{openItem.when}</div>
              </div>
              <button className="p-2 rounded-md border" onClick={closeItemDrawer}>Close</button>
            </div>
            <div className="mt-3 text-sm text-gray-700">{openItem.details || "No details available."}</div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { navigator.clipboard?.writeText(openItem.title); }} className="px-3 py-2 rounded-md border">Copy</button>
              <button onClick={() => { setActivity((s) => s.filter((a) => a.id !== openItem.id)); closeItemDrawer(); }} className="px-3 py-2 rounded-md border text-rose-600">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditOpen(false)} />
          <form onSubmit={saveProfile} className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg z-10">
            <h3 className="text-xl font-semibold">Edit profile</h3>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <label>
                <div className="text-sm font-medium">Full name</div>
                <input autoFocus value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded border" />
              </label>
              <label>
                <div className="text-sm font-medium">Email</div>
                <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="mt-1 w-full px-3 py-2 rounded border" />
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setEditOpen(false)} className="px-3 py-2 rounded border">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-pink-600 text-white">{saving ? "Saving..." : "Save changes"}</button>
            </div>
          </form>
        </div>
      )}

      {/* small global css to prevent sticky overlap on mobile */}
      <style>{`
        @media (max-width: 640px) {
          body { padding-bottom: 110px; }
        }
      `}</style>
    </main>
  );
}
