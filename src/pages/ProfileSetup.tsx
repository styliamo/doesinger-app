kimport { useState } from "react";

interface Profile {
  name: string;
  email: string;
  role: "admin" | "vendor" | "user";
}

export default function ProfileSetup() {
  const stored = localStorage.getItem("profile");
  const initial: Profile = stored ? JSON.parse(stored) : { name: "", email: "", role: "user" };

  const [profile, setProfile] = useState<Profile>(initial);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    setSaved(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Profil einrichten</h2>
      <label className="block mb-2">Name:
        <input
          className="border p-1 w-full"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </label>
      <label className="block mb-2">Email:
        <input
          type="email"
          className="border p-1 w-full"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
      </label>
      <label className="block mb-4">Rolle:
        <select
          className="border p-1 w-full"
          value={profile.role}
          onChange={(e) => setProfile({ ...profile, role: e.target.value as Profile["role"] })}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Profil speichern
      </button>
      {saved && <p className="mt-2 text-green-700">✅ Profil gespeichert!</p>}
    </div>
  );
}

