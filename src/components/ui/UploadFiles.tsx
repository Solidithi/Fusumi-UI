"use client"

import type React from "react"

import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
import { Upload, File, X, Eye } from "lucide-react"
import { useState, useRef } from "react"
import { Label } from "./Label"
import { AnimatedButton } from "./Button"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
}

interface FileUploadProps {
  label: string
  accept?: string
  multiple?: boolean
}

export function FileUpload({ label, accept = "*/*", multiple = false }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setFiles(multiple ? [...files, ...newFiles] : newFiles)
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-semibold text-white/90">{label}</Label>}

      {/* Upload Area */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          dragOver ? "border-white/60 bg-white/10" : "border-white/30 hover:border-white/50 hover:bg-white/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="h-8 w-8 text-white/70 mx-auto mb-2" />
        <p className="text-white/70 mb-2">Drag and drop files here, or</p>
        <AnimatedButton
        //   type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          Browse Files
        </AnimatedButton>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </motion.div>

      {/* File Preview */}
      {files.length > 0 && (
        <motion.div className="space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Label className="text-sm font-medium text-white/90">Uploaded Files:</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file) => (
              <motion.div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <File className="h-5 w-5 text-white/70 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white/90 text-sm font-medium truncate">{file.name}</p>
                    <p className="text-white/60 text-xs">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.type.startsWith("image/") && (
                    <AnimatedButton
                    //   type="button"
                    //   size="icon"
                    //   variant="ghost"
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/20"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                    </AnimatedButton>
                  )}
                  <AnimatedButton
                    // type="button"
                    // size="icon"
                    // variant="ghost"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/20"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
