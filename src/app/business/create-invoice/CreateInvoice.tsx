"use client";

import { BillingModal } from "@/components/ui/BillingModal";
import { Button } from "@/components/ui/ButtonBussiness";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FilesUpload";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Sidebar } from "@/components/ui/SideBar";
import { Textarea } from "@/components/ui/TextArea";
import { fusumi_deployer_address } from "@/utils/deployerAddress";
import { aptos } from "@/utils/indexer";
import { getCurrentBusinessId, saveInvoiceToFile } from "@/utils/businessUtils";
import { BillingItem } from "@/types";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  User,
  Search,
} from "lucide-react";
import Image from "next/image";

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
};

export default function CreateInvoice() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [billingData, setBillingData] = useState<{
    items: BillingItem[];
    total: number;
  } | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    wallet?: string;
    billing?: string;
    fields?: string;
  }>({});
  const [users, setUsers] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ----------------------------------------------------------
  const { account, connected, connect, signAndSubmitTransaction } = useWallet();

  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [collectionUri, setCollectionUri] = useState<string[]>([]);
  const [totalDebtAmount, setTotalDebtAmount] = useState(0);
  const [debtorAddress, setDebtorAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Initialize business ID when component loads
  useEffect(() => {
    const loadBusinessId = async () => {
      if (account?.address) {
        const businessId = await getCurrentBusinessId(
          account.address.toString()
        );
        console.log("Current business ID:", businessId);
        setCurrentBusinessId(businessId);
      }
    };

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch("/data/users.json");
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadBusinessId();
    loadUsers();
  }, [account?.address]);

  // Clear errors when user fixes issues
  useEffect(() => {
    if (errors.wallet && account) {
      setErrors((prev) => ({ ...prev, wallet: undefined }));
    }
  }, [account, errors.wallet]);

  useEffect(() => {
    if (errors.billing && billingData?.items.length) {
      setErrors((prev) => ({ ...prev, billing: undefined }));
    }
  }, [billingData, errors.billing]);

  useEffect(() => {
    if (
      errors.fields &&
      collectionName &&
      collectionDesc &&
      debtorAddress &&
      startDate &&
      endDate
    ) {
      setErrors((prev) => ({ ...prev, fields: undefined }));
    }
  }, [
    collectionName,
    collectionDesc,
    debtorAddress,
    startDate,
    endDate,
    errors.fields,
  ]);

  const handleBillingSave = (items: BillingItem[], total: number) => {
    setBillingData({ items, total });
    setTotalDebtAmount(total);
    console.log("Billing saved:", { items, total });
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setDebtorAddress(user.address);
    setShowUserDropdown(false);
    setUserSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-selector")) {
        setShowUserDropdown(false);
        setUserSearchTerm("");
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showUserDropdown]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.alias?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  // const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

  // const handleCreate = async () => {
  //   console.log("Invoice created:", {
  //     debtorAddress,
  //     description,
  //     startDate,
  //     endDate,
  //     billingData,
  //   });
  //   const response = await axios.post("/api/business/create-invoice", {
  //     debtorAddress,
  //     description,
  //     startDate,
  //     endDate,
  //     billingData,
  //   });

  //   if (response.status !== 200) {
  //     console.error("Failed to create invoice");
  //     return;
  //   }

  //   console.log("Invoice created:", response.data);
  // };

  const handleCreateInvoice = async () => {
    // Clear previous errors
    setErrors({});

    if (!account) {
      setErrors({ wallet: "Please connect wallet first" });
      return;
    }

    if (!billingData || billingData.items.length === 0) {
      setErrors({ billing: "Please add products to the invoice" });
      return;
    }

    if (
      !collectionName ||
      !collectionDesc ||
      !debtorAddress ||
      !startDate ||
      !endDate
    ) {
      setErrors({ fields: "Please fill in all required fields" });
      return;
    }

    setIsProcessing(true);

    // Console log all entered values
    console.log("=== INVOICE CREATION DATA ===");
    console.log("Collection Name:", collectionName);
    console.log("Description:", collectionDesc);
    console.log("Debtor Address:", debtorAddress);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Total Debt Amount:", totalDebtAmount);
    console.log("Current Business ID:", currentBusinessId);
    console.log("Collection URI (Files):", collectionUri);
    console.log("Billing Data:", billingData);
    if (billingData) {
      console.log("Billing Items:", billingData.items);
      console.log("Billing Total:", billingData.total);
    }
    console.log("Connected wallet:", account);
    console.log("=============================");

    try {
      // First, save the invoice to the JSON file
      const invoiceData = {
        ownerAddress: account.address.toString(),
        debtorAddress,
        description: collectionDesc,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        attachments: collectionUri,
        businessId: currentBusinessId || "bus-001", // fallback to default business
      };

      const products = billingData.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Save to JSON file
      const saveSuccess = await saveInvoiceToFile(invoiceData, products);

      if (!saveSuccess) {
        console.error("Failed to save invoice to database");
        setIsProcessing(false);
        return;
      }

      // Then proceed with blockchain transaction
      const tx1 = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          // function:"0xd9768fa77515f3e23654dce4117ff0539d3ffe9fa4ebc87b78034701529d586e::debt_factory::create_debt_collection",
          function: `${fusumi_deployer_address}::debt_root::create_debt_root`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      console.log(`Created Debt Collection! ${tx1.hash}`);
      const wait = await aptos.waitForTransaction({
        transactionHash: tx1.hash,
      });
      console.log(`Transaction status: ${wait.success ? "Success" : "Failed"}`);

      setIsProcessing(false);
      setIsSuccess(true);

      // Auto close success state and reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form after successful creation
        setCollectionName("");
        setCollectionDesc("");
        setDebtorAddress("");
        setStartDate("");
        setEndDate("");
        setBillingData(null);
        setTotalDebtAmount(0);
        setCollectionUri([]);
      }, 3000);
    } catch (error) {
      console.error("Error creating debt collection:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex text-black">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="invoice"
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
                  <Label
                    htmlFor="debtor-address"
                    className="text-sm font-semibold text-white/90"
                  >
                    Debtor Address
                  </Label>
                  <div className="relative user-selector">
                    {/* Selected User Display / Dropdown Trigger */}
                    <div
                      className="bg-white/90 border border-white/30 rounded-md px-3 py-2 cursor-pointer flex items-center justify-between transition-all duration-300 hover:bg-white focus-within:border-white focus-within:ring-white/50 min-h-[44px]"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setShowUserDropdown(!showUserDropdown);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        {selectedUser ? (
                          <>
                            <Image
                              src={selectedUser.avatar}
                              alt={selectedUser.fullName}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {selectedUser.fullName || selectedUser.alias}
                              </span>
                              <span className="text-xs text-gray-500">
                                {selectedUser.address.slice(0, 8)}...
                                {selectedUser.address.slice(-6)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <User className="w-6 h-6 text-gray-400" />
                            <span className="text-gray-500">
                              {loadingUsers
                                ? "Loading users..."
                                : "Select debtor..."}
                            </span>
                          </>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          showUserDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showUserDropdown && (
                        <motion.div
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-hidden"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Search Input */}
                          <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="Search users..."
                                value={userSearchTerm}
                                onChange={(e) =>
                                  setUserSearchTerm(e.target.value)
                                }
                                className="pl-10 text-sm"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* User List */}
                          <div className="max-h-40 overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleUserSelect(user)}
                                >
                                  <Image
                                    src={user.avatar}
                                    alt={user.fullName}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {user.fullName || user.alias}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.email}
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono">
                                      {user.address.slice(0, 12)}...
                                      {user.address.slice(-8)}
                                    </div>
                                  </div>
                                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                    {user.role}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-4 text-center text-gray-500">
                                No users found
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
                      <>
                        {/* <Receipt className="h-4 w-4 mr-2" /> */}
                        ...
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Collection Name */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Label
                  htmlFor="collection-name"
                  className="text-sm font-semibold text-white/90"
                >
                  Tax Invoice
                </Label>
                <Input
                  id="collection-name"
                  placeholder="Enter tax invoice"
                  className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 placeholder:text-gray-500 placeholder:opacity-70 transition-all duration-300"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
              </motion.div>

              {/* Description */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-white/90"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter invoice description"
                  className="min-h-[120px] bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 resize-none"
                  value={collectionDesc}
                  onChange={(e) => setCollectionDesc(e.target.value)}
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
                  <Label
                    htmlFor="start-date"
                    className="text-sm font-semibold text-white/90"
                  >
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                <Label className="text-sm font-semibold text-white/90">
                  Agreements & Binding
                </Label>
                <FileUpload
                  accept=".pdf,.doc,.docx,.txt"
                  multiple={true}
                  onChange={(base64) => setCollectionUri(base64)}
                />
              </motion.div>

              {/* Error Messages */}
              {(errors.wallet || errors.billing || errors.fields) && (
                <motion.div
                  className="bg-red-100 border border-red-300 rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-red-700 text-sm space-y-1">
                      {errors.wallet && <p>{errors.wallet}</p>}
                      {errors.billing && <p>{errors.billing}</p>}
                      {errors.fields && <p>{errors.fields}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Create Button */}
              <motion.div
                className="flex justify-center pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Button
                  className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleCreateInvoice}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "CREATE"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.div
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Invoice Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your invoice have been created on the blockchain.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billing Modal */}
      <BillingModal
        isOpen={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        onSave={handleBillingSave}
        businessId={currentBusinessId || undefined}
      />
    </div>
  );
}
