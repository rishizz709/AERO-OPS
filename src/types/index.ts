// Domain Types for Airport Operations Management System (AMS)
// Based on Aditya University OOAD / UML Design and realistic AOCC / AODB specifications

export type UserRole =
  | 'Airport Administrator'
  | 'Airport Operations Manager'
  | 'Flight Operations Officer'
  | 'Ground Operations Staff'
  | 'Baggage Staff'
  | 'Check-in Agent'
  | 'Air Traffic Controller'
  | 'Terminal Operations'
  | 'Maintenance Staff'
  | 'Passenger';

export type FlightStatus =
  | 'Scheduled'
  | 'Approaching'
  | 'Landed'
  | 'Taxiing'
  | 'At Stand'
  | 'Turnaround'
  | 'Boarding'
  | 'Ready'
  | 'Pushback'
  | 'Departed'
  | 'Arrived'
  | 'Delayed'
  | 'Cancelled';

export type TurnaroundStepName =
  | 'LANDED'
  | 'ON STAND'
  | 'DISEMBARKATION'
  | 'BAGGAGE UNLOAD'
  | 'CLEANING'
  | 'CATERING'
  | 'REFUELING'
  | 'BOARDING'
  | 'READY'
  | 'PUSHBACK'
  | 'DEPARTED';

export type TurnaroundStepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';

export interface TurnaroundStep {
  name: TurnaroundStepName;
  plannedTime: string;
  actualTime?: string;
  delayMinutes: number;
  department: string;
  status: TurnaroundStepStatus;
  progressPercent: number;
}

export interface FlightTurnaround {
  flightNo: string;
  aircraftReg: string;
  aircraftModel: string;
  standId: string;
  gateId: string;
  overallProgress: number; // 0 - 100
  totalDelayMinutes: number;
  steps: TurnaroundStep[];
  currentStepIndex: number;
}

export type GateStatus = 'Available' | 'Assigned' | 'Boarding' | 'Gate Closing' | 'Occupied' | 'Maintenance';

export interface Gate {
  gateNo: string; // e.g. "G01", "G03"
  terminal: 'T1' | 'T2';
  status: GateStatus;
  currentFlightNo?: string;
  nextFlightNo?: string;
  aircraftReg?: string;
  boardingTime?: string;
  standConnection?: string;
}

export type StandStatus = 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
export type AircraftCompatibility = 'Narrowbody' | 'Widebody' | 'All';

export interface Stand {
  standId: string; // e.g. "S01", "S05"
  terminal: 'T1' | 'T2';
  type: AircraftCompatibility;
  gateConnection: string;
  status: StandStatus;
  currentAircraftReg?: string;
  currentFlightNo?: string;
  departureFlightNo?: string;
}

export type RunwayStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface Runway {
  runwayId: string; // e.g. "RWY 09", "RWY 27", "RWY 14"
  status: RunwayStatus;
  currentOperation?: 'ARRIVAL' | 'DEPARTURE' | 'IDLE';
  assignedFlightNo?: string;
  operationType?: 'Takeoff' | 'Landing';
  scheduledTime?: string;
  estimatedTime?: string;
  lengthMeters: number;
  ilsCategory: string;
  surfaceWind: string;
}

export interface Aircraft {
  registration: string; // e.g. "VT-ABC"
  model: string; // e.g. "Airbus A320"
  airlineCode: string;
  airlineName: string;
  capacity: number;
  currentLocation: string; // Stand or Air
  currentFlightNo?: string;
  nextFlightNo?: string;
  status: 'In Flight' | 'On Ground' | 'Turnaround' | 'Boarding' | 'Maintenance';
  fuelLevelPercent: number;
}

export interface Flight {
  flightNo: string; // e.g. "AI-101"
  airline: string; // e.g. "Air India"
  airlineCode: string; // e.g. "AI"
  type: 'Arrival' | 'Departure';
  origin: string; // e.g. "HYD"
  destination: string; // e.g. "DEL"
  originCity: string;
  destinationCity: string;
  aircraftReg: string;
  aircraftModel: string;
  terminal: 'T1' | 'T2';
  standId: string;
  gateId: string;
  runwayId: string;
  sta: string; // Scheduled Time of Arrival
  eta: string; // Estimated Time of Arrival
  ata?: string; // Actual Time of Arrival
  std: string; // Scheduled Time of Departure
  etd: string; // Estimated Time of Departure
  atd?: string; // Actual Time of Departure
  status: FlightStatus;
  delayMinutes: number;
  passengerCount: number;
  passengerCapacity: number;
  baggageCount: number;
  turnaroundProgress: number; // 0 - 100
  alert?: string;
  fareBase: number;
}

export type BaggageStatus =
  | 'CHECKED-IN'
  | 'ACCEPTED'
  | 'SECURITY'
  | 'SORTING'
  | 'BAGGAGE BELT'
  | 'LOADING'
  | 'AIRCRAFT'
  | 'UNLOADING'
  | 'ARRIVAL BELT'
  | 'DELIVERED'
  | 'DELAYED'
  | 'MISROUTED'
  | 'LOST'
  | 'DAMAGED';

export interface BaggageEvent {
  stage: string;
  timestamp: string;
  location: string;
  operator: string;
  status: 'Success' | 'Warning' | 'Exception';
  notes?: string;
}

