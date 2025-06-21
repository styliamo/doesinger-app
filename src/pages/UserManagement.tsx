import { useState, useEffect } from "react";

interface Profile {
  name: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("profile");
    setProfile(stored ? JSON.parse(stored) : null);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">👥 User-Verwaltung</h2>

      {!profile && <p>Kein Profil gefunden. Bitte Profil zuerst einrichten.</p>}

      {profile && (
        <>
          <h3>Aktueller User:</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Rolle:</strong> {profile.role}</p>
        </>
      )}

      <hr className="my-4" />
      <p>— Admin-Funktionen folgen (z. B. Zuweisung von Projekten)</p>
    </div>
  );
}

