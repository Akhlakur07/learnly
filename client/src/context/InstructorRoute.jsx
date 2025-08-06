import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from './AuthContext';

const InstructorRoute = ({ children }) => {
  const { user, loading, role } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (user && role === 'instructor') {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default InstructorRoute;
