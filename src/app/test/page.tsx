// "use client"
// import React, { useState, useRef, useEffect } from "react";
// import { Image as LucideImage, Download, RefreshCw } from "lucide-react";
// const WorkingImageGenerator = () => {
//   const [activeTab, setActiveTab] = useState("canvas");
//   const [formData, setFormData] = useState({
//     name: "John Doe",
//     amount: "$1,000",
//     description: "Premium Member",
//     image: "https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg",
//   });
//   const [isGenerating, setIsGenerating] = useState(false);

//   const tabs = [
//     { id: "canvas", label: "Canvas API", color: "bg-blue-500" },
//     { id: "html2canvas", label: "HTML to Canvas", color: "bg-green-500" },
//     { id: "svg", label: "SVG Method", color: "bg-purple-500" },
//     { id: "combined", label: "Advanced Canvas", color: "bg-orange-500" },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen text-black">
//       <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Working Image Generator
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Tạo và download ảnh thực tế với các phương pháp khác nhau
//         </p>

//         {/* Form */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Amount
//             </label>
//             <input
//               type="text"
//               value={formData.amount}
//               onChange={(e) =>
//                 setFormData({ ...formData, amount: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <input
//               type="text"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 activeTab === tab.id
//                   ? `${tab.color} text-white`
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Generators */}
//       <div className="bg-white rounded-lg shadow-lg p-6">
//         {activeTab === "canvas" && <CanvasGenerator formData={formData} />}
//         {activeTab === "html2canvas" && (
//           <HtmlCanvasGenerator formData={formData} />
//         )}
//         {activeTab === "svg" && <SvgGenerator formData={formData} />}
//         {activeTab === "combined" && (
//           <AdvancedCanvasGenerator formData={formData} />
//         )}
//       </div>
//     </div>
//   );
// };

// // 1. Canvas API Generator
// const CanvasGenerator = ({ formData }) => {
//   const canvasRef = useRef(null);
//   const [imageGenerated, setImageGenerated] = useState(false);

//   const generateImage = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     canvas.width = 500;
//     canvas.height = 350;

//     // Background gradient
//     const gradient = ctx.createLinearGradient(0, 0, 0, 350);
//     gradient.addColorStop(0, "#667eea");
//     gradient.addColorStop(1, "#764ba2");
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, 500, 350);

//     // Decorative circles
//     ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
//     ctx.beginPath();
//     ctx.arc(450, 50, 80, 0, Math.PI * 2);
//     ctx.fill();

//     ctx.beginPath();
//     ctx.arc(50, 300, 60, 0, Math.PI * 2);
//     ctx.fill();

//     // Mock image placeholder
//     ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
//     ctx.fillRect(30, 30, 150, 100);
//     ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
//     ctx.lineWidth = 2;
//     ctx.setLineDash([10, 5]);
//     ctx.strokeRect(30, 30, 150, 100);

//     // Image icon
//     ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
//     ctx.font = "16px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("📷", 105, 75);
//     ctx.fillText("Your Image", 105, 95);

//     // Info overlay
//     ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
//     ctx.fillRect(0, 250, 500, 100);

//     // Text content
//     ctx.fillStyle = "#ffffff";
//     ctx.font = "bold 24px Arial";
//     ctx.textAlign = "left";
//     ctx.fillText(formData.name, 30, 280);

//     ctx.fillStyle = "#4ade80";
//     ctx.font = "bold 20px Arial";
//     ctx.fillText(formData.amount, 30, 310);

//     ctx.fillStyle = "#d1d5db";
//     ctx.font = "16px Arial";
//     ctx.fillText(formData.description, 30, 335);

//     // Add timestamp
//     ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
//     ctx.font = "12px Arial";
//     ctx.textAlign = "right";
//     ctx.fillText(`Generated: ${new Date().toLocaleString()}`, 470, 340);

//     setImageGenerated(true);
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement("a");
//     link.download = `card-${formData.name.replace(
//       /\s+/g,
//       "_"
//     )}-${Date.now()}.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   useEffect(() => {
//     generateImage();
//   }, [formData]);

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Canvas API Method
//         </h2>
//         <div className="flex gap-2">
//           <button
//             onClick={generateImage}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             <RefreshCw size={16} />
//             Regenerate
//           </button>
//           <button
//             onClick={downloadImage}
//             disabled={!imageGenerated}
//             className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
//           >
//             <Download size={16} />
//             Download PNG
//           </button>
//         </div>
//       </div>

