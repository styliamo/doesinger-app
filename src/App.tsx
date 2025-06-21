import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import InvoicesPage from "./pages/InvoicesPage";
import Timetable from "./pages/Timetable";

export default function App() {
  return (
    <BrowserRouter basename="/doesinger-app">
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>🏠 Dashboard</Link>
          <Link to="/invoices" style={{ marginRight: "1rem" }}>📄 Rechnungen</Link>
          <Link to="/timetable">🗓️ Zeitleiste</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

