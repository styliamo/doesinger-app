import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    const currentUser = window.currentUser || { projectIds: [] };
    const filteredProjects = allProjects.filter((p: Project) =>
      currentUser.projectIds.includes(p.id)
    );
    setProjects(filteredProjects);
  }, []);

  return (
    <div>
      <h2>Meine Projekte</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      {projects.length === 0 && (
        <p>Keine Projekte verfügbar. Bitte wenden Sie sich an den Admin.</p>
      )}
    </div>
  );
}

