// src/pages/Admin/AdminProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const API = "https://server-blush-two-79.vercel.app";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load full user doc to confirm admin + show profile data
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    fetch(`${API}/users/email/${user.email}`)
      .then((r) => r.json())
      .then((data) => setMe(data || null))
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-24">
        <div className="h-8 w-64 bg-yellow-100 rounded mb-4" />
        <div className="h-5 w-80 bg-yellow-50 rounded mb-2" />
        <div className="h-5 w-72 bg-yellow-50 rounded mb-6" />
        <div className="h-40 rounded-2xl border border-yellow-200 bg-white" />
      </div>
    );
  }

  if (!me || me.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto mt-24 p-6 rounded-2xl border border-yellow-200 bg-white text-black shadow-sm">
        <h2 className="text-2xl font-bold">Admin access only</h2>
        <p className="mt-2 text-black/70">
          You need an admin account to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <div>
        <h1 className="text-4xl font-extrabold text-black text-center my-7">Admin Dashboard</h1>
      </div>
      {/* Profile card */}
      <div className="rounded-3xl border border-yellow-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={me.photo || "https://via.placeholder.com/150"}
            alt="Admin"
            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-200"
          />
          <div className="text-center md:text-left w-full">
            <h1 className="text-3xl font-semibold text-black">
              {me.name || "Admin"}
            </h1>
            <p className="text-black/70 mt-1">
              <span className="font-medium">Email:</span> {me.email}
            </p>
            <p className="text-black/70">
              <span className="font-medium">Role:</span> {me.role}
            </p>

            {me.bio && (
              <p className="mt-4 text-black/80 leading-relaxed bg-yellow-50 p-4 rounded">
                {me.bio}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/manage-users"
            className="text-center rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 font-semibold text-black hover:bg-yellow-100"
          >
            Manage Users
          </Link>
          <Link
            to="/manage-courses"
            className="text-center rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 font-semibold text-black hover:bg-yellow-100"
          >
            Manage Courses
          </Link>
          <Link
            to="/post-faq"
            className="text-center rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 font-semibold text-black hover:bg-yellow-100"
          >
            Post FAQs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
