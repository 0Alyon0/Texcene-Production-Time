
export interface ProductionOrder {
  id: string;
  client: string;
  article: string;
  color: string;
  finishing: string;
  minutesToComplete: number;
}

export interface ClientSummary {
  name: string;
  orders: number;
}

export interface UrgencySummary {
  name: string;
  orders: number;
  level: number;
}

export interface NewOrderData {
  client: string;
  article: string;
  color: string;
  finishing: string;
  processingTime: number;
}

export interface MachineWorkload {
  name: string;
  workload: number;
  capacity: number;
}


// Inform TypeScript that libraries will be available on the global window object.
declare global {
  interface Window {
    XLSX: any;
    Recharts: any;
    QRCode: any;
    jspdf: any;
    html2canvas: any;
  }
}