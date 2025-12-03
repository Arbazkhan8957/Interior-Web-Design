// GalleryPro.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * GalleryPro.jsx
 * - Supercharged interior-design gallery (30 projects)
 * - Search, sort, filters, favorites (localStorage), load-more
 * - Lightbox with full details + Download / Share / Export PDF
 * - PDF export uses html2canvas + jspdf (dynamically imported)
 *
 * Usage:
 *  - Drop into a React app (Tailwind CSS optional but classes are used)
 *  - To enable faster PDF exports: npm i html2canvas jspdf
 */

const ALL_PROJECTS = (() => {
  // 30 curated projects (images use Unsplash search or local paths you provided) — you can replace srcs with your own assets.
  const base = [
    /* 1..12 existing projects (use earlier objects) */
    {
      id: 1,
      title: "Modern Living Room",
      category: "Living Room",
      src: "src/assets/images/mleaving.jpg",
      excerpt:
        "Airy layout centred around a layered seating arrangement — natural textures and warm neutrals create a calm social hub.",
      description:
        "Design intent: Create a relaxed social living area with flexible seating for 4–6 people. We used a neutral base palette with layered textiles (linen sofas, wool rugs) and rattan accents to add tactile warmth. Lighting strategy includes a central pendant for ambient light plus adjustable wall sconces for reading nooks. Furniture layout prioritizes circulation (minimum 800mm pathways) and sightlines toward the feature wall where artwork anchors the room. Practical notes: choose performance fabrics for family homes and specify stain-resistant finishes for the coffee table.",
      materials: ["Linen upholstery", "Oak side table", "Wool rug", "Rattan accent chair"],
      colors: ["#F8F4ED", "#C9E4DE", "#B07B5A"],
      tags: ["Social", "Neutral", "Textured"],
      moodboard: "https://source.unsplash.com/1600x1000/?modern%20living%20room",
    },
    {
      id: 2,
      title: "Cozy Bedroom Retreat",
      category: "Bedroom",
      src: "src/assets/images/cbedroom.jpg",
      excerpt:
        "A restful bedroom layered with plush fabrics and soft, indirect lighting to promote relaxation.",
      description:
        "Design intent: Prioritise comfort and acoustic performance. We selected a low-profile bed with pocket-sprung mattress and a headboard that incorporates integrated reading lights. The palette leans warm: muted terracotta and soft creams. Window treatments include blackout lining plus a sheer for daylight privacy. Storage is recessed and organized to keep surfaces calm. Lighting design includes dimmable LEDs at three levels: ambient, task, and accent. Textures like velvet cushions and knitted throws add depth without visual clutter.",
      materials: ["Velvet cushions", "Brass reading lamp", "Wool throw", "Timber bedside"],
      colors: ["#3E2F2F", "#D8B4A6", "#F3E9E2"],
      tags: ["Calm", "Layered", "Warm"],
      moodboard: "https://source.unsplash.com/1600x1000/?cozy%20bedroom",
    },
    {
      id: 3,
      title: "Minimal Kitchen",
      category: "Kitchen",
      src: "src/assets/images/mkitchen.jpg",
      excerpt:
        "Clean lines, efficient storage and tactile worktops. The kitchen is built for daily cooking and easy maintenance.",
      description:
        "Design intent: Maximise functionality in a streamlined, minimalist aesthetic. Use full-height cabinetry to conceal appliances and reduce visual clutter. The island doubles as a prep surface and casual dining area — top with honed quartz for durability. Incorporate deep drawers for pots and soft-close hardware. Lighting: recessed downlights over prep zones, pendant lights above the island, and under-cabinet LEDs for task lighting. Finish selection should favour tactile, durable surfaces that patina gracefully.",
      materials: ["Quartz countertop", "Matte metal handles", "Maple cabinetry"],
      colors: ["#F7F7F7", "#2E2E2E", "#D9D9D9"],
      tags: ["Functional", "Streamlined", "Durable"],
      moodboard: "https://source.unsplash.com/1600x1000/?minimal%20kitchen",
    },
    {
      id: 4,
      title: "Marble Bathroom",
      category: "Bathroom",
      src: "src/assets/images/Marble Bathroom.jpg",
      excerpt:
        "High-contrast marble treatments with polished fixtures for a spa-like bathing environment.",
      description:
        "Design intent: Achieve a calm, spa-like atmosphere with a strong material statement. Marble or porcelain stoneware in large-format tiles reduces grout lines and enhances the sense of space. Use matt non-slip flooring for safety and polished stone for vertical surfaces. Integrate a recessed shower niche and select concealed linear drains for a seamless finish. Complement with warm metallic fittings and soft, indirect cove lighting to balance the coolness of stone;",
      materials: ["Marble tile", "Chrome fixtures", "Porcelain basin"],
      colors: ["#FFFFFF", "#111827", "#BFBFBF"],
      tags: ["Spa", "Luxury", "Stone"],
      moodboard: "https://source.unsplash.com/1600x1000/?marble%20bathroom",
    },
    {
      id: 5,
      title: "Home Office Setup",
      category: "Office",
      src: "src/assets/images/Home Office Setup.jpg",
      excerpt:
        "A compact home office with ergonomic furniture, natural daylight and smart cable management.",
      description:
        "Design intent: Balance ergonomics and style for long focused sessions. Choose an adjustable sit-stand desk and an ergonomic chair with lumbar support. Position the desk to receive indirect natural light to reduce glare on screens. Provide layered lighting — task light for the desk, ambient for the room and accent for displays. Use acoustic panels or soft textiles to reduce reverberation and add a small planting area for wellbeing benefits. Storage should be vertical and easily accessible.",
      materials: ["Ergonomic chair", "Sit-stand desk", "Acoustic panel"],
      colors: ["#F5F5F5", "#2A2A2A", "#9AA4A6"],
      tags: ["Ergonomic", "Productivity", "Quiet"],
      moodboard: "https://source.unsplash.com/1600x1000/?home%20office",
    },
    {
      id: 6,
      title: "Scandinavian Lounge",
      category: "Living Room",
      src: "src/assets/images/Scandinavian Lounge.jpg",
      excerpt:
        "Light wood tones and simple forms with layered textiles to create an airy yet cosy atmosphere.",
      description:
        "Design intent: Create an airy, functional lounge rooted in Scandinavian principles: light timber, ample daylight, and a minimalist approach to accessories. Introduce soft textiles to add contrast and comfort without overpowering the calm palette. Keep furniture low and visually light, and incorporate plants to bring warmth and life. Storage solutions are integrated and subtly detailed to preserve clean lines.",
      materials: ["Pine furniture", "Cotton textiles", "Ceramic accents"],
      colors: ["#FFFFFF", "#CFCFCF", "#9AAFB7"],
      tags: ["Scandi", "Light", "Natural"],
      moodboard: "https://source.unsplash.com/1600x1000/?scandinavian%20interior",
    },
    {
      id: 7,
      title: "Warm Bedroom Lighting",
      category: "Bedroom",
      src: "src/assets/images/Warm Bedroom Lighting.jpg",
      excerpt:
        "Carefully layered warm lighting creates zoned ambience for sleeping, reading and dressing.",
      description:
        "Design intent: Use lighting to create moods: warm ambient light for evening relaxation, layered with task lights (reading) and accent lights (art & niche). Use warm 2700–3000K LED sources and dimmers to control brightness through the day. For bedside lighting, prefer adjustable wall lamps to keep bedside surfaces clear. Incorporate soft textures and acoustic elements to improve the sleep environment.",
      materials: ["Brass lamp", "Velvet cushions", "Timber side table"],
      colors: ["#8B5E3C", "#F2E6DA", "#6B4F3A"],
      tags: ["Lighting", "Cozy", "Sleep"],
      moodboard: "https://source.unsplash.com/1600x1000/?warm%20bedroom%20lighting",
    },
    {
      id: 8,
      title: "Luxury Modular Kitchen",
      category: "Kitchen",
      src: "src/assets/images/Luxury Modular Kitchen.jpg",
      excerpt:
        "Modular layout with premium finishes, integrated appliances and a social island for entertaining.",
      description:
        "Design intent: Balance premium materials with practical flow. Keep the work triangle efficient (sink → hob → fridge) and include dedicated appliance zones. Choose durable finishes at touchpoints (island top, cabinet handles) and high-performance integrated appliances to maintain clean lines. Add under-cabinet lighting and a feature extractor above the hob. Consider a specialist joiner for bespoke pantry and appliance housing to maximise storage density.",
      materials: ["Stone island", "Integrated appliances", "Glass cabinetry"],
      colors: ["#EFEFEF", "#222222", "#C7B59A"],
      tags: ["Premium", "Entertaining", "Modular"],
      moodboard: "https://source.unsplash.com/1600x1000/?luxury%20kitchen",
    },
    {
      id: 9,
      title: "Black & White Bathroom",
      category: "Bathroom",
      src: "src/assets/images/Black & White Bathroom.jpg",
      excerpt:
        "A bold monochrome scheme that uses contrast and texture to feel elegant rather than austere.",
      description:
        "Design intent: Use a monochrome palette to create drama while balancing tactile finishes. Introduce texture through matte tiles, fluted glass and warm wood accessories to temper the stark contrast. Lighting is layered to avoid flatness: mirror-mounted task lights, ambient downlights and a statement pendant where ceiling height allows. Use discreet ventilation and specify moisture-resistant finishes for longevity.",
      materials: ["Matte tiles", "Fluted glass", "Timber accessories"],
      colors: ["#000000", "#FFFFFF", "#9E9E9E"],
      tags: ["Monochrome", "Dramatic", "Textured"],
      moodboard: "https://source.unsplash.com/1600x1000/?black%20white%20bathroom",
    },
    {
      id: 10,
      title: "Minimal Work Desk",
      category: "Office",
      src: "src/assets/images/Minimal Work Desk.png",
      excerpt:
        "A compact, distraction-free desk area with intelligent cable routing and daylight prioritised.",
      description:
        "Design intent: Provide an efficient micro-workspace that supports focus. Keep screens at ergonomic height and provide a simple cable-management channel. Include a dedicated task lamp with diffused light to reduce eye strain. Choose a matte desktop finish to reduce glare. Introduce an element of softness (small rug, plant) to make the space comfortable without clutter.",
      materials: ["Birch desk", "Task lamp", "Cable grommet"],
      colors: ["#FFFFFF", "#BFC8C8", "#2E3940"],
      tags: ["Focus", "Compact", "Ergonomic"],
      moodboard: "https://source.unsplash.com/1600x1000/?compact%20work%20desk",
    },
    {
      id: 11,
      title: "Classic Living Room",
      category: "Living Room",
      src: "src/assets/images/Classic Living Room.jpeg",
      excerpt:
        "Timeless proportion and curated antiques combine for an inviting, layered classic interior.",
      description:
        "Design intent: Respect classic proportion with balanced furniture placement: sofa anchored by two armchairs facing each other. Use rich textiles (silk, linen), layered rugs, and curated art to give depth. Joinery is detailed and refined; skirtings and architraves can be used to add character. Lighting: a central chandelier for drama and table lamps for intimate illumination. Consider proportion and scale for every piece — oversized art or furniture will quickly feel off-balance in a classic scheme.",
      materials: ["Silk cushions", "Antique oak table", "Layered rugs"],
      colors: ["#EDE8E2", "#8A6B4A", "#2F2F2F"],
      tags: ["Timeless", "Curated", "Layered"],
      moodboard: "https://source.unsplash.com/1600x1000/?classic%20interior",
    },
    {
      id: 12,
      title: "Natural Wood Bedroom",
      category: "Bedroom",
      src: "src/assets/images/Natural Wood Bedroom.png",
      excerpt:
        "Warm timber tones and minimal detailing make this bedroom feel grounded and restorative.",
      description:
        "Design intent: Use wood as the principal anchor for warmth and tactility. Keep joinery finishes consistent (e.g. all oak) and pair with soft linens and neutral paint to maintain calm. Use layered lighting and ensure window treatments allow both daylight and full blackout when required. For small rooms, use light-reflecting surfaces and low-profile furniture to maximise perceived space.",
      materials: ["Oak bed frame", "Cotton linens", "Natural-fibre rug"],
      colors: ["#F7F5F2", "#C9A57A", "#9FA8A3"],
      tags: ["Natural", "Warm", "Restorative"],
      moodboard: "https://source.unsplash.com/1600x1000/?wood%20bedroom",
    },
    // Add more projects 13..30 (Unsplash search-based images and long texts)
    {
      id: 13,
      title: "Rooftop Patio Oasis",
      category: "Outdoor",
      src: "src/assets/images/roof-top.jpeg",
      excerpt: "A small urban rooftop turned into a lush lounge with layered seating and planters.",
      description:
        "Design intent: Maximise greenery in a compact urban rooftop with modular planters, weatherproof cushions and low-maintenance species. Use string lights and integrated planters to create separation between the seating area and circulation. Choose lightweight furniture that can be rearranged for different events. Consider wind loads and irrigation.",
      materials: ["Teak seating", "Planters", "Outdoor cushions"],
      colors: ["#2F4F4F", "#8FBF9F", "#F2E2C4"],
      tags: ["Outdoor", "Green", "Social"],
      moodboard: "https://source.unsplash.com/1600x1000/?rooftop%20patio",
    },
    {
      id: 14,
      title: "Children's Playroom",
      category: "Playroom",
      src: "src/assets/images/Children's Playroom.jpeg",
      excerpt: "A durable, playful zone with clever storage and safe finishes for kids.",
      description:
        "Design intent: Choose impact-resistant finishes, rounded edges and accessible storage. Use bright accents for activity zones and soft floorings like cork or foam tiles for safe play. Include multi-height elements for different ages and sensory play corners.",
      materials: ["Cork flooring", "Built-in storage", "Washable paint"],
      colors: ["#FFD166", "#06D6A0", "#118AB2"],
      tags: ["Playful", "Durable", "Safe"],
      moodboard: "https://source.unsplash.com/1600x1000/?kids%20playroom",
    },
    {
      id: 15,
      title: "Boutique Entryway",
      category: "Hallway",
      src: "src/assets/images/Boutique Entryway.jpg",
      excerpt: "A compact entry designed to make a strong first impression with art & lighting.",
      description:
        "Design intent: Use statement lighting and a curated art piece to create immediate impact. Provide a small console with drop-zone storage and a bench for convenience. Durable floor finish recommended for high traffic.",
      materials: ["Console", "Wall art", "Runner rug"],
      colors: ["#1F2937", "#F9FAFB", "#EAB308"],
      tags: ["Entry", "Statement", "Practical"],
      moodboard: "https://source.unsplash.com/1600x1000/?entryway",
    },
    {
      id: 16,
      title: "Walk-in Pantry",
      category: "Pantry",
      src: "src/assets/images/Walk-in Pantry.jpg",
      excerpt: "Organised open shelving and labeling for efficient meal prep and storage.",
      description:
        "Design intent: Provide clear sightlines, labelled jars and adjustable shelving. Include a small prep counter if space allows and task lighting for visibility. Pull-out trays or baskets help access items at the back.",
      materials: ["Pine shelving", "Glass jars", "Pull-out trays"],
      colors: ["#FFFFFF", "#E6E1D5", "#6E6E6E"],
      tags: ["Organised", "Functional", "Accessible"],
      moodboard: "https://source.unsplash.com/1600x1000/?pantry",
    },
    {
      id: 17,
      title: "Media & Home Theater",
      category: "Home Theater",
      src: "src/assets/images/Media & Home Theater.jpg",
      excerpt: "Acoustic treatment, tiered seating and controlled lighting for optimal viewing.",
      description:
        "Design intent: Prioritise acoustic absorption, sightlines and comfortable seating. Use matte finishes to reduce glare and create zones for AV equipment with concealed cable routes. Integrate dimmable lights and blackout options for daytime viewing.",
      materials: ["Acoustic panels", "Velvet seating", "AV rack"],
      colors: ["#0F172A", "#1E293B", "#6B7280"],
      tags: ["Acoustic", "Immersive", "Comfort"],
      moodboard: "https://source.unsplash.com/1600x1000/?home%20theater",
    },
    {
      id: 18,
      title: "Serene Guest Suite",
      category: "Guest Room",
      src: "src/assets/images/Serene Guest Suite.jpg",
      excerpt: "A hotel-like guest suite with layered linens and dedicated storage.",
      description:
        "Design intent: Include flexible storage, ambient lighting, and a simple refreshment corner. Choose linens that are durable yet luxurious and create a calm, neutral backdrop for easy staging.",
      materials: ["Linen", "Storage cabinet", "Bedside lamp"],
      colors: ["#F4F2EE", "#CFC7BE", "#A7A19A"],
      tags: ["Hospitality", "Comfort", "Neutral"],
      moodboard: "https://source.unsplash.com/1600x1000/?guest%20suite",
    },
    {
      id: 19,
      title: "Compact Balcony Garden",
      category: "Balcony",
      src: "src/assets/images/Compact Balcony Garden.jpg",
      excerpt: "A tiny balcony made useful with vertical planting and foldable furniture.",
      description:
        "Design intent: Use vertical planters and fold-down tables to maximise function. Choose lightweight, weatherproof pieces and introduce soft lighting for evening use. Consider irrigation and plant selection for microclimates.",
      materials: ["Vertical planters", "Foldable table", "Outdoor cushion"],
      colors: ["#F6F1E6", "#7FB77E", "#EAB676"],
      tags: ["Outdoor", "Compact", "Green"],
      moodboard: "https://source.unsplash.com/1600x1000/?small%20balcony",
    },
    {
      id: 20,
      title: "Nursery — Gentle & Safe",
      category: "Nursery",
      src: "src/assets/images/Nursery — Gentle & Safe.jpg",
      excerpt: "Soft palette, durable fabrics and built-in storage tuned for children.",
      description:
        "Design intent: Use rounded edges, washable textiles and secure fixtures. Zone the nursery for sleep, play and storage. Choose calming hues and include dimmable lighting for nighttime care.",
      materials: ["Cotton", "Cedar crib", "Soft rug"],
      colors: ["#F7F5F2", "#C0D6D6", "#F9E6E0"],
      tags: ["Safe", "Gentle", "Practical"],
      moodboard: "https://source.unsplash.com/1600x1000/?nursery",
    },
    {
      id: 21,
      title: "Laundry Room — Smart & Tidy",
      category: "Utility",
      src: "src/assets/images/Laundry Room — Smart & Tidy.png",
      excerpt: "Organised laundry layout with dedicated sorting and drying zones.",
      description:
        "Design intent: Make laundry tasks efficient with sorters, wall-mounted drying racks and dedicated storage for detergents. Use water-resistant finishes and consider utility sinks for hand-wash tasks.",
      materials: ["Sorter", "Utility sink", "Wall hooks"],
      colors: ["#F3F4F6", "#9CA3AF", "#D1D5DB"],
      tags: ["Practical", "Organised", "Service"],
      moodboard: "https://source.unsplash.com/1600x1000/?laundry%20room",
    },
    {
      id: 22,
      title: "Boutique Bathroom Powder Room",
      category: "Bathroom",
      src: "src/assets/images/Boutique Bathroom Powder Room.jpg",
      excerpt: "Small powder room with big personality — wallpaper, statement mirror and bold tile.",
      description:
        "Design intent: Use bold finishes in small spaces for maximum effect. Choose washable wallpapers and consider a floating basin to liberate floor space. Add bold mirror and statement lighting.",
      materials: ["Wallpaper", "Statement mirror", "Bold tile"],
      colors: ["#FBE8F0", "#1F1F1F", "#FFD1A9"],
      tags: ["Small", "Bold", "Statement"],
      moodboard: "https://source.unsplash.com/1600x1000/?powder%20room",
    },
    {
      id: 23,
      title: "Open Plan Living / Dining",
      category: "Living Room",
      src: "src/assets/images/Open Plan Living Dining.jpg",
      excerpt: "A cohesive open plan layout balancing dining and lounging zones with rugs and lighting.",
      description:
        "Design intent: Use rugs, lighting and furniture arrangement to define zones in an open plan. Keep sightlines clear from kitchen to living area and ensure circulation between zones is uninterrupted.",
      materials: ["Dining table", "Area rug", "Pendant light"],
      colors: ["#FFF7ED", "#C2B29A", "#374151"],
      tags: ["Open", "Social", "Zoned"],
      moodboard: "https://source.unsplash.com/1600x1000/?open%20plan",
    },
    {
      id: 24,
      title: "Breakfast Nook",
      category: "Kitchen",
      src: "src/assets/images/Breakfast Nook.jpeg",
      excerpt: "A compact eat-in corner with banquette seating and storage beneath.",
      description:
        "Design intent: Create a cosy corner for casual meals with built-in bench seating and under-seat storage. Use durable finishes and task lighting for the table area.",
      materials: ["Banquette", "Storage bench", "Pendant light"],
      colors: ["#FFFBEA", "#C7D2FE", "#FDE68A"],
      tags: ["Cozy", "Compact", "Practical"],
      moodboard: "https://source.unsplash.com/1600x1000/?breakfast%20nook",
    },
    {
      id: 25,
      title: "Powder-Coated Industrial Loft",
      category: "Loft",
      src: "src/assets/images/Powder-Coated Industrial Loft.jpg",
      excerpt: "Raw materials and high ceilings paired with refined furniture for a lived-in loft feel.",
      description:
        "Design intent: Retain industrial elements (exposed structure) and layer with warm materials and rugs. Use mixed metals for furniture and consider polished concrete or reclaimed wood floors.",
      materials: ["Steel", "Reclaimed wood", "Leather seating"],
      colors: ["#2B2B2B", "#A3A3A3", "#C9A66B"],
      tags: ["Industrial", "Raw", "Lived-in"],
      moodboard: "https://source.unsplash.com/1600x1000/?industrial%20loft",
    },
    {
      id: 26,
      title: "Zen Meditation Corner",
      category: "Living Room",
      src: "src/assets/images/Zen Meditation Corner.jpg",
      excerpt: "A quiet corner with floor cushions, low lighting and natural materials for mindfulness.",
      description:
        "Design intent: Create a low-stimulation area with natural textures, subdued colors and a soft light source. Include storage for yoga props and a small water feature if space allows.",
      materials: ["Floor cushion", "Low table", "Indoor plant"],
      colors: ["#F4F7F3", "#BFD8C4", "#C6B89A"],
      tags: ["Calm", "Mindful", "Small"],
      moodboard: "https://source.unsplash.com/1600x1000/?zen%20corner",
    },
    {
      id: 27,
      title: "Stylish Powder Room",
      category: "Bathroom",
      src: "src/assets/images/Stylish Powder Room.jpg",
      excerpt: "Small but stylish; uses texture and mirrors to create depth.",
      description:
        "Design intent: Leverage mirrors and strategic lighting to visually enlarge the space. Consider decorative tiles and a bold paint colour to give personality with minimal footprint.",
      materials: ["Decorative tile", "Mirror", "Console basin"],
      colors: ["#F8F9FA", "#D1C4E9", "#37474F"],
      tags: ["Small", "Stylish", "Smart"],
      moodboard: "https://source.unsplash.com/1600x1000/?stylish%20powder%20room",
    },
    {
      id: 28,
      title: "Designer Staircase",
      category: "Feature",
      src: "src/assets/images/Designer Staircase.jpg",
      excerpt: "A staircase treated as a sculptural feature using bespoke materials and lighting.",
      description:
        "Design intent: Make stairs a focal point with unique balustrade materials, inset lighting and integrated storage below. Ensure safe riser/tread proportions and handrail ergonomics.",
      materials: ["Steel balustrade", "Timber treads", "Integrated lighting"],
      colors: ["#ECECEC", "#3C4858", "#B0A08B"],
      tags: ["Feature", "Architectural", "Detailed"],
      moodboard: "https://source.unsplash.com/1600x1000/?designer%20staircase",
    },
    {
      id: 29,
      title: "Pet-Friendly Lounge",
      category: "Living Room",
      src: "src/assets/images/Pet-Friendly Lounge.jpg",
      excerpt: "Durable fabrics, washable rugs and integrated pet furniture make life easier with pets.",
      description:
        "Design intent: Specify durable, stain-resistant textiles, washable rugs and easy access feeding stations. Provide a pet bed niche within joinery to keep it part of the room while tidy.",
      materials: ["Performance fabric", "Washable rug", "Pet niche"],
      colors: ["#F6EFE6", "#A59A8C", "#6D5F4B"],
      tags: ["Pets", "Durable", "Practical"],
      moodboard: "https://source.unsplash.com/1600x1000/?pet%20friendly%20living%20room",
    },
    {
      id: 30,
      title: "Transit-Friendly Mudroom",
      category: "Mudroom",
      src: "src/assets/images/Transit-Friendly Mudroom.png",
      excerpt: "A transit zone that keeps wet boots and coats out of living spaces with clever drainage and storage.",
      description:
        "Design intent: Use hard-wearing floor finishes, boot racks and slatted benches to allow drying. Consider a drain or washable grate area for heavy wet seasons and durable wall hooks for quick storage.",
      materials: ["Durable tile", "Drain tray", "Slatted bench"],
      colors: ["#EDEDED", "#8B8B8B", "#D9C6B1"],
      tags: ["Practical", "Transit", "Durable"],
      moodboard: "https://source.unsplash.com/1600x1000/?mudroom",
    },
  ];
  return base;
})();

