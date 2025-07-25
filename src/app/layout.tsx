import type { Metadata } from "next";
import { Exo, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WalletProvider } from "./provider/AptosProvider";

const exo = Exo({ subsets: ["latin"], variable: "--font-exo" });

export const metadata: Metadata = {
  title: "Fusumi",
  description: "Cash Flow Made Easy",
  icons: {
    icon: "/Fusumi_Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${exo.variable}`}>
        <WalletProvider>
          <Header />
          {children}
          {/* <Footer /> */}
        </WalletProvider>
      </body>
    </html>
  );
}
