import coralData from "../../public/data/corals.json";
import { EnhancedCoral, Coral, CoralStatus } from "@/types/coral";
import { PurchaseData, CoralNFT } from "@/types/coral";

// Mock function to simulate adding new coral branch to the database
export const createCoralBranch = async (
  purchaseData: PurchaseData
): Promise<CoralNFT> => {
  // In a real application, this would:
  // 1. Validate the purchase
  // 2. Create blockchain transaction
  // 3. Mint new NFT
  // 4. Update database
  // 5. Update parent NFT's remaining percentage

  const parentNft = coralData.find(
    (coral) => coral.id === purchaseData.parentNftId
  );
  if (!parentNft) {
    throw new Error("Parent NFT not found");
  }

  // Calculate the actual share of the root NFT
  const rootShare = parentNft.isRootNft
    ? purchaseData.sharePercentage
    : (parentNft.sharePercentage * purchaseData.sharePercentage) / 100;

  // Create new coral branch NFT
  const newCoralBranch: CoralNFT = {
    id: `${purchaseData.parentNftId}-branch-${Date.now()}`,
    invoiceId: parentNft.invoiceId,
    sellerId: purchaseData.buyerAddress,
    rootNftId: parentNft.rootNftId || parentNft.id,
    rootNftValue: parentNft.rootNftValue,
    pricing: purchaseData.totalPrice,
    sharePercentage: rootShare,
    remainingPercentage: 0, // New branch has no sub-splits initially
    isPartialSale: true,
    isRootNft: false,
    debtNftImageUrl: parentNft.debtNftImageUrl,
    contactInfo: parentNft.contactInfo,
    agreements: parentNft.agreements,
    startDate: parentNft.startDate,
    endDate: parentNft.endDate,
    createdAt: new Date().toISOString(),
    title: `${parentNft.title} - Branch`,
    category: parentNft.category,
    rarity: "common", // New branches start as common
    ownerAvatar: "/placeholder.svg?height=24&width=24",
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would make an API call here to persist the data
  console.log("New coral branch created:", newCoralBranch);
  console.log("Parent NFT updated - remaining percentage reduced");

  return newCoralBranch;
};

// Mock function to get available coral branches for purchase
export const getAvailableCoralBranches = (rootNftId: string): CoralNFT[] => {
  // In a real application, this would query the database for:
  // - NFTs that are for sale (remainingPercentage > 0)
  // - NFTs that belong to the same root or are splits of the given NFT
  return coralData.filter(
    (coral) =>
      (coral.rootNftId === rootNftId || coral.id === rootNftId) &&
      coral.remainingPercentage > 0 &&
      !coral.isRootNft
  ) as CoralNFT[];
};

// Mock function to validate purchase
export const validatePurchase = (
  branchId: string,
  sharePercentage: number,
  buyerAddress: string
): { isValid: boolean; error?: string } => {
  const branch = coralData.find((coral) => coral.id === branchId);

  if (!branch) {
    return { isValid: false, error: "Coral branch not found" };
  }

  if (sharePercentage <= 0) {
    return { isValid: false, error: "Share percentage must be greater than 0" };
  }

  if (sharePercentage > branch.sharePercentage) {
    return {
      isValid: false,
      error: "Cannot purchase more than available share",
    };
  }

  if (branch.sellerId === buyerAddress) {
    return { isValid: false, error: "Cannot purchase your own coral branch" };
  }

  return { isValid: true };
};

// Mock function to calculate pricing
export const calculatePurchasePrice = (
  branchId: string,
  sharePercentage: number
): number => {
  const branch = coralData.find((coral) => coral.id === branchId);
  if (!branch) return 0;

  const pricePerPercent = branch.pricing / branch.sharePercentage;
  return pricePerPercent * sharePercentage;
};

export function inferCoralStatus(offer: Coral): CoralStatus {
  const currentDate = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);

  if (currentDate < startDate) {
    return "pending";
  } else if (currentDate > endDate) {
    return "expired";
  } else {
    return "active";
  }
}

export function toEnhancedCoral(offer: Coral): EnhancedCoral {
  return {
    ...offer,
    status: inferCoralStatus(offer),
  };
}
