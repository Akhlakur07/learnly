import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const StudentProfile = () => {
  const { user } = useContext(AuthContext);

  const [studentData, setStudentData] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    fetch(`https://server-blush-two-79.vercel.app/users/email/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setStudentData(data);
        setNewName(data?.name || "");
        setNewBio(data?.bio || "");
      });
  }, [user?.email]);

  useEffect(() => {
    if (!studentData) return;

    fetch("https://server-blush-two-79.vercel.app/courses")
      .then((res) => res.json())
      .then((list) => {
        const all = Array.isArray(list) ? list : [];
        const byId = new Map(all.map((c) => [c._id?.$oid || c._id, c]));

        const enrolledIds = Array.isArray(studentData.enrolledCourses)
          ? studentData.enrolledCourses
          : [];

        const completedIds = Array.isArray(studentData.completedCourses)
          ? studentData.completedCourses
          : [];
        const completedSet = new Set(completedIds);

        const enrolledItems = enrolledIds
          .filter((id) => !completedSet.has(id))
          .map((id) => byId.get(id))
          .filter(Boolean);
        setEnrolled(enrolledItems);

        const marks = studentData.completedCourseMarks || {};
        const completedItems = completedIds
          .map((id) => ({
            id,
            course: byId.get(id) || null,
            score: typeof marks[id] === "number" ? marks[id] : null,
          }))
          .filter((item) => item.course);
        setCompleted(completedItems);
      });
  }, [studentData]);

  const handleSave = () => {
    fetch(`https://server-blush-two-79.vercel.app/users/email/${user.email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, bio: newBio }),
    })
      .then((res) => res.json())
      .then(() => {
        setStudentData((prev) => ({ ...prev, name: newName, bio: newBio }));
        setEditing(false);
      });
  };

  if (!studentData) {
    return (
      <div className="text-center mt-24 text-black font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl border border-yellow-200 rounded-2xl p-6 my-36 mb-22">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={studentData.photo || "https://via.placeholder.com/150"}
          alt="student"
          className="w-32 h-32 rounded-full object-cover border-4 border-yellow-200"
        />
        <div className="text-center md:text-left w-full">
          {editing ? (
            <div className="space-y-3">
              <input
                className="w-full border border-yellow-300 rounded px-3 py-2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
              />
              <textarea
                className="w-full border border-yellow-300 rounded px-3 py-2"
                rows={3}
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Your bio"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-black text-white px-4 py-2 font-semibold hover:opacity-90"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNewName(studentData.name || "");
                    setNewBio(studentData.bio || "");
                    setEditing(false);
                  }}
                  className="rounded-lg bg-yellow-400 text-black px-4 py-2 font-semibold hover:bg-yellow-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-black">
                {studentData.name}
              </h2>
              <p className="text-black/70 mt-1">
                <span className="font-medium">Email:</span> {studentData.email}
              </p>
              <p className="text-black/70">
                <span className="font-medium">Role:</span> {studentData.role}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-3 rounded-lg bg-yellow-400 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-300"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {!editing && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-black mb-2">Bio</h3>
          <p className="text-black/80 leading-relaxed bg-yellow-50 p-4 rounded">
            {studentData.bio || "No bio provided."}
          </p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">
          Enrolled Courses
        </h3>

        {enrolled.length === 0 ? (
          <p className="text-black/70 bg-yellow-50 p-4 rounded italic">
            No active courses in progress.
          </p>
        ) : (
          <div className="rounded-xl border border-yellow-200 overflow-hidden">
            <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
              <div className="col-span-8">Course</div>
              <div className="col-span-4 text-right">Action</div>
            </div>

            <ul className="divide-y divide-yellow-200 bg-white">
              {enrolled.map((c) => {
                const id = c._id?.$oid || c._id;
                return (
                  <li
                    key={id}
                    className="grid grid-cols-12 items-center px-4 py-3"
                  >
                    <div className="col-span-8">
                      <span className="font-semibold text-black">
                        {c.title}
                      </span>
                    </div>
                    <div className="col-span-4 flex justify-end">
                      <Link
                        to={`/continue/${id}`}
                        state={{ course: c }}
                        className="rounded-lg bg-black px-3 py-1.5 text-white text-xs font-semibold hover:opacity-90"
                      >
                        Continue Course
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-black mb-2">
          Completed Courses
        </h3>

        {completed.length === 0 ? (
          <p className="text-black/70 bg-yellow-50 p-4 rounded italic">
            No completed courses yet.
          </p>
        ) : (
          <div className="rounded-xl border border-yellow-200 overflow-hidden">
            <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
              <div className="col-span-7">Course</div>
              <div className="col-span-3 text-right">Score</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <ul className="divide-y divide-yellow-200 bg-white">
              {completed.map(({ id, course, score }) => (
                <li
                  key={id}
                  className="grid grid-cols-12 items-center px-4 py-3"
                >
                  <div className="col-span-7">
                    <span className="font-semibold text-black">
                      {course.title}
                    </span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-black/80">
                      {typeof score === "number" ? `${score}%` : "—"}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Link
                      to={`/continue/${id}`}
                      state={{ course }}
                      className="rounded-lg bg-yellow-400 px-3 py-1.5 text-black text-xs font-semibold hover:bg-yellow-300"
                      title="Review content and download your certificate"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;