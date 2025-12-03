// EditPost.jsx (responsive split + stacked)
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { postsById } from "./postsData"; // ensure postsById exists

/* helpers */
const savedKey = (id) => `post_saved_${id}`;

function parseSimpleMarkdownToHtml(text = "") {
  if (!text) return "";
  const lines = text.split(/\r?\n/);
  let html = "";
  let buffer = [];
  const flush = () => {
    if (buffer.length) {
      const p = buffer.join(" ").trim();
      if (p) html += `<p>${escapeHtml(p)}</p>`;
      buffer = [];
    }
  };
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const h1 = line.match(/^#\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    if (h1) {
      flush();
      html += `<h2 id="${slugify(h1[1])}">${escapeHtml(h1[1])}</h2>`;
      continue;
    }
    if (h2) {
      flush();
      html += `<h3 id="${slugify(h2[1])}">${escapeHtml(h2[1])}</h3>`;
      continue;
    }
    buffer.push(line);
  }
  flush();
  return html;
}
function slugify(s = "") {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}
function escapeHtml(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function countWords(text = "") {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}
function estimateReadingTime(text = "") {
  const words = countWords(text);
  return Math.max(1, Math.round(words / 200));
}

/* component */
export default function EditPost() {
  const { id } = useParams();
  const postId = String(id);
  const navigate = useNavigate();

  const original = postsById[postId] || null;

  const [post, setPost] = useState(() => {
    try {
      const s = localStorage.getItem(savedKey(postId));
      if (s) return JSON.parse(s);
    } catch {}
    return original
      ? { ...original }
      : { id: Number(postId), title: "", date: new Date().toISOString().slice(0, 10), tags: [], body: "" };
  });

  // form fields
  const [title, setTitle] = useState(post?.title || "");
  const [date, setDate] = useState(post?.date || new Date().toISOString().slice(0, 10));
  const [tagsText, setTagsText] = useState((post?.tags || []).join(", "));
  const [body, setBody] = useState(post?.body || "");
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState("auto"); // "auto" | "side" | "stack"
  const [previewOpen, setPreviewOpen] = useState(false); // for small screens
  const [autoSave, setAutoSave] = useState(false);
  const [toast, setToast] = useState(null);
  const [autosaveIndicator, setAutosaveIndicator] = useState(false);

  // sync fields when post changes (e.g., after reset)
  useEffect(() => {
    setTitle(post?.title || "");
    setDate(post?.date || new Date().toISOString().slice(0, 10));
    setTagsText((post?.tags || []).join(", "));
    setBody(post?.body || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, post]);

  // determine preview mode by viewport width (auto): side on >= lg, stack on < lg
  useEffect(() => {
    function check() {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      setPreviewMode(isLg ? "side" : "stack");
    }
    check();
    const mq = window.matchMedia("(min-width: 1024px)");
    const listener = () => check();
    mq.addEventListener?.("change", listener);
    return () => mq.removeEventListener?.("change", listener);
  }, []);

  // autosave (throttled)
  useEffect(() => {
    if (!autoSave) return;
    const t = setTimeout(() => {
      try {
        const payload = {
          id: Number(postId),
          title: title.trim() || "Untitled",
          date: date || new Date().toISOString().slice(0, 10),
          tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
          body,
        };
        localStorage.setItem(savedKey(postId), JSON.stringify(payload));
        setAutosaveIndicator(true);
        setTimeout(() => setAutosaveIndicator(false), 1000);
      } catch {}
    }, 900);
    return () => clearTimeout(t);
  }, [title, date, tagsText, body, autoSave, postId]);

  useEffect(() => {
    document.title = `Edit post ${postId} — Edit`;
  }, [postId]);

  function showToast(msg, ms = 1400) {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }

  async function handleSave(e) {
    e?.preventDefault?.();
    setSaving(true);
    try {
      const payload = {
        id: Number(postId),
        title: title.trim() || "Untitled",
        date: date || new Date().toISOString().slice(0, 10),
        tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
        body,
      };
      localStorage.setItem(savedKey(postId), JSON.stringify(payload));
      setPost(payload);
      showToast("Saved");
      navigate(`/post/${postId}`, { replace: true });
    } catch (err) {
      console.error(err);
      showToast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    localStorage.removeItem(savedKey(postId));
    const orig = original || { id: Number(postId), title: "", date: new Date().toISOString().slice(0, 10), tags: [], body: "" };
    setPost(orig);
    setTitle(orig.title || "");
    setDate(orig.date || new Date().toISOString().slice(0, 10));
    setTagsText((orig.tags || []).join(", "));
    setBody(orig.body || "");
    showToast("Reset to original");
  }

  function handleCancel() {
    navigate(`/post/${postId}`);
  }

  const words = useMemo(() => countWords(body), [body]);
  const reading = useMemo(() => estimateReadingTime(body), [body]);
  const previewHtml = useMemo(() => parseSimpleMarkdownToHtml(body), [body]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 sm:p-6">
          {/* header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight truncate">Edit post — ID {postId}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Edit the post content. Changes save locally (localStorage).</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="hidden sm:inline-flex items-center gap-2 text-sm select-none">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4"
                  aria-label="Toggle autosave"
                />
                <span>Autosave</span>
              </label>

              <div className="hidden sm:flex items-center gap-2">
                {autosaveIndicator && <div className="text-xs text-green-600">Autosaved</div>}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-2 rounded-md bg-pink-600 text-white text-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* content area: editor + preview (side-by-side on lg, stacked on smaller) */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
            {/* editor column */}
            <section className="bg-white dark:bg-gray-900/70 p-3 sm:p-4 rounded-md border border-gray-100 dark:border-gray-800">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-200"
                    placeholder="Post title"
                    aria-label="Post title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-200"
                      aria-label="Post date"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <input
                      value={tagsText}
                      onChange={(e) => setTagsText(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="e.g. trends, living room"
                      aria-label="Tags"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Body (use <code>#</code> and <code>##</code>)</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-3 rounded-md border font-mono text-sm min-h-[220px] md:min-h-[320px] resize-y focus:outline-none focus:ring-2 focus:ring-pink-200"
                    aria-label="Body"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>Words: <strong>{words}</strong></div>
                    <div>Est. read: <strong>{reading} min</strong></div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* preview toggle on small; on large previewMode side shows preview automatically */}
                    <button
                      type="button"
                      onClick={() => {
                        if (previewMode === "side") {
                          // on side mode toggle between showing and hiding preview column
                          setPreviewMode((m) => (m === "side" ? "stack" : "side"));
                        } else {
                          setPreviewOpen((p) => !p);
                        }
                      }}
                      className="px-3 py-2 rounded-md border text-sm"
                      aria-pressed={previewOpen}
                    >
                      {previewMode === "side" ? "Toggle preview column" : previewOpen ? "Hide preview" : "Show preview"}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-2 rounded-md border text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
                    >
                      Reset
                    </button>

                    <div className="sm:hidden">
                      {/* small-screen Save button is in fixed bar; show a secondary save for tablet */}
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-3 py-2 rounded-md bg-pink-600 text-white text-sm"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </section>

            {/* preview column — visible side-by-side on lg, collapsible on small */}
            <aside
              className={[
                "bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-800",
                previewMode === "side" ? "block" : previewOpen ? "block" : "hidden",
              ].join(" ")}
              aria-live="polite"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold">Preview</h3>
                <div className="text-xs text-gray-500">{words} words • {reading} min</div>
              </div>
              <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </aside>
          </div>

          {/* footer info */}
          <div className="mt-6 border-t pt-4 text-sm text-gray-500 dark:text-gray-400">
            <div>Original present: <strong>{original ? "yes" : "no"}</strong></div>
            <div className="mt-2">Saved edit key: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{savedKey(postId)}</code></div>
            <div className="mt-2">When you Save you'll be returned to the post view.</div>
          </div>
        </div>
      </div>

      {/* mobile fixed action bar */}
      <div className="fixed left-0 right-0 bottom-0 sm:hidden z-50">
        <div className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {autosaveIndicator && <div className="text-xs text-green-600">Autosaved</div>}
            <div className="text-xs text-gray-600">Words: <strong>{words}</strong></div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="px-3 py-2 rounded-md border text-sm">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-3 py-2 rounded-md bg-pink-600 text-white text-sm">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed right-4 bottom-20 sm:bottom-6 bg-black/85 text-white px-4 py-2 rounded-md text-sm z-50">
          {toast}
        </div>
      )}
    </main>
  );
}
