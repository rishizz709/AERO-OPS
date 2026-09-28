import React from 'react';
import { useAodb } from './context/AodbContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationToast } from './components/common/NotificationToast';

import { OperationsCenterView } from './views/OperationsCenterView';
import { AirportMapView } from './views/AirportMapView';
import { TurnaroundMonitorView } from './views/TurnaroundMonitorView';
import { FlightOperationsView } from './views/FlightOperationsView';
import { GateStandManagementView } from './views/GateStandManagementView';
import { RunwayManagementView } from './views/RunwayManagementView';
import { BaggageOperationsView } from './views/BaggageOperationsView';
import { CheckInOperationsView } from './views/CheckInOperationsView';
import { PassengerManagementView } from './views/PassengerManagementView';
import { TerminalOperationsView } from './views/TerminalOperationsView';
import { StaffOperationsView } from './views/StaffOperationsView';
import { IncidentAlertsView } from './views/IncidentAlertsView';
import { DisruptionManagementView } from './views/DisruptionManagementView';
import { MaintenanceManagementView } from './views/MaintenanceManagementView';
import { AircraftFleetView } from './views/AircraftFleetView';
import { PassengerPortalView } from './views/PassengerPortalView';
import { AnalyticsScorecardView } from './views/AnalyticsScorecardView';
import { ReportsView } from './views/ReportsView';
import { AodbDatabaseView } from './views/AodbDatabaseView';
import { AuditLogsView } from './views/AuditLogsView';
import { AcademicOoadView } from './views/AcademicOoadView';

export const AppContent: React.FC = () => {
  const { activeRoute } = useAodb();

  const renderCurrentView = () => {
    switch (activeRoute) {
      case '/operations-center':
        return <OperationsCenterView />;
      case '/airport-map':
        return <AirportMapView />;
      case '/turnaround':
        return <TurnaroundMonitorView />;
      case '/flights':
        return <FlightOperationsView />;
      case '/gates':
      case '/stands':
        return <GateStandManagementView />;
      case '/runways':
        return <RunwayManagementView />;
      case '/baggage':
      case '/baggage-exceptions':
        return <BaggageOperationsView />;
      case '/check-in':
        return <CheckInOperationsView />;
      case '/passengers':
        return <PassengerManagementView />;
      case '/passenger-flow':
      case '/terminal':
        return <TerminalOperationsView />;
      case '/staff':
      case '/shifts':
        return <StaffOperationsView />;
      case '/incidents':
        return <IncidentAlertsView />;
      case '/disruptions':
        return <DisruptionManagementView />;
      case '/maintenance':
        return <MaintenanceManagementView />;
      case '/aircraft':
        return <AircraftFleetView />;
      case '/passenger-portal':
        return <PassengerPortalView />;
      case '/analytics':
        return <AnalyticsScorecardView />;
      case '/reports':
        return <ReportsView />;
      case '/aodb':
        return <AodbDatabaseView />;
      case '/audit-logs':
        return <AuditLogsView />;
      case '/academic-ooad':
        return <AcademicOoadView />;
      default:
        return <OperationsCenterView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-aviation-grid bg-radial-glow">
          <div className="max-w-[1600px] mx-auto pb-12">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      <GlobalSearchModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
