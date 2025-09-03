
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FileUpload } from './components/FileUpload';
import { ProductionTable } from './components/ProductionTable';
import { Dashboard } from './components/Dashboard';
import { AddOrderForm } from './components/AddOrderForm';
import { PrintOrder } from './components/PrintOrder';
import { ProductionFlow } from './components/ProductionFlow';
import { NewOrderData, ProductionOrder } from './types';
import { Navigation } from './components/Navigation';
import { useData } from './context/DataContext';

const App: React.FC = () => {
  const { 
    productionData, 
    clientSummary, 
    urgencySummary,
    machineWorkload,
    isLoading, 
    error, 
    processFile 
  } = useData();
  
  const [file, setFile] = useState<File | null>(null);
  const [fulfillmentTime, setFulfillmentTime] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'machineView'>('dashboard');

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setFulfillmentTime(null); // Reset calculation when new file is uploaded
    setCurrentPage('dashboard'); // Always return to dashboard on new file upload
    processFile(selectedFile);
  };

  const handleCalculateFulfillment = (newOrder: NewOrderData) => {
    if (!productionData) return;

    setIsCalculating(true);
    setFulfillmentTime(null);

    // Simulate a small delay for a better user experience
    setTimeout(() => {
        const existingOrdersTime = productionData.reduce(
            (sum, order) => sum + order.minutesToComplete, 0
        );
        const totalTime = existingOrdersTime + newOrder.processingTime;
        setFulfillmentTime(totalTime);
        setIsCalculating(false);
    }, 500);
  };

  const handleDownloadPdf = async (order: ProductionOrder) => {
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;

    if (!jsPDF || !html2canvas) {
        alert("PDF generation libraries are not loaded. Please try again.");
        return;
    }

    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.width = '800px'; // Fixed width for consistent rendering
    document.body.appendChild(printContainer);

    const root = createRoot(printContainer);
    root.render(<PrintOrder order={order} />);

    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render, especially QR code

    try {
        const canvas = await html2canvas(printContainer, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        let imgWidth = pdfWidth - 20; // 10mm margin on each side
        let imgHeight = imgWidth / canvasAspectRatio;

        if (imgHeight > pdfHeight - 20) {
            imgHeight = pdfHeight - 20;
            imgWidth = imgHeight * canvasAspectRatio;
        }

        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = 10;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
        pdf.save(`ProductionOrder-${order.id}.pdf`);
    } catch (e) {
        console.error('Error generating PDF', e);
        alert('Sorry, there was an error generating the PDF.');
    } finally {
        root.unmount();
        document.body.removeChild(printContainer);
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 inline-block mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Production Plan Dashboard
            </h1>
             {productionData && !isLoading && !error && (
                <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading && (
          <div className="flex justify-center items-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="ml-4 text-lg text-slate-600">Processing your Excel file...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        
        {productionData && !isLoading && !error && (
          <div className="space-y-8">
            {currentPage === 'dashboard' && (
              <>
                <FileUpload onFileSelect={handleFileChange} disabled={isLoading} />
                <AddOrderForm
                    onCalculate={handleCalculateFulfillment}
                    fulfillmentTime={fulfillmentTime}
                    isCalculating={isCalculating}
                    key={file ? file.name : 'add-order-form'}
                />
                {clientSummary && urgencySummary && (
                   <Dashboard clientData={clientSummary} urgencyData={urgencySummary} />
                )}
                <ProductionTable data={productionData} onDownload={handleDownloadPdf} />
              </>
            )}

            {currentPage === 'machineView' && (
                <>
                  {machineWorkload ? (
                    <ProductionFlow data={machineWorkload} />
                  ) : (
                    <div className="text-center mt-12 bg-white p-12 rounded-lg shadow-md border border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-700">Machine Workload Data Not Available</h2>
                        <p className="mt-2 text-slate-500">The uploaded file does not contain the necessary data to generate the machine workload overview.</p>
                    </div>
                  )}
                </>
            )}
          </div>
        )}

        {!productionData && !isLoading && !error && (
          <>
            <FileUpload onFileSelect={handleFileChange} disabled={isLoading} />
            <div className="text-center mt-12 bg-white p-12 rounded-lg shadow-md border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z" />
              </svg>
              <h2 className="mt-6 text-xl font-semibold text-slate-700">Upload a File to Get Started</h2>
              <p className="mt-2 text-slate-500">Your production schedule and insights will appear here.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// FIX: Add default export for App component
export default App;
