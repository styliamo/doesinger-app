import { useEffect, useState } from "react";

interface Project {
  id: number;
  name: string;
  users: string[]; // Benutzer-E-Mails oder IDs
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(savedProjects);

    const email = localStorage.getItem("userEmail");
    if (email) {
      setCurrentUser(email);
    }
  }, []);

  const visibleProjects = projects.filter((project) =>
    project.users.includes(currentUser)
  );

  return (
    <div>
      <h2>Meine Projekte</h2>
      <ul>
        {visibleProjects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}

