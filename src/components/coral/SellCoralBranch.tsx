"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NFTGrid } from "./NFTGrid";
import { Coral } from "@/types/coral";
import {
  DollarSign,
  TrendingDown,
  Info,
  AlertCircle,
  CheckCircle,
  Wallet,
  Package,
  Percent,
  Calculator,
  Eye,
  EyeOff,
} from "lucide-react";

interface SellCoralBranchProps {
  rootNft: Coral;
  userOwnedNfts?: Coral[];
}

export function SellCoralBranch({
  rootNft,
  userOwnedNfts = [],
}: SellCoralBranchProps) {
  const [displayedCount, setDisplayedCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSaleComplete = (saleData: any) => {
    setSales((prev) => [...prev, saleData]);
    console.log("Sale completed:", saleData);
    // Here you could also update the backend, show notifications, etc.
  };

  // Mock data for user's owned coral NFTs that can be sold
  const mockOwnedNfts: Coral[] = useMemo(
    () => [
      {
        ...rootNft,
        id: `${rootNft.id}-owned-1`,
        title: `${rootNft.title} - My Branch #1`,
        sharePercentage: 45,
        pricing: rootNft.pricing * 0.45,
        remainingPercentage: 45,
        isPartialSale: false,
        isRootNft: false,
        rootNftId: null, // Fix: set to null for consistency
        rootNftValue: rootNft.rootNftValue,
        sellerId: "current-user", // Use sellerId instead of ownerId
        debtNftImageUrl:
          "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/c0fcdf6eff36c1d317a7248b0c7b0326.png?w=350",
      },
      {
        ...rootNft,
        id: `${rootNft.id}-owned-2`,
        title: `${rootNft.title} - My Branch #2`,
        sharePercentage: 30,
        pricing: rootNft.pricing * 0.3,
        remainingPercentage: 30,
        isPartialSale: false,
        isRootNft: false,
        rootNftId: null,
        rootNftValue: rootNft.rootNftValue,
        sellerId: "current-user",
        debtNftImageUrl:
          "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/2852bacb9aea64afbc2b0c5657e04d7f.png?w=350",
      },
      {
        ...rootNft,
        id: `${rootNft.id}-owned-3`,
        title: `${rootNft.title} - My Branch #3`,
        sharePercentage: 20,
        pricing: rootNft.pricing * 0.2,
        remainingPercentage: 20,
        isPartialSale: false,
        isRootNft: false,
        rootNftId: null,
        rootNftValue: rootNft.rootNftValue,
        sellerId: "current-user",
        debtNftImageUrl:
          "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/12fedd765f414aad994f6397f26e6367.png?w=350",
      },
      {
        ...rootNft,
        id: `${rootNft.id}-owned-4`,
        title: `${rootNft.title} - My Branch #4`,
        sharePercentage: 12,
        pricing: rootNft.pricing * 0.12,
        remainingPercentage: 12,
        isPartialSale: false,
        isRootNft: false,
        rootNftId: null,
        rootNftValue: rootNft.rootNftValue,
        sellerId: "current-user",
        debtNftImageUrl:
          "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/35838a02b66bf9149b1ec7ea6d5256e3.png?w=350",
      },
      // Root NFT if user owns it
      ...(rootNft.isRootNft
        ? [
            {
              ...rootNft,
              id: rootNft.id,
              title: `${rootNft.title} - Root NFT`,
              sharePercentage: 100,
              pricing: rootNft.pricing,
              remainingPercentage: 100,
              isPartialSale: false,
              isRootNft: true,
              sellerId: "current-user",
            },
          ]
        : []),
    ],
    [rootNft]
  );

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 4, mockOwnedNfts.length));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            className="p-3 bg-gradient-to-r from-[#F37740] to-[#E2725B] rounded-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.25 }}
          >
            <DollarSign className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F37740] to-[#E2725B] bg-clip-text text-transparent">
            Sell Your Coral Branches
          </h2>
        </div>

        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          List your coral branch NFTs for sale in the marketplace. Choose to
          sell the entire branch or customize the percentage you want to offer.
          Set your own pricing and reach potential buyers.
        </p>

        {/* Control Panel */}
        <motion.div
          className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-1">
                  Selling Your Coral Branches:
                </p>
                <p>
                  Click on any NFT card to start the selling process. You can
                  sell the entire share or split it into smaller percentages for
                  multiple buyers.
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                previewMode
                  ? "bg-orange-600 text-white"
                  : "bg-white text-orange-600 border border-orange-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {previewMode ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {previewMode ? "Exit Preview" : "Preview Mode"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {mockOwnedNfts.length}
          </div>
          <div className="text-sm text-gray-600">Owned NFTs</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {mockOwnedNfts.reduce(
              (sum, nft) => sum + (nft.sharePercentage || 0),
              0
            )}
            %
          </div>
          <div className="text-sm text-gray-600">Total Ownership</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            $
            {mockOwnedNfts
              .reduce((sum, nft) => sum + (nft.pricing || 0), 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Portfolio Value</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {sales.length}
          </div>
          <div className="text-sm text-gray-600">Active Listings</div>
        </div>
      </motion.div>

      {/* Owned NFTs for Sale */}
      {mockOwnedNfts.length > 0 ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl font-semibold text-gray-900">
                Your Coral Collection ({mockOwnedNfts.length})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Ready to Sell</span>
            </div>
          </div>

          <NFTGrid
            nfts={mockOwnedNfts}
            displayedCount={displayedCount}
            totalCount={mockOwnedNfts.length}
            onLoadMore={handleLoadMore}
            loading={loading}
            isSellMode={true}
            onSaleComplete={handleSaleComplete}
            isPreviewMode={previewMode}
          />

          {/* Sales History */}
          {sales.length > 0 && (
            <motion.div
              className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Recent Sales ({sales.length})
              </h4>
              <div className="space-y-3">
                {sales.slice(-3).map((sale, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {sale.percentage}% share of {sale.nftId}
                        </div>
                        <div className="text-sm text-gray-600">
                          Listed at: ${sale.listingPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          ${sale.expectedRevenue.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expected Revenue
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No NFTs to Sell
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You don't currently own any coral branch NFTs that can be listed for
            sale. Purchase some coral branches first or check back later.
          </p>
        </motion.div>
      )}
    </div>
  );
}
