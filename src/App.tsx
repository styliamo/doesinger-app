import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import InvoicesPage from "@/pages/InvoicesPage";
import Timetable from "@/pages/Timetable";
import ProjectPlan from "@/pages/ProjectPlan";
import UserManagement from "@/pages/UserManagement";
import ProjectOverview from "@/pages/ProjectOverview";
import ProjectTimeline from "@/pages/ProjectTimeline";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
        <Link to="/">🏠 Dashboard</Link> |{" "}
        <Link to="/invoices">📄 Rechnungen</Link> |{" "}
        <Link to="/timetable">🕒 Zeitleiste</Link> |{" "}
        <Link to="/plan">🗂️ Projektplan</Link> |{" "}
        <Link to="/overview">📊 Projektübersicht</Link> |{" "}
        <Link to="/users">👥 Nutzerverwaltung</Link> |{" "}
        <Link to="/timeline">🗓️ Timeline</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/plan" element={<ProjectPlan />} />
        <Route path="/overview" element={<ProjectOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/timeline" element={<ProjectTimeline />} />
      </Routes>
    </Router>
  );
}

