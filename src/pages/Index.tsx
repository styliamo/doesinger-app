import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { HOAIProjectView } from '@/components/HOAIProjectView';
import { TimetableModule } from '@/components/TimetableModule';
import { UserRoleSelector } from '@/components/UserRoleSelector';
import { LoginForm } from '@/components/LoginForm';
import { UserManagement } from '@/components/UserManagement';
import { ActivityLog } from '@/components/ActivityLog';
import { useAppContext } from '@/contexts/AppContext';
import { ThemeProvider } from '@/components/theme-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Users, Activity, Calculator, Calendar, CreditCard } from 'lucide-react';

const IndexContent: React.FC = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const { currentRole } = useAppContext();
  
  const urlParams = new URLSearchParams(window.location.search);
  const embedMode = urlParams.get('embed');
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Laden...</div>;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm onLogin={() => window.location.reload()} />
      </div>
    );
  }
  
  if (embedMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {embedMode === 'calculation' && <HOAIProjectView userRole={userRole || currentRole} />}
          {embedMode === 'timetable' && <TimetableModule userRole={userRole || currentRole} />}
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">HOAI Projektplattform</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email} ({userRole})</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="calculation" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="calculation" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />Kalkulation
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />Zeitplan
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />Rechnungen
            </TabsTrigger>
            {userRole === 'admin' && (
              <>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />Benutzer
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />Logs
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="calculation" className="mt-6">
            <HOAIProjectView userRole={userRole || currentRole} />
          </TabsContent>
          
          <TabsContent value="timetable" className="mt-6">
            <TimetableModule userRole={userRole || currentRole} />
          </TabsContent>
          
          <TabsContent value="payment" className="mt-6">
            <div className="text-center py-8">Rechnungsmodul wird geladen...</div>
          </TabsContent>
          
          {userRole === 'admin' && (
            <>
              <TabsContent value="users" className="mt-6">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="logs" className="mt-6">
                <ActivityLog />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="hoai-theme">
      <AppProvider>
        <IndexContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default Index;