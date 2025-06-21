import { useState } from "react";

interface Profile {
  name: string;
  company: string;
  role: string;
}

export default function ProfileSetup() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    company: "",
    role: "",
  });

  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profil gespeichert!");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🧑 Profil einrichten</h2>
      <div className="mb-4">
        <label className="block font-medium">Name:</label>
        <input
          className="border p-2 w-full"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Firma:</label>
        <input
          className="border p-2 w-full"
          value={profile.company}
          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Rolle:</label>
        <input
          className="border p-2 w-full"
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveProfile}>
        💾 Speichern
      </button>
    </div>
  );
}

