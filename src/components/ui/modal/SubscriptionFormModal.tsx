"use client";

import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Upload, DollarSign, Trash2 } from "lucide-react";

import { Label } from "@radix-ui/react-label";
import {
  ServiceSubscriptionData,
  SubscriptionFormData,
} from "@/types/subscription";
import { Input } from "../Input";
import { Portal } from "../Portal";
import { AnimatedButton } from "../Button";
import Image from "next/image";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../Select";

interface SubscriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionData: ServiceSubscriptionData;
}

export function SubscriptionFormModal({
  isOpen,
  onClose,
  subscriptionData,
}: SubscriptionFormModalProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const handleInputChange = (
    field: keyof SubscriptionFormData,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (
    field: keyof SubscriptionFormData,
    file: File | null
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: file,
    }));
    // Create preview URL for image files
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [field]: previewUrl,
      }));
    } else {
      // Remove preview if no file or not an image
      setImagePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[field];
        return newPreviews;
      });
    }
  };

  const handleRemoveFile = (field: keyof SubscriptionFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    // Clean up preview URL
    if (imagePreviews[field]) {
      URL.revokeObjectURL(imagePreviews[field]);
      setImagePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[field];
        return newPreviews;
      });
    }
  };

  const handleClose = () => {
    // Clean up all preview URLs
    Object.values(imagePreviews).forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Subscription data:", {
      serviceId: subscriptionData.serviceId,
      formData,
    });

    setIsSubmitting(false);
    onClose();
  };

  const renderField = (fieldName: keyof typeof subscriptionData.formConfig) => {
    if (!subscriptionData.formConfig[fieldName]) return null;

    const fieldConfig = {
      email: {
        label: "Email Address",
        type: "email",
        placeholder: "Enter your email address",
      },
      fullName: {
        label: "Full Name",
        type: "text",
        placeholder: "Enter your full name",
      },
      phone: {
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter your phone number",
      },
      address: {
        label: "Address",
        type: "text",
        placeholder: "Enter your address",
      },
      zipcode: {
        label: "Zip Code",
        type: "text",
        placeholder: "Enter your zip code",
      },
      nationality: {
        label: "Nationality",
        type: "text",
        placeholder: "Enter your nationality",
      },
      personalId: {
        label: "Personal ID",
        type: "text",
        placeholder: "Enter your personal ID",
      },
      sex: {
        label: "Gender",
        type: "select",
        options: ["male", "female", "other"],
        placeholder: "",
      },
      birthdate: {
        label: "Birth Date",
        type: "date",
        placeholder: "",
      },
      image: {
        label: "Profile Image",
        type: "file",
        accept: "image/*",
      },
      taxId: {
        label: "Tax ID",
        type: "text",
        placeholder: "Enter your tax ID",
      },
      kycImage: {
        label: "KYC Document",
        type: "file",
        accept: "image/*,.pdf",
      },
    };

    const config = fieldConfig[fieldName];
    const isFileField = config.type === "file";
    return (
      <motion.div
        key={fieldName}
        variants={itemVariants as any}
        className={`space-y-2 text-black  ${
          isFileField ? "col-span-full" : ""
        }`}
      >
        <Label
          htmlFor={fieldName}
          className="text-sm font-medium text-gray-700"
        >
          {config.label}
        </Label>

        {config.type === "select" && fieldName === "sex" ? (
          //
          <select
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        ) : config.type === "file" ? (
          //   <div className="relative">
          //     <Input
          //       id={fieldName}
          //       type="file"
          //       accept={"accept" in config ? config.accept : undefined}
          //       onChange={(e) =>
          //         handleFileChange(fieldName, e.target.files?.[0] || null)
          //       }
          //       className="hidden"
          //     />
          //     <Label
          //       htmlFor={fieldName}
          //       className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#2a849a] transition-colors duration-200"
          //     >
          //       <div className="text-center">
          //         <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          //         <span className="text-sm text-gray-600">
          //           {formData[fieldName]
          //             ? (formData[fieldName] as File).name
          //             : `Upload ${config.label}`}
          //         </span>
          //       </div>
          //     </Label>
          //   </div>
          <div className="space-y-4">
            {/* File Upload Area */}
            <div className="relative">
              <Input
                id={fieldName}
                type="file"
                accept={"accept" in config ? config.accept : undefined}
                onChange={(e) =>
                  handleFileChange(fieldName, e.target.files?.[0] || null)
                }
                className="hidden"
              />
              <Label
                htmlFor={fieldName}
                className={`flex items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
                  formData[fieldName]
                    ? "border-[#2a849a] bg-[#2a849a]/5"
                    : "border-gray-300 hover:border-[#2a849a]"
                } ${imagePreviews[fieldName] ? "h-auto p-4" : "h-32"}`}
              >
                {imagePreviews[fieldName] ? (
                  // Image Preview
                  <div className="w-full space-y-3">
                    <div className="relative w-full max-w-xs mx-auto">
                      <Image
                        src={imagePreviews[fieldName] || "/placeholder.svg"}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <AnimatedButton
                        // type="button"
                        // variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 w-8 h-8 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFile(fieldName);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </AnimatedButton>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {(formData[fieldName] as File)?.name}
                      </p>
                      <p className="text-xs text-gray-500">Click to change</p>
                    </div>
                  </div>
                ) : formData[fieldName] ? (
                  // Non-image file preview
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-[#2a849a] rounded-lg flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {(formData[fieldName] as File)?.name}
                      </p>
                      <p className="text-xs text-gray-500">Click to change</p>
                    </div>
                    <AnimatedButton
                      //   type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFile(fieldName);
                      }}
                      className="mt-2"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </AnimatedButton>
                  </div>
                ) : (
                  // Upload placeholder
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">
                      Upload {config.label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {"accept" in config && config.accept?.includes("image")
                        ? "PNG, JPG, GIF up to 10MB"
                        : "PDF, PNG, JPG up to 10MB"}
                    </p>
                  </div>
                )}
              </Label>
            </div>
          </div>
        ) : (
          <Input
            id={fieldName}
            type={config.type}
            placeholder={"placeholder" in config ? config.placeholder : ""}
            value={(formData[fieldName] as string) || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full"
          />
        )}
      </motion.div>
    );
  };
  // Separate file fields from regular fields
  const regularFields = (
    Object.keys(subscriptionData.formConfig) as Array<
      keyof typeof subscriptionData.formConfig
    >
  ).filter(
    (fieldName) =>
      subscriptionData.formConfig[fieldName] &&
      !["image", "kycImage"].includes(fieldName)
  );

  const fileFields = (
    Object.keys(subscriptionData.formConfig) as Array<
      keyof typeof subscriptionData.formConfig
    >
  ).filter(
    (fieldName) =>
      subscriptionData.formConfig[fieldName] &&
      ["image", "kycImage"].includes(fieldName)
  );
  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleClose}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto relative"
              variants={modalVariants as any}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <motion.h2
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Subscribe to {subscriptionData.serviceName}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-gray-600 mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    by {subscriptionData.businessName}
                  </motion.p>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Price Banner */}
              <motion.div
                className="bg-[#2a849a] text-white p-4 mx-6 mt-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    ${subscriptionData.price}/month
                  </span>
                </div>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <motion.div
                  className="space-y-6"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Regular Fields in Grid */}
                  {regularFields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {regularFields.map((fieldName) => renderField(fieldName))}
                    </div>
                  )}

                  {/* File Fields - Full Width */}
                  {fileFields.length > 0 && (
                    <div className="space-y-6">
                      {fileFields.map((fieldName) => renderField(fieldName))}
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AnimatedButton
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 bg-transparent"
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    // type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2a849a] rounded-xl p-3 hover:bg-[#2a849a]/90 text-white px-8"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                        <span>Processing...</span>
                      </motion.div>
                    ) : (
                      `Subscribe for $${subscriptionData.price}/month`
                    )}
                  </AnimatedButton>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
