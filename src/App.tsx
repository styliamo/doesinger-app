import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import InvoicesPage from "@/pages/InvoicesPage";
import Timetable from "@/pages/Timetable";
import ProjectPlan from "@/pages/ProjectPlan";
import UserManagement from "@/pages/UserManagement";
import ProjectOverview from "@/pages/ProjectOverview";

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex space-x-4 mb-4">
          <Link to="/">🏠 Dashboard</Link>
          <Link to="/invoices">📄 Rechnungen</Link>
          <Link to="/timetable">🕒 Zeitleiste</Link>
          <Link to="/plan">🗂️ Projektplan</Link>
          <Link to="/overview">📁 Projekte</Link>
          <Link to="/users">👥 Benutzer</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/plan" element={<ProjectPlan />} />
          <Route path="/overview" element={<ProjectOverview />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

