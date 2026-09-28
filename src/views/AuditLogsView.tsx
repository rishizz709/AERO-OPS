import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  Clock
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.entity.toLowerCase().includes(q) || log.role.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              IMMUTABLE AIRPORT AUDIT TRAIL & COMPLIANCE LOGS
            </h1>
            <p className="text-xs text-slate-400">
              Tracking all operational modifications, gate reallocations, check-in events, and runway dispatch orders
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-48 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#081226] text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Actor Role</th>
                <th className="py-2.5 px-3">Operational Action</th>
                <th className="py-2.5 px-3">Entity Affected</th>
                <th className="py-2.5 px-3">Previous State</th>
                <th className="py-2.5 px-3">New State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.logId} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-slate-400">{log.logId}</td>
                  <td className="py-2.5 px-3 text-cyan-300">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-white">{log.user}</td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-400 font-sans">{log.role}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-white">{log.entity}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-xs">{log.oldValue}</td>
                  <td className="py-2.5 px-3 text-emerald-300 text-[11px] font-bold truncate max-w-xs">{log.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
