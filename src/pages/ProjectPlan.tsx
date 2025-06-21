import { useState } from "react";

export default function ProjectPlan() {
  const [tasks, setTasks] = useState([
    { task: "Website starten", deadline: "2025-07-01", status: "Offen" },
    { task: "UX testen", deadline: "2025-07-15", status: "In Arbeit" },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const newTasks = [...tasks];
    (newTasks[index] as any)[field] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { task: "Neue Aufgabe", deadline: "2025-07-20", status: "Offen" },
    ]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🗂️ Projektplan</h2>
      <table className="min-w-full border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Task</th>
            <th className="border px-4 py-2">Deadline</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">
                <input
                  value={t.task}
                  onChange={(e) => handleChange(i, "task", e.target.value)}
                  className="w-full border px-2"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  value={t.deadline}
                  onChange={(e) => handleChange(i, "deadline", e.target.value)}
                  className="w-full border px-2"
                />
              </td>
              <td className="border px-4 py-2">
                <select
                  value={t.status}
                  onChange={(e) => handleChange(i, "status", e.target.value)}
                  className="w-full border px-2"
                >
                  <option>Offen</option>
                  <option>In Arbeit</option>
                  <option>Erledigt</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Neue Aufgabe
      </button>
    </div>
  );
}

