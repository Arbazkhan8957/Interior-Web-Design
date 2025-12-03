// Post.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { postsById, postsArray } from "./postsData"; // note: postsById exported from postsData.js

function formatDate(dateStr) {
  if (!dateStr) return "";
  try { return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); } catch { return dateStr; }
}
function estimateReadingTime(text) { if (!text) return 0; const words = text.trim().split(/\s+/).length; return Math.max(1, Math.round(words / 200)); }
function slugify(text) { return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"); }

function parseSimpleMarkdown(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const nodes = []; let buffer = [];
  const flushBuffer = () => { if (buffer.length) { const j = buffer.join(" ").trim(); if (j) nodes.push({ type: "p", text: j }); buffer = []; } };
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) { flushBuffer(); continue; }
    const h1 = line.match(/^#\s+(.*)/); const h2 = line.match(/^##\s+(.*)/);
    if (h1) { flushBuffer(); nodes.push({ type: "h1", text: h1[1], id: slugify(h1[1]) }); continue; }
    if (h2) { flushBuffer(); nodes.push({ type: "h2", text: h2[1], id: slugify(h2[1]) }); continue; }
    buffer.push(line);
  }
  flushBuffer(); return nodes;
}

function commentsKeyFor(id) { return `blog_comments_${id}`; }

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = postsById[String(id)];
  useEffect(() => { if (post) document.title = `${post.title} — Design Blog`; else document.title = "Post not found — Design Blog"; window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <p className="text-gray-600 mt-2">Try browsing the <Link to="/blog" className="text-pink-600 hover:underline">blog list</Link>.</p>
        </div>
      </div>
    );
  }

  const nodes = useMemo(() => parseSimpleMarkdown(post.body || ""), [post.body]);
  const readingTime = useMemo(() => estimateReadingTime(post.body || ""), [post.body]);
  const toc = nodes.filter((n) => n.type === "h1" || n.type === "h2");

  const related = postsArray.filter((p) => p.id !== post.id).slice(0, 3);
  const allIds = postsArray.map((p) => String(p.id)).sort((a, b) => Number(a) - Number(b));
  const idx = allIds.indexOf(String(post.id));
  const prevId = idx > 0 ? allIds[idx - 1] : null;
  const nextId = idx < allIds.length - 1 ? allIds[idx + 1] : null;

  const [comments, setComments] = useState(() => { try { const raw = localStorage.getItem(commentsKeyFor(post.id)); return raw ? JSON.parse(raw) : []; } catch { return []; } });
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState(null);

  function saveComments(next) { setComments(next); try { localStorage.setItem(commentsKeyFor(post.id), JSON.stringify(next)); } catch {} }
  function handleAddComment(e) { e.preventDefault(); if (!commentText.trim()) { showToast("Write a comment first"); return; } const entry = { id: Date.now(), name: name.trim() || "Anonymous", text: commentText.trim(), created: new Date().toISOString() }; const next = [entry, ...comments]; saveComments(next); setName(""); setCommentText(""); showToast("Comment added"); }
  function handleCopyLink() { const url = `${window.location.origin}/post/${post.id}`; if (navigator.clipboard?.writeText) { navigator.clipboard.writeText(url).then(() => showToast("Link copied to clipboard")); } else { const ta = document.createElement("textarea"); ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); showToast("Link copied to clipboard"); } }
  function showToast(msg, ms = 1400) { setToast(msg); setTimeout(() => setToast(null), ms); }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{post.title}</h1>
            <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3 items-center">
              <div>{formatDate(post.date)}</div><div>•</div><div>{readingTime} min read</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopyLink} className="px-3 py-2 rounded-full border text-sm hover:bg-gray-50">Share</button>
            <button onClick={() => showToast("Thank you — report received (demo)")} className="px-3 py-2 rounded-full border text-sm hover:bg-gray-50">Report</button>
            <Link to={`/blog/edit/${post.id}`} className="px-3 py-2 rounded-full bg-pink-600 text-white text-sm">Edit</Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
          <div>
            {toc.length > 0 && (
              <nav aria-label="Table of contents" className="mb-4">
                <div className="text-sm font-semibold mb-2">Contents</div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {toc.map((n) => <li key={n.id} className={n.type === "h1" ? "" : "ml-4"}><a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); const el = document.getElementById(n.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="hover:underline">{n.text}</a></li>)}
                </ul>
              </nav>
            )}

            <div className="prose max-w-none">
              {nodes.map((node, i) => {
                if (node.type === "h1") return <h2 id={node.id} key={i} className="text-xl font-semibold mt-6 scroll-mt-20">{node.text}</h2>;
                if (node.type === "h2") return <h3 id={node.id} key={i} className="text-lg font-medium mt-4 scroll-mt-20">{node.text}</h3>;
                return <p key={i} className="mt-3 text-gray-700 leading-relaxed">{node.text}</p>;
              })}
            </div>

            <div className="mt-8 flex gap-2 justify-between items-center">
              <div>{prevId ? <button onClick={() => navigate(`/post/${prevId}`)} className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50">← Previous</button> : <span className="text-sm text-gray-400">No previous</span>}</div>
              <div>{nextId ? <button onClick={() => navigate(`/post/${nextId}`)} className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50">Next →</button> : <span className="text-sm text-gray-400">No next</span>}</div>
            </div>

            <div className="mt-10">
              <h4 className="text-lg font-semibold">Comments</h4>
              <form onSubmit={handleAddComment} className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="flex-1 px-3 py-2 rounded border text-sm" />
                  <button type="submit" className="px-4 py-2 rounded bg-pink-600 text-white text-sm">Post</button>
                </div>
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." rows={3} className="w-full px-3 py-2 rounded border text-sm" />
              </form>

              <div className="mt-4 space-y-4">
                {comments.length === 0 && <div className="text-gray-500">No comments yet — be the first.</div>}
                {comments.map((c) => <div key={c.id} className="bg-gray-50 p-3 rounded"><div className="flex items-center justify-between"><div className="text-sm font-semibold">{c.name}</div><div className="text-xs text-gray-400">{formatDate(c.created)}</div></div><div className="mt-2 text-sm text-gray-700">{c.text}</div></div>)}
              </div>
            </div>
          </div>

          <aside className="hidden md:block">
            <div className="sticky top-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500 mb-2">About this article</div>
                <div className="text-sm"><div><strong>Reading time:</strong> {readingTime} minutes</div><div className="mt-2"><strong>Published:</strong> {formatDate(post.date)}</div></div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm font-semibold mb-2">Related posts</div>
                <ul className="space-y-2">{related.map((r) => <li key={r.id}><Link to={`/post/${r.id}`} className="text-sm hover:underline">{r.title}</Link></li>)}</ul>
              </div>

              <div className="bg-gray-50 p-4 rounded text-sm">
                <div className="font-semibold mb-2">Actions</div>
                <div className="flex flex-col gap-2">
                  <button onClick={handleCopyLink} className="px-3 py-2 rounded border text-sm">Copy link</button>
                  <Link to="/blog" className="px-3 py-2 rounded border text-sm text-center hover:bg-gray-50">Back to list</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {toast && <div className="fixed right-4 bottom-6 bg-black/85 text-white px-4 py-2 rounded-md text-sm z-50">{toast}</div>}
    </div>
  );
}
