import type { InvoiceData, DashboardStats } from "@/types/dashboard";

export const mockDashboardStats: DashboardStats = {
  totalInvoices: 100000000000,
  paidInvoices: 100000000000,
  unpaidInvoices: 100000000000,
};

export const mockInvoiceData: InvoiceData[] = [
  {
    id: "1",
    addressOwner: "0x123239424ihoedwjfn121123123",
    addressDebtor: "0x123jendjknefjnfnj924121123123",
    unitDebt: 1000,
    startDate: "2024-01-15T10:30:00Z",
    endDate: "2024-01-20T14:45:00Z",
    fieldCompany: "Water",
    status: "paid",
  },
  {
    id: "2",
    addressOwner: "0x456789abcdefghijklmnopqrstuvwxyz",
    addressDebtor: "0x987654321fedcba0987654321fedcba",
    unitDebt: 2500,
    startDate: "2024-01-10T08:15:00Z",
    endDate: "2024-01-18T16:30:00Z",
    fieldCompany: "Energy",
    status: "paid",
  },
  {
    id: "3",
    addressOwner: "0xabcdef123456789abcdef123456789",
    addressDebtor: "0x111222333444555666777888999000",
    unitDebt: 750,
    startDate: "2024-01-12T12:00:00Z",
    endDate: "2024-01-25T09:20:00Z",
    fieldCompany: "Gas",
    status: "unpaid",
  },
  {
    id: "4",
    addressOwner: "0x999888777666555444333222111000",
    addressDebtor: "0xfedcba0987654321fedcba0987654321",
    unitDebt: 1800,
    startDate: "2024-01-08T14:45:00Z",
    endDate: "2024-01-22T11:15:00Z",
    fieldCompany: "Water",
    status: "paid",
  },
  {
    id: "5",
    addressOwner: "0x147258369147258369147258369147",
    addressDebtor: "0x369258147369258147369258147369",
    unitDebt: 3200,
    startDate: "2024-01-20T16:30:00Z",
    endDate: "2024-02-05T10:45:00Z",
    fieldCompany: "Electricity",
    status: "unpaid",
  },
];
