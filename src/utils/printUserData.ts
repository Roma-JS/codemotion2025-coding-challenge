import { getAllUserData } from './db';

export async function printUserData(): Promise<void> {
  try {
    const userDataArray = await getAllUserData();

    if (userDataArray.length === 0) {
      console.log('No user data found in IndexedDB');
      return;
    }

    // Filter out results with score 9999 and calculate adjusted times
    const validResults = userDataArray
      .filter(data => data.completionTime !== 9999)
      .map(data => ({
        ...data,
        adjustedTime: data.extremeMode && data.completionTime
          ? data.completionTime * 0.75
          : data.completionTime || 0
      }));

    if (validResults.length === 0) {
      console.log('No valid results found (excluding score 9999)');
      return;
    }

    // Sort by adjusted time
    validResults.sort((a, b) => (a.adjustedTime || 0) - (b.adjustedTime || 0));

    // Calculate score range
    const minTime = validResults[0].adjustedTime || 0;
    const maxTime = validResults[validResults.length - 1].adjustedTime || 0;
    const timeRange = maxTime - minTime;

    // Calculate scores (1-10) based on linear distribution
    const scoredResults = validResults.map(data => {
      const normalizedTime = ((data.adjustedTime || 0) - minTime) / timeRange;
      const score = Math.round(10 - (normalizedTime * 9)); // 10 to 1
      return {
        ...data,
        score: Math.max(1, Math.min(10, score)) // Ensure score is between 1 and 10
      };
    });

    // Transform the data for better table display
    const tableData = scoredResults.map((data) => ({
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      'Completion Time (seconds)': data.completionTime || 'N/A',
      'Adjusted Time (seconds)': data.adjustedTime || 'N/A',
      'Score': data.score,
      'Mode': data.extremeMode ? 'Extreme' : 'Normal',
      'Completion Date': data.completionDate ? new Date(data.completionDate).toLocaleString() : 'N/A'
    }));

    console.table(tableData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
}

// Add the function to the window object for easy access from console
declare global {
  interface Window {
    printUserData: () => Promise<void>;
  }
}

window.printUserData = printUserData;