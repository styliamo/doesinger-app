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
      <nav className="bg-blue-600 text-white p-4 flex space-x-4">
        <Link to="/">🏠 Dashboard</Link>
        <Link to="/invoices">📄 Rechnungen</Link>
        <Link to="/timeline">🕒 Zeitleiste</Link>
        <Link to="/plan">🗂️ Projektplan</Link>
        <Link to="/projects">📊 Projektübersicht</Link>
        <Link to="/users">👥 User-Verwaltung</Link>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/timeline" element={<Timetable />} />
          <Route path="/plan" element={<ProjectPlan />} />
          <Route path="/projects" element={<ProjectOverview />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>
    </Router>
  );
}

