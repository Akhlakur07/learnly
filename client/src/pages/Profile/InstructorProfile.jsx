import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const InstructorProfile = () => {
  const { user } = useContext(AuthContext); // get current user from context
  console.log(user)
  const [instructorData, setInstructorData] = useState(null);

  useEffect(() => {
    // console.log(user)
    if (user?.email) {
      fetch(`http://localhost:3000/users`)
        .then(res => res.json())
        .then(data => {
          const currentInstructor = data.find(u => u.email === user.email && u.role === 'instructor');
          setInstructorData(currentInstructor);
        })
        .catch(err => console.error('Failed to fetch instructor:', err));
    }
  }, [user]);

  if (!instructorData) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <div className="flex items-center gap-6">
        <img
          src={instructorData.photo || 'https://via.placeholder.com/150'}
          alt="Instructor"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{instructorData.name}</h2>
          <p className="text-gray-600"><strong>Email:</strong> {instructorData.email}</p>
          <p className="text-gray-600"><strong>Role:</strong> {instructorData.role}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Bio</h3>
        <p className="text-gray-700">{instructorData.bio || 'No bio provided.'}</p>
      </div>
    </div>
  );
};

export default InstructorProfile;
