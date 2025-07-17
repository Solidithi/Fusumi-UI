import { User } from "@/types/user";
import users from "@/../public/data/users.json";

export function getUserByAddress(address: string): User | undefined {
  return users.find(
    (user) => user.address?.toLowerCase() === address.toLowerCase()
  );
}

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}
