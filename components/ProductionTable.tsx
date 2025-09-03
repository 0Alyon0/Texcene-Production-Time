
import React, { useState, useEffect } from 'react';
import { ProductionOrder } from '../types';

interface ProductionTableProps {
  data: ProductionOrder[];
  onDownload: (order: ProductionOrder) => void;
}

const getUrgencyClass = (minutes: number): string => {
  if (minutes < 60) return 'bg-red-100 text-red-800';
  if (minutes < 240) return 'bg-orange-100 text-orange-800';
  if (minutes < 1440) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

const formatCountdown = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return "Completed";

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};

const OrderRow: React.FC<{ order: ProductionOrder; onDownload: (order: ProductionOrder) => void; }> = ({ order, onDownload }) => {
    const [remainingSeconds, setRemainingSeconds] = useState(order.minutesToComplete * 60);

    useEffect(() => {
        if (remainingSeconds <= 0) return;

        const interval = setInterval(() => {
            setRemainingSeconds(prevSeconds => prevSeconds > 0 ? prevSeconds - 1 : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const remainingMinutes = remainingSeconds / 60;
    const urgencyClass = remainingSeconds > 0 ? getUrgencyClass(remainingMinutes) : 'bg-slate-200 text-slate-600';
    const formattedTime = formatCountdown(remainingSeconds);

    return (
        <tr key={order.id} className="hover:bg-slate-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.client}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.article}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.color}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{order.finishing}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-200 ${urgencyClass}`}>
                    {formattedTime}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                    onClick={() => onDownload(order)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    aria-label={`Download PDF for order ${order.id}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                </button>
            </td>
        </tr>
    );
};

export const ProductionTable: React.FC<ProductionTableProps> = ({ data, onDownload }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-700">Prioritized Production Schedule</h3>
            <p className="text-slate-500 mt-1">Orders sorted by urgency (most urgent first).</p>
        </div>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
            <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Article</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Color</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Finishing</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time Left</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
            {data.map((order) => (
                <OrderRow key={order.id} order={order} onDownload={onDownload} />
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};
