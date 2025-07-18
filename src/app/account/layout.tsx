"use client";
import { useState } from "react";
import { Sidebar } from "@/components/ui/SideBar";

const accountSidebarItems = [
  { id: "profile", label: "Profile" },
  { id: "invoices", label: "My Invoices" },
  { id: "nfts", label: "My NFTs" },
  { id: "upgrade", label: "Upgrade" },
  { id: "kyc", label: "KYC" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage={"account"}
        type="account"
      >
        {/* Optionally, you can render custom sidebar items here */}
      </Sidebar>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
