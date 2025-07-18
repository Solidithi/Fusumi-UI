"use client";

import usersData from "@/../public/data/users.json";
import { useState } from "react";

const getCurrentUser = () => usersData[0];

export default function UpgradePage() {
  const [user, setUser] = useState(getCurrentUser());
  const [upgraded, setUpgraded] = useState(user.role === "business");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setUpgraded(true);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Upgrade to Business Account
      </h2>
      <div className="mb-6 text-gray-700 text-center">
        Unlock advanced features, business analytics, invoice creation, and more
        by upgrading your account to{" "}
        <span className="font-semibold text-[#2a849a]">Business</span>.
      </div>
      <ul className="mb-8 space-y-2 text-gray-700">
        <li className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#2a849a] rounded-full"></span>{" "}
          Create and manage invoices
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#2a849a] rounded-full"></span>{" "}
          Access business analytics dashboard
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#2a849a] rounded-full"></span>{" "}
          List products, get access to product monetization
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#2a849a] rounded-full"></span>{" "}
          Enhanced KYC/KYB verification
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#2a849a] rounded-full"></span>{" "}
          Priority support
        </li>
      </ul>
      <div className="flex flex-col items-center gap-4">
        {upgraded ? (
          <div className="text-green-600 font-bold text-lg">
            You are already a business user.
          </div>
        ) : (
          <button
            className="px-8 py-3 bg-gradient-to-r from-[#2a849a] to-[#EDCCBB] text-white rounded-lg font-bold shadow hover:from-[#307c96] hover:to-[#cfa895] transition-all text-lg disabled:opacity-60"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? "Upgrading..." : "Upgrade Now"}
          </button>
        )}
      </div>
    </div>
  );
}
