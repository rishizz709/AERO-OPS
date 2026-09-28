# AERO-OPS: Centralized Airport Operations Management System (AMS)
> **Object Oriented Analysis & Design (OOAD) using UML Project**  
> **Aditya University — Department of Artificial Intelligence and Machine Learning**  
> Presented by:
> - **B. Rishi Vardhan** (24B11AI051) — *System Architect & AOCC Lead*
> - **K. Ashok Kumar** (24B11AI160) — *Baggage Operations & Reconciliation Lead*
> - **K. Satya Sree** (24B11AI180) — *Passenger & Check-in Systems Lead*
> - **T. Koushik** (24B11AI427) — *Air Traffic Control (ATC) & Airfield Sequencing Lead*

---

## ✈️ Project Vision & Philosophy: "ONE AIRPORT — ONE OPERATIONAL VIEW"

This platform is **NOT a ticket booking site** and **NOT primarily an airline website**.  
It is an **AIRPORT-WIDE OPERATIONS & MANAGEMENT PLATFORM** where the airport itself is the center of the system.

In real-world aviation, modern airports coordinate flights, aircraft, stands, gates, runways, baggage handling, turnaround crews, and passenger flows through a collaborative **Airport Operations Center (AOCC / APOC)** backed by a single **Airport Operational Database (AODB)**. 

If one parameter changes (e.g., flight **AI-101** delayed by 18 minutes due to catering), the impact cascades automatically across:
1. Flight Status & ETD
2. Gate & Stand Schedule (Gate G03 buffer, Stand S05 chocks-off)
3. Runway 09 departure sequencing slot
4. Passenger boarding alerts & terminal lounge notifications
5. Baggage handling & ramp loading container dispatch
6. Ground servicing tasks (refueling, cleaning, tug tractors)
7. Master AOCC Dashboard KPIs & SLA alerts

---

## 🏛️ Academic OOAD & UML Diagram Alignment

The implementation faithfully maps 100% to the Aditya University Review 1 UML design:

| UML Diagram | PPT Slide Description | Implemented Web Module |
| :--- | :--- | :--- |
| **Object Diagram** | Snapshot of confirmed booking (`hyd:Airport`, `ai101:Flight`, `ravi:Passenger`, `bk501:Booking`, `a320:Aircraft`, `g3:Gate`, `tk12A:Ticket`, `pay900:Payment`, `bag77:Baggage`) | **Check-in Desk & Live Flight AI-101 View** (Fully loaded with Ravi Kumar, Seat 12A, TK-12A, BAG-1001, UPI payment) |
| **Class Diagram** | Static domain classes (`Airport`, `Flight`, `Aircraft`, `Passenger`, `Booking`, `Ticket`, `Payment`, `Baggage`, `Gate`, `Runway`, `Staff`) | **`src/types/index.ts` & Relational AODB Schema** (`/aodb`) |
| **Use Case Diagram** | 5 Actors: Passenger, Check-in Agent, Ground Staff, ATC, Administrator with `«include»` & `«extend»` relationships | **Role-Based Access Control (RBAC)** with instant Role Switcher dropdown |
| **Sequence Diagram** | Book Ticket & Three-layer architecture (Boundary `BookingUI`, Control `BookingController`, Entities `Flight`, `Booking`, `Payment`, `Ticket`) | **Interactive Booking & Check-in Service Flow** (`/check-in`, `/passenger-portal`) |
| **Activity Diagram** | Workflow: Search Flight → Check Availability → Make Payment → Issue Ticket → Web Check-in → Seat Assignment → Boarding Pass | **Web Check-in & Printable Boarding Pass Generator** (`/check-in`) |
| **Deployment Diagram** | Client Device (Web/Mobile) ↔ Application Server (Node/Express) ↔ Database Server (AODB PostgreSQL/MySQL) | **Full-Stack Architecture**: React 18 + Vite frontend & Express REST backend |
| **Component Diagram** | Flight Mgmt, Booking, Check-in & Baggage, Gate & Runway, Payment, Administration | **Modular View Architecture** in `src/views/` |

---

## 🚀 Key Modules & Screen Directory

