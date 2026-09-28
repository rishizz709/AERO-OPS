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
  AirportStats
} from '../types';

export const INITIAL_RUNWAYS: Runway[] = [
  {
    runwayId: 'RWY 09',
    status: 'AVAILABLE',
    currentOperation: 'IDLE',
    assignedFlightNo: 'AI-101',
    operationType: 'Takeoff',
    scheduledTime: '15:40',
    estimatedTime: '15:45',
    lengthMeters: 4260,
    ilsCategory: 'CAT III B',
    surfaceWind: '090° at 08 kts'
  },
  {
    runwayId: 'RWY 27',
    status: 'OCCUPIED',
    currentOperation: 'ARRIVAL',
    assignedFlightNo: '6E-204',
    operationType: 'Landing',
    scheduledTime: '14:35',
    estimatedTime: '14:38',
    lengthMeters: 3800,
    ilsCategory: 'CAT II',
    surfaceWind: '090° at 08 kts'
  },
  {
    runwayId: 'RWY 14',
    status: 'AVAILABLE',
    currentOperation: 'IDLE',
    lengthMeters: 3200,
    ilsCategory: 'CAT I',
    surfaceWind: '090° at 08 kts'
  }
];

export const INITIAL_GATES: Gate[] = [
  { gateNo: 'G01', terminal: 'T1', status: 'Available', standConnection: 'S01' },
  { gateNo: 'G02', terminal: 'T1', status: 'Occupied', currentFlightNo: '6E-512', aircraftReg: 'VT-EDF', boardingTime: '14:50', standConnection: 'S02' },
  { gateNo: 'G03', terminal: 'T1', status: 'Boarding', currentFlightNo: 'AI-101', aircraftReg: 'VT-ABC', boardingTime: '15:00', standConnection: 'S05' },
  { gateNo: 'G04', terminal: 'T1', status: 'Gate Closing', currentFlightNo: 'QP-1102', aircraftReg: 'VT-GHI', boardingTime: '14:30', standConnection: 'S03' },
  { gateNo: 'G05', terminal: 'T1', status: 'Available', standConnection: 'S04' },
  { gateNo: 'G06', terminal: 'T1', status: 'Maintenance', standConnection: 'S06' },
  { gateNo: 'G07', terminal: 'T1', status: 'Assigned', nextFlightNo: 'UK-830', standConnection: 'S07' },
  { gateNo: 'G08', terminal: 'T1', status: 'Available', standConnection: 'S08' },
  { gateNo: 'G09', terminal: 'T2', status: 'Occupied', currentFlightNo: 'AI-872', aircraftReg: 'VT-JKL', boardingTime: '15:20', standConnection: 'S09' },
  { gateNo: 'G10', terminal: 'T2', status: 'Available', standConnection: 'S10' },
  { gateNo: 'G11', terminal: 'T2', status: 'Boarding', currentFlightNo: '6E-809', aircraftReg: 'VT-MNO', boardingTime: '15:10', standConnection: 'S11' },
  { gateNo: 'G12', terminal: 'T2', status: 'Occupied', currentFlightNo: 'SG-441', aircraftReg: 'VT-PQR', boardingTime: '15:40', standConnection: 'S12' },
  { gateNo: 'G13', terminal: 'T2', status: 'Available' },
  { gateNo: 'G14', terminal: 'T2', status: 'Available' },
  { gateNo: 'G15', terminal: 'T2', status: 'Available' },
  { gateNo: 'G16', terminal: 'T2', status: 'Available' },
  { gateNo: 'G17', terminal: 'T2', status: 'Available' },
  { gateNo: 'G18', terminal: 'T2', status: 'Available' }
];

export const INITIAL_STANDS: Stand[] = [
  { standId: 'S01', terminal: 'T1', type: 'Narrowbody', gateConnection: 'G01', status: 'Available' },
  { standId: 'S02', terminal: 'T1', type: 'Narrowbody', gateConnection: 'G02', status: 'Occupied', currentAircraftReg: 'VT-EDF', currentFlightNo: '6E-512' },
  { standId: 'S03', terminal: 'T1', type: 'Narrowbody', gateConnection: 'G04', status: 'Occupied', currentAircraftReg: 'VT-GHI', currentFlightNo: 'QP-1102' },
  { standId: 'S04', terminal: 'T1', type: 'Widebody', gateConnection: 'G05', status: 'Maintenance' },
  { standId: 'S05', terminal: 'T1', type: 'Narrowbody', gateConnection: 'G03', status: 'Occupied', currentAircraftReg: 'VT-ABC', currentFlightNo: 'AI-101', departureFlightNo: 'AI-101' },
  { standId: 'S06', terminal: 'T1', type: 'Narrowbody', gateConnection: 'G06', status: 'Available' },
  { standId: 'S07', terminal: 'T1', type: 'Widebody', gateConnection: 'G07', status: 'Reserved', departureFlightNo: 'UK-830' },
  { standId: 'S08', terminal: 'T1', type: 'Widebody', gateConnection: 'G08', status: 'Available' },
  { standId: 'S09', terminal: 'T2', type: 'Widebody', gateConnection: 'G09', status: 'Occupied', currentAircraftReg: 'VT-JKL', currentFlightNo: 'AI-872' },
  { standId: 'S10', terminal: 'T2', type: 'Narrowbody', gateConnection: 'G10', status: 'Available' },
  { standId: 'S11', terminal: 'T2', type: 'Narrowbody', gateConnection: 'G11', status: 'Occupied', currentAircraftReg: 'VT-MNO', currentFlightNo: '6E-809' },
  { standId: 'S12', terminal: 'T2', type: 'Narrowbody', gateConnection: 'G12', status: 'Occupied', currentAircraftReg: 'VT-PQR', currentFlightNo: 'SG-441' }
];

