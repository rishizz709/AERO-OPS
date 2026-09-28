import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { TerminalAreaFlow } from '../types';
import {
  Gauge,
  Users,
  Clock,
  ShieldCheck,
  DoorOpen,
  Luggage,
  AlertTriangle,
  Plus,
  Minus
} from 'lucide-react';

export const TerminalOperationsView: React.FC = () => {
  const { terminalFlow } = useAodb();
  const [flows, setFlows] = useState<TerminalAreaFlow[]>(terminalFlow);

  const toggleCounter = (areaId: string, delta: number) => {
    setFlows(prev => prev.map(item => {
      if (item.areaId === areaId) {
        const newOpen = Math.min(item.totalCounters, Math.max(1, item.openCounters + delta));
        const newWait = Math.max(2, Math.round(item.currentQueue / (newOpen * 2.5)));
        const newStatus = item.currentQueue / item.capacity > 0.8 ? 'HIGH QUEUE' : item.currentQueue / item.capacity > 0.5 ? 'MODERATE' : 'NORMAL';
        return {
          ...item,
          openCounters: newOpen,
          estimatedWaitMinutes: newWait,
          status: newStatus as any
        };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              TERMINAL PASSENGER FLOW & QUEUE MONITOR
            </h1>
            <p className="text-xs text-slate-400">
              Live monitoring of check-in halls, CISF security checkpoints, immigration, and carousel bottlenecks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">CRITICAL QUEUES</span>
            <span className="text-amber-400 font-bold">1 Checkpoint (S2)</span>
          </div>
        </div>
      </div>

      {/* Terminal Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flows.map(area => {
          const occupancyPercent = Math.round((area.currentQueue / area.capacity) * 100);
          const isHigh = area.status === 'HIGH QUEUE' || area.status === 'CRITICAL';

          return (
            <div
              key={area.areaId}
              className={`p-4 rounded-2xl border transition shadow-xl space-y-3 ${
                isHigh ? 'bg-amber-950/30 border-amber-600/70' : 'bg-[#0E1A38] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">{area.areaName}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Terminal {area.terminal} • {area.type}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {area.status}
                </span>
              </div>

              {/* People count & Wait time */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400 text-[10px] block font-sans">CURRENT QUEUE</span>
                  <span className="text-white font-bold text-base">{area.currentQueue}</span>
                  <span className="text-slate-500 text-[10px]"> / {area.capacity} cap</span>
                </div>

                <div className="p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400 text-[10px] block font-sans">ESTIMATED WAIT</span>
                  <span className={`font-bold text-base ${area.estimatedWaitMinutes > 15 ? 'text-orange-400' : 'text-emerald-400'}`}>
                    {area.estimatedWaitMinutes} min
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Capacity Utilization</span>
                  <span>{occupancyPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      occupancyPercent > 80 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Open Counters / Lanes Control */}
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-sans">Lanes / Counters:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCounter(area.areaId, -1)}
                    disabled={area.openCounters <= 1}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="text-cyan-300 font-bold px-1">{area.openCounters} of {area.totalCounters}</span>
                  <button
                    onClick={() => toggleCounter(area.areaId, 1)}
                    disabled={area.openCounters >= area.totalCounters}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
