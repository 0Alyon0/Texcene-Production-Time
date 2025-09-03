import React from 'react';
import { UrgencySummary } from '../types';

interface UrgencyChartProps {
  data: UrgencySummary[];
}

const URGENCY_COLORS: { [key: string]: string } = {
    '<1h': '#ef4444', // red-500
    '<4h': '#f97316', // orange-500
    '<1d': '#facc15', // yellow-400
    '>1d': '#4ade80', // green-400
};

export const UrgencyChart: React.FC<UrgencyChartProps> = ({ data }) => {
  if (!window.Recharts) {
    return null;
  }
  
  const sortedData = [...data].sort((a, b) => a.level - b.level);

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } = window.Recharts;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-700 mb-4">Orders by Urgency</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={sortedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false}/>
            <Tooltip
                cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
            />
            <Bar dataKey="orders" name="Total Orders">
              {sortedData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={URGENCY_COLORS[entry.name] || '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};