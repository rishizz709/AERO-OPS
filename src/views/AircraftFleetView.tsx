import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Aircraft } from '../types';
import {
  PlaneTakeoff,
  Search,
  Fuel,
  MapPin,
  RotateCw,
  Building2,
  Users,
  ShieldCheck
} from 'lucide-react';

export const AircraftFleetView: React.FC = () => {
  const { aircraft, flights } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');

  const airlines = [
    { code: 'AI', name: 'Air India', color: 'from-red-600 to-amber-600', flights: 14, gates: 'G03, G08, G09' },
    { code: '6E', name: 'IndiGo', color: 'from-blue-600 to-indigo-600', flights: 18, gates: 'G01, G02, G05, G11' },
    { code: 'QP', name: 'Akasa Air', color: 'from-orange-500 to-amber-500', flights: 6, gates: 'G04' },
    { code: 'UK', name: 'Vistara', color: 'from-purple-600 to-indigo-700', flights: 4, gates: 'G07' },
    { code: 'SG', name: 'SpiceJet', color: 'from-red-500 to-orange-600', flights: 5, gates: 'G12' }
  ];

  const filteredAircraft = aircraft.filter(ac => {
    if (selectedAirline !== 'ALL' && ac.airlineCode !== selectedAirline) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return ac.registration.toLowerCase().includes(q) || ac.model.toLowerCase().includes(q) || ac.airlineName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <PlaneTakeoff className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              AIRCRAFT FLEET & MULTI-AIRLINE OPERATOR MANAGEMENT
            </h1>
            <p className="text-xs text-slate-400">
              Coordinating multiple airline operators (Air India, IndiGo, Akasa, Vistara, SpiceJet) across airport slots
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">REGISTERED FLEET</span>
            <span className="text-white font-bold">{aircraft.length} Aircraft</span>
          </div>
        </div>
      </div>

      {/* Airlines Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {airlines.map(al => (
          <div
            key={al.code}
            onClick={() => setSelectedAirline(selectedAirline === al.code ? 'ALL' : al.code)}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              selectedAirline === al.code ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-400/40' : 'bg-[#0E1A38] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white font-mono">{al.code}</span>
              <span className="text-[10px] font-mono text-cyan-400">{al.flights} Flights</span>
            </div>
            <div className="text-xs font-bold text-slate-200 mt-1 truncate">{al.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Gates: {al.gates}</div>
          </div>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Airframe Inventory ({filteredAircraft.length})
        </h2>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tail (VT-ABC)..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAircraft.map(ac => {
          const isAI101 = ac.registration === 'VT-ABC';

          return (
            <div
              key={ac.registration}
              className={`p-4 rounded-2xl border transition shadow-xl space-y-3 ${
                isAI101 ? 'bg-[#0F1E42] border-cyan-500/60 ring-2 ring-cyan-500/30' : 'bg-[#0E1A38] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono">
                <div>
                  <span className="font-bold text-base text-white">{ac.registration}</span>
                  <div className="text-[10px] text-cyan-300 font-sans">{ac.airlineName}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ac.status === 'Turnaround' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                  ac.status === 'Maintenance' ? 'bg-red-950 text-red-300 border border-red-800' :
                  'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {ac.status}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-200">{ac.model}</div>
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Capacity: {ac.capacity} Seats</span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Fuel className="w-3.5 h-3.5" /> {ac.fuelLevelPercent}% Fuel
                  </span>
                </div>
              </div>

              {/* Assignment details */}
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Current Sector:</span>
                  <span className="font-bold text-white">{ac.currentFlightNo || 'On Ground Parking'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Next Departure:</span>
                  <span className="text-cyan-300">{ac.nextFlightNo || 'Unscheduled'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans">Location:</span>
                  <span className="text-emerald-400">{ac.currentLocation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