export const INITIAL_AIRCRAFT: Aircraft[] = [
  { registration: 'VT-ABC', model: 'Airbus A320neo', airlineCode: 'AI', airlineName: 'Air India', capacity: 180, currentLocation: 'Stand S05', currentFlightNo: 'AI-101', nextFlightNo: 'AI-204', status: 'Turnaround', fuelLevelPercent: 78 },
  { registration: 'VT-EDF', model: 'Airbus A321neo', airlineCode: '6E', airlineName: 'IndiGo', capacity: 222, currentLocation: 'Stand S02', currentFlightNo: '6E-512', status: 'Boarding', fuelLevelPercent: 88 },
  { registration: 'VT-GHI', model: 'Boeing 737 MAX 8', airlineCode: 'QP', airlineName: 'Akasa Air', capacity: 189, currentLocation: 'Stand S03', currentFlightNo: 'QP-1102', status: 'Boarding', fuelLevelPercent: 92 },
  { registration: 'VT-JKL', model: 'Boeing 787-9 Dreamliner', airlineCode: 'AI', airlineName: 'Air India', capacity: 296, currentLocation: 'Stand S09', currentFlightNo: 'AI-872', status: 'On Ground', fuelLevelPercent: 65 },
  { registration: 'VT-MNO', model: 'Airbus A320neo', airlineCode: '6E', airlineName: 'IndiGo', capacity: 186, currentLocation: 'Stand S11', currentFlightNo: '6E-809', status: 'Boarding', fuelLevelPercent: 82 },
  { registration: 'VT-PQR', model: 'Boeing 737-800', airlineCode: 'SG', airlineName: 'SpiceJet', capacity: 189, currentLocation: 'Stand S12', currentFlightNo: 'SG-441', status: 'On Ground', fuelLevelPercent: 55 },
  { registration: 'VT-STU', model: 'Airbus A350-900', airlineCode: 'AI', airlineName: 'Air India', capacity: 316, currentLocation: 'En Route', currentFlightNo: 'AI-144', status: 'In Flight', fuelLevelPercent: 70 },
  { registration: 'VT-VWX', model: 'ATR 72-600', airlineCode: '6E', airlineName: 'IndiGo', capacity: 78, currentLocation: 'Maintenance Hangar', status: 'Maintenance', fuelLevelPercent: 40 },
  { registration: 'VT-YZ1', model: 'Airbus A321neo', airlineCode: 'UK', airlineName: 'Vistara', capacity: 188, currentLocation: 'Stand S07', nextFlightNo: 'UK-830', status: 'On Ground', fuelLevelPercent: 85 },
  { registration: 'VT-K99', model: 'Boeing 777-300ER', airlineCode: 'AI', airlineName: 'Air India', capacity: 342, currentLocation: 'Stand S08', status: 'On Ground', fuelLevelPercent: 95 }
];

