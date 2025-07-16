"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ButtonBussiness";
import { Input } from "../Input";
import { Label } from "../Label";
import { Textarea } from "../TextArea";
import { X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (contactInfo: ContactInfo) => void;
  initialData?: ContactInfo | null;
}

export function ContactInfoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ContactInfoModalProps) {
  const currentUser = useUser();

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    company: currentUser?.company || "",
    address: currentUser?.contactAddress || "",
  });

  useEffect(() => {
    if (initialData) {
      setContactInfo(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave?.(contactInfo);
    onClose();
  };

  const handleReset = () => {
    setContactInfo({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#3587A3]/80 to-[#4a9bb8]/80 backdrop-blur-sm p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">
                      Contact Information
                    </h2>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-name"
                      className="text-sm font-semibold text-white/90"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="contact-name"
                      value={contactInfo.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="bg-white/90 border-white/30 text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-email"
                      className="text-sm font-semibold text-white/90"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className="bg-white/90 border-white/30 text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-phone"
                      className="text-sm font-semibold text-white/90"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="bg-white/90 border-white/30 text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact-company"
                      className="text-sm font-semibold text-white/90"
                    >
                      Company
                    </Label>
                    <Input
                      id="contact-company"
                      value={contactInfo.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      placeholder="Enter company name"
                      className="bg-white/90 border-white/30 text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact-address"
                    className="text-sm font-semibold text-white/90"
                  >
                    Address
                  </Label>
                  <Textarea
                    id="contact-address"
                    value={contactInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter full address"
                    className="min-h-[100px] bg-white/90 border-white/30 text-gray-800 resize-none"
                  />
                </div>

                <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-4">
                  <p className="text-white/80 text-sm">
                    <span className="text-red-300">*</span> Required fields.
                    This information will be used for communication.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 flex justify-center space-x-4">
                <Button
                  onClick={handleSave}
                  className="px-8 py-2 bg-gradient-to-r from-[#3587A3] to-[#4a9bb8] hover:from-[#2a6b7f] hover:to-[#3587A3] text-white font-semibold rounded-full"
                >
                  Save
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-8 py-2 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full"
                >
                  Reset
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-8 py-2 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
