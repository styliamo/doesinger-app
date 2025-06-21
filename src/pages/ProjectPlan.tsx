import { useState } from "react";

type Task = {
  id: number;
  title: string;
  deadline: string;
};

export default function ProjectPlan() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const addTask = () => {
    if (title.trim() && deadline) {
      const newTask: Task = {
        id: Date.now(),
        title,
        deadline,
      };
      setTasks([...tasks, newTask]);
      setTitle("");
      setDeadline("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const deleteAll = () => {
    if (confirm("Bist du sicher, dass du das gesamte Projekt löschen willst?")) {
      setTasks([]);
    }
  };

  const saveProject = () => {
    alert("Projekt wurde gespeichert!");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🗂️ Projektplan</h2>
      <div className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Neue Aufgabe"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕ Neue Aufgabe
        </button>
        <button
          onClick={saveProject}
          className="bg-green-600 text-white px-4 py-2 rounded ml-2"
        >
          💾 Projekt speichern
        </button>
        <button
          onClick={deleteAll}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          🗑️ Projekt löschen
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border-b py-2 flex justify-between">
            <span>
              {task.title} – <em>{task.deadline}</em>
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-600"
            >
              🗑️ Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