export const INITIAL_FLIGHTS: Flight[] = [
  {
    flightNo: 'AI-101',
    airline: 'Air India',
    airlineCode: 'AI',
    type: 'Departure',
    origin: 'HYD',
    destination: 'DEL',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'New Delhi (IGI)',
    aircraftReg: 'VT-ABC',
    aircraftModel: 'Airbus A320neo',
    terminal: 'T1',
    standId: 'S05',
    gateId: 'G03',
    runwayId: 'RWY 09',
    sta: '14:20',
    eta: '14:15',
    ata: '14:18',
    std: '15:30',
    etd: '15:48',
    status: 'Turnaround',
    delayMinutes: 18,
    passengerCount: 168,
    passengerCapacity: 180,
    baggageCount: 142,
    turnaroundProgress: 68,
    alert: 'Turnaround 18m behind schedule due to catering delay',
    fareBase: 5200
  },
  {
    flightNo: '6E-204',
    airline: 'IndiGo',
    airlineCode: '6E',
    type: 'Arrival',
    origin: 'BOM',
    destination: 'HYD',
    originCity: 'Mumbai (CSMIA)',
    destinationCity: 'Hyderabad (RGIA)',
    aircraftReg: 'VT-STU',
    aircraftModel: 'Airbus A321neo',
    terminal: 'T1',
    standId: 'S01',
    gateId: 'G01',
    runwayId: 'RWY 27',
    sta: '14:35',
    eta: '14:38',
    std: '13:10',
    etd: '13:15',
    status: 'Approaching',
    delayMinutes: 3,
    passengerCount: 205,
    passengerCapacity: 222,
    baggageCount: 178,
    turnaroundProgress: 10,
    fareBase: 4400
  },
  {
    flightNo: 'QP-1102',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    type: 'Departure',
    origin: 'HYD',
    destination: 'BLR',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'Bengaluru (KIA)',
    aircraftReg: 'VT-GHI',
    aircraftModel: 'Boeing 737 MAX 8',
    terminal: 'T1',
    standId: 'S03',
    gateId: 'G04',
    runwayId: 'RWY 09',
    sta: '13:45',
    eta: '13:45',
    ata: '13:42',
    std: '14:45',
    etd: '14:45',
    status: 'Boarding',
    delayMinutes: 0,
    passengerCount: 182,
    passengerCapacity: 189,
    baggageCount: 155,
    turnaroundProgress: 88,
    fareBase: 3600
  },
  {
    flightNo: '6E-512',
    airline: 'IndiGo',
    airlineCode: '6E',
    type: 'Departure',
    origin: 'HYD',
    destination: 'MAA',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'Chennai (MAA)',
    aircraftReg: 'VT-EDF',
    aircraftModel: 'Airbus A321neo',
    terminal: 'T1',
    standId: 'S02',
    gateId: 'G02',
    runwayId: 'RWY 09',
    sta: '13:50',
    eta: '13:50',
    ata: '13:50',
    std: '15:05',
    etd: '15:05',
    status: 'Boarding',
    delayMinutes: 0,
    passengerCount: 198,
    passengerCapacity: 222,
    baggageCount: 164,
    turnaroundProgress: 75,
    fareBase: 3900
  },
  {
    flightNo: 'AI-872',
    airline: 'Air India',
    airlineCode: 'AI',
    type: 'Departure',
    origin: 'HYD',
    destination: 'DXB',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'Dubai International (DXB)',
    aircraftReg: 'VT-JKL',
    aircraftModel: 'Boeing 787-9 Dreamliner',
    terminal: 'T2',
    standId: 'S09',
    gateId: 'G09',
    runwayId: 'RWY 09',
    sta: '13:30',
    eta: '13:30',
    ata: '13:28',
    std: '15:50',
    etd: '16:00',
    status: 'At Stand',
    delayMinutes: 10,
    passengerCount: 284,
    passengerCapacity: 296,
    baggageCount: 310,
    turnaroundProgress: 52,
    fareBase: 14500
  },
  {
    flightNo: '6E-809',
    airline: 'IndiGo',
    airlineCode: '6E',
    type: 'Departure',
    origin: 'HYD',
    destination: 'CCU',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'Kolkata (CCU)',
    aircraftReg: 'VT-MNO',
    aircraftModel: 'Airbus A320neo',
    terminal: 'T2',
    standId: 'S11',
    gateId: 'G11',
    runwayId: 'RWY 09',
    sta: '14:00',
    eta: '14:00',
    ata: '14:02',
    std: '15:20',
    etd: '15:20',
    status: 'Boarding',
    delayMinutes: 0,
    passengerCount: 175,
    passengerCapacity: 186,
    baggageCount: 139,
    turnaroundProgress: 82,
    fareBase: 4800
  },
  {
    flightNo: 'SG-441',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    type: 'Departure',
    origin: 'HYD',
    destination: 'VTZ',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'Visakhapatnam (VTZ)',
    aircraftReg: 'VT-PQR',
    aircraftModel: 'Boeing 737-800',
    terminal: 'T2',
    standId: 'S12',
    gateId: 'G12',
    runwayId: 'RWY 09',
    sta: '14:10',
    eta: '14:10',
    ata: '14:15',
    std: '16:00',
    etd: '16:25',
    status: 'Delayed',
    delayMinutes: 25,
    passengerCount: 170,
    passengerCapacity: 189,
    baggageCount: 130,
    turnaroundProgress: 40,
    alert: 'Ground maintenance check extended +25m',
    fareBase: 3100
  },
  {
    flightNo: 'UK-830',
    airline: 'Vistara',
    airlineCode: 'UK',
    type: 'Departure',
    origin: 'HYD',
    destination: 'DEL',
    originCity: 'Hyderabad (RGIA)',
    destinationCity: 'New Delhi (IGI)',
    aircraftReg: 'VT-YZ1',
    aircraftModel: 'Airbus A321neo',
    terminal: 'T1',
    standId: 'S07',
    gateId: 'G07',
    runwayId: 'RWY 09',
    sta: '15:10',
    eta: '15:10',
    std: '16:30',
    etd: '16:30',
    status: 'Scheduled',
    delayMinutes: 0,
    passengerCount: 160,
    passengerCapacity: 188,
    baggageCount: 140,
    turnaroundProgress: 0,
    fareBase: 5800
  },
  {
    flightNo: 'AI-204',
    airline: 'Air India',
    airlineCode: 'AI',
    type: 'Arrival',
    origin: 'TIR',
    destination: 'HYD',
    originCity: 'Tirupati (TIR)',
    destinationCity: 'Hyderabad (RGIA)',
    aircraftReg: 'VT-ABC',
    aircraftModel: 'Airbus A320neo',
    terminal: 'T1',
    standId: 'S05',
    gateId: 'G03',
    runwayId: 'RWY 27',
    sta: '17:45',
    eta: '17:45',
    std: '16:50',
    etd: '16:50',
    status: 'Scheduled',
    delayMinutes: 0,
    passengerCount: 154,
    passengerCapacity: 180,
    baggageCount: 122,
    turnaroundProgress: 0,
    fareBase: 3300
  },
  {
    flightNo: '6E-991',
    airline: 'IndiGo',
    airlineCode: '6E',
    type: 'Arrival',
    origin: 'DEL',
    destination: 'HYD',
    originCity: 'New Delhi (IGI)',
    destinationCity: 'Hyderabad (RGIA)',
    aircraftReg: 'VT-K99',
    aircraftModel: 'Airbus A321neo',
    terminal: 'T1',
    standId: 'S06',
    gateId: 'G05',
    runwayId: 'RWY 27',
    sta: '15:30',
    eta: '15:30',
    std: '13:15',
    etd: '13:15',
    status: 'Approaching',
    delayMinutes: 0,
    passengerCount: 210,
    passengerCapacity: 222,
    baggageCount: 185,
    turnaroundProgress: 15,
    fareBase: 4900
  }
];