export interface Baggage {
  baggageId: string; // e.g. "BAG-1001", "BAG-2041"
  passengerId: string;
  passengerName: string;
  flightNo: string;
  weight: number; // kg
  origin: string;
  destination: string;
  currentLocation: string;
  status: BaggageStatus;
  assignedBelt: string; // e.g. "B2"
  containerId?: string; // ULD e.g. "AKE-1024"
  lastScanTimestamp: string;
  journey: BaggageEvent[];
  exceptionIssue?: string;
  assignedStaff?: string;
}

export interface Passenger {
  passengerId: string; // e.g. "PAX-901"
  name: string; // e.g. "Ravi Kumar"
  passportNo: string; // e.g. "N1234567"
  contact: string;
  email: string;
  flightNo: string;
  bookingId: string;
  seatNo?: string;
  isCheckedIn: boolean;
  hasBoardingPass: boolean;
  specialAssistance: boolean;
  journeyStatus: 'BOOKED' | 'CHECKED-IN' | 'SECURITY' | 'AT GATE' | 'BOARDING' | 'BOARDED';
}

export interface Booking {
  bookingId: string; // e.g. "BK-501"
  passengerId: string;
  flightNo: string;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled' | 'Checked-In';
  travelClass: 'Economy' | 'Business' | 'First';
  totalFare: number;
  ticketNo: string;
  paymentId: string;
}

export interface Ticket {
  ticketNo: string; // e.g. "TK-12A"
  bookingId: string;
  flightNo: string;
  passengerName: string;
  seatNo: string; // e.g. "12A"
  travelClass: string;
  fare: number;
  issuedAt: string;
}

export interface BoardingPass {
  passId: string; // e.g. "BP-881"
  ticketNo: string;
  bookingId: string;
  flightNo: string;
  passengerName: string;
  seatNo: string;
  gateNo: string;
  terminal: string;
  boardingTime: string;
  sequenceNo: number;
  barcode: string;
  status: 'Issued' | 'Boarded' | 'Cancelled';
}

export interface Payment {
  paymentId: string; // e.g. "PAY-900"
  bookingId: string;
  amount: number;
  mode: 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  status: 'Success' | 'Pending' | 'Refunded';
  timestamp: string;
}

export interface Staff {
  staffId: string; // e.g. "STF-201"
  name: string;
  department: string;
  role: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  location: string;
  currentAssignment?: string;
  status: 'Available' | 'Assigned' | 'Busy' | 'Break' | 'Off Duty';
  currentFlightNo?: string;
  phone: string;
}

export interface TerminalAreaFlow {
  areaId: string;
  areaName: string;
  type: 'Check-in' | 'Security' | 'Immigration' | 'Gate Waiting' | 'Baggage Claim';
  terminal: 'T1' | 'T2';
  currentQueue: number;
  capacity: number;
  estimatedWaitMinutes: number;
  status: 'NORMAL' | 'MODERATE' | 'HIGH QUEUE' | 'CRITICAL';
  openCounters: number;
  totalCounters: number;
}

export interface Incident {
  incidentId: string; // e.g. "INC-402"
  type:
    | 'Flight Delay'
    | 'Gate Issue'
    | 'Runway Closure'
    | 'Baggage Issue'
    | 'Equipment Failure'
    | 'Staff Shortage'
    | 'Security Incident'
    | 'Medical Incident'
    | 'Terminal Congestion'
    | 'Weather Disruption';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  flightNo?: string;
  reportedBy: string;
  timestamp: string;
  status: 'Open' | 'Investigating' | 'Mitigating' | 'Resolved' | 'Closed';
  assignedTeam: string;
  description: string;
  resolution?: string;
}

export interface OperationalAlert {
  alertId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  affectedResource: string;
  time: string;
  description: string;
  recommendedAction: string;
  assignedDepartment: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface MaintenanceAsset {
  assetId: string; // e.g. "AST-B02", "AST-G03"
  name: string;
  type: 'Gate' | 'Runway' | 'Baggage Belt' | 'Check-in Counter' | 'Ground Equipment' | 'Boarding Bridge';
  location: string;
  status: 'Operational' | 'Maintenance Due' | 'Under Maintenance' | 'Unavailable';
  lastMaintenance: string;
  nextMaintenance: string;
  assignedTechnician: string;
  healthPercent: number;
}

export interface AuditLog {
  logId: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  oldValue: string;
  newValue: string;
}

export interface AirportStats {
  airportStatus: 'NORMAL OPERATIONS' | 'WEATHER WARNING' | 'HIGH CONGESTION' | 'DISRUPTION ALERT';
  simulatedTime: string;
  simulatedDate: string;
  weather: {
    tempC: number;
    condition: string;
    windSpeedKts: number;
    windDirectionDeg: number;
    visibilityKm: number;
    qnhHpa: number;
  };
  runwaysTotal: number;
  runwaysAvailable: number;
  runwaysOccupied: number;
  gatesTotal: number;
  gatesAvailable: number;
  gatesOccupied: number;
  standsTotal: number;
  standsAvailable: number;
  standsOccupied: number;
  flightsToday: number;
  arrivalsToday: number;
  departuresToday: number;
  delayedFlights: number;
  activeAircraft: number;
  passengersToday: number;
  baggageProcessed: number;
  openIncidents: number;
  staffOnDuty: number;
  onTimePerformancePercent: number;
  averageTurnaroundMins: number;
}
