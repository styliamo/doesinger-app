import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🌍 Aktuell hart codierter Login (Simulation)
// In einem echten Setup würde dies über Auth-Provider oder Session Storage laufen
const loggedInUserId = "user-1";
window.currentUserId = loggedInUserId;

// 👇 globale Zuordnung von Projekten pro User simulieren
const userProjectsMap = {
  "user-1": ["proj-A", "proj-B"],
  "user-2": ["proj-B", "proj-C"],
  "vendor-1": ["proj-A"],
  admin: ["proj-A", "proj-B", "proj-C"],
};

// 🧠 Globale Userdaten bereitstellen
window.currentUser = {
  id: loggedInUserId,
  projectIds: userProjectsMap[loggedInUserId] || [],
};

createRoot(document.getElementById("root")!).render(<App />);

