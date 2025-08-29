import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const CourseDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passed = location.state?.course || null;
  const passedInstructor = location.state?.instructorName || null;

  const [course, setCourse] = useState(passed);
  const [instructorName, setInstructorName] = useState(passedInstructor || "");
  const [loading, setLoading] = useState(!passed);

  useEffect(() => {
    if (passed) return;

    fetch(`https://server-blush-two-79.vercel.app/courses/${id}`)
      .then((r) => r.json())
      .then((c) => {
        setCourse(c || null);
        if (c?.instructorEmail) {
          return fetch(
            `https://server-blush-two-79.vercel.app/users/email/${c.instructorEmail}`
          )
            .then((r) => r.json())
            .then((u) => setInstructorName(u?.name || "Unknown instructor"));
        } else {
          setInstructorName("Unknown instructor");
        }
      })
      .finally(() => setLoading(false));
  }, [id, passed]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const res = await fetch(
      `https://server-blush-two-79.vercel.app/users/email/${user.email}`
    );
    const me = await res.json();

    if (me.role !== "student") {
      Swal.fire({
        icon: "info",
        title: "Not allowed",
        text: "Only Students can enroll in courses.",
        confirmButtonColor: "#000000",
      });
      return;
    }

    const already =
      Array.isArray(me.enrolledCourses) && me.enrolledCourses.includes(id);

    if (already) {
      Swal.fire({
        icon: "info",
        title: "Already enrolled",
        text: "You have already enrolled in this course.",
        confirmButtonColor: "#000000",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Enroll in this course?",
      text: `Do you want to enroll in "${course.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, enroll",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#000000",
      cancelButtonColor: "#facc15",
      background: "#ffffff",
    });

    if (result.isConfirmed) {
      const enrollRes = await fetch(
        "https://server-blush-two-79.vercel.app/users/enroll",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, courseId: id }),
        }
      );
      const enrollData = await enrollRes.json();

      if (enrollData?.modifiedCount === 0) {
        Swal.fire({
          icon: "info",
          title: "Already enrolled",
          text: "Looks like you were already enrolled.",
          confirmButtonColor: "#000000",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Enrolled",
          text: "You have been enrolled successfully.",
          confirmButtonColor: "#000000",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-24">
        <div className="h-8 w-64 bg-yellow-100 rounded mb-4" />
        <div className="h-5 w-80 bg-yellow-50 rounded mb-2" />
        <div className="h-5 w-72 bg-yellow-50 rounded mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-40 rounded-2xl border border-yellow-200 bg-white" />
          <div className="h-40 rounded-2xl border border-yellow-200 bg-white" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-24">
        <h1 className="text-2xl font-extrabold text-black">Course not found</h1>
        <Link
          to="/courses"
          className="mt-3 inline-block text-sm font-semibold text-black hover:underline"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const lessonCount = Array.isArray(course.videos) ? course.videos.length : 0;
  const quizCount = Array.isArray(course.quizzes) ? course.quizzes.length : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <div className="rounded-3xl border border-yellow-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-yellow-100 text-black px-2 py-1 rounded">
          {instructorName || "Unknown instructor"}
        </span>

        <h1 className="mt-3 text-3xl font-extrabold text-black">
          {course.title}
        </h1>
        <p className="mt-2 text-black/70">{course.description}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-black/70">
          <span className="rounded-lg bg-yellow-50 border border-yellow-200 px-2 py-1">
            {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
          </span>
          <span className="rounded-lg bg-yellow-50 border border-yellow-200 px-2 py-1">
            {quizCount} {quizCount === 1 ? "Quiz" : "Quizzes"}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleEnroll}
            className="rounded-lg bg-black px-5 py-2.5 text-white text-sm font-semibold hover:opacity-90"
          >
            Enroll
          </button>
          <Link
            to="/courses"
            className="rounded-lg bg-yellow-400 px-5 py-2.5 text-black text-sm font-semibold hover:bg-yellow-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
