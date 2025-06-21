import { useState } from "react";

type Task = {
  id: number;
  title: string;
  deadline: string;
  status: "offen" | "in Bearbeitung" | "erledigt";
};

export default function ProjectPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Design finalisieren", deadline: "2025-07-01", status: "offen" },
    { id: 2, title: "Kundenfreigabe", deadline: "2025-07-03", status: "in Bearbeitung" },
    { id: 3, title: "Montage starten", deadline: "2025-07-10", status: "erledigt" },
  ]);

  const updateStatus = (id: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  return (
    <div>
      <h2>🗂️ Projektplan Übersicht</h2>
      <table>
        <thead>
          <tr>
            <th>Aufgabe</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.deadline}</td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value as Task["status"])}
                >
                  <option value="offen">offen</option>
                  <option value="in Bearbeitung">in Bearbeitung</option>
                  <option value="erledigt">erledigt</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

