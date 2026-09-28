import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import {
  Database,
  Table,
  Layers,
  Key,
  Link,
  Search,
  CheckCircle2,
  FileCode2
} from 'lucide-react';

export const AodbDatabaseView: React.FC = () => {
  const { flights, passengers, bookings, baggage, gates, stands, runways, staff, incidents, aircraft } = useAodb();

  const tables = [
    { name: 'flights', count: flights.length, pk: 'flight_no', description: 'Core operational schedule and real-time flight telemetry' },
    { name: 'aircraft', count: aircraft.length, pk: 'registration', description: 'Airframe registrations, models, airlines, and fuel states' },
    { name: 'stands', count: stands.length, pk: 'stand_id', description: 'Apron parking stands with widebody/narrowbody compatibility' },
    { name: 'gates', count: gates.length, pk: 'gate_no', description: 'Passenger boarding lounges and jetbridge connections' },
    { name: 'runways', count: runways.length, pk: 'runway_id', description: 'Airfield landing/takeoff strips and ILS categories' },
    { name: 'passengers', count: passengers.length, pk: 'passenger_id', description: 'Passenger profiles, passports, and journey progression' },
    { name: 'bookings', count: bookings.length, pk: 'booking_id', description: 'Reservations, travel class, and ticket foreign links' },
    { name: 'baggage', count: baggage.length, pk: 'baggage_id', description: 'IATA Res 753 luggage tracking and exception records' },
    { name: 'staff', count: staff.length, pk: 'staff_id', description: 'Airport department personnel and shift assignments' },
    { name: 'incidents', count: incidents.length, pk: 'incident_id', description: 'Operational bottlenecks, failures, and resolution history' }
  ];

  const [selectedTable, setSelectedTable] = useState(tables[0].name);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              AIRPORT OPERATIONAL DATABASE (AODB) SCHEMA EXPLORER
            </h1>
            <p className="text-xs text-slate-400">
              The single centralized source of truth connecting all 10 airport operational modules
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400 text-[10px] block">DATABASE ENGINE</span>
          <span className="text-cyan-400 font-bold">PostgreSQL / MySQL Normalized</span>
        </div>
      </div>

      {/* Relational Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {tables.map(tbl => (
          <div
            key={tbl.name}
            onClick={() => setSelectedTable(tbl.name)}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              selectedTable === tbl.name ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/30' : 'bg-[#0E1A38] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-sm text-white">{tbl.name}</span>
              <span className="text-xs text-cyan-400 font-bold">{tbl.count} rows</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">PK: {tbl.pk}</div>
          </div>
        ))}
      </div>

      {/* Schema & Entity Browser */}
      <div className="bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            Table Definition: <span className="text-cyan-300">{selectedTable}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">3NF Normalized Relational Entity</span>
        </div>

        {selectedTable === 'flights' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-[#081226] text-[10px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Column Name</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Key / Constraint</th>
                  <th className="py-2 px-3">Sample Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">flight_no</td><td className="py-2 px-3">VARCHAR(10)</td><td className="py-2 px-3 text-amber-400 font-bold">PRIMARY KEY</td><td className="py-2 px-3 text-white">AI-101</td></tr>
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">airline_code</td><td className="py-2 px-3">VARCHAR(4)</td><td className="py-2 px-3 text-slate-400">FOREIGN KEY (airlines)</td><td className="py-2 px-3 text-white">AI</td></tr>
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">aircraft_reg</td><td className="py-2 px-3">VARCHAR(12)</td><td className="py-2 px-3 text-slate-400">FOREIGN KEY (aircraft)</td><td className="py-2 px-3 text-white">VT-ABC</td></tr>
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">stand_id</td><td className="py-2 px-3">VARCHAR(6)</td><td className="py-2 px-3 text-slate-400">FOREIGN KEY (stands)</td><td className="py-2 px-3 text-white">S05</td></tr>
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">gate_id</td><td className="py-2 px-3">VARCHAR(6)</td><td className="py-2 px-3 text-slate-400">FOREIGN KEY (gates)</td><td className="py-2 px-3 text-white">G03</td></tr>
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">runway_id</td><td className="py-2 px-3">VARCHAR(8)</td><td className="py-2 px-3 text-slate-400">FOREIGN KEY (runways)</td><td className="py-2 px-3 text-white">RWY 09</td></tr>
                <tr><td className="py-2 px-3 text-cyan-300 font-bold">status</td><td className="py-2 px-3">ENUM</td><td className="py-2 px-3 text-slate-400">NOT NULL</td><td className="py-2 px-3 text-emerald-400">Turnaround</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {selectedTable !== 'flights' && (
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
            <p>Entity <strong>{selectedTable}</strong> is active in AODB with relational foreign key cascading into flight operations and real-time event tickers.</p>
          </div>
        )}
      </div>
    </div>
  );
};
