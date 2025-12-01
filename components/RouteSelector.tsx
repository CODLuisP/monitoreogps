import React from 'react';
import { RouteName } from '../types';
import { ROUTES } from '../constants';
import { Bus } from 'lucide-react';

interface RouteSelectorProps {
  selectedRoute: RouteName | null;
  onSelectRoute: (route: RouteName | null) => void;
  counts: Record<string, number>;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({ selectedRoute, onSelectRoute, counts }) => {
  return (
    <div className="w-full mb-8">
      <h2 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">Seleccione una Ruta:</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROUTES.map((route) => {
          const isSelected = selectedRoute === route;
          const count = counts[route] || 0;

          return (
            <button
              key={route}
              onClick={() => onSelectRoute(route === selectedRoute ? null : route)}
              className={`
                relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300 overflow-hidden group
                ${isSelected 
                  ? 'bg-gradient-to-br from-brand-600 to-brand-700 border-brand-500 shadow-[0_0_25px_rgba(234,88,12,0.4)] scale-[1.02]' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'
                }
              `}
            >
              {/* Background Glow Effect for selected */}
              {isSelected && <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />}

              <div className="flex flex-col items-start z-10">
                <span className={`text-xs font-bold tracking-wider mb-1 ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>
                  EMPRESA
                </span>
                <span className={`text-xl font-black uppercase ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {route}
                </span>
              </div>

              <div className={`
                absolute top-8 right-2 flex items-center justify-center  w-10 h-10 rounded-full z-10 transition-colors
                ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-900/50 text-slate-500'}
              `}>
                <Bus size={20} />
              </div>

              {/* Counter Badge */}
              <div className={`
                absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full
                ${isSelected ? 'bg-white text-brand-700' : 'bg-slate-700 text-slate-300'}
              `}>
                {count} {count === 1 ? 'unidad' : 'unidades'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RouteSelector;