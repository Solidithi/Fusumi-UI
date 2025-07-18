"use client";

import { motion } from "framer-motion";
import { useState } from "react"; // CHANGE: Added useState import for state management
import {
  Home,
  FileText,
  Tag,
  PlusCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Shield,
  DollarSign,
  ShoppingCart,
  Image,
} from "lucide-react";
import { Button } from "./ButtonBussiness";
import { useRouter } from "next/navigation";
// import { AnimatedButton } from "./Button"
// import { Button } from "@/components/ui/button"
const customersRoot = "/customers/";
const customersSidebarItems = [
  // {
  //   icon: DollarSign,
  //   label: "Repay",
  //   id: "repay",
  //   path: customersRoot + "repay",
  // },
  {
    icon: FileText,
    label: "My Invoices",
    id: "my-invoices",
    path: customersRoot + "my-invoices",
  },
  {
    icon: Image,
    label: "My NFT",
    id: "my-nft",
    path: customersRoot + "my-nft",
  },
  // {
  //   icon: ShoppingCart,
  //   label: "Marketplace",
  //   id: "marketplace",
  //   path: customersRoot + "marketplace",
  // },
];

const businessRoot = "/business/";
const businessSidebarItems = [
  {
    icon: Home,
    label: "Dashboard",
    id: "home",
    path: businessRoot + "/dashboard",
  },
  {
    icon: FileText,
    label: "Invoice Creation",
    id: "invoice",
    path: businessRoot + "/create-invoice",
  },
  // {
  //   icon: Wrench,
  //   label: "Service Creation",
  //   id: "service",
  //   path: businessRoot + "/create-service",
  // },
  {
    icon: Tag,
    label: "My Offer",
    id: "offer",
    path: businessRoot + "/my-offer",
  },
  {
    icon: PlusCircle,
    label: "Offer Creation",
    id: "offer-create",
    path: businessRoot + "/create-offer",
  },
  {
    icon: Package,
    label: "Product Creation",
    id: "product",
    path: businessRoot + "/create-product",
  },
  {
    icon: Shield,
    label: "KYB Verification",
    id: "kyb",
    path: businessRoot + "/",
  },
];

const accountSidebarItems = [
  { icon: FileText, label: "Profile", id: "profile", path: "/account" },
  {
    icon: FileText,
    label: "My Invoices",
    id: "invoices",
    path: "/account/invoices",
  },
  { icon: Image, label: "My NFT", id: "nfts", path: "/account/nfts" },
  // { icon: Tag, label: "Upgrade", id: "upgrade", path: "/account/upgrade" },
  { icon: Shield, label: "KYC", id: "kyc", path: "/account/kyc" },
];

const containerVariants = {
  expanded: {
    width: 240,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  collapsed: {
    width: 80,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  activePage?: string; // Optional prop to highlight active page
  type?: "business" | "customers" | "account"; // Optional prop to determine which sidebar items to show
}

export function Sidebar({
  isExpanded,
  onToggle,
  activePage,
  type = "business",
}: SidebarProps) {
  // CHANGE: Added state to track which sidebar item is currently active
  const [activeItem, setActiveItem] = useState("invoice"); // Default to "invoice" as it was previously active
  const router = useRouter();
  const sidebarItems =
    type === "account"
      ? accountSidebarItems
      : type === "business"
      ? businessSidebarItems
      : customersSidebarItems;

  // CHANGE: Added function to handle sidebar item clicks
  const handleItemClick = (itemId: (typeof sidebarItems)[number]) => {
    // setActiveItem(itemId);
    router.push(itemId.path);
  };

  return (
    <motion.div
      className="bg-gradient-to-b from-[#2a6b7f] to-[#3587A3] flex flex-col shadow-2xl relative"
      variants={containerVariants as any}
      animate={isExpanded ? "expanded" : "collapsed"}
      initial="expanded"
    >
      {/* Toggle Button - Inside Sidebar */}
      <div>
        {isExpanded ? (
          <div className="flex justify-end p-2 pt-8">
            <Button
              onClick={onToggle}
              size="icon"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-lg transition-all duration-300"
              variant="ghost"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center p-2 pt-8">
            <Button
              onClick={onToggle}
              size="icon"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-lg transition-all duration-300"
              variant="ghost"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {/* <Button
          onClick={onToggle}
          size="icon"
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white shadow-lg transition-all duration-300"
          variant="ghost"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button> */}
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col items-start py-4 px-4 space-y-4 flex-1">
        {sidebarItems.map((item, index) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Button
              variant="ghost"
              onClick={() => handleItemClick(item)} // CHANGE: Added click handler to update active state
              className={`w-full justify-start h-12 transition-all duration-300 ${
                activePage === item.id // CHANGE: Check if current item is active using state instead of item.active
                  ? "bg-white/20 text-white shadow-lg ring-2 ring-white/30"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              } ${isExpanded ? "px-4" : "px-0 justify-center"}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isExpanded && (
                <motion.span
                  className="ml-3 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
