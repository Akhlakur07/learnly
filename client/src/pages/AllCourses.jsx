import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/courses").then((res) => res.json()),
      fetch("http://localhost:3000/users").then((res) => res.json()),
    ])
      .then(([coursesData, usersData]) => {
        setCourses(coursesData || []);
        setUsers(usersData || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="h-6 w-48 bg-yellow-100 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg border border-yellow-200 bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">All Courses</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="w-full sm:w-72 rounded-lg border border-yellow-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* List header */}
      <div className="mt-6 rounded-xl border border-yellow-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
          <div className="col-span-6">Course</div>
          <div className="col-span-4">Uploaded by</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-4 py-4 text-black/70">No courses found.</div>
        ) : (
          <ul className="divide-y divide-yellow-200 bg-white">
            {filtered.map((course) => {
              const instructor =
                users.find((u) => u.email === course.instructorEmail) || null;
              const instructorName = instructor?.name || "Unknown instructor";
              const id = course._id?.$oid || course._id;

              return (
                <li key={id} className="grid grid-cols-12 items-center px-4 py-3">
                  <div className="col-span-6">
                    <span className="font-semibold text-black">{course.title}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-black/80">{instructorName}</span>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Link
                      to={`/courses/${id}`}
                      state={{ course, instructorName }}
                      className="rounded-lg bg-black px-3 py-1.5 text-white text-xs font-semibold hover:opacity-90"
                    >
                      View Details
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