//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         <canvas
//           ref={canvasRef}
//           className="border border-gray-300 rounded-lg shadow-sm max-w-full"
//         />
//       </div>

//       <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
//         <p>
//           <strong>Cách hoạt động:</strong> Sử dụng Canvas API để vẽ trực tiếp,
//           sau đó chuyển thành PNG để download
//         </p>
//       </div>
//     </div>
//   );
// };

// // 2. HTML to Canvas Generator
// const HtmlCanvasGenerator = ({ formData }) => {
//   const cardRef = useRef(null);

//   const downloadAsImage = async () => {
//     const element = cardRef.current;

//     // Create a new canvas
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // Set canvas size
//     canvas.width = 500;
//     canvas.height = 350;

//     // Get element dimensions and styles
//     const rect = element.getBoundingClientRect();
//     const styles = window.getComputedStyle(element);

//     // Draw background
//     const gradient = ctx.createLinearGradient(0, 0, 0, 350);
//     gradient.addColorStop(0, "#667eea");
//     gradient.addColorStop(1, "#764ba2");
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, 500, 350);

//     // Draw decorative elements
//     ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
//     ctx.beginPath();
//     ctx.arc(450, 50, 80, 0, Math.PI * 2);
//     ctx.fill();

//     // Draw image placeholder
//     ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
//     ctx.fillRect(30, 30, 150, 100);
//     ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
//     ctx.font = "16px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("📷", 105, 75);
//     ctx.fillText("Your Image", 105, 95);

//     // Draw info overlay
//     ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
//     ctx.fillRect(0, 250, 500, 100);

//     // Draw text
//     ctx.fillStyle = "#ffffff";
//     ctx.font = "bold 24px Arial";
//     ctx.textAlign = "left";
//     ctx.fillText(formData.name, 30, 280);

//     ctx.fillStyle = "#4ade80";
//     ctx.font = "bold 20px Arial";
//     ctx.fillText(formData.amount, 30, 310);

//     ctx.fillStyle = "#d1d5db";
//     ctx.font = "16px Arial";
//     ctx.fillText(formData.description, 30, 335);

//     // Download
//     const link = document.createElement("a");
//     link.download = `html-card-${formData.name.replace(
//       /\s+/g,
//       "_"
//     )}-${Date.now()}.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">
//           HTML to Canvas Method
//         </h2>
//         <button
//           onClick={downloadAsImage}
//           className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//         >
//           <Download size={16} />
//           Download PNG
//         </button>
//       </div>

//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         <div
//           ref={cardRef}
//           className="relative w-full max-w-md h-80 rounded-xl shadow-lg overflow-hidden mx-auto"
//           style={{
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           }}
//         >
//           {/* Decorative elements */}
//           <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>

//           {/* Mock image */}
//           <div className="absolute top-6 left-6 w-32 h-20 bg-white bg-opacity-20 rounded-lg flex items-center justify-center border-2 border-dashed border-white border-opacity-40">
//             <div className="text-center text-white opacity-70">
//               <Image size={24} className="mx-auto mb-1" />
//               <div className="text-xs">Your Image</div>
//             </div>
//           </div>

//           {/* Info overlay */}
//           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6">
//             <div className="space-y-2">
//               <h3 className="text-xl font-bold text-white">{formData.name}</h3>
//               <p className="text-lg text-green-300 font-semibold">
//                 {formData.amount}
//               </p>
//               <p className="text-sm text-gray-300">{formData.description}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
//         <p>
//           <strong>Cách hoạt động:</strong> Render HTML element thành canvas, sau
//           đó export PNG. Phù hợp cho design phức tạp.
//         </p>
//       </div>
//     </div>
//   );
// };

// // 3. SVG Generator
// const SvgGenerator = ({ formData }) => {
//   const downloadSvg = () => {
//     const svgContent = `
//       <svg width="500" height="350" xmlns="http://www.w3.org/2000/svg">
//         <defs>
//           <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
//             <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
//             <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
//           </linearGradient>
//         </defs>
        
//         <!-- Background -->
//         <rect width="500" height="350" fill="url(#grad1)" />
        
//         <!-- Decorative circle -->
//         <circle cx="450" cy="50" r="80" fill="rgba(255,255,255,0.1)" />
        
//         <!-- Image placeholder -->
//         <rect x="30" y="30" width="150" height="100" fill="rgba(255,255,255,0.2)" rx="8" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-dasharray="10,5"/>
//         <text x="105" y="75" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="16">📷</text>
//         <text x="105" y="95" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="12">Your Image</text>
        
