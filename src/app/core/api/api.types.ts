export enum InvoiceStatus {
  Pendiente = 1,
  Pagada = 2,
  Anulada = 3,
}

export enum InvoiceType {
  Contado = 1,
  Credito = 2,
}

export enum CustomerType {
  Persona = 1,
  Empresa = 2,
}

export enum PaymentMethod {
  Efectivo = 1,
  Tarjeta = 2,
  Transferencia = 3,
  Cheque = 4,
  Otro = 5,
}

export enum RoleType {
  Admin = 1,
  Vendedor = 2,
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleId: number;
  mustChangePassword: boolean;
}

export interface UserResponse {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface RoleResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface MenuResponse {
  id: number;
  key: string;
  label: string;
  icon: string;
  route: string;
  order: number;
}

export interface CompanyConfigResponse {
  id: number;
  companyName: string;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  taxPercent: number;
  currencySymbol: string;
  address: string | null;
  city: string | null;
  region: string | null;
  postalCode: string | null;
  logoUrl: string | null;
  lastInvoiceNumber: number;
}

export interface InvoiceResponse {
  id: number;
  number: number;
  date: string;
  customerId: number;
  customerName: string;
  sellerId: number;
  sellerName: string;
  type: InvoiceType;
  dueDate: string | null;
  status: InvoiceStatus;
  notes: string | null;
  subtotal: number;
  taxAmount: number;
  total: number;
  details: InvoiceDetailResponse[];
  payments: PaymentResponse[];
  createdAt: string;
}

export interface InvoiceSummaryResponse {
  id: number;
  number: number;
  date: string;
  customerName: string;
  type: InvoiceType;
  status: InvoiceStatus;
  total: number;
  sellerName: string | null;
}

export interface CreateInvoiceRequest {
  customerId: number;
  type: InvoiceType;
  dueDate: string | null;
  notes: string | null;
  details: CreateInvoiceDetailRequest[];
}

export interface CreateInvoiceDetailRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  productCode: string;
}

export interface AddPaymentRequest {
  method: PaymentMethod;
  amount: number;
  reference: string | null;
  paymentDate: string | null;
}

export interface InvoiceDetailResponse {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PaymentResponse {
  id: number;
  method: PaymentMethod;
  amount: number;
  reference: string | null;
  paymentDate: string;
}

export interface ProductResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  stock: number;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerResponse {
  id: number;
  identification: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  type: CustomerType;
  isActive: boolean;
  creditLimit: number | null;
  createdAt: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardSummaryResponse {
  totalInvoices: number;
  totalCustomers: number;
  totalProducts: number;
  totalActiveProducts: number;
  totalRevenue: number;
  pendingAmount: number;
  paidAmount: number;
  draftInvoices: number;
  paidInvoices: number;
  cancelledInvoices: number;
  recentInvoices: DashboardRecentInvoice[];
  topProducts: DashboardTopProduct[];
}

export interface DashboardRecentInvoice {
  id: number;
  number: number;
  date: string;
  customerName: string;
  sellerName: string;
  total: number;
  status: string;
}

export interface DashboardTopProduct {
  productId: number;
  productName: string;
  productCode: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface CreateCustomerRequest {
  identification: string;
  name: string;
  type: CustomerType;
  phone: string | null;
  email: string | null;
  address: string | null;
  creditLimit: number | null;
}

export interface UpdateCustomerRequest {
  name: string;
  type: CustomerType;
  phone: string | null;
  email: string | null;
  address: string | null;
  creditLimit: number | null;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  stock: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  categoryId: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProblemDetails {
  title: string;
  detail: string | null;
  status: number;
  traceId: string | null;
}
