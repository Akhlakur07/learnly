import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [studentData, setstudentData] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/users`)
        .then(res => res.json())
        .then(data => {
          const currentStudent = data.find(u => u.email === user.email && u.role === 'student');
          setstudentData(currentStudent);
        })
        .catch(err => console.error('Failed to fetch student:', err));
    }
  }, [user]);

  if (!studentData) {
    return <div className="text-center mt-10 text-blue-600 font-semibold">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl border border-blue-100 rounded-xl p-6 mt-10">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={studentData.photo || 'https://via.placeholder.com/150'}
          alt="student"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
        />
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-black">{studentData.name}</h2>
          <p className="text-gray-600 mt-1"><span className="font-medium">Email:</span> {studentData.email}</p>
          <p className="text-gray-600"><span className="font-medium">Role:</span> {studentData.role}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">Bio</h3>
        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded">{studentData.bio || 'No bio provided.'}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">Enrolled Courses</h3>
        <p className="text-gray-700 bg-blue-50 p-4 rounded italic">No courses enrolled.</p>
      </div>
    </div>
  );
};

export default StudentProfile;
