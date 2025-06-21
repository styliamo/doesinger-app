import { useState } from "react";

interface Task {
  id: number;
  position: string; // z. B. "610.1" oder "610.1.99"
  description: string;
  menge: number;
  ek: number;
  marge: number; // in Prozent, z. B. 20
}

export default function ProjectPlan() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, position: "300", description: "Montagearbeiten", menge: 10, ek: 100, marge: 20 },
    { id: 2, position: "300.99", description: "Feinmontage", menge: 5, ek: 150, marge: 15 },
  ]);

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        position: "",
        description: "",
        menge: 1,
        ek: 0,
        marge: 0,
      },
    ]);
  };

  const updateTask = (id: number, key: keyof Task, value: string | number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, [key]: value } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // nach Kostengruppe gruppieren
  const gruppen = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    const gruppe = t.position.split(".")[0] || "Unbekannt";
    (acc[gruppe] = acc[gruppe] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📋 Projektplan mit Preisen</h2>
      {Object.entries(gruppen).map(([kg, zeilen]) => {
        const sumEk = zeilen.reduce((s, t) => s + t.ek * t.menge, 0);
        const sumVk = zeilen.reduce((s, t) => {
          const vkEinzel = t.ek * (1 + t.marge / 100);
          return s + vkEinzel * t.menge;
        }, 0);
        return (
          <div key={kg} className="mb-8">
            <h3 className="font-semibold mb-2">Kostengruppe {kg}</h3>
            <table className="w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Pos.</th>
                  <th className="p-2">Beschreibung</th>
                  <th className="p-2">Menge</th>
                  <th className="p-2">EK Einzel</th>
                  <th className="p-2">EK Gesamt</th>
                  <th className="p-2">Marge (%)</th>
                  <th className="p-2">VK Einzel</th>
                  <th className="p-2">VK Gesamt</th>
                  <th className="p-2">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {zeilen.map((t) => {
                  const ekGesamt = t.ek * t.menge;
                  const vkEinzel = t.ek * (1 + t.marge / 100);
                  const vkGesamt = vkEinzel * t.menge;
                  return (
                    <tr key={t.id} className="border-t">
                      <td className="p-2">
                        <input
                          className="w-20 border p-1"
                          value={t.position}
                          onChange={(e) => updateTask(t.id, "position", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="border p-1 w-full"
                          value={t.description}
                          onChange={(e) => updateTask(t.id, "description", e.target.value)}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border p-1 w-20"
                          value={t.menge}
                          onChange={(e) => updateTask(t.id, "menge", Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border p-1 w-20"
                          value={t.ek}
                          onChange={(e) => updateTask(t.id, "ek", Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2">{ekGesamt.toFixed(2)}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="border p-1 w-16"
                          value={t.marge}
                          onChange={(e) => updateTask(t.id, "marge", Number(e.target.value))}
                        />
                      </td>
                      <td className="p-2">{vkEinzel.toFixed(2)}</td>
                      <td className="p-2">{vkGesamt.toFixed(2)}</td>
                      <td className="p-2">
                        <button className="text-red-500" onClick={() => deleteTask(t.id)}>
                          🗑
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="p-2 text-right font-bold">Zwischensumme:</td>
                  <td className="p-2 font-bold">{sumEk.toFixed(2)}</td>
                  <td></td>
                  <td></td>
                  <td className="p-2 font-bold">{sumVk.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={addTask}>
        + Neue Aufgabe / Zeile hinzufügen
      </button>
    </div>
  );
}

