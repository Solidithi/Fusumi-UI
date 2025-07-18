"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { NFTGrid } from "./NFTGrid";
import { Coral } from "@/types/coral";
import {
  ShoppingCart,
  TrendingUp,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface PurchaseCoralBranchProps {
  rootNft: Coral;
  availableBranches?: Coral[];
}

export function PurchaseCoralBranch({
  rootNft,
  availableBranches = [],
}: PurchaseCoralBranchProps) {
  const [displayedCount, setDisplayedCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);

  const handlePurchaseComplete = (purchaseData: any) => {
    setPurchases((prev) => [...prev, purchaseData]);
    console.log("Purchase completed:", purchaseData);
    // Here you could also update the backend, show notifications, etc.
  };

  // Mock data for available coral branches (splits that are for sale)
  const mockAvailableBranches: Coral[] = useMemo(
    () =>
      [
        {
          ...rootNft,
          id: `${rootNft.id}-branch-1`,
          title: `${rootNft.title} - Branch #1`,
          sharePercentage: 30,
          pricing: rootNft.pricing * 0.3,
          remainingPercentage: 30,
          isPartialSale: true,
          isRootNft: false,
          rootNftId: rootNft.isRootNft ? rootNft.id : rootNft.rootNftId,
          rootNftValue: rootNft.rootNftValue,
          sellerId:
            "0x8b7e5c2d1f4a9b3c7e2f1a6b4d8c9e0f1b2a3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
          debtNftImageUrl:
            "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/c0fcdf6eff36c1d317a7248b0c7b0326.png?w=350",
        },
        {
          ...rootNft,
          id: `${rootNft.id}-branch-2`,
          title: `${rootNft.title} - Branch #2`,
          sharePercentage: 25,
          pricing: rootNft.pricing * 0.25,
          remainingPercentage: 25,
          isPartialSale: true,
          isRootNft: false,
          rootNftId: rootNft.isRootNft ? rootNft.id : rootNft.rootNftId,
          rootNftValue: rootNft.rootNftValue,
          sellerId:
            "0xa1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
          debtNftImageUrl:
            "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/2852bacb9aea64afbc2b0c5657e04d7f.png?w=350",
        },
        {
          ...rootNft,
          id: `${rootNft.id}-branch-3`,
          title: `${rootNft.title} - Branch #3`,
          sharePercentage: 20,
          pricing: rootNft.pricing * 0.2,
          remainingPercentage: 20,
          isPartialSale: true,
          isRootNft: false,
          rootNftId: rootNft.isRootNft ? rootNft.id : rootNft.rootNftId,
          rootNftValue: rootNft.rootNftValue,
          sellerId:
            "0x7e6f5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a29180",
          debtNftImageUrl:
            "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/12fedd765f414aad994f6397f26e6367.png?w=350",
        },
        {
          ...rootNft,
          id: `${rootNft.id}-branch-4`,
          title: `${rootNft.title} - Branch #4`,
          sharePercentage: 15,
          pricing: rootNft.pricing * 0.15,
          remainingPercentage: 15,
          isPartialSale: true,
          isRootNft: false,
          rootNftId: rootNft.isRootNft ? rootNft.id : rootNft.rootNftId,
          rootNftValue: rootNft.rootNftValue,
          sellerId:
            "0x9f8e7d6c5b4a39281706f5e4d3c2b1a0987654321fedcba0987654321fedcba0",
          debtNftImageUrl:
            "https://i2.seadn.io/ethereum/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63/35838a02b66bf9149b1ec7ea6d5256e3.png?w=350",
        },
        {
          ...rootNft,
          id: `${rootNft.id}-branch-5`,
          title: `${rootNft.title} - Branch #5`,
          sharePercentage: 8,
          pricing: rootNft.pricing * 0.08,
          remainingPercentage: 8,
          isPartialSale: true,
          isRootNft: false,
          rootNftId: rootNft.isRootNft ? rootNft.id : rootNft.rootNftId,
          rootNftValue: rootNft.rootNftValue,
          sellerId:
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          debtNftImageUrl:
            "https://i2.seadn.io/ethereum/0x232a68a51d6e07357ae025d2a459c16077327102/d8ec1c65324b53f9cbeca81514d63b/02d8ec1c65324b53f9cbeca81514d63b.gif?w=350",
        },
        {
          ...rootNft,
          id: `${rootNft.id}-branch-6`,
          title: `${rootNft.title} - Branch #6`,
          sharePercentage: 2,
          pricing: rootNft.pricing * 0.02,
          remainingPercentage: 2,
          isPartialSale: true,
          isRootNft: false,
          rootNftId: rootNft.isRootNft ? rootNft.id : rootNft.rootNftId,
          rootNftValue: rootNft.rootNftValue,
          sellerId:
            "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd",
          debtNftImageUrl:
            "https://i2.seadn.io/ethereum/0x232a68a51d6e07357ae025d2a459c16077327102/7bc62f4f37f17a6c3381afa4e4231e/b77bc62f4f37f17a6c3381afa4e4231e.gif?frame-time=1&w=350",
        },
      ] as Coral[],
    [rootNft]
  );

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + 4, mockAvailableBranches.length)
      );
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
            className="p-3 bg-gradient-to-r from-[#1dadc0] to-[#2a849a] rounded-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.25 }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3587A3] to-gray-600 bg-clip-text text-transparent">
            Purchase Coral Branches
          </h2>
        </div>

        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover and purchase shares of coral branches (NFT splits) from the
          root NFT. Each branch represents a portion of the original invoice
          value. Click on any NFT card to see details and purchase options.
        </p>

        {/* Info Banner */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">
                How Coral Branch Purchase Works:
              </p>
              <p>
                Each coral branch is a split NFT that represents a percentage of
                the root NFT's value. When you purchase a branch, you can buy
                the entire available share or customize the percentage you want
                to own.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {mockAvailableBranches.length}
          </div>
          <div className="text-sm text-gray-600">Available Branches</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {mockAvailableBranches.reduce(
              (sum, branch) => sum + (branch.sharePercentage || 0),
              0
            )}
            %
          </div>
          <div className="text-sm text-gray-600">Total Available Share</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            $
            {mockAvailableBranches
              .reduce((sum, branch) => sum + (branch.pricing || 0), 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Market Value</div>
        </div>
      </motion.div>

      {/* Available Branches */}
      {mockAvailableBranches.length > 0 ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900">
                Available Coral Branches ({mockAvailableBranches.length})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Market</span>
            </div>
          </div>

          <NFTGrid
            nfts={mockAvailableBranches}
            displayedCount={displayedCount}
            totalCount={mockAvailableBranches.length}
            onLoadMore={handleLoadMore}
            loading={loading}
            isPurchaseMode={true}
            onPurchaseComplete={handlePurchaseComplete}
          />

          {/* Purchase History */}
          {purchases.length > 0 && (
            <motion.div
              className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Recent Purchases ({purchases.length})
              </h4>
              <div className="space-y-3">
                {purchases.slice(-3).map((purchase, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">
                          {purchase.percentage}% share of {purchase.nftId}
                        </div>
                        <div className="text-sm text-gray-600">
                          New NFT: {purchase.newNftId}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ${purchase.totalPrice.toFixed(2)}
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
            No Branches Available
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            There are currently no coral branches available for purchase from
            this root NFT. Check back later or explore other coral collections.
          </p>
        </motion.div>
      )}
    </div>
  );
}
