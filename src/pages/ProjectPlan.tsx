import { useState, ChangeEvent } from "react";

interface Position {
  id: number;
  hoaiKg: string;
  bezeichnung: string;
  einheit: string;
  menge: number;
  einkaufPreis: number;
  marge: number;     // Prozent, z. B. 20
}

interface BlockSumme {
  hoaiKg: string;
  sumEinkauf: number;
  sumVerkauf: number;
}

export default function ProjectPlan() {
  const [positionen, setPositionen] = useState<Position[]>([]);
  const hoaiGruppen = ["KG 300", "KG 400", "KG 500"];

  const addPos = (kg: string) => {
    setPositionen([
      ...positionen,
      {
        id: Date.now(),
        hoaiKg: kg,
        bezeichnung: "",
        einheit: "",
        menge: 1,
        einkaufPreis: 0,
        marge: 0,
      },
    ]);
  };

  const updatePos = (id: number, key: keyof Position, value: string | number) => {
    setPositionen(
      positionen.map((p) =>
        p.id === id ? { ...p, [key]: value } : p
      )
    );
  };

  const deletePos = (id: number) =>
    setPositionen(positionen.filter((p) => p.id !== id));

  const berechneSummen = (): BlockSumme[] => {
    return hoaiGruppen.map((kg) => {
      const block = positionen.filter((p) => p.hoaiKg === kg);
      const sumE = block.reduce((acc, p) => acc + p.einkaufPreis * p.menge, 0);
      const sumV = block.reduce(
        (acc, p) => acc + p.menge * p.einkaufPreis * (1 + p.marge / 100),
        0
      );
      return { hoaiKg: kg, sumEinkauf: sumE, sumVerkauf: sumV };
    });
  };

  const sums = berechneSummen();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📋 Projektplan mit Preisen</h2>
      {hoaiGruppen.map((kg) => (
        <div key={kg} className="mb-6 border p-3">
          <h3 className="font-semibold">{kg}</h3>
          <button
            className="bg-green-500 text-white px-2 py-1 mb-2"
            onClick={() => addPos(kg)}
          >
            + Position hinzufügen
          </button>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th>Kurz-Bezeichnung</th>
                <th>Menge</th>
                <th>Einheit</th>
                <th>EK-Preis</th>
                <th>Marge (%)</th>
                <th>VK gesamt</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {positionen
                .filter((p) => p.hoaiKg === kg)
                .map((p) => (
                  <tr key={p.id} className="border-t">
                    <td>
                      <input
                        value={p.bezeichnung}
                        onChange={(e) =>
                          updatePos(p.id, "bezeichnung", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={p.menge}
                        onChange={(e) =>
                          updatePos(p.id, "menge", +e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={p.einheit}
                        onChange={(e) =>
                          updatePos(p.id, "einheit", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={p.einkaufPreis}
                        onChange={(e) =>
                          updatePos(p.id, "einkaufPreis", +e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={p.marge}
                        onChange={(e) =>
                          updatePos(p.id, "marge", +e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {(
                        p.menge *
                        p.einkaufPreis *
                        (1 + p.marge / 100)
                      ).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="text-red-500"
                        onClick={() => deletePos(p.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="mt-2">
            <strong>Zwischensumme EK:</strong>{" "}
            {sums.find((s) => s.hoaiKg === kg)?.sumEinkauf.toFixed(2)} €
            <br />
            <strong>Zwischensumme VK:</strong>{" "}
            {sums.find((s) => s.hoaiKg === kg)?.sumVerkauf.toFixed(2)} €
          </div>
        </div>
      ))}

      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold">📊 Gesamtsummen</h3>
        <div>
          EK gesamt:{" "}
          {sums
            .reduce((a, s) => a + s.sumEinkauf, 0)
            .toFixed(2)}{" "}
          €
        </div>
        <div>
          VK gesamt:{" "}
          {sums
            .reduce((a, s) => a + s.sumVerkauf, 0)
            .toFixed(2)}{" "}
          €
        </div>
      </div>
    </div>
  );
}

