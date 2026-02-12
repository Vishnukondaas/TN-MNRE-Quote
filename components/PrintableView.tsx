
import React from 'react';
import { AppState, Quotation } from '../types';
import { format } from 'date-fns';

interface Props {
  quotation: Quotation;
  state: AppState;
}

const PrintableView: React.FC<Props> = ({ quotation, state }) => {
  const activeTerms = state.terms.filter(t => t.enabled).sort((a, b) => a.order - b.order);

  // Modular component for headers to ensure consistency
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="section-header w-full">
      <h3>{title}</h3>
      <div className="line"></div>
    </div>
  );

  // Standardized footer component
  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="mt-auto pt-6 flex justify-between items-center text-[7pt] text-gray-400 font-bold uppercase tracking-[0.4em] w-full border-t border-gray-100">
      <span>{state.company.name} // Ref: {quotation.id}</span>
      <span className="text-gray-300">Page {pageNum} of 4</span>
    </div>
  );

  // Logo component for consistent placement on every page
  const PageLogo = () => (
    state.company.logo ? (
      <img 
        src={state.company.logo} 
        alt="Logo" 
        className="absolute top-4 left-5 h-12 w-auto object-contain z-20" 
      />
    ) : null
  );

  // Reusable Seal Component with very small fonts
  const CompanySealBlock = ({ imageBottomClass = "bottom-6" }: { imageBottomClass?: string }) => (
    <div className="text-center w-52">
      <div className="h-16 border-b border-gray-100 mb-1 relative">
         {state.company.seal ? (
           <img 
             src={state.company.seal} 
             alt="Seal" 
             className={`absolute ${imageBottomClass} left-1/2 -translate-x-1/2 h-20 w-auto object-contain z-10`} 
           />
         ) : (
           <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[5pt] text-red-100 uppercase font-black tracking-widest whitespace-nowrap">Official Seal</span>
         )}
      </div>
      <p className="text-[5.5pt] font-black uppercase text-red-600 tracking-[0.1em] pt-1 border-t border-red-600 truncate">For {state.company.name}</p>
      <p className="text-[5pt] text-gray-400 font-black uppercase mt-0.5 tracking-[0.2em]">Authorized Signatory</p>
    </div>
  );

  return (
    <div className="pdf-container">
      {/* PAGE 1: EXECUTIVE SUMMARY & PRICING */}
      <div className="a4-page relative">
        <PageLogo />
        
        {/* Identity Block */}
        <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3 w-full mt-4">
          <div className="flex flex-col gap-1 items-start flex-1 pt-2">
            {/* Logo removed from flow, handled by PageLogo */}
            <div className="flex-1">
              <h1 className="text-[14pt] font-[900] text-black leading-none uppercase tracking-tighter whitespace-nowrap">
                {state.company.name}
              </h1>
              <p className="text-[6pt] text-red-600 font-black tracking-[0.2em] uppercase mt-1 mb-2 whitespace-nowrap">
                ADANI SOLAR AUTHORIZED CHANNEL PARTNER
              </p>
              
              <div className="text-[7pt] text-gray-500 font-bold leading-tight">
                <span className="text-black font-black uppercase text-[5.5pt] tracking-[0.2em] block mb-1">Head Office</span>
                <p className="uppercase">{state.company.headOffice}</p>
              </div>
            </div>
          </div>
          
          <div className="text-right text-[7pt] font-semibold text-gray-500 leading-snug space-y-1 ml-4 pt-1">
            <p className="text-black font-black uppercase tracking-widest text-[8pt] mb-1">{state.company.website}</p>
            <p>{state.company.email}</p>
            <p className="text-gray-400">{state.company.phone}</p>
            
            <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col items-start text-left">
              <span className="text-black font-black uppercase text-[5.5pt] tracking-[0.2em] mb-1">Regional Branches</span>
              <p className="uppercase opacity-80">{state.company.regionalOffice1}</p>
              <p className="uppercase opacity-80">{state.company.regionalOffice2}</p>
            </div>
          </div>
        </div>

        {/* Proposal and Customer Primary Info */}
        <div className="mb-4 w-full">
          <div className="flex justify-between items-end mb-4">
            <div className="flex-1">
               <h4 className="text-[6pt] font-black text-gray-400 uppercase tracking-widest mb-2">Customer Details</h4>
               <p className="text-[14pt] font-[900] text-black uppercase leading-tight">{quotation.customerName}</p>
            </div>
            <div className="text-right">
              <span className="text-[7pt] font-black text-white bg-black px-3 py-1 rounded-md uppercase tracking-[0.15em] shadow-sm">Quotation No & Date</span>
              <p className="text-[14pt] font-black mt-2 text-red-600 tracking-tight leading-none">{quotation.id}</p>
              <p className="text-[8pt] text-gray-400 font-bold uppercase mt-1 tracking-widest">{format(new Date(quotation.date), 'dd MMMM yyyy')}</p>
            </div>
          </div>

          {/* Unified Customer Details Line */}
          <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl flex flex-wrap items-center justify-start text-[8pt] font-bold text-gray-600 gap-x-8 gap-y-1">
            <div className="flex items-center gap-2">
              <span className="text-black font-black uppercase text-[6.5pt] tracking-widest opacity-40">Consumer No:</span>
              <span className="text-black uppercase">{quotation.discomNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black font-black uppercase text-[6.5pt] tracking-widest opacity-40">MOBILE:</span>
              <span className="text-black">{quotation.mobile}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black font-black uppercase text-[6.5pt] tracking-widest opacity-40">EMAIL:</span>
              <span className="text-black lowercase">{quotation.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[300px]">
              <span className="text-black font-black uppercase text-[6.5pt] tracking-widest opacity-40">ADDRESS:</span>
              <span className="text-black uppercase truncate">{quotation.address}</span>
            </div>
          </div>
        </div>

        {/* PRODUCT NAME moved above Pricing Section */}
        <div className="bg-red-50 border-l-4 border-red-600 p-2.5 w-full rounded-r-md shadow-sm text-left mb-3">
          <span className="text-[6.5pt] text-red-400 font-black uppercase tracking-widest block mb-1 uppercase">PRODUCT NAME / PROPOSED SYSTEM</span>
          <p className="text-[10pt] font-black text-red-700 uppercase leading-snug">{quotation.systemDescription}</p>
        </div>

        {/* Pricing Estimation Header (Single Line) */}
        <div className="mb-2 w-full border-b-2 border-red-600 pb-1">
          <h3 className="text-[9.5pt] font-black text-red-600 uppercase tracking-[0.25em]">PRICING AND ESTIMATION</h3>
        </div>

        {/* Pricing Estimation Table */}
        <div className="mb-4 w-full">
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <table className="table-modern">
              <thead>
                <tr>
                  <th className="w-20 text-center">SL No</th>
                  <th className="py-3">Description</th>
                  <th className="text-right w-44 pr-10">Rate (INR)</th>
                </tr>
              </thead>
              <tbody className="text-[9pt] font-bold">
                <tr>
                  <td className="text-center text-gray-300 font-black">01</td>
                  <td className="py-3 uppercase tracking-tight text-gray-800">Total plant cost of {quotation.systemDescription}</td>
                  <td className="text-right font-black pr-10 text-black text-[11pt]">₹ {quotation.pricing.onGridSystemCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-red-50/40">
                  <td className="text-center text-red-200 font-black">02</td>
                  <td className="py-3 uppercase tracking-tight text-red-700 leading-snug">
                    Subsidy Amount as Per PM Surya Ghar Approved Guidelines Directly Credit to Customer Bank Account
                  </td>
                  <td className="text-right font-black pr-10 text-red-600 text-[11pt]">(-) ₹ {quotation.pricing.subsidyAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="pricing-summary-row">
              <div className="flex-1 pr-6">
                <p className="text-[9pt] font-[900] uppercase tracking-tighter leading-snug whitespace-nowrap">
                  Customer Effective Cost After Subsidy As Per the Current Slab
                </p>
                <p className="text-[6pt] text-gray-400 font-black uppercase tracking-[0.25em] mt-1.5 opacity-80">
                  Inclusive of GST, Transportation & Standard Installation
                </p>
                <p className="text-[6pt] text-red-200 font-bold uppercase tracking-tight mt-1">
                  Consumer Need to Pay Total Plant Cost, MNRE Subsidy Will Directly Reach the Customer's Account Within 1-3 Month
                </p>
              </div>
              <div className="text-right min-w-fit">
                <span className="text-[22pt] font-black text-white leading-none">₹ {(quotation.pricing.onGridSystemCost - quotation.pricing.subsidyAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Charges (Customer Scope) */}
        <div className="mb-4 w-full">
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50/30">
            <table className="table-modern">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="w-20 text-center bg-gray-200 text-gray-700 !py-2 text-[6.5pt]">SL No</th>
                  <th className="!py-2 bg-gray-200 text-gray-700 font-black text-[6.5pt] tracking-widest">DESCRIPTION (additional CHARGES-CUSTOMER SCOPE)</th>
                  <th className="text-right w-44 pr-10 bg-gray-200 text-gray-700 font-black text-[6.5pt] tracking-widest">RATE (INR)</th>
                </tr>
              </thead>
              <tbody className="text-[8pt] font-bold">
                <tr>
                  <td className="text-center text-gray-300 !py-2">01</td>
                  <td className="!py-2 uppercase tracking-tight text-gray-600">TNEB Charges</td>
                  <td className="text-right font-black pr-10 text-gray-900 !py-2">₹ {quotation.pricing.tnebCharges.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="text-center text-gray-300 !py-2">02</td>
                  <td className="!py-2 uppercase tracking-tight text-gray-600">Customized Structure Cost</td>
                  <td className="text-right font-black pr-10 text-gray-900 !py-2">₹ {quotation.pricing.customizedStructureCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="text-center text-gray-300 !py-2">03</td>
                  <td className="!py-2 uppercase tracking-tight text-gray-600">Additional Material Cost – If Applicable</td>
                  <td className="text-right font-black pr-10 text-gray-900 !py-2">₹ {quotation.pricing.additionalMaterialCost.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Assurance Block */}
        <div className="mt-auto w-full">
          <SectionHeader title="Quality Assurance" />
          <div className="grid grid-cols-4 gap-3">
            {[
              { l: 'Modules', v: state.warranty.panelWarranty },
              { l: 'Inverter', v: state.warranty.inverterWarranty },
              { l: 'Service', v: state.warranty.systemWarranty },
              { l: 'Monitor', v: state.warranty.monitoringSystem },
            ].map((w, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex flex-col items-center text-center shadow-sm hover:border-red-100 transition-colors">
                <p className="text-[6pt] font-black text-red-600 uppercase tracking-widest mb-1">{w.l}</p>
                <p className="text-[7pt] font-black text-gray-800 leading-tight">{w.v}</p>
              </div>
            ))}
          </div>
        </div>
        <PageFooter pageNum={1} />
      </div>

      {/* PAGE 2: DETAILED BILL OF MATERIALS */}
      <div className="a4-page relative">
        <PageLogo />
        <div className="pt-6">
          <SectionHeader title="Technical Specifications (BOM)" />
          <p className="text-[9.5pt] text-gray-500 font-medium mb-4 leading-relaxed max-w-3xl px-2">
            Fixed Bill of Materials - {quotation.systemDescription}
          </p>
          
          <div className="rounded-xl overflow-hidden border border-gray-100 w-full shadow-sm mb-4">
            {/* Custom Compact Table */}
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-black text-white">
                  <th className="w-[5%] text-left py-1.5 px-2 text-[9pt] font-bold uppercase tracking-wider">#</th>
                  <th className="w-[20%] text-left py-1.5 px-2 text-[9pt] font-bold uppercase tracking-wider">Products</th>
                  <th className="w-[10%] text-left py-1.5 px-2 text-[9pt] font-bold uppercase tracking-wider">Qty</th>
                  <th className="w-[10%] text-left py-1.5 px-2 text-[9pt] font-bold uppercase tracking-wider">UOM</th>
                  <th className="w-[27.5%] text-left py-1.5 px-2 text-[9pt] font-bold uppercase tracking-wider">Specification/Type</th>
                  <th className="w-[27.5%] text-left py-1.5 px-2 text-[9pt] font-bold uppercase tracking-wider">Make</th>
                </tr>
              </thead>
              <tbody className="text-[9pt]">
                {quotation.bom.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="text-left text-gray-500 py-1.5 px-2 border-b border-gray-100 align-top">{idx + 1}</td>
                    <td className="text-left text-gray-900 font-medium py-1.5 px-2 border-b border-gray-100 align-top whitespace-normal break-words">{item.product}</td>
                    <td className="text-left text-gray-900 font-medium py-1.5 px-2 border-b border-gray-100 align-top whitespace-nowrap">{item.quantity}</td>
                    <td className="text-left text-gray-900 font-medium py-1.5 px-2 border-b border-gray-100 align-top whitespace-nowrap">{item.uom}</td>
                    <td className="text-left text-gray-600 py-1.5 px-2 border-b border-gray-100 align-top whitespace-normal break-words">{item.specification}</td>
                    <td className="text-left text-gray-900 uppercase py-1.5 px-2 border-b border-gray-100 align-top whitespace-normal break-words">{item.make}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-auto flex justify-end px-10 pb-4">
          <CompanySealBlock imageBottomClass="-bottom-2" />
        </div>

        <PageFooter pageNum={2} />
      </div>

      {/* PAGE 3: SERVICE TERMS */}
      <div className="a4-page relative">
        <PageLogo />
        <div className="pt-6">
          <SectionHeader title="Terms and Conditions" />
          
          <div className="flex flex-col gap-2 px-4 w-full mt-4">
            {activeTerms.map((term, idx) => (
              <div key={term.id} className="flex gap-4 items-start">
                <span className="flex-shrink-0 text-[9pt] font-bold text-gray-900 mt-0.5">
                  {idx + 1}.
                </span>
                <p className="text-[9pt] text-gray-700 font-normal leading-snug flex-1 text-justify">
                  {term.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center py-8 w-full opacity-40">
           <div className="opacity-10 select-none text-[60pt] font-black tracking-tighter text-black uppercase leading-none mb-4">KONDAAS</div>
           <p className="text-[7pt] text-gray-400 font-bold uppercase tracking-[0.2em] border-t border-gray-200 pt-4 w-3/4 text-center">Truly DEPENDABLE; PROMPT Always; QUALITY First; HIGH on ENERGY</p>
        </div>
        <PageFooter pageNum={3} />
      </div>

      {/* PAGE 4: PROJECT FULFILLMENT */}
      <div className="a4-page relative">
        <PageLogo />
        <div className="pt-6">
          <SectionHeader title="Execution & Compliance" />

          <div className="grid grid-cols-5 gap-6 mb-8 w-full">
            {/* Bank Details */}
            <div className="modern-card border-t-4 border-red-600 shadow-sm flex flex-col col-span-3">
              <h4 className="text-[7pt] font-black uppercase tracking-[0.25em] mb-4 text-red-600 text-center border-b border-red-50 pb-2">Company Bank Account Details</h4>
              <div className="space-y-2 text-[10pt] font-bold">
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">Account Holder</span>
                  <span className="text-black text-right leading-none max-w-[60%] truncate">{state.bank.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">Banking Partner</span>
                  <div className="text-right">
                    <span className="text-black block leading-none">{state.bank.bankName}</span>
                    {state.bank.branch && <span className="text-[8pt] text-gray-400 uppercase">{state.bank.branch}</span>}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">Account Number</span>
                  <span className="font-black text-black tracking-[0.15em]">{state.bank.accountNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">IFSC Code</span>
                  <span className="font-black text-red-600">{state.bank.ifsc}</span>
                </div>
                {state.bank.pan && (
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">PAN Number</span>
                    <span className="text-black text-[9pt]">{state.bank.pan}</span>
                  </div>
                )}
                {state.bank.gstNumber && (
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">GSTIN</span>
                    <span className="text-gray-700 text-[9pt]">{state.bank.gstNumber}</span>
                  </div>
                )}
                {state.bank.address && (
                  <div className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="text-gray-400 uppercase text-[7.5pt] font-black tracking-widest">Bank Address</span>
                    <span className="text-black text-right text-[8pt] max-w-[60%] leading-tight">{state.bank.address}</span>
                  </div>
                )}
                <div className="mt-3 text-center p-2 bg-white border border-red-50 rounded-xl shadow-inner">
                  <p className="text-[7.5pt] text-gray-400 uppercase font-black mb-1 tracking-widest">UPI ID</p>
                  <span className="text-[11pt] font-black text-black">{state.bank.upiId}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="modern-card bg-black text-white shadow-xl flex flex-col col-span-2">
              <h4 className="text-[8.5pt] font-black uppercase tracking-[0.25em] mb-7 text-red-500 text-center border-b border-gray-800 pb-3">Project Roadmap</h4>
              <div className="space-y-8">
                {[
                  { s: '01', t: 'Delivery', d: '7-10 Days After Advance Payment & TNEB Feasibility Approval' },
                  { s: '02', t: 'Payment', d: '10% Advance, 90% at the time of Material delivery' },
                  { s: '03', t: 'Installation', d: '7-10 Days from 90% Payment Clearance after material delivery' },
                ].map((t, idx) => (
                  <div key={idx} className="flex gap-5 items-start">
                    <span className="text-[22pt] font-black text-gray-800 leading-none">{t.s}</span>
                    <div className="flex-1">
                      <p className="text-[10.5pt] font-black uppercase tracking-tight leading-none mb-1.5 text-white">{t.t}</p>
                      <p className="text-[8pt] text-gray-500 font-bold leading-relaxed">{t.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documentation Checklist */}
          <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl mb-2 w-full shadow-inner">
            <h4 className="text-[10pt] font-black text-red-600 uppercase tracking-[0.3em] mb-6 text-center">REQUIRED DOCUMENTS FOR APPLY SUBSIDY</h4>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[9pt] font-bold text-gray-700 mb-6">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> Mobile Number</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> Aadhar Card</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> Email ID</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> Cancelled Cheque / Bank Passbook Front Page</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> Google Map Location (Longitude and Latitude)</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> TNEB Bill Copy</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span> Passport Size Photo</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-[8pt] font-black text-gray-500 uppercase tracking-widest mb-2">Note:</p>
              <ul className="list-disc pl-4 space-y-1 text-[7.5pt] font-medium text-gray-500 leading-relaxed marker:text-red-500">
                <li>All documents should belong to the TNEB consumer number owner's name.</li>
                <li>The TNEB consumer number owner's name and the bank passbook account holder's name must be the same for the consumer to receive MNRE subsidy.</li>
                <li>The bank loan can only be applied for under the name of the TNEB consumer</li>
                <li>Vendor-side bank loan documents will be provided only after MNRE registration, Jansamarth portal registration, and a 10% advance payment</li>
                <li>TNEB charges and structure cost are not included in the loan amount. The customer must pay the balance amount beyond the sanctioned loan, along with TNEB charges and structure cost, separately.</li>
              </ul>
            </div>
          </div>

          {/* Legal Signatures */}
          <div className="pt-1 flex justify-end px-10 w-full mt-0">
            <CompanySealBlock imageBottomClass="bottom-4" />
          </div>
        </div>
        
        <PageFooter pageNum={4} />
      </div>
    </div>
  );
};

export default PrintableView;
