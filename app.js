import React, { useState } from 'react';
import { Download } from 'lucide-react';

const RealEstateBusinessPlan = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avgSalesPrice: '',
    avgCommissionPercent: '',
    goalTransactions: '',
    listingPercentage: '',
    listingToSoldRatio: '',
    listingApptConversion: '',
    buyerSoldConversion: '',
    buyerApptConversion: '',
    payListingSpecialist: 'no',
    listingSpecialistPercent: '',
    payBuyerSpecialist: 'no',
    buyerSpecialistPercent: '',
    buyerSpecialistCommission: '',
    hasReferralFees: 'no',
    referralCount: '',
    referralPercent: '',
    providesClosingGifts: 'no',
    closingGiftBudget: '',
    payTC: 'no',
    tcAmount: '',
    kwCares: 'no',
    kwCaresAmount: '',
    otherCostOfSale: 'no',
    otherCostAmount: '',
    compensationExpense: '',
    leadGeneration: '',
    occupancy: '',
    educationCoaching: '',
    suppliesOffice: '',
    communicationTech: '',
    auto: '',
    equipment: '',
    insurance: '',
    otherExpense: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateValues = () => {
    const avgPrice = parseFloat(formData.avgSalesPrice) || 0;
    const commPercent = parseFloat(formData.avgCommissionPercent) || 0;
    const goalTrans = parseFloat(formData.goalTransactions) || 0;
    
    const avgCommissionDollar = avgPrice * (commPercent / 100);
    const totalGCI = avgCommissionDollar * goalTrans;
    
    return { avgCommissionDollar, totalGCI };
  };

  const calculateCostOfSales = () => {
    const goalTrans = parseFloat(formData.goalTransactions) || 0;
    const totalGCI = calculateValues().totalGCI;
    const listingPercent = parseFloat(formData.listingPercentage) || 0;
    
    const listingCount = goalTrans * (listingPercent / 100);
    const buyerCount = goalTrans - listingCount;
    
    let costs = {
      listingSpecialist: 0,
      buyerSpecialist: 0,
      referralFees: 0,
      closingGifts: 0,
      tc: 0,
      kwCares: 0,
      other: 0
    };

    // Listing Specialist
    if (formData.payListingSpecialist === 'yes') {
      const lsPercent = parseFloat(formData.listingSpecialistPercent) || 0;
      costs.listingSpecialist = (totalGCI * (listingPercent / 100)) * (lsPercent / 100);
    }

    // Buyer Specialist
    if (formData.payBuyerSpecialist === 'yes') {
      const bsPercent = parseFloat(formData.buyerSpecialistPercent) || 0;
      const bsCommission = parseFloat(formData.buyerSpecialistCommission) || 0;
      costs.buyerSpecialist = buyerCount * (bsPercent / 100) * bsCommission;
    }

    // Referral Fees
    if (formData.hasReferralFees === 'yes') {
      const refCount = parseFloat(formData.referralCount) || 0;
      const refPercent = parseFloat(formData.referralPercent) || 0;
      const avgComm = calculateValues().avgCommissionDollar;
      costs.referralFees = refCount * avgComm * (refPercent / 100);
    }

    // Closing Gifts
    if (formData.providesClosingGifts === 'yes') {
      costs.closingGifts = parseFloat(formData.closingGiftBudget) || 0;
    }

    // TC
    if (formData.payTC === 'yes') {
      costs.tc = (parseFloat(formData.tcAmount) || 0) * goalTrans;
    }

    // KW Cares
    if (formData.kwCares === 'yes') {
      costs.kwCares = (parseFloat(formData.kwCaresAmount) || 0) * goalTrans;
    }

    // Other
    if (formData.otherCostOfSale === 'yes') {
      costs.other = (parseFloat(formData.otherCostAmount) || 0) * goalTrans;
    }

    const totalCostOfSales = Object.values(costs).reduce((a, b) => a + b, 0);
    return { ...costs, total: totalCostOfSales };
  };

  const calculateOperatingExpenses = () => {
    return {
      compensation: parseFloat(formData.compensationExpense) || 0,
      leadGen: parseFloat(formData.leadGeneration) || 0,
      occupancy: parseFloat(formData.occupancy) || 0,
      education: parseFloat(formData.educationCoaching) || 0,
      supplies: parseFloat(formData.suppliesOffice) || 0,
      communication: parseFloat(formData.communicationTech) || 0,
      auto: parseFloat(formData.auto) || 0,
      equipment: parseFloat(formData.equipment) || 0,
      insurance: parseFloat(formData.insurance) || 0,
      other: parseFloat(formData.otherExpense) || 0
    };
  };

  const generatePDF = async () => {
    const { avgCommissionDollar, totalGCI } = calculateValues();
    const costOfSales = calculateCostOfSales();
    const opExpenses = calculateOperatingExpenses();
    const totalOpExpenses = Object.values(opExpenses).reduce((a, b) => a + b, 0);
    const netIncome = totalGCI - costOfSales.total - totalOpExpenses;
    
    const goalTrans = parseFloat(formData.goalTransactions) || 0;
    const listingPercent = parseFloat(formData.listingPercentage) || 0;
    const listingCount = goalTrans * (listingPercent / 100);
    const buyerCount = goalTrans - listingCount;
    
    const listingToSold = parseFloat(formData.listingToSoldRatio) || 0;
    const listingApptConv = parseFloat(formData.listingApptConversion) || 0;
    const buyerSoldConv = parseFloat(formData.buyerSoldConversion) || 0;
    const buyerApptConv = parseFloat(formData.buyerApptConversion) || 0;
    
    const listingsTaken = listingToSold > 0 ? listingCount / (listingToSold / 100) : 0;
    const listingApptsNeeded = listingApptConv > 0 ? listingsTaken / (listingApptConv / 100) : 0;
    const buyersUnderContract = buyerSoldConv > 0 ? buyerCount / (buyerSoldConv / 100) : 0;
    const buyerApptsNeeded = buyerApptConv > 0 ? buyersUnderContract / (buyerApptConv / 100) : 0;

    // Create PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Page 1 - Economic Model
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('The Economic Model', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Agent: ${formData.name}`, 20, 35);
    
    doc.setFont(undefined, 'bold');
    doc.text('Financial Summary', 20, 50);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Gross Income (GCI): $${totalGCI.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, 58);
    doc.text(`Cost of Sales: $${costOfSales.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, 66);
    doc.text(`Operating Expenses: $${totalOpExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, 74);
    doc.text(`Total Net Income: $${netIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, 82);
    
    doc.text(`Average Commission: $${avgCommissionDollar.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, 90);
    doc.text(`Units Sold: ${goalTrans}`, 20, 98);
    
    doc.setFont(undefined, 'bold');
    doc.text('Listing Side Breakdown', 20, 113);
    doc.setFont(undefined, 'normal');
    doc.text(`Listings Sold: ${listingCount.toFixed(1)} (${listingPercent}% of total)`, 20, 121);
    doc.text(`Listings Taken Needed: ${listingsTaken.toFixed(1)}`, 20, 129);
    doc.text(`Conversion Rate (Taken to Sold): ${listingToSold}%`, 20, 137);
    doc.text(`Listing Appointments Needed: ${listingApptsNeeded.toFixed(1)}`, 20, 145);
    doc.text(`Conversion Rate (Appt to Taken): ${listingApptConv}%`, 20, 153);
    
    doc.setFont(undefined, 'bold');
    doc.text('Buyer Side Breakdown', 20, 168);
    doc.setFont(undefined, 'normal');
    doc.text(`Buyers Closed: ${buyerCount.toFixed(1)} (${(100-listingPercent).toFixed(1)}% of total)`, 20, 176);
    doc.text(`Buyers Under Contract Needed: ${buyersUnderContract.toFixed(1)}`, 20, 184);
    doc.text(`Conversion Rate (Contract to Sold): ${buyerSoldConv}%`, 20, 192);
    doc.text(`Buyer Appointments Needed: ${buyerApptsNeeded.toFixed(1)}`, 20, 200);
    doc.text(`Conversion Rate (Appt to Contract): ${buyerApptConv}%`, 20, 208);
    
    // Page 2 - Budget Model
    doc.addPage();
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('The Budget Model', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Agent: ${formData.name}`, 20, 35);
    doc.text(`GCI Goal: $${totalGCI.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, 43);
    
    doc.setFont(undefined, 'bold');
    doc.text('Cost of Sales', 20, 58);
    doc.setFont(undefined, 'normal');
    let yPos = 66;
    if (costOfSales.listingSpecialist > 0) {
      doc.text(`Listing Specialist: $${costOfSales.listingSpecialist.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    if (costOfSales.buyerSpecialist > 0) {
      doc.text(`Buyer Specialist: $${costOfSales.buyerSpecialist.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    if (costOfSales.referralFees > 0) {
      doc.text(`Referral Fees: $${costOfSales.referralFees.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    if (costOfSales.closingGifts > 0) {
      doc.text(`Closing Gifts: $${costOfSales.closingGifts.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    if (costOfSales.tc > 0) {
      doc.text(`Transaction Coordinator: $${costOfSales.tc.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    if (costOfSales.kwCares > 0) {
      doc.text(`KW Cares: $${costOfSales.kwCares.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    if (costOfSales.other > 0) {
      doc.text(`Other Cost of Sale: $${costOfSales.other.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
      yPos += 8;
    }
    doc.setFont(undefined, 'bold');
    doc.text(`Total Cost of Sales: $${costOfSales.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, yPos);
    
    yPos += 15;
    doc.text('Operating Expenses', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 8;
    
    const opExpenseEntries = [
      ['Compensation/Salary', opExpenses.compensation],
      ['Lead Generation', opExpenses.leadGen],
      ['Occupancy', opExpenses.occupancy],
      ['Education & Coaching', opExpenses.education],
      ['Supplies & Office', opExpenses.supplies],
      ['Communication & Tech', opExpenses.communication],
      ['Auto', opExpenses.auto],
      ['Equipment', opExpenses.equipment],
      ['Insurance', opExpenses.insurance],
      ['Other Expenses', opExpenses.other]
    ];
    
    opExpenseEntries.forEach(([label, amount]) => {
      if (amount > 0) {
        doc.text(`${label}: $${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 25, yPos);
        yPos += 8;
      }
    });
    
    doc.setFont(undefined, 'bold');
    doc.text(`Total Operating Expenses: $${totalOpExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, yPos);
    
    yPos += 15;
    doc.setFontSize(14);
    doc.text(`NET INCOME: $${netIncome.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, yPos);
    
    // Save PDF
    doc.save(`Business_Plan_${formData.name.replace(/\s+/g, '_')}.pdf`);
    
    // TODO: Send data to backend for storage
    // fetch('/api/save-plan', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    
    alert('PDF generated successfully! To save responses to a database, you\'ll need to set up a backend service.');
  };

  const { avgCommissionDollar, totalGCI } = calculateValues();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Real Estate Business Plan Calculator</h1>
        <p className="text-gray-600 mb-8">Plan your year with confidence</p>
        
        <div className="space-y-6">
          {/* Contact Information */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* Income Goals */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Income Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Sales Price ($)</label>
                <input type="number" name="avgSalesPrice" value={formData.avgSalesPrice} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Commission per Side (%)</label>
                <input type="number" step="0.01" name="avgCommissionPercent" value={formData.avgCommissionPercent} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Commission per Side ($)</label>
                <input type="text" value={`$${avgCommissionDollar.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal # of Transactions</label>
                <input type="number" name="goalTransactions" value={formData.goalTransactions} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total GCI Goal</label>
                <input type="text" value={`$${totalGCI.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-lg font-semibold text-blue-600" />
              </div>
            </div>
          </section>

          {/* Conversion Ratios */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Conversion Ratios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">% of Transactions That Will Be Listings</label>
                <input type="number" step="0.01" name="listingPercentage" value={formData.listingPercentage} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing to Sold Ratio (%)</label>
                <input type="number" step="0.01" name="listingToSoldRatio" value={formData.listingToSoldRatio} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Appt to Listing Taken Conversion (%)</label>
                <input type="number" step="0.01" name="listingApptConversion" value={formData.listingApptConversion} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Sold Conversion Ratio (%)</label>
                <input type="number" step="0.01" name="buyerSoldConversion" value={formData.buyerSoldConversion} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Appt to Buyer Taken Conversion (%)</label>
                <input type="number" step="0.01" name="buyerApptConversion" value={formData.buyerApptConversion} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* Specialist Costs */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Specialist Costs</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Are you planning on paying a listing specialist?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="payListingSpecialist" value="yes" checked={formData.payListingSpecialist === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payListingSpecialist" value="no" checked={formData.payListingSpecialist === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.payListingSpecialist === 'yes' && (
              <div className="mb-4 ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">What % will you pay them on listings?</label>
                <input type="number" step="0.01" name="listingSpecialistPercent" value={formData.listingSpecialistPercent} onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Are you paying a buyer specialist?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="payBuyerSpecialist" value="yes" checked={formData.payBuyerSpecialist === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payBuyerSpecialist" value="no" checked={formData.payBuyerSpecialist === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.payBuyerSpecialist === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What % of your buy sides will have a specialist?</label>
                  <input type="number" step="0.01" name="buyerSpecialistPercent" value={formData.buyerSpecialistPercent} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What do you pay buy side specialists? ($)</label>
                  <input type="number" name="buyerSpecialistCommission" value={formData.buyerSpecialistCommission} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            )}
          </section>

          {/* Additional Costs */}
          <section className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Transaction Costs</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Will any of your transactions have a referral fee?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="hasReferralFees" value="yes" checked={formData.hasReferralFees === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="hasReferralFees" value="no" checked={formData.hasReferralFees === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.hasReferralFees === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How many referral fees will you pay?</label>
                  <input type="number" name="referralCount" value={formData.referralCount} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What % do you pay per referral?</label>
                  <input type="number" step="0.01" name="referralPercent" value={formData.referralPercent} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Will you provide closing gifts?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="providesClosingGifts" value="yes" checked={formData.providesClosingGifts === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="providesClosingGifts" value="no" checked={formData.providesClosingGifts === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.providesClosingGifts === 'yes' && (
              <div className="mb-4 ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">What is your budget for closing gifts? ($)</label>
                <input type="number" name="closingGiftBudget" value={formData.closingGiftBudget} onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Will you pay a transaction coordinator?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="payTC" value="yes" checked={formData.payTC === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="payTC" value="no" checked={formData.payTC === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.payTC === 'yes' && (
              <div className="mb-4 ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">How much will you pay a TC per transaction? ($)</label>
                <input type="number" name="tcAmount" value={formData.tcAmount} onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">KW Cares contribution?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="kwCares" value="yes" checked={formData.kwCares === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="kwCares" value="no" checked={formData.kwCares === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.kwCares === 'yes' && (
              <div className="mb-4 ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount per contribution ($)</label>
                <input type="number" name="kwCaresAmount" value={formData.kwCaresAmount} onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Any other cost of sale?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="otherCostOfSale" value="yes" checked={formData.otherCostOfSale === 'yes'} onChange={handleChange} className="mr-2" />
                  Yes
                </label>
                <label className="flex items-center">
                  <input type="radio" name="otherCostOfSale" value="no" checked={formData.otherCostOfSale === 'no'} onChange={handleChange} className="mr-2" />
                  No
                </label>
              </div>
            </div>
            
            {formData.otherCostOfSale === 'yes' && (
              <div className="ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">How much per transaction? ($)</label>
                <input type="number" name="otherCostAmount" value={formData.otherCostAmount} onChange={handleChange}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            )}
          </section>

          {/* Operating Expenses */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Operating Expenses (Annual)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compensation/Salary Expense ($)</label>
                <input type="number" name="compensationExpense" value={formData.compensationExpense} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Generation ($)</label>
                <input type="number" name="leadGeneration" value={formData.leadGeneration} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy ($)</label>
                <input type="number" name="occupancy" value={formData.occupancy} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education and Coaching ($)</label>
                <input type="number" name="educationCoaching" value={formData.educationCoaching} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplies and Office Expenses ($)</label>
                <input type="number" name="suppliesOffice" value={formData.suppliesOffice} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication and Tech ($)</label>
                <input type="number" name="communicationTech" value={formData.communicationTech} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto ($)</label>
                <input type="number" name="auto" value={formData.auto} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment ($)</label>
                <input type="number" name="equipment" value={formData.equipment} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance ($)</label>
                <input type="number" name="insurance" value={formData.insurance} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Expense ($)</label>
                <input type="number" name="otherExpense" value={formData.otherExpense} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* Calculate Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200"
            >
              <Download size={20} />
              Calculate & Download PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Load jsPDF from CDN */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    </div>
  );
};

export default RealEstateBusinessPlan;
