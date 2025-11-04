import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from '../firebase/config';

export const saveBusinessPlanToFirebase = async (formData, calculatedData) => {
  try {
    const docRef = await addDoc(collection(db, 'businessPlans'), {
      // Form Data
      ...formData,
      
      // Calculated Results
      calculatedResults: {
        totalGCI: calculatedData.totalGCI,
        avgCommissionDollar: calculatedData.avgCommissionDollar,
        totalCostOfSales: calculatedData.costOfSales.total,
        totalOperatingExpenses: calculatedData.totalOpExpenses,
        netIncome: calculatedData.netIncome,
        costOfSalesBreakdown: calculatedData.costOfSales,
        operatingExpensesBreakdown: calculatedData.opExpenses
      },
      
      // Timestamp
      createdAt: serverTimestamp(),
      
      // Optional: Add user identification if you have it
      userEmail: formData.email || 'unknown'
    });
    
    console.log('Business plan saved with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving business plan:', error);
    return { success: false, error: error.message };
  }
};
