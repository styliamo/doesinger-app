import { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  deadline: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  projects: number[];
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(storedProjects);

    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    setUser(storedUser);

    if (storedUser) {
      const filtered = storedProjects.filter((p: Project) =>
        storedUser.projects.includes(p.id)
      );
      setAssignedProjects(filtered);
    }
  }, []);

  return (
    <div>
      <h2>Meine Projekte</h2>
      {assignedProjects.length === 0 ? (
        <p>Dir wurden noch keine Projekte zugewiesen.</p>
      ) : (
        <ul>
          {assignedProjects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong><br />
              Deadline: {project.deadline}<br />
              {project.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

