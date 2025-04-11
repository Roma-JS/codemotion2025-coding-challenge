import { getAllUserData } from './db';

export async function printUserData(): Promise<void> {
  try {
    const userDataArray = await getAllUserData();

    if (userDataArray.length === 0) {
      console.log('No user data found in IndexedDB');
      return;
    }

    // Transform the data for better table display
    const tableData = userDataArray.map((data) => ({
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      'Completion Time (seconds)': data.completionTime || 'N/A',
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