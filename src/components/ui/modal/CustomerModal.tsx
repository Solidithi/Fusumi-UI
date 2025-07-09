"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ButtonBussiness"
import { X } from "lucide-react"
import { useState } from "react"

interface CustomerFieldsConfig {
  email: boolean
  fullName: boolean
  phone: boolean
  address: boolean
  zipcode: boolean
  nationality: boolean
  personalId: boolean
  sex: boolean
  birthdate: boolean
  image: boolean
  taxId: boolean
  kycImage: boolean
}

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (fieldsConfig: CustomerFieldsConfig) => void
}

export function CustomerModal({ isOpen, onClose, onSave }: CustomerModalProps) {
  const [fieldsConfig, setFieldsConfig] = useState<CustomerFieldsConfig>({
    // Priority 1 - Essential fields
    fullName: false,
    email: false,
    phone: false,

    // Priority 2 - Contact details
    address: false,
    zipcode: false,
    nationality: false,

    // Priority 3 - Personal information
    personalId: false,
    sex: false,
    birthdate: false,

    // Priority 4 - Documentation
    image: false,
    taxId: false,
    kycImage: false,
  })

  const fieldLabels = [
    // Row 1 - Essential Information
    { key: "email" as keyof CustomerFieldsConfig, label: "Email" },
    { key: "fullName" as keyof CustomerFieldsConfig, label: "Full Name" },
    { key: "phone" as keyof CustomerFieldsConfig, label: "Phone" },

    // Row 2 - Location Information
    { key: "address" as keyof CustomerFieldsConfig, label: "Address" },
    { key: "zipcode" as keyof CustomerFieldsConfig, label: "Zipcode" },
    { key: "nationality" as keyof CustomerFieldsConfig, label: "Nationality" },

    // Row 3 - Personal Details
    { key: "personalId" as keyof CustomerFieldsConfig, label: "Personal ID" },
    { key: "sex" as keyof CustomerFieldsConfig, label: "Sex" },
    { key: "birthdate" as keyof CustomerFieldsConfig, label: "Birthdate" },

    // Row 4 - Documentation
    { key: "image" as keyof CustomerFieldsConfig, label: "Image" },
    { key: "taxId" as keyof CustomerFieldsConfig, label: "Tax ID" },
    { key: "kycImage" as keyof CustomerFieldsConfig, label: "KYC Image" },
  ]

  const toggleField = (field: keyof CustomerFieldsConfig) => {
    setFieldsConfig((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = () => {
    onSave?.(fieldsConfig)
    onClose()
  }

  const handleReset = () => {
    setFieldsConfig({
      fullName: false,
      email: false,
      phone: false,
      address: false,
      zipcode: false,
      nationality: false,
      personalId: false,
      sex: false,
      birthdate: false,
      image: false,
      taxId: false,
      kycImage: false,
    })
  }

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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#3587A3]/80 to-[#4a9bb8]/80 backdrop-blur-sm p-6 border-b border-white/20 relative">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">CUSTOMER INFO FIELDS</h2>
                  <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-red-300 text-sm mt-2">
                  <span className="text-red-400">*</span> Check the box if the field is required{" "}
                  <span className="text-red-400">*</span>
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-3 gap-8">
                  {fieldLabels.map((field, index) => (
                    <motion.div
                      key={field.key}
                      className="flex items-center space-x-3 cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleField(field.key)}
                    >
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          fieldsConfig[field.key]
                            ? "bg-white/90 border-white/90"
                            : "border-white/40 hover:border-white/60 group-hover:bg-white/10"
                        }`}
                      >
                        {fieldsConfig[field.key] && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-[#3587A3] rounded-sm"
                          />
                        )}
                      </div>
                      <label className="text-white/90 font-medium text-lg cursor-pointer group-hover:text-white transition-colors">
                        {field.label}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 flex justify-center space-x-4">
                <Button
                  onClick={handleSave}
                  className="px-12 py-3 bg-gradient-to-r from-[#3587A3] to-[#EDCCBB] hover:from-[#2a6b7f] hover:to-[#d4b8a3] text-white font-semibold rounded-full text-lg"
                >
                  Save
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-12 py-3 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full text-lg"
                >
                  Reset
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="px-12 py-3 bg-gray-500/60 border-gray-400/30 text-white hover:bg-gray-500/70 rounded-full text-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
