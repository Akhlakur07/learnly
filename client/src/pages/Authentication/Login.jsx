import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signInUser(email, password)
      .then((result) => {
        const user = result.user;
        console.log("Logged in user:", user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error.message);
      });
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-4 mt-20">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgba(250,204,21,0.18),transparent_60%)]" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-[-5%] h-64 w-64 rounded-full bg-yellow-200/30 blur-2xl" />
      </div>

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
              <label htmlFor="email" className="block text-sm font-semibold text-black">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none ring-0 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="mt-2 w-full rounded-xl border border-yellow-300 bg-white px-4 py-2.5 text-black placeholder-black/40 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-300/30 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-5 py-3 text-white font-semibold hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-black/70">
            Don’t have an account?{" "}
            <Link to="/register" className="font-semibold text-black underline underline-offset-4 hover:opacity-80">
              Register
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

export default Login;