// helper: localstorage favorites
function loadFavorites() {
  try {
    const raw = localStorage.getItem("gallery_favs_v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveFavorites(obj) {
  try {
    localStorage.setItem("gallery_favs_v1", JSON.stringify(obj));
  } catch {}
}

export default function GalleryPro() {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(ALL_PROJECTS.map((p) => p.category)));
    return ["All", ...cats];
  }, []);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("none"); // none | az | likes
  const [limit, setLimit] = useState(9);
  const [lightbox, setLightbox] = useState(null);
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // derived list
  const list = useMemo(() => {
    let items = ALL_PROJECTS.slice();
    if (showOnlyFavs) {
      items = items.filter((p) => favorites[p.id]);
    }
    if (filter !== "All") items = items.filter((p) => p.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          (p.title + " " + p.excerpt + " " + p.description + " " + (p.tags || []).join(" ")).toLowerCase().includes(q)
      );
    }
    if (sort === "az") items.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "likes")
      items.sort((a, b) => (favorites[b.id] ? favorites[b.id] : 0) - (favorites[a.id] ? favorites[a.id] : 0));
    return items;
  }, [filter, query, sort, favorites, showOnlyFavs]);

  const visible = list.slice(0, limit);

  function toggleFav(id) {
    setFavorites((prev) => {
      const next = { ...prev, [id]: prev[id] ? prev[id] + 1 : 1 };
      // allow un-faving by removing key if already >0? we keep counts for 'likes'
      return next;
    });
  }

  function removeFav(id) {
    setFavorites((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function downloadImage(url, suggestedName) {
    // attempt fetch + blob download; fallback open in new tab
    fetch(url, { mode: "cors" })
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.blob();
      })
      .then((blob) => {
        const obj = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = obj;
        a.download = suggestedName || "image.jpg";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(obj);
      })
      .catch(() => {
        window.open(url, "_blank", "noopener");
      });
  }

  function shareProject(p) {
    const url = p.moodboard || p.src;
    if (navigator.share) {
      navigator
        .share({
          title: p.title,
          text: p.excerpt,
          url,
        })
        .catch(() => {});
    } else {
      // fallback copy url
      navigator.clipboard?.writeText(url).then(() => alert("Link copied to clipboard"));
    }
  }

  async function exportProjectPdf(project) {
    // dynamic import: if you installed html2canvas & jspdf, this will be fast; otherwise browser fetch may be slower
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      // create a small node with project details to render
      const node = document.createElement("div");
      node.style.width = "1200px";
      node.style.padding = "24px";
      node.style.background = "white";
      node.style.color = "#111";
      node.innerHTML = `
        <h1 style="font-family:Helvetica,Arial,sans-serif">${project.title}</h1>
        <p style="font-family:Helvetica,Arial,sans-serif">${project.excerpt}</p>
        <div style="margin-top:8px"><img src="${project.src}" style="max-width:100%;height:auto" /></div>
        <h3 style="font-family:Helvetica,Arial,sans-serif">Description</h3>
        <p style="font-family:Helvetica,Arial,sans-serif">${project.description}</p>
      `;
      document.body.appendChild(node);
      const canvas = await html2canvas(node, { scale: 1.5, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      // fit width
      const ratio = canvas.width / canvas.height;
      const imgWidth = pageWidth - 40;
      const imgHeight = imgWidth / ratio;
      pdf.addImage(imgData, "JPEG", 20, 20, imgWidth, imgHeight);
      pdf.save(`${project.title.replace(/\s+/g, "-")}.pdf`);
      node.remove();
    } catch (err) {
      console.error(err);
      alert(
        "PDF export requires html2canvas + jspdf. Install them with `npm i html2canvas jspdf` or use the fallback Download Image button."
      );
    }
  }

  // keyboard close for lightbox
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-extrabold">Gallery Pro — Interior Projects (30)</h2>

        <div className="flex gap-2 items-center flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, excerpt, tags..."
            className="px-3 py-2 rounded-md border text-sm"
            aria-label="Search projects"
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border rounded-md text-sm">
            <option value="none">Sort</option>
            <option value="az">A → Z</option>
            <option value="likes">Most liked</option>
          </select>

          <button
            onClick={() => {
              setShowOnlyFavs((s) => !s);
            }}
            className={`px-3 py-2 rounded-full border text-sm ${showOnlyFavs ? "bg-pink-600 text-white" : ""}`}
            aria-pressed={showOnlyFavs}
          >
            {showOnlyFavs ? "Showing favorites" : "Show favorites"}
          </button>
        </div>
      </div>

      {/* masonry */}
      <div className="gallery-masonry" style={{ columnGap: 20, columnCount: 1 }}>
        <style>{`
          @media (min-width: 640px) { .gallery-masonry { column-count: 2 } }
          @media (min-width: 1024px) { .gallery-masonry { column-count: 3 } }
          .gallery-item { break-inside: avoid; margin-bottom: 20px; display: inline-block; width: 100%; }
        `}</style>

        {visible.map((p) => (
          <article key={p.id} className="gallery-item rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="relative" role="button" tabIndex={0} onClick={() => setLightbox(p)} onKeyDown={(e) => e.key === "Enter" && setLightbox(p)}>
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                style={{ height: 260, width: "100%", objectFit: "cover" }}
                className="w-full transition-transform duration-500 group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/1200x800.png?text=Image+missing")}
              />
              <div className="absolute left-0 bottom-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <div className="text-xs opacity-90">{p.category} • {p.tags.join(", ")}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(p.id);
                      }}
                      title="Like / Favorite"
                      className="px-2 py-1 rounded-full bg-white/10 backdrop-blur text-white text-xs"
                      aria-label={`Favorite ${p.title}`}
                    >
                      ♥ {favorites[p.id] ? favorites[p.id] : 0}
                    </button>

                    <div className="text-xs text-white/90">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(p.src, `${p.title.replace(/\s+/g, "-")}.jpg`);
                        }}
                        className="px-2 py-1 rounded-full bg-white/10"
                        title="Download image"
                      >
                        ⤓
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-700 mb-3">{p.excerpt}</p>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                {(p.tags || []).map((t) => (
                  <span key={t} className="px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded-full border">{t}</span>
                ))}
                {(p.materials || []).slice(0, 3).map((m) => (
                  <span key={m} className="px-2 py-1 text-xs bg-slate-50 text-slate-800 rounded-full border">{m}</span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button onClick={() => setLightbox(p)} className="px-3 py-1 rounded-full bg-pink-600 text-white text-sm">View</button>
                  <button onClick={() => window.open(p.moodboard, "_blank", "noopener")} className="px-3 py-1 rounded-full border text-sm">Moodboard</button>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => shareProject(p)} className="px-3 py-1 rounded-full border text-sm">Share</button>
                  <button onClick={() => exportProjectPdf(p)} className="px-3 py-1 rounded-full border text-sm">Export PDF</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* load more */}
      <div className="mt-6 text-center">
        {limit < list.length ? (
          <button onClick={() => setLimit((l) => l + 9)} className="px-6 py-3 rounded-full bg-pink-600 text-white">Load more</button>
        ) : (
          list.length > 9 && <button onClick={() => setLimit(9)} className="px-6 py-3 rounded-full border">Show less</button>
        )}
      </div>

      {/* lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`${lightbox.title} details`}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setLightbox(null)} />

          <div className="relative max-w-6xl w-full grid md:grid-cols-2 gap-4 bg-white rounded-xl overflow-hidden shadow-2xl z-10">
            <div className="bg-black flex items-center justify-center">
              <img src={lightbox.src} alt={lightbox.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/1200x800.png?text=Image+missing")} />
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">{lightbox.title}</h3>
                  <div className="text-sm text-gray-500 mt-1">{lightbox.category} • {lightbox.tags.join(", ")}</div>
                </div>

                <div className="flex gap-2 items-start">
                  <button onClick={() => { shareProject(lightbox); }} className="px-3 py-1 rounded-full border text-sm">Share</button>
                  <button onClick={() => downloadImage(lightbox.src, `${lightbox.title.replace(/\s+/g, "-")}.jpg`)} className="px-3 py-1 rounded-full border text-sm">Download</button>
                  <button onClick={() => exportProjectPdf(lightbox)} className="px-3 py-1 rounded-full border text-sm">Export PDF</button>
                  <button onClick={() => setLightbox(null)} className="px-3 py-1 rounded-full border text-sm">Close</button>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{lightbox.description}</p>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-800 mb-2">Materials</div>
                <div className="flex gap-2 flex-wrap">
                  {lightbox.materials.map((m) => (
                    <span key={m} className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs border">{m}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium text-gray-800 mb-2">Palette</div>
                <div className="flex gap-2 items-center">
                  {lightbox.colors.map((c, i) => (
                    <div key={i} className="w-10 h-10 rounded-md border" style={{ background: c }} title={c} />
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <a href={lightbox.moodboard} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md border text-sm">Open moodboard</a>
                <button onClick={() => { navigator.clipboard?.writeText(`${lightbox.title}\n\n${lightbox.description}`); alert("Project description copied to clipboard"); }} className="px-4 py-2 rounded-md border text-sm">Copy description</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
