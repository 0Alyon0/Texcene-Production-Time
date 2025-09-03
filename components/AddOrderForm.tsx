
import React, { useState } from 'react';
import { NewOrderData } from '../types';

interface AddOrderFormProps {
    onCalculate: (data: NewOrderData) => void;
    fulfillmentTime: number | null;
    isCalculating: boolean;
}

const formatFulfillmentTime = (minutes: number): string => {
    if (minutes < 0) return "N/A";
    if (minutes === 0) return "0 minutes";

    const days = Math.floor(minutes / 1440);
    const remainingMinutesAfterDays = minutes % 1440;
    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const remainingMinutes = Math.floor(remainingMinutesAfterDays % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);

    return parts.join(', ');
};


export const AddOrderForm: React.FC<AddOrderFormProps> = ({ onCalculate, fulfillmentTime, isCalculating }) => {
    const [client, setClient] = useState('');
    const [article, setArticle] = useState('');
    const [color, setColor] = useState('');
    const [finishing, setFinishing] = useState('');
    const [processingTime, setProcessingTime] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const time = parseInt(processingTime, 10);
        
        if (!client.trim() || !article.trim() || !processingTime.trim()) {
            setError('Please fill out at least Client, Article, and Processing Time.');
            return;
        }

        if (isNaN(time) || time <= 0) {
            setError('Processing Time must be a positive number.');
            return;
        }

        onCalculate({ 
            client, 
            article, 
            color, 
            finishing, 
            processingTime: time 
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-700">Calculate New Order Fulfillment</h2>
            <p className="text-slate-500 mt-1">Estimate the completion time for a new order added to the current queue.</p>
            
            <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-slate-600">Client*</label>
                        <input type="text" id="client" value={client} onChange={e => setClient(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="article" className="block text-sm font-medium text-slate-600">Article*</label>
                        <input type="text" id="article" value={article} onChange={e => setArticle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="color" className="block text-sm font-medium text-slate-600">Color</label>
                        <input type="text" id="color" value={color} onChange={e => setColor(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="finishing" className="block text-sm font-medium text-slate-600">Finishing</label>
                        <input type="text" id="finishing" value={finishing} onChange={e => setFinishing(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="processingTime" className="block text-sm font-medium text-slate-600">Processing Time (min)*</label>
                        <input type="number" id="processingTime" value={processingTime} onChange={e => setProcessingTime(e.target.value)} min="1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                <div className="mt-6 flex items-center justify-between">
                     <button
                        type="submit"
                        disabled={isCalculating}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
                     >
                        {isCalculating ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                <span>Calculating...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Calculate Time</span>
                            </>
                        )}
                    </button>
                    {fulfillmentTime !== null && !isCalculating && (
                        <div className="text-right">
                           <p className="text-sm text-slate-500">Estimated Fulfillment Time</p>
                           <p className="text-xl font-bold text-indigo-600">{formatFulfillmentTime(fulfillmentTime)}</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
