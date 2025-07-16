"use client";

import { useState } from "react";
import usersData from "@/../public/data/users.json";
import { MyInvoices } from "@/app/customers/my-invoices/MyInvoices";
import { MyNFT } from "@/app/customers/my-nft/MyNFT";

const getCurrentUser = () => {
  // For mock: always return the first user
  return usersData[0];
};

export default function AccountPage() {
  const [user, setUser] = useState(getCurrentUser());
  const [tab, setTab] = useState<
    "profile" | "invoices" | "nfts" | "upgrade" | "kyc"
  >("profile");

  // Mock upgrade handler
  const handleUpgrade = () => {
    setUser((prev) => ({ ...prev, role: "business" }));
  };

  // Mock KYC handler
  const handleKYC = () => {
    setUser((prev) => ({ ...prev, kycStatus: "pending" }));
    setTimeout(() => {
      setUser((prev) => ({ ...prev, kycStatus: "verified" }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">My Account</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              tab === "profile"
                ? "bg-[#2a849a] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              tab === "invoices"
                ? "bg-[#2a849a] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("invoices")}
          >
            My Invoices
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              tab === "nfts"
                ? "bg-[#2a849a] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("nfts")}
          >
            My NFTs
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              tab === "upgrade"
                ? "bg-[#2a849a] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("upgrade")}
          >
            Upgrade
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              tab === "kyc"
                ? "bg-[#2a849a] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("kyc")}
          >
            KYC
          </button>
        </div>
        {tab === "profile" && (
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700">Username:</span>{" "}
              {user.username}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span>{" "}
              {user.email}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Role:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-white ${
                  user.role === "business" ? "bg-green-500" : "bg-blue-500"
                }`}
              >
                {user.role}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">KYC Status:</span>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-white ${
                  user.kycStatus === "verified"
                    ? "bg-green-500"
                    : user.kycStatus === "pending"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              >
                {user.kycStatus}
              </span>
            </div>
          </div>
        )}
        {tab === "invoices" && (
          <div className="mt-4">
            <MyInvoices />
          </div>
        )}
        {tab === "nfts" && (
          <div className="mt-4">
            <MyNFT />
          </div>
        )}
        {tab === "upgrade" && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              Upgrade to Business Account
            </div>
            {user.role === "business" ? (
              <div className="text-green-600 font-bold">
                You are already a business user.
              </div>
            ) : (
              <button
                className="px-6 py-2 bg-gradient-to-r from-[#2a849a] to-[#EDCCBB] text-white rounded-lg font-bold shadow hover:from-[#307c96] hover:to-[#cfa895] transition-all"
                onClick={handleUpgrade}
              >
                Upgrade Now
              </button>
            )}
          </div>
        )}
        {tab === "kyc" && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              KYC Verification
            </div>
            <div className="mb-2">
              Current status:{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-white ${
                  user.kycStatus === "verified"
                    ? "bg-green-500"
                    : user.kycStatus === "pending"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              >
                {user.kycStatus}
              </span>
            </div>
            {user.kycStatus === "verified" ? (
              <div className="text-green-600 font-bold">
                KYC already verified.
              </div>
            ) : user.kycStatus === "pending" ? (
              <div className="text-yellow-600 font-semibold">
                KYC is being processed...
              </div>
            ) : (
              <button
                className="px-6 py-2 bg-gradient-to-r from-[#2a849a] to-[#EDCCBB] text-white rounded-lg font-bold shadow hover:from-[#307c96] hover:to-[#cfa895] transition-all"
                onClick={handleKYC}
              >
                Start KYC
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
