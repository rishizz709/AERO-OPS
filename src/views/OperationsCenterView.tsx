import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Flight } from '../types';
import {
  Activity,
  Plane,
  AlertTriangle,
  RotateCw,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Filter,
  Maximize2
} from 'lucide-react';

export const OperationsCenterView: React.FC = () => {
  const { flights, turnaroundAI101, alerts, incidents, stats, setActiveRoute, advanceTurnaroundStep } = useAodb();
  const [filterType, setFilterType] = useState<'ALL' | 'DEPARTURE' | 'ARRIVAL' | 'DELAYED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(flights.find(f => f.flightNo === 'AI-101') || flights[0]);

  const filteredFlights = flights.filter(f => {
    if (filterType === 'DEPARTURE' && f.type !== 'Departure') return false;
    if (filterType === 'ARRIVAL' && f.type !== 'Arrival') return false;
    if (filterType === 'DELAYED' && f.delayMinutes === 0) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return f.flightNo.toLowerCase().includes(q) || f.destinationCity.toLowerCase().includes(q) || f.aircraftReg.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusBadge = (status: Flight['status']) => {
    switch (status) {
      case 'Scheduled':
      case 'Landed':
      case 'Arrived':
      case 'Departed':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'Boarding':
      case 'Pushback':
      case 'Turnaround':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80 animate-pulse-slow';
      case 'Delayed':
        return 'bg-orange-950/80 text-orange-300 border-orange-800/80 font-bold';
      case 'Cancelled':
        return 'bg-red-950/80 text-red-300 border-red-800/80';
      default:
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
    }
  };

  return (
    <div className="space-y-4">
      {/* AOCC Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#0C1838] via-[#10204A] to-[#0C1838] border border-cyan-500/30 rounded-2xl shadow-xl shadow-cyan-950/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white font-display tracking-tight">
                AIRPORT OPERATIONS CENTER (AOCC / APOC)
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                SINGLE OPERATIONAL VIEW
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Centralized coordination of flights, aircraft, stands, gates, runways, turnaround, and baggage
            </p>
          </div>
        </div>

        {/* Quick KPI badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-lg">
            <span className="text-slate-400 text-[10px] block">ON-TIME RATE</span>
            <span className="text-emerald-400 font-bold text-sm">{stats.onTimePerformancePercent}%</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-lg">
            <span className="text-slate-400 text-[10px] block">AVG TURNAROUND</span>
            <span className="text-cyan-400 font-bold text-sm">{stats.averageTurnaroundMins}m</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-lg">
            <span className="text-slate-400 text-[10px] block">ACTIVE ALERTS</span>
            <span className="text-amber-400 font-bold text-sm">{alerts.length}</span>
          </div>
        </div>
      </div>

      {/* 3-Column AOCC Layout (Section 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Department Menu & Turnaround Quick Card (3 cols) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Featured Turnaround Monitor Preview (AI-101) */}
          <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Turnaround Monitor</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded font-mono text-[10px] font-bold">
                +{turnaroundAI101.totalDelayMinutes}m Late
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cyan-300 text-sm">{turnaroundAI101.flightNo}</span>
                <span className="text-slate-400">{turnaroundAI101.aircraftModel} ({turnaroundAI101.aircraftReg})</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span>Stand: <strong className="text-white">{turnaroundAI101.standId}</strong></span>
                <span>Gate: <strong className="text-white">{turnaroundAI101.gateId}</strong></span>
                <span>Progress: <strong className="text-cyan-400">{turnaroundAI101.overallProgress}%</strong></span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${turnaroundAI101.overallProgress}%` }}
                />
              </div>

              {/* Current active milestone */}
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800 flex items-center justify-between">
                <span>Current Stage:</span>
                <span className="font-bold text-amber-300 font-mono">
                  {turnaroundAI101.steps[turnaroundAI101.currentStepIndex]?.name || 'COMPLETED'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => advanceTurnaroundStep(turnaroundAI101.currentStepIndex)}
                className="flex-1 py-1.5 px-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>Advance Milestone</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveRoute('/turnaround')}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                title="Full Screen Turnaround Monitor"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Department Readiness Matrix */}
          <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Department Operations Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Air Traffic Control</span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 rounded">RWY 09 Active</span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Baggage Operations (BHS)</span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-amber-400 bg-amber-950/60 rounded">1 Exception (B5)</span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Ground Handling / Ramp</span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 rounded">6 Stands Active</span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Terminal Security (CISF)</span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-amber-400 bg-amber-950/60 rounded">S2 Queue 19m</span>
              </div>
              <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-300">Airfield Maintenance</span>
                <span className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded">G06 Under Maint</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Flight Operations Board (Section 5) (6 cols) */}
        <div className="xl:col-span-6 space-y-3">
          <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl shadow-xl space-y-3">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'ALL' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  All ({flights.length})
                </button>
                <button
                  onClick={() => setFilterType('DEPARTURE')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'DEPARTURE' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Departures
                </button>
                <button
                  onClick={() => setFilterType('ARRIVAL')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'ARRIVAL' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Arrivals
                </button>
                <button
                  onClick={() => setFilterType('DELAYED')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'DELAYED' ? 'bg-orange-600 text-white shadow-sm' : 'text-orange-400 hover:text-orange-300'}`}
                >
                  Delayed
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter board..."
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Flight Operations Table (Live Operational Board) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#081226] text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-2.5">Flight</th>
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Route</th>
                    <th className="py-2 px-2">Aircraft</th>
                    <th className="py-2 px-2">Stand</th>
                    <th className="py-2 px-2">Gate</th>
                    <th className="py-2 px-2">RWY</th>
                    <th className="py-2 px-2">STD/ETD</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredFlights.map(flight => (
                    <tr
                      key={flight.flightNo}
                      onClick={() => setSelectedFlight(flight)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition ${
                        selectedFlight?.flightNo === flight.flightNo ? 'bg-cyan-950/30 border-l-2 border-cyan-400' : ''
                      }`}
                    >
                      <td className="py-2 px-2.5">
                        <div className="font-bold text-white">{flight.flightNo}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{flight.airline}</div>
                      </td>
                      <td className="py-2 px-2 font-sans">
                        {flight.type === 'Departure' ? (
                          <span className="text-sky-400 flex items-center gap-0.5 text-[11px]">
                            <ArrowUpRight className="w-3 h-3" /> DEP
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-0.5 text-[11px]">
                            <ArrowDownLeft className="w-3 h-3" /> ARR
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        <span className="font-bold text-slate-200">{flight.origin}</span>
                        <span className="text-slate-500 mx-1">→</span>
                        <span className="font-bold text-cyan-300">{flight.destination}</span>
                      </td>
                      <td className="py-2 px-2 text-[11px] text-slate-400">
                        {flight.aircraftReg}
                      </td>
                      <td className="py-2 px-2 font-bold text-white">
                        {flight.standId}
                      </td>
                      <td className="py-2 px-2 font-bold text-cyan-300">
                        {flight.gateId}
                      </td>
                      <td className="py-2 px-2 text-slate-300 text-[11px]">
                        {flight.runwayId.replace('RWY ', '')}
                      </td>
                      <td className="py-2 px-2">
                        <div className="text-slate-300">{flight.std}</div>
                        {flight.delayMinutes > 0 ? (
                          <div className="text-orange-400 text-[10px]">+{flight.delayMinutes}m ({flight.etd})</div>
                        ) : (
                          <div className="text-emerald-400 text-[10px]">On Time</div>
                        )}
                      </td>
                      <td className="py-2 px-2 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(flight.status)}`}>
                          {flight.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFlight(flight);
                            setActiveRoute('/flights');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-sans"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Operational Alerts, Incidents, & Disruption Actions (3 cols) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Operational Alerts Card (Section 24) */}
          <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Operational Alerts
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px] font-mono">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {alerts.map(alert => (
                <div
                  key={alert.alertId}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    alert.severity === 'HIGH'
                      ? 'bg-red-950/30 border-red-800/60 text-red-200'
                      : alert.severity === 'MEDIUM'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-white">{alert.source}</span>
                    <span className="text-slate-400">{alert.time}</span>
                  </div>
                  <p className="font-sans text-xs leading-snug">{alert.description}</p>
                  <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Target: <strong className="text-white font-mono">{alert.affectedResource}</strong></span>
                    <span className="text-cyan-400">{alert.assignedDepartment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Incidents Feed (Section 23) */}
          <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Active Incidents Log
              </h3>
              <button
                onClick={() => setActiveRoute('/incidents')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {incidents.slice(0, 3).map(inc => (
                <div key={inc.incidentId} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono">{inc.incidentId}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      inc.severity === 'Critical' ? 'bg-red-950 text-red-300' :
                      inc.severity === 'High' ? 'bg-orange-950 text-orange-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">{inc.type} @ {inc.location}</div>
                  <div className="text-[10px] text-slate-400 truncate">{inc.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
