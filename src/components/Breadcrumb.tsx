import React from 'react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';
import { Home } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    page?: NavPage;
    active?: boolean;
  }>;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { setCurrentPage, setSelectedItemId } = useApp();

  const handleNavigate = (page?: NavPage) => {
    if (page) {
      setSelectedItemId(null);
      setCurrentPage(page);
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 bg-slate-100/70 rounded-lg text-xs font-medium text-slate-600 mb-6">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li className="flex items-center gap-1.5">
          <button
            onClick={() => handleNavigate('beranda')}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <span className="text-slate-400" aria-hidden="true">/</span>
            {item.active || !item.page ? (
              <span className="text-blue-800 font-semibold truncate max-w-xs sm:max-w-md">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => handleNavigate(item.page)}
                className="text-slate-600 hover:text-blue-700 transition-colors"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
