
import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div>
            <h2 className="text-xl font-semibold text-slate-700">Upload Production Data</h2>
            <p className="text-slate-500 mt-1">Select an Excel file (.xlsx) to begin analysis.</p>
        </div>
        <div className="mt-4 sm:mt-0">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls"
                disabled={disabled}
            />
            <button
                onClick={handleClick}
                disabled={disabled}
                className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload File</span>
            </button>
        </div>
      </div>
    </div>
  );
};
