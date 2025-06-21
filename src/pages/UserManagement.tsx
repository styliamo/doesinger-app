kimport { useState } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  project: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Vendor");
  const [project, setProject] = useState("");

  const addUser = () => {
    if (!name.trim() || !project.trim()) return;
    const newUser: User = {
      id: Date.now(),
      name,
      role,
      project,
    };
    setUsers([...users, newUser]);
    setName("");
    setRole("Vendor");
    setProject("");
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Benutzerverwaltung</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Projekt"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <select
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Vendor</option>
          <option>Team Lead</option>
          <option>Admin</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={addUser}
        >
          ➕ Hinzufügen
        </button>
      </div>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center border p-2"
          >
            <div>
              <strong>{user.name}</strong> ({user.role}) – Projekt:{" "}
              {user.project}
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1"
              onClick={() => deleteUser(user.id)}
            >
              ❌ Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

