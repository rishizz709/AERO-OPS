import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Flight,
  Aircraft,
  Gate,
  Stand,
  Runway,
  Baggage,
  Passenger,
  Booking,
  Ticket,
  Payment,
  BoardingPass,
  Staff,
  TerminalAreaFlow,
  Incident,
  OperationalAlert,
  MaintenanceAsset,
  AuditLog,
  FlightTurnaround,
  AirportStats,
  UserRole
} from '../types';
import {
  INITIAL_AIRPORT_STATS,
  INITIAL_FLIGHTS,
  INITIAL_GATES,
  INITIAL_STANDS,
  INITIAL_RUNWAYS,
  INITIAL_AIRCRAFT,
  INITIAL_PASSENGERS,
  INITIAL_BOOKINGS,
  INITIAL_TICKETS,
  INITIAL_PAYMENTS,
  INITIAL_BOARDING_PASSES,
  INITIAL_BAGGAGE,
  INITIAL_STAFF,
  INITIAL_TERMINAL_FLOW,
  INITIAL_INCIDENTS,
  INITIAL_ALERTS,
  INITIAL_MAINTENANCE,
  INITIAL_AUDIT_LOGS,
  INITIAL_TURNAROUND_AI101
} from '../services/mockData';

interface AodbContextType {
  stats: AirportStats;
  flights: Flight[];
  gates: Gate[];
  stands: Stand[];
  runways: Runway[];
  aircraft: Aircraft[];
  passengers: Passenger[];
  bookings: Booking[];
  tickets: Ticket[];
  payments: Payment[];
  boardingPasses: BoardingPass[];
  baggage: Baggage[];
  staff: Staff[];
  terminalFlow: TerminalAreaFlow[];
  incidents: Incident[];
  alerts: OperationalAlert[];
  maintenance: MaintenanceAsset[];
  auditLogs: AuditLog[];
  turnaroundAI101: FlightTurnaround;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  notification: { message: string; type: 'success' | 'warning' | 'error' | 'info' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'warning' | 'error' | 'info' } | null) => void;
  // Operations
  updateFlightStatus: (flightNo: string, status: Flight['status'], delayMinutes?: number) => void;
  assignGate: (flightNo: string, gateNo: string) => boolean;
  assignStand: (flightNo: string, standId: string) => boolean;
  assignRunway: (flightNo: string, runwayId: string) => boolean;
  scheduleFlight: (newFlight: Partial<Flight>) => boolean;
  advanceTurnaroundStep: (stepIndex: number) => void;
  updateBaggageStage: (baggageId: string, nextStage: Baggage['status'], location?: string) => void;
  resolveBaggageException: (baggageId: string, resolutionNotes: string) => void;
  performCheckIn: (bookingId: string, seatNo: string, baggageWeight?: number) => BoardingPass | null;
  bookFlight: (flightNo: string, passengerName: string, passportNo: string, travelClass: 'Economy' | 'Business') => Booking | null;
  createIncident: (incident: Partial<Incident>) => void;
  resolveIncident: (incidentId: string, resolution: string) => void;
  advanceSimulation: (minutes: number) => void;
  triggerDisruption: (type: 'WEATHER' | 'RUNWAY_CLOSURE' | 'BAGGAGE_JAM') => void;
  resetScenarioAI101: () => void;
}

const AodbContext = createContext<AodbContextType | undefined>(undefined);

