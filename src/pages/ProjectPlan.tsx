import { useState } from "react";

export default function ProjectPlan() {
  const [tasks, setTasks] = useState([
    { task: "Design finalisieren", deadline: "2025-07-01", status: "offen" },
    { task: "Kundenfreigabe", deadline: "2025-07-03", status: "in Bearbeitung" },
    { task: "Montage starten", deadline: "2025-07-10", status: "offen" },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const newTasks = [...tasks];
    (newTasks[index] as any)[field] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      { task: "Neue Aufgabe", deadline: "2025-07-15", status: "offen" },
    ]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🗂️ Projektplan Übersicht</h2>
      <table className="min-w-full border mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Aufgabe</th>
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
                  <option>offen</option>
                  <option>in Bearbeitung</option>
                  <option>erledigt</option>
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

