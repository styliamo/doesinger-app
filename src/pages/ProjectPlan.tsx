import { useState } from "react";

type Task = {
  id: number;
  title: string;
  deadline: string;
  status: "offen" | "in Arbeit" | "erledigt";
};

export default function ProjectPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Moodboard erstellen", deadline: "2025-06-25", status: "offen" },
    { id: 2, title: "Erstes Kundenbriefing", deadline: "2025-06-27", status: "in Arbeit" },
  ]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📂 Projektplan Übersicht</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Task</th>
            <th className="border px-2 py-1 text-left">Deadline</th>
            <th className="border px-2 py-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td className="border px-2 py-1">{task.title}</td>
              <td className="border px-2 py-1">{task.deadline}</td>
              <td className="border px-2 py-1">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

