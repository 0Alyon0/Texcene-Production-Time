
import React from 'react';
import { ClientSummary, UrgencySummary } from '../types';
import { ClientOrdersChart } from './ClientOrdersChart';
import { UrgencyChart } from './UrgencyChart';

interface DashboardProps {
  clientData: ClientSummary[];
  urgencyData: UrgencySummary[];
}

export const Dashboard: React.FC<DashboardProps> = ({ clientData, urgencyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ClientOrdersChart data={clientData} />
      <UrgencyChart data={urgencyData} />
    </div>
  );
};
