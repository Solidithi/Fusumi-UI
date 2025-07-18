"use client";

import { BillingModal } from "@/components/ui/BillingModal";
import { Button } from "@/components/ui/ButtonBussiness";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { FileUpload } from "@/components/ui/FilesUpload";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { CustomerModal } from "@/components/ui/modal/CustomerModal";
import { Sidebar } from "@/components/ui/SideBar";
import { Textarea } from "@/components/ui/TextArea";
import { toast } from "@/hooks/animation-hook/useToast";
import { BillingItem } from "@/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
};

interface CustomerFieldsConfig {
  email: boolean;
  fullName: boolean;
  phone: boolean;
  address: boolean;
  zipcode: boolean;
  nationality: boolean;
  personalId: boolean;
  sex: boolean;
  birthdate: boolean;
  image: boolean;
  taxId: boolean;
  kycImage: boolean;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export default function CreateService() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [billingData, setBillingData] = useState<{
    items: BillingItem[];
    total: number;
  } | null>(null);
  const [customerData, setCustomerData] = useState<CustomerFieldsConfig | null>(
    null
  );
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [pricing, setPricing] = useState(0);
  const [agreementsData, setAgreementsData] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { account, wallet } = useWallet();

  const handleBillingSave = (items: BillingItem[], total: number) => {
    setBillingData({ items, total });
    console.log("Billing saved:", { items, total });
  };

  const handleCustomerSave = (fieldsConfig: CustomerFieldsConfig) => {
    setCustomerData(fieldsConfig);
    console.log("Customer fields config saved:", fieldsConfig);
  };

  const handleAgreementsSave = (files: string[]) => {
    setAgreementsData(files);
    console.log("Agreements saved:", files);
  };

  const handleReset = () => {
    // Reset all form fields
    setServiceName("");
    setDescription("");
    setCategory("");
    setImageFiles([]);
    setBillingData(null);
    setCustomerData(null);
    setInvoiceAddress("");
    setPricing(0);
    setAgreementsData([]);
    setStartDate("");
    setEndDate("");
  };

  const handleCreateService = async () => {
    if (!account?.address) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to create a service",
        variant: "destructive",
      });
      return;
    }

    if (!serviceName || !description || !category || !startDate || !endDate) {
      toast({
        title: "Please fill in all required fields",
        description: "Service name, description, category, start date, and end date are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create service data object
      const serviceData = {
        name: serviceName,
        description: description,
        category: category,
        price: billingData?.total || pricing || 0,
        imageUrl: imageFiles[0] || "",
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        attachments: agreementsData,
        businessId: "b1", // Default business ID - in real app, this would come from authenticated user
        features: [
          "Professional service delivery",
          "Quality assurance",
          "Customer support",
          "Satisfaction guarantee"
        ]
      };

      // Call API to create service
      const response = await fetch('/api/services/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const result = await response.json();

      toast({
        title: "Service created successfully!",
        description: `${serviceName} has been added to your business offerings.`,
        variant: "default",
      });

      // Reset form after successful creation
      handleReset();

      console.log('Service created:', result.service);
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Failed to create service",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="service"
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-[#3587A3] to-[#EDCCBB] shadow-2xl border-0">
            <CardContent className="p-8 space-y-6">
              {/* Title */}
              <div className="text-center mb-8">
                <CardTitle className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
                  SERVICE CREATION
                </CardTitle>
              </div>

              {/* Service Name */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Label
                  htmlFor="service-name"
                  className="text-sm font-semibold text-white/90"
                >
                  Service Name
                </Label>
                <Input
                  id="service-name"
                  placeholder="Enter service name"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                />
              </motion.div>

              {/* Category Selection */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold text-white/90"
                >
                  Business Category
                </Label>
                <CategorySelect
                  value={category}
                  onValueChange={setCategory}
                />
              </motion.div>

              {/* Billing and Customer Information */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="billing"
                    className="text-sm font-semibold text-white/90"
                  >
                    Billing{" "}
                    {billingData && (
                      <span className="text-xs">
                        (Total: ${billingData.total.toFixed(2)})
                      </span>
                    )}
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
                      <>{/* <Receipt className="h-4 w-4 mr-2" /> */} ...</>
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="customer-info"
                    className="text-sm font-semibold text-white/90"
                  >
                    Customer Information
                  </Label>
                  <Button
                    onClick={() => setCustomerModalOpen(true)}
                    variant="outline"
                    className="w-full justify-center bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {customerData
                      ? `${
                          Object.values(customerData).filter(Boolean).length
                        } fields selected`
                      : "Configure Fields"}
                  </Button>
                </div>
              </motion.div>

              {/* Image Upload */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Label className="text-sm font-semibold text-white/90">
                  Image
                </Label>
                <FileUpload 
                  accept="image/*" 
                  multiple={true} 
                  onChange={(files) => setImageFiles(files)}
                />
              </motion.div>

              {/* Description */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-white/90"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter service description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 resize-none"
                />
              </motion.div>

              {/* Date Fields */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="start-date"
                    className="text-sm font-semibold text-white/90"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="end-date"
                    className="text-sm font-semibold text-white/90"
                  >
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
              </motion.div>

              {/* Agreements & Binding */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <Label className="text-sm font-semibold text-white/90">
                  Agreements & Binding
                </Label>
                <FileUpload
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  multiple={true}
                  onChange={(files) => setAgreementsData(files)}
                />
              </motion.div>

              {/* Create Button */}
              <motion.div
                className="flex justify-center pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <Button
                  className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                  onClick={handleCreateService}
                  disabled={loading}
                >
                  {loading ? "CREATING..." : "CREATE"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <BillingModal
        isOpen={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        onSave={handleBillingSave}
      />
      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSave={handleCustomerSave as any}
      />
    </div>
  );
}
