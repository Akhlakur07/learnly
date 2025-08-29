import React from "react";
import { use } from "react";
import { AuthContext } from "../../context/AuthContext";
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

        const saveUser = { name, email, role, photo, bio };

        fetch("https://server-blush-two-79.vercel.app/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen bg-white pt-24 px-4 mt-11">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(250,204,21,0.18),transparent_60%)]" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-[-5%] h-64 w-64 rounded-full bg-yellow-200/30 blur-2xl" />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-yellow-200 bg-white p-8 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-black text-center">
            Create your account
          </h2>
          <p className="mt-3 text-center text-black/70">
            Join and start learning today
          </p>

          <form
            onSubmit={handleRegister}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Name */}
            <div className="md:col-span-1">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-black"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="Enter your name"
              />
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="you@example.com"
              />
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="••••••••"
              />
            </div>

            <div className="md:col-span-1">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-black"
              >
                Select Role
              </label>
              <select
                name="role"
                id="role"
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
              >
                <option value="">-- Choose Role --</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="photo"
                className="block text-sm font-semibold text-black"
              >
                Photo URL
              </label>
              <input
                type="text"
                name="photo"
                id="photo"
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="Paste your photo URL"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-black"
              >
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows="4"
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="Tell us something about yourself..."
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-black px-5 py-3 text-white font-semibold hover:opacity-90 transition"
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-black/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black underline underline-offset-4 hover:opacity-80"
            >
              Login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-black/50">
          By continuing, you agree to Learnly’s Terms & Privacy.
        </p>
      </div>
    </div>
  );
};

export default Register;
