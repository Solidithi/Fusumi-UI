import { useWallet } from "@aptos-labs/wallet-adapter-react";
import usersData from "@/../public/data/users.json";

// Use a type alias instead of interface extension
type UseUserReturnType = (typeof usersData)[number] & { company: string };

export function useUser(): UseUserReturnType | undefined {
  const { account } = useWallet();

  const currentUser = usersData.find(
    (user) =>
      user.address?.toLowerCase() === account?.address.toString().toLowerCase()
  ) as UseUserReturnType;

  currentUser.company = "Fusumi Inc.";
  return currentUser;
}
