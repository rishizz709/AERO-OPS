import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import {
  AlertTriangle,
  CloudLightning,
  Compass,
  Luggage,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Plane,
  DoorOpen,
  Users
} from 'lucide-react';

export const DisruptionManagementView: React.FC = () => {
  const { triggerDisruption, stats, flights, gates, baggage } = useAodb();

  const [activeScenario, setActiveScenario] = useState<'NONE' | 'WEATHER' | 'RUNWAY_CLOSURE' | 'BAGGAGE_JAM'>('NONE');

  const handleTrigger = (type: 'WEATHER' | 'RUNWAY_CLOSURE' | 'BAGGAGE_JAM') => {
    setActiveScenario(type);
    triggerDisruption(type);
  };

  const affectedFlights = flights.filter(f => f.status === 'Delayed' || f.delayMinutes > 15);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              AIRPORT DISRUPTION & CONTINGENCY MANAGEMENT
            </h1>
            <p className="text-xs text-slate-400">
              Crisis simulation engine: weather ground stops, runway FOD closures, and cascading resource impact analysis
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400 text-[10px] block">AIRFIELD DEFENSE LEVEL</span>
          <span className="text-cyan-400 font-bold">CONTINGENCY TIER 2</span>
        </div>
      </div>

      {/* Disruption Simulator Triggers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather Disruption */}
        <div className="p-4 bg-[#0E1A38] border border-slate-800 hover:border-red-500/50 rounded-2xl shadow-xl space-y-3 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-400">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Severe Thunderstorm</h3>
              <p className="text-[11px] text-slate-400">Low Visibility / RVR 350m</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Simulates monsoon microburst over RGIA Hyderabad. Triggers airfield ground stop, delays 10+ flights by 25m, and re-sequences arrivals.
          </p>
          <button
            onClick={() => handleTrigger('WEATHER')}
            className="w-full py-2 bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Simulate Weather Disruption</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Runway Closure */}
        <div className="p-4 bg-[#0E1A38] border border-slate-800 hover:border-amber-500/50 rounded-2xl shadow-xl space-y-3 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Runway 27 Closure</h3>
              <p className="text-[11px] text-slate-400">FOD Debris / Emergency Sweeper</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Closes Runway 27 for inspection. Shifts all landing traffic exclusively to Runway 09, extending airborne holding stacks by 15 mins.
          </p>
          <button
            onClick={() => handleTrigger('RUNWAY_CLOSURE')}
            className="w-full py-2 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Simulate Runway Closure</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Baggage Sorter Jam */}
        <div className="p-4 bg-[#0E1A38] border border-slate-800 hover:border-orange-500/50 rounded-2xl shadow-xl space-y-3 transition">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-950/60 border border-orange-500/40 rounded-xl text-orange-400">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">BHS Belt B2 Jam</h3>
              <p className="text-[11px] text-slate-400">Mechanical Diverter Lockup</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Simulates a mechanical luggage jam at Carousel B2. Puts Flight AI-101 baggage loading on hold and triggers exception alerts for ramp staff.
          </p>
          <button
            onClick={() => handleTrigger('BAGGAGE_JAM')}
            className="w-full py-2 bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 border border-orange-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>Simulate Baggage Sorter Jam</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cascading Impact Analysis Dashboard */}
      <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Operational Cascading Impact Matrix
          </h2>
          <span className="text-[11px] text-orange-400 font-mono">
            {affectedFlights.length} Flights Experiencing Cascading Delay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
            <Plane className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">DELAYED FLIGHTS</span>
              <span className="text-white font-bold text-base">{affectedFlights.length}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
            <DoorOpen className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">AFFECTED GATES</span>
              <span className="text-white font-bold text-base">G03, G06, G12</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
            <Users className="w-5 h-5 text-sky-400" />
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">IMPACTED PASSENGERS</span>
              <span className="text-white font-bold text-base">~620 Passengers</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-3">
            <Luggage className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">RE-ROUTED BAGGAGE</span>
              <span className="text-white font-bold text-base">142 Items (AI-101)</span>
            </div>
          </div>
        </div>

        {/* Recommended SOP Mitigation Actions */}
        <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-2 text-xs">
          <h3 className="font-bold text-white font-sans">Recommended AOCC Mitigation Standard Operating Procedures (SOP):</h3>
          <ul className="space-y-1 text-slate-300 font-sans list-disc list-inside">
            <li>Issue ATIS Broadcast to approaching flights advising single-runway operations on RWY 09.</li>
            <li>Extend Gate G03 occupancy buffer for AI-101 departure pushback.</li>
            <li>Deploy auxiliary tug tractors to Apron Stand S05 to accelerate container positioning.</li>
            <li>Send proactive SMS alerts to affected passengers in Terminal 1 Departure Lounge.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
