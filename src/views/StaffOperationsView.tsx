import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Staff } from '../types';
import {
  Briefcase,
  Users,
  Search,
  CalendarCheck,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';

export const StaffOperationsView: React.FC = () => {
  const { staff } = useAodb();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const departments = [
    'ALL',
    'Airport Operations',
    'Baggage',
    'Check-in',
    'Airside Operations',
    'Ground Handling',
    'Terminal Operations',
    'Security',
    'Maintenance'
  ];

  const filteredStaff = staff.filter(s => {
    if (selectedDept !== 'ALL' && s.department !== selectedDept) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.staffId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              STAFF OPERATIONS & SHIFT ROSTER DISPATCH
            </h1>
            <p className="text-xs text-slate-400">
              Coordinating personnel across 9 airport departments, airside tug teams, and check-in rosters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-[10px] block">CURRENT SHIFT</span>
            <span className="text-emerald-400 font-bold">Morning (06:00 - 14:30)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedDept === dept ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff..."
            className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 outline-none w-44 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => {
          const isLead = member.staffId.startsWith('STF-10');

          return (
            <div
              key={member.staffId}
              className={`p-4 rounded-2xl border transition shadow-xl space-y-3 ${
                isLead ? 'bg-[#0F1E42] border-cyan-500/50 shadow-cyan-950/30' : 'bg-[#0E1A38] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs font-mono">
                    {member.staffId.slice(-3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-sm">{member.name}</h3>
                      {isLead && (
                        <span title="Project Author & Lead">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-cyan-300">{member.role}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  member.status === 'Busy' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  member.status === 'Assigned' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {member.status}
                </span>
              </div>

              {/* Assignment & Location */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{member.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>Shift: {member.shift}</span>
                </div>
                {member.currentAssignment && (
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-cyan-200">
                    Task: <strong>{member.currentAssignment}</strong>
                  </div>
                )}
                {member.currentFlightNo && (
                  <div className="p-2 bg-blue-950/40 rounded-lg border border-blue-800/60 text-[11px] text-white">
                    Flight Assignment: <strong className="text-cyan-300 font-bold">{member.currentFlightNo}</strong>
                  </div>
                )}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {member.phone}</span>
                  <span className="text-slate-500">{member.department}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
