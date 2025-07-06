"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/TextArea"
import { FileUpload } from "@/components/ui/FilesUpload"
import { Sidebar } from "@/components/ui/SideBar"
import { Button } from "@/components/ui/ButtonBussiness"

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
}

export default function CreateProduct() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="product"
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#3587A3] to-[#EDCCBB] shadow-2xl border-0">
            <CardContent className="p-8 space-y-6">
              {/* Title */}
              <div className="text-center mb-8">
                <CardTitle className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
                  PRODUCT CREATION
                </CardTitle>
              </div>

              {/* First Row - Product Name and Product Type */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="product-name" className="text-sm font-semibold text-white/90">
                    Product Name
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-type" className="text-sm font-semibold text-white/90">
                    Product Type
                  </Label>
                  <Input
                    id="product-type"
                    placeholder="Enter product type"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Second Row - Sale Price and Unit of Measure */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="sale-price" className="text-sm font-semibold text-white/90">
                    Sale Price
                  </Label>
                  <Input
                    id="sale-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-measure" className="text-sm font-semibold text-white/90">
                    Unit of Measure
                  </Label>
                  <Input
                    id="unit-measure"
                    placeholder="e.g., pieces, kg, liters"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Label htmlFor="description" className="text-sm font-semibold text-white/90">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  className="min-h-[120px] bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 resize-none"
                />
              </motion.div>

              {/* Image Upload */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Label className="text-sm font-semibold text-white/90">Image</Label>
                <FileUpload accept="image/*" multiple={true} />
              </motion.div>

              {/* Date Fields */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-sm font-semibold text-white/90">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm font-semibold text-white/90">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Create Button */}
              <motion.div
                className="flex justify-center pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <Button className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  CREATE
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
