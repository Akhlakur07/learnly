// src/pages/Faq.jsx
import React, { useEffect, useState } from "react";

const API = "https://server-blush-two-79.vercel.app";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/faqs`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load FAQs");
        return r.json();
      })
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 mt-11">
      <h1 className="text-3xl font-extrabold text-black">Frequently Asked Questions</h1>
      <p className="text-black/70 mt-1">Quick answers to common questions.</p>

      {loading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-yellow-200 bg-white p-4"
            >
              <div className="h-5 w-2/3 bg-yellow-100 rounded mb-2" />
              <div className="h-4 w-5/6 bg-yellow-50 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 text-red-800 p-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6 space-y-4">
          {faqs.length === 0 ? (
            <div className="rounded-2xl border border-yellow-200 bg-white p-6 text-black/70">
              No FAQs posted yet.
            </div>
          ) : (
            faqs.map((f) => (
              <div
                key={f._id?.$oid || f._id}
                className="rounded-2xl border border-yellow-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold text-black">
                    {f.question || f.title}
                  </h3>
                  {f.category && (
                    <span className="shrink-0 text-xs font-semibold bg-yellow-100 border border-yellow-300 text-black px-2 py-1 rounded">
                      {f.category}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-black/80 whitespace-pre-line">
                  {f.answer || "—"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Faq;