import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import InvoicesPage from "@/pages/InvoicesPage";
import Timetable from "@/pages/Timetable";
import ProjectPlan from "@/pages/ProjectPlan";
import UserManagement from "@/pages/UserManagement";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/">🏠 Dashboard</Link> |{" "}
        <Link to="/invoices">📄 Rechnungen</Link> |{" "}
        <Link to="/timetable">🕒 Zeitleiste</Link> |{" "}
        <Link to="/project-plan">🗂️ Projektplan</Link> |{" "}
        <Link to="/user-management">👥 Benutzerverwaltung</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/project-plan" element={<ProjectPlan />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

