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
import { motion } from "framer-motion";
import { useState } from "react";

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
  const [productId, setProductId] = useState("product-1");
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
  const startDateTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
  const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
  const handleCreateProduct = async () => {
    if (!account) {
      alert("Please connect wallet first");
      return;
    }

    // Basic validation
    if (!productName.trim()) {
      alert("Please enter a product name");
      return;
    }
    if (!productType) {
      alert("Please select a product type");
      return;
    }
    if (!category) {
      alert("Please select a business category");
      return;
    }
    if (price <= 0) {
      alert("Please enter a valid price");
      return;
    }
    // const response = await signAndSubmitTransaction({
    //   sender: account.address,
    //   data: {
    //     function: `${fusumi_deployer_address}::product_registry::create_product`,
    //     // functionArguments: [
    //     //   account.address,
    //     //   "IPFS", //IPFS ICD Image
    //     //   productName,
    //     //   productType,
    //     //   price,
    //     //   unitOfMeasure,
    //     //   description,
    //     //   images,
    //     //   startDate,
    //     //   endDate,
    //     // ],
    //     functionArguments: [
    //       account.address.toString(),
    //       "ipfs://QmXyZ12345abcde", // IPFS ICD Image
    //       "Premium Coffee Beans",    // productName
    //       "Grocery",                 // productType
    //       "1999",                    // price (in smallest unit, e.g., cents or atomic unit)
    //       "grams",                   // unitOfMeasure
    //       "High-quality Arabica beans sourced from Vietnam.", // description
    //       ["ipfs://QmImg1", "ipfs://QmImg2"], // images (array of IPFS links)
    //       Math.floor(new Date("2025-07-01T00:00:00Z").getTime() / 1000).toString(),
    //       Math.floor(new Date("2025-12-31T23:59:59Z").getTime() / 1000).toString(),
    //     ],
    //   },
    // });
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
    const wait = await aptos.waitForTransaction({ transactionHash: response.hash });
    console.log(`Transaction status: ${wait.success ? "Success" : "Failed"}`);

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
        businessId: "b1", // Default business ID - in real app, this would come from authenticated user
      };

      const apiResponse = await fetch('/api/products/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to save product to API');
      }

      const apiResult = await apiResponse.json();
      console.log('Product saved to API:', apiResult);

      // // Then, submit to blockchain
      // const tx = await signAndSubmitTransaction({
      //   sender: account.address,
      //   data: {
      //     function: `${fusumi_deployer_address}::product_registry::create_product`,
      //     typeArguments: [],
      //     functionArguments: [
      //       productId,
      //       productName,
      //       productType,
      //       price.toString(),
      //       unitOfMeasure,
      //       description,
      //       images.length > 0 ? images : ["placeholder"],
      //       startDateTimestamp,
      //       endDateTimestamp,
      //     ],
      //   },
      // });

      // console.log(`Created Product! ${tx.hash}`);
      // const wait = await aptos.waitForTransaction({ transactionHash: tx.hash });
      // console.log(`Transaction status: ${wait.success ? "Success" : "Failed"}`);
      
      alert(`Successfully created product!\nAPI: ${apiResult.message}\n`);
      
      // Reset form
      setProductName("");
      setProductType("");
      setCategory("");
      setPrice(0);
      setUnitOfMeasure("");
      setDescription("");
      setImages([]);
      setStartDate("");
      setEndDate("");
      
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // run client‐side validation
    // const errors = validateForm();
    // if (errors.length) {
    //   alert("Please fix the following errors:\n" + errors.join("\n"));
    //   return;
    // }

    // const payload = {
    //   productName,
    //   productType,
    //   price,
    //   unitOfMeasure,
    //   description,
    //   images,
    //   startDate,
    //   endDate,
    // };

    // console.log("Payload:", payload);

    // try {
    //   const response = await axios.post(
    //     "/api/business/create-product",
    //     payload
    //   );
    //   console.log("API Response:", response.data);
    //   alert("Product created successfully!");
    // } catch (error) {
    //   console.error("API Error:", error);
    //   alert("Failed to create product!");
    // }
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
                  {/* <Input
                    id="product-type"
                    placeholder="Enter product type"
                    onChange={(e) => setProductType(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300"
                  /> */}
                  <select
                    onChange={(e) => setProductType(e.target.value)}
                    className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 transition-all duration-300 w-full p-2 rounded-md"
                  >
                    <option value="" disabled selected>
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
                  onClick={handleCreateProduct}
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
