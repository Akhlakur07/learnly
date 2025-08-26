// src/pages/Profile/InstructorProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const InstructorProfile = () => {
  const { user } = useContext(AuthContext);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetch(`https://server-blush-two-79.vercel.app/users`)
        .then((res) => res.json())
        .then((data) => {
          const currentInstructor = data.find(
            (u) => u.email === user.email && u.role === "instructor"
          );
          setInstructorData(currentInstructor || null);
          if (currentInstructor) {
            setNewName(currentInstructor.name || "");
            setNewBio(currentInstructor.bio || "");
          }
        });

      fetch(
        `https://server-blush-two-79.vercel.app/courses?instructorEmail=${user.email}`
      )
        .then((res) => res.json())
        .then((data) => setCourses(Array.isArray(data) ? data : []));
    }
  }, [user]);

  const handleSave = () => {
    fetch(`https://server-blush-two-79.vercel.app/users/email/${user.email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, bio: newBio }),
    })
      .then((res) => res.json())
      .then(() => {
        setInstructorData((prev) => ({ ...prev, name: newName, bio: newBio }));
        setEditing(false);
      });
  };

  if (!instructorData) {
    return (
      <div className="text-center mt-10 text-black font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-30 bg-white rounded-2xl shadow-md border border-yellow-200">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={instructorData.photo || "https://via.placeholder.com/150"}
          alt="Instructor"
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
                    setNewName(instructorData.name || "");
                    setNewBio(instructorData.bio || "");
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
                {instructorData.name}
              </h2>
              <p className="text-black/70 mt-1">
                <span className="font-medium">Email:</span>{" "}
                {instructorData.email}
              </p>
              <p className="text-black/70">
                <span className="font-medium">Role:</span>{" "}
                {instructorData.role}
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
        <>
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-black mb-2">Bio</h3>
            <p className="text-black/80 leading-relaxed bg-yellow-50 p-4 rounded">
              {instructorData.bio || "No bio provided."}
            </p>
          </div>

          {/* Simple stats + link to /my-courses */}
          <div className="mt-8 p-5 rounded-2xl border border-yellow-200 bg-white shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/70">Total Courses</p>
                <p className="text-3xl font-extrabold text-black">
                  {courses.length}
                </p>
              </div>
              <Link
                to="/my-courses"
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
              >
                View Your Courses
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorProfile;