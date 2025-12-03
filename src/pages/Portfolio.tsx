// PortfolioInteriorFixedImages.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/*
  PortfolioInteriorFixedImages.jsx
  - Uses fixed source.unsplash.com URLs for deterministic images
  - 20 curated interior design projects
  - Masonry layout, filters, lightbox, download & copy
*/

const PROJECTS_20 = [
  {
    id: 1,
    title: "Modern Living Room — Coastal Calm",
    subtitle: "Soft neutrals & rattan accents",
    desc: "Airy layout, natural fibers and coastal light.",
    room: "Living Room",
    style: "Modern Coastal",
    materials: ["Rattan", "Oak", "Linen"],
    colors: ["#F8F4ED", "#C9E4DE", "#F6C89F"],
    image: "src/assets/images/modern-living-room.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?coastal%20living%20room",
  },
  {
    id: 2,
    title: "Cozy Bedroom — Warm Layers",
    subtitle: "Plush textiles & ambient lighting",
    desc: "Muted warm palette and layered textiles.",
    room: "Bedroom",
    style: "Contemporary",
    materials: ["Velvet", "Brass", "Wool"],
    colors: ["#3E2F2F", "#D8B4A6", "#F3E9E2"],
    image: "src/assets/images/cozy-bedroom.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?cozy%20bedroom",
  },
  {
    id: 3,
    title: "Minimal Kitchen — Functional Beauty",
    subtitle: "Clean cabinetry & tactile stone",
    desc: "Integrated appliances with tactile stone worktops.",
    room: "Kitchen",
    style: "Minimal",
    materials: ["Quartz", "Matte Metal", "Maple"],
    colors: ["#F7F7F7", "#2E2E2E", "#D9D9D9"],
    image: "src/assets/images/minimal-kitchen.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?minimal%20kitchen",
  },
  {
    id: 4,
    title: "Scandinavian Nook — Compact Comfort",
    subtitle: "Light wood & soft greys",
    desc: "Efficient storage with soft Scandinavian palette.",
    room: "Living Room",
    style: "Scandinavian",
    materials: ["Pine", "Cotton", "Ceramic"],
    colors: ["#FFFFFF", "#CFCFCF", "#9AAFB7"],
    image: "src/assets/images/scandinavian-nook.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?scandinavian%20interior",
  },
  {
    id: 5,
    title: "Statement Hallway — Gallery Lighting",
    subtitle: "Bold paint & layered illumination",
    desc: "Gallery wall and layered lighting to welcome guests.",
    room: "Hallway",
    style: "Eclectic",
    materials: ["Plaster", "Oak", "Metal"],
    colors: ["#1F2937", "#F9FAFB", "#EAB308"],
    image: "src/assets/images/statement-hallway.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?gallery%20hallway",
  },
  {
    id: 6,
    title: "Monochrome Bathroom — High Contrast",
    subtitle: "Black & white luxe finishes",
    desc: "High-contrast tiles with clean fixtures.",
    room: "Bathroom",
    style: "Monochrome",
    materials: ["Marble", "Chrome", "Porcelain"],
    colors: ["#000000", "#FFFFFF", "#BDBDBD"],
    image: "src/assets/images/monochrome-bathroom.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?black%20white%20bathroom",
  },
  {
    id: 7,
    title: "Kids Playroom — Durable Joy",
    subtitle: "Colorful, durable & playful",
    desc: "Safe surfaces, clever storage and cheerful palette.",
    room: "Playroom",
    style: "Playful",
    materials: ["Rubber", "Laminate", "Fabric"],
    colors: ["#FFD166", "#06D6A0", "#118AB2"],
    image: "src/assets/images/kids-playroom.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?kids%20playroom",
  },
  {
    id: 8,
    title: "Rooftop Patio — Urban Retreat",
    subtitle: "Potted plants & lounge seating",
    desc: "Layered seating and greenery for outdoor living.",
    room: "Outdoor",
    style: "Urban Patio",
    materials: ["Teak", "Concrete", "Cushion"],
    colors: ["#2F4F4F", "#8FBF9F", "#F2E2C4"],
    image: "src/assets/images/roof-top.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?rooftop%20patio",
  },
  {
    id: 9,
    title: "Minimal Office — Focused Calm",
    subtitle: "Clean desk & good light",
    desc: "Calm neutrals for deep focus and productivity.",
    room: "Office",
    style: "Minimal",
    materials: ["Maple", "Steel", "Glass"],
    colors: ["#F5F5F5", "#2A2A2A", "#9AA4A6"],
    image: "src/assets/images/minimal-office.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?minimal%20home%20office",
  },
  {
    id: 10,
    title: "Dining Room — Warm Entertaining",
    subtitle: "Long table & layered lighting",
    desc: "Sociable layout with warm materials.",
    room: "Dining",
    style: "Modern Rustic",
    materials: ["Oak", "Stone", "Wool"],
    colors: ["#EDE5DB", "#9C6B4D", "#F6F1EA"],
    image: "src/assets/images/dining-room.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?dining%20room",
  },
  {
    id: 11,
    title: "Guest Room — Serene Neutral",
    subtitle: "Thoughtful details & comfort",
    desc: "Neutral retreat with hotel-style touches.",
    room: "Guest Room",
    style: "Serene",
    materials: ["Linen", "Ash", "Ceramic"],
    colors: ["#F4F2EE", "#CFC7BE", "#A7A19A"],
    image: "src/assets/images/guest-room.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?guest%20bedroom",
  },
  {
    id: 12,
    title: "Home Theater — Immersive Cinema",
    subtitle: "Acoustic finishes & layered light",
    desc: "Plush seating, acoustic panels, concealed lighting.",
    room: "Home Theater",
    style: "Contemporary",
    materials: ["Velvet", "Acoustic Panel", "Wood"],
    colors: ["#0F172A", "#1E293B", "#6B7280"],
    image: "src/assets/images/home-theater.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?home%20theater",
  },
  {
    id: 13,
    title: "Sunroom — Light Filled Lounge",
    subtitle: "Indoor plants & breeze",
    desc: "Bright planting corner with cosy seating.",
    room: "Sunroom",
    style: "Botanical",
    materials: ["Rattan", "Terracotta", "Cotton"],
    colors: ["#FAF3E0", "#C8E6C9", "#F2D0A9"],
    image: "src/assets/images/sun-room.png",
    moodboard: "https://source.unsplash.com/1600x1000/?sunroom%20plants",
  },
  {
    id: 14,
    title: "Walk-in Closet — Curated Storage",
    subtitle: "Organized elegance & lighting",
    desc: "Custom joinery with elegant finishes.",
    room: "Closet",
    style: "Luxury",
    materials: ["Walnut", "Brass", "Glass"],
    colors: ["#F8F4F0", "#A88B6E", "#2B2B2B"],
    image: "src/assets/images/walk-closet.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?walk%20in%20closet",
  },
  {
    id: 15,
    title: "Loft Studio — Industrial Chic",
    subtitle: "Exposed structure & warm accents",
    desc: "Open plan with industrial bones and warm layers.",
    room: "Loft",
    style: "Industrial",
    materials: ["Concrete", "Steel", "Leather"],
    colors: ["#2B2B2B", "#A3A3A3", "#C9A66B"],
    image: "src/assets/images/loft-studio.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?industrial%20loft",
  },
  {
    id: 16,
    title: "Mudroom — Practical & Pretty",
    subtitle: "Durable surfaces & smart storage",
    desc: "Boot-friendly surfaces and clever hooks.",
    room: "Mudroom",
    style: "Practical",
    materials: ["Tile", "Built-in", "Wood"],
    colors: ["#EDEDED", "#8B8B8B", "#D9C6B1"],
    image: "src/assets/images/mud-room.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?mudroom%20storage",
  },
  {
    id: 17,
    title: "Pantry — Organized Simplicity",
    subtitle: "Open shelving & labeled jars",
    desc: "Functional pantry with a clean aesthetic.",
    room: "Pantry",
    style: "Organized",
    materials: ["Pine", "Glass", "Metal"],
    colors: ["#FFFFFF", "#E6E1D5", "#6E6E6E"],
    image: "src/assets/images/pantry.jpg",
    moodboard: "https://source.unsplash.com/1600x1000/?organized%20pantry",
  },
  {
    id: 18,
    title: "Balcony — Small Outdoor Oasis",
    subtitle: "Compact seating & green planters",
    desc: "Bistro seating, plants and soft lighting.",
    room: "Balcony",
    style: "Urban Garden",
    materials: ["Wicker", "Ceramic", "Metal"],
    colors: ["#F6F1E6", "#7FB77E", "#EAB676"],
    image: "src/assets/images/balcony-small-outdoor.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?small%20balcony%20garden",
  },
  {
    id: 19,
    title: "Nursery — Gentle & Safe",
    subtitle: "Soft palette & tactile textiles",
    desc: "Calming palette with durable soft finishes.",
    room: "Nursery",
    style: "Scandi Kids",
    materials: ["Cotton", "Cedar", "Wool"],
    colors: ["#F7F5F2", "#C0D6D6", "#F9E6E0"],
    image: "src/assets/images/nursery.jpeg",
    moodboard: "https://source.unsplash.com/1600x1000/?nursery%20decor",
  },
  {
    id: 20,
    title: "Study Corner — Compact Productivity",
    subtitle: "Smart desk & good ergonomics",
    desc: "Compact workspace with careful ergonomics.",
    room: "Study",
    style: "Functional",
    materials: ["Birch", "Metal", "Fabric"],
    colors: ["#FFFFFF", "#BFC8C8", "#2E3940"],
    image: "src/assets/images/study-corner.png",
    moodboard: "https://source.unsplash.com/1600x1000/?study%20nook",
  },
];

