import React from "react";
import { use } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

const Register = () => {
  const { createUser } = use(AuthContext);
  const navigate = useNavigate();

const handleRegister = (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const role = e.target.role.value;

  createUser(email, password)
    .then((result) => {
      const createdUser = result.user;

      console.log(createdUser)
      // Save user to database
      const saveUser = {
        name,
        email,
        role,
      };

      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveUser),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User saved to DB:", data);
          navigate('/')
        });
    })
    .catch((error) => {
      console.error("Firebase Error:", error);
    });
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a password"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block font-medium mb-1">
            Select Role
          </label>
          <select
            name="role"
            id="role"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose Role --</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to='/login' className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
