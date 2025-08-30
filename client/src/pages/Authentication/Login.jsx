import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // clear any old error

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signInUser(email, password)
      .then((result) => {
        console.log("Logged in user:", result.user);
        navigate("/");
      })
      .catch((err) => {
        // check for auth-specific codes
        console.error("Login error:", err);
        setError("Email or password is incorrect");
      });
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-4 mt-20">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-yellow-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <h2 className="mt-4 text-3xl font-extrabold text-black text-center">
            Welcome back
          </h2>
          <p className="mt-1 text-center text-black/70">
            Sign in to continue learning
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
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
                required
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
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
                required
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-5 py-3 text-white font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-black/70">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black underline underline-offset-4 hover:opacity-80"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
