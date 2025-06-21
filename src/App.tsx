import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoicesPage from "./pages/InvoicesPage";
import Timetable from "./pages/Timetable";
import ProjectPlan from "./pages/ProjectPlan";
import UserManagement from "./pages/UserManagement";
import ProjectOverview from "./pages/ProjectOverview";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">🏠 Dashboard</Link></li>
          <li><Link to="/invoices">📄 Rechnungen</Link></li>
          <li><Link to="/timetable">🕒 Zeitleiste</Link></li>
          <li><Link to="/plan">🗂️ Projektplan</Link></li>
          <li><Link to="/overview">📋 Projektübersicht</Link></li>
          <li><Link to="/users">👥 Benutzerverwaltung</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/plan" element={<ProjectPlan />} />
        <Route path="/overview" element={<ProjectOverview />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

