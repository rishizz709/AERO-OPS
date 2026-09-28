import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Baggage, BaggageStatus } from '../types';
import {
  Luggage,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  QrCode,
  Truck,
  Plane,
  X,
  Plus,
  Wrench
} from 'lucide-react';

export const BaggageOperationsView: React.FC = () => {
  const { baggage, updateBaggageStage, resolveBaggageException, activeRole } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBag, setSelectedBag] = useState<Baggage | null>(baggage[0]);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('Re-tagged and dispatched to Apron S05 (AI-101 container)');

  const filteredBaggage = baggage.filter(b => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return b.baggageId.toLowerCase().includes(q) || b.passengerName.toLowerCase().includes(q) || b.flightNo.toLowerCase().includes(q);
    }
    return true;
  });

  // KPI counters
  const totalBags = baggage.length;
  const checkedIn = baggage.filter(b => b.status === 'CHECKED-IN').length;
  const sorting = baggage.filter(b => b.status === 'SORTING' || b.status === 'BAGGAGE BELT').length;
  const loaded = baggage.filter(b => b.status === 'LOADING' || b.status === 'AIRCRAFT').length;
  const exceptions = baggage.filter(b => b.status === 'MISROUTED' || b.status === 'DELAYED' || b.status === 'LOST').length;

  const JOURNEY_STAGES: BaggageStatus[] = [
    'CHECKED-IN',
    'ACCEPTED',
    'SECURITY',
    'SORTING',
    'BAGGAGE BELT',
    'LOADING',
    'AIRCRAFT',
    'UNLOADING',
    'ARRIVAL BELT',
    'DELIVERED'
  ];

  const getStageIndex = (status: BaggageStatus) => {
    return JOURNEY_STAGES.indexOf(status);
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Luggage className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              BAGGAGE RECONCILIATION & HANDLING SYSTEM (BHS / BRS)
            </h1>
            <p className="text-xs text-slate-400">
              Automated tray sorting, IATA Res 753 end-to-end tracking, and exception management
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">TOTAL ACTIVE</span>
            <span className="text-white font-bold">{totalBags}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">IN SORTING</span>
            <span className="text-cyan-400 font-bold">{sorting}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">LOADED RAMP</span>
            <span className="text-emerald-400 font-bold">{loaded}</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">EXCEPTIONS</span>
            <span className={`font-bold ${exceptions > 0 ? 'text-red-400' : 'text-slate-400'}`}>{exceptions}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Baggage Table + Journey Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Baggage Table (6 cols) */}
        <div className="lg:col-span-6 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Baggage Inventory & Scans
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tag (BAG-1001)..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#081226] text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Baggage ID</th>
                  <th className="py-2.5 px-2">Passenger</th>
                  <th className="py-2.5 px-2">Flight</th>
                  <th className="py-2.5 px-2">Weight</th>
                  <th className="py-2.5 px-2">Location</th>
                  <th className="py-2.5 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredBaggage.map(bag => (
                  <tr
                    key={bag.baggageId}
                    onClick={() => setSelectedBag(bag)}
                    className={`hover:bg-slate-800/50 cursor-pointer transition ${
                      selectedBag?.baggageId === bag.baggageId ? 'bg-cyan-950/40 border-l-2 border-cyan-400' : ''
                    } ${bag.status === 'MISROUTED' ? 'bg-red-950/20' : ''}`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{bag.baggageId}</span>
                    </td>
                    <td className="py-2.5 px-2 font-sans font-medium text-slate-200">
                      {bag.passengerName}
                    </td>
                    <td className="py-2.5 px-2 text-cyan-300 font-bold">
                      {bag.flightNo}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400">
                      {bag.weight} kg
                    </td>
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 truncate max-w-[120px]">
                      {bag.currentLocation}
                    </td>
                    <td className="py-2.5 px-2 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bag.status === 'MISROUTED' ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' :
                        bag.status === 'LOADING' || bag.status === 'AIRCRAFT' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {bag.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Baggage Journey & Exception Workflow (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {selectedBag ? (
            <div className="p-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Luggage className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white font-mono">{selectedBag.baggageId}</h2>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        selectedBag.status === 'MISROUTED' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {selectedBag.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">
                      Pax: <strong>{selectedBag.passengerName}</strong> • Flight: <strong>{selectedBag.flightNo}</strong> ({selectedBag.origin} → {selectedBag.destination})
                    </p>
                  </div>
                </div>

                {/* Baggage Scan advancement action */}
                <div className="flex items-center gap-2">
                  {selectedBag.status === 'MISROUTED' ? (
                    <button
                      onClick={() => setResolutionModalOpen(true)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-950 flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Resolve Exception</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const curIdx = getStageIndex(selectedBag.status);
                        if (curIdx < JOURNEY_STAGES.length - 1) {
                          updateBaggageStage(selectedBag.baggageId, JOURNEY_STAGES[curIdx + 1]);
                        }
                      }}
                      className="px-3 py-1.5 bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-200 border border-cyan-500/50 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Simulate Next Scan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Exception Alert Banner if misrouted */}
              {selectedBag.exceptionIssue && (
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-red-300 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>BAGGAGE EXCEPTION: {selectedBag.status}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] font-sans">
                    {selectedBag.exceptionIssue}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Assigned Handler: <strong className="text-white">{selectedBag.assignedStaff}</strong>
                  </div>
                </div>
              )}

              {/* Visual Baggage Journey (Section 15) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Visual Baggage Journey (IATA Res 753)
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {selectedBag.journey.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-[10px] font-mono font-bold mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white font-mono">{event.stage}</span>
                          <span className="text-[10px] font-mono text-slate-400">{event.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-slate-300">Location: {event.location}</div>
                        <div className="text-[10px] text-slate-500">Operator: {event.operator}</div>
                        {event.notes && (
                          <div className="text-[10px] text-amber-300/90 font-mono italic">
                            Note: {event.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#0E1A38] border border-slate-800 rounded-2xl text-center text-slate-400 text-xs">
              Select a baggage item to inspect journey scans and exception workflows.
            </div>
          )}
        </div>
      </div>

      {/* Exception Resolution Modal */}
      {resolutionModalOpen && selectedBag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0E1A38] border border-red-500/40 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Resolve Baggage Exception: {selectedBag.baggageId}</h3>
              <button onClick={() => setResolutionModalOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                You are resolving the misrouted tag for passenger <strong>{selectedBag.passengerName}</strong>. This bag will be re-assigned to Carousel B2 and loaded into AI-101 container.
              </p>

              <div className="space-y-1">
                <label className="text-slate-400">Resolution Notes / Action Taken</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolutionModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resolveBaggageException(selectedBag.baggageId, resolutionNotes);
                    setResolutionModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Confirm Resolution & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
