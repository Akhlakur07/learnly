// src/pages/Profile/InstructorProfile.jsx
import React, { useContext, useEffect, useState } from "react";
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
        .then((data) => setCourses(data));
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
      <div className="text-center mt-10 text-blue-600 font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg border border-blue-100">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={instructorData.photo || "https://via.placeholder.com/150"}
          alt="Instructor"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
        />
        <div className="text-center md:text-left w-full">
          {editing ? (
            <div className="space-y-3">
              <input
                className="w-full border border-blue-300 rounded px-3 py-2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
              />
              <textarea
                className="w-full border border-blue-300 rounded px-3 py-2"
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
              <h2 className="text-3xl font-bold text-black">
                {instructorData.name}
              </h2>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Email:</span> {instructorData.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Role:</span> {instructorData.role}
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
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-black mb-2">Bio</h3>
          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded">
            {instructorData.bio || "No bio provided."}
          </p>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-black mb-4">Your Courses</h3>
        {courses.length === 0 ? (
          <p className="text-gray-600 italic">
            You haven't added any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm"
              >
                <h4 className="text-lg font-bold text-black">{course.title}</h4>
                <p className="text-gray-700 mt-2">{course.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;