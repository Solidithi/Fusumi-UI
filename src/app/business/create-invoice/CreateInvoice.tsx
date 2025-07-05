"use client"

import { motion } from "framer-motion"

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sidebar } from "@/components/sidebar"
// import { BillingModal } from "@/components/billing-modal"
// import { FileUpload } from "@/components/file-upload"
import { useState } from "react"
import { AnimatedButton } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/TextArea"
import { BillingModal } from "@/components/ui/BillingModal"
import { FileUpload } from "@/components/ui/UploadFiles"
import { Sidebar } from "@/components/ui/SideBar"

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
}

export default function InvoiceCreationPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [billingModalOpen, setBillingModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#3587A3] to-[#EDCCBB] shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-center tracking-wide">INVOICE CREATION</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* First Row */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="debtor-address" className="text-sm font-semibold text-white/90">
                    Debtor Address
                  </Label>
                  <Input
                    id="debtor-address"
                    placeholder="Enter debtor address"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing" className="text-sm font-semibold text-white/90">
                    Billing
                  </Label>
                  <AnimatedButton
                    onClick={() => setBillingModalOpen(true)}
                    variant="outline"
                    className="w-full justify-center bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    ...
                  </AnimatedButton>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agreements" className="text-sm font-semibold text-white/90">
                    Agreements & Binding
                  </Label>
                  <FileUpload label="" accept=".pdf,.doc,.docx,.txt" multiple={true} />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Label htmlFor="description" className="text-sm font-semibold text-white/90">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter invoice description"
                  className="min-h-[120px] bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 resize-none"
                />
              </motion.div>

              {/* Date Fields */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
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
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <AnimatedButton className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  CREATE
                </AnimatedButton>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Billing Modal */}
      <BillingModal isOpen={billingModalOpen} onClose={() => setBillingModalOpen(false)} />
    </div>
  )
}