function uniqueRooms(list) {
  return ["All", ...Array.from(new Set(list.map((p) => p.room)))];
}

export default function PortfolioInteriorFixedImages() {
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("All");
  const [limit, setLimit] = useState(9);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const rooms = useMemo(() => uniqueRooms(PROJECTS_20), []);

  const filtered = useMemo(() => {
    let list = PROJECTS_20.slice();
    if (room !== "All") list = list.filter((p) => p.room === room);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        (p.title + " " + p.desc + " " + p.style + " " + p.subtitle).toLowerCase().includes(q)
      );
    }
    return list;
  }, [room, query]);

  const visible = filtered.slice(0, limit);

  // lightbox helpers
  function openLightbox(idx) {
    setLightboxIndex(idx);
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    setLightboxIndex(-1);
    document.body.style.overflow = "auto";
  }
  function nextLightbox() {
    setLightboxIndex((i) => (i + 1) % filtered.length);
  }
  function prevLightbox() {
    setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
  }

  useEffect(() => {
    function onKey(e) {
      if (lightboxIndex === -1) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filtered.length]);

  function onImgError(e) {
    e.currentTarget.src = `https://via.placeholder.com/1200x800.png?text=Interior+image+missing`;
  }

  async function downloadImage(url, name = "image.jpg") {
    try {
      const resp = await fetch(url, { mode: "cors" });
      if (!resp.ok) throw new Error("fetch failed");
      const blob = await resp.blob();
      const obj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = obj;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(obj);
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  async function copyImageUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      alert("Image URL copied to clipboard");
    } catch {
      prompt("Copy URL:", url);
    }
  }

  function openMoodboard(p) {
    window.open(p.moodboard, "_blank", "noopener");
  }

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-extrabold">Interior Design — Visual Catalogue (20)</h2>

        <div className="flex gap-2 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, style, subtitle..."
            className="px-3 py-2 border rounded-md text-sm"
          />
          <select value={room} onChange={(e) => setRoom(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
            {rooms.map((r) => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>
      </div>

      {/* masonry */}
      <div className="portfolio-masonry" style={{ columnGap: 24, columnCount: 1 }}>
        <style>{`
          @media (min-width: 640px) { .portfolio-masonry { column-count: 2 } }
          @media (min-width: 1024px) { .portfolio-masonry { column-count: 3 } }
          .portfolio-card { break-inside: avoid; display: inline-block; width: 100%; margin-bottom: 24px }
        `}</style>

        {visible.map((p, idx) => (
          <article key={p.id} className="portfolio-card rounded-2xl p-4 bg-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: 260 }}>
              <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" onError={onImgError} />
              <div className="absolute left-0 bottom-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="text-sm font-medium opacity-90">{p.room} • {p.style}</div>
                <div className="text-lg font-semibold leading-tight">{p.title}</div>
                <div className="text-xs mt-1 opacity-90">{p.subtitle}</div>
              </div>
              <button onClick={() => openLightbox(filtered.indexOf(p))} className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/80 text-xs">View</button>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <div className="text-xs text-gray-500">{p.room} • {p.style}</div>
                </div>

                <div className="flex gap-1">
                  {p.colors.map((c, i) => (<div key={i} className="w-6 h-6 rounded-full border" style={{ background: c }} title={c} />))}
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">{p.desc}</p>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                {p.materials.map((m) => (<span key={m} className="px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded-full border">{m}</span>))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Link to={`/case-study/${p.id}`} className="text-sm text-pink-600 hover:underline">View case study →</Link>
                  <button onClick={() => openMoodboard(p)} className="px-3 py-1 border rounded-md text-sm">Open moodboard</button>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => downloadImage(p.image, `${p.id}-${p.title.replace(/\s+/g, "-")}.jpg`)} className="px-3 py-1 border rounded-md text-sm">Download</button>
                  <button onClick={() => copyImageUrl(p.image)} className="px-3 py-1 border rounded-md text-sm">Copy URL</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 text-center">
        {limit < filtered.length ? (
          <button onClick={() => setLimit((l) => l + 6)} className="px-6 py-3 rounded-full bg-pink-600 text-white">Load more</button>
        ) : (
          filtered.length > 9 && (<button onClick={() => setLimit(9)} className="px-6 py-3 rounded-full border">Show less</button>)
        )}
      </div>

      {/* lightbox */}
      {lightboxIndex > -1 && filtered[lightboxIndex] && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeLightbox} />
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden z-10">
            <div className="flex items-center gap-3 p-3 border-b">
              <h3 className="font-semibold">{filtered[lightboxIndex].title}</h3>
              <div className="text-sm text-gray-500">{filtered[lightboxIndex].room} • {filtered[lightboxIndex].style}</div>
              <div className="ml-auto flex gap-2">
                <button onClick={() => copyImageUrl(filtered[lightboxIndex].moodboard)} className="px-3 py-1 border rounded">Copy URL</button>
                <button onClick={() => downloadImage(filtered[lightboxIndex].moodboard, `${filtered[lightboxIndex].id}-mood.jpg`)} className="px-3 py-1 border rounded">Download</button>
                <button onClick={closeLightbox} className="px-3 py-1 border rounded">Close</button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-50 relative">
              <button onClick={prevLightbox} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full">◀</button>
              <img src={filtered[lightboxIndex].image} alt={filtered[lightboxIndex].title} className="max-h-[80vh] object-contain" onError={onImgError} />
              <button onClick={nextLightbox} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full">▶</button>
            </div>

            <div className="p-4 border-t text-sm text-gray-600">{filtered[lightboxIndex].desc}</div>
          </div>
        </div>
      )}
    </section>
  );
}
