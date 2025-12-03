import React, { useEffect, useRef, useState } from "react";

/**
 * Polished About.jsx
 * - Proper alignment & spacing across breakpoints
 * - IntersectionObserver reveal for sections
 * - Testimonials carousel (autoplay, pause on hover/focus, keyboard)
 * - FAQ accordion (aria-friendly)
 * - Contact form & Newsletter saved to localStorage
 * - Brochure download (text blob)
 * - Embedded Google Maps iframe centered on "Kurla Garden, Mumbai"
 *
 * Notes:
 * - Ensure your images exist at /public/<name>.png (e.g. public/bedroom.png)
 * - Tailwind classes assumed (dark: styles included)
 */

const TESTIMONIALS = [
  { id: 1, name: "R. Mehta", role: "Homeowner", text: "We loved the attention to detail and practical storage solutions." },
  { id: 2, name: "K. Singh", role: "Cafe Owner", text: "The concept matched our brand perfectly — customers notice the difference." },
  { id: 3, name: "S. Roy", role: "Studio Owner", text: "Professional, timely and the visuals were spot-on." },
];

const FAQS = [
  { q: "What is your design process?", a: "Discovery → Concept → Documentation → Procurement → Installation" },
  { q: "Do you provide budgeting?", a: "Yes — we prepare a costed sourcing plan for approval." },
  { q: "Can you work remotely?", a: "Yes — concept work & visualization can be remote; site visits scheduled as required." },
];

