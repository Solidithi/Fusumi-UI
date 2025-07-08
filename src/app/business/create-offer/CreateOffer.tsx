"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/ButtonBussiness";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Sidebar } from "@/components/ui/SideBar";
import { InvoicePreviewModal } from "@/components/ui/modal/InvoicePreviewModal";
import { ContactInfoModal } from "@/components/ui/modal/ContactInfo";
import { AgreementsModal } from "@/components/ui/modal/AgreementModal";
import { useState } from "react";
import { Eye, User, FileText } from "lucide-react";

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
};

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

export default function CreateOffer() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(false);
  const [agreementsOpen, setAgreementsOpen] = useState(false);
  const [contactData, setContactData] = useState<ContactInfo | null>(null);
  const [agreementsData, setAgreementsData] = useState<string[]>([]);

  const handleContactSave = (contactInfo: ContactInfo) => {
    setContactData(contactInfo);
    console.log("Contact info saved:", contactInfo);
  };

  const handleAgreementsSave = (files: string[]) => {
    setAgreementsData(files);
    console.log("Agreements saved:", files);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="offer-create"
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
                  OFFER CREATION
                </CardTitle>
              </div>

              {/* First Row - Invoice Address and Preview Invoice Info */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="invoice-address"
                    className="text-sm font-semibold text-white/90"
                  >
                    Invoice Address
                  </Label>
                  <Input
                    id="invoice-address"
                    placeholder="Enter invoice address"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="preview-invoice"
                    className="text-sm font-semibold text-white/90"
                  >
                    Preview Invoice Info
                  </Label>
                  <Button
                    onClick={() => setInvoicePreviewOpen(true)}
                    variant="outline"
                    className="w-full justify-center bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              </motion.div>

              {/* Second Row - Pricing and Contact Info */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="pricing"
                    className="text-sm font-semibold text-white/90"
                  >
                    Pricing
                  </Label>
                  <Input
                    id="pricing"
                    type="number"
                    step="0.01"
                    placeholder="Enter pricing amount"
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="contact-info"
                    className="text-sm font-semibold text-white/90"
                  >
                    Contact Info
                  </Label>
                  <Button
                    onClick={() => setContactInfoOpen(true)}
                    variant="outline"
                    className="w-full justify-center bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {contactData
                      ? `${contactData.name} - ${contactData.email}`
                      : ""}
                  </Button>
                </div>
              </motion.div>

              {/* Third Row - Start Date and End Date */}
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
                  />
                </div>
              </motion.div>

              {/* Agreements & Binding */}
              <motion.div
                className="space-y-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Label className="text-sm font-semibold text-white/90">
                  Agreements & Binding
                </Label>
                <Button
                  onClick={() => setAgreementsOpen(true)}
                  variant="outline"
                  className="w-full justify-center bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300 min-h-[60px]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {agreementsData.length > 0
                    ? `${agreementsData.length} files selected`
                    : ""}
                </Button>
              </motion.div>

              {/* Create Button */}
              <motion.div
                className="flex justify-center pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <Button className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  CREATE
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>  

      {/* Modals */}
      <InvoicePreviewModal
        isOpen={invoicePreviewOpen}
        onClose={() => setInvoicePreviewOpen(false)}
      />
      <ContactInfoModal
        isOpen={contactInfoOpen}
        onClose={() => setContactInfoOpen(false)}
        onSave={handleContactSave}
        initialData={contactData}
      />
      <AgreementsModal
        isOpen={agreementsOpen}
        onClose={() => setAgreementsOpen(false)}
        onSave={handleAgreementsSave}
        selectedFiles={agreementsData}
      />
    </div>
  );
}