export const INITIAL_TURNAROUND_AI101: FlightTurnaround = {
  flightNo: 'AI-101',
  aircraftReg: 'VT-ABC',
  aircraftModel: 'Airbus A320neo',
  standId: 'S05',
  gateId: 'G03',
  overallProgress: 68,
  totalDelayMinutes: 18,
  currentStepIndex: 6, // Refueling / Boarding
  steps: [
    { name: 'LANDED', plannedTime: '14:20', actualTime: '14:18', delayMinutes: 0, department: 'Air Traffic Control', status: 'COMPLETED', progressPercent: 100 },
    { name: 'ON STAND', plannedTime: '14:25', actualTime: '14:24', delayMinutes: 0, department: 'Airside Ops / Marshalling', status: 'COMPLETED', progressPercent: 100 },
    { name: 'DISEMBARKATION', plannedTime: '14:28', actualTime: '14:28', delayMinutes: 0, department: 'Cabin & Terminal Ops', status: 'COMPLETED', progressPercent: 100 },
    { name: 'BAGGAGE UNLOAD', plannedTime: '14:32', actualTime: '14:35', delayMinutes: 3, department: 'Baggage Ground Staff', status: 'COMPLETED', progressPercent: 100 },
    { name: 'CLEANING', plannedTime: '14:45', actualTime: '14:48', delayMinutes: 3, department: 'Terminal Cleaning Services', status: 'COMPLETED', progressPercent: 100 },
    { name: 'CATERING', plannedTime: '14:50', actualTime: '15:08', delayMinutes: 18, department: 'Airline Catering Services', status: 'COMPLETED', progressPercent: 100 },
    { name: 'REFUELING', plannedTime: '14:55', actualTime: '15:10', delayMinutes: 15, department: 'Airside Fueling Services', status: 'IN_PROGRESS', progressPercent: 80 },
    { name: 'BOARDING', plannedTime: '15:00', actualTime: '15:15', delayMinutes: 15, department: 'Check-in & Gate Agents', status: 'IN_PROGRESS', progressPercent: 65 },
    { name: 'READY', plannedTime: '15:25', delayMinutes: 18, department: 'Flight Dispatch / Ground Ops', status: 'PENDING', progressPercent: 0 },
    { name: 'PUSHBACK', plannedTime: '15:30', delayMinutes: 18, department: 'Ground Handling Tug Crew', status: 'PENDING', progressPercent: 0 },
    { name: 'DEPARTED', plannedTime: '15:40', delayMinutes: 18, department: 'Air Traffic Control', status: 'PENDING', progressPercent: 0 }
  ]
};

