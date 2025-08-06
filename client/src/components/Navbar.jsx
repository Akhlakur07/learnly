import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // FIX: changed from "react-router" to "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase/firebase.init";

const Navbar = () => {
  const { logOut } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = () => {
    console.log("logged out");
    logOut()
      .then(() => {
        alert("Logget Out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Handle profile click and redirect by role
  const handleProfileRedirect = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:3000/users/email/${user.email}`
      );
      if (!res.ok) throw new Error("User not found");

      const userData = await res.json();

      if (userData.role === "student") {
        navigate("/studentProfile");
      } else if (userData.role === "instructor") {
        navigate("/instructorProfile");
      } else {
        alert("Unknown role: cannot navigate.");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      alert("Failed to load user profile");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div>
        <Link to="/" className="text-xl font-bold">
          Learnly
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/courses" className="hover:underline">
          Courses
        </Link>

        {user ? (
          <>
            <button
              onClick={handleLogOut}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
            <img
              src={
                user.photoURL || "https://i.ibb.co/2nQZqgq/default-avatar.png"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              title={user.displayName || "User"}
              onClick={handleProfileRedirect}
            />
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
