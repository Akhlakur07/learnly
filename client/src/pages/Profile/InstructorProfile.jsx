import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const InstructorProfile = () => {
  const { user } = useContext(AuthContext);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://server-92hoyqb6a-akhlakurs-projects.vercel.app/users`)
        .then((res) => res.json())
        .then((data) => {
          const currentInstructor = data.find(
            (u) => u.email === user.email && u.role === "instructor"
          );
          setInstructorData(currentInstructor);
        })
        .catch((err) => console.error("Failed to fetch instructor:", err));

      fetch(
        `https://server-92hoyqb6a-akhlakurs-projects.vercel.app/courses?instructorEmail=${user.email}`
      )
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((err) => console.error("Failed to fetch courses:", err));
    }
  }, [user]);

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
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-black">
            {instructorData.name}
          </h2>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">Email:</span> {instructorData.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Role:</span> {instructorData.role}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-black mb-2">Bio</h3>
        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded">
          {instructorData.bio || "No bio provided."}
        </p>
      </div>

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
                className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition"
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
