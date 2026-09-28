import React, { useState, useEffect } from 'react';
import { useAodb } from '../../context/AodbContext';
import { Search, X, Plane, Users, Luggage, DoorOpen, Briefcase, Flame, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, flights, passengers, baggage, gates, staff, incidents, setActiveRoute } = useAodb();
  const [query, setQuery] = useState('');

  // Keybinding Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedFlights = q ? flights.filter(f => f.flightNo.toLowerCase().includes(q) || f.destinationCity.toLowerCase().includes(q) || f.aircraftReg.toLowerCase().includes(q) || f.airline.toLowerCase().includes(q)) : [];
  const matchedPassengers = q ? passengers.filter(p => p.name.toLowerCase().includes(q) || p.passportNo.toLowerCase().includes(q) || p.bookingId.toLowerCase().includes(q)) : [];
  const matchedBaggage = q ? baggage.filter(b => b.baggageId.toLowerCase().includes(q) || b.passengerName.toLowerCase().includes(q) || b.flightNo.toLowerCase().includes(q)) : [];
  const matchedGates = q ? gates.filter(g => g.gateNo.toLowerCase().includes(q)) : [];
  const matchedStaff = q ? staff.filter(s => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q)) : [];
  const matchedIncidents = q ? incidents.filter(i => i.incidentId.toLowerCase().includes(q) || i.type.toLowerCase().includes(q)) : [];

  const totalResults = matchedFlights.length + matchedPassengers.length + matchedBaggage.length + matchedGates.length + matchedStaff.length + matchedIncidents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-700/80 flex items-center gap-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type flight (AI-101), passenger (Ravi Kumar), baggage (BAG-1001), gate (G03)..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm font-medium"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-800 rounded">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p>Type to instantly search across the Central Airport Operational Database (AODB).</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3 text-slate-400">
                <span className="px-2 py-1 bg-slate-800/80 rounded cursor-pointer hover:text-cyan-300" onClick={() => setQuery('AI-101')}>AI-101</span>
                <span className="px-2 py-1 bg-slate-800/80 rounded cursor-pointer hover:text-cyan-300" onClick={() => setQuery('Ravi Kumar')}>Ravi Kumar</span>
                <span className="px-2 py-1 bg-slate-800/80 rounded cursor-pointer hover:text-cyan-300" onClick={() => setQuery('BAG-2041')}>BAG-2041</span>
                <span className="px-2 py-1 bg-slate-800/80 rounded cursor-pointer hover:text-cyan-300" onClick={() => setQuery('G03')}>Gate G03</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching airport records found for "<span className="text-cyan-300">{query}</span>"
            </div>
          ) : (
            <>
              {/* Flights */}
              {matchedFlights.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" /> Flights ({matchedFlights.length})
                  </div>
                  <div className="space-y-1">
                    {matchedFlights.map(f => (
                      <div
                        key={f.flightNo}
                        onClick={() => { setActiveRoute('/flights'); setIsSearchOpen(false); }}
                        className="p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between text-xs transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white font-mono bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800">
                            {f.flightNo}
                          </span>
                          <div>
                            <span className="text-slate-200 font-medium">{f.airline}</span>
                            <span className="text-slate-400 ml-2">({f.origin} → {f.destination})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-slate-400">Gate: {f.gateId}</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-emerald-400 rounded">{f.status}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Passengers */}
              {matchedPassengers.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" /> Passengers ({matchedPassengers.length})
                  </div>
                  <div className="space-y-1">
                    {matchedPassengers.map(p => (
                      <div
                        key={p.passengerId}
                        onClick={() => { setActiveRoute('/check-in'); setIsSearchOpen(false); }}
                        className="p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 cursor-pointer flex items-center justify-between text-xs transition"
                      >
                        <div>
                          <span className="font-bold text-white">{p.name}</span>
                          <span className="text-slate-400 ml-2 font-mono">Passport: {p.passportNo} | Booking: {p.bookingId}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-cyan-400">{p.flightNo}</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">{p.journeyStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Baggage */}
              {matchedBaggage.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-purple-400" /> Baggage ({matchedBaggage.length})
                  </div>
                  <div className="space-y-1">
                    {matchedBaggage.map(b => (
                      <div
                        key={b.baggageId}
                        onClick={() => { setActiveRoute('/baggage'); setIsSearchOpen(false); }}
                        className="p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 cursor-pointer flex items-center justify-between text-xs transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-300">{b.baggageId}</span>
                          <span className="text-slate-400">({b.passengerName})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-400">Loc: {b.currentLocation}</span>
                          <span className={`px-1.5 py-0.5 rounded ${b.status === 'MISROUTED' ? 'bg-red-950 text-red-400' : 'bg-slate-800 text-slate-300'}`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gates */}
              {matchedGates.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-emerald-400" /> Gates ({matchedGates.length})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {matchedGates.map(g => (
                      <div
                        key={g.gateNo}
                        onClick={() => { setActiveRoute('/gates'); setIsSearchOpen(false); }}
                        className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-white font-mono">Gate {g.gateNo} ({g.terminal})</span>
                        <span className="text-slate-400 font-mono text-[11px]">{g.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
