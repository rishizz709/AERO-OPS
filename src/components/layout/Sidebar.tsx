import React, { useState } from 'react';
import { useAodb } from '../../context/AodbContext';
import {
  Activity,
  Plane,
  RotateCw,
  MapPin,
  DoorOpen,
  ParkingSquare,
  Compass,
  PlaneTakeoff,
  Users,
  CheckCircle2,
  Ticket,
  Luggage,
  AlertOctagon,
  Gauge,
  Briefcase,
  CalendarCheck,
  Flame,
  AlertTriangle,
  Wrench,
  BarChart3,
  FileSpreadsheet,
  Database,
  History,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  route: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeRoute, setActiveRoute, incidents, flights, stats } = useAodb();
  const [collapsed, setCollapsed] = useState(false);

  const sections: NavSection[] = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Operations Center', route: '/operations-center', icon: Activity, badge: 'AOCC', badgeColor: 'bg-cyan-900/60 text-cyan-300' },
        { label: 'Flight Operations', route: '/flights', icon: Plane, badge: `${flights.length}`, badgeColor: 'bg-slate-800 text-slate-300' },
        { label: 'Turnaround Monitor', route: '/turnaround', icon: RotateCw, badge: 'AI-101', badgeColor: 'bg-emerald-900/60 text-emerald-300' },
        { label: 'Airport Map', route: '/airport-map', icon: MapPin, badge: 'Interactive', badgeColor: 'bg-indigo-900/60 text-indigo-300' },
      ]
    },
    {
      title: 'RESOURCES',
      items: [
        { label: 'Gate Management', route: '/gates', icon: DoorOpen },
        { label: 'Stand / Apron', route: '/stands', icon: ParkingSquare },
        { label: 'Runway Management', route: '/runways', icon: Compass },
        { label: 'Aircraft Fleet', route: '/aircraft', icon: PlaneTakeoff },
      ]
    },
    {
      title: 'PASSENGERS',
      items: [
        { label: 'Check-in Desk', route: '/check-in', icon: CheckCircle2, badge: 'Ravi K.', badgeColor: 'bg-emerald-900/60 text-emerald-300' },
        { label: 'Passenger Manifest', route: '/passengers', icon: Users },
        { label: 'Passenger Portal', route: '/passenger-portal', icon: Ticket },
      ]
    },
    {
      title: 'GROUND & BAGGAGE',
      items: [
        { label: 'Baggage Operations', route: '/baggage', icon: Luggage },
        { label: 'Baggage Exceptions', route: '/baggage-exceptions', icon: AlertOctagon, badge: 'BAG-2041', badgeColor: 'bg-amber-900/60 text-amber-300' },
      ]
    },
    {
      title: 'TERMINAL',
      items: [
        { label: 'Passenger Flow', route: '/passenger-flow', icon: Gauge },
        { label: 'Terminal Assets', route: '/terminal', icon: Briefcase },
      ]
    },
    {
      title: 'PEOPLE',
      items: [
        { label: 'Staff Operations', route: '/staff', icon: Briefcase },
        { label: 'Shift Roster', route: '/shifts', icon: CalendarCheck },
      ]
    },
    {
      title: 'CONTROL & CRISIS',
      items: [
        { label: 'Incidents & Alerts', route: '/incidents', icon: Flame, badge: `${stats.openIncidents}`, badgeColor: 'bg-red-900/60 text-red-300' },
        { label: 'Disruption Center', route: '/disruptions', icon: AlertTriangle },
        { label: 'Maintenance Assets', route: '/maintenance', icon: Wrench },
      ]
    },
    {
      title: 'INSIGHTS & SYSTEM',
      items: [
        { label: 'Analytics Scorecard', route: '/analytics', icon: BarChart3 },
        { label: 'Daily Reports', route: '/reports', icon: FileSpreadsheet },
        { label: 'AODB Central DB', route: '/aodb', icon: Database },
        { label: 'Audit Trail Logs', route: '/audit-logs', icon: History },
      ]
    },
    {
      title: 'UML SPEC (ADITYA UNIV)',
      items: [
        { label: 'Academic OOAD Model', route: '/academic-ooad', icon: GraduationCap, badge: 'Verified', badgeColor: 'bg-purple-900/70 text-purple-300' },
      ]
    }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#070D1F] border-r border-slate-800 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition shadow-md z-40"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {sections.map(section => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {section.title}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => setActiveRoute(item.route)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700/50 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Info badge */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">AERO-OPS v2.4</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">
            Aditya University OOAD Project
          </div>
        </div>
      )}
    </aside>
  );
};
