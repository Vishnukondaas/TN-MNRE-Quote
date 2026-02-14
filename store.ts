
import { AppState, Term, BOMItem, ProductPricing, Quotation, User } from './types';
import { supabase } from './supabaseClient';

// Default Constants used for initialization if DB is empty
const DEFAULT_TERMS: Term[] = [
  { id: '1', text: 'Structure height will be 1 to 3 feet from floor level.', enabled: true, order: 1 },
  { id: '2', text: 'TNEB application & registration charges are included in the above cost.', enabled: true, order: 2 },
  { id: '3', text: 'The customer shall provide necessary space and shadow-free area for installation.', enabled: true, order: 3 },
  { id: '4', text: 'Civil works like concrete foundation if needed will be extra.', enabled: true, order: 4 },
  { id: '5', text: 'The subsidy will be credited to the customer account as per govt norms.', enabled: true, order: 5 },
  { id: '6', text: 'Any additional cabling beyond 30 meters will be charged extra.', enabled: true, order: 6 },
];

const DEFAULT_BOM_3KW: BOMItem[] = [
  { id: '1', product: 'Solar Panels', uom: 'Nos', quantity: '8', specification: '550Wp Mono PERC', make: 'Adani/Waaree' },
  { id: '2', product: 'On-Grid Inverter', uom: 'No', quantity: '1', specification: '3kW String Inverter', make: 'Growatt/Solis' },
  { id: '3', product: 'DC SPD', uom: 'Nos', quantity: '2', specification: 'Type II 600V', make: 'Citel/Suntree' },
  { id: '4', product: 'DC Fuse', uom: 'Nos', quantity: '2', specification: '15A/1000V', make: 'Mersen' },
  { id: '5', product: 'DC Cable', uom: 'Mtrs', quantity: '30', specification: '4sqmm multi strand', make: 'Polycab/Siechem' },
  { id: '10', product: 'Lightning Arrester', uom: 'Set', quantity: '1', specification: 'Solid Copper 1M', make: 'Standard' },
];

const DEFAULT_PRICING: ProductPricing[] = [
  {
    id: 'p3kw',
    name: '3kW Standard Pricing',
    onGridSystemCost: 185000,
    rooftopPlantCost: 185000,
    subsidyAmount: 78000,
    tnebCharges: 0,
    additionalMaterialCost: 0,
    customizedStructureCost: 0
  },
  {
    id: 'p5kw',
    name: '5kW Standard Pricing',
    onGridSystemCost: 295000,
    rooftopPlantCost: 295000,
    subsidyAmount: 78000,
    tnebCharges: 0,
    additionalMaterialCost: 0,
    customizedStructureCost: 0
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'admin-01',
    name: 'Administrator',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  }
];

export const INITIAL_STATE: AppState = {
  company: {
    name: 'Kondaas Automation Pvt Ltd',
    headOffice: '123, Solar Plaza, Opp. TNEB, Coimbatore, Tamil Nadu',
    regionalOffice1: 'Branch Office, Chennai, Tamil Nadu',
    regionalOffice2: 'Service Center, Madurai, Tamil Nadu',
    phone: '+91 9876543210',
    email: 'info@kondaas.com',
    website: 'www.kondaas.com',
    logo: '', 
    seal: '',
    gstin: '33AAAAA0000A1Z5'
  },
  bank: {
    companyName: 'Kondaas Automation Private Limited',
    bankName: 'HDFC BANK',
    accountNumber: '50200012345678',
    branch: 'Coimbatore Main',
    ifsc: 'HDFC0000123',
    address: 'Avinashi Road, Coimbatore',
    pan: 'ABCDE1234F',
    upiId: 'kondaas@hdfc',
    gstNumber: '33AAAAA0000A1Z5'
  },
  productPricing: DEFAULT_PRICING,
  warranty: {
    panelWarranty: '25 Years Performance Warranty (Adani Solar)',
    inverterWarranty: '5 to 10 Years Product Warranty (On-Grid String)',
    systemWarranty: '5 Years Free Service (Kondaas Automation)',
    monitoringSystem: 'Standard Online Monitoring (Wi-Fi Required)'
  },
  terms: DEFAULT_TERMS,
  bomTemplates: [
    { id: '3kw-std', name: '3kW Standard On-Grid', items: DEFAULT_BOM_3KW }
  ],
  productDescriptions: [
    { id: '1', name: '3kW ON-GRID SOLAR POWER GENERATING SYSTEM', defaultPricingId: 'p3kw', defaultBomTemplateId: '3kw-std' },
    { id: '2', name: '5kW ON-GRID SOLAR POWER GENERATING SYSTEM', defaultPricingId: 'p5kw', defaultBomTemplateId: '' },
    { id: '3', name: '10kW ON-GRID SOLAR POWER GENERATING SYSTEM', defaultPricingId: '', defaultBomTemplateId: '' }
  ],
  users: DEFAULT_USERS,
  quotations: [],
  nextId: 1506
};

