"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/ButtonBussiness"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { X, FileText, Calendar, DollarSign, User, Building } from "lucide-react"
import { useState, useEffect } from "react"

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  clientName: string
  clientAddress: string
  amount: number
  status: string
  items: Array<{
    description: string
    quantity: number
    rate: number
    total: number
  }>
}

interface InvoicePreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InvoicePreviewModal({ isOpen, onClose }: InvoicePreviewModalProps) {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(false)

  // Simulate API call to fetch invoice data from invoice creation
  const fetchInvoiceData = async () => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Try to get data from localStorage (from invoice creation page)
      const savedInvoiceData = localStorage.getItem("invoiceCreationData")

      let mockData: InvoiceData

      if (savedInvoiceData) {
        const parsedData = JSON.parse(savedInvoiceData)
        mockData = {
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
          date: parsedData.startDate || new Date().toISOString().split("T")[0],
          dueDate: parsedData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          clientName: parsedData.debtorAddress || "Client Name",
          clientAddress: parsedData.debtorAddress || "Client Address",
          amount: parsedData.billingTotal || 0,
          status: "Draft",
          items: parsedData.billingItems || [
            {
              description: parsedData.description || "Service Description",
              quantity: 1,
              rate: parsedData.billingTotal || 0,
              total: parsedData.billingTotal || 0,
            },
          ],
        }
      } else {
        // Fallback mock data if no saved data
        mockData = {
          invoiceNumber: "INV-2024-001",
          date: "2024-01-15",
          dueDate: "2024-02-15",
          clientName: "Acme Corporation",
          clientAddress: "123 Business St, Suite 100, New York, NY 10001",
          amount: 2500.0,
          status: "Draft",
          items: [
            {
              description: "Web Development Services",
              quantity: 40,
              rate: 50.0,
              total: 2000.0,
            },
            {
              description: "UI/UX Design",
              quantity: 10,
              rate: 50.0,
              total: 500.0,
            },
          ],
        }
      }

      setInvoiceData(mockData)
    } catch (error) {
      console.error("Error fetching invoice data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchInvoiceData()
    }
  }, [isOpen])

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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header - Fixed */}
              <div className="bg-gradient-to-r from-[#3587A3]/80 to-[#4a9bb8]/80 backdrop-blur-sm p-6 border-b border-white/20 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">Invoice Preview</h2>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 z-10 flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {/* NFT Image Section */}
                <div className="p-6 border-b border-white/20">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src="/placeholder.svg?height=200&width=200"
                        alt="Invoice NFT"
                        className="w-48 h-48 rounded-2xl shadow-2xl border-4 border-white/30 object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NFT
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-white font-semibold text-lg">Invoice Digital Certificate</h3>
                    <p className="text-white/70 text-sm">Blockchain-verified invoice authenticity</p>
                  </div>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <span className="ml-3 text-white">Loading invoice data...</span>
                    </div>
                  ) : invoiceData ? (
                    <div className="space-y-6">
                      {/* Invoice Header */}
                      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <Building className="h-5 w-5" />
                            <span>Invoice Details</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-white/90">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">Invoice #:</span>
                              <span>{invoiceData.invoiceNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/90">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Date:</span>
                              <span>{new Date(invoiceData.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/90">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Due Date:</span>
                              <span>{new Date(invoiceData.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-white/90">
                              <User className="h-4 w-4" />
                              <span className="font-medium">Client:</span>
                              <span>{invoiceData.clientName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/90">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">Amount:</span>
                              <span>${invoiceData.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/90">
                              <span className="font-medium">Status:</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  invoiceData.status === "Paid"
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-yellow-500/20 text-yellow-300"
                                }`}
                              >
                                {invoiceData.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Client Information */}
                      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white">Client Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-white/90">
                            <p className="font-medium">{invoiceData.clientName}</p>
                            <p className="text-sm text-white/70">{invoiceData.clientAddress}</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Invoice Items */}
                      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white">Invoice Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {invoiceData.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10"
                              >
                                <div className="flex-1">
                                  <p className="text-white font-medium">{item.description}</p>
                                  <p className="text-white/70 text-sm">
                                    {item.quantity} × ${item.rate.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-white font-semibold">${item.total.toFixed(2)}</div>
                              </div>
                            ))}
                            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                              <span className="text-white font-semibold text-lg">Total:</span>
                              <span className="text-white font-bold text-xl">${invoiceData.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-white/70">No invoice data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="p-6 border-t border-white/20 flex justify-center flex-shrink-0">
                <Button
                  onClick={onClose}
                  className="px-8 py-2 bg-gradient-to-r from-[#3587A3] to-[#4a9bb8] hover:from-[#2a6b7f] hover:to-[#3587A3] text-white font-semibold rounded-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
