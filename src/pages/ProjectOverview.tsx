import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  deadline: string;
  userIds: string[];
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) setProjects(JSON.parse(stored));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">📊 Projektübersicht</h1>
      {projects.length === 0 ? (
        <p>Keine Projekte gefunden.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th>Projektname</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

