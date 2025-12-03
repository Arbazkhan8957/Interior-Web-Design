// postsData.js
// Central posts data used by Blog and Post components.
//
// Notes:
// - If you serve images from the public folder, prefer: /images/your-file.jpg
// - encodeURI used to escape spaces / special chars in paths (so "/My Image.jpg" -> "/My%20Image.jpg")
// - You can replace image paths with absolute URLs (https://...) if you host externally.

function safeImagePath(path) {
  if (!path) return "";
  // If it's already an absolute URL, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  // If it starts with a slash (public folder), encode it
  if (path.startsWith("/")) return encodeURI(path);
  // Otherwise, return as-is (relative)
  return encodeURI(path);
}

export const postsArray = [
  {
    id: 1,
    title: "Top 10 Living Room Trends in 2025",
    date: "2025-06-14",
    category: "Inspiration",
    tags: ["trends", "living room", "inspo"],
    minutes: 4,
    excerpt:
      "A quick look at what's trending this year. Expect texture, warm neutrals, and multi-functional furniture.",
    body:
      "# Trends overview\nA quick intro paragraph about living room trends.\n\n## Texture and layering\nHow to use textures.\n\n## Warm neutrals\nWhy warm neutrals are in.\n\n## Multi-functional furniture\nTips for furniture that works harder.\n",
    image: "src/assets/images/Top 10 Living Room Trends in 2025.jpg",
  },
  {
    id: 2,
    title: "Small Bedroom Styling Tips",
    date: "2025-04-02",
    category: "How-to",
    tags: ["bedroom", "small spaces", "styling"],
    minutes: 3,
    excerpt:
      "Make a small space feel luxurious with these tips. Use vertical storage and layered lighting to add depth.",
    body:
      "# Make small feel big\nIntro about small bedroom styling.\n\n## Vertical storage\nUse tall wardrobes, shelves.\n\n## Layered lighting\nCombine ambient, task, accent light.\n",
    image: "src/assets/images/Small Bedroom Styling Tips.jpg",
  },
  {
    id: 3,
    title: "Choosing the Right Lighting",
    date: "2025-01-30",
    category: "How-to",
    tags: ["lighting", "design", "mood"],
    minutes: 5,
    excerpt:
      "How lighting transforms mood and function. Learn when to use warm vs cool light and how to layer sources.",
    body:
      "# Lighting basics\nWhy lighting matters.\n\n## Warm vs cool\nWhen to pick warm or cool light.\n\n## Layering sources\nAmbient, task, accent and examples.\n",
    image: "src/assets/images/Choosing the Right Lighting.jpg",
  },
  {
    id: 4,
    title: "Budget-Friendly Kitchen Upgrades",
    date: "2025-08-12",
    category: "Practical",
    tags: ["kitchen", "budget", "upgrades"],
    minutes: 6,
    excerpt:
      "Small changes with big impact for kitchens on a budget. Swap handles, add undercabinet lighting, and refresh splashbacks.",
    body:
      "# Kitchen upgrades\nSmall changes with big impact.\n\n## Handles & hardware\nSwap for fresh look.\n",
    image: "src/assets/images/Budget-Friendly Kitchen Upgrades.jpg",
  },
  {
    id: 5,
    title: "Creating a Pet-Friendly Home",
    date: "2025-03-22",
    category: "Lifestyle",
    tags: ["pets", "durable", "practical"],
    minutes: 4,
    excerpt:
      "Design choices that keep your design and pets happy. Choose washable textiles and designate a pet nook.",
    body:
      "# Pets at home\nChoose washable textiles and designate a pet nook.\n",
    image: "src/assets/images/Creating a Pet-Friendly Home.jpg",
  },
  {
    id: 6,
    title: "Layering Textures Like a Pro",
    date: "2025-02-11",
    category: "Inspiration",
    tags: ["textures", "materials", "tips"],
    minutes: 5,
    excerpt:
      "Learn to combine fabrics, woods and metals without overwhelming a room. Start with a neutral base, then add contrast.",
    body:
      "# Textures\nCombine fabrics, woods and metals.\n",
    image: "src/assets/images/Layering Textures Like a Pro.jpg",
  },
  {
    id: 7,
    title: "Compact Home Office Ideas",
    date: "2025-05-07",
    category: "How-to",
    tags: ["home office", "productivity", "small spaces"],
    minutes: 4,
    excerpt:
      "Small footprint, big productivity: clever desks, vertical storage and hideaway tech solutions for focused work.",
    body:
      "# Home office\nClever desks, vertical storage and hideaway tech.\n",
    image: "src/assets/images/Compact Home Office Ideas.jpg",
  },
  {
    id: 8,
    title: "Sustainable Materials That Look Great",
    date: "2025-07-19",
    category: "Lifestyle",
    tags: ["sustainable", "materials", "eco"],
    minutes: 6,
    excerpt:
      "Explore eco-friendly choices — cork, reclaimed wood, and low-VOC finishes — that don't sacrifice style.",
    body:
      "# Sustainable materials\nCork, reclaimed wood, low-VOC finishes.\n",
    image: "src/assets/images/Sustainable Materials That Look Great.jpeg",
  },
  {
    id: 9,
    title: "Bold Accent Walls Without Regret",
    date: "2025-09-05",
    category: "Inspiration",
    tags: ["color", "paint", "accent"],
    minutes: 3,
    excerpt:
      "How to pick colors and finishes for an accent wall that enhances flow and keeps resale value in mind.",
    body:
      "# Accent walls\nPick colors & finishes thoughtfully.\n",
    image: "src/assets/images/Bold Accent Walls Without Regret.jpg",
  },
  {
    id: 10,
    title: "Entryway Styling: First Impressions",
    date: "2025-10-02",
    category: "Practical",
    tags: ["entryway", "organization", "decor"],
    minutes: 3,
    excerpt:
      "Make your entry welcoming and functional with a tidy drop zone, a statement mirror and layered lighting.",
    body:
      "# Entryway\nTidy drop zone, a statement mirror and layered lighting.\n",
    image: "src/assets/images/Entryway Styling First Impressions.jpg",
  },
  {
    id: 11,
    title: "Outdoor Living: Tiny Patio Upgrades",
    date: "2025-11-11",
    category: "Lifestyle",
    tags: ["outdoor", "patio", "balcony"],
    minutes: 4,
    excerpt:
      "Extend living space outdoors with folding furniture, planters and smart lighting — perfect for city balconies.",
    body: "# Patio\nFolding furniture, planters and smart lighting.\n",
    image: "src/assets/images/Outdoor Living Tiny Patio Upgrades.jpg",
  },
  {
    id: 12,
    title: "Timeless Flooring Options",
    date: "2025-12-01",
    category: "Practical",
    tags: ["flooring", "materials", "buying guide"],
    minutes: 7,
    excerpt:
      "Compare engineered hardwood, luxury vinyl and polished concrete — what works best for traffic, budget and look.",
    body: "# Flooring\nEngineered hardwood, luxury vinyl, polished concrete.\n",
    image: "src/assets/images/Timeless Flooring Options.jpg",
  },
  {
    id: 13,
    title: "Minimalist Decor: Doing More With Less",
    date: "2024-11-10",
    category: "Inspiration",
    tags: ["minimalism", "decor"],
    minutes: 4,
    excerpt: "Minimalist principles to keep spaces calm and functional.",
    body: "# Minimalist\nPrinciples and practical tips.\n",
    image: "src/assets/images/Minimalist Decor Doing More With Less.jpg",
  },
  {
    id: 14,
    title: "Kitchen Storage Hacks You Need",
    date: "2025-02-20",
    category: "Practical",
    tags: ["kitchen", "organization"],
    minutes: 5,
    excerpt: "Smart pull-outs, corner solutions and clever pantry ideas.",
    body: "# Kitchen storage\nPull-outs, lazy susans and organizers.\n",
    image: "src/assets/images/Kitchen Storage Hacks You Need.jpg",
  },
  {
    id: 15,
    title: "Window Treatments That Transform",
    date: "2025-03-30",
    category: "How-to",
    tags: ["windows", "textiles"],
    minutes: 4,
    excerpt: "Blinds, curtains and shades that balance light and privacy.",
    body: "# Windows\nSelecting the right treatments.\n",
    image: "src/assets/images/Window Treatments That Transform.jpg",
  },
  {
    id: 16,
    title: "Gallery Wall Layouts That Work",
    date: "2025-04-22",
    category: "Inspiration",
    tags: ["art", "walls"],
    minutes: 3,
    excerpt: "Harmonious layouts that scale to your wall size.",
    body: "# Gallery wall\nLayouts and tips.\n",
    image: "src/assets/images/Gallery Wall Layouts That Work'.jpeg",
  },
  {
    id: 17,
    title: "Smart Home Basics for Beginners",
    date: "2025-05-15",
    category: "Practical",
    tags: ["smart home", "tech"],
    minutes: 6,
    excerpt: "Start small: smart bulbs, plugs and voice assistants.",
    body: "# Smart home\nBulbs, plugs, assistants.\n",
    image: "src/assets/images/Smart Home Basics for Beginners.jpeg",
  },
  {
    id: 18,
    title: "Decorating on a Student Budget",
    date: "2025-06-01",
    category: "Lifestyle",
    tags: ["budget", "student"],
    minutes: 3,
    excerpt: "Affordable hacks to make a student room feel like home.",
    body: "# Student decor\nAffordable ideas.\n",
    image: "src/assets/images/Decorating on a Student Budget.png",
  },
].map((p) => {
  // normalize / computed fields
  return {
    ...p,
    date: p.date, // keep original string for display; Blog.jsx sorts by Date() already
    category: p.category || "Uncategorized",
    imageSrc: safeImagePath(p.image || ""),
  };
});

export const postsById = postsArray.reduce((acc, p) => {
  acc[String(p.id)] = p;
  return acc;
}, {});
