import React, { useState } from "react";

interface Task {
  id: number;
  title: string;
  deadline: string;
  status: string;
}

interface Project {
  name: string;
  tasks: Task[];
}

const defaultProject: Project = {
  name: "Neues Projekt",
  tasks: [
    { id: 1, title: "Website starten", deadline: "2025-07-01", status: "Offen" },
    { id: 2, title: "UX testen", deadline: "2025-07-15", status: "In Arbeit" },
  ],
};

export default function ProjectPlanPage() {
  const [project, setProject] = useState<Project>(defaultProject);

  const updateTask = (id: number, field: keyof Task, value: string) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === id ? { ...task, [field]: value } : task
    );
    setProject({ ...project, tasks: updatedTasks });
  };

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: "Neue Aufgabe",
      deadline: new Date().toISOString().split("T")[0],
      status: "Offen",
    };
    setProject({ ...project, tasks: [...project.tasks, newTask] });
  };

  const deleteTask = (id: number) => {
    const filtered = project.tasks.filter((task) => task.id !== id);
    setProject({ ...project, tasks: filtered });
  };

  const saveProject = () => {
    alert(`Projekt "${project.name}" wurde gespeichert!`);
    console.log("Gespeichertes Projekt:", project);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📂 Projektplan</h1>

      <input
        type="text"
        className="mb-4 p-2 border rounded w-full font-semibold text-lg"
        placeholder="Projektname"
        value={project.name}
        onChange={(e) => setProject({ ...project, name: e.target.value })}
      />

      <table className="w-full table-auto mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Task</th>
            <th className="px-4 py-2">Deadline</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {project.tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-4 py-2">
                <input
                  className="w-full p-1"
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, "title", e.target.value)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  className="w-full p-1"
                  type="date"
                  value={task.deadline}
                  onChange={(e) => updateTask(task.id, "deadline", e.target.value)}
                />
              </td>
              <td className="border px-4 py-2">
                <select
                  className="w-full p-1"
                  value={task.status}
                  onChange={(e) => updateTask(task.id, "status", e.target.value)}
                >
                  <option>Offen</option>
                  <option>In Arbeit</option>
                  <option>Erledigt</option>
                </select>
              </td>
              <td className="border px-4 py-2 text-center">
                <button onClick={() => deleteTask(task.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={addTask}
        >
          + Neue Aufgabe
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={saveProject}
        >
          💾 Projekt speichern
        </button>
      </div>
    </div>
  );
}