export const INITIAL_PASSENGERS: Passenger[] = [
  {
    passengerId: 'PAX-901',
    name: 'Ravi Kumar',
    passportNo: 'N1234567',
    contact: '+91 98480 22334',
    email: 'ravi.kumar@example.com',
    flightNo: 'AI-101',
    bookingId: 'BK-501',
    seatNo: '12A',
    isCheckedIn: true,
    hasBoardingPass: true,
    specialAssistance: false,
    journeyStatus: 'AT GATE'
  },
  {
    passengerId: 'PAX-902',
    name: 'Priya Sharma',
    passportNo: 'P8834912',
    contact: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    flightNo: 'AI-101',
    bookingId: 'BK-502',
    seatNo: '12B',
    isCheckedIn: true,
    hasBoardingPass: true,
    specialAssistance: false,
    journeyStatus: 'BOARDING'
  },
  {
    passengerId: 'PAX-903',
    name: 'Vikramaditya Rao',
    passportNo: 'V4421908',
    contact: '+91 94401 88221',
    email: 'v.rao@example.com',
    flightNo: 'AI-101',
    bookingId: 'BK-503',
    seatNo: '04F',
    isCheckedIn: true,
    hasBoardingPass: true,
    specialAssistance: true,
    journeyStatus: 'AT GATE'
  },
  {
    passengerId: 'PAX-904',
    name: 'Ananya Reddy',
    passportNo: 'A9912044',
    contact: '+91 99081 77332',
    email: 'ananya.reddy@example.com',
    flightNo: 'AI-101',
    bookingId: 'BK-504',
    seatNo: '14C',
    isCheckedIn: false,
    hasBoardingPass: false,
    specialAssistance: false,
    journeyStatus: 'BOOKED'
  },
  {
    passengerId: 'PAX-905',
    name: 'Suresh Menon',
    passportNo: 'M7721833',
    contact: '+91 98450 11992',
    email: 'suresh.menon@example.com',
    flightNo: '6E-204',
    bookingId: 'BK-505',
    seatNo: '08D',
    isCheckedIn: true,
    hasBoardingPass: true,
    specialAssistance: false,
    journeyStatus: 'BOARDED'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    bookingId: 'BK-501',
    passengerId: 'PAX-901',
    flightNo: 'AI-101',
    bookingDate: '2026-09-25 10:15',
    status: 'Checked-In',
    travelClass: 'Economy',
    totalFare: 5200,
    ticketNo: 'TK-12A',
    paymentId: 'PAY-900'
  },
  {
    bookingId: 'BK-502',
    passengerId: 'PAX-902',
    flightNo: 'AI-101',
    bookingDate: '2026-09-25 11:30',
    status: 'Checked-In',
    travelClass: 'Economy',
    totalFare: 5200,
    ticketNo: 'TK-12B',
    paymentId: 'PAY-901'
  },
  {
    bookingId: 'BK-503',
    passengerId: 'PAX-903',
    flightNo: 'AI-101',
    bookingDate: '2026-09-26 09:00',
    status: 'Checked-In',
    travelClass: 'Business',
    totalFare: 11500,
    ticketNo: 'TK-04F',
    paymentId: 'PAY-902'
  },
  {
    bookingId: 'BK-504',
    passengerId: 'PAX-904',
    flightNo: 'AI-101',
    bookingDate: '2026-09-27 08:45',
    status: 'Confirmed',
    travelClass: 'Economy',
    totalFare: 5200,
    ticketNo: 'TK-14C',
    paymentId: 'PAY-903'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    ticketNo: 'TK-12A',
    bookingId: 'BK-501',
    flightNo: 'AI-101',
    passengerName: 'Ravi Kumar',
    seatNo: '12A',
    travelClass: 'Economy',
    fare: 5200,
    issuedAt: '2026-09-25 10:16'
  },
  {
    ticketNo: 'TK-12B',
    bookingId: 'BK-502',
    flightNo: 'AI-101',
    passengerName: 'Priya Sharma',
    seatNo: '12B',
    travelClass: 'Economy',
    fare: 5200,
    issuedAt: '2026-09-25 11:32'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    paymentId: 'PAY-900',
    bookingId: 'BK-501',
    amount: 5200,
    mode: 'UPI',
    status: 'Success',
    timestamp: '2026-09-25 10:16'
  },
  {
    paymentId: 'PAY-901',
    bookingId: 'BK-502',
    amount: 5200,
    mode: 'Card',
    status: 'Success',
    timestamp: '2026-09-25 11:31'
  }
];

export const INITIAL_BOARDING_PASSES: BoardingPass[] = [
  {
    passId: 'BP-881',
    ticketNo: 'TK-12A',
    bookingId: 'BK-501',
    flightNo: 'AI-101',
    passengerName: 'Ravi Kumar',
    seatNo: '12A',
    gateNo: 'G03',
    terminal: 'T1',
    boardingTime: '15:00',
    sequenceNo: 42,
    barcode: 'M1KUMAR/RAVI        EBK501 HYDDELAI 0101 270Y012A0042 100',
    status: 'Issued'
  }
];

