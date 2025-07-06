export interface NFTData {
  id: string;
  title: string;
  image: string;
  owner: string;
  ownerAvatar: string;
  tokenCount: number;
  startDate: string;
  endDate: string;
  price?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
  category?: string;
}

export interface NFTCollection {
  nfts: NFTData[];
  totalCount: number;
}
