
import React, { useState, useEffect } from 'react';
import { AppState, Quotation, BOMItem, BOMTemplate, ProductPricing, User } from '../types';
import { Save, X, Plus, Package } from 'lucide-react';

interface Props {
  state: AppState;
  currentUser: User;
  editData: Quotation | null;
  onSave: (q: Quotation) => void;
  onSaveTemplate: (name: string, items: BOMItem[]) => void;
  onCancel: () => void;
}

const QuotationForm: React.FC<Props> = ({ state, currentUser, editData, onSave, onSaveTemplate, onCancel }) => {
  const generateNewId = () => {
    // Updated as per user request to start from TNMNRE1506
    return `TNMNRE${state.nextId}`;
  };

  const [formData, setFormData] = useState<Quotation>({
    id: editData?.id || generateNewId(),
    date: editData?.date || new Date().toISOString().split('T')[0],
    customerName: editData?.customerName || '',
    discomNumber: editData?.discomNumber || '',
    address: editData?.address || '',
    mobile: editData?.mobile || '',
    email: editData?.email || '',
    location: editData?.location || '',
    pricing: editData?.pricing || { ...state.productPricing[0] },
    bom: editData?.bom || (state.bomTemplates[0]?.items || []),
    systemDescription: editData?.systemDescription || (state.productDescriptions[0]?.name || '3kW ON-GRID SOLAR POWER GENERATING SYSTEM'),
    createdBy: editData?.createdBy || currentUser.id,
    createdByName: editData?.createdByName || currentUser.name
  });

  // Permission Logic
  // Base Pricing (System Cost, Subsidy, TNEB) -> Admin & TL Only
  const canEditBasePricing = currentUser.role === 'admin' || currentUser.role === 'TL';
  
  // Additional Costs (Structure, Material) -> All Users (Admin, TL, User)
  const canEditExtras = true;

  const handleProductDescriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    
    // Find the full configuration object for this product
    const productConfig = state.productDescriptions.find(p => p.name === selectedName);
    
    let newPricing = formData.pricing;
    let newBom = formData.bom;

    // Auto-select Pricing if linked
    if (productConfig?.defaultPricingId) {
      const linkedPricing = state.productPricing.find(p => p.id === productConfig.defaultPricingId);
      if (linkedPricing) {
        const { id, name, ...pricingValues } = linkedPricing;
        newPricing = { ...pricingValues };
      }
    }

    // Auto-select BOM if linked
    if (productConfig?.defaultBomTemplateId) {
      const linkedBom = state.bomTemplates.find(t => t.id === productConfig.defaultBomTemplateId);
      if (linkedBom) {
        newBom = linkedBom.items.map(item => ({ ...item, id: Math.random().toString(36).substr(2, 9) }));
      }
    }

    setFormData({
      ...formData,
      systemDescription: selectedName,
      pricing: newPricing,
      bom: newBom
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{editData ? 'Edit' : 'Create New'} Quotation</h2>
        <div className="flex flex-col items-end">
          <div className="text-lg font-mono text-red-600 bg-red-50 px-4 py-1 rounded-full border border-red-100">
            {formData.id}
          </div>
          <span className="text-xs text-gray-400 mt-1">Sales Person: {formData.createdByName}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Customer Info */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1 font-bold">Customer Name</label>
              <input 
                required
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">Consumer DISCOM No.</label>
              <input 
                value={formData.discomNumber}
                onChange={e => setFormData({ ...formData, discomNumber: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm text-gray-600 mb-1 font-bold">Address</label>
              <textarea 
                required
                rows={2}
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">Mobile Number</label>
              <input 
                required
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">Email</label>
              <input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 font-bold">Product Description (Auto-fills Pricing & BOM)</label>
              <div className="relative">
                 <select 
                   value={formData.systemDescription}
                   onChange={handleProductDescriptionChange}
                   className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none bg-white appearance-none"
                 >
                   <option value="">Select Description...</option>
                   {state.productDescriptions.map((desc, idx) => (
                     <option key={desc.id || idx} value={desc.name}>{desc.name}</option>
                   ))}
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Package className="w-4 h-4" />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
               Pricing Estimation
               {!canEditBasePricing && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded normal-case">Base Rate Locked</span>}
            </h3>
            {/* Pricing Model Dropdown Removed */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase font-black text-gray-400 mb-1">On-Grid System Cost (₹)</label>
              <input 
                type="number"
                readOnly={!canEditBasePricing}
                value={formData.pricing.onGridSystemCost}
                onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, onGridSystemCost: Number(e.target.value), rooftopPlantCost: Number(e.target.value) } })}
                className={`w-full border p-2 rounded shadow-inner ${!canEditBasePricing ? 'bg-gray-200 text-gray-600 cursor-not-allowed focus:ring-0' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-black text-gray-400 mb-1">Subsidy Amount (₹)</label>
              <input 
                type="number"
                readOnly={!canEditBasePricing}
                value={formData.pricing.subsidyAmount}
                onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, subsidyAmount: Number(e.target.value) } })}
                className={`w-full border p-2 rounded shadow-inner ${!canEditBasePricing ? 'bg-gray-200 text-gray-600 cursor-not-allowed focus:ring-0' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-black text-gray-400 mb-1">TNEB Charges (INR)</label>
              <input 
                type="number"
                readOnly={!canEditBasePricing}
                value={formData.pricing.tnebCharges}
                onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, tnebCharges: Number(e.target.value) } })}
                className={`w-full border p-2 rounded shadow-inner ${!canEditBasePricing ? 'bg-gray-200 text-gray-600 cursor-not-allowed focus:ring-0' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-black text-gray-400 mb-1">Customized Structure Cost (₹)</label>
              <input 
                type="number"
                readOnly={!canEditExtras}
                value={formData.pricing.customizedStructureCost}
                onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, customizedStructureCost: Number(e.target.value) } })}
                className={`w-full border p-2 rounded shadow-inner ${!canEditExtras ? 'bg-gray-200 text-gray-600 cursor-not-allowed focus:ring-0' : 'bg-white'}`}
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-black text-gray-400 mb-1">Addtl. Material Cost (₹)</label>
              <input 
                type="number"
                readOnly={!canEditExtras}
                value={formData.pricing.additionalMaterialCost}
                onChange={e => setFormData({ ...formData, pricing: { ...formData.pricing, additionalMaterialCost: Number(e.target.value) } })}
                className={`w-full border p-2 rounded shadow-inner ${!canEditExtras ? 'bg-gray-200 text-gray-600 cursor-not-allowed focus:ring-0' : 'bg-white'}`}
              />
            </div>
            <div className="bg-black text-white p-6 rounded flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-3">
              <div>
                <p className="text-[10px] uppercase font-black text-red-600 mb-1 tracking-widest">Effective Investment</p>
                <p className="text-xs text-gray-400 font-bold uppercase">Estimated Customer Cost (After Subsidy)</p>
              </div>
              <span className="text-3xl font-black">₹ {(formData.pricing.onGridSystemCost - formData.pricing.subsidyAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </section>

        {/* BOM Selection & Table */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Bill of Materials</h3>
              <p className="text-xs text-gray-400 mt-1">Read-only view (Configured via Settings)</p>
            </div>
          </div>
          
          <div className="overflow-x-auto border rounded-lg bg-gray-50/50">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">UOM</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Spec/Type</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Make</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.bom.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-1"><input className="w-full text-sm border-0 bg-transparent focus:ring-0 cursor-default text-gray-700" value={item.product} readOnly tabIndex={-1} /></td>
                    <td className="p-1"><input className="w-full text-sm border-0 bg-transparent focus:ring-0 cursor-default text-gray-700" value={item.uom} readOnly tabIndex={-1} /></td>
                    <td className="p-1"><input className="w-full text-sm border-0 bg-transparent focus:ring-0 cursor-default text-gray-700" value={item.quantity} readOnly tabIndex={-1} /></td>
                    <td className="p-1"><input className="w-full text-sm border-0 bg-transparent focus:ring-0 cursor-default text-gray-700" value={item.specification} readOnly tabIndex={-1} /></td>
                    <td className="p-1"><input className="w-full text-sm border-0 bg-transparent focus:ring-0 cursor-default text-gray-700" value={item.make} readOnly tabIndex={-1} /></td>
                  </tr>
                ))}
                {formData.bom.length === 0 && (
                   <tr><td colSpan={5} className="p-4 text-center text-sm text-gray-400">No BOM items linked to this product. Check settings.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button type="submit" className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors">
            <Save className="w-5 h-5 mr-2 inline" /> {editData ? 'Update' : 'Save'} Quotation
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default QuotationForm;
