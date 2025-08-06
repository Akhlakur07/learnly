import React from "react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/addCourse">
        <button className="btn">Add Course</button>
      </Link>
    </div>
  );
};

export default Home;
