import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/firebase.init";

const Navbar = () => {
  const { logOut } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsub();
  }, []);

  // dashboard route by role (simple)
  const handleDashboard = () => {
    if (!user?.email) {
      navigate("/login");
      return;
    }
    fetch(`https://server-blush-two-79.vercel.app/users/email/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.role === "student") navigate("/studentProfile");
        else if (data.role === "instructor") navigate("/instructorProfile");
        else if (data.role === "admin") navigate("/adminProfile");
      });
  };

  const handleLogOut = () => {
    logOut().then(() => {
      alert("Logged out");
      navigate("/");
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b border-yellow-200">
      <nav className="mx-auto max-w-7xl px-4">
        {/* bigger height */}
        <div className="flex h-20 items-center">
          {/* Left: Logo */}
          <div className="min-w-[140px]">
            <Link to="/" className="flex items-center gap-3">
              <span className="inline-block h-8 w-8 rounded-lg bg-yellow-400" />
              <span className="text-2xl font-extrabold text-black leading-none">
                Learnly
              </span>
            </Link>
          </div>

          {/* Middle: Nav items */}
          <div className="flex-1">
            <ul className="flex justify-center items-center gap-8">
              <li>
                <Link
                  to="/"
                  className="text-base md:text-lg font-semibold text-black/80 hover:text-black"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-base md:text-lg font-semibold text-black/80 hover:text-black"
                >
                  View Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-base md:text-lg font-semibold text-black/80 hover:text-black"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <button
                  onClick={handleDashboard}
                  className="text-base md:text-lg font-semibold text-black/80 hover:text-black"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Right: Auth button */}
          <div className="min-w-[140px] flex justify-end">
            {user ? (
              <button
                onClick={handleLogOut}
                className="rounded-xl bg-black px-5 py-3 text-white text-sm md:text-base font-semibold hover:opacity-90"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-yellow-400 px-5 py-3 text-black text-sm md:text-base font-semibold hover:bg-yellow-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;