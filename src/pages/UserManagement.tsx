import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  assignedProjects: string[];
}

const defaultUsers: User[] = [
  { id: 1, name: "Max Vendor", role: "Vendor", assignedProjects: ["Neues Projekt"] },
  { id: 2, name: "Lisa Client", role: "Client", assignedProjects: [] },
];

const availableProjects = ["Neues Projekt", "UX Redesign", "Marketing 2025"];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(defaultUsers);

  const toggleProject = (userId: number, project: string) => {
    setUsers(users.map(user => {
      if (user.id !== userId) return user;
      const isAssigned = user.assignedProjects.includes(project);
      return {
        ...user,
        assignedProjects: isAssigned
          ? user.assignedProjects.filter(p => p !== project)
          : [...user.assignedProjects, project],
      };
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">👤 Benutzerverwaltung</h1>
      {users.map(user => (
        <div key={user.id} className="border rounded p-4 mb-4">
          <h2 className="font-semibold text-lg">{user.name} ({user.role})</h2>
          <p className="text-sm mb-2">Zugewiesene Projekte:</p>
          <div className="flex gap-2 flex-wrap">
            {availableProjects.map(project => (
              <button
                key={project}
                className={`px-2 py-1 border rounded ${
                  user.assignedProjects.includes(project)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => toggleProject(user.id, project)}
              >
                {project}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

