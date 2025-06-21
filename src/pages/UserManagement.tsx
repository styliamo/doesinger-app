import { useState } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  projects: string[];
}

const availableProjects = ["Projekt A", "Projekt B", "Projekt C", "Projekt D"];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Max Mustermann", role: "Vendor", projects: ["Projekt A", "Projekt B"] },
  ]);

  const [newUser, setNewUser] = useState({ name: "", role: "", projects: [] as string[] });

  const toggleProject = (project: string) => {
    setNewUser((prev) => ({
      ...prev,
      projects: prev.projects.includes(project)
        ? prev.projects.filter((p) => p !== project)
        : [...prev.projects, project],
    }));
  };

  const addUser = () => {
    if (!newUser.name || !newUser.role) return;
    setUsers([
      ...users,
      {
        id: Date.now(),
        name: newUser.name,
        role: newUser.role,
        projects: newUser.projects,
      },
    ]);
    setNewUser({ name: "", role: "", projects: [] });
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Benutzerverwaltung</h2>

      <div className="flex flex-col gap-2">
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border px-2 py-1"
        />
        <input
          placeholder="Rolle"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border px-2 py-1"
        />

        <div>
          <p className="text-sm font-medium mb-1">Projekte zuweisen:</p>
          <div className="flex flex-wrap gap-2">
            {availableProjects.map((project) => (
              <label key={project} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={newUser.projects.includes(project)}
                  onChange={() => toggleProject(project)}
                />
                {project}
              </label>
            ))}
          </div>
        </div>

        <button onClick={addUser} className="bg-blue-600 text-white px-4 py-1 rounded mt-2">
          ➕ Benutzer hinzufügen
        </button>
      </div>

      <ul className="space-y-2 pt-4">
        {users.map((user) => (
          <li key={user.id} className="border p-3 rounded">
            <strong>{user.name}</strong> – {user.role}
            <br />
            Projekte: {user.projects.join(", ")}
            <br />
            <button
              onClick={() => deleteUser(user.id)}
              className="text-red-600 hover:underline text-sm mt-1"
            >
              🗑️ Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

