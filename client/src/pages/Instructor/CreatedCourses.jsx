// src/pages/CreatedCourses.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const CreatedCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const url =
      "https://server-blush-two-79.vercel.app/courses?instructorEmail=" +
      user.email;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [user?.email]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This course will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://server-blush-two-79.vercel.app/courses/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Your course has been deleted.", "success");
              setCourses((prev) => prev.filter((c) => c._id !== id));
            }
          });
      }
    });
  };

  const averageRating = (reviews = []) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  return (
    <div className="max-w-5xl mx-auto mt-24 mb-24 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          My Created Courses
        </h1>
        <Link
          to="/addCourse"
          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
        >
          + Add New Course
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-yellow-200 bg-white shadow"
            >
              <div className="h-6 w-2/3 bg-yellow-100 rounded mb-3" />
              <div className="h-4 w-1/2 bg-yellow-50 rounded mb-2" />
              <div className="h-4 w-1/3 bg-yellow-50 rounded" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-6 rounded-2xl border border-yellow-200 bg-white shadow text-black">
          <p>You haven’t created any courses yet.</p>
          <Link
            to="/addCourse"
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
          >
            Create your first course
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((c) => {
            const reviews = Array.isArray(c.reviews) ? c.reviews : [];
            const avg = averageRating(reviews);
            return (
              <div
                key={c._id}
                className="p-5 rounded-2xl border border-yellow-200 bg-white shadow text-black"
              >
                <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                <p className="text-sm text-black/70 mb-3">{c.description}</p>

                <div className="text-sm space-y-1 mb-4">
                  <p>
                    <span className="font-semibold">Difficulty:</span>{" "}
                    {c.difficulty || "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Categories:</span>{" "}
                    {Array.isArray(c.categories) && c.categories.length > 0
                      ? c.categories.join(", ")
                      : "—"}
                  </p>
                  <p>
                    <span className="font-semibold">Lessons:</span>{" "}
                    {Array.isArray(c.videos) ? c.videos.length : 0}
                  </p>
                  <p>
                    <span className="font-semibold">Quizzes:</span>{" "}
                    {Array.isArray(c.quizzes) ? c.quizzes.length : 0}
                  </p>
                </div>

                {/* Reviews */}
                <div className="mt-4 pt-3 border-t border-yellow-200">
                  <p className="text-sm font-semibold mb-2">Reviews</p>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-black/60">No reviews yet</p>
                  ) : (
                    <>
                      <p className="text-sm mb-2">
                        ⭐ {avg} / 5 ({reviews.length})
                      </p>
                      <ul className="space-y-2">
                        {reviews.slice(0, 2).map((r, idx) => (
                          <li
                            key={idx}
                            className="rounded-lg border border-yellow-200 bg-yellow-50 p-2 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">
                                {r.name || r.userEmail}
                              </span>
                              <span>⭐ {Number(r.rating) || 0}</span>
                            </div>
                            {r.comment && (
                              <p className="text-black/70 mt-1">{r.comment}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                      {reviews.length > 2 && (
                        <Link
                          to={`/courses/reviews/${c._id}`}
                          className="inline-block mt-2 text-xs underline"
                        >
                          View all reviews
                        </Link>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    to={`/instructor/courses/${c._id}`}
                    className="px-3 py-2 rounded-lg bg-black text-white font-semibold hover:opacity-90"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CreatedCourses;