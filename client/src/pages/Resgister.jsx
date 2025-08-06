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
    const photo = e.target.photo.value;
    const bio = e.target.bio.value;

    createUser(email, password)
      .then((result) => {
        console.log(result);

        const saveUser = {
          name,
          email,
          role,
          photo,
          bio,
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
            navigate("/");
          });
      })
      .catch((error) => {
        console.error("Firebase Error:", error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8">
          Create Account
        </h2>

        <div className="mb-5">
          <label
            htmlFor="name"
            className="block font-semibold mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block font-semibold mb-1 "
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block font-semibold mb-1 "
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a password"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="photo"
            className="block font-semibold mb-1 "
          >
            Photo URL
          </label>
          <input
            type="text"
            name="photo"
            id="photo"
            className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your photo URL"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="bio"
            className="block font-semibold mb-1 "
          >
            Bio
          </label>
          <textarea
            name="bio"
            id="bio"
            rows="3"
            className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us something about yourself..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label
            htmlFor="role"
            className="block font-semibold mb-1"
          >
            Select Role
          </label>
          <select
            name="role"
            id="role"
            className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose Role --</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-blue-800">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
