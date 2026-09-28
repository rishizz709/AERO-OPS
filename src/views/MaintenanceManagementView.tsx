import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { MaintenanceAsset } from '../types';
import {
  Wrench,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Calendar
} from 'lucide-react';

export const MaintenanceManagementView: React.FC = () => {
  const { maintenance } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredAssets = maintenance.filter(asset => {
    if (filterType !== 'ALL' && asset.type !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return asset.name.toLowerCase().includes(q) || asset.assetId.toLowerCase().includes(q) || asset.assignedTechnician.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              AIRPORT ASSET & PREVENTIVE MAINTENANCE SYSTEM
            </h1>
            <p className="text-xs text-slate-400">
              Lifecycle monitoring for Passenger Boarding Bridges, ILS Cat-III arrays, BHS Carousels, and GPU units
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">CRITICAL ASSETS</span>
            <span className="text-emerald-400 font-bold">5 Monitored</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'Boarding Bridge', 'Ground Equipment', 'Runway', 'Baggage Belt', 'Check-in Counter'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filterType === t ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => {
          const isUnderMaint = asset.status === 'Under Maintenance';
          const isDue = asset.status === 'Maintenance Due';

          return (
            <div
              key={asset.assetId}
              className={`p-4 rounded-2xl border transition shadow-xl space-y-3 ${
                isUnderMaint ? 'bg-red-950/25 border-red-700/70' :
                isDue ? 'bg-amber-950/25 border-amber-700/70' :
                'bg-[#0E1A38] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono">
                <div>
                  <span className="font-bold text-white text-sm">{asset.assetId}</span>
                  <div className="text-[10px] text-cyan-300 font-sans">{asset.type}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isUnderMaint ? 'bg-red-950 text-red-300 border border-red-800' :
                  isDue ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {asset.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs">{asset.name}</h4>
                <p className="text-[11px] text-slate-400">Location: {asset.location}</p>
              </div>

              {/* Health Score */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Asset Health Index</span>
                  <span className="font-bold text-white">{asset.healthPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      asset.healthPercent > 80 ? 'bg-emerald-500' : asset.healthPercent > 65 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${asset.healthPercent}%` }}
                  />
                </div>
              </div>

              {/* Maintenance Schedule Details */}
              <div className="space-y-1 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-sans">Last Service:</span>
                  <span>{asset.lastMaintenance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-sans">Next Service Due:</span>
                  <span className="text-cyan-300">{asset.nextMaintenance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-sans">Assigned Tech:</span>
                  <span className="text-white">{asset.assignedTechnician}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
