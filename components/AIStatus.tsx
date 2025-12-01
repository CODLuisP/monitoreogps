import React, { useState } from 'react';
import { Unit } from '../types';
import { Sparkles, X, AlertOctagon, Bot } from 'lucide-react';

interface AIStatusProps {
  units: Unit[];
  routeName: string | null;
}

const AIStatus: React.FC<AIStatusProps> = ({ units, routeName }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; alerts: string[] } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const analyzeFleetLocally = (units: Unit[], routeName: string | null) => {
    // Usar los valores exactos del tipo Unit
    const activeUnits = units.filter(u => u.status === 'moving');
    const inactiveUnits = units.filter(u => u.status === 'stopped');
    const offlineUnits = units.filter(u => u.status === 'offline');
    
    // Generar resumen
    const totalUnits = units.length;
    const activePercentage = totalUnits > 0 ? ((activeUnits.length / totalUnits) * 100).toFixed(0) : '0';
    
    let summary = `Análisis de ${totalUnits} unidades${routeName ? ` en la ruta ${routeName}` : ''}: `;
    summary += `${activeUnits.length} en movimiento (${activePercentage}%), `;
    summary += `${inactiveUnits.length} detenidas, `;
    summary += `${offlineUnits.length} fuera de línea. `;
    
    if (parseInt(activePercentage) >= 80) {
      summary += 'La flota está operando en condiciones óptimas.';
    } else if (parseInt(activePercentage) >= 60) {
      summary += 'La flota tiene rendimiento aceptable, pero requiere atención.';
    } else {
      summary += 'Se detectan problemas operativos significativos en la flota.';
    }

    // Generar alertas
    const alerts: string[] = [];
    
    if (offlineUnits.length > totalUnits * 0.3) {
      alerts.push(`Alto número de unidades fuera de línea: ${offlineUnits.length} (${((offlineUnits.length/totalUnits)*100).toFixed(0)}%)`);
    }
    
    if (inactiveUnits.length > totalUnits * 0.5) {
      alerts.push(`Más del 50% de unidades detenidas: ${inactiveUnits.length} unidades sin movimiento`);
    }
    
    offlineUnits.slice(0, 3).forEach(unit => {
      alerts.push(`Unidad ${unit.id} fuera de línea - Requiere verificación de conectividad`);
    });

    if (activeUnits.length === 0 && totalUnits > 0) {
      alerts.push('CRÍTICO: Ninguna unidad en movimiento actualmente');
    }

    // Detectar unidades "quedadas" (sin reporte por más de 3 horas)
    const threeHoursAgo = Date.now() / 1000 - (3 * 60 * 60);
    const stuckUnits = units.filter(u => {
      const timestamp = parseInt(u.lastGPSTimestamp);
      return !isNaN(timestamp) && timestamp < threeHoursAgo;
    });

    if (stuckUnits.length > 0) {
      alerts.push(`UNIDADES QUEDADAS (>3h sin reporte): ${stuckUnits.map(u => u.plate).join(', ')}`);
    }

    return { summary, alerts };
  };

  const handleAnalyze = async () => {
    setIsOpen(true);
    setLoading(true);
    setResult(null);
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = analyzeFleetLocally(units, routeName);
    setResult(data);
    setLoading(false);
  };

  if (!isOpen && !loading) {
    return (
      <button 
        onClick={handleAnalyze}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-full text-center justify-center shadow-lg shadow-purple-900/50 transition-all transform hover:scale-105 font-medium text-sm w-[350px] mb-2"
      >
        <Sparkles size={16} />
        <span>Analizar unidades sin reportar (+3h)</span>
      </button>
    );
  }

  return (
<div className="relative w-[100%]">
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl md:min-w-[350px] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Bot size={20} />
            <h3 className="font-bold text-white">Análisis de Unidades</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="py-4 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs animate-pulse">Analizando telemetría en tiempo real...</p>
          </div>
        ) : result ? (
          <div className="space-y-3">
            <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-purple-500 pl-3">
              {result.summary}
            </p>
            {result.alerts.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Alertas Detectadas:</p>
                <ul className="space-y-1">
                  {result.alerts.map((alert, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-red-300 bg-red-900/20 p-2 rounded">
                      <AlertOctagon size={12} className="mt-0.5 shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AIStatus;