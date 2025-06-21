import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectPlan from "./pages/ProjectPlan";
import UserManagement from "./pages/UserManagement";
import ProfileSetup from "./pages/ProfileSetup";
import InviteUser from "./pages/InviteUser";

export default function App() {
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  return (
    <Router>
      <nav className="p-4 bg-gray-200">
        <Link className="mr-4" to="/">🏠 Dashboard</Link>
        <Link className="mr-4" to="/plan">🗂️ Projektplan</Link>
        <Link className="mr-4" to="/overview">📄 Projektübersicht</Link>
        <Link className="mr-4" to="/users">👥 User-Verwaltung</Link>
        <Link className="mr-4" to="/invite">✉️ Einladen</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProjectOverview />} />
        <Route path="/plan" element={<ProjectPlan />} />
        <Route path="/overview" element={<ProjectOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/invite" element={<InviteUser />} />
      </Routes>
    </Router>
  );
}

