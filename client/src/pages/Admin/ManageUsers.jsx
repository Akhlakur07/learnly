// src/pages/Admin/ManageUsers.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const { user } = useContext(AuthContext);

  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // manage modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  // load current user (to confirm admin)
  useEffect(() => {
    if (!user?.email) {
      setLoadingMe(false);
      return;
    }
    fetch(`https://server-blush-two-79.vercel.app/users/email/${user.email}`)
      .then((res) => res.json())
      .then((data) => setMe(data || null))
      .finally(() => setLoadingMe(false));
  }, [user?.email]);

  // load all users (but exclude admins)
  useEffect(() => {
    fetch("https://server-blush-two-79.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setUsers(list.filter((u) => u.role !== "admin"));
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const openManage = (u) => {
    setEditingUser(u);
    setEditName(u.name || "");
    setEditBio(u.bio || "");
  };

  const saveManage = () => {
    if (!editingUser) return;
    const email = editingUser.email;

    fetch(
      `https://server-blush-two-79.vercel.app/users/email/${encodeURIComponent(
        email
      )}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, bio: editBio }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setUsers((prev) =>
          prev.map((x) =>
            x.email === email ? { ...x, name: editName, bio: editBio } : x
          )
        );
        setEditingUser(null);
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "User info updated.",
          confirmButtonColor: "#000000",
        });
      });
  };

  const handleDelete = (u) => {
    const id = u._id?.$oid || u._id;
    Swal.fire({
      title: "Delete this user?",
      text: "This will remove the user from MongoDB and Firebase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#facc15",
    }).then((r) => {
      if (!r.isConfirmed) return;

      fetch(`https://server-blush-two-79.vercel.app/users/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          return fetch(
            "https://server-blush-two-79.vercel.app/admin/deleteFirebaseUser",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: u.email }),
            }
          );
        })
        .then(() => {
          setUsers((prev) =>
            prev.filter((x) => (x._id?.$oid || x._id) !== id)
          );
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "User removed.",
            confirmButtonColor: "#000000",
          });
        });
    });
  };

  if (loadingMe || loadingUsers) {
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
          You need an admin account to view and manage users.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-black">Manage Users</h1>
        <p className="text-black/70 mt-1">All non-admin users.</p>
      </div>

      <div className="rounded-2xl border border-yellow-200 overflow-hidden bg-white">
        <div className="grid grid-cols-12 bg-yellow-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black">
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <ul className="divide-y divide-yellow-200">
          {users.map((u) => {
            const id = u._id?.$oid || u._id;
            return (
              <li
                key={id}
                className="grid grid-cols-12 px-4 py-3 items-center"
              >
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.photo || "https://via.placeholder.com/40"}
                      alt={u.name || "user"}
                      className="w-9 h-9 rounded-full object-cover border border-yellow-200"
                    />
                    <span className="font-semibold text-black">
                      {u.name || "Unnamed"}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <span className="text-black/80 text-sm">{u.email}</span>
                </div>

                <div className="col-span-2">
                  <span className="inline-block text-xs font-semibold px-2 py-1 rounded border bg-white text_black border-yellow-300">
                    {u.role || "student"}
                  </span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openManage(u)}
                    className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-semibold hover:bg-yellow-300"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => handleDelete(u)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
          {users.length === 0 && (
            <li className="px-4 py-6 text-center text-black/70">
              No users found.
            </li>
          )}
        </ul>
      </div>

      {/* Manage Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-2xl border border-yellow-200 bg-white p-5">
            <h3 className="text-xl font-bold text-black mb-3">Manage User</h3>

            <label className="block text-sm font-semibold text-black mb-1">
              Name
            </label>
            <input
              className="w-full border border-yellow-300 rounded px-3 py-2"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="User name"
            />

            <label className="block text-sm font-semibold text-black mt-3 mb-1">
              Bio
            </label>
            <textarea
              className="w-full border border-yellow-300 rounded px-3 py-2"
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="User bio"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg bg-white border border-yellow-300 text-black px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveManage}
                className="rounded-lg bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;