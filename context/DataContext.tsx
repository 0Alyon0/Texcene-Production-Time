import React, { createContext, useContext, ReactNode } from 'react';
import { useExcelProcessor } from '../hooks/useExcelProcessor';
import { ProductionOrder, ClientSummary, UrgencySummary, MachineWorkload } from '../types';

// Define the shape of the context data
interface DataContextProps {
  productionData: ProductionOrder[] | null;
  clientSummary: ClientSummary[] | null;
  urgencySummary: UrgencySummary[] | null;
  machineWorkload: MachineWorkload[] | null;
  isLoading: boolean;
  error: string | null;
  processFile: (file: File) => Promise<void>;
}

// Create the context with a default undefined value
const DataContext = createContext<DataContextProps | undefined>(undefined);

/**
 * Provides the application-wide data state by using the useExcelProcessor hook.
 * Any child component can access this data via the useData hook.
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const excelProcessor = useExcelProcessor();

  return (
    <DataContext.Provider value={excelProcessor}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Custom hook to easily access the data context.
 * Throws an error if used outside of a DataProvider.
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
