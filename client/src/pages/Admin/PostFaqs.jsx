// src/pages/Admin/PostFaqs.jsx
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

const API = "https://server-blush-two-79.vercel.app";

const PostFaqs = () => {
  const { user } = useContext(AuthContext);

  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Load current user (to verify admin)
  useEffect(() => {
    if (!user?.email) {
      setLoadingMe(false);
      return;
    }
    fetch(`${API}/users/email/${user.email}`)
      .then((r) => r.json())
      .then((data) => setMe(data || null))
      .finally(() => setLoadingMe(false));
  }, [user?.email]);

  // Load FAQs
  const refreshFaqs = () => {
    setLoadingFaqs(true);
    fetch(`${API}/faqs`)
      .then((r) => r.json())
      .then((list) => setFaqs(Array.isArray(list) ? list : []))
      .finally(() => setLoadingFaqs(false));
  };

  useEffect(() => {
    refreshFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      Swal.fire({
        icon: "info",
        title: "Please fill both fields",
        confirmButtonColor: "#000000",
      });
      return;
    }
    try {
      const res = await fetch(`${API}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          actorEmail: user?.email,
        }),
      });

      const isJson = (res.headers.get("content-type") || "").includes(
        "application/json"
      );
      const payload = isJson ? await res.json() : await res.text();
      if (!res.ok) {
        throw new Error(
          typeof payload === "string" ? payload : payload?.message || "Failed"
        );
      }

      Swal.fire({
        icon: "success",
        title: "FAQ posted",
        confirmButtonColor: "#000000",
      });
      setQuestion("");
      setAnswer("");
      refreshFaqs();
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Could not post FAQ",
        text: e.message || "Please try again.",
        confirmButtonColor: "#000000",
      });
    }
  };

  const handleDelete = async (faq) => {
    const id = faq._id?.$oid || faq._id;
    if (!id) return;

    const result = await Swal.fire({
      title: "Delete this FAQ?",
      text: faq.question,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#facc15",
      background: "#ffffff",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API}/faqs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorEmail: user?.email }),
      });
      const isJson = (res.headers.get("content-type") || "").includes(
        "application/json"
      );
      const payload = isJson ? await res.json() : await res.text();
      if (!res.ok) {
        throw new Error(
          typeof payload === "string" ? payload : payload?.message || "Failed"
        );
      }
      if ((payload?.deletedCount ?? 0) > 0) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          confirmButtonColor: "#000000",
        });
        setFaqs((prev) => prev.filter((f) => (f._id?.$oid || f._id) !== id));
      } else {
        Swal.fire({
          icon: "info",
          title: "Nothing deleted",
          confirmButtonColor: "#000000",
        });
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: e.message || "Please try again.",
        confirmButtonColor: "#000000",
      });
    }
  };

  // Start editing a row
  const startEdit = (faq) => {
    const id = faq._id?.$oid || faq._id;
    setEditingId(id);
    setEditQuestion(faq.question || "");
    setEditAnswer(faq.answer || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
    setSavingEdit(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editQuestion.trim() || !editAnswer.trim()) {
      Swal.fire({
        icon: "info",
        title: "Please fill both fields",
        confirmButtonColor: "#000000",
      });
      return;
    }
    try {
      setSavingEdit(true);
      const res = await fetch(`${API}/faqs/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editQuestion,
          answer: editAnswer,
          actorEmail: user?.email,
        }),
      });
      const isJson = (res.headers.get("content-type") || "").includes(
        "application/json"
      );
      const payload = isJson ? await res.json() : await res.text();
      if (!res.ok) {
        throw new Error(
          typeof payload === "string"
            ? payload
            : payload?.message || "Update failed"
        );
      }

      // Optimistic local update
      setFaqs((prev) =>
        prev.map((f) => {
          const id = f._id?.$oid || f._id;
          if (id === editingId) {
            return {
              ...f,
              question: editQuestion,
              answer: editAnswer,
              updatedAt: new Date().toISOString(),
            };
          }
          return f;
        })
      );

      Swal.fire({
        icon: "success",
        title: "FAQ updated",
        confirmButtonColor: "#000000",
      });
      cancelEdit();
    } catch (e) {
      setSavingEdit(false);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: e.message || "Please try again.",
        confirmButtonColor: "#000000",
      });
    }
  };

  if (loadingMe || loadingFaqs) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-24">
        <div className="h-8 w-64 bg-yellow-100 rounded mb-4" />
        <div className="h-5 w-80 bg-yellow-50 rounded mb-2" />
        <div className="h-5 w-72 bg-yellow-50 rounded mb-6" />
        <div className="h-40 rounded-2xl border border-yellow-200 bg-white" />
      </div>
    );
  }

  if (!me || me.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white text-black shadow-sm">
        <h2 className="text-2xl font-bold">Admin access only</h2>
        <p className="mt-2 text-black/70">
          You need an admin account to post FAQs.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Post FAQs</h1>
        <p className="text-black/70 mt-1">
          Create and manage frequently asked questions.
        </p>
      </div>

      {/* Create form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-yellow-200 bg-white p-6 mb-8"
      >
        <label className="block text-sm font-semibold text-black mb-1">
          Question
        </label>
        <input
          className="w-full border border-yellow-300 rounded px-3 py-2 mb-4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type the question"
        />

        <label className="block text-sm font-semibold text-black mb-1">
          Answer
        </label>
        <textarea
          className="w-full border border-yellow-300 rounded px-3 py-2"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write the answer"
        />

        <button
          type="submit"
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
        >
          Post FAQ
        </button>
      </form>

      {/* List FAQs */}
      <div className="rounded-2xl border border-yellow-200 overflow-hidden bg-white">
        <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
          <div className="col-span-6">Question</div>
          <div className="col-span-4">Answer</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <ul className="divide-y divide-yellow-200">
          {faqs.map((f) => {
            const id = f._id?.$oid || f._id;
            const isEditing = editingId === id;

            return (
              <li
                key={id}
                className="grid grid-cols-12 px-4 py-3 items-start gap-2"
              >
                <div className="col-span-6 pr-4">
                  {isEditing ? (
                    <input
                      className="w-full border border-yellow-300 rounded px-3 py-2"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                    />
                  ) : (
                    <div className="font-semibold text-black">{f.question}</div>
                  )}
                </div>
                <div className="col-span-4 text-black/80">
                  {isEditing ? (
                    <textarea
                      className="w-full border border-yellow-300 rounded px-3 py-2"
                      rows={3}
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap">{f.answer}</div>
                  )}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={savingEdit}
                        className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-semibold hover:bg-yellow-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(f)}
                        className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:opacity-90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
          {faqs.length === 0 && (
            <li className="px-4 py-6 text-center text-black/70">
              No FAQs yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PostFaqs;