//         <!-- Info overlay -->
//         <rect x="0" y="250" width="500" height="100" fill="rgba(0,0,0,0.8)" />
        
//         <!-- Text content -->
//         <text x="30" y="280" fill="white" font-size="24" font-weight="bold">
//           ${formData.name}
//         </text>
//         <text x="30" y="310" fill="#4ade80" font-size="20" font-weight="bold">
//           ${formData.amount}
//         </text>
//         <text x="30" y="335" fill="#d1d5db" font-size="16">
//           ${formData.description}
//         </text>
        
//         <!-- Timestamp -->
//         <text x="470" y="340" fill="rgba(255,255,255,0.5)" font-size="12" text-anchor="end">
//           Generated: ${new Date().toLocaleString()}
//         </text>
//       </svg>
//     `;

//     // Convert SVG to PNG
//     const canvas = document.createElement("canvas");
//     canvas.width = 500;
//     canvas.height = 350;
//     const ctx = canvas.getContext("2d");

//     const img = new Image();
//     img.src =
//       "https://www.skyweaver.net/images/media/wallpapers/wallpaper1.jpg";
//     img.onload = () => {
//       ctx.drawImage(img, 0, 0);
//       const link = document.createElement("a");
//       link.download = `svg-card-${formData.name.replace(
//         /\s+/g,
//         "_"
//       )}-${Date.now()}.png`;
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     };

//     const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
//     const url = URL.createObjectURL(svgBlob);
//     img.src = url;
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">SVG Method</h2>
//         <button
//           onClick={downloadSvg}
//           className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
//         >
//           <Download size={16} />
//           Download PNG
//         </button>
//       </div>

//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         <svg
//           width="500"
//           height="350"
//           className="border border-gray-300 rounded-lg shadow-sm max-w-full"
//           viewBox="0 0 500 350"
//         >
//           <defs>
//             <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
//               <stop offset="0%" stopColor="#667eea" />
//               <stop offset="100%" stopColor="#764ba2" />
//             </linearGradient>
//           </defs>

//           <rect width="500" height="350" fill="url(#grad1)" />

//           <circle cx="450" cy="50" r="80" fill="rgba(255,255,255,0.1)" />

//           {/* <rect
//             x="30"
//             y="30"
//             width="150"
//             height="100"
//             fill="rgba(255,255,255,0.2)"
//             rx="8"
//             stroke="rgba(255,255,255,0.4)"
//             strokeWidth="2"
//             strokeDasharray="10,5"
//           />
//           <text
//             x="105"
//             y="75"
//             textAnchor="middle"
//             fill="rgba(255,255,255,0.6)"
//             fontSize="16"
//           >
//             📷
//           </text>
//           <text
//             x="105"
//             y="95"
//             textAnchor="middle"
//             fill="rgba(255,255,255,0.6)"
//             fontSize="12"
//           >
//             Your Image
//           </text> */}
//           <image
//             href={formData.image}
//             x="30"
//             y="30"
//             width="150"
//             height="100"
//             preserveAspectRatio="xMidYMid slice"
//           />

//           <rect x="0" y="250" width="500" height="100" fill="rgba(0,0,0,0.8)" />

//           <text x="30" y="280" fill="white" fontSize="24" fontWeight="bold">
//             {formData.name}
//           </text>
//           <text x="30" y="310" fill="#4ade80" fontSize="20" fontWeight="bold">
//             {formData.amount}
//           </text>
//           <text x="30" y="335" fill="#d1d5db" fontSize="16">
//             {formData.description}
//           </text>

//           <text
//             x="470"
//             y="340"
//             fill="rgba(255,255,255,0.5)"
//             fontSize="12"
//             textAnchor="end"
//           >
//             Generated: {new Date().toLocaleString()}
//           </text>
//         </svg>
//       </div>

//       <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
//         <p>
//           <strong>Cách hoạt động:</strong> Tạo SVG programmatically, sau đó
//           convert sang PNG. Tốt cho graphics đơn giản.
//         </p>
//       </div>
//     </div>
//   );
// };

// // 4. Advanced Canvas Generator
// const AdvancedCanvasGenerator = ({ formData }) => {
//   const canvasRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const generateAdvancedImage = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     canvas.width = 600;
//     canvas.height = 400;

