"use client";

import { Button } from "@/components/ui/ButtonBussiness";
import { Card, CardContent } from "@/components/ui/Card";
import { FileUpload } from "@/components/ui/FilesUpload";
import { Input } from "@/components/ui/Input";
import { Sidebar } from "@/components/ui/SideBar";
import { Textarea } from "@/components/ui/TextArea";
import { fusumi_deployer_address } from "@/utils/deployerAddress";
import { aptos } from "@/utils/indexer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export default function KYBPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    wallet?: string;
    fields?: string;
  }>({});

  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [incorporationDate, setIncorporationDate] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");
  const [legalRepFullName, setLegalRepFullName] = useState("");
  const [legalRepId, setLegalRepId] = useState("");
  const [legalRepPosition, setLegalRepPosition] = useState("");
  const [legalRepNationality, setLegalRepNationality] = useState("");
  const [taxId, setTaxId] = useState("");
  const [financialProfile, setFinancialProfile] = useState("");
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const { account, signAndSubmitTransaction } = useWallet();

  // Clear errors when user fixes issues
  useEffect(() => {
    if (errors.wallet && account) {
      setErrors((prev) => ({ ...prev, wallet: undefined }));
    }
  }, [account, errors.wallet]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    // Only validate wallet connection since all form fields are now optional
    if (account == null) {
      setErrors({ wallet: "Please connect your wallet first!" });
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Submit blockchain transaction
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${fusumi_deployer_address}::fusumi::anchoring_ship`,
          functionArguments: [
            // businessName || "",
            // registrationNumber || "",
            // incorporationDate || "",
            // businessType || "",
            // officialWebsite || "",
            // businessLogo || "",
            // legalRepFullName || "",
            // legalRepId || "",
            // legalRepPosition || "",
            // legalRepNationality || "",
            // taxId || "",
            // financialProfile || "",
          ],
        },
      });
      
      console.log("Blockchain transaction submitted:", response);

      // 3. Wait for transaction confirmation
      const txn = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });
      console.log("Transaction confirmed:", txn);

      // 4. Save to JSON file via API
      const payload = {
        businessName: businessName || "",
        registrationNumber: registrationNumber || "",
        incorporationDate: incorporationDate ? new Date(incorporationDate).toISOString() : "",
        businessType: businessType || "",
        officialWebsite: officialWebsite || "",
        businessLogo: businessLogo || "",
        legalRepFullName: legalRepFullName || "",
        legalRepId: legalRepId || "",
        legalRepPosition: legalRepPosition || "",
        legalRepNationality: legalRepNationality || "",
        taxId: taxId || "",
        financialProfile: financialProfile
          ? financialProfile.split(",").map((s) => s.trim()).filter(s => s.length > 0)
          : [],
        documentUrls: documentUrls || [],
        walletAddress: account?.address || "",
      };

      const apiResponse = await axios.post("/api/business/kyb", payload);
      console.log("API Response:", apiResponse.data);

      setIsSubmitting(false);
      setIsSuccess(true);

      // Auto close success state and reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form after successful creation
        setCurrentStep(1);
        setBusinessName("");
        setRegistrationNumber("");
        setIncorporationDate("");
        setBusinessType("");
        setOfficialWebsite("");
        setBusinessLogo("");
        setLegalRepFullName("");
        setLegalRepId("");
        setLegalRepPosition("");
        setLegalRepNationality("");
        setTaxId("");
        setFinancialProfile("");
        setDocumentUrls([]);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting business registration:", error);
      setIsSubmitting(false);
      setErrors({ fields: "Error submitting business registration. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex text-black">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="kyb"
      />
      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fieldVariants} className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-[#3587A3] mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">KYB</h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Business Verification
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Securely verify your company&apos;s identity to build trust and
              unlock full platform capabilities.
            </p>
          </motion.div>
          {/* Progress Indicator - Clickable */}
          <motion.div variants={fieldVariants} className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-110 ${
                      currentStep >= step
                        ? "bg-[#3587A3] text-white shadow-lg hover:bg-[#2a6b7f]"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {step}
                  </button>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-colors duration-300 ${
                        currentStep > step ? "bg-[#3587A3]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-3">
              <span className="text-sm text-gray-600 font-medium">
                Step {currentStep} of 3:{" "}
                {currentStep === 1
                  ? "Business Information"
                  : currentStep === 2
                  ? "Legal Representative"
                  : "Financial & Documents"}
              </span>
            </div>
          </motion.div>
          {/* Form Card */}
          <motion.div variants={fieldVariants}>
            <Card className="bg-gradient-to-br from-[#3587A3] to-[#EDCCBB] shadow-2xl border-0">
              <CardContent className="p-8">
                {/* Step 1: Business Information */}
                {currentStep === 1 && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Business Name
                        </label>
                        <Input
                          id="business-name"
                          placeholder="Enter business name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Registration Number
                        </label>
                        <Input
                          id="registration-number"
                          placeholder="Enter registration number"
                          value={registrationNumber}
                          onChange={(e) =>
                            setRegistrationNumber(e.target.value)
                          }
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Incorporation Date
                        </label>
                        <Input
                          id="incorporation-date"
                          type="date"
                          value={incorporationDate}
                          onChange={(e) => setIncorporationDate(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Business Type
                        </label>
                        <Input
                          id="business-type"
                          placeholder="e.g. LLC, Corporation, etc."
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90 mb-1">
                        Official Website
                      </label>
                      <Input
                        id="official-website"
                        placeholder="https://www.example.com"
                        value={officialWebsite}
                        onChange={(e) => setOfficialWebsite(e.target.value)}
                        className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                      />
                    </motion.div>
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90 mb-1">
                        Business Logo
                      </label>
                      <FileUpload
                        accept="image/*"
                        multiple={false}
                        onChange={(base64) => setBusinessLogo(base64[0])}
                      />
                    </motion.div>
                  </motion.div>
                )}
                {/* Step 2: Legal Representative */}
                {currentStep === 2 && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Full Name
                        </label>
                        <Input
                          id="legal-rep-full-name"
                          placeholder="Enter full name"
                          value={legalRepFullName}
                          onChange={(e) => setLegalRepFullName(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          ID Number
                        </label>
                        <Input
                          id="legal-rep-id"
                          placeholder="Enter ID number"
                          value={legalRepId}
                          onChange={(e) => setLegalRepId(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Position
                        </label>
                        <Input
                          id="legal-rep-position"
                          placeholder="e.g. CEO, Director, etc."
                          value={legalRepPosition}
                          onChange={(e) => setLegalRepPosition(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-white/90 mb-1">
                          Nationality
                        </label>
                        <Input
                          id="legal-rep-nationality"
                          placeholder="Enter nationality"
                          value={legalRepNationality}
                          onChange={(e) =>
                            setLegalRepNationality(e.target.value)
                          }
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                    </div>
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90 mb-1">
                        Tax ID
                      </label>
                      <Input
                        id="tax-id"
                        placeholder="Enter tax identification number"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                      />
                    </motion.div>
                  </motion.div>
                )}
                {/* Step 3: Financial & Documents */}
                {currentStep === 3 && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90 mb-1">
                        Financial Profile
                      </label>
                      <Textarea
                        id="financial-profile"
                        placeholder="Describe your business financial profile, annual revenue, funding sources, etc."
                        value={financialProfile}
                        onChange={(e) => setFinancialProfile(e.target.value)}
                        className="min-h-[120px] bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 resize-none"
                      />
                    </motion.div>
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <label className="block text-sm font-semibold text-white/90 mb-1">
                        Supporting Documents
                      </label>
                      <FileUpload
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        multiple={true}
                        onChange={(urls) => setDocumentUrls(urls)}
                      />
                    </motion.div>
                    <motion.div
                      variants={fieldVariants}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4"
                    >
                      <span className="text-white/80 text-sm">
                        Upload any relevant business documents, certificates, or
                        financial statements.
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Error Messages */}
                {(errors.wallet || errors.fields) && (
                  <motion.div
                    variants={fieldVariants}
                    className="bg-red-100 border border-red-300 rounded-lg p-4 mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-red-700 text-sm space-y-1">
                        {errors.wallet && <p>{errors.wallet}</p>}
                        {errors.fields && <p>{errors.fields}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <motion.div
                  variants={fieldVariants}
                  className="flex justify-between items-center pt-8 border-t border-white/20 mt-8"
                >
                  <Button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="px-8 py-2 bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="text-sm text-white/70">
                    {currentStep} of 3 steps completed
                  </div>
                  <Button
                    onClick={currentStep === 3 ? handleSubmit : handleNext}
                    disabled={isSubmitting}
                    className="px-8 py-2 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <>
                        {currentStep === 3 ? "Submit" : "Next"}
                        {currentStep < 3 && (
                          <ChevronRight className="h-4 w-4 ml-2" />
                        )}
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-8 shadow-2xl max-w-md mx-4"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  KYB Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your business verification has been submitted and is being processed.
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="bg-green-200 h-1 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