export const INITIAL_BAGGAGE: Baggage[] = [
  {
    baggageId: 'BAG-1001',
    passengerId: 'PAX-901',
    passengerName: 'Ravi Kumar',
    flightNo: 'AI-101',
    weight: 18.5,
    origin: 'HYD',
    destination: 'DEL',
    currentLocation: 'Belt B2 -> Loading Tug',
    status: 'LOADING',
    assignedBelt: 'B2',
    containerId: 'AKE-2091AI',
    lastScanTimestamp: '14:48',
    journey: [
      { stage: 'CHECK-IN', timestamp: '13:40', location: 'Counter C02 (T1)', operator: 'Agent Priya K.', status: 'Success', notes: 'Tag generated, weight verified 18.5kg' },
      { stage: 'ACCEPTED', timestamp: '13:42', location: 'Induction Belt 02', operator: 'Auto Infeed', status: 'Success' },
      { stage: 'SECURITY', timestamp: '13:50', location: 'Inline X-Ray Scanner X03', operator: 'BCAS Level-3 Scanner', status: 'Success', notes: 'Clear. No contraband' },
      { stage: 'SORTING', timestamp: '14:15', location: 'Automated Tray Sorter Line 4', operator: 'BHS System Controller', status: 'Success' },
      { stage: 'BAGGAGE BELT', timestamp: '14:30', location: 'Make-Up Carousel B2', operator: 'Ground Handler Team 2', status: 'Success' },
      { stage: 'LOADING', timestamp: '14:48', location: 'Apron Stand S05 - Hold 1', operator: 'Ramp Agent Satish V.', status: 'Success', notes: 'Loaded into container AKE-2091AI' }
    ]
  },
  {
    baggageId: 'BAG-1002',
    passengerId: 'PAX-902',
    passengerName: 'Priya Sharma',
    flightNo: 'AI-101',
    weight: 14.2,
    origin: 'HYD',
    destination: 'DEL',
    currentLocation: 'Belt B2',
    status: 'BAGGAGE BELT',
    assignedBelt: 'B2',
    containerId: 'AKE-2091AI',
    lastScanTimestamp: '14:40',
    journey: [
      { stage: 'CHECK-IN', timestamp: '13:45', location: 'Counter C02', operator: 'Agent Priya K.', status: 'Success' },
      { stage: 'SECURITY', timestamp: '13:58', location: 'Scanner X03', operator: 'Automated X-Ray', status: 'Success' },
      { stage: 'SORTING', timestamp: '14:22', location: 'Sorter 4', operator: 'BHS Controller', status: 'Success' },
      { stage: 'BAGGAGE BELT', timestamp: '14:40', location: 'Carousel B2', operator: 'Team 2', status: 'Success' }
    ]
  },
  {
    baggageId: 'BAG-2041',
    passengerId: 'PAX-880',
    passengerName: 'Anil Deshmukh',
    flightNo: 'AI-101',
    weight: 22.0,
    origin: 'HYD',
    destination: 'DEL',
    currentLocation: 'Transfer Chute B5 (BOM Flight Cart)',
    status: 'MISROUTED',
    assignedBelt: 'B5',
    lastScanTimestamp: '14:20',
    exceptionIssue: 'MISROUTED: Tagged for HYD -> DEL, but scanned at HYD -> BOM Transfer Chute',
    assignedStaff: 'K. Ashok Kumar (Baggage Supervisor)',
    journey: [
      { stage: 'CHECK-IN', timestamp: '13:10', location: 'Counter C01', operator: 'Agent Rajesh', status: 'Success' },
      { stage: 'SECURITY', timestamp: '13:25', location: 'Scanner X01', operator: 'BCAS Level-3', status: 'Success' },
      { stage: 'SORTING', timestamp: '13:55', location: 'Diverter Arm 7', operator: 'BHS Optical Reader', status: 'Warning', notes: 'Misdirected to Chute B5' },
      { stage: 'EXCEPTION', timestamp: '14:20', location: 'Transfer Chute B5', operator: 'Baggage Staff Ashok K.', status: 'Exception', notes: 'Operator intercepted bag before BOM loading' }
    ]
  },
  {
    baggageId: 'BAG-3310',
    passengerId: 'PAX-771',
    passengerName: 'Kavita Pillai',
    flightNo: '6E-512',
    weight: 16.0,
    origin: 'HYD',
    destination: 'MAA',
    currentLocation: 'Stand S02 - Aft Hold',
    status: 'AIRCRAFT',
    assignedBelt: 'B1',
    lastScanTimestamp: '14:38',
    journey: [
      { stage: 'CHECK-IN', timestamp: '13:00', location: 'Counter C05', operator: 'IndiGo Staff', status: 'Success' },
      { stage: 'SECURITY', timestamp: '13:15', location: 'Scanner X02', operator: 'BCAS', status: 'Success' },
      { stage: 'BAGGAGE BELT', timestamp: '13:40', location: 'Belt B1', operator: 'Ground Ops', status: 'Success' },
      { stage: 'AIRCRAFT', timestamp: '14:38', location: 'A321 VT-EDF', operator: 'Ramp Crew', status: 'Success' }
    ]
  }
];

export const INITIAL_STAFF: Staff[] = [
  { staffId: 'STF-101', name: 'B. Rishi Vardhan', department: 'Airport Operations', role: 'Operations Director', shift: 'Morning', location: 'AOCC Control Deck', status: 'Assigned', currentAssignment: 'AOCC Shift Lead', phone: '+91 98001 11222' },
  { staffId: 'STF-102', name: 'K. Ashok Kumar', department: 'Baggage', role: 'Baggage Operations Lead', shift: 'Morning', location: 'BHS Sorting Cell 4', status: 'Busy', currentAssignment: 'Resolving BAG-2041 exception', phone: '+91 98001 22333' },
  { staffId: 'STF-103', name: 'K. Satya Sree', department: 'Check-in', role: 'Lead Passenger Service Agent', shift: 'Morning', location: 'T1 Departure Island B', status: 'Assigned', currentAssignment: 'Flight AI-101 Check-in Supervision', phone: '+91 98001 33444' },
  { staffId: 'STF-104', name: 'T. Koushik', department: 'Airside Operations', role: 'Senior Air Traffic Controller', shift: 'Morning', location: 'ATC Tower Level 8', status: 'Assigned', currentAssignment: 'Runway 09/27 Sequencer', phone: '+91 98001 44555' },
  { staffId: 'STF-105', name: 'Priya K.', department: 'Check-in', role: 'Check-in Agent', shift: 'Morning', location: 'Counter C02', status: 'Assigned', currentFlightNo: 'AI-101', phone: '+91 98001 55666' },
  { staffId: 'STF-106', name: 'Satish V.', department: 'Ground Handling', role: 'Ramp Supervisor', shift: 'Morning', location: 'Stand S05', status: 'Busy', currentFlightNo: 'AI-101', phone: '+91 98001 66777' },
  { staffId: 'STF-107', name: 'Deepak Verma', department: 'Maintenance', role: 'Aeronautical Ground Lighting Engineer', shift: 'Morning', location: 'Runway 27 Threshold', status: 'Assigned', currentAssignment: 'PAPI Light Calibration', phone: '+91 98001 77888' },
  { staffId: 'STF-108', name: 'Meera Nair', department: 'Terminal Operations', role: 'Passenger Flow Coordinator', shift: 'Morning', location: 'Security Checkpoint S2', status: 'Assigned', currentAssignment: 'Queue mitigation at S2', phone: '+91 98001 88999' },
  { staffId: 'STF-109', name: 'Rohan Gupta', department: 'Security', role: 'CISF Inspector', shift: 'Morning', location: 'T1 Central Concourse', status: 'Available', phone: '+91 98001 99000' }
];

