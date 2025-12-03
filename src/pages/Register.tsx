// Register.animated.jsx
// TailwindCSS + Framer Motion powered
// Matches the Login.animated.jsx visual style and behavior

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export default function RegisterAnimated() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    // if already logged in, go to dashboard
    if (localStorage.getItem("authUser")) {
      navigate("/dashboard", { replace: true });
    } else {
      setTimeout(() => nameRef.current?.focus(), 80);
    }
  }, [navigate]);

  function passwordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // 0..4
  }
  const strength = passwordStrength(password);
  const strengthLabel = ["Very weak", "Weak", "Okay", "Strong", "Very strong"][strength];

  function validate() {
    setError("");
    setMsg("");
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill all fields.");
      return false;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function submit(e) {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.find((u) => u.email === email.trim())) {
        setError("User already exists. Please login.");
        setLoading(false);
        return;
      }
      const newUser = { name: name.trim(), email: email.trim(), password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("authUser", JSON.stringify({ name: newUser.name, email: newUser.email }));
      setMsg("Account created — redirecting...");
      setLoading(false);
      setTimeout(() => navigate("/dashboard"), 600);
    }, 500);
  }

  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cardVariant = reduced
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18, scale: 0.995 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.2, 0.9, 0.2, 1] } } };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <svg className="absolute -left-20 -top-20 w-72 h-72 opacity-8 hidden md:block" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="lg1r" x1="0" x2="1"><stop offset="0" stopColor="#fbcfe8"/><stop offset="1" stopColor="#fda4af"/></linearGradient>
          </defs>
          <path fill="url(#lg1r)" d="M42.8,-57.1C55.6,-45.5,65.8,-33.3,69.1,-18.4C72.4,-3.5,68.7,13,60.9,26.2C53.1,39.4,41.3,49.3,27.8,57.1C14.3,64.9,-0.9,70.5,-16.6,69.6C-32.3,68.6,-48.4,61.1,-59.8,48.6C-71.1,36.1,-77.7,18.1,-77.8,-0.3C-77.9,-18.7,-71.4,-37.4,-59.2,-49.5C-47.1,-61.6,-29.3,-67.1,-12.4,-61.8C4.6,-56.4,9.9,-40.6,42.8,-57.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <motion.div className="w-full max-w-4xl mx-auto" variants={cardVariant} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left illustration (large screens) */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-white/70 to-indigo-50/40 border border-gray-100 shadow-xl">
              <svg viewBox="0 0 800 600" className="w-full h-auto" role="img" aria-label="Study illustration">
                <defs>
                  <linearGradient id="rg1" x1="0" x2="1"><stop offset="0%" stopColor="#bfdbfe"/><stop offset="100%" stopColor="#93c5fd"/></linearGradient>
                </defs>
                <rect width="100%" height="100%" rx="16" fill="url(#rg1)" />
                <g transform="translate(70,60)">
                  <rect x="14" y="14" width="420" height="220" rx="10" fill="#fff" opacity="0.95" />
                  <circle cx="70" cy="110" r="36" fill="#a78bfa" />
                </g>
              </svg>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-6">
            <motion.div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8" layout>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <h2 className="text-2xl font-extrabold">Create your account</h2>
                  <p className="text-sm text-gray-500">Fast — secure — friendly</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4" aria-live="polite">
                <FloatingInput id="reg-name" label="Full name" value={name} onChange={(v) => setName(v)} inputRef={nameRef} placeholder="John Doe" />
                <FloatingInput id="reg-email" label="Email address" value={email} onChange={(v) => setEmail(v)} type="email" placeholder="you@example.com" autoComplete="email" />

                <div className="relative">
                  <FloatingInput
                    id="reg-password"
                    label="Password"
                    value={password}
                    onChange={(v) => setPassword(v)}
                    type={showPwd ? "text" : "password"}
                    placeholder="Create a password"
                    rightElement={
                      <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
                        {showPwd ? "Hide" : "Show"}
                      </button>
                    }
                  />

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-400">{password ? strengthLabel : `At least ${MIN_PASSWORD_LENGTH} characters`}</span>
                    <span className="text-gray-400">Strength</span>
                  </div>

                  <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden" aria-hidden>
                    <div
                      style={{ width: `${(strength / 4) * 100}%` }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>

                <FloatingInput id="reg-confirm" label="Confirm password" value={confirm} onChange={(v) => setConfirm(v)} type={showPwd ? "text" : "password"} placeholder="Re-enter password" />

                <div aria-live="polite" className="min-h-[1.25rem]">
                  {error ? <div className="text-sm text-red-600">{error}</div> : msg ? <div className="text-sm text-green-700">{msg}</div> : null}
                </div>

                <motion.button
                  whileTap={{ scale: 0.985 }}
                  whileHover={!reduced ? { scale: 1.02 } : {}}
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-1 py-3 rounded-full text-white font-semibold shadow-md ${loading ? "bg-indigo-300 cursor-wait" : "bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700"}`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.25" /><path d="M22 12a10 10 0 00-10-10" strokeWidth="3" /></svg>}
                    <span>{loading ? "Creating..." : "Create account"}</span>
                  </div>
                </motion.button>

                <div className="text-center text-sm text-gray-500">Already have an account? <button type="button" onClick={() => navigate("/login")} className="text-indigo-600 font-semibold underline">Sign in</button></div>
              </form>
            </motion.div>

            <div className="mt-6 text-xs text-center text-gray-400">© {new Date().getFullYear()} — Study Buddy</div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-blob { animation: blob 8s ease-in-out infinite; }
          @keyframes blob {
            0% { transform: translateY(0) scale(1); }
            33% { transform: translateY(-10px) scale(1.05); }
            66% { transform: translateY(6px) scale(0.98); }
            100% { transform: translateY(0) scale(1); }
          }
        }
      `}</style>
    </div>
  );
}

/* FloatingInput: reused from Login.animated.jsx style — floating label style */
function FloatingInput({ id, label, value, onChange, type = "text", inputRef, placeholder = "", autoComplete = "", rightElement = null }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 bg-white ${focused ? "ring-2 ring-indigo-200" : "ring-0"}`}>
        <input
          id={id}
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none py-3 text-sm text-gray-900 placeholder-gray-400"
          aria-label={label}
        />
        {rightElement && <div className="ml-2">{rightElement}</div>}
      </div>
      <label htmlFor={id} className={`pointer-events-none absolute left-4 top-0 transform -translate-y-1/2 text-xs transition-all ${value ? "text-indigo-600 font-medium" : "text-gray-500"}`}>{label}</label>
    </div>
  );
}
