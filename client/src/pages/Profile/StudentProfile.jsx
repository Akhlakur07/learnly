import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [studentData, setStudentData] = useState(null);
  const [enrolled, setEnrolled] = useState([]);

  // 1) Load current student's doc (name, email, role, enrolledCourses, etc.)
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/users/email/${user.email}`)
      .then((res) => res.json())
      .then((data) => setStudentData(data));
  }, [user?.email]);

  // 2) Load course details for enrolled course IDs
  useEffect(() => {
    if (!studentData?.enrolledCourses || studentData.enrolledCourses.length === 0) {
      setEnrolled([]);
      return;
    }

    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((list) => {
        const ids = new Set(studentData.enrolledCourses);
        const items = (list || []).filter(
          (c) => ids.has(c._id?.$oid || c._id)
        );
        setEnrolled(items);
      });
  }, [studentData]);

  if (!studentData) {
    return (
      <div className="text-center mt-24 text-black font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl border border-yellow-200 rounded-2xl p-6 my-36 mb-22">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={studentData.photo || "https://via.placeholder.com/150"}
          alt="student"
          className="w-32 h-32 rounded-full object-cover border-4 border-yellow-200"
        />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-black">{studentData.name}</h2>
          <p className="text-black/70 mt-1">
            <span className="font-medium">Email:</span> {studentData.email}
          </p>
          <p className="text-black/70">
            <span className="font-medium">Role:</span> {studentData.role}
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">Bio</h3>
        <p className="text-black/80 leading-relaxed bg-yellow-50 p-4 rounded">
          {studentData.bio || "No bio provided."}
        </p>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">Enrolled Courses</h3>

        {enrolled.length === 0 ? (
          <p className="text-black/70 bg-yellow-50 p-4 rounded italic">
            No courses enrolled.
          </p>
        ) : (
          <div className="rounded-xl border border-yellow-200 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
              <div className="col-span-8">Course</div>
              <div className="col-span-4 text-right">Action</div>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-yellow-200 bg-white">
              {enrolled.map((c) => {
                const id = c._id?.$oid || c._id;
                return (
                  <li key={id} className="grid grid-cols-12 items-center px-4 py-3">
                    <div className="col-span-8">
                      <span className="font-semibold text-black">{c.title}</span>
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
    </div>
  );
};

export default StudentProfile;