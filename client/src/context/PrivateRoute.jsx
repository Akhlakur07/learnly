import React, { use } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = use(AuthContext);
  const location = useLocation()
  if (loading) {
    return (<div>
        <h1>Loading...</h1>
    </div>)
  }
  if (user && user?.email) {
    return children;
  }
  return <Navigate state={location.pathname} to="/login"></Navigate>;
};

export default PrivateRoute;