// --- SUPABASE API FUNCTIONS ---

export const fetchFullState = async (): Promise<AppState> => {
  try {
    // 1. Fetch Global Settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .eq('singleton_key', 'global')
      .single();

    // 2. Fetch All Quotations
    const { data: quotesData, error: quotesError } = await supabase
      .from('quotations')
      .select('*');

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error("Error fetching settings:", settingsError);
    }

    // Map quotations from Supabase format back to Quotation interface
    const quotations: Quotation[] = (quotesData || []).map(q => q.data as Quotation);

    // If no settings exist yet, initialize with INITIAL_STATE
    if (!settingsData) {
      await saveSettings(INITIAL_STATE);
      return { ...INITIAL_STATE, quotations };
    }

    // Determine nextId based on existing quotations
    // Base starting point updated to 1505 so next is 1506
    let maxId = 1505;
    quotations.forEach(q => {
      // Updated regex to handle optional hyphen for the new TNMNRE1506 format
      const match = q.id.match(/(?:KAPL|KLMNRE|TNMNRE)-?(\d+)/); 
      if (match && match[1]) {
        const num = parseInt(match[1]);
        if (num > maxId) maxId = num;
      }
    });

    return {
      company: settingsData.company || INITIAL_STATE.company,
      bank: settingsData.bank || INITIAL_STATE.bank,
      productPricing: settingsData.pricing || INITIAL_STATE.productPricing,
      warranty: settingsData.warranty || INITIAL_STATE.warranty,
      terms: settingsData.terms || INITIAL_STATE.terms,
      bomTemplates: settingsData.bom_templates || INITIAL_STATE.bomTemplates,
      productDescriptions: settingsData.product_descriptions || INITIAL_STATE.productDescriptions,
      users: settingsData.users || INITIAL_STATE.users,
      quotations: quotations,
      nextId: maxId + 1
    };
  } catch (err) {
    console.error("Critical error connecting to Supabase:", err);
    return INITIAL_STATE;
  }
};

export const saveSettings = async (state: AppState): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({
        singleton_key: 'global',
        company: state.company,
        bank: state.bank,
        pricing: state.productPricing,
        warranty: state.warranty,
        terms: state.terms,
        bom_templates: state.bomTemplates,
        product_descriptions: state.productDescriptions,
        users: state.users
      }, { onConflict: 'singleton_key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error saving settings to Supabase:", err);
    return false;
  }
};

export const saveQuotation = async (quotation: Quotation) => {
  try {
    const { error } = await supabase
      .from('quotations')
      .upsert({
        id: quotation.id,
        customer_name: quotation.customerName,
        customer_details: {
          mobile: quotation.mobile,
          email: quotation.email,
          address: quotation.address,
          discom: quotation.discomNumber
        },
        data: quotation
      }, { onConflict: 'id' });

    if (error) throw error;
  } catch (err) {
    console.error("Error saving quotation to Supabase:", err);
  }
};

export const deleteQuotation = async (id: string) => {
  try {
    const { error } = await supabase
      .from('quotations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (err) {
    console.error("Error deleting quotation from Supabase:", err);
  }
};
