"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AnimatedButton } from "@/components/ui/Button";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const statusMap = {
  not_started: {
    label: "Not Started",
    color: "text-gray-500",
    icon: <Clock className="w-6 h-6 text-gray-400" />,
  },
  pending: {
    label: "Pending Review",
    color: "text-yellow-600",
    icon: <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />,
  },
  approved: {
    label: "Approved",
    color: "text-green-600",
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    icon: <XCircle className="w-6 h-6 text-red-500" />,
  },
};

export default function KYCPage() {
  const [status, setStatus] = useState<
    "not_started" | "pending" | "approved" | "rejected"
  >("not_started");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    setStatus("pending");
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setStatus("pending");
      setFeedback(
        "Your KYC submission is under review. You will be notified once it is processed."
      );
    }, 1800);
  };

  return (
    <div className="min-h-[80vh] text-black flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-2xl border-0 bg-white/90">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-2">
              {statusMap[status].icon}
              <span
                className={`font-semibold text-lg ${statusMap[status].color}`}
              >
                {statusMap[status].label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              KYC Verification
            </h2>
            <p className="text-gray-600 mb-6">
              Complete your identity verification to unlock all features and
              ensure platform security.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-white border-gray-200 focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <Input
                    required
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-white border-gray-200 focus:border-blue-400 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Type
                  </label>
                  <Input
                    required
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    placeholder="e.g. Passport, Driver's License"
                    className="bg-white border-gray-200 focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number
                </label>
                <Input
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter your ID number"
                  className="bg-white border-gray-200 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Residential Address
                </label>
                <Input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="bg-white border-gray-200 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload ID Document
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700 border border-gray-200 rounded-lg cursor-pointer bg-white focus:outline-none focus:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {idFile && (
                  <div className="mt-2 text-xs text-gray-500">
                    {idFile.name} uploaded
                  </div>
                )}
              </div>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-2 text-sm"
                >
                  {feedback}
                </motion.div>
              )}
              <AnimatedButton
                type="submit"
                className="w-full mt-2 py-4 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                disabled={
                  submitting || status === "pending" || status === "approved"
                }
              >
                {submitting
                  ? "Submitting..."
                  : status === "approved"
                  ? "KYC Approved"
                  : status === "pending"
                  ? "Pending Review"
                  : "Submit KYC"}
              </AnimatedButton>
              {status === "rejected" && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Your KYC was rejected. Please check your information and
                  resubmit.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
