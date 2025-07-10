"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FilesUpload";
import { Sidebar } from "@/components/ui/SideBar";
import { Button } from "@/components/ui/ButtonBussiness";
import axios from "axios";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
}

const formVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: 0.3 },
  },
};

export default function CreateProduct() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // collect validation errors
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!productName.trim()) errors.push("Product Name is required.");
    if (!productType.trim()) errors.push("Product Type is required.");
    if (!(price > 0)) errors.push("Price must be greater than zero.");
    if (!unitOfMeasure.trim()) errors.push("Unit of Measure is required.");
    if (!description.trim()) errors.push("Description is required.");
    if (images.length === 0) errors.push("Please upload at least one image.");
    if (!startDate) errors.push("Start Date is required.");
    if (!endDate) errors.push("End Date is required.");
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.push("Start Date must be before End Date.");
    }
    return errors;
  };

  const handleCreate = async () => {
    // run client‐side validation
    const errors = validateForm();
    if (errors.length) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    const payload = {
      productName,
      productType,
      price,
      unitOfMeasure,
      description,
      images,
      startDate,
      endDate,
    };

    console.log("📤 Payload:", payload);

    try {
      const response = await axios.post(
        "/api/business/create-product",
        payload
      );
      console.log("✅ API Response:", response.data);
      alert("Product created successfully!");
    } catch (error) {
      console.error("❌ API Error:", error);
      alert("Failed to create product!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex text-black">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="product"
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
                  <Label
                    htmlFor="product-name"
                    className="text-sm font-semibold text-white/90"
                  >
                    Product Name
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    onChange={(e) => setProductName(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="product-type"
                    className="text-sm font-semibold text-white/90"
                  >
                    Product Type
                  </Label>
                  <Input
                    id="product-type"
                    placeholder="Enter product type"
                    onChange={(e) => setProductType(e.target.value)}
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
                  <Label
                    htmlFor="sale-price"
                    className="text-sm font-semibold text-white/90"
                  >
                    Sale Price
                  </Label>
                  <Input
                    id="sale-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="unit-measure"
                    className="text-sm font-semibold text-white/90"
                  >
                    Unit of Measure
                  </Label>
                  <Input
                    id="unit-measure"
                    placeholder="e.g., pieces, kg, liters"
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
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
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-white/90"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  onChange={(e) => setDescription(e.target.value)}
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
                <Label className="text-sm font-semibold text-white/90">
                  Image
                </Label>
                <FileUpload
                  accept="image/*"
                  multiple={true}
                  onChange={(base64s) => setImages(base64s)}
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
                    onChange={(e) => setEndDate(e.target.value)}
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
                <Button
                  onClick={handleCreate}
                  className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  CREATE
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
