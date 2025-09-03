import React from 'react';
import { ClientSummary } from '../types';

interface ClientOrdersChartProps {
  data: ClientSummary[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

export const ClientOrdersChart: React.FC<ClientOrdersChartProps> = ({ data }) => {
  if (!window.Recharts) {
    return null;
  }

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = window.Recharts;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Orders by Client</h3>
      <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="orders" name="Total Orders" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};