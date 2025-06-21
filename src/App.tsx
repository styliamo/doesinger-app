
npm run build
git add src/pages/ProfileSetup.tsx src/App.tsx
git commit -m "feat: add profile setup page and routing"
git push origin main

import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectPlan from "./pages/ProjectPlan";
import UserManagement from "./pages/UserManagement";
import ProfileSetup from "./pages/ProfileSetup";

export default function App() {
  const profile = JSON.parse(localStorage.getItem("profile") || "null");

  return (
    <Router>
      <nav className="p-4 bg-gray-200">
        <Link className="mr-4" to="/">🏠 Dashboard</Link>
        <Link className="mr-4" to="/plan">🗂️ Projektplan</Link>
        <Link className="mr-4" to="/overview">📄 Projektübersicht</Link>
        <Link className="mr-4" to="/users">👥 User-Verwaltung</Link>
      </nav>

      <div className="p-4">
        <Routes>
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route
            path="/*"
            element={
              profile
                ? <Routes>
                    <Route path="/" element={<ProjectOverview />} />
                    <Route path="/plan" element={<ProjectPlan />} />
                    <Route path="/overview" element={<ProjectOverview />} />
                    <Route path="/users" element={<UserManagement />} />
                  </Routes>
                : <ProfileSetup />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

