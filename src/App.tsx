import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoicesPage from "./pages/InvoicesPage";
import Timetable from "./pages/Timetable";
import ProjectPlan from "./pages/ProjectPlan";
import ProjectOverview from "./pages/ProjectOverview";
import UserManagement from "./pages/UserManagement";

export default function App() {
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex space-x-4">
        <Link to="/" className="hover:underline">🏠 Dashboard</Link>
        <Link to="/invoices" className="hover:underline">📄 Rechnungen</Link>
        <Link to="/timetable" className="hover:underline">🕒 Zeitleiste</Link>
        <Link to="/plan" className="hover:underline">📁 Projektplan</Link>
        <Link to="/projects" className="hover:underline">📊 Projektübersicht</Link>
        <Link to="/users" className="hover:underline">👥 User-Verwaltung</Link>
      </nav>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/plan" element={<ProjectPlan />} />
          <Route path="/projects" element={<ProjectOverview />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>
    </Router>
  );
}
