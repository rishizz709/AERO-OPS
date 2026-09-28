import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Stand, Gate, Runway, Flight } from '../types';
import {
  MapPin,
  Plane,
  DoorOpen,
  Compass,
  AlertTriangle,
  X,
  RotateCw,
  Layers,
  Info
} from 'lucide-react';

export const AirportMapView: React.FC = () => {
  const { stands, gates, runways, flights, updateFlightStatus, assignGate, turnaroundAI101 } = useAodb();

  const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [selectedRunway, setSelectedRunway] = useState<Runway | null>(null);

  const getStandFlight = (stand: Stand) => {
    return flights.find(f => f.standId === stand.standId && f.status !== 'Departed');
  };

  const getGateFlight = (gate: Gate) => {
    return flights.find(f => f.gateId === gate.gateNo && f.status !== 'Departed');
  };

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              HYDERABAD RGIA (HYD) - INTERACTIVE AIRFIELD & TERMINAL MAP
            </h1>
            <p className="text-xs text-slate-400">
              Real-time operational layout of Apron Stands (S01-S12), Gates (G01-G18), Runways (09/27/14), and Taxiways
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/80 inline-block" />
            <span className="text-slate-300">Available / Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/80 inline-block" />
            <span className="text-slate-300">Occupied / Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/80 inline-block" />
            <span className="text-slate-300">Turnaround / Boarding</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/80 inline-block" />
            <span className="text-slate-300">Maintenance / Closed</span>
          </div>
        </div>
      </div>

      {/* Main Airfield Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SVG Interactive Visual Airfield Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#091124] border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-500 absolute top-3 left-4">
            AIRFIELD GEOMETRY - RGIA HYDERABAD (SIMULATED AOCC VIEW)
          </div>

          {/* SVG Map Layout */}
          <div className="w-full aspect-[16/10] max-h-[580px] select-none">
            <svg viewBox="0 0 900 580" className="w-full h-full">
              {/* Background Grid */}
              <defs>
                <pattern id="airfield-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#14213d" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="runway-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>
              <rect width="900" height="580" fill="url(#airfield-grid)" />

              {/* RUNWAYS */}
              {/* Runway 09 / 27 (Main Runway) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => {
                  setSelectedRunway(runways.find(r => r.runwayId === 'RWY 09') || null);
                  setSelectedStand(null);
                  setSelectedGate(null);
                }}
              >
                <rect x="50" y="55" width="800" height="42" fill="url(#runway-grad)" stroke="#475569" strokeWidth="1.5" rx="4" />
                {/* Centerline Dashes */}
                <line x1="90" y1="76" x2="810" y2="76" stroke="#f8fafc" strokeWidth="2.5" strokeDasharray="25,18" />
                {/* Threshold Markings */}
                <text x="65" y="80" fill="#38bdf8" fontSize="16" fontWeight="bold" fontFamily="monospace">09</text>
                <text x="815" y="80" fill="#38bdf8" fontSize="16" fontWeight="bold" fontFamily="monospace">27</text>
                {/* Status Indicator Badge */}
                <rect x="390" y="62" width="120" height="26" rx="4" fill="#0f172a" stroke="#00f0ff" strokeWidth="1" />
                <text x="450" y="79" fill="#00f0ff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  RWY 09/27 (DEP: AI-101)
                </text>
              </g>

              {/* Runway 14 / 32 (Crosswind Runway) */}
              <g
                className="cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => {
                  setSelectedRunway(runways.find(r => r.runwayId === 'RWY 14') || null);
                  setSelectedStand(null);
                  setSelectedGate(null);
                }}
              >
                <path d="M 120 480 L 460 140" stroke="#334155" strokeWidth="32" strokeLinecap="round" />
                <path d="M 130 470 L 450 150" stroke="#f8fafc" strokeWidth="2" strokeDasharray="20,15" />
                <text x="100" y="505" fill="#94a3b8" fontSize="14" fontWeight="bold" fontFamily="monospace">14</text>
                <text x="470" y="145" fill="#94a3b8" fontSize="14" fontWeight="bold" fontFamily="monospace">32</text>
                <text x="280" y="325" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">RWY 14 (STANDBY)</text>
              </g>

              {/* TAXIWAYS (Alpha & Bravo) */}
              <path d="M 60 130 L 840 130" stroke="#eab308" strokeWidth="5" fill="none" opacity="0.75" />
              <text x="850" y="134" fill="#eab308" fontSize="12" fontWeight="bold" fontFamily="monospace">TWY ALPHA</text>

              <path d="M 160 130 L 160 190" stroke="#eab308" strokeWidth="4" fill="none" opacity="0.75" />
              <path d="M 450 130 L 450 190" stroke="#eab308" strokeWidth="4" fill="none" opacity="0.75" />
              <path d="M 740 130 L 740 190" stroke="#eab308" strokeWidth="4" fill="none" opacity="0.75" />

              {/* TERMINAL 1 & APRON */}
              <rect x="60" y="320" width="370" height="150" fill="#111d3b" stroke="#3b82f6" strokeWidth="2" rx="8" />
              <text x="80" y="345" fill="#60a5fa" fontSize="14" fontWeight="bold">TERMINAL 1 (DOMESTIC)</text>
              <text x="80" y="365" fill="#94a3b8" fontSize="11">Air India, IndiGo, Akasa Air</text>

              {/* T1 GATES G01 to G06 */}
              <g>
                {gates.filter(g => g.terminal === 'T1').slice(0, 6).map((gate, i) => {
                  const x = 75 + i * 58;
                  const y = 300;
                  const isBoarding = gate.status === 'Boarding';
                  const isOccupied = gate.status === 'Occupied';
                  const isMaint = gate.status === 'Maintenance';
                  const strokeColor = isMaint ? '#ef4444' : isBoarding ? '#f59e0b' : isOccupied ? '#3b82f6' : '#10b981';

                  return (
                    <g
                      key={gate.gateNo}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => { setSelectedGate(gate); setSelectedStand(null); setSelectedRunway(null); }}
                    >
                      {/* Gate Box */}
                      <rect x={x} y={y} width="50" height="28" rx="4" fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
                      <text x={x + 25} y={y + 14} fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {gate.gateNo}
                      </text>
                      <text x={x + 25} y={y + 24} fill={strokeColor} fontSize="8" textAnchor="middle" fontFamily="monospace">
                        {gate.status.slice(0, 5)}
                      </text>
                      {/* Jetbridge line */}
                      <line x1={x + 25} y1={y} x2={x + 25} y2={y - 25} stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />
                    </g>
                  );
                })}
              </g>

              {/* T1 APRON STANDS (S01 to S06) */}
              <g>
                {stands.filter(s => s.terminal === 'T1').slice(0, 6).map((stand, i) => {
                  const x = 75 + i * 58;
                  const y = 230;
                  const flight = getStandFlight(stand);
                  const isAI101 = stand.standId === 'S05';
                  const isOccupied = stand.status === 'Occupied';
                  const isMaint = stand.status === 'Maintenance';

                  const fillColor = isMaint ? '#7f1d1d' : isAI101 ? '#78350f' : isOccupied ? '#1e3a8a' : '#064e3b';
                  const strokeColor = isMaint ? '#ef4444' : isAI101 ? '#f59e0b' : isOccupied ? '#60a5fa' : '#34d399';

                  return (
                    <g
                      key={stand.standId}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => { setSelectedStand(stand); setSelectedGate(null); setSelectedRunway(null); }}
                    >
                      <circle cx={x + 25} cy={y + 20} r="22" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
                      <text x={x + 25} y={y + 18} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {stand.standId}
                      </text>
                      <text x={x + 25} y={y + 29} fill="#cbd5e1" fontSize="8" textAnchor="middle" fontFamily="monospace">
                        {flight ? flight.flightNo : 'FREE'}
                      </text>

                      {/* Aircraft icon representation */}
                      {isOccupied && (
                        <path
                          d={`M ${x + 25} ${y + 5} l -5 8 l 4 0 l 0 10 l -4 3 l 0 2 l 5 -1 l 5 1 l 0 -2 l -4 -3 l 0 -10 l 4 0 z`}
                          fill={isAI101 ? '#fbbf24' : '#93c5fd'}
                          opacity="0.9"
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* TERMINAL 2 & APRON (INTERNATIONAL) */}
              <rect x="470" y="320" width="370" height="150" fill="#111d3b" stroke="#8b5cf6" strokeWidth="2" rx="8" />
              <text x="490" y="345" fill="#a78bfa" fontSize="14" fontWeight="bold">TERMINAL 2 (INTERNATIONAL / WIDEBODY)</text>
              <text x="490" y="365" fill="#94a3b8" fontSize="11">Air India Long-haul, Emirates, Vistara</text>

              {/* T2 GATES G09 to G12 */}
              <g>
                {gates.filter(g => g.terminal === 'T2').slice(0, 4).map((gate, i) => {
                  const x = 500 + i * 85;
                  const y = 300;
                  const isOccupied = gate.status === 'Occupied';
                  const strokeColor = isOccupied ? '#8b5cf6' : '#10b981';

                  return (
                    <g
                      key={gate.gateNo}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => { setSelectedGate(gate); setSelectedStand(null); setSelectedRunway(null); }}
                    >
                      <rect x={x} y={y} width="65" height="28" rx="4" fill="#0f172a" stroke={strokeColor} strokeWidth="1.5" />
                      <text x={x + 32} y={y + 14} fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {gate.gateNo}
                      </text>
                      <text x={x + 32} y={y + 24} fill={strokeColor} fontSize="8" textAnchor="middle" fontFamily="monospace">
                        {gate.status.slice(0, 6)}
                      </text>
                      <line x1={x + 32} y1={y} x2={x + 32} y2={y - 25} stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />
                    </g>
                  );
                })}
              </g>

              {/* T2 APRON STANDS (S09 to S12 Widebody) */}
              <g>
                {stands.filter(s => s.terminal === 'T2').map((stand, i) => {
                  const x = 500 + i * 85;
                  const y = 230;
                  const flight = getStandFlight(stand);
                  const isOccupied = stand.status === 'Occupied';
                  const strokeColor = isOccupied ? '#c084fc' : '#34d399';
                  const fillColor = isOccupied ? '#3b0764' : '#064e3b';

                  return (
                    <g
                      key={stand.standId}
                      className="cursor-pointer hover:opacity-90"
                      onClick={() => { setSelectedStand(stand); setSelectedGate(null); setSelectedRunway(null); }}
                    >
                      <circle cx={x + 32} cy={y + 20} r="25" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
                      <text x={x + 32} y={y + 18} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {stand.standId}
                      </text>
                      <text x={x + 32} y={y + 30} fill="#cbd5e1" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        {flight ? flight.flightNo : 'FREE'}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* BAGGAGE SORTING & GROUND SERVICES AREA */}
              <rect x="220" y="495" width="460" height="55" fill="#0d1b2a" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4,4" rx="6" />
              <text x="450" y="525" fill="#00f0ff" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                CENTRAL BAGGAGE SORTING FACILITY & TUG HIGHWAY (BHS)
              </text>
              <text x="450" y="540" fill="#94a3b8" fontSize="10" textAnchor="middle">
                Make-up Belts B1, B2 (AI-101), B3, B4, B5 (Exception Cell)
              </text>
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Details Inspection Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Stand / Gate / Runway Inspector */}
          {selectedStand ? (
            <div className="p-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-300">
                    {selectedStand.standId}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Stand {selectedStand.standId} ({selectedStand.terminal})</h3>
                    <p className="text-[11px] text-slate-400">Apron Parking & Ground Handling</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStand(null)} className="p-1 hover:bg-slate-800 rounded">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Compatibility:</span>
                  <span className="font-bold text-cyan-300">{selectedStand.type} Aircraft</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Jetbridge Gate:</span>
                  <span className="font-bold text-white font-mono">Gate {selectedStand.gateConnection}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    {selectedStand.status}
                  </span>
                </div>

                {selectedStand.currentAircraftReg && (
                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Parked Aircraft</div>
                    <div className="font-bold text-white text-sm font-mono">{selectedStand.currentAircraftReg}</div>
                    <div className="text-slate-300 text-xs">Flight: <strong className="text-cyan-300">{selectedStand.currentFlightNo}</strong></div>
                    {selectedStand.standId === 'S05' && (
                      <div className="text-[11px] text-amber-300 flex items-center gap-1 mt-1">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        Turnaround Progress: {turnaroundAI101.overallProgress}% (+18m delay)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : selectedGate ? (
            <div className="p-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-300">
                    {selectedGate.gateNo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Gate {selectedGate.gateNo} ({selectedGate.terminal})</h3>
                    <p className="text-[11px] text-slate-400">Boarding Lounge & Aerobridge</p>
                  </div>
                </div>
                <button onClick={() => setSelectedGate(null)} className="p-1 hover:bg-slate-800 rounded">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    {selectedGate.status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400">Current Assigned Flight:</span>
                  <span className="font-bold text-white font-mono">{selectedGate.currentFlightNo || 'None'}</span>
                </div>
                {selectedGate.boardingTime && (
                  <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                    <span className="text-slate-400">Boarding Schedule:</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedGate.boardingTime}</span>
                  </div>
                )}
              </div>
            </div>
          ) : selectedRunway ? (
            <div className="p-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-indigo-300">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedRunway.runwayId}</h3>
                    <p className="text-[11px] text-slate-400">Air Traffic Control Active Strip</p>
                  </div>
                </div>
                <button onClick={() => setSelectedRunway(null)} className="p-1 hover:bg-slate-800 rounded">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400 font-sans">Status:</span>
                  <span className="text-emerald-400 font-bold">{selectedRunway.status}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400 font-sans">Length:</span>
                  <span className="text-white">{selectedRunway.lengthMeters} meters</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400 font-sans">ILS Category:</span>
                  <span className="text-cyan-300">{selectedRunway.ilsCategory}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg">
                  <span className="text-slate-400 font-sans">Current Assignment:</span>
                  <span className="text-amber-300">{selectedRunway.assignedFlightNo || 'IDLE'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#0E1A38] border border-slate-800 rounded-2xl text-center space-y-3">
              <Info className="w-8 h-8 text-cyan-400 mx-auto opacity-75" />
              <h3 className="font-bold text-white text-sm">Airfield Node Inspector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any Apron Stand (S01-S12), Boarding Gate (G01-G18), or Runway (09/27) on the map to inspect live aircraft assignments, compatibility, and turnaround progress.
              </p>
            </div>
          )}

          {/* Quick Stand Overview List */}
          <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Apron Stand Allocation</span>
              <span className="text-cyan-400 font-mono">12 Total</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {stands.slice(0, 8).map(stand => (
                <div
                  key={stand.standId}
                  onClick={() => { setSelectedStand(stand); setSelectedGate(null); setSelectedRunway(null); }}
                  className={`p-2 rounded-lg border cursor-pointer transition ${
                    stand.standId === 'S05'
                      ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
                      : stand.status === 'Occupied'
                      ? 'bg-blue-950/30 border-blue-800 text-blue-200'
                      : stand.status === 'Maintenance'
                      ? 'bg-red-950/30 border-red-800 text-red-300'
                      : 'bg-slate-900/60 border-slate-800 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{stand.standId}</span>
                    <span className="text-[10px] text-slate-400">{stand.type.slice(0, 4)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {stand.currentFlightNo || 'AVAILABLE'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
