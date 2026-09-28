import express, { Request, Response } from 'express';
import cors from 'cors';
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
} from '../src/services/mockData';
import { Flight, AuditLog, Baggage, Incident, OperationalAlert } from '../src/types';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Centralized AODB Store
let airportStats = { ...INITIAL_AIRPORT_STATS };
let flights = [...INITIAL_FLIGHTS];
let gates = [...INITIAL_GATES];
let stands = [...INITIAL_STANDS];
let runways = [...INITIAL_RUNWAYS];
let aircraft = [...INITIAL_AIRCRAFT];
let passengers = [...INITIAL_PASSENGERS];
let bookings = [...INITIAL_BOOKINGS];
let tickets = [...INITIAL_TICKETS];
let payments = [...INITIAL_PAYMENTS];
let boardingPasses = [...INITIAL_BOARDING_PASSES];
let baggage = [...INITIAL_BAGGAGE];
let staff = [...INITIAL_STAFF];
let terminalFlow = [...INITIAL_TERMINAL_FLOW];
let incidents = [...INITIAL_INCIDENTS];
let alerts = [...INITIAL_ALERTS];
let maintenance = [...INITIAL_MAINTENANCE];
let auditLogs = [...INITIAL_AUDIT_LOGS];
let turnaroundAI101 = { ...INITIAL_TURNAROUND_AI101 };

function addAuditLog(user: string, role: string, action: string, entity: string, oldValue: string, newValue: string) {
  const newLog: AuditLog = {
    logId: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: airportStats.simulatedTime,
    user,
    role,
    action,
    entity,
    oldValue,
    newValue
  };
  auditLogs.unshift(newLog);
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'HEALTHY', system: 'Airport Operations Center (AOCC/AODB)', timestamp: airportStats.simulatedTime });
});

// Airport Stats
app.get('/api/stats', (req: Request, res: Response) => {
  res.json(airportStats);
});

// Flights
app.get('/api/flights', (req: Request, res: Response) => {
  res.json(flights);
});

app.post('/api/flights', (req: Request, res: Response) => {
  const newFlight: Flight = req.body;
  // Conflict verification
  const gateConflict = flights.find(f => f.gateId === newFlight.gateId && f.status !== 'Departed' && f.flightNo !== newFlight.flightNo);
  if (gateConflict && newFlight.gateId) {
    return res.status(400).json({ error: `Gate conflict: Gate ${newFlight.gateId} is already assigned to ${gateConflict.flightNo}` });
  }
  flights.push(newFlight);
  addAuditLog('AOCC Dispatcher', 'Flight Operations Officer', 'SCHEDULE_FLIGHT', `Flight ${newFlight.flightNo}`, 'None', `Scheduled ${newFlight.origin}->${newFlight.destination}`);
  res.status(201).json(newFlight);
});

app.put('/api/flights/:flightNo', (req: Request, res: Response) => {
  const { flightNo } = req.params;
  const index = flights.findIndex(f => f.flightNo === flightNo);
  if (index === -1) return res.status(404).json({ error: 'Flight not found' });

  const old = flights[index];
  flights[index] = { ...old, ...req.body };

  if (req.body.status && req.body.status !== old.status) {
    addAuditLog('ATC Officer', 'Air Traffic Controller', 'FLIGHT_STATUS_UPDATE', `Flight ${flightNo}`, old.status, req.body.status);
  }
  if (req.body.delayMinutes !== undefined && req.body.delayMinutes !== old.delayMinutes) {
    addAuditLog('AOCC Manager', 'Airport Operations Manager', 'FLIGHT_DELAY_UPDATE', `Flight ${flightNo}`, `${old.delayMinutes} mins`, `${req.body.delayMinutes} mins`);
  }

  res.json(flights[index]);
});

// Turnaround
app.get('/api/turnaround/:flightNo', (req: Request, res: Response) => {
  if (req.params.flightNo === 'AI-101') {
    return res.json(turnaroundAI101);
  }
  const flight = flights.find(f => f.flightNo === req.params.flightNo);
  if (!flight) return res.status(404).json({ error: 'Flight not found' });
  res.json({
    flightNo: flight.flightNo,
    aircraftReg: flight.aircraftReg,
    aircraftModel: flight.aircraftModel,
    standId: flight.standId,
    gateId: flight.gateId,
    overallProgress: flight.turnaroundProgress,
    totalDelayMinutes: flight.delayMinutes,
    currentStepIndex: 3,
    steps: turnaroundAI101.steps
  });
});

