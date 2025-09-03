
import React from 'react';
import { ProductionOrder } from '../types';
import { QRCode } from './QRCode';

interface PrintOrderProps {
  order: ProductionOrder;
}

export const PrintOrder: React.FC<PrintOrderProps> = ({ order }) => {
  return (
    <div id="print-section" className="p-8 bg-white text-black">
      <div className="border-4 border-black p-6">
        <header className="text-center mb-8 pb-4 border-b-2 border-black">
          <h1 className="text-4xl font-bold tracking-wider">PRODUCTION ORDER</h1>
          <h2 className="text-2xl mt-1 text-gray-700">Order ID: {order.id}</h2>
        </header>
        <main>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <div className="flex items-baseline">
                <p className="w-32 text-lg font-semibold text-gray-600">CLIENT:</p>
                <p className="text-2xl font-bold">{order.client}</p>
              </div>
              <div className="flex items-baseline">
                <p className="w-32 text-lg font-semibold text-gray-600">ARTICLE:</p>
                <p className="text-2xl font-bold">{order.article}</p>
              </div>
              <div className="flex items-baseline">
                <p className="w-32 text-lg font-semibold text-gray-600">COLOR:</p>
                <p className="text-2xl font-bold">{order.color}</p>
              </div>
              <div className="flex items-baseline">
                <p className="w-32 text-lg font-semibold text-gray-600">FINISHING:</p>
                <p className="text-2xl font-bold">{order.finishing}</p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center">
                <QRCode text={order.id} />
                <p className="text-sm text-gray-600 mt-2">Scan for Order Details</p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-xl font-bold border-b border-black pb-2 mb-4">NOTES & INSTRUCTIONS:</h3>
            <div className="border border-gray-400 h-48 p-2"></div>
          </div>
        </main>
      </div>
    </div>
  );
};
