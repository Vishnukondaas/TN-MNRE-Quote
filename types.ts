
export interface CompanyConfig {
  name: string;
  headOffice: string;
  regionalOffice1: string;
  regionalOffice2: string;
  phone: string;
  email: string;
  website: string;
  logo: string; // Base64 or URL
  seal: string; // Base64 or URL for official seal
  gstin: string;
}

export interface BankConfig {
  companyName: string;
  bankName: string;
  accountNumber: string;
  branch: string;
  ifsc: string;
  address: string;
  pan: string;
  upiId: string;
  gstNumber: string;
}

export interface PricingConfig {
  onGridSystemCost: number;
  rooftopPlantCost: number;
  subsidyAmount: number;
  tnebCharges: number;
  additionalMaterialCost: number;
  customizedStructureCost: number;
}

export interface ProductPricing extends PricingConfig {
  id: string;
  name: string;
}

export interface WarrantyConfig {
  panelWarranty: string;
  inverterWarranty: string;
  systemWarranty: string;
  monitoringSystem: string;
}

export interface Term {
  id: string;
  text: string;
  enabled: boolean;
  order: number;
}

export interface BOMItem {
  id: string;
  product: string;
  uom: string;
  quantity: string;
  specification: string;
  make: string;
}

export interface BOMTemplate {
  id: string;
  name: string; // The "Product Name" used for selection
  items: BOMItem[];
}

export interface ProductDescription {
  id: string;
  name: string;
  defaultPricingId?: string; // Link to ProductPricing.id
  defaultBomTemplateId?: string; // Link to BOMTemplate.id
}

export type UserRole = 'admin' | 'user' | 'TL';

export interface User {
  id: string;
  name: string; // Display Name (e.g., "John Doe")
  username: string; // Login ID
  password: string; 
  role: UserRole;
}

export interface Quotation {
  id: string; // TNMNRE-XXXX
  date: string;
  customerName: string;
  discomNumber: string;
  address: string;
  mobile: string;
  email: string;
  location: string;
  pricing: PricingConfig;
  bom: BOMItem[];
  systemDescription: string;
  createdBy: string; // User ID
  createdByName: string; // Snapshot of User Name
}

export interface AppState {
  company: CompanyConfig;
  bank: BankConfig;
  productPricing: ProductPricing[]; 
  warranty: WarrantyConfig;
  terms: Term[];
  bomTemplates: BOMTemplate[];
  productDescriptions: ProductDescription[];
  users: User[]; // List of registered users
  quotations: Quotation[];
  nextId: number;
}
