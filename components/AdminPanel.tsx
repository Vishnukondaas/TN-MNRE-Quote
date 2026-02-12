
import React from 'react';
import { AppState, Quotation, User } from '../types';
import { Edit3, Trash2, Search, Printer, FileSpreadsheet, Download, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface Props {
  state: AppState;
  currentUser: User;
  onEdit: (q: Quotation) => void;
  onPrint: (q: Quotation) => void;
  onDownload: (q: Quotation) => void;
  onDelete: (id: string) => void;
}

const AdminPanel: React.FC<Props> = ({ state, currentUser, onEdit, onPrint, onDownload, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const isAdmin = currentUser.role === 'admin';
  // Standard users cannot edit or delete from dashboard
  const canModifyQuotes = currentUser.role === 'admin' || currentUser.role === 'TL';

  // Filter based on User Role AND Search Term
  const filteredQuotes = state.quotations.filter(q => {
    // Permission Filter: Admins see all, Users see their own
    const permissionMatch = isAdmin ? true : q.createdBy === currentUser.id;
    
    // Search Filter
    const searchMatch = 
      q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
    return permissionMatch && searchMatch;
  }).sort((a,b) => b.id.localeCompare(a.id));

  const exportToExcel = (q: Quotation) => {
    const pricingData = [
      ['Quotation No', q.id],
      ['Created By', q.createdByName || 'System'],
      ['Customer', q.customerName],
      ['Date', q.date],
      [],
      ['Description', 'Rate (₹)'],
      ['ONGRID SOLAR POWER GENERATING SYSTEM COST', q.pricing.onGridSystemCost],
      ['Subsidy Amount', q.pricing.subsidyAmount],
      ['Effective Cost', q.pricing.onGridSystemCost - q.pricing.subsidyAmount],
    ];
    
    const bomData = q.bom.map((item, idx) => [
      idx + 1, item.product, item.uom, item.quantity, item.specification, item.make
    ]);

    const wb = XLSX.utils.book_new();
    const ws_pricing = XLSX.utils.aoa_to_sheet(pricingData);
    const ws_bom = XLSX.utils.aoa_to_sheet([['SL No', 'Product', 'UOM', 'Qty', 'Spec', 'Make'], ...bomData]);
    
    XLSX.utils.book_append_sheet(wb, ws_pricing, "Pricing");
    XLSX.utils.book_append_sheet(wb, ws_bom, "Bill of Materials");
    
    XLSX.writeFile(wb, `${q.id}_Solar_Quotation.xlsx`);
  };

  const exportDashboardReport = () => {
    // Export ALL quotations in the state, regardless of search filter
    const reportData = state.quotations.map(q => ({
      'Quote ID': q.id,
      'Date': q.date,
      'Customer Name': q.customerName,
      'Mobile': q.mobile,
      'Email': q.email,
      'Discom No': q.discomNumber,
      'Address': q.address,
      'System Description': q.systemDescription,
      'System Cost (₹)': q.pricing.onGridSystemCost,
      'Subsidy (₹)': q.pricing.subsidyAmount,
      'TNEB Charges (₹)': q.pricing.tnebCharges,
      'Structure Cost (₹)': q.pricing.customizedStructureCost,
      'Addtl Material (₹)': q.pricing.additionalMaterialCost,
      'Total Net Cost (₹)': (q.pricing.onGridSystemCost - q.pricing.subsidyAmount),
      'Created By': q.createdByName,
      'Created By ID': q.createdBy
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportData);
    
    // Set column widths
    const wscols = Object.keys(reportData[0] || {}).map(k => ({ wch: 20 }));
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Master Report");
    XLSX.writeFile(wb, `Master_Solar_Quotes_Report_${format(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quotation Dashboard</h2>
          <p className="text-gray-500">Welcome, {currentUser.name}</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          {isAdmin && (
            <button 
              onClick={exportDashboardReport}
              className="w-full md:w-auto bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center hover:bg-green-800 transition-colors shadow-sm whitespace-nowrap text-sm"
            >
              <FileDown className="w-4 h-4 mr-2" /> Export All Data
            </button>
          )}
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by ID or Customer Name..." 
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Quote ID</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Capacity</th>
                {isAdmin && <th className="px-6 py-4 text-left">Created By</th>}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map(q => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{q.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(q.date), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{q.customerName}</div>
                    <div className="text-xs text-gray-500">{q.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{q.systemDescription}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold border">{q.createdByName || 'Unknown'}</span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    <button onClick={() => onDownload(q)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg" title="Download PDF">
                      <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => onPrint(q)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg" title="Print to A4">
                      <Printer className="w-5 h-5" />
                    </button>
                    <button onClick={() => exportToExcel(q)} className="text-green-600 hover:bg-green-50 p-2 rounded-lg" title="Export Excel">
                      <FileSpreadsheet className="w-5 h-5" />
                    </button>
                    
                    {canModifyQuotes && (
                      <button onClick={() => onEdit(q)} className="text-gray-600 hover:bg-gray-50 p-2 rounded-lg" title="Edit">
                        <Edit3 className="w-5 h-5" />
                      </button>
                    )}
                    
                    {canModifyQuotes && (
                      <button onClick={() => { if(confirm('Delete this quotation?')) onDelete(q.id); }} className="text-red-600 hover:bg-red-50 p-2 rounded-lg" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-10 text-center text-gray-400">No quotations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
