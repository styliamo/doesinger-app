import React, { useState } from "react";

type Task = {
  id: number;
  title: string;
  deadline: string;
  status: "Offen" | "In Arbeit" | "Erledigt";
};

const initialTasks: Task[] = [
  { id: 1, title: "Grundriss zeichnen", deadline: "2025-06-30", status: "Offen" },
  { id: 2, title: "Materialauswahl treffen", deadline: "2025-07-07", status: "In Arbeit" },
  { id: 3, title: "Angebote einholen", deadline: "2025-07-15", status: "Erledigt" },
];

export default function ProjectPlan() {
  const [tasks, setTasks] = useState(initialTasks);

  const updateStatus = (id: number, newStatus: Task["status"]) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🗂️ Projektplan Übersicht</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Aufgabe</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Deadline</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td style={{ padding: "0.5rem" }}>{task.title}</td>
              <td style={{ padding: "0.5rem" }}>{task.deadline}</td>
              <td style={{ padding: "0.5rem" }}>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value as Task["status"])}
                >
                  <option value="Offen">Offen</option>
                  <option value="In Arbeit">In Arbeit</option>
                  <option value="Erledigt">Erledigt</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

