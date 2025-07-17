import { businesses } from "@/../public/data/businesses.json";
import { BusinessId, Business } from "@/types/business";

export function getBusinessById(
  businessId: `bus-${string}`
): Business | undefined {
  return businesses.find((b) => b.id === businessId);
}
