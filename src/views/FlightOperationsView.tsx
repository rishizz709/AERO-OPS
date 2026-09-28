import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Flight } from '../types';
import {
  Plane,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DoorOpen,
  ParkingSquare,
  Compass,
  Users,
  Luggage,
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

export const FlightOperationsView: React.FC = () => {
  const { flights, updateFlightStatus, assignGate, assignStand, assignRunway, scheduleFlight, passengers, baggage, gates, stands, runways } = useAodb();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'DEPARTURE' | 'ARRIVAL'>('ALL');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(flights[0]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Form state for scheduling new flight
  const [newFlightNo, setNewFlightNo] = useState('');
  const [newAirline, setNewAirline] = useState('Air India');
  const [newType, setNewType] = useState<'Departure' | 'Arrival'>('Departure');
  const [newDestination, setNewDestination] = useState('');
  const [newStd, setNewStd] = useState('16:30');
  const [newGate, setNewGate] = useState('G01');
  const [newStand, setNewStand] = useState('S01');

  const filtered = flights.filter(f => {
    if (filterType === 'DEPARTURE' && f.type !== 'Departure') return false;
    if (filterType === 'ARRIVAL' && f.type !== 'Arrival') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return f.flightNo.toLowerCase().includes(q) || f.destinationCity.toLowerCase().includes(q) || f.aircraftReg.toLowerCase().includes(q);
    }
    return true;
  });

  const flightPassengers = selectedFlight ? passengers.filter(p => p.flightNo === selectedFlight.flightNo) : [];
  const flightBaggage = selectedFlight ? baggage.filter(b => b.flightNo === selectedFlight.flightNo) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlightNo || !newDestination) return;
    const success = scheduleFlight({
      flightNo: newFlightNo,
      airline: newAirline,
      type: newType,
      origin: newType === 'Departure' ? 'HYD' : newDestination,
      destination: newType === 'Departure' ? newDestination : 'HYD',
      std: newStd,
      etd: newStd,
      gateId: newGate,
      standId: newStand,
      status: 'Scheduled'
    });
    if (success) {
      setIsCreateOpen(false);
      setNewFlightNo('');
      setNewDestination('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              FLIGHT OPERATIONS & AIRCRAFT SCHEDULING (AODB)
            </h1>
            <p className="text-xs text-slate-400">
              Operational gate/stand/runway assignments, manifest audits, and flight milestones
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Flight</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Flight Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'ALL' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                All ({flights.length})
              </button>
              <button
                onClick={() => setFilterType('DEPARTURE')}
                className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'DEPARTURE' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                Departures
              </button>
              <button
                onClick={() => setFilterType('ARRIVAL')}
                className={`px-3 py-1 rounded-lg font-medium transition ${filterType === 'ARRIVAL' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                Arrivals
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search flights..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-40 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#081226] text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Flight</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-2">Sector</th>
                  <th className="py-2.5 px-2">STD/ETD</th>
                  <th className="py-2.5 px-2">Gate / Stand</th>
                  <th className="py-2.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filtered.map(flight => (
                  <tr
                    key={flight.flightNo}
                    onClick={() => setSelectedFlight(flight)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition ${
                      selectedFlight?.flightNo === flight.flightNo ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white text-sm">{flight.flightNo}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{flight.airline}</div>
                    </td>
                    <td className="py-2.5 px-2 font-sans">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        flight.type === 'Departure' ? 'text-sky-400 bg-sky-950/50' : 'text-emerald-400 bg-emerald-950/50'
                      }`}>
                        {flight.type.slice(0, 3).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-white font-bold">{flight.origin}</span> → <span className="text-cyan-300 font-bold">{flight.destination}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <div>{flight.std}</div>
                      {flight.delayMinutes > 0 ? (
                        <div className="text-orange-400 text-[10px]">+{flight.delayMinutes}m</div>
                      ) : (
                        <div className="text-emerald-400 text-[10px]">On-time</div>
                      )}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="text-cyan-300 font-bold">{flight.gateId}</span> / <span className="text-white">{flight.standId}</span>
                    </td>
                    <td className="py-2.5 px-2 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {flight.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Flight Operational Cockpit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedFlight ? (
            <div className="p-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white font-mono">{selectedFlight.flightNo}</h2>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                      {selectedFlight.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedFlight.airline} • {selectedFlight.originCity} → {selectedFlight.destinationCity}</p>
                </div>

                <button
                  onClick={() => setIsTimelineOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Timeline</span>
                </button>
              </div>

              {/* Resource Reallocation Controls */}
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Resource Assignments</span>
                  <span className="text-[10px] font-mono text-cyan-400">AODB LOCKED</span>
                </h3>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* Gate Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 flex items-center gap-1">
                      <DoorOpen className="w-3 h-3 text-cyan-400" /> Gate
                    </label>
                    <select
                      value={selectedFlight.gateId}
                      onChange={(e) => assignGate(selectedFlight.flightNo, e.target.value)}
                      className="w-full bg-[#081226] border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                    >
                      {gates.map(g => (
                        <option key={g.gateNo} value={g.gateNo}>
                          {g.gateNo} ({g.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stand Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ParkingSquare className="w-3 h-3 text-cyan-400" /> Stand
                    </label>
                    <select
                      value={selectedFlight.standId}
                      onChange={(e) => assignStand(selectedFlight.flightNo, e.target.value)}
                      className="w-full bg-[#081226] border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                    >
                      {stands.map(s => (
                        <option key={s.standId} value={s.standId}>
                          {s.standId} ({s.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Runway Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-cyan-400" /> Runway
                    </label>
                    <select
                      value={selectedFlight.runwayId}
                      onChange={(e) => assignRunway(selectedFlight.flightNo, e.target.value)}
                      className="w-full bg-[#081226] border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                    >
                      {runways.map(r => (
                        <option key={r.runwayId} value={r.runwayId}>
                          {r.runwayId}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Modifier */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">Update Status:</span>
                  <div className="flex flex-wrap gap-1">
                    {(['At Stand', 'Boarding', 'Pushback', 'Departed'] as Flight['status'][]).map(st => (
                      <button
                        key={st}
                        onClick={() => updateFlightStatus(selectedFlight.flightNo, st)}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition ${
                          selectedFlight.status === st ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manifest Preview: Passengers & Baggage */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]"><Users className="w-3.5 h-3.5 text-sky-400" /> Passengers</span>
                    <span className="font-mono font-bold text-white">{selectedFlight.passengerCount} / {selectedFlight.passengerCapacity}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {flightPassengers.length > 0 ? `${flightPassengers.length} manifested in demo DB` : 'Manifest auto-synced'}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]"><Luggage className="w-3.5 h-3.5 text-purple-400" /> Baggage Bags</span>
                    <span className="font-mono font-bold text-white">{selectedFlight.baggageCount}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Make-up Carousel B2
                  </div>
                </div>
              </div>

              {/* Passenger Manifest list */}
              {flightPassengers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400 font-mono tracking-wider">
                    Checked Manifest Sample
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {flightPassengers.map(p => (
                      <div key={p.passengerId} className="p-2 bg-slate-900/50 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-white font-bold">{p.name}</span>
                          <span className="text-slate-400 text-[10px] ml-2 font-sans">Seat {p.seatNo || 'Unassigned'}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded">
                          {p.journeyStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-[#0E1A38] border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
              Select a flight to view operational controls and manifest.
            </div>
          )}
        </div>
      </div>

      {/* Schedule Flight Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Schedule New Flight into AODB</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Flight Number *</label>
                  <input
                    type="text"
                    required
                    value={newFlightNo}
                    onChange={(e) => setNewFlightNo(e.target.value)}
                    placeholder="e.g. AI-305"
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500 uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Airline</label>
                  <select
                    value={newAirline}
                    onChange={(e) => setNewAirline(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Air India">Air India</option>
                    <option value="IndiGo">IndiGo</option>
                    <option value="Akasa Air">Akasa Air</option>
                    <option value="Vistara">Vistara</option>
                    <option value="SpiceJet">SpiceJet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Operation Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Departure">Departure (From HYD)</option>
                    <option value="Arrival">Arrival (To HYD)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Destination/Origin Airport *</label>
                  <input
                    type="text"
                    required
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="e.g. BOM, DEL, BLR"
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Scheduled Time (STD)</label>
                  <input
                    type="text"
                    value={newStd}
                    onChange={(e) => setNewStd(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Initial Gate</label>
                  <select
                    value={newGate}
                    onChange={(e) => setNewGate(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500"
                  >
                    {gates.map(g => (
                      <option key={g.gateNo} value={g.gateNo}>{g.gateNo}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Initial Stand</label>
                  <select
                    value={newStand}
                    onChange={(e) => setNewStand(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500"
                  >
                    {stands.map(s => (
                      <option key={s.standId} value={s.standId}>{s.standId}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
                >
                  Schedule Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flight Timeline Modal (Section 13) */}
      {isTimelineOpen && selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base font-mono">Flight Operational Timeline: {selectedFlight.flightNo}</h3>
                <p className="text-xs text-slate-400">{selectedFlight.origin} → {selectedFlight.destination} ({selectedFlight.aircraftModel})</p>
              </div>
              <button onClick={() => setIsTimelineOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-cyan-400 font-bold w-14">14:15</span>
                <span className="text-slate-300">Estimated Arrival (ETA)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-emerald-400 font-bold w-14">14:18</span>
                <span className="text-slate-300">Touchdown on Runway 27</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-emerald-400 font-bold w-14">14:24</span>
                <span className="text-slate-300">Docked at Stand S05 / Chocks On</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-emerald-400 font-bold w-14">14:32</span>
                <span className="text-slate-300">Baggage Unloading Infeed to BHS</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-emerald-400 font-bold w-14">14:48</span>
                <span className="text-slate-300">Cabin Cleaning & Sanitization</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-amber-400 font-bold w-14">15:08</span>
                <span className="text-amber-200">High-Loader Catering Completed (+18m delay)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-cyan-950/40 border border-cyan-800/60 rounded-lg">
                <span className="text-cyan-300 font-bold w-14">15:15</span>
                <span className="text-white font-bold">Passenger Boarding at Gate G03</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-500 font-bold w-14">15:35</span>
                <span className="text-slate-400">Aircraft Ready & Doors Closed (Projected)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-500 font-bold w-14">15:40</span>
                <span className="text-slate-400">Pushback Clearance Tug (Projected)</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg">
                <span className="text-slate-500 font-bold w-14">15:48</span>
                <span className="text-slate-400">Takeoff Runway 09 (Projected)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
