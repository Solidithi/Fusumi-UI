export interface InvoiceData {
  id: string;
  addressOwner: string;
  addressDebtor: string;
  unitDebt: number;
  startDate: string;
  endDate: string;
  fieldCompany: string;
  status: "paid" | "unpaid" | "pending";
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

export type FilterType = "total" | "paid" | "unpaid";