app.post('/api/turnaround/:flightNo/step', (req: Request, res: Response) => {
  const { stepIndex } = req.body;
  if (stepIndex !== undefined && stepIndex < turnaroundAI101.steps.length) {
    turnaroundAI101.currentStepIndex = stepIndex;
    turnaroundAI101.steps[stepIndex].status = 'COMPLETED';
    turnaroundAI101.steps[stepIndex].actualTime = airportStats.simulatedTime.slice(0, 5);
    turnaroundAI101.steps[stepIndex].progressPercent = 100;
    turnaroundAI101.overallProgress = Math.min(100, Math.round(((stepIndex + 1) / turnaroundAI101.steps.length) * 100));

    // Reflect onto flight
    const fIndex = flights.findIndex(f => f.flightNo === 'AI-101');
    if (fIndex !== -1) {
      flights[fIndex].turnaroundProgress = turnaroundAI101.overallProgress;
      if (stepIndex >= 9) {
        flights[fIndex].status = 'Pushback';
      } else if (stepIndex >= 7) {
        flights[fIndex].status = 'Boarding';
      }
    }

    addAuditLog('Ground Supervisor', 'Ground Operations Staff', 'TURNAROUND_STEP_COMPLETED', 'Flight AI-101', `Step ${stepIndex}`, turnaroundAI101.steps[stepIndex].name);
  }
  res.json(turnaroundAI101);
});

// Gates & Stands & Runways
app.get('/api/gates', (req: Request, res: Response) => res.json(gates));
app.get('/api/stands', (req: Request, res: Response) => res.json(stands));
app.get('/api/runways', (req: Request, res: Response) => res.json(runways));

app.put('/api/gates/:gateNo', (req: Request, res: Response) => {
  const { gateNo } = req.params;
  const idx = gates.findIndex(g => g.gateNo === gateNo);
  if (idx === -1) return res.status(404).json({ error: 'Gate not found' });
  const old = gates[idx];
  gates[idx] = { ...old, ...req.body };
  addAuditLog('Gate Allocator', 'Airport Operations Manager', 'GATE_UPDATE', `Gate ${gateNo}`, old.status, req.body.status || 'Updated');
  res.json(gates[idx]);
});

app.put('/api/stands/:standId', (req: Request, res: Response) => {
  const { standId } = req.params;
  const idx = stands.findIndex(s => s.standId === standId);
  if (idx === -1) return res.status(404).json({ error: 'Stand not found' });
  const old = stands[idx];
  stands[idx] = { ...old, ...req.body };
  addAuditLog('Apron Control', 'Airside Operations', 'STAND_UPDATE', `Stand ${standId}`, old.status, req.body.status || 'Updated');
  res.json(stands[idx]);
});

app.put('/api/runways/:runwayId', (req: Request, res: Response) => {
  const { runwayId } = req.params;
  const idx = runways.findIndex(r => r.runwayId === runwayId);
  if (idx === -1) return res.status(404).json({ error: 'Runway not found' });
  const old = runways[idx];
  runways[idx] = { ...old, ...req.body };
  addAuditLog('ATC Tower Lead', 'Air Traffic Controller', 'RUNWAY_STATUS_UPDATE', runwayId, old.status, req.body.status || 'Updated');
  res.json(runways[idx]);
});

// Baggage
app.get('/api/baggage', (req: Request, res: Response) => res.json(baggage));

app.put('/api/baggage/:baggageId/stage', (req: Request, res: Response) => {
  const { baggageId } = req.params;
  const { nextStage, location, operator, notes } = req.body;
  const item = baggage.find(b => b.baggageId === baggageId);
  if (!item) return res.status(404).json({ error: 'Baggage item not found' });

  const oldStatus = item.status;
  item.status = nextStage;
  item.currentLocation = location || item.currentLocation;
  item.lastScanTimestamp = airportStats.simulatedTime.slice(0, 5);
  item.journey.push({
    stage: nextStage,
    timestamp: item.lastScanTimestamp,
    location: location || item.currentLocation,
    operator: operator || 'Baggage Handler',
    status: 'Success',
    notes
  });

  addAuditLog(operator || 'Baggage Agent', 'Baggage Staff', 'BAGGAGE_STAGE_UPDATE', `Bag ${baggageId}`, oldStatus, nextStage);
  res.json(item);
});

app.post('/api/baggage/:baggageId/resolve', (req: Request, res: Response) => {
  const { baggageId } = req.params;
  const { resolutionNotes } = req.body;
  const item = baggage.find(b => b.baggageId === baggageId);
  if (!item) return res.status(404).json({ error: 'Baggage item not found' });

  item.status = 'LOADING';
  item.exceptionIssue = undefined;
  item.currentLocation = 'Apron Stand S05 (AI-101 Cart)';
  item.assignedBelt = 'B2';
  item.journey.push({
    stage: 'EXCEPTION_RESOLVED',
    timestamp: airportStats.simulatedTime.slice(0, 5),
    location: 'Make-up Belt B2',
    operator: 'K. Ashok Kumar',
    status: 'Success',
    notes: resolutionNotes || 'Rerouted to correct aircraft container'
  });

  addAuditLog('K. Ashok Kumar', 'Baggage Staff', 'BAGGAGE_EXCEPTION_RESOLVED', `Bag ${baggageId}`, 'MISROUTED', 'Resolved -> Loading on AI-101');
  res.json(item);
});

