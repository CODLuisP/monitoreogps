import React from 'react';
import { Unit } from '../types';
import { MapPin, Navigation, Clock, Activity, AlertTriangle } from 'lucide-react';

interface UnitTableProps {
  units: Unit[];
}

const UnitTable: React.FC<UnitTableProps> = ({ units }) => {
  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <Navigation className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No hay unidades activas en esta ruta.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-300 uppercase text-xs tracking-wider font-semibold">
              <th className="p-5">Unidad / Placa</th>
              <th className="p-5">Último Reporte</th>
              <th className="p-5">Velocidad</th>
              <th className="p-5 hidden md:table-cell">Latitud</th>
              <th className="p-5 hidden md:table-cell">Longitud</th>
              <th className="p-5">Dirección</th>
              <th className="p-5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {units.map((unit) => (
              <tr 
                key={unit.id} 
                className="group hover:bg-slate-700/30 transition-colors duration-200"
              >
                {/* Unit/Plate */}
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${
                      unit.status === 'moving' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                      unit.status === 'stopped' ? 'bg-amber-500' : 'bg-slate-600'
                    }`}></div>
                    <div>
                      <div className="font-bold text-white text-base">{unit.plate}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Activity size={10} />
                        {unit.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Last Report */}
                <td className="p-5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={14} className="text-brand-500" />
                    <span className="text-sm font-medium">{unit.lastReport}</span>
                  </div>
                </td>

                {/* Speed */}
                <td className="p-5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    unit.speed > 60 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : unit.speed > 0 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {unit.speed > 60 && <AlertTriangle size={12} className="mr-1" />}
                    {unit.speed} Km/h
                  </span>
                </td>

                {/* Coords (Hidden on mobile) */}
                <td className="p-5 text-sm text-slate-400 hidden md:table-cell font-mono">{unit.lat.toFixed(6)}</td>
                <td className="p-5 text-sm text-slate-400 hidden md:table-cell font-mono">{unit.lng.toFixed(6)}</td>

                {/* Address */}
                <td className="p-5">
                  <div className="max-w-[200px] truncate text-sm text-slate-300" title={unit.address}>
                    {unit.address}
                  </div>
                </td>

                {/* Action Button */}
                <td className="p-5 text-center">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${unit.lat},${unit.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/50 transition-all hover:scale-105 active:scale-95 group-hover:shadow-brand-500/20"
                    title="Ver en Google Maps"
                  >
                    <MapPin size={18} />
                    <span className="ml-2 text-sm font-semibold hidden lg:inline">Mapa</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitTable;