import { HashRouter as Router, Routes, Route, Link } from "react-router-dom"
import Dashboard from "@/pages/Dashboard"
import InvoicesPage from "@/pages/InvoicesPage"
import Timetable from "@/pages/Timetable"
import ProjectPlan from "@/pages/ProjectPlan"

export default function App() {
  return (
    <Router>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <Link to="/">🏠 Dashboard</Link>
        <Link to="/invoices">📄 Rechnungen</Link>
        <Link to="/timeline">🕒 Zeitleiste</Link>
        <Link to="/plan">📂 Projektplan</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/timeline" element={<Timetable />} />
        <Route path="/plan" element={<ProjectPlan />} />
      </Routes>
    </Router>
  )
}

