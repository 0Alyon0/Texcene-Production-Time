
import React from 'react';

interface NavigationProps {
  currentPage: 'dashboard' | 'machineView';
  setCurrentPage: (page: 'dashboard' | 'machineView') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const activeClasses = 'border-indigo-600 text-indigo-600';
  const inactiveClasses = 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300';

  return (
    <nav className="flex space-x-4" aria-label="Main navigation">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-t-sm ${currentPage === 'dashboard' ? activeClasses : inactiveClasses}`}
        aria-current={currentPage === 'dashboard' ? 'page' : undefined}
      >
        Dashboard
      </button>
      <button
        onClick={() => setCurrentPage('machineView')}
        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-t-sm ${currentPage === 'machineView' ? activeClasses : inactiveClasses}`}
        aria-current={currentPage === 'machineView' ? 'page' : undefined}
      >
        Machine Workload
      </button>
    </nav>
  );
};
