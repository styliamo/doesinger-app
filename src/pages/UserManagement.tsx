import { useState } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  projects: string[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Max Mustermann", role: "Vendor", projects: ["Projekt A", "Projekt B"] },
  ]);

  const [newUser, setNewUser] = useState({ name: "", role: "", projects: "" });

  const addUser = () => {
    if (!newUser.name || !newUser.role) return;
    setUsers([
      ...users,
      {
        id: Date.now(),
        name: newUser.name,
        role: newUser.role,
        projects: newUser.projects.split(",").map((p) => p.trim()),
      },
    ]);
    setNewUser({ name: "", role: "", projects: "" });
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Benutzerverwaltung</h2>

      <div className="flex gap-2">
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
        <input
          placeholder="Projekte (Komma-getrennt)"
          value={newUser.projects}
          onChange={(e) => setNewUser({ ...newUser, projects: e.target.value })}
          className="border px-2 py-1"
        />
        <button onClick={addUser} className="bg-blue-500 text-white px-4 py-1 rounded">
          ➕ Benutzer hinzufügen
        </button>
      </div>

      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border p-2 rounded">
            <strong>{user.name}</strong> – {user.role} <br />
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

