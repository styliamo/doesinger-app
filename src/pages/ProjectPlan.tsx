import { useState } from "react";

interface Task {
  id: number;
  title: string;
  deadline: string;
  status: string;
}

export default function ProjectPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Website starten", deadline: "2025-07-01", status: "Offen" },
    { id: 2, title: "UX testen", deadline: "2025-07-15", status: "In Arbeit" },
  ]);

  const addTask = () => {
    setTasks([
      ...tasks,
      { id: Date.now(), title: "Neue Aufgabe", deadline: "2025-07-20", status: "Offen" },
    ]);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: number, key: keyof Task, value: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, [key]: value } : task)));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📋 Projektplan</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Task</th>
            <th className="p-2">Deadline</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t">
              <td className="p-2">
                <input
                  className="w-full border p-1"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, "title", e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  className="w-full border p-1"
                  type="date"
                  value={task.deadline}
                  onChange={(e) => updateTask(task.id, "deadline", e.target.value)}
                />
              </td>
              <td className="p-2">
                <select
                  className="w-full border p-1"
                  value={task.status}
                  onChange={(e) => updateTask(task.id, "status", e.target.value)}
                >
                  <option>Offen</option>
                  <option>In Arbeit</option>
                  <option>Erledigt</option>
                </select>
              </td>
              <td className="p-2">
                <button className="text-red-500" onClick={() => deleteTask(task.id)}>
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={addTask}>
        + Neue Aufgabe
      </button>
    </div>
  );
}

