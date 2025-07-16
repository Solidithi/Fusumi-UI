import { EnhancedInvoiceData, DashboardStats } from '@/types/dashboard';
import { PaidStatus } from '@/types/project';

export function calculateDashboardStats(invoices: EnhancedInvoiceData[]): DashboardStats {
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(invoice => invoice.paidStatus === PaidStatus.PAID).length;
  const unpaidInvoices = invoices.filter(invoice => 
    invoice.paidStatus === PaidStatus.PENDING || invoice.paidStatus === PaidStatus.OVERDUE
  ).length;

  return {
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
  };
}
