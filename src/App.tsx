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
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gray-900 text-white p-4 flex space-x-4">
          <Link to="/">🏠 Dashboard</Link>
          <Link to="/invoices">📄 Rechnungen</Link>
          <Link to="/timeline">🕒 Zeitleiste</Link>
          <Link to="/plan">🗂️ Projektplan</Link>
          <Link to="/users">👥 User-Verwaltung</Link>
          <Link to="/overview">📊 Projektübersicht</Link>
        </nav>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/timeline" element={<Timetable />} />
            <Route path="/plan" element={<ProjectPlan />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/overview" element={<ProjectOverview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

