"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/ButtonBussiness";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/TextArea";
import { Card, CardContent } from "@/components/ui/Card";
import { Sidebar } from "@/components/ui/SideBar";
import { FileUpload } from "@/components/ui/FilesUpload";
import { useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { aptos } from "@/utils/indexer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { fusumi_deployer_address } from "@/utils/deployerAddress";

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

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (account == null) {
      throw new Error("Unable to find account to sign transaction");
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: `${fusumi_deployer_address}::business_registry::add_business`,
        functionArguments: [account.address, account.address],
      },
    });
    console.log(response);
    try {
      const txn = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      console.log("Transaction txn", txn);
    } catch (error) {
      console.error(error);
    }

    // const payload = {
    //   businessName,
    //   registrationNumber,
    //   incorporationDate: new Date(incorporationDate).toISOString(),
    //   businessType,
    //   officialWebsite,
    //   businessLogo,
    //   legalRepFullName,
    //   legalRepId,
    //   legalRepPosition,
    //   legalRepNationality,
    //   taxId,
    //   financialProfile: financialProfile
    //     ? financialProfile.split(",").map((s) => s.trim())
    //     : [],
    //   documentUrls,
    // };

    // console.log("Payload:", payload);

    // try {
    //   const response = await axios.post("/api/business/kyb", payload);
    //   console.log("API Response:", response.data);
    //   alert("Successfully!");
    // } catch (err) {
    //   console.error(err);
    //   alert("Server error!");
    // }
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
                        <Label
                          htmlFor="business-name"
                          className="text-sm font-semibold text-white/90"
                        >
                          Business Name *
                        </Label>
                        <Input
                          id="business-name"
                          placeholder="Enter business name"
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="registration-number"
                          className="text-sm font-semibold text-white/90"
                        >
                          Registration Number *
                        </Label>
                        <Input
                          id="registration-number"
                          placeholder="Enter registration number"
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
                        <Label
                          htmlFor="incorporation-date"
                          className="text-sm font-semibold text-white/90"
                        >
                          Incorporation Date *
                        </Label>
                        <Input
                          id="incorporation-date"
                          type="date"
                          onChange={(e) => setIncorporationDate(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="business-type"
                          className="text-sm font-semibold text-white/90"
                        >
                          Business Type *
                        </Label>
                        <Input
                          id="business-type"
                          placeholder="e.g., LLC, Corporation, Partnership"
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label
                        htmlFor="official-website"
                        className="text-sm font-semibold text-white/90"
                      >
                        Official Website (if available)
                      </Label>
                      <Input
                        id="official-website"
                        placeholder="https://www.example.com"
                        onChange={(e) => setOfficialWebsite(e.target.value)}
                        className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                      />
                    </motion.div>

                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label className="text-sm font-semibold text-white/90">
                        Business Logo
                      </Label>
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
                        <Label
                          htmlFor="legal-rep-name"
                          className="text-sm font-semibold text-white/90"
                        >
                          Legal Representative Name *
                        </Label>
                        <Input
                          id="legal-rep-name"
                          placeholder="Enter full name"
                          onChange={(e) => setLegalRepFullName(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="representation-id"
                          className="text-sm font-semibold text-white/90"
                        >
                          Representation ID *
                        </Label>
                        <Input
                          id="representation-id"
                          placeholder="Enter ID number"
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
                        <Label
                          htmlFor="rep-position"
                          className="text-sm font-semibold text-white/90"
                        >
                          Representative Position *
                        </Label>
                        <Input
                          id="rep-position"
                          placeholder="e.g., CEO, Director, Manager"
                          onChange={(e) => setLegalRepPosition(e.target.value)}
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>

                      <motion.div
                        variants={fieldVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="rep-nationality"
                          className="text-sm font-semibold text-white/90"
                        >
                          Representative Nationality *
                        </Label>
                        <Input
                          id="rep-nationality"
                          placeholder="Enter nationality"
                          onChange={(e) =>
                            setLegalRepNationality(e.target.value)
                          }
                          className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label
                        htmlFor="tax-id"
                        className="text-sm font-semibold text-white/90"
                      >
                        Tax ID *
                      </Label>
                      <Input
                        id="tax-id"
                        placeholder="Enter tax identification number"
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
                      <Label
                        htmlFor="financial-profile"
                        className="text-sm font-semibold text-white/90"
                      >
                        Financial Profile
                      </Label>
                      <Textarea
                        id="financial-profile"
                        placeholder="Describe your business financial profile, annual revenue, funding sources, etc."
                        onChange={(e) => setFinancialProfile(e.target.value)}
                        className="min-h-[120px] bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 resize-none"
                      />
                    </motion.div>

                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label className="text-sm font-semibold text-white/90">
                        Related Files *
                      </Label>
                      <p className="text-xs text-gray-500 mb-3">
                        Upload business registration documents, certificates,
                        financial statements, etc.
                      </p>
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
                      <h4 className="font-semibold text-white mb-2">
                        Required Documents:
                      </h4>
                      <ul className="text-sm text-white/90 space-y-1">
                        <li>• Business Registration Certificate</li>
                        <li>• Articles of Incorporation</li>
                        <li>• Tax Registration Certificate</li>
                        <li>• Bank Account Verification</li>
                        <li>• Legal Representative ID Copy</li>
                        <li>• Financial Statements (if available)</li>
                      </ul>
                    </motion.div>
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
                    className="px-8 py-2 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {currentStep === 3 ? "Submit" : "Next"}
                    {currentStep < 3 && (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
