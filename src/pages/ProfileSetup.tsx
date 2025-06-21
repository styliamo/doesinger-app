import { useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  company: string;
}

export default function ProfileSetup() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    company: "",
  });

  const handleChange = (key: keyof ProfileData, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profil gespeichert!");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">👤 Profil vervollständigen</h2>
      <div className="mb-4">
        <label className="block">Name</label>
        <input
          className="border p-2 w-full"
          value={profile.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block">E-Mail</label>
        <input
          className="border p-2 w-full"
          value={profile.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block">Firma</label>
        <input
          className="border p-2 w-full"
          value={profile.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={saveProfile}>
        Speichern
      </button>
    </div>
  );
}

