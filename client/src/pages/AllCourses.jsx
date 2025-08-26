import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + filters
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All"); // All | Beginner | Intermediate | Advanced
  const [category, setCategory] = useState("All"); // All or a single category

  // load everything once
  useEffect(() => {
    Promise.all([
      fetch("https://server-blush-two-79.vercel.app/courses").then((res) =>
        res.json()
      ),
      fetch("https://server-blush-two-79.vercel.app/users").then((res) =>
        res.json()
      ),
    ])
      .then(([coursesData, usersData]) => {
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  // build instructor map for quick lookup
  const instructorByEmail = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(u.email, u));
    return map;
  }, [users]);

  // all unique categories (for the dropdown)
  const allCategories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (Array.isArray(c.categories)) {
        c.categories.forEach((cat) => set.add(cat));
      }
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  // TEXT SEARCH across title, instructor name, category list
  const matchesSearch = (course, instructorName) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();

    const title = String(course.title || "").toLowerCase();
    const instr = String(instructorName || "").toLowerCase();
    const cats = Array.isArray(course.categories)
      ? course.categories.join(" ").toLowerCase()
      : "";

    return title.includes(q) || instr.includes(q) || cats.includes(q);
  };

  const matchesDifficulty = (course) => {
    if (difficulty === "All") return true;
    return String(course.difficulty || "") === difficulty;
  };

  const matchesCategory = (course) => {
    if (category === "All") return true;
    return (
      Array.isArray(course.categories) && course.categories.includes(category)
    );
  };

  // final filtered list
  const filtered = courses.filter((c) => {
    const instructor = instructorByEmail.get(c.instructorEmail);
    const instructorName = instructor?.name || "Unknown instructor";

    return (
      matchesSearch(c, instructorName) &&
      matchesDifficulty(c) &&
      matchesCategory(c)
    );
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="h-6 w-48 bg-yellow-100 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg border border-yellow-200 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
    setCategory("All");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
      {/* Header + Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold text-black">
          All Courses
        </h1>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, instructor, or category"
            className="w-full md:w-72 rounded-lg border border-yellow-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Difficulty */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-lg border border-yellow-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option>All</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-yellow-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Clear (outline style, not black) */}
          <button
            onClick={clearFilters}
            className="rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-50 transition"
          >
            Clear
          </button>
        </div>
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
              const instructor = instructorByEmail.get(course.instructorEmail);
              const instructorName = instructor?.name || "Unknown instructor";
              const id = course._id?.$oid || course._id;

              return (
                <li
                  key={id}
                  className="grid grid-cols-12 items-center px-4 py-3"
                >
                  <div className="col-span-6">
                    <span className="font-semibold text-black">
                      {course.title}
                    </span>
                    {/* Optional tiny badges under title */}
                    <div className="mt-1 text-xs text-black/70 flex gap-2 flex-wrap">
                      {course.difficulty && (
                        <span className="rounded bg-yellow-50 border border-yellow-200 px-2 py-0.5">
                          {course.difficulty}
                        </span>
                      )}
                      {Array.isArray(course.categories) &&
                        course.categories.map((cat) => (
                          <span
                            key={cat}
                            className="rounded bg-yellow-50 border border-yellow-200 px-2 py-0.5"
                          >
                            {cat}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="col-span-4">
                    <span className="text-black/80">{instructorName}</span>
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Link
                      to={`/courses/${id}`}
                      state={{ course, instructorName }}
                      className="rounded-lg bg-yellow-400 px-3 py-1.5 text-black text-xs font-semibold hover:bg-yellow-300 transition"
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
