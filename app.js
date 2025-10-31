const { useState } = React;

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

  const [showResults, setShowResults] = useState(false);

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

    if (formData.payListingSpecialist === 'yes') {
      const lsPercent = parseFloat(formData.listingSpecialistPercent) || 0;
      costs.listingSpecialist = (totalGCI * (listingPercent / 100)) * (lsPercent / 100);
    }

    if (formData.payBuyerSpecialist === 'yes') {
      const bsPercent = parseFloat(formData.buyerSpecialistPercent) || 0;
      const bsCommissionPercent = parseFloat(formData.buyerSpecialistCommission) || 0;
      const avgComm = calculateValues().avgCommissionDollar;
      costs.buyerSpecialist = buyerCount * (bsPercent / 100) * avgComm * (bsCommissionPercent / 100);
    }

    if (formData.hasReferralFees === 'yes') {
      const refCount = parseFloat(formData.referralCount) || 0;
      const refPercent = parseFloat(formData.referralPercent) || 0;
      const avgComm = calculateValues().avgCommissionDollar;
      costs.referralFees = refCount * avgComm * (refPercent / 100);
    }

    if (formData.providesClosingGifts === 'yes') {
      const perGift = parseFloat(formData.closingGiftBudget) || 0;
      costs.closingGifts = perGift * goalTrans;
    }

    if (formData.payTC === 'yes') {
      costs.tc = (parseFloat(formData.tcAmount) || 0) * goalTrans;
    }

    if (formData.kwCares === 'yes') {
      costs.kwCares = (parseFloat(formData.kwCaresAmount) || 0) * goalTrans;
    }

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

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  };

  const handleCalculate = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  const { avgCommissionDollar, totalGCI } = calculateValues();

  if (showResults) {
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
    
    const listingsTaken = listingToSold > 0 ? Math.ceil(listingCount / (listingToSold / 100)) : 0;
    const listingApptsNeeded = listingApptConv > 0 ? Math.ceil(listingsTaken / (listingApptConv / 100)) : 0;
    const buyersUnderContract = buyerSoldConv > 0 ? Math.ceil(buyerCount / (buyerSoldConv / 100)) : 0;
    const buyerApptsNeeded = buyerApptConv > 0 ? Math.ceil(buyersUnderContract / (buyerApptConv / 100)) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={handleBackToForm}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
          >
            <span>← Back to Form</span>
          </button>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">The Economic Model</h1>
            
            <div className="mb-6">
              <p className="text-xl text-gray-700"><span className="font-semibold">Agent:</span> {formData.name}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Gross Income (GCI):</span>
                  <span className="font-semibold">${formatCurrency(totalGCI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Cost of Sales:</span>
                  <span className="font-semibold">${formatCurrency(costOfSales.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Operating Expenses:</span>
                  <span className="font-semibold">${formatCurrency(totalOpExpenses)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-blue-200">
                  <span className="text-gray-800 font-bold">Total Net Income:</span>
                  <span className="font-bold text-blue-600 text-xl">${formatCurrency(netIncome)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Average Commission:</p>
                <p className="text-2xl font-bold text-gray-800">${formatCurrency(avgCommissionDollar)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Units Sold:</p>
                <p className="text-2xl font-bold text-gray-800">{goalTrans}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Listing Side Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Listings Sold</p>
                    <p className="text-lg font-semibold">{listingCount} <span className="text-sm text-gray-500">({listingPercent}% of total)</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Listings Taken Needed</p>
                    <p className="text-lg font-semibold">{listingsTaken}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate (Taken to Sold)</p>
                    <p className="text-lg font-semibold">{listingToSold}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Listing Appointments Needed</p>
                    <p className="text-lg font-semibold">{listingApptsNeeded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate (Appt to Taken)</p>
                    <p className="text-lg font-semibold">{listingApptConv}%</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Buyer Side Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Buyers Closed</p>
                    <p className="text-lg font-semibold">{buyerCount} <span className="text-sm text-gray-500">({(100-listingPercent).toFixed(1)}% of total)</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Buyers Under Contract Needed</p>
                    <p className="text-lg font-semibold">{buyersUnderContract}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate (Contract to Sold)</p>
                    <p className="text-lg font-semibold">{buyerSoldConv}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Buyer Appointments Needed</p>
                    <p className="text-lg font-semibold">{buyerApptsNeeded}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate (Appt to Contract)</p>
                    <p className="text-lg font-semibold">{buyerApptConv}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">The Budget Model</h1>
            
            <div className="mb-6">
              <p className="text-xl text-gray-700"><span className="font-semibold">Agent:</span> {formData.name}</p>
              <p className="text-lg text-gray-600 mt-2">GCI Goal: <span className="font-semibold text-blue-600">${formatCurrency(totalGCI)}</span></p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Cost of Sales</h2>
              <div className="space-y-2">
                {costOfSales.listingSpecialist > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Listing Specialist</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.listingSpecialist)}</span>
                  </div>
                )}
                {costOfSales.buyerSpecialist > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Buyer Specialist</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.buyerSpecialist)}</span>
                  </div>
                )}
                {costOfSales.referralFees > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Referral Fees</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.referralFees)}</span>
                  </div>
                )}
                {costOfSales.closingGifts > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Closing Gifts</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.closingGifts)}</span>
                  </div>
                )}
                {costOfSales.tc > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Transaction Coordinator</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.tc)}</span>
                  </div>
                )}
                {costOfSales.kwCares > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">KW Cares</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.kwCares)}</span>
                  </div>
                )}
                {costOfSales.other > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Other Cost of Sale</span>
                    <span className="font-semibold">${formatCurrency(costOfSales.other)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold">
                  <span className="text-gray-800">Total Cost of Sales</span>
                  <span className="text-red-600">${formatCurrency(costOfSales.total)}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">Operating Expenses</h2>
              <div className="space-y-2">
                {opExpenses.compensation > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Compensation/Salary</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.compensation)}</span>
                  </div>
                )}
                {opExpenses.leadGen > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Lead Generation</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.leadGen)}</span>
                  </div>
                )}
                {opExpenses.occupancy > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Occupancy</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.occupancy)}</span>
                  </div>
                )}
                {opExpenses.education > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Education & Coaching</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.education)}</span>
                  </div>
                )}
                {opExpenses.supplies > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Supplies & Office</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.supplies)}</span>
                  </div>
                )}
                {opExpenses.communication > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Communication & Tech</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.communication)}</span>
                  </div>
                )}
                {opExpenses.auto > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Auto</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.auto)}</span>
                  </div>
                )}
                {opExpenses.equipment > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Equipment</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.equipment)}</span>
                  </div>
                )}
                {opExpenses.insurance > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Insurance</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.insurance)}</span>
                  </div>
                )}
                {opExpenses.other > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Other Expenses</span>
                    <span className="font-semibold">${formatCurrency(opExpenses.other)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold">
                  <span className="text-gray-800">Total Operating Expenses</span>
                  <span className="text-red-600">${formatCurrency(totalOpExpenses)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">NET INCOME</span>
                <span className="text-3xl font-bold">${formatCurrency(netIncome)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Real Estate Business Plan Calculator</h1>
        <p className="text-gray-600 mb-8">Plan your year with confidence</p>
        
        <div className="space-y-6">
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
                <input type="text" value={'$' + formatCurrency(avgCommissionDollar)} readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal # of Transactions</label>
                <input type="number" name="goalTransactions" value={formData.goalTransactions} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total GCI Goal</label>
                <input type="text" value={'$' + formatCurrency(totalGCI)} readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-lg font-semibold text-blue-600" />
              </div>
            </div>
          </section>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">What % of the commission do you pay buy side specialists?</label>
                  <input
                    type="number"
                    step="0.01"
                    name="buyerSpecialistCommission"
                    value={formData.buyerSpecialistCommission}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
            )}
          </section>

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

          <div className="flex justify-center pt-6">
            <button
              onClick={handleCalculate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200"
            >
              <span>📊 Calculate Business Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RealEstateBusinessPlan />);
