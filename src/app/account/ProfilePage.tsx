"use client";

import usersData from "@/../public/data/users.json";
import { useState } from "react";

const getCurrentUser = () => usersData[0];

export default function ProfilePage() {
  const [user, setUser] = useState(getCurrentUser());
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser((prev) => ({ ...prev, ...form }));
    setEditMode(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10">
      <div className="w-full max-w-2xl">
        <div className="relative flex flex-col items-center bg-white rounded-3xl shadow-2xl px-8 pt-12 pb-8">
          {/* Avatar */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <img
                src={user.avatar || "/data/business-images/user-avatar-1.png"}
                alt="User avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
              />
              <span
                className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                  user.kycStatus === "verified"
                    ? "bg-green-400"
                    : user.kycStatus === "pending"
                    ? "bg-yellow-400"
                    : "bg-gray-400"
                }`}
              ></span>
            </div>
          </div>
          {/* Name & Email */}
          <div className="mt-20 text-center">
            <div className="text-3xl font-extrabold text-gray-800 mb-1 tracking-tight">
              {user.username}
            </div>
            <div className="text-gray-500 text-lg mb-2">{user.email}</div>
            <div className="flex justify-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  user.role === "business"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.role}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  user.kycStatus === "verified"
                    ? "bg-green-100 text-green-700"
                    : user.kycStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {user.kycStatus}
              </span>
            </div>
          </div>
          {/* Details Card */}
          <div className="w-full bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] rounded-2xl shadow p-8 mt-2">
            <h3 className="text-xl font-bold mb-6 text-[#2a849a] text-center">
              Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Username
                </label>
                {editMode ? (
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a849a]"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {user.username}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                {editMode ? (
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2a849a]"
                  />
                ) : (
                  <div className="text-lg font-medium text-gray-900">
                    {user.email}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              {editMode ? (
                <>
                  <button
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-gradient-to-r from-[#2a849a] to-[#EDCCBB] text-white rounded-lg font-bold shadow hover:from-[#307c96] hover:to-[#cfa895] transition-all"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  className="px-6 py-2 bg-gradient-to-r from-[#2a849a] to-[#EDCCBB] text-white rounded-lg font-bold shadow hover:from-[#307c96] hover:to-[#cfa895] transition-all"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
