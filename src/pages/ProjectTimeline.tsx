import { useState } from "react";

interface Task {
  id: number;
  name: string;
  start: string;
  end: string;
  assignee: string;
  status: "offen" | "in Arbeit" | "erledigt";
}

export default function ProjectTimeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    name: "",
    start: "",
    end: "",
    assignee: "",
    status: "offen",
  });

  const addTask = () => {
    const id = Date.now();
    setTasks([...tasks, { id, ...newTask }]);
    setNewTask({ name: "", start: "", end: "", assignee: "", status: "offen" });
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🕒 Projekt-Timeline</h2>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input placeholder="Aufgabe" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
        <input type="date" value={newTask.start} onChange={e => setNewTask({ ...newTask, start: e.target.value })} />
        <input type="date" value={newTask.end} onChange={e => setNewTask({ ...newTask, end: e.target.value })} />
        <input placeholder="Zuständig" value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
        <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value as Task["status"] })}>
          <option value="offen">Offen</option>
          <option value="in Arbeit">In Arbeit</option>
          <option value="erledigt">Erledigt</option>
        </select>
        <button onClick={addTask}>+ Aufgabe</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Aufgabe</th>
            <th>Start</th>
            <th>Ende</th>
            <th>Zuständig</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.start}</td>
              <td>{task.end}</td>
              <td>{task.assignee}</td>
              <td>{task.status}</td>
              <td><button onClick={() => deleteTask(task.id)}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

