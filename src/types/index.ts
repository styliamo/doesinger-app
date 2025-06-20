export type UserRole = 'ADMIN' | 'PARTNER' | 'VENDOR' | 'CLIENT';

export type ProjectStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface ProjectItem {
  id: string;
  projectId: string;
  costGroup: string;
  costGroupPosition: string;
  description: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  totalPurchasePrice: number;
  markupPercent: number;
  sellingPriceUnit: number;
  totalSellingPrice: number;
  category: 'FF&E' | 'Standard';
  status: ProjectStatus;
  approvedForClient: boolean;
  vendorId?: string;
  selectedVendor?: string;
  pdfUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  budgetLimit: number;
  ffeBudgetLimit: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface ProjectUser {
  id: string;
  projectId: string;
  userId: string;
  role: UserRole;
  invitedAt: Date;
  acceptedAt?: Date;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface CostGroup {
  id: string;
  name: string;
  items: ProjectItem[];
}

export interface ProjectSummary {
  totalItems: number;
  totalValue: number;
  approvedItems: number;
  approvedValue: number;
  ffeItems: number;
  ffeValue: number;
}

export interface VendorSubmission {
  vendorId: string;
  itemId: string;
  price: number;
  pdfUrl?: string;
  submittedAt: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface TimetableEvent {
  id: string;
  projectId: string;
  itemId: string;
  type: 'delivery' | 'assembly' | 'acceptance' | 'payment';
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  assignedTo: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  itemId: string;
  vendorName: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'paid' | 'overdue';
  uploadDate: string;
  dueDate: string;
  pdfUrl?: string;
}

export interface PaymentStatus {
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
}