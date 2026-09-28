import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  DoorOpen,
  Luggage,
  Users,
  Compass,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsScorecardView: React.FC = () => {
  const { stats, flights, gates, baggage } = useAodb();
  const [range, setRange] = useState<'TODAY' | '7D' | '30D'>('TODAY');

  // Hourly Passenger Throughput Data (RGIA Hyderabad)
  const hourlyData = [
    { time: '06:00', passengers: 420, flights: 3 },
    { time: '08:00', passengers: 980, flights: 6 },
    { time: '10:00', passengers: 1250, flights: 8 },
    { time: '12:00', passengers: 890, flights: 5 },
    { time: '14:00', passengers: 1420, flights: 9 },
    { time: '16:00', passengers: 1100, flights: 7 },
    { time: '18:00', passengers: 1350, flights: 8 },
    { time: '20:00', passengers: 860, flights: 5 }
  ];

  // Delay Breakdown by Category
  const delayCategories = [
    { name: 'Catering / High Loader', value: 45, color: '#f59e0b' },
    { name: 'Airfield Ground Congestion', value: 25, color: '#3b82f6' },
    { name: 'Late Inbound Aircraft', value: 20, color: '#06b6d4' },
    { name: 'Weather / ATC Holding', value: 10, color: '#ef4444' }
  ];

  // Gate Utilization Data
  const gateUsageData = [
    { gate: 'G01', hours: 7.2 },
    { gate: 'G02', hours: 9.5 },
    { gate: 'G03', hours: 11.2 }, // AI-101
    { gate: 'G04', hours: 8.4 },
    { gate: 'G05', hours: 6.1 },
    { gate: 'G06', hours: 2.0 }, // Under maint
    { gate: 'G09', hours: 8.8 },
    { gate: 'G11', hours: 7.9 }
  ];

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              AIRPORT OPERATIONS ANALYTICS & PERFORMANCE SCORECARD
            </h1>
            <p className="text-xs text-slate-400">
              Computed KPIs: On-time departure punctuality, turnaround durations, and airfield throughput
            </p>
          </div>
        </div>

        {/* Time range buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {(['TODAY', '7D', '30D'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg font-bold transition ${range === r ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Bar (Section 34) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">On-Time Performance (OTP)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.onTimePerformancePercent}%</div>
          <span className="text-[11px] text-slate-400">Target: ≥ 90.0% (+2.8% above SLA)</span>
        </div>

        <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Average Turnaround Time</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{stats.averageTurnaroundMins}m</div>
          <span className="text-[11px] text-slate-400">Target: ≤ 50m (A320neo Class)</span>
        </div>

        <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Gate Utilization Factor</span>
          <div className="text-2xl font-bold text-purple-400 font-mono">72.4%</div>
          <span className="text-[11px] text-slate-400">11 of 18 gates active</span>
        </div>

        <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Baggage Delivery Speed</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">14.2m</div>
          <span className="text-[11px] text-slate-400">First bag on claim carousel</span>
        </div>
      </div>

      {/* Interactive Charts Section (Section 33) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Passenger & Flight Hourly Traffic Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Hourly Terminal Passenger Throughput & Flight Volume
          </h2>

          <div className="w-full h-64 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="paxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070d1f', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Area type="monotone" dataKey="passengers" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#paxGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay Reason Breakdown Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Delay Attribution Breakdown
          </h2>

          <div className="w-full h-44 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={delayCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {delayCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#070d1f', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            {delayCategories.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-300 font-sans">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Occupancy Hours Bar Chart (12 cols) */}
        <div className="lg:col-span-12 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Individual Gate Utilization (Total Docking Hours Today)
          </h2>

          <div className="w-full h-48 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gateUsageData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="gate" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070d1f', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#a855f7' }}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
