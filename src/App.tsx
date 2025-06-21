import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import ProjectPlan from "./pages/ProjectPlan";
import UserManagement from "./pages/UserManagement";
import ProjectOverview from "./pages/ProjectOverview";

function App() {
  return (
    <Router basename="/doesinger-app">
      <nav className="bg-slate-900 text-white p-4 flex gap-4">
        <Link to="/">🏠 Dashboard</Link>
        <Link to="/timeline">🕒 Zeitleiste</Link>
        <Link to="/projectplan">📋 Projektplan</Link>
        <Link to="/user-management">👥 User-Verwaltung</Link>
        <Link to="/project-overview">📊 Projektübersicht</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/projectplan" element={<ProjectPlan />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/project-overview" element={<ProjectOverview />} />
      </Routes>
    </Router>
  );
}

export default App;

