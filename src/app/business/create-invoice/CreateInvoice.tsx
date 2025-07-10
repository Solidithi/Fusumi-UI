"use client"

import { BillingModal } from "@/components/ui/BillingModal";
import { Button } from "@/components/ui/ButtonBussiness";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FilesUpload";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Sidebar } from "@/components/ui/SideBar";
import { Textarea } from "@/components/ui/TextArea";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
}

interface BillingItem {
  id: string
  productName: string
  price: string
  quantity: string
}

export default function CreateInvoice() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [billingModalOpen, setBillingModalOpen] = useState(false)
  const [billingData, setBillingData] = useState<{ items: BillingItem[]; total: number } | null>(null)
  const [debtorAddress, setDebtorAddress] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleBillingSave = (items: BillingItem[], total: number) => {  
    setBillingData({ items, total })
    console.log("Billing saved:", { items, total })
  }

  const handleCreate = async() => {
    console.log("Invoice created:", {
      debtorAddress,
      description,
      startDate,
      endDate,
      billingData,
    })
    const response = await axios.post('/api/business/create-invoice', {
      debtorAddress,
      description,
      startDate,
      endDate,
      billingData,
    })

    if(response.status !== 200) {
      console.error("Failed to create invoice")
      return
    }

    console.log("Invoice created:", response.data)
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} activePage="invoice" />

      {/* Main Content */}
      <div className="flex-1 p-8"> 
        <motion.div variants={formVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#3587A3] to-[#EDCCBB] shadow-2xl border-0">
            <CardContent className="p-8 space-y-6">
              {/* Title */}
              <div className="text-center mb-8">
                <CardTitle className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
                  INVOICE CREATION
                </CardTitle> 
              </div>

              {/* First Row - Debtor Address and Billing */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"          
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
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 placeholder:text-gray-500 placeholder:opacity-70 transition-all duration-300"
                    value={debtorAddress}
                    onChange={e => setDebtorAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing" className="text-sm font-semibold text-white/90">
                    Billing {billingData && <span className="text-xs">(Total: ${billingData.total.toFixed(2)})</span>}
                  </Label>
                  <Button
                    onClick={() => setBillingModalOpen(true)}
                    variant="outline"
                    className="w-full justify-center bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    {/* {billingData ? `${billingData.items.length} items` : "..."} */}
                    {billingData && billingData.total > 0 ? (
                      `$${billingData.total.toFixed(2)}`
                    ) : (
                      <>
                        {/* <Receipt className="h-4 w-4 mr-2" /> */}
                        ...
                      </>
                    )}
                  </Button>
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
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
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
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </motion.div>

              {/* Agreements & Binding - Moved to the end */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Label className="text-sm font-semibold text-white/90">Agreements & Binding</Label>
                <FileUpload accept=".pdf,.doc,.docx,.txt" multiple={true} />
              </motion.div>

              {/* Create Button */}
              <motion.div
                className="flex justify-center pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Button className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleCreate}
                >
                  CREATE
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Billing Modal */}
      <BillingModal isOpen={billingModalOpen} onClose={() => setBillingModalOpen(false)} onSave={handleBillingSave} />
    </div>
  )
}
