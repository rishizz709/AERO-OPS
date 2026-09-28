import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Stand, Gate, Flight } from '../types';
import {
  DoorOpen,
  ParkingSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Plane,
  X,
  ShieldAlert
} from 'lucide-react';

export const GateStandManagementView: React.FC = () => {
  const { stands, gates, flights, assignGate, assignStand } = useAodb();

  const [activeTab, setActiveTab] = useState<'STANDS' | 'GATES'>('STANDS');
  const [selectedStand, setSelectedStand] = useState<Stand | null>(stands[4]); // S05 default
  const [selectedGate, setSelectedGate] = useState<Gate | null>(gates[2]); // G03 default

  // Reassignment modal
  const [reassignFlightNo, setReassignFlightNo] = useState('AI-101');

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <ParkingSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              STAND (APRON) & GATE ALLOCATION MANAGEMENT
            </h1>
            <p className="text-xs text-slate-400">
              Aircraft parking compatibility, jetbridge assignments, and conflict avoidance engine
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('STANDS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'STANDS' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Apron Stands (12)
          </button>
          <button
            onClick={() => setActiveTab('GATES')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'GATES' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Boarding Gates (18)
          </button>
        </div>
      </div>

      {activeTab === 'STANDS' ? (
        /* Apron Stand Management (Section 9) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Stands Grid (8 cols) */}
          <div className="lg:col-span-8 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Visual Apron Parking Stands (T1 & T2)
              </h2>
              <span className="text-[11px] text-cyan-400 font-mono">
                Narrowbody & Widebody Slots
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {stands.map(stand => {
                const isAI101 = stand.standId === 'S05';
                const isSelected = selectedStand?.standId === stand.standId;

                return (
                  <div
                    key={stand.standId}
                    onClick={() => setSelectedStand(stand)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      stand.status === 'Maintenance'
                        ? 'bg-red-950/30 border-red-800/80 text-red-300'
                        : isAI101
                        ? 'bg-amber-950/40 border-amber-500/80 text-amber-200 ring-2 ring-amber-500/30'
                        : stand.status === 'Occupied'
                        ? 'bg-blue-950/30 border-blue-800/80 text-blue-200'
                        : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                    } ${isSelected ? 'ring-2 ring-cyan-400 shadow-lg' : ''}`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800/60">
                      <span className="font-mono font-bold text-sm text-white">{stand.standId}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-black/40 text-slate-300">
                        {stand.terminal}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs font-mono">
                      <div className="text-[10px] text-slate-400">
                        Type: <strong className="text-white">{stand.type}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Gate: <strong className="text-cyan-300">{stand.gateConnection}</strong>
                      </div>
                      <div className="pt-1 text-[11px] font-bold truncate">
                        {stand.currentFlightNo ? (
                          <span className="text-white flex items-center gap-1">
                            <Plane className="w-3 h-3 text-cyan-400" />
                            {stand.currentFlightNo}
                          </span>
                        ) : (
                          <span className="text-emerald-400">AVAILABLE</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stand Inspection & Allocation Cockpit (4 cols) */}
          <div className="lg:col-span-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-4">
            {selectedStand ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">Stand {selectedStand.standId} Controls</h3>
                    <p className="text-xs text-slate-400">Terminal {selectedStand.terminal} • {selectedStand.type}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    selectedStand.status === 'Maintenance' ? 'bg-red-950 text-red-300' : 'bg-cyan-950 text-cyan-300'
                  }`}>
                    {selectedStand.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Active Aircraft:</span>
                    <span className="font-bold text-white">{selectedStand.currentAircraftReg || 'None'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Turnaround Flight:</span>
                    <span className="font-bold text-cyan-300">{selectedStand.currentFlightNo || 'None'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Connected Gate:</span>
                    <span className="font-bold text-white">Gate {selectedStand.gateConnection}</span>
                  </div>
                </div>

                {/* Compatibility Validation Notice */}
                <div className="p-3 bg-blue-950/40 border border-blue-700/60 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-blue-200">STAND COMPATIBILITY RULE:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Stand {selectedStand.standId} accepts {selectedStand.type} airframes. Widebody airframes (B787, A350) will be rejected if assigned to Narrowbody stands.
                  </p>
                </div>

                {/* Direct Stand Allocation */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <label className="text-slate-400 block font-medium">Re-assign Flight to Stand {selectedStand.standId}:</label>
                  <div className="flex gap-2">
                    <select
                      value={reassignFlightNo}
                      onChange={(e) => setReassignFlightNo(e.target.value)}
                      className="flex-1 bg-[#081226] border border-slate-700 rounded-lg p-2 text-white font-mono outline-none focus:border-cyan-500"
                    >
                      {flights.map(f => (
                        <option key={f.flightNo} value={f.flightNo}>
                          {f.flightNo} ({f.aircraftModel})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => assignStand(reassignFlightNo, selectedStand.standId)}
                      className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Select a stand to view details and aircraft assignment.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Boarding Gate Management (Section 10) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Terminal Boarding Gates (G01 to G18)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gates.map(gate => {
                const isSelected = selectedGate?.gateNo === gate.gateNo;
                return (
                  <div
                    key={gate.gateNo}
                    onClick={() => setSelectedGate(gate)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      gate.status === 'Boarding' ? 'bg-amber-950/40 border-amber-500/80 text-amber-200' :
                      gate.status === 'Maintenance' ? 'bg-red-950/30 border-red-800 text-red-300' :
                      gate.status === 'Occupied' ? 'bg-blue-950/30 border-blue-800 text-blue-200' :
                      'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                    } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800/60 font-mono">
                      <span className="font-bold text-sm text-white">{gate.gateNo}</span>
                      <span className="text-[10px] text-slate-400">{gate.terminal}</span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs font-mono">
                      <div className="text-[10px] text-slate-400">
                        Status: <strong className="text-white">{gate.status}</strong>
                      </div>
                      <div className="pt-1 text-[11px] font-bold text-cyan-300 truncate">
                        {gate.currentFlightNo || 'NO FLIGHT'}
                      </div>
                      {gate.boardingTime && (
                        <div className="text-[10px] text-emerald-400">
                          Brd: {gate.boardingTime}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gate Details Panel */}
          <div className="lg:col-span-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-4">
            {selectedGate ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-white text-sm">Gate {selectedGate.gateNo} ({selectedGate.terminal})</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300">
                    {selectedGate.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Current Flight:</span>
                    <span className="font-bold text-white">{selectedGate.currentFlightNo || 'None'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Next Departure:</span>
                    <span className="font-bold text-cyan-300">{selectedGate.nextFlightNo || 'None'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Stand Link:</span>
                    <span className="font-bold text-white">{selectedGate.standConnection || 'S01'}</span>
                  </div>
                </div>

                {/* Gate Conflict prevention */}
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 font-sans">Re-allocate Flight:</span>
                  <div className="flex gap-2">
                    <select
                      value={reassignFlightNo}
                      onChange={(e) => setReassignFlightNo(e.target.value)}
                      className="flex-1 bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                    >
                      {flights.map(f => (
                        <option key={f.flightNo} value={f.flightNo}>
                          {f.flightNo}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => assignGate(reassignFlightNo, selectedGate.gateNo)}
                      className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Select a gate to view status and boarding timelines.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
