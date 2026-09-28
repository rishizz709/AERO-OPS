import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { Flight, Booking } from '../types';
import {
  Ticket,
  Search,
  Plane,
  CreditCard,
  QrCode,
  CheckCircle2,
  Luggage,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const PassengerPortalView: React.FC = () => {
  const { flights, bookFlight, bookings, baggage, setActiveRoute } = useAodb();

  const [activeTab, setActiveTab] = useState<'SEARCH' | 'MY_BOOKINGS' | 'TRACK_BAG'>('SEARCH');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(flights[0]);
  const [paxName, setPaxName] = useState('Ananya Reddy');
  const [passportNo, setPassportNo] = useState('A9912044');
  const [travelClass, setTravelClass] = useState<'Economy' | 'Business'>('Economy');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Card'>('UPI');
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);

  // Luggage tracking state
  const [bagTrackId, setBagTrackId] = useState('BAG-1001');
  const matchedBag = baggage.find(b => b.baggageId.toLowerCase() === bagTrackId.toLowerCase().trim());

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlight || !paxName || !passportNo) return;
    const bk = bookFlight(selectedFlight.flightNo, paxName, passportNo, travelClass);
    if (bk) {
      setBookingSuccess(bk);
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-4 bg-[#0E1A38] border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display">
              PASSENGER SELF-SERVICE PORTAL (SUPPORTING MODULE)
            </h1>
            <p className="text-xs text-slate-400">
              Flight reservation simulation, mock UPI checkout, luggage tracking, and web check-in gateway
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('SEARCH')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'SEARCH' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
          >
            Book Flights
          </button>
          <button
            onClick={() => setActiveTab('MY_BOOKINGS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'MY_BOOKINGS' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('TRACK_BAG')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${activeTab === 'TRACK_BAG' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
          >
            Track Luggage
          </button>
        </div>
      </div>

      {activeTab === 'SEARCH' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Available Flights List (7 cols) */}
          <div className="lg:col-span-7 bg-[#0E1A38] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Select Scheduled Departure from Hyderabad (HYD)
            </h2>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {flights.filter(f => f.type === 'Departure').map(flight => (
                <div
                  key={flight.flightNo}
                  onClick={() => setSelectedFlight(flight)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedFlight?.flightNo === flight.flightNo ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{flight.flightNo}</span>
                      <span className="text-slate-400 font-sans">{flight.airline}</span>
                    </div>
                    <span className="font-bold text-emerald-400 text-sm">₹{flight.fareBase.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <div>
                      <div className="font-bold text-white text-sm">{flight.std}</div>
                      <div className="text-[10px] text-slate-500 font-sans">HYD (Terminal {flight.terminal})</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-[10px] text-slate-500 font-sans">Non-Stop</div>
                      <Plane className="w-4 h-4 text-cyan-400 mx-auto" />
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-sm">{flight.destination}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{flight.destinationCity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking & Simulated Checkout (5 cols) */}
          <div className="lg:col-span-5 bg-[#0E1A38] border border-cyan-500/40 rounded-2xl p-4 shadow-xl space-y-4">
            {bookingSuccess ? (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded-xl space-y-3 text-center text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-white text-base">Booking Confirmed!</h3>
                <p className="text-slate-300">
                  Your electronic reservation is recorded in the Central AODB database.
                </p>
                <div className="p-3 bg-black/40 rounded-lg text-left font-mono space-y-1 text-slate-200">
                  <div>Booking ID: <strong className="text-cyan-300">{bookingSuccess.bookingId}</strong></div>
                  <div>Ticket No: <strong className="text-white">{bookingSuccess.ticketNo}</strong></div>
                  <div>Flight: <strong className="text-white">{bookingSuccess.flightNo}</strong></div>
                  <div>Total Paid: <strong className="text-emerald-400">₹{bookingSuccess.totalFare}</strong></div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveRoute('/check-in')}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
                  >
                    Proceed to Web Check-in →
                  </button>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : selectedFlight ? (
              <form onSubmit={handleBooking} className="space-y-3 text-xs">
                <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-800">
                  Simulated Passenger Checkout ({selectedFlight.flightNo})
                </h3>

                <div className="space-y-1">
                  <label className="text-slate-400">Passenger Full Name *</label>
                  <input
                    type="text"
                    required
                    value={paxName}
                    onChange={(e) => setPaxName(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Passport / Government ID *</label>
                  <input
                    type="text"
                    required
                    value={passportNo}
                    onChange={(e) => setPassportNo(e.target.value)}
                    className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">Travel Class</label>
                    <select
                      value={travelClass}
                      onChange={(e) => setTravelClass(e.target.value as any)}
                      className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business (2.2x)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Payment Simulation</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value as any)}
                      className="w-full bg-[#081226] border border-slate-700 rounded-lg p-2 text-white outline-none"
                    >
                      <option value="UPI">Simulated UPI (GPay/PhonePe)</option>
                      <option value="Card">Simulated Credit Card</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                  <span className="text-slate-400 font-sans">Total Fare Amount:</span>
                  <span className="font-bold text-base text-emerald-400">
                    ₹{(travelClass === 'Business' ? selectedFlight.fareBase * 2.2 : selectedFlight.fareBase).toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-cyan-950 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Simulate Payment & Book Ticket</span>
                </button>
              </form>
            ) : null}
          </div>
        </div>
      )}

      {activeTab === 'MY_BOOKINGS' && (
        <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Active Confirmed Bookings in Central AODB
          </h2>

          <div className="space-y-2">
            {bookings.map(bk => (
              <div key={bk.bookingId} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-cyan-300 text-sm">{bk.bookingId}</span>
                  <span className="text-slate-400 ml-2">Ticket: {bk.ticketNo}</span>
                  <div className="text-[11px] text-slate-300 font-sans mt-0.5">Flight: {bk.flightNo} • {bk.travelClass} Class</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">₹{bk.totalFare}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold text-[10px]">
                    {bk.status}
                  </span>
                  <button
                    onClick={() => setActiveRoute('/check-in')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-sans"
                  >
                    Check-in
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TRACK_BAG' && (
        <div className="p-4 bg-[#0E1A38] border border-slate-800 rounded-2xl shadow-xl space-y-4 max-w-2xl mx-auto text-xs">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono text-center">
            Passenger Luggage RFID Tag Tracker
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={bagTrackId}
              onChange={(e) => setBagTrackId(e.target.value)}
              placeholder="Enter BAG-1001, BAG-1002..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-white outline-none focus:border-cyan-500 uppercase"
            />
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold">
              Track
            </button>
          </div>

          {matchedBag ? (
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-cyan-300 text-sm">{matchedBag.baggageId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {matchedBag.status}
                </span>
              </div>
              <div className="text-slate-300 font-sans">
                Passenger: <strong>{matchedBag.passengerName}</strong> • Flight: <strong>{matchedBag.flightNo}</strong> ({matchedBag.weight}kg)
              </div>
              <div className="text-slate-400">
                Current Location: <strong className="text-white">{matchedBag.currentLocation}</strong>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 font-sans">
                <span className="text-slate-400 font-mono text-[10px] block uppercase">Scan History:</span>
                {matchedBag.journey.map((j, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>{j.stage} ({j.location})</span>
                    <span className="text-slate-500 font-mono">{j.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              No baggage tag found for "{bagTrackId}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
