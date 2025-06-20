import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CentralAdminDashboard from '@/components/CentralAdminDashboard';
import { LoginForm } from '@/components/LoginForm';
import { AlertTriangle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Admin-Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin-Bereich</h1>
            <p className="text-gray-600">Bitte melden Sie sich an, um fortzufahren.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zugriff verweigert</h1>
          <p className="text-gray-600 mb-4">
            Sie haben keine Berechtigung für den Admin-Bereich.
          </p>
          <p className="text-sm text-gray-500">
            Eingeloggt als: {user.role} ({user.email})
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zurück zur Hauptseite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CentralAdminDashboard />
    </div>
  );
};

export default AdminPage;