import { useState } from "react";

export default function ProjectPlan() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Website starten", deadline: "2025-07-01", status: "Offen" },
    { id: 2, name: "UX testen", deadline: "2025-07-15", status: "In Arbeit" },
  ]);

  const handleChange = (id: number, field: string, value: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleAddTask = () => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    setTasks([...tasks, {
      id: newId,
      name: "Neue Aufgabe",
      deadline: "2025-07-20",
      status: "Offen"
    }]);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Projektplan</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Task</th>
            <th className="p-2">Deadline</th>
            <th className="p-2">Status</th>
            <th className="p-2">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-t">
              <td className="p-2">
                <input
                  className="w-full border p-1"
                  value={task.name}
                  onChange={e => handleChange(task.id, "name", e.target.value)}
                />
              </td>
              <td className="p-2">
                <input
                  type="date"
                  className="w-full border p-1"
                  value={task.deadline}
                  onChange={e => handleChange(task.id, "deadline", e.target.value)}
                />
              </td>
              <td className="p-2">
                <select
                  className="w-full border p-1"
                  value={task.status}
                  onChange={e => handleChange(task.id, "status", e.target.value)}
                >
                  <option value="Offen">Offen</option>
                  <option value="In Arbeit">In Arbeit</option>
                  <option value="Erledigt">Erledigt</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  🗑️ Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddTask}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Neue Aufgabe
      </button>
    </div>
  );
}

