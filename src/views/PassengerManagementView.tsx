import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Passenger } from '../types';
import {
  Users,
  Search,
  CheckCircle2,
  Ticket,
  Clock,
  ShieldCheck,
  DoorOpen,
  Plane,
  HeartHandshake
} from 'lucide-react';

export const PassengerManagementView: React.FC = () => {
  const { passengers } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(passengers[0]);

  const filteredPassengers = passengers.filter(p => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.passportNo.toLowerCase().includes(q) || p.flightNo.toLowerCase().includes(q) || p.bookingId.toLowerCase().includes(q);
    }
    return true;
  });

  const JOURNEY_STEPS = ['BOOKED', 'CHECKED-IN', 'SECURITY', 'AT GATE', 'BOARDING', 'BOARDED'];

  const getStepIndex = (status: Passenger['journeyStatus']) => {
    return JOURNEY_STEPS.indexOf(status);
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              PASSENGER MANIFEST & JOURNEY ORCHESTRATION
            </h1>
            <p className="text-xs text-slate-400">
              Tracking passenger flow from check-in counter, security screening, gate lounge, to aircraft cabin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">MANIFESTED TODAY</span>
            <span className="text-emerald-400 font-bold">8,420 Passengers</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Passenger List (6 cols) */}
        <div className="lg:col-span-6 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Sample Passenger Records ({passengers.length})
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search passenger..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredPassengers.map(pax => {
              const isRavi = pax.passengerId === 'PAX-901';
              const isSelected = selectedPassenger?.passengerId === pax.passengerId;

              return (
                <div
                  key={pax.passengerId}
                  onClick={() => setSelectedPassenger(pax)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isRavi ? 'bg-[#0F1E42] border-cyan-500/60 shadow-cyan-950/20' : 'bg-slate-900/60 border-slate-800'
                  } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
                >
                  <div className="flex items-center justify-between pb-1 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-sans">{pax.name}</span>
                      {pax.specialAssistance && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                          <HeartHandshake className="w-3 h-3" /> WCHR
                        </span>
                      )}
                    </div>
                    <span className="text-cyan-300 font-bold">{pax.flightNo}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Passport: {pax.passportNo}</span>
                    <span>Seat: <strong className="text-white">{pax.seatNo || 'Unassigned'}</strong></span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-bold">
                      {pax.journeyStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Passenger Profile & Journey Status (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {selectedPassenger ? (
            <div className="p-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">{selectedPassenger.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {selectedPassenger.passengerId} • Passport: {selectedPassenger.passportNo}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedPassenger.journeyStatus}
                </span>
              </div>

              {/* Journey Stepper (Section 17) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Passenger Airport Journey Progress
                </h4>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between relative py-2">
                    {JOURNEY_STEPS.map((step, idx) => {
                      const curIdx = getStepIndex(selectedPassenger.journeyStatus);
                      const isCompleted = idx <= curIdx;
                      const isCurrent = idx === curIdx;

                      return (
                        <div key={step} className="flex flex-col items-center z-10">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border ${
                              isCompleted
                                ? 'bg-cyan-600 text-white border-cyan-400'
                                : 'bg-slate-800 text-slate-500 border-slate-700'
                            } ${isCurrent ? 'ring-2 ring-cyan-400 animate-pulse' : ''}`}
                          >
                            {idx + 1}
                          </div>
                          <span className={`text-[9px] font-mono mt-1 ${isCompleted ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Booking & Flight Data */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans block text-[10px]">BOOKING REFERENCE</span>
                  <span className="font-bold text-white text-sm">{selectedPassenger.bookingId}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans block text-[10px]">ALLOCATED SEAT</span>
                  <span className="font-bold text-cyan-300 text-sm">{selectedPassenger.seatNo || 'Not Selected'}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans block text-[10px]">CONTACT PHONE</span>
                  <span className="font-bold text-slate-200">{selectedPassenger.contact}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-sans block text-[10px]">BOARDING PASS</span>
                  <span className="font-bold text-emerald-400">{selectedPassenger.hasBoardingPass ? 'ISSUED (BP-881)' : 'PENDING'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#0E1A38] border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
              Select a passenger to inspect itinerary and terminal journey.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
