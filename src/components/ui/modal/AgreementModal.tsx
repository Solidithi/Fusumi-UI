"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ButtonBussiness" 
import { FileUpload } from "../FilesUpload" 
import { X, FileText } from "lucide-react"
import { useState, useEffect } from "react"

interface AgreementsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (files: string[]) => void
  selectedFiles?: string[]
}

export function AgreementsModal({ isOpen, onClose, onSave, selectedFiles = [] }: AgreementsModalProps) {
  const [files, setFiles] = useState<string[]>(selectedFiles)

  useEffect(() => {
    setFiles(selectedFiles)
  }, [selectedFiles])

  const handleSave = () => {
    onSave?.(files)
    onClose()
  }

  const handleReset = () => {
    setFiles([])
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
              <div className="bg-gradient-to-r from-[#3587A3]/80 to-[#4a9bb8]/80 backdrop-blur-sm p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">Agreements & Binding</h2>
                  </div>
                  <Button onClick={onClose} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-white/80 text-sm mt-2">
                  Upload legal documents, contracts, and binding agreements for this offer.
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-yellow-50/10 border border-yellow-200/20 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-200 mb-2">Recommended Documents:</h4>
                    <ul className="text-sm text-yellow-100/90 space-y-1">
                      <li>• Service Agreement or Contract</li>
                      <li>• Terms and Conditions</li>
                      <li>• Non-Disclosure Agreement (NDA)</li>
                      <li>• Statement of Work (SOW)</li>
                      <li>• Privacy Policy</li>
                      <li>• Payment Terms Document</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Upload Documents</h3>
                    <FileUpload accept=".pdf,.doc,.docx,.txt" multiple={true} />
                  </div>

                  <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-200 mb-2">File Requirements:</h4>
                    <ul className="text-sm text-blue-100/90 space-y-1">
                      <li>• Supported formats: PDF, DOC, DOCX, TXT</li>
                      <li>• Maximum file size: 10MB per file</li>
                      <li>• Multiple files can be uploaded</li>
                      <li>• Files should be legally binding documents</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/20 flex justify-center space-x-4">
                <Button
                  onClick={handleSave}
                  className="px-8 py-2 bg-gradient-to-r from-[#3587A3] to-[#4a9bb8] hover:from-[#2a6b7f] hover:to-[#3587A3] text-white font-semibold rounded-full"
                >
                  Save Documents
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-8 py-2 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full"
                >
                  Clear All
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
  )
}
