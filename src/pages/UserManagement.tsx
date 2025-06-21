import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  projectIds: number[]; // Liste zugewiesener Projekt-IDs
}

interface Project {
  id: number;
  name: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newUser, setNewUser] = useState({ name: "", role: "", projectIds: [] as number[] });

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const savedProjects = localStorage.getItem("projects");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleAddUser = () => {
    const id = Date.now();
    const updatedUsers = [...users, { ...newUser, id }];
    saveUsers(updatedUsers);
    setNewUser({ name: "", role: "", projectIds: [] });
  };

  const handleDeleteUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    saveUsers(updatedUsers);
  };

  const handleProjectToggle = (projectId: number) => {
    setNewUser((prev) => {
      const exists = prev.projectIds.includes(projectId);
      const updatedProjects = exists
        ? prev.projectIds.filter((id) => id !== projectId)
        : [...prev.projectIds, projectId];
      return { ...prev, projectIds: updatedProjects };
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">User-Verwaltung</h2>

      <div className="mb-4 space-y-2">
        <input
          placeholder="Name"
          className="border p-2 mr-2"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          placeholder="Rolle"
          className="border p-2 mr-2"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <label key={project.id} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={newUser.projectIds.includes(project.id)}
                onChange={() => handleProjectToggle(project.id)}
              />
              <span>{project.name}</span>
            </label>
          ))}
        </div>
        <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 mt-2">
          ➕ Hinzufügen
        </button>
      </div>

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2">
            <strong>{user.name}</strong> ({user.role}) – Projekte:{" "}
            {projects
              .filter((p) => user.projectIds.includes(p.id))
              .map((p) => p.name)
              .join(", ")}
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="ml-4 bg-red-500 text-white px-2 py-1"
            >
              ❌ Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;

