"use client";

import { Button } from "@/components/ui/ButtonBussiness";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { FileUpload } from "@/components/ui/FilesUpload";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Sidebar } from "@/components/ui/SideBar";
import { Textarea } from "@/components/ui/TextArea";
import { fusumi_deployer_address } from "@/utils/deployerAddress";
import { aptos } from "@/utils/indexer";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

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
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    wallet?: string;
    fields?: string;
  }>({});

  // collect validation errors
  // const validateForm = (): string[] => {
  //   const errors: string[] = [];
  //   if (!productName.trim()) errors.push("Product Name is required.");
  //   if (!productType.trim()) errors.push("Product Type is required.");
  //   if (!(price > 0)) errors.push("Price must be greater than zero.");
  //   if (!unitOfMeasure.trim()) errors.push("Unit of Measure is required.");
  //   if (!description.trim()) errors.push("Description is required.");
  //   if (images.length === 0) errors.push("Please upload at least one image.");
  //   if (!startDate) errors.push("Start Date is required.");
  //   if (!endDate) errors.push("End Date is required.");
  //   if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
  //     errors.push("Start Date must be before End Date.");
  //   }
  //   return errors;
  // };

  // const handleCreate = async () => {
  //   // run client‐side validation
  //   const errors = validateForm();
  //   if (errors.length) {
  //     alert("Please fix the following errors:\n" + errors.join("\n"));
  //     return;
  //   }

  //   const payload = {
  //     productName,
  //     productType,
  //     price,
  //     unitOfMeasure,
  //     description,
  //     images,
  //     startDate,
  //     endDate,
  //   };

  //   console.log("Payload:", payload);

  //   try {
  //     const response = await axios.post(
  //       "/api/business/create-product",
  //       payload
  //     );
  //     console.log("API Response:", response.data);
  //     alert("Product created successfully!");
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     alert("Failed to create product!");
  //   }
  // };
  // -----------------------------------------------
  const { account, connected, connect, signAndSubmitTransaction } = useWallet();
  const [productId, setProductId] = useState("product-2");
  const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

  // Clear errors when user fixes issues
  useEffect(() => {
    if (errors.wallet && account) {
      setErrors((prev) => ({ ...prev, wallet: undefined }));
    }
  }, [account, errors.wallet]);

  useEffect(() => {
    if (
      errors.fields &&
      productName &&
      productType &&
      category &&
      price > 0 &&
      unitOfMeasure &&
      description &&
      startDate &&
      endDate
    ) {
      setErrors((prev) => ({ ...prev, fields: undefined }));
    }
  }, [
    productName,
    productType,
    category,
    price,
    unitOfMeasure,
    description,
    startDate,
    endDate,
    errors.fields,
  ]);
  // const [productName, setProductName] = useState("My Product");
  // const [productType, setProductType] = useState("service"); // hoặc 'goods'...
  // const [productPrice, setProductPrice] = useState(5000);
  // const [unitOfMeasure, setUnitOfMeasure] = useState("unit");
  // const [productDescription, setProductDescription] = useState(
  //   "Optional description"
  // );
  // const [productImages, setProductImages] = useState([
  //   "https://example.com/image1.png",
  //   "https://example.com/image2.png",
  // ]);
  // const [startDate, setStartDate] = useState(1723545600); // unix timestamp
  // const [endDate, setEndDate] = useState(1726224000); // unix timestamp
  const handleCreateProduct = async () => {
    // Clear previous errors
    setErrors({});

    if (!account) {
      setErrors({ wallet: "Please connect wallet first" });
      return;
    }

    // Basic validation
    if (!productName.trim() || !productType || !category || price <= 0 || !unitOfMeasure || !description || !startDate || !endDate) {
      setErrors({ fields: "Please fill in all required fields" });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrors({ fields: "Start date must be before end date" });
      return;
    }

    setIsProcessing(true);

    const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    // Console log all entered values
    console.log("=== PRODUCT CREATION DATA ===");
    console.log("Product ID:", productId);
    console.log("Product Name:", productName);
    console.log("Product Type:", productType);
    console.log("Category:", category);
    console.log("Price:", price);
    console.log("Unit of Measure:", unitOfMeasure);
    console.log("Description:", description);
    console.log("Images:", images);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("startDateTimestamp:", startDateTimestamp);
    console.log("endDateTimestamp:", endDateTimestamp);
    console.log("Connected wallet:", account);
    console.log("=============================");

    try {
      // First, save to JSON via API
      const productData = {
        productName,
        productType: productType.toUpperCase(),
        category,
        price,
        unitOfMeasure,
        description,
        images,
        startDate,
        endDate,
        businessId: "bus-002", // Default business ID - in real app, this would come from authenticated user
      };

      const apiResponse = await fetch("/api/products/manage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to save product to API");
      }

      const apiResult = await apiResponse.json();
      console.log("Product saved to API:", apiResult);

      // Then, submit to blockchain
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${fusumi_deployer_address}::fusumi::load_cargo`,
          typeArguments: [],
          functionArguments: [
            // productId,
            // productName,
            // productType,
            // price.toString(),
            // unitOfMeasure,
            // description,
            // images.length > 0 ? images : ["placeholder"],
            // startDateTimestamp,
            // endDateTimestamp,
          ],
        },
      });

      console.log(`Created Product! ${response.hash}`);
      const wait = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });
      console.log(`Transaction status: ${wait.success ? "Success" : "Failed"}`);

      setIsProcessing(false);
      setIsSuccess(true);

      // Auto close success state and reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form after successful creation
        setProductName("");
        setProductType("");
        setCategory("");
        setPrice(0);
        setUnitOfMeasure("");
        setDescription("");
        setImages([]);
        setStartDate("");
        setEndDate("");
      }, 3000);

    } catch (error) {
      console.error("Error creating product:", error);
      setIsProcessing(false);
      setErrors({ fields: `Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}` });
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
                    value={productName}
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
                  {/* <Input
                    id="product-type"
                    placeholder="Enter product type"
                    onChange={(e) => setProductType(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  /> */}
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 w-full p-2 rounded-md"
                  >
                    <option value="" disabled>
                      Select product type
                    </option>
                    <option value="service">SERVICE</option>
                    <option value="product">PRODUCT</option>
                  </select>
                </div>
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
                  placeholder="Select business category"
                  showExamples={false}
                />
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
                    value={price || ""}
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
                    value={unitOfMeasure}
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
                  value={description}
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

              {/* Error Messages */}
              {(errors.wallet || errors.fields) && (
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
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <Button
                  onClick={handleCreateProduct}
                  disabled={isProcessing}
                  className="px-12 py-3 bg-gradient-to-r from-[#2a6b7f] to-[#3587A3] hover:from-[#1f5a6b] hover:to-[#2a6b7f] text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                Product Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your product has been created and saved to the system.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