export const AodbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<AirportStats>(INITIAL_AIRPORT_STATS);
  const [flights, setFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  const [gates, setGates] = useState<Gate[]>(INITIAL_GATES);
  const [stands, setStands] = useState<Stand[]>(INITIAL_STANDS);
  const [runways, setRunways] = useState<Runway[]>(INITIAL_RUNWAYS);
  const [aircraft, setAircraft] = useState<Aircraft[]>(INITIAL_AIRCRAFT);
  const [passengers, setPassengers] = useState<Passenger[]>(INITIAL_PASSENGERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [boardingPasses, setBoardingPasses] = useState<BoardingPass[]>(INITIAL_BOARDING_PASSES);
  const [baggage, setBaggage] = useState<Baggage[]>(INITIAL_BAGGAGE);
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);
  const [terminalFlow, setTerminalFlow] = useState<TerminalAreaFlow[]>(INITIAL_TERMINAL_FLOW);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [maintenance, setMaintenance] = useState<MaintenanceAsset[]>(INITIAL_MAINTENANCE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [turnaroundAI101, setTurnaroundAI101] = useState<FlightTurnaround>(INITIAL_TURNAROUND_AI101);

  const [activeRole, setActiveRole] = useState<UserRole>('Airport Operations Manager');
  const [activeRoute, setActiveRoute] = useState<string>('/operations-center');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Auto clear notification after 4s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Real-time second clock tick for realistic operations room feel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const [hh, mm, ss] = prev.simulatedTime.split(':').map(Number);
        const newSec = (ss + 1) % 60;
        const newMin = newSec === 0 ? (mm + 1) % 60 : mm;
        const newHr = newSec === 0 && newMin === 0 ? (hh + 1) % 24 : hh;
        return {
          ...prev,
          simulatedTime: `${String(newHr).padStart(2, '0')}:${String(newMin).padStart(2, '0')}:${String(newSec).padStart(2, '0')}`
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addAudit = (action: string, entity: string, oldValue: string, newValue: string) => {
    const newLog: AuditLog = {
      logId: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: stats.simulatedTime,
      user: activeRole === 'Airport Administrator' ? 'B. Rishi Vardhan' : activeRole,
      role: activeRole,
      action,
      entity,
      oldValue,
      newValue
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateFlightStatus = (flightNo: string, newStatus: Flight['status'], delayMinutes?: number) => {
    setFlights(prev =>
      prev.map(f => {
        if (f.flightNo === flightNo) {
          const oldStatus = f.status;
          const updatedDelay = delayMinutes !== undefined ? delayMinutes : f.delayMinutes;
          addAudit('FLIGHT_STATUS_UPDATE', `Flight ${flightNo}`, `${oldStatus} (Delay: ${f.delayMinutes}m)`, `${newStatus} (Delay: ${updatedDelay}m)`);
          return {
            ...f,
            status: newStatus,
            delayMinutes: updatedDelay,
            alert: updatedDelay > 15 ? `Flight delay of ${updatedDelay}m reported` : undefined
          };
        }
        return f;
      })
    );
    setNotification({ message: `Flight ${flightNo} updated to ${newStatus}`, type: 'success' });
  };

  const assignGate = (flightNo: string, gateNo: string): boolean => {
    // Conflict check: gate must be available or already assigned to this flight
    const targetGate = gates.find(g => g.gateNo === gateNo);
    if (!targetGate) return false;

    if (targetGate.status === 'Maintenance') {
      setNotification({ message: `Cannot assign: Gate ${gateNo} is currently under maintenance!`, type: 'error' });
      return false;
    }

    const conflict = flights.find(f => f.gateId === gateNo && f.flightNo !== flightNo && f.status !== 'Departed' && f.status !== 'Cancelled');
    if (conflict) {
      setNotification({ message: `Conflict Error: Gate ${gateNo} is already occupied by flight ${conflict.flightNo}!`, type: 'error' });
      return false;
    }

    setFlights(prev => prev.map(f => f.flightNo === flightNo ? { ...f, gateId: gateNo } : f));
    setGates(prev => prev.map(g => g.gateNo === gateNo ? { ...g, status: 'Assigned', currentFlightNo: flightNo } : g));
    addAudit('GATE_ALLOCATION', `Gate ${gateNo}`, 'Unassigned', `Assigned to ${flightNo}`);
    setNotification({ message: `Gate ${gateNo} successfully allocated to flight ${flightNo}`, type: 'success' });
    return true;
  };

  const assignStand = (flightNo: string, standId: string): boolean => {
    const flight = flights.find(f => f.flightNo === flightNo);
    const stand = stands.find(s => s.standId === standId);
    if (!flight || !stand) return false;

    if (stand.status === 'Maintenance') {
      setNotification({ message: `Stand ${standId} is currently under maintenance!`, type: 'error' });
      return false;
    }

    // Compatibility rule: Widebody aircraft cannot park at Narrowbody stands
    const isWidebody = flight.aircraftModel.includes('787') || flight.aircraftModel.includes('777') || flight.aircraftModel.includes('350');
    if (isWidebody && stand.type === 'Narrowbody') {
      setNotification({ message: `Incompatibility Error: Widebody aircraft (${flight.aircraftModel}) cannot be assigned to Narrowbody Stand ${standId}!`, type: 'error' });
      return false;
    }

    // Overlapping assignment check
    const conflict = stands.find(s => s.standId === standId && s.currentFlightNo && s.currentFlightNo !== flightNo && s.status === 'Occupied');
    if (conflict) {
      setNotification({ message: `Conflict Error: Stand ${standId} is currently occupied by ${conflict.currentFlightNo}!`, type: 'error' });
      return false;
    }

    setFlights(prev => prev.map(f => f.flightNo === flightNo ? { ...f, standId } : f));
    setStands(prev => prev.map(s => s.standId === standId ? { ...s, status: 'Occupied', currentFlightNo: flightNo, currentAircraftReg: flight.aircraftReg } : s));
    addAudit('STAND_ALLOCATION', `Stand ${standId}`, stand.status, `Allocated to ${flightNo} (${flight.aircraftReg})`);
    setNotification({ message: `Stand ${standId} allocated to ${flightNo}`, type: 'success' });
    return true;
  };

  const assignRunway = (flightNo: string, runwayId: string): boolean => {
    const runway = runways.find(r => r.runwayId === runwayId);
    if (!runway) return false;

    if (runway.status === 'MAINTENANCE') {
      setNotification({ message: `${runwayId} is CLOSED for maintenance!`, type: 'error' });
      return false;
    }

    setFlights(prev => prev.map(f => f.flightNo === flightNo ? { ...f, runwayId } : f));
    setRunways(prev => prev.map(r => r.runwayId === runwayId ? { ...r, assignedFlightNo: flightNo, currentOperation: 'DEPARTURE' } : r));
    addAudit('RUNWAY_ALLOCATION', runwayId, runway.assignedFlightNo || 'IDLE', `Assigned to ${flightNo}`);
    setNotification({ message: `${runwayId} assigned to ${flightNo}`, type: 'success' });
    return true;
  };

  const scheduleFlight = (newFlightData: Partial<Flight>): boolean => {
    if (!newFlightData.flightNo || !newFlightData.destination) {
      setNotification({ message: 'Flight Number and Destination are mandatory!', type: 'error' });
      return false;
    }
    const newFlight: Flight = {
      flightNo: newFlightData.flightNo.toUpperCase(),
      airline: newFlightData.airline || 'Air India',
      airlineCode: newFlightData.airlineCode || 'AI',
      type: newFlightData.type || 'Departure',
      origin: newFlightData.origin || 'HYD',
      destination: newFlightData.destination.toUpperCase(),
      originCity: newFlightData.originCity || 'Hyderabad (RGIA)',
      destinationCity: newFlightData.destinationCity || newFlightData.destination,
      aircraftReg: newFlightData.aircraftReg || 'VT-ABC',
      aircraftModel: newFlightData.aircraftModel || 'Airbus A320neo',
      terminal: newFlightData.terminal || 'T1',
      standId: newFlightData.standId || 'S01',
      gateId: newFlightData.gateId || 'G01',
      runwayId: newFlightData.runwayId || 'RWY 09',
      sta: newFlightData.sta || '16:00',
      eta: newFlightData.eta || '16:00',
      std: newFlightData.std || '17:00',
      etd: newFlightData.etd || '17:00',
      status: 'Scheduled',
      delayMinutes: 0,
      passengerCount: 0,
      passengerCapacity: 180,
      baggageCount: 0,
      turnaroundProgress: 0,
      fareBase: 4500
    };
    setFlights(prev => [newFlight, ...prev]);
    addAudit('FLIGHT_SCHEDULED', `Flight ${newFlight.flightNo}`, 'None', `${newFlight.origin} -> ${newFlight.destination}`);
    setNotification({ message: `Flight ${newFlight.flightNo} successfully scheduled into AODB!`, type: 'success' });
    return true;
  };

  const advanceTurnaroundStep = (stepIndex: number) => {
    if (stepIndex >= turnaroundAI101.steps.length) return;
    const step = turnaroundAI101.steps[stepIndex];
    const updatedSteps = turnaroundAI101.steps.map((s, idx) => {
      if (idx === stepIndex) {
        return {
          ...s,
          status: 'COMPLETED' as const,
          actualTime: stats.simulatedTime.slice(0, 5),
          progressPercent: 100
        };
      }
      if (idx === stepIndex + 1 && s.status === 'PENDING') {
        return {
          ...s,
          status: 'IN_PROGRESS' as const,
          progressPercent: 40
        };
      }
      return s;
    });

    const newProgress = Math.min(100, Math.round(((stepIndex + 1) / updatedSteps.length) * 100));
    setTurnaroundAI101(prev => ({
      ...prev,
      steps: updatedSteps,
      currentStepIndex: stepIndex + 1,
      overallProgress: newProgress
    }));

    // Cascade to AI-101 flight status
    setFlights(prev => prev.map(f => {
      if (f.flightNo === 'AI-101') {
        let newStatus = f.status;
        if (step.name === 'BOARDING') newStatus = 'Boarding';
        if (step.name === 'READY') newStatus = 'Ready';
        if (step.name === 'PUSHBACK') newStatus = 'Pushback';
        if (step.name === 'DEPARTED') newStatus = 'Departed';
        return {
          ...f,
          turnaroundProgress: newProgress,
          status: newStatus
        };
      }
      return f;
    }));

    addAudit('TURNAROUND_MILESTONE', 'Flight AI-101', step.name, `COMPLETED by ${step.department}`);
    setNotification({ message: `Turnaround milestone '${step.name}' marked completed for AI-101`, type: 'success' });
  };

  const updateBaggageStage = (baggageId: string, nextStage: Baggage['status'], location?: string) => {
    setBaggage(prev => prev.map(b => {
      if (b.baggageId === baggageId) {
        const updatedJourney = [
          ...b.journey,
          {
            stage: nextStage,
            timestamp: stats.simulatedTime.slice(0, 5),
            location: location || b.currentLocation,
            operator: activeRole,
            status: 'Success' as const
          }
        ];
        addAudit('BAGGAGE_SCAN', `Bag ${baggageId}`, b.status, nextStage);
        return {
          ...b,
          status: nextStage,
          currentLocation: location || b.currentLocation,
          lastScanTimestamp: stats.simulatedTime.slice(0, 5),
          journey: updatedJourney
        };
      }
      return b;
    }));
    setNotification({ message: `Baggage ${baggageId} updated to ${nextStage}`, type: 'success' });
  };

  const resolveBaggageException = (baggageId: string, resolutionNotes: string) => {
    setBaggage(prev => prev.map(b => {
      if (b.baggageId === baggageId) {
        addAudit('BAGGAGE_EXCEPTION_RESOLVED', `Bag ${baggageId}`, 'MISROUTED', `Resolved: ${resolutionNotes}`);
        return {
          ...b,
          status: 'LOADING',
          exceptionIssue: undefined,
          currentLocation: 'Apron Stand S05 (AI-101 ULD AKE-2091AI)',
          assignedBelt: 'B2',
          journey: [
            ...b.journey,
            {
              stage: 'EXCEPTION_RESOLVED',
              timestamp: stats.simulatedTime.slice(0, 5),
              location: 'Make-up Carousel B2',
              operator: 'K. Ashok Kumar (Baggage Lead)',
              status: 'Success' as const,
              notes: resolutionNotes
            }
          ]
        };
      }
      return b;
    }));
    setNotification({ message: `Baggage ${baggageId} exception resolved and dispatched to AI-101!`, type: 'success' });
  };

  const performCheckIn = (bookingId: string, seatNo: string, baggageWeight?: number): BoardingPass | null => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) {
      setNotification({ message: 'Invalid booking reference!', type: 'error' });
      return null;
    }
    if (booking.status === 'Checked-In') {
      setNotification({ message: 'Passenger has already checked in!', type: 'warning' });
      return null;
    }

    const passenger = passengers.find(p => p.bookingId === bookingId);
    if (!passenger) return null;

    const flight = flights.find(f => f.flightNo === booking.flightNo);

    // Update booking
    setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: 'Checked-In' } : b));

    // Update passenger
    setPassengers(prev => prev.map(p => p.bookingId === bookingId ? {
      ...p,
      isCheckedIn: true,
      hasBoardingPass: true,
      seatNo,
      journeyStatus: 'CHECKED-IN'
    } : p));

    // Create Boarding Pass
    const bpId = `BP-${Math.floor(100 + Math.random() * 900)}`;
    const newPass: BoardingPass = {
      passId: bpId,
      ticketNo: booking.ticketNo,
      bookingId: booking.bookingId,
      flightNo: booking.flightNo,
      passengerName: passenger.name,
      seatNo,
      gateNo: flight?.gateId || 'G03',
      terminal: flight?.terminal || 'T1',
      boardingTime: flight?.std || '15:00',
      sequenceNo: Math.floor(Math.random() * 80) + 1,
      barcode: `M1${passenger.name.toUpperCase()} EBK${booking.bookingId} ${flight?.origin}${flight?.destination} ${flight?.flightNo} ${seatNo}`,
      status: 'Issued'
    };
    setBoardingPasses(prev => [newPass, ...prev]);

    // Handle baggage if registered
    if (baggageWeight && baggageWeight > 0) {
      const bagId = `BAG-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBag: Baggage = {
        baggageId: bagId,
        passengerId: passenger.passengerId,
        passengerName: passenger.name,
        flightNo: booking.flightNo,
        weight: baggageWeight,
        origin: flight?.origin || 'HYD',
        destination: flight?.destination || 'DEL',
        currentLocation: 'Counter C02 (T1 Check-in)',
        status: 'CHECKED-IN',
        assignedBelt: 'B2',
        lastScanTimestamp: stats.simulatedTime.slice(0, 5),
        journey: [
          {
            stage: 'CHECK-IN',
            timestamp: stats.simulatedTime.slice(0, 5),
            location: 'Check-in Counter C02',
            operator: activeRole,
            status: 'Success',
            notes: `Weight: ${baggageWeight}kg verified`
          }
        ]
      };
      setBaggage(prev => [newBag, ...prev]);
    }

    addAudit('CHECK_IN_PERFORMED', `Passenger ${passenger.name}`, 'Confirmed', `Checked-in Seat: ${seatNo}, Pass: ${bpId}`);
    setNotification({ message: `Check-in complete for ${passenger.name}! Boarding Pass ${bpId} generated.`, type: 'success' });
    return newPass;
  };

  const bookFlight = (flightNo: string, passengerName: string, passportNo: string, travelClass: 'Economy' | 'Business'): Booking | null => {
    const flight = flights.find(f => f.flightNo === flightNo);
    if (!flight) return null;

    const paxId = `PAX-${Math.floor(900 + Math.random() * 99)}`;
    const bkId = `BK-${Math.floor(500 + Math.random() * 499)}`;
    const tkId = `TK-${Math.floor(10 + Math.random() * 89)}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
    const payId = `PAY-${Math.floor(900 + Math.random() * 99)}`;
    const fare = travelClass === 'Business' ? flight.fareBase * 2.2 : flight.fareBase;

    const newPax: Passenger = {
      passengerId: paxId,
      name: passengerName,
      passportNo,
      contact: '+91 98480 00000',
      email: `${passengerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      flightNo,
      bookingId: bkId,
      isCheckedIn: false,
      hasBoardingPass: false,
      specialAssistance: false,
      journeyStatus: 'BOOKED'
    };

    const newBooking: Booking = {
      bookingId: bkId,
      passengerId: paxId,
      flightNo,
      bookingDate: `${stats.simulatedDate} ${stats.simulatedTime.slice(0, 5)}`,
      status: 'Confirmed',
      travelClass,
      totalFare: fare,
      ticketNo: tkId,
      paymentId: payId
    };

    const newTicket: Ticket = {
      ticketNo: tkId,
      bookingId: bkId,
      flightNo,
      passengerName,
      seatNo: 'Unassigned',
      travelClass,
      fare,
      issuedAt: `${stats.simulatedDate} ${stats.simulatedTime.slice(0, 5)}`
    };

    const newPayment: Payment = {
      paymentId: payId,
      bookingId: bkId,
      amount: fare,
      mode: 'UPI',
      status: 'Success',
      timestamp: `${stats.simulatedDate} ${stats.simulatedTime.slice(0, 5)}`
    };

    setPassengers(prev => [newPax, ...prev]);
    setBookings(prev => [newBooking, ...prev]);
    setTickets(prev => [newTicket, ...prev]);
    setPayments(prev => [newPayment, ...prev]);

    setFlights(prev => prev.map(f => f.flightNo === flightNo ? { ...f, passengerCount: f.passengerCount + 1 } : f));

    addAudit('NEW_BOOKING', `Booking ${bkId}`, 'None', `${passengerName} on ${flightNo} (₹${fare})`);
    setNotification({ message: `Flight booked! Booking ID: ${bkId}, Ticket: ${tkId}`, type: 'success' });
    return newBooking;
  };

  const createIncident = (incidentData: Partial<Incident>) => {
    const incId = `INC-${Math.floor(450 + Math.random() * 500)}`;
    const newInc: Incident = {
      incidentId: incId,
      type: incidentData.type || 'Flight Delay',
      severity: incidentData.severity || 'Medium',
      location: incidentData.location || 'AOCC',
      flightNo: incidentData.flightNo,
      reportedBy: incidentData.reportedBy || activeRole,
      timestamp: stats.simulatedTime.slice(0, 5),
      status: 'Open',
      assignedTeam: incidentData.assignedTeam || 'Airport Duty Operations',
      description: incidentData.description || 'Operational anomaly logged',
      resolution: incidentData.resolution
    };
    setIncidents(prev => [newInc, ...prev]);
    setStats(prev => ({ ...prev, openIncidents: prev.openIncidents + 1 }));
    addAudit('INCIDENT_CREATED', incId, 'None', `${newInc.severity} - ${newInc.type}`);
    setNotification({ message: `Incident ${incId} logged and dispatched to ${newInc.assignedTeam}`, type: 'warning' });
  };

  const resolveIncident = (incidentId: string, resolution: string) => {
    setIncidents(prev => prev.map(i => {
      if (i.incidentId === incidentId) {
        addAudit('INCIDENT_RESOLVED', incidentId, i.status, `Resolved: ${resolution}`);
        return {
          ...i,
          status: 'Resolved',
          resolution
        };
      }
      return i;
    }));
    setStats(prev => ({ ...prev, openIncidents: Math.max(0, prev.openIncidents - 1) }));
    setNotification({ message: `Incident ${incidentId} marked as Resolved!`, type: 'success' });
  };

  const advanceSimulation = (minutes: number) => {
    const [hh, mm, ss] = stats.simulatedTime.split(':').map(Number);
    const totalMin = hh * 60 + mm + minutes;
    const newH = Math.floor(totalMin / 60) % 24;
    const newM = totalMin % 60;
    const newTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

    setStats(prev => ({
      ...prev,
      simulatedTime: newTime,
      passengersToday: prev.passengersToday + Math.floor(Math.random() * 45) + 15,
      baggageProcessed: prev.baggageProcessed + Math.floor(Math.random() * 55) + 20
    }));

    // If AI-101 has pending turnaround steps, advance by 1 step
    if (turnaroundAI101.currentStepIndex < turnaroundAI101.steps.length - 1) {
      advanceTurnaroundStep(turnaroundAI101.currentStepIndex);
    }

    // Fluctuate queues
    setTerminalFlow(prev => prev.map(flow => {
      const delta = Math.floor(Math.random() * 11) - 5;
      const newQueue = Math.max(8, flow.currentQueue + delta);
      return {
        ...flow,
        currentQueue: newQueue,
        estimatedWaitMinutes: Math.max(2, Math.round(newQueue / (flow.openCounters * 2.4)))
      };
    }));

    addAudit('SIMULATION_STEP', 'AOCC Master Clock', `+${minutes} min`, newTime);
    setNotification({ message: `Simulation stepped +${minutes} minutes. Current time: ${newTime}`, type: 'info' });
  };

  const triggerDisruption = (type: 'WEATHER' | 'RUNWAY_CLOSURE' | 'BAGGAGE_JAM') => {
    if (type === 'WEATHER') {
      setStats(prev => ({
        ...prev,
        airportStatus: 'WEATHER WARNING',
        weather: {
          ...prev.weather,
          condition: 'Heavy Thunderstorm / Low Visibility (RVR 350m)',
          windSpeedKts: 28,
          visibilityKm: 0.8
        }
      }));
      setFlights(prev => prev.map(f => f.status !== 'Departed' ? { ...f, delayMinutes: f.delayMinutes + 25, alert: 'Ground Stop / Weather Delay +25m' } : f));
      createIncident({
        type: 'Weather Disruption',
        severity: 'Critical',
        location: 'All Airfield & Aprons',
        reportedBy: 'Aero Met Office',
        assignedTeam: 'Crisis Management Taskforce',
        description: 'Sudden convective storm over RGIA Hyderabad. RVR dropped to 350m. Holding patterns initiated.'
      });
      setNotification({ message: 'DISRUPTION TRIGGERED: Severe Thunderstorm Ground Stop initiated!', type: 'error' });
    } else if (type === 'RUNWAY_CLOSURE') {
      setRunways(prev => prev.map(r => r.runwayId === 'RWY 27' ? { ...r, status: 'MAINTENANCE', currentOperation: 'IDLE' } : r));
      setStats(prev => ({ ...prev, runwaysAvailable: 1, runwaysOccupied: 1 }));
      createIncident({
        type: 'Runway Closure',
        severity: 'High',
        location: 'Runway 27',
        reportedBy: 'ATC Tower Lead',
        assignedTeam: 'Airfield Maintenance Crew',
        description: 'Foreign Object Debris (FOD) inspection on Runway 27. Operations shifted to RWY 09.'
      });
      setNotification({ message: 'DISRUPTION TRIGGERED: Runway 27 temporarily closed for FOD inspection.', type: 'warning' });
    } else if (type === 'BAGGAGE_JAM') {
      setBaggage(prev => prev.map(b => b.assignedBelt === 'B2' ? { ...b, status: 'DELAYED' } : b));
      createIncident({
        type: 'Baggage Issue',
        severity: 'High',
        location: 'BHS Carousel B2',
        reportedBy: 'BHS Optical Sensor 09',
        assignedTeam: 'BHS Engineering & Quick Response Team',
        description: 'Baggage mechanical jam at Incline Chute B2. Belt paused for 15 minutes.'
      });
      setNotification({ message: 'DISRUPTION TRIGGERED: Belt B2 baggage sorter jam reported!', type: 'error' });
    }
  };

  const resetScenarioAI101 = () => {
    setFlights(INITIAL_FLIGHTS);
    setGates(INITIAL_GATES);
    setStands(INITIAL_STANDS);
    setRunways(INITIAL_RUNWAYS);
    setTurnaroundAI101(INITIAL_TURNAROUND_AI101);
    setStats(INITIAL_AIRPORT_STATS);
    setBaggage(INITIAL_BAGGAGE);
    setPassengers(INITIAL_PASSENGERS);
    setBookings(INITIAL_BOOKINGS);
    setBoardingPasses(INITIAL_BOARDING_PASSES);
    addAudit('SCENARIO_RESET', 'Demo Scenario AI-101', 'Active', 'Reset to initial OOAD presentation state');
    setNotification({ message: 'AI-101 End-to-End Scenario reset to initial state!', type: 'success' });
  };

  return (
    <AodbContext.Provider
      value={{
        stats,
        flights,
        gates,
        stands,
        runways,
        aircraft,
        passengers,
        bookings,
        tickets,
        payments,
        boardingPasses,
        baggage,
        staff,
        terminalFlow,
        incidents,
        alerts,
        maintenance,
        auditLogs,
        turnaroundAI101,
        activeRole,
        setActiveRole,
        activeRoute,
        setActiveRoute,
        isSearchOpen,
        setIsSearchOpen,
        notification,
        setNotification,
        updateFlightStatus,
        assignGate,
        assignStand,
        assignRunway,
        scheduleFlight,
        advanceTurnaroundStep,
        updateBaggageStage,
        resolveBaggageException,
        performCheckIn,
        bookFlight,
        createIncident,
        resolveIncident,
        advanceSimulation,
        triggerDisruption,
        resetScenarioAI101
      }}
    >
      {children}
    </AodbContext.Provider>
  );
};

export const useAodb = () => {
  const context = useContext(AodbContext);
  if (!context) throw new Error('useAodb must be used within an AodbProvider');
  return context;
};
