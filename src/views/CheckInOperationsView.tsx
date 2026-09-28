import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { BoardingPass, Booking } from '../types';
import {
  CheckCircle2,
  Search,
  Users,
  Ticket,
  Luggage,
  Printer,
  QrCode,
  AlertTriangle,
  Plane,
  X
} from 'lucide-react';

export const CheckInOperationsView: React.FC = () => {
  const { bookings, passengers, flights, performCheckIn, boardingPasses } = useAodb();

  const [searchTerm, setSearchTerm] = useState('BK-501'); // Default to presentation scenario!
  const [selectedSeat, setSelectedSeat] = useState('12A');
  const [baggageWeight, setBaggageWeight] = useState('18.5');
  const [generatedPass, setGeneratedPass] = useState<BoardingPass | null>(boardingPasses[0] || null);

  const matchedBooking = bookings.find(b =>
    b.bookingId.toLowerCase() === searchTerm.toLowerCase().trim() ||
    b.passengerId.toLowerCase() === searchTerm.toLowerCase().trim()
  );

  const matchedPassenger = matchedBooking ? passengers.find(p => p.bookingId === matchedBooking.bookingId) : null;
  const matchedFlight = matchedBooking ? flights.find(f => f.flightNo === matchedBooking.flightNo) : null;

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedBooking) return;
    const pass = performCheckIn(matchedBooking.bookingId, selectedSeat, parseFloat(baggageWeight) || 0);
    if (pass) {
      setGeneratedPass(pass);
    }
  };

  // Seat matrix 1-20 rows, A-F
  const SEATS = ['11A', '11B', '11C', '11D', '11E', '11F', '12A', '12B', '12C', '12D', '12E', '12F', '14A', '14B', '14C', '14D', '14E', '14F'];

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              DEPARTURE CHECK-IN & BOARDING PASS DESK
            </h1>
            <p className="text-xs text-slate-400">
              Passenger identity verification, seat allocation, baggage tagging, and IATA boarding card generation
            </p>
          </div>
        </div>

        {/* Presentation scenario button */}
        <button
          onClick={() => { setSearchTerm('BK-501'); setSelectedSeat('12A'); setBaggageWeight('18.5'); }}
          className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-mono font-bold hover:bg-emerald-900/60 transition"
        >
          Load Presentation Scenario: Ravi Kumar (BK-501)
        </button>
      </div>

      {/* Main check-in workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Search & Passenger Verification (6 cols) */}
        <div className="lg:col-span-6 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Search Booking Reference or Passenger ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter BK-501, BK-502, PAX-901..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono uppercase outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchTerm(searchTerm)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
              >
                Search
              </button>
            </div>
          </div>

          {/* Passenger & Booking Details Verification */}
          {matchedBooking && matchedPassenger ? (
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{matchedPassenger.name}</span>
                  <span className="text-slate-400 font-mono">({matchedPassenger.passengerId})</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  matchedBooking.status === 'Checked-In' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {matchedBooking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                <div>Passport: <strong className="text-white">{matchedPassenger.passportNo}</strong></div>
                <div>Booking Ref: <strong className="text-cyan-300">{matchedBooking.bookingId}</strong></div>
                <div>Flight: <strong className="text-white">{matchedBooking.flightNo}</strong></div>
                <div>Travel Class: <strong className="text-white">{matchedBooking.travelClass}</strong></div>
                <div>Fare Paid: <strong className="text-emerald-400">₹{matchedBooking.totalFare}</strong></div>
                <div>Gate: <strong className="text-cyan-300">{matchedFlight?.gateId || 'G03'}</strong></div>
              </div>

              {/* Check-in Form */}
              <form onSubmit={handleCheckIn} className="space-y-3 pt-3 border-t border-slate-800">
                {/* Seat Selector Grid */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">Select Seat (Cabin Map)</label>
                  <div className="grid grid-cols-6 gap-1 font-mono text-center">
                    {SEATS.map(seat => (
                      <button
                        type="button"
                        key={seat}
                        onClick={() => setSelectedSeat(seat)}
                        className={`p-1.5 rounded text-xs font-bold transition border ${
                          selectedSeat === seat
                            ? 'bg-cyan-600 text-white border-cyan-400'
                            : seat === '12A'
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Baggage Weight */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-purple-400" />
                    Baggage Scale Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={baggageWeight}
                    onChange={(e) => setBaggageWeight(e.target.value)}
                    className="w-full p-2 bg-[#081226] border border-slate-700 rounded-lg text-white font-mono text-xs outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={matchedBooking.status === 'Checked-In'}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{matchedBooking.status === 'Checked-In' ? 'Passenger Already Checked-In' : 'Confirm Check-in & Print Boarding Pass'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
              No passenger booking selected. Search for "BK-501" or load the presentation scenario.
            </div>
          )}
        </div>

        {/* Right Column: Printable Boarding Pass Preview (6 cols) */}
        <div className="lg:col-span-6 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-cyan-400" />
              Boarding Pass Document
            </h2>

            {generatedPass && (
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print Card</span>
              </button>
            )}
          </div>

          {generatedPass ? (
            <div className="bg-gradient-to-r from-slate-900 to-[#101b38] border-2 border-cyan-500/50 rounded-2xl p-5 shadow-2xl space-y-4 text-slate-100 font-mono relative overflow-hidden">
              {/* Airline header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                    AI
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-white font-sans">AIR INDIA</span>
                    <span className="text-[10px] text-slate-400 block font-sans">Boarding Pass / Carte d'accès</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold text-base">{generatedPass.flightNo}</span>
                  <span className="text-[10px] text-slate-400 block">Class: ECONOMY</span>
                </div>
              </div>

              {/* Passenger & Flight Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">PASSENGER NAME</span>
                  <span className="font-bold text-white uppercase">{generatedPass.passengerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">SEAT</span>
                  <span className="font-bold text-xl text-cyan-300">{generatedPass.seatNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">GATE</span>
                  <span className="font-bold text-xl text-amber-300">{generatedPass.gateNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">BOARDING TIME</span>
                  <span className="font-bold text-emerald-400">{generatedPass.boardingTime}</span>
                </div>
              </div>

              {/* Route & Terminal */}
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">FROM</span>
                  <span className="font-bold text-base text-white">HYD</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Hyderabad RGIA</span>
                </div>
                <div className="text-center px-4">
                  <Plane className="w-5 h-5 text-cyan-400 mx-auto" />
                  <span className="text-[10px] text-slate-500 font-sans">Terminal {generatedPass.terminal}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">TO</span>
                  <span className="font-bold text-base text-white">DEL</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Delhi IGI</span>
                </div>
              </div>

              {/* 2D Barcode & Verification */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-sans">ETKT: {generatedPass.ticketNo} • SEQ: #{generatedPass.sequenceNo}</div>
                  <div className="text-[9px] text-slate-500 truncate max-w-xs">{generatedPass.barcode}</div>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <QrCode className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
              Boarding card will be rendered here upon successful passenger check-in.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
