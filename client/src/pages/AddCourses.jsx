// ...imports remain the same
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const AddCourses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // role
  const [userDoc, setUserDoc] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(""); // NEW
  const [categoriesText, setCategoriesText] = useState(""); // NEW (comma-separated)
  const [videos, setVideos] = useState([{ title: "", url: "" }]);
  const [quizzes, setQuizzes] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  useEffect(() => {
    if (!user?.email) {
      setUserDoc(null);
      setLoadingRole(false);
      return;
    }
    fetch(
      `https://server-92hoyqb6a-akhlakurs-projects.vercel.app/users/email/${user.email}`
    )
      .then((res) => res.json())
      .then((data) => setUserDoc(data))
      .finally(() => setLoadingRole(false));
  }, [user?.email]);

  // videos
  const handleAddVideoField = () =>
    setVideos((v) => [...v, { title: "", url: "" }]);
  const handleRemoveVideoField = (index) =>
    setVideos((v) => v.filter((_, i) => i !== index));
  const handleVideoChange = (index, field, value) =>
    setVideos((v) => {
      const next = [...v];
      next[index][field] = value;
      return next;
    });

  // quizzes
  const handleQuizChange = (index, field, value) =>
    setQuizzes((q) => {
      const next = [...q];
      next[index][field] = value;
      return next;
    });

  const handleAddQuiz = () =>
    setQuizzes((q) => [
      ...q,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  const handleRemoveQuiz = (index) =>
    setQuizzes((q) => q.filter((_, i) => i !== index));

  const handleAddCourse = (e) => {
    e.preventDefault();

    // turn "DSA, Algorithms, Interview" into ["DSA","Algorithms","Interview"]
    const categories = categoriesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newCourse = {
      title,
      description,
      instructorEmail: user?.email,
      difficulty, // NEW
      categories, // NEW
      videos: videos.filter((v) => v.url.trim() !== ""),
      quizzes: quizzes.filter((q) => q.question.trim() !== ""),
    };

    fetch("https://server-92hoyqb6a-akhlakurs-projects.vercel.app/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create course");
        return res.json();
      })
      .then(() => navigate("/instructorProfile"))
      .catch(() => alert("Error creating course"));
  };

  if (loadingRole) {
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="h-6 w-40 bg-yellow-100 rounded mb-4" />
        <div className="h-4 w-full bg-yellow-50 rounded mb-2" />
        <div className="h-4 w-3/4 bg-yellow-50 rounded" />
      </div>
    );
  }

  if (!userDoc || userDoc.role !== "instructor") {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white text-black shadow-sm">
        <h2 className="text-2xl font-bold">Instructor access only</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded-2xl border border-yellow-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] mb-24">
      <h2 className="text-2xl font-extrabold mb-4 text-black">
        Add New Course
      </h2>

      <form onSubmit={handleAddCourse} className="text-black">
        {/* Title */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-yellow-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter course title"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Course Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full border border-yellow-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Course overview"
          />
        </div>

        {/* Difficulty (NEW) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            className="w-full border border-yellow-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Categories (NEW) */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Categories</label>
          <input
            type="text"
            value={categoriesText}
            onChange={(e) => setCategoriesText(e.target.value)}
            className="w-full border border-yellow-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g. DSA, Algorithms, Interview"
          />
          <p className="mt-1 text-xs text-black/60">
            Separate with commas. Add one or many.
          </p>
        </div>

        {/* Videos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Lessons</h3>
          {videos.map((video, index) => (
            <div
              key={index}
              className="border border-yellow-200 p-3 mb-3 rounded-xl bg-white"
            >
              <label className="block font-medium mb-1">Lesson Title</label>
              <input
                type="text"
                value={video.title}
                onChange={(e) =>
                  handleVideoChange(index, "title", e.target.value)
                }
                className="w-full border border-yellow-300 px-3 py-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. Introduction"
              />
              <label className="block font-medium mb-1">Lesson URL</label>
              <input
                type="url"
                value={video.url}
                onChange={(e) =>
                  handleVideoChange(index, "url", e.target.value)
                }
                className="w-full border border-yellow-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="https://youtube.com/..."
              />
              {videos.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVideoField(index)}
                  className="mt-2 text-sm font-semibold text-red-600 hover:underline"
                >
                  Remove Lesson
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddVideoField}
            className="mt-2 text-sm font-semibold rounded-lg px-3 py-1.5 bg-yellow-400 text-black hover:bg-yellow-300"
          >
            + Add Lesson
          </button>
        </div>

        {/* Quizzes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Quiz Questions</h3>
          {quizzes.map((quiz, index) => (
            <div
              key={index}
              className="border border-yellow-200 p-3 mb-3 rounded-xl bg-white"
            >
              <label className="block font-medium mb-1">Question</label>
              <input
                type="text"
                value={quiz.question}
                onChange={(e) =>
                  handleQuizChange(index, "question", e.target.value)
                }
                className="w-full border border-yellow-300 px-3 py-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter quiz question"
                required
              />
              {["A", "B", "C", "D"].map((label, optIndex) => (
                <div key={optIndex} className="mb-2">
                  <label className="font-medium mr-2">Option {label}:</label>
                  <input
                    type="text"
                    value={quiz.options[optIndex]}
                    onChange={(e) => {
                      const v = e.target.value;
                      const next = [...quiz.options];
                      next[optIndex] = v;
                      handleQuizChange(index, "options", next);
                    }}
                    className="border border-yellow-300 px-3 py-2 rounded w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder={`Option ${label}`}
                    required
                  />
                </div>
              ))}
              <label className="block font-medium mt-2">Correct Answer</label>
              <select
                value={quiz.correctAnswer}
                onChange={(e) =>
                  handleQuizChange(index, "correctAnswer", e.target.value)
                }
                className="w-full border border-yellow-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Select correct option</option>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
              {quizzes.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuiz(index)}
                  className="text-sm font-semibold text-red-600 hover:underline mt-2"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuiz}
            className="mt-2 text-sm font-semibold rounded-lg px-3 py-1.5 bg-yellow-400 text-black hover:bg-yellow-300"
          >
            + Add Question
          </button>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-black text-white px-4 py-2 font-semibold hover:opacity-90"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AddCourses;
