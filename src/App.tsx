import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import InvoicesPage from "@/pages/InvoicesPage";
import Timetable from "@/pages/Timetable";
import ProjectPlan from "@/pages/ProjectPlan";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter basename="/doesinger-app">
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <Link to="/">🏠 Dashboard</Link>
          <Link to="/invoices">📄 Rechnungen</Link>
          <Link to="/timetable">🕒 Zeitleiste</Link>
          <Link to="/plan">🗂️ Projektplan</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/plan" element={<ProjectPlan />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

