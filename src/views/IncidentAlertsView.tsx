import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Incident } from '../types';
import {
  Flame,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  X,
  Wrench,
  ShieldAlert
} from 'lucide-react';

export const IncidentAlertsView: React.FC = () => {
  const { incidents, createIncident, resolveIncident, alerts } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolveModalId, setResolveModalId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('Incident investigated and mitigated by airport taskforce');

  // Form states
  const [incType, setIncType] = useState<Incident['type']>('Flight Delay');
  const [incSeverity, setIncSeverity] = useState<Incident['severity']>('Medium');
  const [incLocation, setIncLocation] = useState('Apron Stand S05');
  const [incDescription, setIncDescription] = useState('');
  const [incTeam, setIncTeam] = useState('Ground Operations Team');

  const filteredIncidents = incidents.filter(i => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return i.incidentId.toLowerCase().includes(q) || i.type.toLowerCase().includes(q) || i.location.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incDescription) return;
    createIncident({
      type: incType,
      severity: incSeverity,
      location: incLocation,
      description: incDescription,
      assignedTeam: incTeam,
      reportedBy: 'AOCC Watcher'
    });
    setIsModalOpen(false);
    setIncDescription('');
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              INCIDENT MANAGEMENT & CENTRAL ALERT ENGINE
            </h1>
            <p className="text-xs text-slate-400">
              Crisis resolution, equipment failures, airfield disruptions, and automated SLA mitigation workflows
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-red-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Incident</span>
        </button>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Incidents Table (8 cols) */}
        <div className="lg:col-span-8 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Operational Incidents Register ({incidents.length})
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search incidents..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredIncidents.map(inc => {
              const isCrit = inc.severity === 'Critical';
              const isHigh = inc.severity === 'High';
              const isResolved = inc.status === 'Resolved' || inc.status === 'Closed';

              return (
                <div
                  key={inc.incidentId}
                  className={`p-4 rounded-xl border transition space-y-2 ${
                    isCrit ? 'bg-red-950/30 border-red-700/70' :
                    isHigh ? 'bg-orange-950/25 border-orange-700/60' :
                    'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/60 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{inc.incidentId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit ? 'bg-red-950 text-red-300 border border-red-800' :
                        isHigh ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-cyan-300 font-sans font-semibold">{inc.type}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{inc.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isResolved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {inc.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>Location: <strong className="text-white">{inc.location}</strong></span>
                      <span>Team: <strong className="text-cyan-300">{inc.assignedTeam}</strong></span>
                    </div>

                    {!isResolved && (
                      <button
                        onClick={() => setResolveModalId(inc.incidentId)}
                        className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-sans font-bold flex items-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>

                  {inc.resolution && (
                    <div className="p-2 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-[11px] text-emerald-300 font-mono">
                      Resolution: {inc.resolution}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Alerts Engine (4 cols) */}
        <div className="lg:col-span-4 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              Real-time Alert Engine
            </h2>
            <span className="text-[10px] text-cyan-400 font-mono">AUTONOMOUS</span>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.alertId}
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-white">{alert.source}</span>
                  <span className="text-amber-400 font-bold">{alert.severity}</span>
                </div>
                <p className="text-slate-300 leading-snug">{alert.description}</p>
                <div className="p-2 bg-black/40 rounded-lg border border-slate-800/80 text-[11px] text-cyan-200">
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">Recommended Action:</span>
                  {alert.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0E1A38] border border-red-500/40 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Report Operational Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Incident Type</label>
                  <select
                    value={incType}
                    onChange={(e) => setIncType(e.target.value as any)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                  >
                    <option value="Flight Delay">Flight Delay</option>
                    <option value="Gate Issue">Gate Issue</option>
                    <option value="Runway Closure">Runway Closure</option>
                    <option value="Baggage Issue">Baggage Issue</option>
                    <option value="Equipment Failure">Equipment Failure</option>
                    <option value="Terminal Congestion">Terminal Congestion</option>
                    <option value="Weather Disruption">Weather Disruption</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Severity</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as any)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Location / Sector</label>
                <input
                  type="text"
                  required
                  value={incLocation}
                  onChange={(e) => setIncLocation(e.target.value)}
                  placeholder="e.g. Gate G03, Stand S05, Taxiway B"
                  className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Dispatched Response Team</label>
                <input
                  type="text"
                  value={incTeam}
                  onChange={(e) => setIncTeam(e.target.value)}
                  className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Description / Anomaly Details *</label>
                <textarea
                  rows={3}
                  required
                  value={incDescription}
                  onChange={(e) => setIncDescription(e.target.value)}
                  placeholder="Describe operational bottleneck..."
                  className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Incident Modal */}
      {resolveModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0E1A38] border border-emerald-500/40 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Close Incident: {resolveModalId}</h3>
              <button onClick={() => setResolveModalId(null)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Resolution Summary</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setResolveModalId(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resolveIncident(resolveModalId, resolutionText);
                    setResolveModalId(null);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
