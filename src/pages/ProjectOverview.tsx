import { useState } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
}

export default function ProjectOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("aktiv");

  const addProject = () => {
    const newProject: Project = {
      id: Date.now(),
      name,
      description,
      status,
    };
    setProjects([...projects, newProject]);
    setName("");
    setDescription("");
    setStatus("aktiv");
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Projektübersicht</h2>
      <div className="mb-4">
        <input
          placeholder="Projektname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="aktiv">Aktiv</option>
          <option value="pausiert">Pausiert</option>
          <option value="abgeschlossen">Abgeschlossen</option>
        </select>
        <button onClick={addProject} className="bg-blue-500 text-white p-2">
          Projekt hinzufügen
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Beschreibung</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="border p-2">{project.name}</td>
              <td className="border p-2">{project.description}</td>
              <td className="border p-2">{project.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteProject(project.id)}
                  className="bg-red-500 text-white p-1"
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

