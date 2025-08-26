// src/pages/InstructorCourseDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

const InstructorCourseDetails = () => {
  const { id } = useParams(); // get course id from URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://server-blush-two-79.vercel.app/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded-2xl border border-yellow-200 shadow">
        <p className="text-black">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded-2xl border border-yellow-200 shadow">
        <p className="text-black">Course not found.</p>
        <Link
          to="/my-courses"
          className="inline-block mt-4 px-4 py-2 bg-yellow-400 rounded-lg font-semibold text-black"
        >
          Back to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-24 mb-24 px-4">
      <div className="p-6 rounded-2xl border border-yellow-200 bg-white shadow">
        <h1 className="text-3xl font-extrabold text-black mb-2">{course.title}</h1>
        <p className="text-black/70 mb-4">{course.description}</p>

        <div className="text-sm space-y-1 mb-6 text-black">
          <p>
            <span className="font-semibold">Difficulty:</span>{" "}
            {course.difficulty || "—"}
          </p>
          <p>
            <span className="font-semibold">Categories:</span>{" "}
            {Array.isArray(course.categories) && course.categories.length > 0
              ? course.categories.join(", ")
              : "—"}
          </p>
        </div>

        {/* Videos Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-black">Lessons</h2>
          {Array.isArray(course.videos) && course.videos.length > 0 ? (
            <ul className="space-y-3">
              {course.videos.map((video, i) => (
                <li
                  key={i}
                  className="p-3 border border-yellow-200 rounded-lg bg-yellow-50"
                >
                  <p className="font-semibold">{video.title}</p>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {video.url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-black/60">No lessons added yet.</p>
          )}
        </div>

        {/* Quizzes Section */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-black">Quizzes</h2>
          {Array.isArray(course.quizzes) && course.quizzes.length > 0 ? (
            <div className="space-y-4">
              {course.quizzes.map((quiz, i) => (
                <div
                  key={i}
                  className="p-4 border border-yellow-200 rounded-lg bg-yellow-50"
                >
                  <p className="font-semibold mb-2">
                    Q{i + 1}: {quiz.question}
                  </p>
                  <ul className="list-disc pl-6 text-black/80">
                    {quiz.options.map((opt, j) => (
                      <li key={j}>
                        {opt}{" "}
                        {quiz.correctAnswer === ["A", "B", "C", "D"][j] && (
                          <span className="text-green-600 font-medium">
                            (Correct)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black/60">No quizzes added yet.</p>
          )}
        </div>

        <div className="mt-8">
          <Link
            to="/my-courses"
            className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90"
          >
            Back to My Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetails;