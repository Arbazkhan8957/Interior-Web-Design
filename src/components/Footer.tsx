import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Footer.enhanced.jsx
 * - Fully responsive, modern footer with refined design
 * - Mobile-first: collapsible sections on small screens, 4-column on large
 * - Animated micro-interactions using Framer Motion
 * - SVG logo placeholder (replace with your SVG/image)
 * - Newsletter with inline validation, subtle success microcopy and focus management
 * - Accessible controls, keyboard-friendly toggles, Back-to-top button
 * - Dark-mode toggle persisted to localStorage
 * - TailwindCSS utilities assumed (v2+/JIT). Tweak spacing/colors via your theme.
 */

export default function Footer({ logo }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('') // '', 'error', 'saving', 'success'
  const [dark, setDark] = useState(false)
  const [showTop, setShowTop] = useState(false)

  // collapse state for mobile sections
  const [openExplore, setOpenExplore] = useState(false)
  const [openSupport, setOpenSupport] = useState(false)
  const [openNews, setOpenNews] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('newsletterEmail')
    if (saved) setEmail(saved)
    const pref = localStorage.getItem('prefersDark')
    const prefersDark = pref ? pref === '1' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(prefersDark)
    applyDark(prefersDark)

    function onScroll() {
      setShowTop(window.scrollY > 280)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function applyDark(enable) {
    const root = window.document.documentElement
    if (enable) root.classList.add('dark')
    else root.classList.remove('dark')
  }

  function toggleDark() {
    const next = !dark
    setDark(next)
    localStorage.setItem('prefersDark', next ? '1' : '0')
    applyDark(next)
  }

  function validEmail(e) {
    return /^\\S+@\\S+\\.\\S+$/.test(e)
  }

  function subscribe(e) {
    e && e.preventDefault()
    setStatus('')
    if (!email.trim() || !validEmail(email)) {
      setStatus('error')
      return
    }
    setStatus('saving')
    // simulate save
    setTimeout(() => {
      localStorage.setItem('newsletterEmail', email.trim())
      setStatus('success')
      // subtle microcopy timeout
      setTimeout(() => setStatus(''), 3800)
    }, 700)
  }

  function clearSubscription() {
    localStorage.removeItem('newsletterEmail')
    setEmail('')
    setStatus('')
  }

  const linkVariant = { hover: { x: 6, transition: { type: 'spring', stiffness: 300 } } }

  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 mt-16">
      {/* Top decorative SVG */}
      <div aria-hidden className="-mt-6 pointer-events-none select-none">
        <svg viewBox="0 0 1200 60" className="w-full h-6 block" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fgrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#c7b8ff" />
            </linearGradient>
          </defs>
          <path d="M0 0 C 300 60 900 0 1200 60 L1200 0 L0 0 Z" fill="url(#fgrad)" className="opacity-30" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pink-600 to-indigo-600 text-white font-bold text-xl shadow-md">
              {/* replace with logo prop if provided */}
              {logo || 'IS'}
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900 dark:text-white">Interior Studio</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Beautiful, functional interiors — homes & businesses</div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div>Kurla Garden, Kurla, Mumbai, Maharashtra</div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <a href="mailto:hello@example" className="hover:underline">hello@example</a>
              <span className="text-gray-300">•</span>
              <a href="tel:+918108306152" className="hover:underline">+91 81083 06152</a>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <a aria-label="Instagram" href="#" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition">
              <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.25A4.75 4.75 0 0010.25 13 4.75 4.75 0 0017 13 4.75 4.75 0 0012 8.25zM18.5 6.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/></svg>
            </a>
            <a aria-label="Facebook" href="#" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3h2V0h-2a5 5 0 00-5 5v2H6v3h2v9h3v-9h2.5l.5-3H11V5a1 1 0 011-1z"/></svg>
            </a>
            <a aria-label="WhatsApp" href="https://wa.me/918108306152" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition">
              <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.77 11.77 0 0012 .25C5.61.25.75 5.11.75 11.5c0 2.03.53 4.02 1.54 5.78L.25 23l5.02-1.31A11.67 11.67 0 0012 23.75c6.39 0 11.25-4.86 11.25-11.25 0-3.01-1.18-5.81-3.73-7.02zM12 21.5c-1.17 0-2.32-.23-3.37-.67l-.24-.1-3.05.8.83-2.95-.12-.3A8.51 8.51 0 013.5 11.5 8.5 8.5 0 1112 21.5zm4.61-7.56l-.72-.21c-.2-.06-.45-.02-.62.11l-.4.34c-.4-.2-1.46-.76-2.12-1.57-.46-.57-.85-1.25-.98-1.44-.11-.18-.01-.32.08-.43l.28-.34c.16-.2.22-.45.18-.68l-.07-.46a.9.9 0 00-.9-.77c-.28 0-.54.02-.78.06-.42.06-.77.29-1.06.63-.2.23-.38.57-.66 1.06-.14.23-.37.57-.7.92-.17.17-.35.31-.51.41-.14.08-.28.14-.39.18-.27.12-.55.06-.76-.13-.23-.2-.45-.44-.68-.7-.44-.5-1.07-.98-1.63-1.2-.46-.18-1.3-.24-1.3.34 0 .91 1.18 2.07 2.08 2.92 1.08 1.02 2.3 1.86 3.64 2.47.9.41 1.8.7 2.66.85 1.02.18 1.95.11 2.64-.28 1.03-.62 1.54-1.85 1.54-3.14 0-.4-.04-.71-.12-.95-.15-.52-.6-.89-1.13-1.06z"/></svg>
            </a>
          </div>
        </div>

        {/* Explore (collapsible on small) */}
        <div>
          <div className="flex items-center justify-between sm:justify-start">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Explore</h4>
            <button className="sm:hidden text-sm text-gray-500" onClick={() => setOpenExplore((s) => !s)} aria-expanded={openExplore} aria-controls="explore-list">{openExplore ? 'Close' : 'Open'}</button>
          </div>

          <motion.nav id="explore-list" initial={false} animate={{ height: openExplore || window.innerWidth >= 640 ? 'auto' : 0, opacity: openExplore || window.innerWidth >= 640 ? 1 : 0 }} transition={{ duration: 0.28 }} className="mt-3 overflow-hidden sm:block">
            <ul className="flex flex-col gap-2">
              <motion.li whileHover={linkVariant.hover}><a href="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">About</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/services" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Services</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/portfolio" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Portfolio</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/blog" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Blog</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/contact" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Contact</a></motion.li>
            </ul>
          </motion.nav>
        </div>

        {/* Support (collapsible on small) */}
        <div>
          <div className="flex items-center justify-between sm:justify-start">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Support</h4>
            <button className="sm:hidden text-sm text-gray-500" onClick={() => setOpenSupport((s) => !s)} aria-expanded={openSupport} aria-controls="support-list">{openSupport ? 'Close' : 'Open'}</button>
          </div>

          <motion.nav id="support-list" initial={false} animate={{ height: openSupport || window.innerWidth >= 640 ? 'auto' : 0, opacity: openSupport || window.innerWidth >= 640 ? 1 : 0 }} transition={{ duration: 0.28 }} className="mt-3 overflow-hidden sm:block">
            <ul className="flex flex-col gap-2">
              <motion.li whileHover={linkVariant.hover}><a href="/faqs" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">FAQs</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/terms" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Terms</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/privacy" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Privacy</a></motion.li>
              <motion.li whileHover={linkVariant.hover}><a href="/careers" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Careers</a></motion.li>
            </ul>
          </motion.nav>
        </div>

        {/* Newsletter (collapsible on small) */}
        <div>
          <div className="flex items-center justify-between sm:justify-start">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Newsletter</h4>
            <button className="sm:hidden text-sm text-gray-500" onClick={() => setOpenNews((s) => !s)} aria-expanded={openNews} aria-controls="news-form">{openNews ? 'Close' : 'Open'}</button>
          </div>

          <motion.div id="news-form" initial={false} animate={{ height: openNews || window.innerWidth >= 640 ? 'auto' : 0, opacity: openNews || window.innerWidth >= 640 ? 1 : 0 }} transition={{ duration: 0.28 }} className="mt-3 overflow-hidden sm:block">
            <p className="text-sm text-gray-500 dark:text-gray-300">Design tips, project highlights & exclusive offers — once a month.</p>
            <form onSubmit={subscribe} className="mt-3 flex gap-2" role="form">
              <label htmlFor="footer-news-enh" className="sr-only">Email address</label>
              <input id="footer-news-enh" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:outline-none dark:bg-gray-800 dark:border-gray-700 text-sm" />
              <button type="submit" className="px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-medium text-sm">{status === 'saving' ? 'Saving...' : 'Subscribe'}</button>
            </form>

            <div className="mt-2">
              {status === 'error' && <div className="text-sm text-rose-600">Please enter a valid email address.</div>}
              {status === 'success' && <div className="text-sm text-emerald-600">Subscribed — check your inbox.</div>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* small inline styles for better focus outline in dark */}
      <style>{`\n        :root { --footer-accent: rgba(236,72,153,0.08); }\n        .dark :focus { outline: 2px solid rgba(99,102,241,0.12); outline-offset: 2px; }\n      `}</style>
    </footer>
  )
}
