import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const AddCourses = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([{ title: "", url: "" }]);
  const [quizzes, setQuizzes] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  const navigate = useNavigate();

  const handleAddVideoField = () => {
    setVideos([...videos, { title: "", url: "" }]);
  };

  const handleRemoveVideoField = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
  };

  const handleAddCourse = (e) => {
    e.preventDefault();

    const newCourse = {
      title,
      description,
      instructorEmail: user?.email,
      videos: videos.filter((v) => v.url.trim() !== ""), // Only include valid videos
      quizzes: quizzes.filter(q => q.question.trim() !== ''),
    };

    fetch("http://localhost:3000/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Course created:", data);
        navigate("/instructorProfile");
      })
      .catch((err) => {
        console.error("Failed to create course:", err);
        alert("Error creating course");
      });
  };

  const handleQuizChange = (index, field, value) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[index][field] = value;
    setQuizzes(updatedQuizzes);
  };

  const handleOptionChange = (quizIndex, optionIndex, value) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes[quizIndex].options[optionIndex] = value;
    setQuizzes(updatedQuizzes);
  };

  const handleAddQuiz = () => {
    setQuizzes([
      ...quizzes,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleRemoveQuiz = (index) => {
    const updatedQuizzes = [...quizzes];
    updatedQuizzes.splice(index, 1);
    setQuizzes(updatedQuizzes);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleAddCourse}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter course title"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Course Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Course overview"
          ></textarea>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Course Videos</h3>
          {videos.map((video, index) => (
            <div key={index} className="border p-3 mb-2 rounded">
              <label className="block font-medium mb-1">Video Title</label>
              <input
                type="text"
                value={video.title}
                onChange={(e) =>
                  handleVideoChange(index, "title", e.target.value)
                }
                className="w-full border px-3 py-1 mb-2 rounded"
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
                className="w-full border px-3 py-1 mb-2 rounded"
                placeholder="https://youtube.com/..."
              />
              {videos.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVideoField(index)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove Video
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddVideoField}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            + Add Another Video
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Quiz Questions</h3>
          {quizzes.map((quiz, index) => (
            <div key={index} className="border p-3 mb-3 rounded">
              <label className="block font-medium mb-1">Question</label>
              <input
                type="text"
                value={quiz.question}
                onChange={(e) =>
                  handleQuizChange(index, "question", e.target.value)
                }
                className="w-full border px-3 py-1 mb-2 rounded"
                placeholder="Enter quiz question"
                required
              />

              {["A", "B", "C", "D"].map((label, optIndex) => (
                <div key={optIndex} className="mb-1">
                  <label className="font-medium mr-2">Option {label}:</label>
                  <input
                    type="text"
                    value={quiz.options[optIndex]}
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-3/4"
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
                className="w-full border px-3 py-2 rounded"
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
                  className="text-red-500 hover:underline text-sm mt-1"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuiz}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            + Add Another Question
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AddCourses;
