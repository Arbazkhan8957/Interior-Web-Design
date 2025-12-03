// Navbar.jsx — responsive mobile overlay + scroll lock + focus handling
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("authUser") || "null");
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const firstLinkRef = useRef(null);

  function logout() {
    localStorage.removeItem("authUser");
    navigate("/login");
    setOpen(false);
  }

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Portfolio" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
  ];

  const activeClass =
    "text-pink-600 underline decoration-pink-300 decoration-2 underline-offset-4";

  // lock page scroll when mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
      // focus first link for keyboard users
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  // close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header-gradient sticky top-0 z-40 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span
            className="inline-flex p-2 rounded-lg bg-white shadow-sm"
            aria-hidden
            style={{ width: 44, height: 44 }}
          >
            <svg viewBox="0 0 48 48" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#fda4af" />
                  <stop offset="1" stopColor="#fef3c7" />
                </linearGradient>
              </defs>
              <rect rx="10" width="48" height="48" fill="url(#g)" />
              <path d="M12 30 L24 14 L36 30 Z" fill="#fff" opacity="0.95" />
            </svg>
          </span>
          <span className="text-2xl font-bold leading-none">
            Interior<span className="text-pink-600">Design</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 ml-6">
          {navItems.map((item) => (
            <NavLink
              to={item.to}
              key={item.to}
              className={({ isActive }) =>
                `text-gray-700 hover:text-pink-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-200 rounded px-1 ${
                  isActive ? activeClass : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth / Actions (desktop) */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:border-pink-200 transition"
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm shadow-sm hover:opacity-95 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-gray-200 text-sm hover:border-pink-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm shadow-sm hover:opacity-95 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
          >
            <span className="sr-only">Toggle menu</span>
            {!open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY PANEL */}
      {/* Use a fixed overlay that covers the page. It slides + fades for a nice effect. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* panel content */}
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md sm:max-w-lg bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <span className="inline-flex p-2 rounded bg-white shadow-sm" style={{ width: 40, height: 40 }} aria-hidden>
                  <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                    <defs><linearGradient id="g2" x1="0" x2="1"><stop offset="0" stopColor="#fda4af"/><stop offset="1" stopColor="#fef3c7"/></linearGradient></defs>
                    <rect rx="10" width="48" height="48" fill="url(#g2)"/><path d="M12 30 L24 14 L36 30 Z" fill="#fff" opacity="0.95"/>
                  </svg>
                </span>
                <span className="text-lg font-bold">Interior<span className="text-pink-600">Design</span></span>
              </Link>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M6 18L18 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* nav links — first link gets a ref for focus */}
            <nav className="flex-1 overflow-auto">
              <ul className="space-y-2">
                {navItems.map((item, idx) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setOpen(false)}
                      ref={idx === 0 ? firstLinkRef : null}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-md text-gray-800 dark:text-slate-100 hover:bg-pink-50 dark:hover:bg-slate-800 transition ${
                          isActive ? "font-semibold text-pink-600 bg-pink-50 dark:bg-slate-800/60" : ""
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* auth + small footer */}
            <div className="pt-4 border-t dark:border-slate-700 mt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md border text-center">
                    {user.name}
                  </Link>
                  <button onClick={logout} className="w-full px-4 py-3 rounded-md bg-pink-600 text-white">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md border text-center">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-md bg-pink-600 text-white text-center">
                    Register
                  </Link>
                </div>
              )}

              <div className="pt-3 text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} Interior Studio
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
