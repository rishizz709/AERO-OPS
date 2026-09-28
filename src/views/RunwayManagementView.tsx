import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Runway, Flight } from '../types';
import {
  Compass,
  PlaneTakeoff,
  PlaneLanding,
  Clock,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCw
} from 'lucide-react';

export const RunwayManagementView: React.FC = () => {
  const { runways, flights, assignRunway, updateFlightStatus } = useAodb();
  const [selectedRunway, setSelectedRunway] = useState<Runway | null>(runways[0]);

  // Runway Slot Timelines
  const runwayTimeline = [
    { time: '14:20', runway: 'RWY 27', flight: 'AI-101', type: 'Arrival', status: 'Completed' },
    { time: '14:35', runway: 'RWY 27', flight: '6E-204', type: 'Arrival', status: 'Landing Now' },
    { time: '14:50', runway: 'RWY 09', flight: 'QP-1102', type: 'Departure', status: 'Cleared' },
    { time: '15:15', runway: 'RWY 09', flight: '6E-512', type: 'Departure', status: 'Scheduled' },
    { time: '15:40', runway: 'RWY 09', flight: 'AI-101', type: 'Departure', status: 'Slot Reserved' },
    { time: '16:05', runway: 'RWY 09', flight: 'SG-441', type: 'Departure', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              AIR TRAFFIC CONTROL - RUNWAY MANAGEMENT & SEQUENCING
            </h1>
            <p className="text-xs text-slate-400">
              Active runway operational strips, CAT-III ILS instrumentation, and departure/arrival slots
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-slate-300">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span>MET: 090° / 08 Kts (QNH 1012 hPa)</span>
          </div>
        </div>
      </div>

      {/* Runway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {runways.map(runway => {
          const isSelected = selectedRunway?.runwayId === runway.runwayId;
          const isOccupied = runway.status === 'OCCUPIED';
          const isMaint = runway.status === 'MAINTENANCE';

          return (
            <div
              key={runway.runwayId}
              onClick={() => setSelectedRunway(runway)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all shadow-xl space-y-3 ${
                isMaint ? 'bg-red-950/30 border-red-800 text-red-200' :
                isOccupied ? 'bg-amber-950/40 border-amber-500/80 text-amber-200' :
                'bg-[#0E1A38] border-slate-800 hover:border-cyan-500/50 text-slate-200'
              } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="font-mono font-bold text-lg text-white">{runway.runwayId}</span>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                  isMaint ? 'bg-red-950 text-red-300 border border-red-800' :
                  isOccupied ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {runway.status}
                </span>
              </div>

              {/* Strip Details */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Active Operation:</span>
                  <span className="font-bold text-cyan-300">{runway.currentOperation || 'IDLE'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Assigned Flight:</span>
                  <span className="font-bold text-white">{runway.assignedFlightNo || 'None'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Length:</span>
                  <span className="text-slate-300">{runway.lengthMeters} m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">ILS Approach:</span>
                  <span className="text-emerald-400">{runway.ilsCategory}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Runway Timeline Schedule Slots */}
      <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Runway Slot Sequencing Schedule (ATC Departure & Arrival Queues)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Slot Separation: 120s</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#081226] text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Slot Time</th>
                <th className="py-2.5 px-3">Runway</th>
                <th className="py-2.5 px-3">Flight</th>
                <th className="py-2.5 px-3">Operation</th>
                <th className="py-2.5 px-3">ATC Clearance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {runwayTimeline.map((slot, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{slot.time}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{slot.runway}</td>
                  <td className="py-2.5 px-3 text-white">{slot.flight}</td>
                  <td className="py-2.5 px-3">
                    {slot.type === 'Departure' ? (
                      <span className="text-sky-400 flex items-center gap-1">
                        <PlaneTakeoff className="w-3.5 h-3.5" /> Departure
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <PlaneLanding className="w-3.5 h-3.5" /> Arrival
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      slot.status === 'Completed' ? 'bg-slate-800 text-slate-400' :
                      slot.status === 'Landing Now' ? 'bg-amber-950 text-amber-300 animate-pulse' :
                      slot.status === 'Cleared' ? 'bg-emerald-950 text-emerald-300' :
                      'bg-cyan-950 text-cyan-300'
                    }`}>
                      {slot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
