import React, { useState, useMemo, useEffect } from 'react';
import { ROUTES } from './constants';
import { RouteName, Unit } from './types';
import UnitTable from './components/UnitTable';
import RecordCountTable from './components/RecordCountTable';
import RouteSelector from './components/RouteSelector';
import AIStatus from './components/AIStatus';
import { LayoutDashboard, Satellite, RefreshCw } from 'lucide-react';
import { fetchAllUnits } from './services/api';

const App: React.FC = () => {
  // Use state to track selected route. Initially null (showing all, or could default to first)
  const [selectedRoute, setSelectedRoute] = useState<RouteName | null>('RUTA W');
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch data function
  const loadData = async () => {
    setLoading(true);
    try {
      const { units: fetchedUnits, timestamp } = await fetchAllUnits();
      setUnits(fetchedUnits);
      setLastUpdated(new Date(timestamp));
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and periodic refresh
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter units based on selection
  const filteredUnits = useMemo(() => {
    if (!selectedRoute) return units;
    return units.filter(unit => unit.route === selectedRoute);
  }, [selectedRoute, units]);

  // Calculate counts for badges
  const routeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ROUTES.forEach(r => counts[r] = 0);
    units.forEach(u => {
      if (counts[u.route] !== undefined) counts[u.route]++;
    });
    return counts;
  }, [units]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-brand-500 selection:text-white pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900/20 to-transparent pointer-events-none -z-10" />
      <div className="fixed top-[-10%] right-[-5%] w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <main className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
          <div className="w-[80%]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-600 rounded-lg shadow-lg shadow-brand-900/50">
                <Satellite className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                MONITOREO <span className="text-brand-500">VELSAT</span>
              </h1>
            </div>
            <p className="text-slate-400 flex items-center gap-2">
              <LayoutDashboard size={16} />
              Panel de Control de Unidades en Tiempo Real
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2b">
            <AIStatus units={filteredUnits} routeName={selectedRoute} />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Actualizado: {lastUpdated.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
              <button 
                onClick={loadData} 
                disabled={loading}
                className="p-1 hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </header>

        {/* Route Selectors */}
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <RouteSelector 
            selectedRoute={selectedRoute} 
            onSelectRoute={setSelectedRoute} 
            counts={routeCounts}
          />
        </section>

        {/* Status Bar / Filter Info */}
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-semibold text-white">
            {selectedRoute ? `Unidades de ${selectedRoute}` : 'Todas las Unidades'}
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            {filteredUnits.length} Resultados
          </span>
        </div>

        {/* Data Table */}
        <section className="animate-in slide-in-from-bottom-8 duration-700 delay-100">
          {loading && units.length === 0 ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <UnitTable units={filteredUnits} />
          )}
        </section>

        {/* Record Counts Table */}
        <section className="animate-in slide-in-from-bottom-8 duration-700 delay-200 mt-8">
          <RecordCountTable />
        </section>

      </main>
    </div>
  );
};

export default App;