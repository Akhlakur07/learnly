import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

const Reviews = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://server-blush-two-79.vercel.app/courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data || null))
      .finally(() => setLoading(false));
  }, [id]);

  const reviews = Array.isArray(course?.reviews) ? course.reviews : [];

  const averageRating = (list = []) => {
    if (!list.length) return 0;
    const sum = list.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / list.length) * 10) / 10;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-black">
          {course?.title ? `${course.title} — Reviews` : "Reviews"}
        </h1>
        <div className="flex gap-2">
          <Link
            to={`/instructor/courses/${id}`}
            className="rounded-lg bg-white px-4 py-2 text-black text-sm font-semibold border border-yellow-300"
          >
            Back to course
          </Link>
          <Link
            to="/my-courses"
            className="rounded-lg bg-yellow-400 px-4 py-2 text-black text-sm font-semibold hover:bg-yellow-300"
          >
            My courses
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-6 w-64 bg-yellow-100 rounded" />
          <div className="h-24 w-full bg-yellow-50 rounded" />
          <div className="h-24 w-full bg-yellow-50 rounded" />
        </div>
      ) : (
        <div className="rounded-2xl border border-yellow-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-black/70">
              Average rating:{" "}
              <span className="font-semibold text-black">
                {averageRating(reviews)} / 5
              </span>{" "}
              ({reviews.length})
            </p>
            <Stars value={averageRating(reviews)} readOnly />
          </div>

          {reviews.length === 0 ? (
            <p className="text-black/70">No reviews yet</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-yellow-200 bg-yellow-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-semibold text-black">
                        {r.name || r.userEmail || "Student"}
                      </p>
                      {r.createdAt && (
                        <p className="text-xs text-black/60">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Stars value={Number(r.rating) || 0} readOnly />
                  </div>
                  {r.comment && (
                    <p className="text-sm text-black/80 mt-2">{r.comment}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const Stars = ({ value = 0, readOnly = false, onChange = () => {} }) => {
  const rounded = Math.round(value);
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(s)}
          className={`text-xl ${
            s <= rounded ? "text-yellow-400" : "text-black/30"
          }`}
          title={`${s} star${s > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default Reviews;
