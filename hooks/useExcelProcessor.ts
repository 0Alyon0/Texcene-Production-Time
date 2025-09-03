
import { useState, useCallback } from 'react';
import { ProductionOrder, ClientSummary, UrgencySummary, MachineWorkload } from '../types';
import { parseProductionFile } from '../services/excelParser';

// Weekly production capacity in meters, based on the provided production flowchart.
// This data is used to compare against the workload calculated from the production orders.
const MACHINE_CAPACITIES_METERS: Record<string, number> = {
  "Magazzino Merce a Disporre": 4000000,
  "Arrotolatura": 100000,
  "Bruciapelo": 250000,
  "Stoccaggio per maturazione": 250000,
  "Candeggio Naturale / Lavaggio": 210000,
  "Bianco ottico": 280000,
  "Ram": 490000,
  "Garze": 55000,
  "Tintoria Foulard": 80000,
  "Stoccaggio": 80000,
  "Lavaggio": 80000,
  "Asciugamento per finissaggio": 20000,
  "Garzatrice": 10000,
  "Ram Finissaggio": 280000,
  "Calandra": 80000,
  "Falda": 50000,
  "Specola/Piegatrice/Conf Pez.": 120000,
  "Spedizione": 600000,
};


export const useExcelProcessor = () => {
  const [productionData, setProductionData] = useState<ProductionOrder[] | null>(null);
  const [clientSummary, setClientSummary] = useState<ClientSummary[] | null>(null);
  const [urgencySummary, setUrgencySummary] = useState<UrgencySummary[] | null>(null);
  const [machineWorkload, setMachineWorkload] = useState<MachineWorkload[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProductionData(null);
    setClientSummary(null);
    setUrgencySummary(null);
    setMachineWorkload(null);

    try {
      const parsedData = await parseProductionFile(file);

      // 1. Sort data by minutes to complete
      const sortedData = [...parsedData].sort(
        (a, b) => a.minutesToComplete - b.minutesToComplete
      );
      setProductionData(sortedData);

      // 2. Create client summary
      const clientCounts = sortedData.reduce((acc, order) => {
        acc[order.client] = (acc[order.client] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const clientSummaryData: ClientSummary[] = Object.entries(clientCounts)
        .map(([name, orders]) => ({ name, orders }))
        .sort((a,b) => b.orders - a.orders);
      setClientSummary(clientSummaryData);

      // 3. Create urgency summary
      const urgencyCounts = sortedData.reduce((acc, order) => {
          const minutes = order.minutesToComplete;
          if (minutes < 60) acc["<1h"] = (acc["<1h"] || 0) + 1;
          else if (minutes < 240) acc["<4h"] = (acc["<4h"] || 0) + 1;
          else if (minutes < 1440) acc["<1d"] = (acc["<1d"] || 0) + 1;
          else acc[">1d"] = (acc[">1d"] || 0) + 1;
          return acc;
        }, { "<1h": 0, "<4h": 0, "<1d": 0, ">1d": 0 } as Record<string, number>);

      const urgencyLevels: Record<string, number> = { "<1h": 1, "<4h": 2, "<1d": 3, ">1d": 4 };

      const urgencySummaryData: UrgencySummary[] = Object.entries(urgencyCounts)
        .map(([name, orders]) => ({ name, orders, level: urgencyLevels[name] }));
      setUrgencySummary(urgencySummaryData);

      // 4. Create machine workload summary
      const machineNames = Object.keys(MACHINE_CAPACITIES_METERS);
      
      const workloadMap = new Map<string, number>();
      machineNames.forEach(name => workloadMap.set(name, 0));

      parsedData.forEach(order => {
        const finishing = order.finishing?.trim();
        if (finishing && order.minutesToComplete > 0 && isFinite(order.minutesToComplete)) {
          const canonicalName = [...workloadMap.keys()].find(key => key.toLowerCase() === finishing.toLowerCase());
          const key = canonicalName || finishing; 

          const currentWorkload = workloadMap.get(key) || 0;
          workloadMap.set(key, currentWorkload + order.minutesToComplete);
        }
      });
      
      const machineWorkloadData: MachineWorkload[] = Array.from(workloadMap.entries())
        .map(([name, workload]) => ({ 
            name, 
            workload,
            capacity: MACHINE_CAPACITIES_METERS[name] || 0
        }))
        .sort((a, b) => (MACHINE_CAPACITIES_METERS[b.name] || 0) - (MACHINE_CAPACITIES_METERS[a.name] || 0)); // Keep original order

      setMachineWorkload(machineWorkloadData);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    productionData,
    clientSummary,
    urgencySummary,
    machineWorkload,
    isLoading,
    error,
    processFile,
  };
};