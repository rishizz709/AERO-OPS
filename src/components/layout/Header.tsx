import React, { useState } from 'react';
import { useAodb } from '../../context/AodbContext';
import { UserRole } from '../../types';
import {
  Clock,
  CloudSun,
  Plane,
  Luggage,
  Users,
  ShieldAlert,
  Search,
  Play,
  RotateCcw,
  Zap,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

const ROLES: UserRole[] = [
  'Airport Operations Manager',
  'Airport Administrator',
  'Flight Operations Officer',
  'Ground Operations Staff',
  'Baggage Staff',
  'Check-in Agent',
  'Air Traffic Controller',
  'Terminal Operations',
  'Maintenance Staff',
  'Passenger'
];

export const Header: React.FC = () => {
  const {
    stats,
    activeRole,
    setActiveRole,
    setIsSearchOpen,
    advanceSimulation,
    triggerDisruption,
    resetScenarioAI101,
    activeRoute,
    setActiveRoute
  } = useAodb();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [simMenuOpen, setSimMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL OPERATIONS':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'WEATHER WARNING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30 animate-pulse';
      case 'DISRUPTION ALERT':
      case 'HIGH CONGESTION':
        return 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A1128]/95 backdrop-blur-md border-b border-slate-800 text-slate-200">
      {/* Top Operations Status Bar (Section 4) */}
      <div className="px-4 py-2 bg-[#070D1F] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Airport Status & Time */}
        <div className="flex items-center space-x-4">
          <div className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 ${getStatusColor(stats.airportStatus)}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span className="font-mono tracking-wide">{stats.airportStatus}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white font-bold text-sm tracking-widest">{stats.simulatedTime}</span>
            <span className="text-slate-500 text-[11px]">IST</span>
            <span className="text-slate-400 border-l border-slate-700 pl-2">{stats.simulatedDate}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>HYD (RGIA): {stats.weather.tempC}°C, {stats.weather.condition}</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono">WND: {stats.weather.windDirectionDeg}°/{stats.weather.windSpeedKts}kt</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono">VIS: {stats.weather.visibilityKm}km</span>
          </div>
        </div>

        {/* Right: Key Capacity Tickers */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400 font-sans">Runways:</span>
            <span className="text-emerald-400 font-bold">{stats.runwaysAvailable} Avail</span>
            <span className="text-amber-400">({stats.runwaysOccupied} Occ)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400 font-sans">Gates:</span>
            <span className="text-emerald-400 font-bold">{stats.gatesAvailable} Avail</span>
            <span className="text-amber-400">({stats.gatesOccupied} Occ)</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
            <span>{stats.flightsToday} Flights</span>
            <span className="text-slate-500">({stats.arrivalsToday}A/{stats.departuresToday}D)</span>
            {stats.delayedFlights > 0 && (
              <span className="text-orange-400 font-bold bg-orange-950/60 px-1.5 py-0.5 rounded border border-orange-800/60">
                {stats.delayedFlights} Delayed
              </span>
            )}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{stats.passengersToday.toLocaleString()} Pax</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-slate-300">
            <Luggage className="w-3.5 h-3.5 text-purple-400" />
            <span>{stats.baggageProcessed.toLocaleString()} Bags</span>
          </div>
        </div>
      </div>

      {/* Main Action Header */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Airport Identity & Quick Navigation Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRoute('/operations-center')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/30 text-white font-black text-sm">
              AMS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white font-display">AERO-OPS</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">AOCC/AODB</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">Hyderabad RGIA Digital Command</p>
            </div>
          </div>

          {/* Quick tab highlights */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs">
            <button
              onClick={() => setActiveRoute('/operations-center')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeRoute === '/operations-center' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Operations Center
            </button>
            <button
              onClick={() => setActiveRoute('/airport-map')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeRoute === '/airport-map' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Airport Map
            </button>
            <button
              onClick={() => setActiveRoute('/flights')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeRoute === '/flights' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Live Flights
            </button>
            <button
              onClick={() => setActiveRoute('/turnaround')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeRoute === '/turnaround' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Turnaround (AI-101)
            </button>
            <button
              onClick={() => setActiveRoute('/baggage')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                activeRoute === '/baggage' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Baggage
            </button>
            <button
              onClick={() => setActiveRoute('/academic-ooad')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeRoute === '/academic-ooad' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-purple-300 hover:bg-purple-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Aditya Univ OOAD Spec
            </button>
          </nav>
        </div>

        {/* Center / Right: Global Search & Simulation Controls & Role Selector */}
        <div className="flex items-center gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-400 text-xs hover:border-cyan-500/60 transition shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search flights, bags, gates, pax...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[10px] font-mono">
              Ctrl+K
            </kbd>
          </button>

          {/* Simulation Tools Menu */}
          <div className="relative">
            <button
              onClick={() => setSimMenuOpen(!simMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-600/40 rounded-lg text-xs font-semibold text-blue-200 hover:border-blue-400 transition"
              title="AOCC Simulation Engine Controls"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Simulation</span>
              <ChevronDown className="w-3 h-3 text-blue-300" />
            </button>

            {simMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-[#0E1A38] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1"
                onMouseLeave={() => setSimMenuOpen(false)}
              >
                <div className="px-2 py-1 border-b border-slate-800 font-semibold text-slate-300 flex items-center justify-between">
                  <span>AOCC Simulation Controls</span>
                  <span className="text-[10px] font-mono text-cyan-400">LIVE MODE</span>
                </div>
                <button
                  onClick={() => { advanceSimulation(10); setSimMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 flex items-center gap-2 text-slate-200"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="font-medium">Step Forward +10 Mins</div>
                    <div className="text-[10px] text-slate-400">Advance clock & turnaround steps</div>
                  </div>
                </button>
                <button
                  onClick={() => { advanceSimulation(30); setSimMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800/80 flex items-center gap-2 text-slate-200"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <div>
                    <div className="font-medium">Step Forward +30 Mins</div>
                    <div className="text-[10px] text-slate-400">Accelerate ground flow & queues</div>
                  </div>
                </button>
                <div className="my-1 border-t border-slate-800/60" />
                <button
                  onClick={() => { triggerDisruption('WEATHER'); setSimMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-red-950/40 flex items-center gap-2 text-red-300"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <div>
                    <div className="font-medium">Simulate Severe Thunderstorm</div>
                    <div className="text-[10px] text-slate-400">Triggers ground hold & flight delays</div>
                  </div>
                </button>
                <button
                  onClick={() => { triggerDisruption('RUNWAY_CLOSURE'); setSimMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-amber-950/40 flex items-center gap-2 text-amber-300"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="font-medium">Simulate Runway 27 FOD Closure</div>
                    <div className="text-[10px] text-slate-400">Re-route arrivals to Runway 09</div>
                  </div>
                </button>
                <button
                  onClick={() => { triggerDisruption('BAGGAGE_JAM'); setSimMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-amber-950/40 flex items-center gap-2 text-amber-300"
                >
                  <Luggage className="w-3.5 h-3.5 text-orange-400" />
                  <div>
                    <div className="font-medium">Simulate Belt B2 Sorter Jam</div>
                    <div className="text-[10px] text-slate-400">Generates exception for AI-101 bags</div>
                  </div>
                </button>
                <div className="my-1 border-t border-slate-800/60" />
                <button
                  onClick={() => { resetScenarioAI101(); setSimMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-cyan-950/40 flex items-center gap-2 text-cyan-300 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <div>Reset AI-101 Scenario</div>
                    <div className="text-[10px] text-slate-400">Restore exact OOAD presentation snapshot</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher (Section 37) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-xs transition"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <div className="text-left hidden md:block">
                <div className="text-[9px] text-slate-400 uppercase leading-none">Actor Role</div>
                <div className="font-semibold text-white truncate max-w-[130px]">{activeRole}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-[#0E1A38] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  Switch Operational Actor
                </div>
                <div className="py-1 max-h-72 overflow-y-auto space-y-0.5">
                  {ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition ${
                        activeRole === role ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{role}</span>
                      {activeRole === role && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
