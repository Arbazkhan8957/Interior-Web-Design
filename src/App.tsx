// App.jsx (replace your current file)
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import EditPost from "./pages/EditPost";

/* Small helper to read auth quickly */
function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
}

/* PrivateRoute: keeps the attempted location in `state.from` */
function PrivateRoute({ children }) {
  const user = getAuthUser();
  const location = useLocation();
  if (!user) {
    // Redirect to login and save the location user tried to reach
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Protected pages - require login */}
          <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
          <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
          <Route path="/gallery" element={<PrivateRoute><Gallery /></PrivateRoute>} />
          <Route path="/blog" element={<PrivateRoute><Blog /></PrivateRoute>} />
          <Route path="/faq" element={<PrivateRoute><FAQ /></PrivateRoute>} />

          {/* Blog post view remains public (if you want it protected, wrap similarly) */}
          <Route path="/post/:id" element={<Post />} />

          {/* Edit post protected (only for logged-in users) */}
          <Route path="/blog/edit/:id" element={<PrivateRoute><div className="p-6"><EditPost /></div></PrivateRoute>} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard protected */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
