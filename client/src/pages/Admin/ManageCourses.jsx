// src/pages/Admin/ManageCourses.jsx
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

const API = "https://server-blush-two-79.vercel.app";

const ManageCourses = () => {
  const { user } = useContext(AuthContext);

  const [me, setMe] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Load current user's full doc to verify admin
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

  // Load all courses
  useEffect(() => {
    fetch(`${API}/courses`)
      .then((r) => r.json())
      .then((list) => setCourses(Array.isArray(list) ? list : []))
      .finally(() => setLoadingCourses(false));
  }, []);

  const handleDelete = async (course) => {
    const id = course._id?.$oid || course._id;
    if (!id) return;

    const result = await Swal.fire({
      title: "Delete this course?",
      text: `This will permanently delete "${course.title}".`,
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
      const res = await fetch(`${API}/courses/${id}`, { method: "DELETE" });
      // Vercel/servers sometimes send HTML on error; guard JSON parsing
      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const payload = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        throw new Error(typeof payload === "string" ? payload : payload?.message || "Delete failed");
      }

      // Mongo returns { deletedCount: N } — handle both plain or nested
      const deletedCount = payload?.deletedCount ?? payload?.result?.deletedCount ?? 0;
      if (deletedCount > 0) {
        setCourses((prev) => prev.filter((c) => (c._id?.$oid || c._id) !== id));
        Swal.fire({ icon: "success", title: "Deleted", confirmButtonColor: "#000000" });
      } else {
        Swal.fire({
          icon: "info",
          title: "Nothing deleted",
          text: "Course might have already been removed.",
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

  if (loadingMe || loadingCourses) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-24">
        <div className="h-8 w-64 bg-yellow-100 rounded mb-4" />
        <div className="h-5 w-80 bg-yellow-50 rounded mb-2" />
        <div className="h-5 w-72 bg-yellow-50 rounded mb-6" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-yellow-200 bg-white shadow">
              <div className="h-6 w-2/3 bg-yellow-100 rounded mb-3" />
              <div className="h-4 w-1/2 bg-yellow-50 rounded mb-2" />
              <div className="h-4 w-1/3 bg-yellow-50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!me || me.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white text-black shadow-sm">
        <h2 className="text-2xl font-bold">Admin access only</h2>
        <p className="mt-2 text-black/70">You need an admin account to manage courses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Manage Courses</h1>
        <p className="text-black/70 mt-1">View and delete courses from the platform.</p>
      </div>

      {courses.length === 0 ? (
        <div className="p-6 rounded-2xl border border-yellow-200 bg-white shadow text-black">
          No courses found.
        </div>
      ) : (
        <div className="rounded-2xl border border-yellow-200 overflow-hidden bg-white">
          <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Instructor</div>
            <div className="col-span-2 text-right">Lessons</div>
            <div className="col-span-1 text-right">Quizzes</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <ul className="divide-y divide-yellow-200">
            {courses.map((c) => {
              const id = c._id?.$oid || c._id;
              const lessons = Array.isArray(c.videos) ? c.videos.length : 0;
              const quizzes = Array.isArray(c.quizzes) ? c.quizzes.length : 0;

              return (
                <li key={id} className="grid grid-cols-12 px-4 py-3 items-center">
                  <div className="col-span-5">
                    <div className="text-black font-semibold">{c.title}</div>
                    <div className="text-black/60 text-sm line-clamp-1">{c.description}</div>
                  </div>
                  <div className="col-span-3 text-black/80 text-sm">
                    {c.instructorEmail || "—"}
                  </div>
                  <div className="col-span-2 text-right text-black/80">{lessons}</div>
                  <div className="col-span-1 text-right text-black/80">{quizzes}</div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDelete(c)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500"
                      title="Delete course"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;