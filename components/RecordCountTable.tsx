import React, { useState, useEffect } from 'react';
import { RecordCount } from '../types';
import { fetchRecordCounts } from '../services/recordService';
import { Server, Database, RefreshCw } from 'lucide-react';

const RecordCountTable: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<'107' | '125'>('107');
  const [data, setData] = useState<RecordCount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchRecordCounts(selectedServer);
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load record counts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedServer]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden shadow-xl mb-8">
      <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Registros por Hora</h2>
            <p className="text-xs text-slate-400">Cantidad de registros en la última hora</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
          <button
            onClick={() => setSelectedServer('107')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedServer === '107'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server size={14} />
            Servidor 107
          </button>
          <button
            onClick={() => setSelectedServer('125')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedServer === '125'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server size={14} />
            Servidor 125
          </button>
        </div>
        
        <div className="flex items-center gap-2">
            {lastUpdated && (
                <span className="text-xs text-slate-500 hidden md:inline">
                    {lastUpdated.toLocaleTimeString()}
                </span>
            )}
            <button 
                onClick={loadData}
                disabled={loading}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Account ID</th>
              <th className="p-4 font-semibold">Device ID</th>
              <th className="p-4 font-semibold text-right">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-sm">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Cargando datos...
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr 
                  key={`${item.accountID}-${item.deviceID}-${index}`}
                  className="hover:bg-slate-700/30 transition-colors group"
                >
                  <td className="p-4 font-medium text-slate-300 group-hover:text-white">
                    {item.accountID}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-xs">
                    {item.deviceID}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold border border-emerald-500/20">
                      {item.cantidad}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordCountTable;