//     // Advanced gradient background
//     const gradient = ctx.createRadialGradient(300, 200, 0, 300, 200, 300);
//     gradient.addColorStop(0, "#667eea");
//     gradient.addColorStop(0.5, "#764ba2");
//     gradient.addColorStop(1, "#2d1b69");
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, 600, 400);

//     // Geometric patterns
//     ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
//     for (let i = 0; i < 20; i++) {
//       const x = Math.random() * 600;
//       const y = Math.random() * 400;
//       const size = Math.random() * 50 + 10;

//       ctx.beginPath();
//       ctx.arc(x, y, size, 0, Math.PI * 2);
//       ctx.fill();
//     }

//     // Main content area
//     ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
//     ctx.fillRect(40, 40, 520, 120);

//     // Image placeholder with border
//     ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
//     ctx.fillRect(60, 60, 180, 80);
//     ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
//     ctx.lineWidth = 3;
//     ctx.strokeRect(60, 60, 180, 80);

//     // Advanced text styling
//     ctx.fillStyle = "#ffffff";
//     ctx.font = "bold 32px Arial";
//     ctx.textAlign = "left";
//     ctx.fillText(formData.name, 260, 90);

//     ctx.fillStyle = "#4ade80";
//     ctx.font = "bold 28px Arial";
//     ctx.fillText(formData.amount, 260, 125);

//     ctx.fillStyle = "#d1d5db";
//     ctx.font = "18px Arial";
//     ctx.fillText(formData.description, 260, 150);

//     // Info panel
//     const panelGradient = ctx.createLinearGradient(0, 280, 0, 400);
//     panelGradient.addColorStop(0, "rgba(0, 0, 0, 0.6)");
//     panelGradient.addColorStop(1, "rgba(0, 0, 0, 0.9)");
//     ctx.fillStyle = panelGradient;
//     ctx.fillRect(0, 280, 600, 120);

//     // Additional details
//     ctx.fillStyle = "#ffffff";
//     ctx.font = "16px Arial";
//     ctx.fillText("🎖️ Status: Active", 40, 320);
//     ctx.fillText(`📅 Created: ${new Date().toLocaleDateString()}`, 40, 345);
//     ctx.fillText(
//       `🔢 ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
//       40,
//       370
//     );

//     // QR code placeholder
//     ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
//     ctx.fillRect(480, 300, 80, 80);
//     ctx.fillStyle = "#000000";
//     ctx.font = "12px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("QR Code", 520, 345);
//   };

//   const downloadAdvancedImage = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement("a");
//     link.download = `advanced-card-${formData.name.replace(
//       /\s+/g,
//       "_"
//     )}-${Date.now()}.png`;
//     link.href = canvas.toDataURL("image/png", 0.9);
//     link.click();
//   };

//   useEffect(() => {
//     generateAdvancedImage();
//   }, [formData]);

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Advanced Canvas Method
//         </h2>
//         <div className="flex gap-2">
//           <button
//             onClick={generateAdvancedImage}
//             className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             <RefreshCw size={16} />
//             Regenerate
//           </button>
//           <button
//             onClick={downloadAdvancedImage}
//             className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//           >
//             <Download size={16} />
//             Download PNG
//           </button>
//         </div>
//       </div>

//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         <canvas
//           ref={canvasRef}
//           className="border border-gray-300 rounded-lg shadow-sm max-w-full"
//         />
//       </div>

//       <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
//         <p>
//           <strong>Cách hoạt động:</strong> Canvas nâng cao với gradient phức
//           tạp, patterns, và nhiều thông tin chi tiết.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default WorkingImageGenerator;


// // 1. Canvas API

// // ✅ Hiệu suất cao, linh hoạt
// // ❌ Code nhiều, khó styling phức tạp
// // 🎯 Phù hợp: Xử lý ảnh cơ bản, overlay đơn giản

// // 2. HTML to Canvas

// // ✅ Dễ styling với CSS, responsive
// // ❌ Cần thư viện html2canvas, file size lớn
// // 🎯 Phù hợp: Layout phức tạp, design đẹp

// // 3. SVG Overlay

// // ✅ Vector graphics, scalable, file nhẹ
// // ❌ Khó xử lý ảnh bitmap
// // 🎯 Phù hợp: Icons, logos, graphics đơn giản

// // 4. CSS Styling

// // ✅ Dễ design, responsive, hiệu ứng đẹp
// // ❌ Phụ thuộc screenshot tool
// // 🎯 Phù hợp: UI components, modern design


export default function TestPage() {}