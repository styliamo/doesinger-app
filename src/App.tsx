import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import InvoicesPage from "./pages/InvoicesPage"
import Timetable from "./pages/Timetable"
import ProjectPlan from "./pages/ProjectPlan"
import UserManagement from "./pages/UserManagement"
import ProjectOverview from "./pages/ProjectOverview"

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 10, backgroundColor: "#1a1a2e" }}>
        <Link style={{ color: "#fff", marginRight: 10 }} to="/">🏠 Dashboard</Link>
        <Link style={{ color: "#fff", marginRight: 10 }} to="/invoices">📄 Rechnungen</Link>
        <Link style={{ color: "#fff", marginRight: 10 }} to="/timetable">🕒 Zeitleiste</Link>
        <Link style={{ color: "#fff", marginRight: 10 }} to="/plan">📁 Projektplan</Link>
        <Link style={{ color: "#fff", marginRight: 10 }} to="/users">👥 User‑Verwaltung</Link>
        <Link style={{ color: "#fff" }} to="/projects">📊 Projektübersicht</Link>
      </nav>
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/plan" element={<ProjectPlan />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/projects" element={<ProjectOverview />} />
        </Routes>
      </div>
    </Router>
  )
}