export default function About() {
  // reveal observer
  const revealRef = useRef(null);
  useEffect(() => {
    const root = revealRef.current || document;
    const els = root.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // testimonials carousel
  const [tIndex, setTIndex] = useState(0);
  const [tPaused, setTPaused] = useState(false);
  useEffect(() => {
    if (tPaused) return;
    const id = setInterval(() => setTIndex((i) => (i + 1) % TESTIMONIALS.length), 4200);
    return () => clearInterval(id);
  }, [tPaused]);

  // contact form
  const [lead, setLead] = useState({ name: "", email: "", phone: "", message: "" });
  const [leadMsg, setLeadMsg] = useState("");
  function handleLead(e) {
    e.preventDefault();
    if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || !lead.message) {
      setLeadMsg("Please enter name, valid email and a short message.");
      return;
    }
    const leads = JSON.parse(localStorage.getItem("leads") || "[]");
    leads.unshift({ ...lead, date: new Date().toISOString() });
    localStorage.setItem("leads", JSON.stringify(leads));
    setLeadMsg("Thanks — we received your request and will contact you soon.");
    setLead({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setLeadMsg(""), 4500);
  }

  // newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  function handleNewsletter(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      setNewsletterMsg("Enter a valid email.");
      return;
    }
    const list = JSON.parse(localStorage.getItem("newsletter") || "[]");
    if (list.includes(newsletterEmail)) {
      setNewsletterMsg("You're already subscribed.");
      return;
    }
    list.push(newsletterEmail);
    localStorage.setItem("newsletter", JSON.stringify(list));
    setNewsletterMsg("Thanks — you're subscribed!");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterMsg(""), 4000);
  }

  // brochure download
  function downloadBrochure() {
    const content = `Interior Studio — Brochure

We design warm, functional and personal interiors.

Services:
- Full interior design
- 3D visualization
- Procurement & styling
- Project management

Contact: hello@interiorstudio.example
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "InteriorStudio-Brochure.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // FAQ toggle
  const [openFAQ, setOpenFAQ] = useState(null);

  // smooth scroll helper
  function jumpTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50/40 dark:from-slate-900 dark:to-slate-950">
      <div ref={revealRef} className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* HERO */}
        <section className="grid gap-8 md:grid-cols-2 items-center reveal">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wide mb-3">
              About Interior Studio
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              We design interiors that feel{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-amber-400">
                warm, functional
              </span>{" "}
              and deeply personal.
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Interior Studio is a boutique design practice specialising in homes, cafés, studios and workspaces.
              We combine thoughtful layouts, smart storage and layered materials to create beautiful, usable spaces.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => jumpTo("contact")}
                className="px-5 py-3 rounded-full bg-pink-600 text-white font-semibold shadow"
              >
                Get a quote
              </button>
              <button
                onClick={() => jumpTo("journey")}
                className="px-5 py-3 rounded-full border"
              >
                Our journey
              </button>
              <button onClick={downloadBrochure} className="px-4 py-2 rounded-full border bg-white">
                Download brochure
              </button>
            </div>
          </div>

          <div className="relative reveal">
            <div className="absolute -inset-2 bg-gradient-to-tr from-pink-200 via-yellow-100 to-sky-100 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-pink-100/80 dark:border-slate-700">
              <div
                className="h-56 md:h-64 bg-cover bg-center"
                style={{ backgroundImage: "url('src/assets/images/bedroom.png')" }}
                role="img"
                aria-label="Calm bedroom concept"
              />
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Calm Bedroom Concept</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Soft textures, neutral tones and hidden storage designed for everyday comfort.</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Residential</span>
                  <span>2025 • Mumbai</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO WE ARE + STATS + SIDE */}
        <section className="grid lg:grid-cols-3 gap-6 reveal">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 shadow-md rounded-2xl p-7 md:p-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Who we are</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We are a small, detail-obsessed team of interior designers, 3D visualisers and project managers.
              From moodboard to final styling, we guide every step — layout, materials, sourcing, lighting, and execution.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-pink-50 dark:border-slate-800 text-center">
                <div className="text-3xl font-bold text-pink-600">150+</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Projects delivered</div>
              </div>
              <div className="p-4 rounded-xl border border-pink-50 dark:border-slate-800 text-center">
                <div className="text-3xl font-bold text-pink-600">10</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Years in practice</div>
              </div>
              <div className="p-4 rounded-xl border border-pink-50 dark:border-slate-800 text-center">
                <div className="text-3xl font-bold text-pink-600">98%</div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Client satisfaction</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-pink-600 mb-3">How we work</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-pink-100 dark:border-slate-700 p-4">
                  <h4 className="text-sm font-semibold uppercase text-pink-600">Discovery</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">We measure, photograph and document the space, and set goals & budget.</p>
                </div>
                <div className="rounded-xl border border-pink-100 dark:border-slate-700 p-4">
                  <h4 className="text-sm font-semibold uppercase text-pink-600">Design</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Layouts, moodboards and 3D renders let you visualize the final look before execution.</p>
                </div>
                <div className="rounded-xl border border-pink-100 dark:border-slate-700 p-4">
                  <h4 className="text-sm font-semibold uppercase text-pink-600">Execute</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Procurement, supervision and final styling until handover.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Testimonials + newsletter */}
          <aside className="bg-white dark:bg-slate-900 shadow-md rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold">Client feedback</h3>

            <div
              onMouseEnter={() => setTPaused(true)}
              onMouseLeave={() => setTPaused(false)}
              onFocus={() => setTPaused(true)}
              onBlur={() => setTPaused(false)}
              tabIndex={0}
              aria-roledescription="carousel"
              className="relative"
            >
              <blockquote className="text-gray-700 dark:text-gray-200 min-h-[88px]">
                “{TESTIMONIALS[tIndex].text}”
                <footer className="mt-3 text-sm text-gray-500 dark:text-gray-400">— {TESTIMONIALS[tIndex].name}, <span className="text-xs">{TESTIMONIALS[tIndex].role}</span></footer>
              </blockquote>

              <div className="flex items-center justify-between gap-2 mt-4">
                <div className="flex gap-2 items-center">
                  {TESTIMONIALS.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => setTIndex(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      className={`w-2 h-2 rounded-full ${i === tIndex ? "bg-pink-600" : "bg-gray-300 dark:bg-slate-700"}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setTIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Previous" className="px-2 py-1 rounded border">‹</button>
                  <button onClick={() => setTIndex(i => (i + 1) % TESTIMONIALS.length)} aria-label="Next" className="px-2 py-1 rounded border">›</button>
                </div>
              </div>
            </div>

            <form onSubmit={handleNewsletter} className="mt-3">
              <label className="text-xs text-gray-600 dark:text-gray-300">Join our newsletter</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 px-3 py-2 rounded border dark:bg-slate-800"
                  aria-label="Email for newsletter"
                />
                <button className="px-2 py-2 rounded bg-pink-600 text-white">Subscribe</button>
              </div>
              {newsletterMsg && <div className="text-xs mt-2 text-green-600">{newsletterMsg}</div>}
            </form>
          </aside>
        </section>

        {/* Journey / Timeline */}
        <section id="journey" className="bg-white dark:bg-slate-900 shadow-md rounded-2xl p-7 md:p-8 reveal">
          <h2 className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-white">Our Journey</h2>
          <ol className="relative border-l border-pink-200 dark:border-slate-700 pl-4 space-y-5">
            <li>
              <div className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full bg-pink-500" />
              <p className="text-xs uppercase text-gray-500 font-semibold">2015</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Studio founded</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Started as a small practice focused on residential interiors and compact apartments.</p>
            </li>
            <li>
              <div className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full bg-pink-500" />
              <p className="text-xs uppercase text-gray-500 font-semibold">2018</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Commercial & café projects</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Expanded into boutique cafés, salons and small workspaces with strong brand-led interiors.</p>
            </li>
            <li>
              <div className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full bg-pink-500" />
              <p className="text-xs uppercase text-gray-500 font-semibold">2021</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">3D visualization & remote design</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Introduced detailed 3D renders and remote consultation services for clients across India.</p>
            </li>
            <li>
              <div className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full bg-pink-500" />
              <p className="text-xs uppercase text-gray-500 font-semibold">Today</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">End-to-end design & execution</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">From concept to handover, we handle planning, sourcing, execution and styling with a dedicated project lead.</p>
            </li>
          </ol>
        </section>

        {/* FAQ + Contact */}
        <section className="grid md:grid-cols-2 gap-6 reveal">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Frequently asked</h3>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <details
                  key={i}
                  open={openFAQ === i}
                  onToggle={e => setOpenFAQ(e.target.open ? i : null)}
                  className="bg-white dark:bg-slate-900 border rounded-xl p-4"
                >
                  <summary className="cursor-pointer font-medium text-gray-800 dark:text-white">{f.q}</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div id="contact" className="bg-white dark:bg-slate-900 shadow-md rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Get in touch</h3>
            <form onSubmit={handleLead} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input aria-label="Name" value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} placeholder="Your name" className="px-3 py-2 rounded border w-full" />
                <input aria-label="Email" value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} placeholder="Email address" className="px-3 py-2 rounded border w-full" />
              </div>
              <input aria-label="Phone" value={lead.phone} onChange={e => setLead({ ...lead, phone: e.target.value })} placeholder="Phone (optional)" className="px-3 py-2 rounded border w-full" />
              <textarea aria-label="Message" value={lead.message} onChange={e => setLead({ ...lead, message: e.target.value })} placeholder="Tell us about your project" className="px-3 py-2 rounded border w-full h-28" />
              <div className="flex items-center gap-3">
                <button type="submit" className="px-5 py-3 rounded bg-pink-600 text-white">Send message</button>
                <button type="button" onClick={() => { setLead({ name: "", email: "", phone: "", message: "" }); setLeadMsg(""); }} className="px-4 py-2 rounded border">Reset</button>
              </div>
              {leadMsg && <div className="text-sm text-green-600 mt-2">{leadMsg}</div>}
            </form>
          </div>
        </section>

        {/* Map + Quick contact */}
        <section className="grid md:grid-cols-3 gap-6 reveal">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Visit / Service area</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">We serve Mumbai and select national projects. For local projects we offer site visits and detailed estimates.</p>

            {/* Google Maps iframe centered on Kurla Garden, Mumbai */}
            <div className="w-full h-64 rounded overflow-hidden border">
              <iframe
                title="Kurla Garden map"
                src="https://www.google.com/maps?q=Kurla+Garden+Mumbai&output=embed"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <aside className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md">
            <h4 className="text-sm font-semibold text-pink-600">Quick contact</h4>
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div>📍 Kurla Garden, Mumbai, India</div>
              <div>📞 +91 8108306152</div>
              <div>✉️ hello@.example</div>
            </div>

            <div className="mt-6">
              <button onClick={() => jumpTo("contact")} className="w-full px-4 py-2 rounded bg-pink-600 text-white">Request visit</button>
            </div>
          </aside>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-pink-600 to-amber-400 text-white p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl reveal">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">Ready to start your project?</h2>
            <p className="mt-2 text-sm md:text-base max-w-xl">Book a free 20-minute discovery call. We’ll understand your space, ideas and budget, and suggest the best way to move forward.</p>
          </div>
          <div className="flex gap-3">
            <a href="/contact" className="px-5 py-3 rounded-full bg-white text-pink-700 font-semibold shadow-md">Contact us</a>
            <a href="/services" className="px-5 py-3 rounded-full border border-white/70 text-white font-semibold">View services</a>
          </div>
        </section>

      </div>
    </div>
  );
}
