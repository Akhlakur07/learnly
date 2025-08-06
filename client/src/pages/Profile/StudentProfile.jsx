import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const StudentProfile = () => {
const { user } = useContext(AuthContext); // get current user from context
  console.log(user)
  const [studentData, setstudentData] = useState(null);

  useEffect(() => {
    // console.log(user)
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
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <div className="flex items-center gap-6">
        <img
          src={studentData.photo || 'https://via.placeholder.com/150'}
          alt="student"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{studentData.name}</h2>
          <p className="text-gray-600"><strong>Email:</strong> {studentData.email}</p>
          <p className="text-gray-600"><strong>Role:</strong> {studentData.role}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Bio</h3>
        <p className="text-gray-700">{studentData.bio || 'No bio provided.'}</p>
      </div>
    </div>
  );
};

export default StudentProfile;