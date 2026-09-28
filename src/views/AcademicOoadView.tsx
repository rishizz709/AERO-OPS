import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import {
  GraduationCap,
  Layers,
  BookOpen,
  Award,
  CheckCircle2,
  FileCode2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AcademicOoadView: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<string>('CLASS');

  const authors = [
    { name: 'B. Rishi Vardhan', roll: '24B11AI051', role: 'Airport Operations Lead / Architect' },
    { name: 'K. Ashok Kumar', roll: '24B11AI160', role: 'Baggage Operations & Reconciliation' },
    { name: 'K. Satya Sree', roll: '24B11AI180', role: 'Passenger & Check-in Systems' },
    { name: 'T. Koushik', roll: '24B11AI427', role: 'Airside & Air Traffic Control (ATC)' }
  ];

  return (
    <div className="space-y-5">
      {/* Aditya University Academic Header */}
      <div className="p-6 bg-gradient-to-r from-[#0C1838] via-[#1A184D] to-[#0C1838] border-2 border-purple-500/40 rounded-2xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
                ADITYA UNIVERSITY • DEPT OF AI & ML
              </span>
              <span className="text-xs text-slate-400 font-mono">ACADEMIC OOAD REVIEW 1</span>
            </div>
            <h1 className="text-xl font-black text-white font-display tracking-tight">
              OBJECT ORIENTED ANALYSIS & DESIGN (OOAD) USING UML
            </h1>
            <p className="text-xs text-slate-300">
              Complete Software Architecture, Domain Classes, and Relational Implementation for Airport Management System
            </p>
          </div>

          <div className="p-3 bg-purple-950/60 border border-purple-500/30 rounded-xl text-center">
            <span className="text-[10px] text-purple-300 block font-mono">IMPLEMENTATION STATUS</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1 font-mono justify-center">
              <CheckCircle2 className="w-4 h-4" /> 100% COMPATIBLE
            </span>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-purple-800/50">
          {authors.map((author, idx) => (
            <div key={idx} className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300 text-xs">
                {author.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="font-bold text-white text-xs truncate">{author.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">{author.roll}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagrams Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0E1A38] p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
        {[
          { id: 'OBJECT', label: 'Object Diagram (Snapshot Scenario)' },
          { id: 'CLASS', label: 'Class Diagram (Domain Architecture)' },
          { id: 'USE_CASE', label: 'Use Case Diagram' },
          { id: 'SEQUENCE', label: 'System & High-Level Sequence' },
          { id: 'ACTIVITY', label: 'Activity Diagram (Workflow)' },
          { id: 'DEPLOYMENT', label: 'Deployment & Component Diagrams' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDiagram(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              activeDiagram === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Diagram Viewer Panel */}
      <div className="bg-[#0E1A38] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-slate-200">
        {activeDiagram === 'OBJECT' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Object Diagram (Booking Snapshot Scenario from Presentation)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                This exact instance snapshot from the presentation is modeled live and running inside our AODB state engine:
              </p>
            </div>

            {/* Object Diagram Visual Representation */}
            <div className="p-6 bg-[#081124] rounded-2xl border border-slate-800 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Airport Object */}
                <div className="p-3 bg-blue-950/80 border-2 border-blue-500 rounded-xl font-mono text-xs w-64 text-center shadow-lg">
                  <div className="font-bold text-white underline">hyd : Airport</div>
                  <div className="text-slate-300 mt-1">code = "HYD"</div>
                  <div className="text-slate-300">name = "Hyderabad Intl"</div>
                </div>

                <div className="w-0.5 h-6 bg-blue-500" />

                {/* Flight Object */}
                <div className="p-3 bg-cyan-950/80 border-2 border-cyan-400 rounded-xl font-mono text-xs w-64 text-center shadow-lg">
                  <div className="font-bold text-white underline">ai101 : Flight</div>
                  <div className="text-slate-300 mt-1">flightNo = "AI-101"</div>
                  <div className="text-slate-300">source = "HYD" | dest = "DEL"</div>
                  <div className="text-emerald-400 font-bold">status = "Turnaround"</div>
                </div>

                {/* Branch to Aircraft, Gate, Booking */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-2">
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">a320 : Aircraft</div>
                    <div className="text-slate-300 mt-1">model = "Airbus A320"</div>
                    <div className="text-slate-300">capacity = 180</div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">g3 : Gate</div>
                    <div className="text-slate-300 mt-1">gateNo = "G3" (G03)</div>
                    <div className="text-slate-300">terminal = "T1"</div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">bk501 : Booking</div>
                    <div className="text-cyan-300 mt-1">bookingId = "BK-501"</div>
                    <div className="text-emerald-400 font-bold">status = "Confirmed"</div>
                  </div>
                </div>

                {/* Links from Booking to Ticket, Payment, Passenger, Baggage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-2">
                  <div className="p-3 bg-slate-900/90 border border-purple-500/40 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">ravi : Passenger</div>
                    <div className="text-slate-300 mt-1">name = "Ravi Kumar"</div>
                    <div className="text-slate-400">passport = "N1234567"</div>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-purple-500/40 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">tk12A : Ticket</div>
                    <div className="text-slate-300 mt-1">ticketNo = "TK-12A"</div>
                    <div className="text-cyan-300 font-bold">seatNo = "12A"</div>
                    <div className="text-slate-400">fare = 5200.0</div>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-purple-500/40 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">pay900 : Payment</div>
                    <div className="text-slate-300 mt-1">amount = 5200.0</div>
                    <div className="text-slate-400">mode = "UPI"</div>
                    <div className="text-emerald-400 font-bold">status = "Success"</div>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-purple-500/40 rounded-xl font-mono text-xs text-center">
                    <div className="font-bold text-white underline">bag77 : Baggage</div>
                    <div className="text-slate-300 mt-1">baggageId = "BAG-1001"</div>
                    <div className="text-slate-300">weight = 18.5 kg</div>
                    <div className="text-emerald-400 font-bold">status = "LOADING"</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-xl text-xs space-y-1">
              <span className="font-bold text-cyan-300 font-mono">Verification against System Runtime:</span>
              <p className="text-slate-300">
                You can verify this live: Go to <strong>Check-in Desk</strong>, search for <strong>BK-501</strong>, and see passenger <strong>Ravi Kumar</strong> with <strong>Seat 12A</strong>, <strong>Baggage 18.5kg</strong>, and generated <strong>Boarding Pass BP-881</strong>.
              </p>
            </div>
          </div>
        )}

        {activeDiagram === 'CLASS' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white font-mono">
              Domain Class Diagram (Entities, Boundary, Controller Architecture)
            </h2>
            <p className="text-xs text-slate-400">
              The project encapsulates 12 core OOAD classes with aggregation, composition, and inheritance:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1.5">
                <div className="font-bold text-cyan-300 underline">Flight (Entity)</div>
                <div className="text-slate-400 text-[11px]">- flightNo: String<br/>- source, destination: String<br/>- departureTime, arrivalTime: Date<br/>- status: String</div>
                <div className="text-emerald-400 text-[11px]">+ schedule()<br/>+ updateStatus()<br/>+ checkAvailability()</div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1.5">
                <div className="font-bold text-cyan-300 underline">Booking (Composition)</div>
                <div className="text-slate-400 text-[11px]">- bookingId: String<br/>- bookingDate: Date<br/>- status: String</div>
                <div className="text-emerald-400 text-[11px]">+ createBooking()<br/>+ cancelBooking()</div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 space-y-1.5">
                <div className="font-bold text-cyan-300 underline">Staff (Abstract Hierarchy)</div>
                <div className="text-slate-400 text-[11px]">- staffId, name, role: String<br/>Subclasses:<br/>• CheckInAgent<br/>• GroundStaff<br/>• Administrator<br/>• AirTrafficController</div>
                <div className="text-emerald-400 text-[11px]">+ login()<br/>+ handleOperations()</div>
              </div>
            </div>
          </div>
        )}

        {activeDiagram === 'USE_CASE' && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white font-mono">Use Case Model (5 Actors & Mandatory Sub-functions)</h2>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <span>1. Passenger:</span>
                <span className="text-slate-300 font-normal">Search Flight, Book Ticket («include» Make Payment), Web Check-in («extend» Generate Boarding Pass), Track Baggage</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <span>2. Check-in Agent:</span>
                <span className="text-slate-300 font-normal">Check-in Passenger («include» Verify Passenger, «include» Assign Seat), Accept Baggage</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <span>3. Ground Staff:</span>
                <span className="text-slate-300 font-normal">Handle Baggage, Turnaround Servicing (Refueling, Catering, Cleaning)</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <span>4. Air Traffic Controller:</span>
                <span className="text-slate-300 font-normal">Assign Gate & Runway, Update Flight Status, Monitor Separation</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <span>5. Administrator:</span>
                <span className="text-slate-300 font-normal">Manage Flight Schedule, Manage Staff, Generate Reports, Oversee Operations Center</span>
              </div>
            </div>
          </div>
        )}

        {activeDiagram === 'SEQUENCE' && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white font-mono">Sequence & Three-Layer Architecture (Boundary / Control / Entity)</h2>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <p className="text-slate-300 font-sans">
                The flow follows the strict Boundary-Control-Entity pattern from the slide deck:
              </p>
              <div className="p-3 bg-black/40 rounded-lg text-slate-300 space-y-1">
                <div>Passenger → <strong>BookingUI (Boundary)</strong>: bookTicket(details)</div>
                <div>BookingUI → <strong>BookingController (Control)</strong>: requestBooking(details)</div>
                <div>BookingController → <strong>Flight (Entity)</strong>: checkAvailability(flightNo)</div>
                <div>BookingController → <strong>Booking (Entity)</strong>: createBooking()</div>
                <div>BookingController → <strong>Payment (Entity)</strong>: processPayment(amount)</div>
                <div>BookingController → <strong>Ticket (Entity)</strong>: generateTicket(bookingId)</div>
                <div>BookingUI ← Passenger: showTicket(ticketNo, seatNo)</div>
              </div>
            </div>
          </div>
        )}

        {activeDiagram === 'ACTIVITY' && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white font-mono">Activity Diagram (Dynamic Workflow)</h2>
            <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>Search Flight → Decision: Flights Available? (Yes/No) → Select Flight → Enter Passenger Details → Make Payment → Decision: Payment Successful? (Yes/No) → Generate Ticket → Web Check-in → Assign Seat → Generate Boarding Pass → Send Confirmation.</p>
            </div>
          </div>
        )}

        {activeDiagram === 'DEPLOYMENT' && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white font-mono">Physical Deployment & Component Diagram</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                <span className="font-bold text-cyan-300 block">Client Device «device»</span>
                <span className="text-slate-400">Web Browser / Mobile / Kiosk UI (React 18, TypeScript, Tailwind)</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                <span className="font-bold text-purple-300 block">Application Server «device»</span>
                <span className="text-slate-400">Node.js Express AOCC / AODB Operational Platform</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                <span className="font-bold text-emerald-300 block">Database Server «database»</span>
                <span className="text-slate-400">Relational AODB (Flight, Passenger, Booking, Baggage, Gate, Runway)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
