import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectPlan from "./pages/ProjectPlan";
import ProjectOverview from "./pages/ProjectOverview";
import UserManagement from "./pages/UserManagement";
import ProfileSetup from "./pages/ProfileSetup";

export default function App() {
  const profile = localStorage.getItem("userProfile");
  const needsProfileSetup = !profile;

  return (
    <Router basename="/doesinger-app">
      <div className="flex">
        <nav className="w-64 h-screen bg-gray-100 p-4">
          <h1 className="text-xl font-bold mb-6">🛠 Dashboard</h1>
          <ul className="space-y-2">
            <li><a href="/doesinger-app/" className="text-blue-600">🏠 Übersicht</a></li>
            <li><a href="/doesinger-app/project-plan" className="text-blue-600">🗂️ Projektplan</a></li>
            <li><a href="/doesinger-app/project-overview" className="text-blue-600">📁 Projektübersicht</a></li>
            <li><a href="/doesinger-app/user-management" className="text-blue-600">👥 User-Verwaltung</a></li>
          </ul>
        </nav>
        <main className="flex-1 p-6">
          <Routes>
            {needsProfileSetup && (
              <>
                <Route path="*" element={<Navigate to="/profile-setup" replace />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
              </>
            )}
            {!needsProfileSetup && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/project-plan" element={<ProjectPlan />} />
                <Route path="/project-overview" element={<ProjectOverview />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