export const INITIAL_TERMINAL_FLOW: TerminalAreaFlow[] = [
  { areaId: 'FLOW-C1', areaName: 'T1 Main Check-in Hall', type: 'Check-in', terminal: 'T1', currentQueue: 64, capacity: 200, estimatedWaitMinutes: 8, status: 'NORMAL', openCounters: 6, totalCounters: 10 },
  { areaId: 'FLOW-C2', areaName: 'T2 Check-in Hall', type: 'Check-in', terminal: 'T2', currentQueue: 42, capacity: 150, estimatedWaitMinutes: 5, status: 'NORMAL', openCounters: 4, totalCounters: 8 },
  { areaId: 'FLOW-S1', areaName: 'Security Checkpoint S1 (North)', type: 'Security', terminal: 'T1', currentQueue: 45, capacity: 180, estimatedWaitMinutes: 6, status: 'NORMAL', openCounters: 4, totalCounters: 6 },
  { areaId: 'FLOW-S2', areaName: 'Security Checkpoint S2 (South)', type: 'Security', terminal: 'T1', currentQueue: 148, capacity: 180, estimatedWaitMinutes: 19, status: 'HIGH QUEUE', openCounters: 5, totalCounters: 6 },
  { areaId: 'FLOW-IMM', areaName: 'T2 International Immigration', type: 'Immigration', terminal: 'T2', currentQueue: 52, capacity: 160, estimatedWaitMinutes: 9, status: 'NORMAL', openCounters: 6, totalCounters: 12 },
  { areaId: 'FLOW-G03', areaName: 'Gate G03 Boarding Lounge', type: 'Gate Waiting', terminal: 'T1', currentQueue: 112, capacity: 180, estimatedWaitMinutes: 4, status: 'MODERATE', openCounters: 2, totalCounters: 2 },
  { areaId: 'FLOW-CLM', areaName: 'Baggage Claim Hall 1 (Belts 1-4)', type: 'Baggage Claim', terminal: 'T1', currentQueue: 180, capacity: 400, estimatedWaitMinutes: 12, status: 'NORMAL', openCounters: 4, totalCounters: 4 }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    incidentId: 'INC-401',
    type: 'Flight Delay',
    severity: 'High',
    location: 'Stand S05 / Gate G03',
    flightNo: 'AI-101',
    reportedBy: 'AOCC Turnaround Watcher',
    timestamp: '14:45',
    status: 'Mitigating',
    assignedTeam: 'Ground Handling & Catering Taskforce',
    description: 'AI-101 turnaround is 18 minutes behind schedule due to delayed high-loader catering truck. Affected resources: Gate G03, Runway 09 slot, Belt B2.',
    resolution: 'Additional high-loader deployed; boarding expedited via dual doors.'
  },
  {
    incidentId: 'INC-402',
    type: 'Terminal Congestion',
    severity: 'Medium',
    location: 'T1 Security Checkpoint S2',
    reportedBy: 'Terminal Flow Monitor',
    timestamp: '14:32',
    status: 'Investigating',
    assignedTeam: 'Terminal Operations & CISF',
    description: 'Passenger queue reached 148 pax (82% capacity) with estimated wait of 19 minutes. CISF lane 6 opening requested.'
  },
  {
    incidentId: 'INC-403',
    type: 'Baggage Issue',
    severity: 'Medium',
    location: 'BHS Chute B5',
    reportedBy: 'Baggage RFID Scanner',
    timestamp: '14:20',
    status: 'Mitigating',
    assignedTeam: 'Baggage Reconciliation Team',
    description: 'Baggage BAG-2041 misrouted towards BOM container instead of DEL. Bag intercepted and rerouted.',
    resolution: 'Assigned to K. Ashok Kumar. Bag transferred to Belt B2 for AI-101.'
  },
  {
    incidentId: 'INC-404',
    type: 'Equipment Failure',
    severity: 'Low',
    location: 'Gate G06',
    reportedBy: 'Maintenance Lead',
    timestamp: '11:15',
    status: 'Investigating',
    assignedTeam: 'Aerobridge Electrical Engineering',
    description: 'Passenger Boarding Bridge G06 hydraulic elevation sensor jitter. Gate marked Maintenance.'
  }
];

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    alertId: 'ALT-101',
    severity: 'HIGH',
    source: 'Turnaround Milestone Engine',
    affectedResource: 'Gate G03 / Stand S05 / Runway 09',
    time: '14:45',
    description: 'AI-101 turnaround is 18 minutes behind schedule. Departure revised from 15:30 to 15:48.',
    recommendedAction: 'Notify Ground Operations; expedite cabin boarding; adjust Runway 09 slot to 15:45.',
    assignedDepartment: 'Ground Operations',
    status: 'ACTIVE'
  },
  {
    alertId: 'ALT-102',
    severity: 'MEDIUM',
    source: 'Passenger Flow Sensor',
    affectedResource: 'Security Checkpoint S2',
    time: '14:35',
    description: 'Security S2 wait time exceeded 15m threshold (current: 19m).',
    recommendedAction: 'Open overflow CISF lane 6 and reroute passengers to North Checkpoint S1.',
    assignedDepartment: 'Terminal Operations',
    status: 'ACTIVE'
  },
  {
    alertId: 'ALT-103',
    severity: 'LOW',
    source: 'BHS Automated Tag Reader',
    affectedResource: 'Baggage Belt B5',
    time: '14:21',
    description: 'Misrouted baggage BAG-2041 intercepted at Chute B5.',
    recommendedAction: 'Verify physical tag and dispatch to AI-101 loader on Stand S05.',
    assignedDepartment: 'Baggage Operations',
    status: 'ACKNOWLEDGED'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceAsset[] = [
  { assetId: 'AST-G06', name: 'Passenger Boarding Bridge G06', type: 'Boarding Bridge', location: 'Gate G06 (T1)', status: 'Under Maintenance', lastMaintenance: '2026-08-14', nextMaintenance: '2026-09-28', assignedTechnician: 'Deepak Verma', healthPercent: 62 },
  { assetId: 'AST-S04', name: 'Apron Stand S04 Hydrant Pit', type: 'Ground Equipment', location: 'Stand S04 (T1)', status: 'Under Maintenance', lastMaintenance: '2026-09-10', nextMaintenance: '2026-09-27', assignedTechnician: 'Sanjay Rawat', healthPercent: 70 },
  { assetId: 'AST-RWY09', name: 'Runway 09 Centerline Lighting & ILS', type: 'Runway', location: 'Runway 09/27', status: 'Operational', lastMaintenance: '2026-09-20', nextMaintenance: '2026-10-20', assignedTechnician: 'ATC Airside Team', healthPercent: 98 },
  { assetId: 'AST-B02', name: 'Baggage Carousel & Sorter B2', type: 'Baggage Belt', location: 'Make-Up Area B', status: 'Operational', lastMaintenance: '2026-09-15', nextMaintenance: '2026-10-15', assignedTechnician: 'BHS Eng. Rakesh', healthPercent: 94 },
  { assetId: 'AST-C03', name: 'Check-in Counter C03 Scale & Printer', type: 'Check-in Counter', location: 'T1 Check-in Island A', status: 'Maintenance Due', lastMaintenance: '2026-07-10', nextMaintenance: '2026-09-26', assignedTechnician: 'IT Systems Team', healthPercent: 78 }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { logId: 'LOG-001', timestamp: '14:48:12', user: 'B. Rishi Vardhan', role: 'Airport Administrator', action: 'TURNAROUND_DELAY_RECORDED', entity: 'Flight AI-101', oldValue: '0 min delay', newValue: '18 min delay (ETD 15:48)' },
  { logId: 'LOG-002', timestamp: '14:45:00', user: 'T. Koushik', role: 'Air Traffic Controller', action: 'RUNWAY_SLOT_REALLOCATED', entity: 'Runway 09', oldValue: 'AI-101 Slot 15:30', newValue: 'AI-101 Slot 15:45' },
  { logId: 'LOG-003', timestamp: '14:22:15', user: 'K. Ashok Kumar', role: 'Baggage Staff', action: 'BAGGAGE_EXCEPTION_INTERCEPTED', entity: 'Baggage BAG-2041', oldValue: 'Status: SORTING (Chute B5)', newValue: 'Status: MISROUTED (Rerouting to B2)' },
  { logId: 'LOG-004', timestamp: '13:42:08', user: 'K. Satya Sree', role: 'Check-in Agent', action: 'PASSENGER_CHECK_IN', entity: 'Passenger Ravi Kumar (PAX-901)', oldValue: 'Booking: Confirmed', newValue: 'Checked-In, Seat: 12A, BP-881 Issued' },
  { logId: 'LOG-005', timestamp: '13:42:15', user: 'Priya K.', role: 'Check-in Agent', action: 'BAGGAGE_REGISTERED', entity: 'Baggage BAG-1001', oldValue: 'Unregistered', newValue: 'Weight: 18.5kg, Belt: B2, Dest: DEL' }
];

export const INITIAL_AIRPORT_STATS: AirportStats = {
  airportStatus: 'NORMAL OPERATIONS',
  simulatedTime: '14:52:10',
  simulatedDate: '27-SEP-2026',
  weather: {
    tempC: 31,
    condition: 'Few Clouds / Good Visibility',
    windSpeedKts: 8,
    windDirectionDeg: 90,
    visibilityKm: 10,
    qnhHpa: 1012
  },
  runwaysTotal: 3,
  runwaysAvailable: 2,
  runwaysOccupied: 1,
  gatesTotal: 18,
  gatesAvailable: 11,
  gatesOccupied: 6,
  standsTotal: 12,
  standsAvailable: 5,
  standsOccupied: 6,
  flightsToday: 42,
  arrivalsToday: 18,
  departuresToday: 24,
  delayedFlights: 3,
  activeAircraft: 36,
  passengersToday: 8420,
  baggageProcessed: 12340,
  openIncidents: 4,
  staffOnDuty: 48,
  onTimePerformancePercent: 92.8,
  averageTurnaroundMins: 46
};