1. **Airport Operations Center (`/operations-center`)**: 3-column AOCC digital command room with airport status bar, live flight radar board, turnaround monitor preview, alerts feed, and department matrix.
2. **Interactive Airport Map (`/airport-map`)**: Interactive SVG airfield geometry of Terminal 1 & 2, Runways 09/27/14, Taxiways Alpha/Bravo, Stands S01-S12, Gates G01-G18, and inspection drawers.
3. **Flight Operations (`/flights`)**: Schedule flights, re-allocate resources with conflict prevention, passenger manifest inspection, and flight timeline.
4. **Aircraft Turnaround Monitor (`/turnaround`)**: 11-step A-CDM turnaround milestone tracking (`LANDED` → `ON STAND` → `DISEMBARKATION` → `BAGGAGE UNLOAD` → `CLEANING` → `CATERING` → `REFUELING` → `BOARDING` → `READY` → `PUSHBACK` → `DEPARTED`) with delay accountability.
5. **Stand & Apron Management (`/stands`)**: Narrowbody vs Widebody airframe compatibility validation and parking racks.
6. **Gate Management (`/gates`)**: Boarding lounge allocations with conflict prevention and boarding status timers.
7. **Runway Management (`/runways`)**: Active operational strips (RWY 09, RWY 27, RWY 14), ILS Cat-III status, wind vectors, and ATC sequencing slots.
8. **Baggage Operations (`/baggage`)**: IATA Res 753 10-stage journey tracking and exception resolution workflow (featuring misrouted bag `BAG-2041`).
9. **Departure Check-in Desk (`/check-in`)**: Identity verification, interactive seat map (Seat 12A), baggage scale tagging, and printable Boarding Pass (`BP-881`) with 2D barcode.
10. **Terminal Operations & Passenger Flow (`/passenger-flow`, `/terminal`)**: Live queue lengths, wait time estimators, and counter opening controls for Check-in C01-C06 and CISF Security S1-S4.
11. **Staff Operations & Shifts (`/staff`, `/shifts`)**: 9 airport departments, personnel roster, and on-duty status.
12. **Incident & Alert Center (`/incidents`)**: Severity tracking (Critical, High, Medium, Low), incident creation modal, and autonomous alert engine.
13. **Disruption Management (`/disruptions`)**: Crisis simulation engine for severe thunderstorms, runway FOD closures, and baggage sorter breakdowns.
14. **Asset Maintenance (`/maintenance`)**: Maintenance logs, health scores, and service schedules for aerobridges, runways, and belts.
15. **Fleet & Multi-Airline Operations (`/aircraft`)**: Multi-airline coordination for Air India, IndiGo, Akasa, Vistara, and SpiceJet.
16. **Operations Analytics (`/analytics`)**: On-time performance (92.8%), average turnaround (46m), gate utilization, and Recharts traffic trends.
17. **Central AODB Database (`/aodb`)**: Relational 3NF tables, foreign key constraints, and schema explorer.
18. **Audit Trail Logs (`/audit-logs`)**: Complete historical record of all operator actions, state changes, and timestamps.
19. **Reports & Exports (`/reports`)**: 1-click CSV download and print-ready summary for daily operations.
20. **Academic OOAD Model (`/academic-ooad`)**: Dedicated presentation tab linking all UML diagrams directly to the live software.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend API**: Node.js, Express, TypeScript (`tsx`)
- **Database / Data Engine**: Relational in-memory AODB with REST API endpoints, conflict detection rules, and localStorage fallback
- **Tooling**: Vite 5, PostCSS, Autoprefixer

---

## ⚡ Quick Start & Run Instructions

### 1. Prerequisites
- **Node.js** (v18 or v20+)
- **npm** (v9+)

### 2. Installation
```bash
# Navigate to project directory
cd airport-management-system

# Install dependencies (already installed if in scratch directory)
npm install
```

### 3. Running the Complete System
```bash
# Option A: Start both Backend API and Frontend together
npm start

# Option B: Run separately
# Terminal 1 - Backend API (port 5000):
npm run server

# Terminal 2 - Frontend UI (port 3000):
npm run dev
```

### 4. Access URLs
- **AERO-OPS Operations Center UI**: `http://localhost:3000/`
- **Backend REST API**: `http://localhost:5000/api/health`
