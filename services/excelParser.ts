
import { ProductionOrder } from '../types';

// Column mapping based on Python script: ["Z", "D", "E", "L", "P", "AA"]
// 0-based indices: [25, 3, 4, 11, 15, 26]
const COL_INDICES = {
  ID: 25,
  CLIENT: 3,
  ARTICLE: 4,
  COLOR: 11,
  FINISHING: 15,
  MINUTES: 26,
};


export const parseProductionFile = (file: File): Promise<ProductionOrder[]> => {
  return new Promise((resolve, reject) => {
    if (!window.XLSX) {
      return reject(new Error("Excel parsing library (XLSX) is not available."));
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("File could not be read.");
        }
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[][] = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row (index 0)
        const orders: ProductionOrder[] = jsonData.slice(1).map((row, index) => {
          const minutes = parseFloat(row[COL_INDICES.MINUTES]);
          return {
            id: String(row[COL_INDICES.ID] ?? `row-${index}`),
            client: String(row[COL_INDICES.CLIENT] ?? 'N/A'),
            article: String(row[COL_INDICES.ARTICLE] ?? 'N/A'),
            color: String(row[COL_INDICES.COLOR] ?? 'N/A'),
            finishing: String(row[COL_INDICES.FINISHING] ?? 'N/A'),
            minutesToComplete: isNaN(minutes) ? Infinity : minutes,
          };
        }).filter(order => order.id && order.id !== 'undefined' && order.client !== 'N/A' ); // Filter out potentially empty rows

        if (orders.length === 0) {
          throw new Error("No valid data found in the specified columns. Please check the file format.");
        }

        resolve(orders);
      } catch (error) {
        if (error instanceof Error) {
            reject(new Error(`Failed to parse Excel file: ${error.message}`));
        } else {
            reject(new Error("An unknown error occurred during file parsing."));
        }
      }
    };

    reader.onerror = (error) => {
      reject(new Error("Error reading file: " + error));
    };

    reader.readAsArrayBuffer(file);
  });
};
