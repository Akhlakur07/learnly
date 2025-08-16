import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const AddCourses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // role state
  const [userDoc, setUserDoc] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

    fetch(`http://localhost:3000/users/email/${user.email}`)
      .then((res) => res.json())
      .then((data) => setUserDoc(data))
      .finally(() => setLoadingRole(false));
  }, [user?.email]);

  // video handlers
  const handleAddVideoField = () => {
    setVideos((v) => [...v, { title: "", url: "" }]);
  };
  const handleRemoveVideoField = (index) => {
    setVideos((v) => v.filter((_, i) => i !== index));
  };
  const handleVideoChange = (index, field, value) => {
    setVideos((v) => {
      const next = [...v];
      next[index][field] = value;
      return next;
    });
  };

  // quiz handlers
  const handleQuizChange = (index, field, value) => {
    setQuizzes((q) => {
      const next = [...q];
      next[index][field] = value;
      return next;
    });
  };
  const handleOptionChange = (quizIndex, optionIndex, value) => {
    setQuizzes((q) => {
      const next = [...q];
      next[quizIndex].options[optionIndex] = value;
      return next;
    });
  };
  const handleAddQuiz = () => {
    setQuizzes((q) => [
      ...q,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };
  const handleRemoveQuiz = (index) => {
    setQuizzes((q) => q.filter((_, i) => i !== index));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const newCourse = {
      title,
      description,
      instructorEmail: user?.email,
      videos: videos.filter((v) => v.url.trim() !== ""),
      quizzes: quizzes.filter((q) => q.question.trim() !== ""),
    };

    try {
      const res = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      if (!res.ok) throw new Error("Failed to create course");
      await res.json();
      navigate("/instructorProfile");
    } catch (err) {
      console.error("Failed to create course:", err);
      alert("Error creating course");
    }
  };

  // Loading state
  if (loadingRole) {
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="h-6 w-40 bg-yellow-100 rounded mb-4" />
        <div className="h-4 w-full bg-yellow-50 rounded mb-2" />
        <div className="h-4 w-3/4 bg-yellow-50 rounded" />
      </div>
    );
  }

  // Role error or not instructor
  if (!userDoc) {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white text-black shadow-sm">
        <h2 className="text-2xl font-bold">Access issue</h2>
      </div>
    );
  }

  if (userDoc.role !== "instructor") {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.06)] mb-24">
        <h2 className="text-2xl font-extrabold">Instructor access only</h2>
        <p className="mt-2 text-black/70">
          Your account is <span className="font-semibold">{userDoc.role}</span>.
          Only instructors can create courses.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-black px-4 py-2 text-white font-semibold hover:opacity-90"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/studentProfile")}
            className="rounded-lg bg-yellow-400 px-4 py-2 text-black font-semibold hover:bg-yellow-300"
          >
            View Profile
          </button>
        </div>
      </div>
    );
  }

  // Instructor view (form)
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
        <div className="mb-6">
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

        {/* Videos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Course Videos</h3>

          {videos.map((video, index) => (
            <div
              key={index}
              className="border border-yellow-200 p-3 mb-3 rounded-xl bg-white"
            >
              <label className="block font-medium mb-1">Video Title</label>
              <input
                type="text"
                value={video.title}
                onChange={(e) =>
                  handleVideoChange(index, "title", e.target.value)
                }
                className="w-full border border-yellow-300 px-3 py-2 mb-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. Introduction Lecture"
              />

              <label className="block font-medium mb-1">
                YouTube Video URL
              </label>
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
                  Remove Video
                </button>
              )}
            </div>
          ))}

          {/* Moved here: below the list */}
          <button
            type="button"
            onClick={handleAddVideoField}
            className="mt-2 text-sm font-semibold rounded-lg px-3 py-1.5 bg-yellow-400 text-black hover:bg-yellow-300"
          >
            + Add Video
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
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    className="border border-yellow-300 px-3 py-2 rounded w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder={`Option ${label}`}
                    required
                  />
                </div>
              ))}

              <label className="block font-medium mt-2">Correct Answer:</label>
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

          {/* Moved here: below the list */}
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