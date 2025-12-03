// Login.animated.jsx — Responsive + polished Login matching Register design
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export default function LoginAnimated() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotState, setForgotState] = useState("lookup"); // lookup | reset | done
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotInfo, setForgotInfo] = useState("");

  const emailRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("authUser")) navigate("/dashboard", { replace: true });
    const remembered = localStorage.getItem("rememberEmail");
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
      setTimeout(() => document.getElementById("password")?.focus(), 120);
    } else {
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [navigate]);

  function validate() {
    setError("");
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    return true;
  }

  function submit(e) {
    e.preventDefault();
    if (loading) return;
    setMsg("");
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        setError("Invalid credentials. Please register or check your details.");
        setLoading(false);
        return;
      }

      localStorage.setItem("authUser", JSON.stringify({ name: found.name || "", email: found.email }));
      if (remember) localStorage.setItem("rememberEmail", found.email);
      else localStorage.removeItem("rememberEmail");
      setMsg("Login successful — redirecting...");
      setLoading(false);
      setTimeout(() => navigate("/dashboard"), 550);
    }, 450);
  }

  /* Forgot-password flow (client-side demo) */
  function openForgot() {
    setForgotOpen(true);
    setForgotEmail(email || "");
    setForgotState("lookup");
    setForgotInfo("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => document.getElementById("forgot-email")?.focus(), 90);
  }

  function handleForgotLookup(e) {
    e.preventDefault();
    setForgotInfo("");
    if (!EMAIL_RE.test(forgotEmail.trim())) {
      setForgotInfo("Please enter a valid email.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u) => u.email === forgotEmail.trim());
    if (!found) {
      setForgotInfo("No account found for that email.");
      return;
    }
    setForgotState("reset");
    setForgotInfo("Account found. Enter a new password below.");
    setTimeout(() => document.getElementById("forgot-new")?.focus(), 90);
  }

  function handleForgotReset(e) {
    e.preventDefault();
    setForgotInfo("");
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setForgotInfo(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotInfo("Passwords do not match.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex((u) => u.email === forgotEmail.trim());
    if (idx === -1) {
      setForgotInfo("Unexpected error — account not found.");
      return;
    }
    users[idx].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    setForgotState("done");
    setForgotInfo("Password updated. You can now login with your new password.");
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
            <linearGradient id="lg1" x1="0" x2="1"><stop offset="0" stopColor="#fbcfe8"/><stop offset="1" stopColor="#fda4af"/></linearGradient>
          </defs>
          <path fill="url(#lg1)" d="M42.8,-57.1C55.6,-45.5,65.8,-33.3,69.1,-18.4C72.4,-3.5,68.7,13,60.9,26.2C53.1,39.4,41.3,49.3,27.8,57.1C14.3,64.9,-0.9,70.5,-16.6,69.6C-32.3,68.6,-48.4,61.1,-59.8,48.6C-71.1,36.1,-77.7,18.1,-77.8,-0.3C-77.9,-18.7,-71.4,-37.4,-59.2,-49.5C-47.1,-61.6,-29.3,-67.1,-12.4,-61.8C4.6,-56.4,9.9,-40.6,42.8,-57.1Z" transform="translate(100 100)" />
        </svg>
      </div>

      <motion.div className="w-full max-w-4xl mx-auto" variants={cardVariant} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-white/70 to-pink-50/40 border border-gray-100 shadow-xl">
              {/* Illustration */}
              <svg viewBox="0 0 800 600" className="w-full h-auto" role="img" aria-label="Study illustration">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1"><stop offset="0%" stopColor="#fbcfe8"/><stop offset="100%" stopColor="#fda4af"/></linearGradient>
                </defs>
                <rect width="100%" height="100%" rx="16" fill="url(#g1)" />
                <g transform="translate(80,70)">
                  <rect x="16" y="16" width="420" height="220" rx="10" fill="#fff" opacity="0.95" />
                  <circle cx="70" cy="110" r="36" fill="#fca5a5" />
                </g>
              </svg>
            </div>
          </div>

          <div className="lg:col-span-6">
            <motion.div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8" layout>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-pink-500 flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <h2 className="text-2xl font-extrabold">Welcome back</h2>
                  <p className="text-sm text-gray-500">Sign in to continue to your Interior Design dashboard</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <FloatingInput id="email" label="Email" value={email} onChange={(v) => setEmail(v)} inputRef={emailRef} type="email" autoComplete="email" placeholder="you@example.com" />

                <FloatingInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={(v) => setPassword(v)}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  rightElement={
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  }
                />

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-3">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>

                  <button type="button" onClick={openForgot} className="text-sm text-pink-600 hover:underline">Forgot password?</button>
                </div>

                <motion.button whileTap={{ scale: 0.985 }} whileHover={!reduced ? { scale: 1.02 } : {}} type="submit" disabled={loading} className={`w-full mt-1 py-3 rounded-full text-white font-semibold shadow-md ${loading ? "bg-pink-300 cursor-wait" : "bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700"}`} aria-busy={loading}>
                  <div className="flex items-center justify-center gap-3">
                    {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.25" /><path d="M22 12a10 10 0 00-10-10" strokeWidth="3" /></svg>}
                    <span>{loading ? "Signing in..." : "Sign in"}</span>
                  </div>
                </motion.button>

                <div className="text-center text-sm text-gray-500">Don’t have an account? <Link to="/register" className="text-pink-600 font-semibold">Create one</Link></div>

                <div aria-live="polite" className="min-h-[1.25rem] mt-1">{error ? <div className="text-sm text-red-600">{error}</div> : msg ? <div className="text-sm text-green-700">{msg}</div> : null}</div>
              </form>
            </motion.div>

            <div className="mt-6 text-xs text-center text-gray-400">© {new Date().getFullYear()} — Study Buddy</div>
          </div>
        </div>
      </motion.div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setForgotOpen(false)} aria-hidden="true" />
          <motion.div role="dialog" aria-modal="true" className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-lg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {forgotState === "lookup" && (
              <>
                <h3 className="text-lg font-semibold mb-2">Forgot password</h3>
                <p className="text-sm text-gray-600 mb-3">Enter your account email. If found you'll be allowed to set a new password (demo).</p>
                <form onSubmit={handleForgotLookup} className="space-y-3">
                  <input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full p-3 rounded-md border" placeholder="you@example.com" required />
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-md bg-pink-600 text-white">Continue</button>
                    <button type="button" onClick={() => setForgotOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
                  </div>
                </form>
                {forgotInfo && <div className="mt-3 text-sm text-red-600">{forgotInfo}</div>}
              </>
            )}

            {forgotState === "reset" && (
              <>
                <h3 className="text-lg font-semibold mb-2">Set a new password</h3>
                <p className="text-sm text-gray-600 mb-3">Choose a new password for <span className="font-medium">{forgotEmail}</span>.</p>
                <form onSubmit={handleForgotReset} className="space-y-3">
                  <input id="forgot-new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-3 rounded-md border" placeholder="New password" required />
                  <input id="forgot-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-md border" placeholder="Confirm password" required />
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-md bg-pink-600 text-white">Set password</button>
                    <button type="button" onClick={() => setForgotOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
                  </div>
                </form>
                {forgotInfo && <div className="mt-3 text-sm text-red-600">{forgotInfo}</div>}
              </>
            )}

            {forgotState === "done" && (
              <>
                <h3 className="text-lg font-semibold mb-2">Password updated</h3>
                <p className="text-sm text-gray-600 mb-3">Your password was updated successfully. You may now sign in with the new password.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForgotOpen(false);
                      setForgotState("lookup");
                      setMsg("Password updated. Please login with your new password.");
                    }}
                    className="px-4 py-2 rounded-md bg-pink-600 text-white"
                  >
                    Okay
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

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

function FloatingInput({ id, label, value, onChange, type = "text", inputRef, placeholder = "", autoComplete = "", rightElement = null }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <div className={`flex items-center gap-3 rounded-xl border px-3 py-2 bg-white ${focused ? "ring-2 ring-pink-200" : "ring-0"}`}>
        <input id={id} ref={inputRef} value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} type={type} autoComplete={autoComplete} placeholder={placeholder} className="flex-1 bg-transparent outline-none py-3 text-sm text-gray-900 placeholder-gray-400" aria-label={label} />
        {rightElement && <div className="ml-2">{rightElement}</div>}
      </div>
      <label htmlFor={id} className={`pointer-events-none absolute left-4 top-0 transform -translate-y-1/2 text-xs transition-all ${value ? "text-pink-600 font-medium" : "text-gray-500"}`}>{label}</label>
    </div>
  );
}
