import { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  tasks: string[];
  users: string[];
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      setProjects(JSON.parse(stored));
    }
  }, []);

  return (
    <div>
      <h2>📊 Projektübersicht</h2>
      {projects.length === 0 ? (
        <p>Keine Projekte gefunden.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded shadow-sm">
              <h3 className="font-bold">{project.name}</h3>
              <p>🧑‍🤝‍🧑 Zugewiesene Nutzer: {project.users.join(", ") || "Keine"}</p>
              <p>✅ Aufgabenanzahl: {project.tasks.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