// Check-in & Passenger
app.get('/api/passengers', (req: Request, res: Response) => res.json(passengers));
app.get('/api/bookings', (req: Request, res: Response) => res.json(bookings));
app.get('/api/boarding-passes', (req: Request, res: Response) => res.json(boardingPasses));

app.post('/api/checkin', (req: Request, res: Response) => {
  const { bookingId, passportNo, seatNo, baggageWeight } = req.body;
  const booking = bookings.find(b => b.bookingId === bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status === 'Checked-In') return res.status(400).json({ error: 'Passenger already checked in' });

  const passenger = passengers.find(p => p.bookingId === bookingId);
  if (!passenger) return res.status(404).json({ error: 'Passenger record not found' });

  // Update records
  booking.status = 'Checked-In';
  passenger.isCheckedIn = true;
  passenger.hasBoardingPass = true;
  passenger.seatNo = seatNo || '12A';
  passenger.journeyStatus = 'CHECKED-IN';

  const flight = flights.find(f => f.flightNo === booking.flightNo);

  const bpId = `BP-${Math.floor(100 + Math.random() * 900)}`;
  const newBP = {
    passId: bpId,
    ticketNo: booking.ticketNo,
    bookingId: booking.bookingId,
    flightNo: booking.flightNo,
    passengerName: passenger.name,
    seatNo: passenger.seatNo,
    gateNo: flight?.gateId || 'G03',
    terminal: flight?.terminal || 'T1',
    boardingTime: flight?.std || '15:00',
    sequenceNo: Math.floor(Math.random() * 80) + 1,
    barcode: `M1${passenger.name.toUpperCase()} EBK${booking.bookingId} ${flight?.origin}${flight?.destination} ${flight?.flightNo} ${passenger.seatNo}`,
    status: 'Issued' as const
  };
  boardingPasses.push(newBP);

  // If baggage provided, add bag
  if (baggageWeight) {
    const bagId = `BAG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBag: Baggage = {
      baggageId: bagId,
      passengerId: passenger.passengerId,
      passengerName: passenger.name,
      flightNo: booking.flightNo,
      weight: parseFloat(baggageWeight),
      origin: flight?.origin || 'HYD',
      destination: flight?.destination || 'DEL',
      currentLocation: `Counter C02 (T1)`,
      status: 'CHECKED-IN',
      assignedBelt: 'B2',
      lastScanTimestamp: airportStats.simulatedTime.slice(0, 5),
      journey: [
        { stage: 'CHECK-IN', timestamp: airportStats.simulatedTime.slice(0, 5), location: 'Counter C02', operator: 'Check-in Agent', status: 'Success' }
      ]
    };
    baggage.push(newBag);
  }

  addAuditLog('Check-in Agent', 'Check-in Agent', 'PASSENGER_CHECK_IN', `${passenger.name} (${bookingId})`, 'Confirmed', `Checked-In, Seat ${passenger.seatNo}, Pass ${bpId}`);
  res.json({ passenger, booking, boardingPass: newBP });
});

// Incidents & Alerts
app.get('/api/incidents', (req: Request, res: Response) => res.json(incidents));
app.post('/api/incidents', (req: Request, res: Response) => {
  const newInc: Incident = {
    incidentId: `INC-${Math.floor(500 + Math.random() * 500)}`,
    timestamp: airportStats.simulatedTime.slice(0, 5),
    status: 'Open',
    ...req.body
  };
  incidents.unshift(newInc);
  airportStats.openIncidents++;
  addAuditLog(req.body.reportedBy || 'Duty Officer', 'Airport Operations Manager', 'CREATE_INCIDENT', newInc.incidentId, 'None', `${newInc.type} at ${newInc.location}`);
  res.status(201).json(newInc);
});

app.put('/api/incidents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = incidents.findIndex(i => i.incidentId === id);
  if (idx === -1) return res.status(404).json({ error: 'Incident not found' });
  const old = incidents[idx];
  incidents[idx] = { ...old, ...req.body };
  if (req.body.status === 'Resolved' || req.body.status === 'Closed') {
    airportStats.openIncidents = Math.max(0, airportStats.openIncidents - 1);
  }
  addAuditLog('Incident Coordinator', 'Airport Operations Manager', 'INCIDENT_STATUS_CHANGE', id, old.status, req.body.status || 'Updated');
  res.json(incidents[idx]);
});

app.get('/api/alerts', (req: Request, res: Response) => res.json(alerts));
app.get('/api/maintenance', (req: Request, res: Response) => res.json(maintenance));
app.get('/api/staff', (req: Request, res: Response) => res.json(staff));
app.get('/api/terminal-flow', (req: Request, res: Response) => res.json(terminalFlow));
app.get('/api/audit-logs', (req: Request, res: Response) => res.json(auditLogs));

// Simulation Advance
app.post('/api/simulation/advance', (req: Request, res: Response) => {
  const { minutes = 10 } = req.body;
  const [hh, mm, ss] = airportStats.simulatedTime.split(':').map(Number);
  let totalMin = hh * 60 + mm + minutes;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  airportStats.simulatedTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;

  // Advance turnaround step if AI-101 has pending steps
  if (turnaroundAI101.currentStepIndex < turnaroundAI101.steps.length - 1) {
    const nextIdx = turnaroundAI101.currentStepIndex + 1;
    turnaroundAI101.currentStepIndex = nextIdx;
    turnaroundAI101.steps[nextIdx].status = 'COMPLETED';
    turnaroundAI101.steps[nextIdx].actualTime = airportStats.simulatedTime.slice(0, 5);
    turnaroundAI101.steps[nextIdx].progressPercent = 100;
    turnaroundAI101.overallProgress = Math.min(100, Math.round(((nextIdx + 1) / turnaroundAI101.steps.length) * 100));

    const fIdx = flights.findIndex(f => f.flightNo === 'AI-101');
    if (fIdx !== -1) {
      flights[fIdx].turnaroundProgress = turnaroundAI101.overallProgress;
      if (nextIdx >= 10) {
        flights[fIdx].status = 'Departed';
        flights[fIdx].atd = airportStats.simulatedTime.slice(0, 5);
      } else if (nextIdx >= 8) {
        flights[fIdx].status = 'Pushback';
      }
    }
  }

  // Update passenger flow slightly
  terminalFlow.forEach(flow => {
    flow.currentQueue = Math.max(10, flow.currentQueue + Math.floor(Math.random() * 9 - 4));
    flow.estimatedWaitMinutes = Math.max(2, Math.round(flow.currentQueue / (flow.openCounters * 2.5)));
  });

  airportStats.passengersToday += Math.floor(Math.random() * 40) + 10;
  airportStats.baggageProcessed += Math.floor(Math.random() * 60) + 15;

  addAuditLog('Simulation Engine', 'Airport Administrator', 'SIMULATION_STEP', 'Airport Clock', `+${minutes} min`, airportStats.simulatedTime);
  res.json({ stats: airportStats, turnaround: turnaroundAI101, flights });
});

// CSV Report Export
app.get('/api/reports/export-csv', (req: Request, res: Response) => {
  let csv = 'FlightNo,Airline,Origin,Destination,Aircraft,Stand,Gate,Runway,STD,ETD,Status,DelayMinutes,Passengers,Baggage\n';
  flights.forEach(f => {
    csv += `${f.flightNo},${f.airline},${f.origin},${f.destination},${f.aircraftReg},${f.standId},${f.gateId},${f.runwayId},${f.std},${f.etd},${f.status},${f.delayMinutes},${f.passengerCount},${f.baggageCount}\n`;
  });
  res.header('Content-Type', 'text/csv');
  res.attachment(`AERO_OPS_Report_${airportStats.simulatedDate}.csv`);
  res.send(csv);
});

// Global Search
app.get('/api/search', (req: Request, res: Response) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  if (!q) return res.json({ flights: [], passengers: [], baggage: [], gates: [], staff: [] });

  const matchedFlights = flights.filter(f => f.flightNo.toLowerCase().includes(q) || f.destinationCity.toLowerCase().includes(q) || f.aircraftReg.toLowerCase().includes(q));
  const matchedPassengers = passengers.filter(p => p.name.toLowerCase().includes(q) || p.passportNo.toLowerCase().includes(q) || p.bookingId.toLowerCase().includes(q));
  const matchedBaggage = baggage.filter(b => b.baggageId.toLowerCase().includes(q) || b.passengerName.toLowerCase().includes(q));
  const matchedGates = gates.filter(g => g.gateNo.toLowerCase().includes(q));
  const matchedStaff = staff.filter(s => s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));

  res.json({
    flights: matchedFlights,
    passengers: matchedPassengers,
    baggage: matchedBaggage,
    gates: matchedGates,
    staff: matchedStaff
  });
});

app.listen(PORT, () => {
  console.log(`✈️ Airport Operations Server (AOCC/AODB) listening on port ${PORT}`);
});
