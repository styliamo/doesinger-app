import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut, Settings } from 'lucide-react';
import { UserRole } from '@/types';
import { UserRoleSelector } from './UserRoleSelector';
import { WelcomeMessage } from './WelcomeMessage';
import { ProjectTotalSummary } from './ProjectTotalSummary';
import { CostGroupSection } from './CostGroupSection';
import { FFESummaryView } from './FFESummaryView';
import { AdminDashboard } from './AdminDashboard';
import { ComparisonView } from './ComparisonView';
import { MollieInvoiceButton } from './MollieInvoiceButton';
import { useProjectData } from '@/hooks/useProjectData';
import { useAuth } from '@/contexts/AuthContext';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(user?.role || 'ADMIN');
  const [activeTab, setActiveTab] = useState('dashboard');
  const { items, updateItem, approveForClient, selectVendor } = useProjectData();

  const costGroups = [...new Set(items.map(item => item.costGroup))].sort();
  const approvedItems = items.filter(item => item.approvedForClient);
  const totalProjectSum = approvedItems.reduce((sum, item) => sum + item.totalSellingPrice, 0);
  const ffeItems = items.filter(item => item.category === 'FF&E');
  const totalFFESum = ffeItems.reduce((sum, item) => sum + item.totalSellingPrice, 0);
  const hasFFEBudgetExceeded = totalFFESum > 20000;

  const canSeeTab = (tab: string) => {
    switch (tab) {
      case 'dashboard':
      case 'comparison':
        return userRole === 'ADMIN';
      case 'ffe':
        return ['ADMIN', 'CLIENT'].includes(userRole);
      case 'positions':
        return true;
      default:
        return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openAdminDashboard = () => {
    window.open('/admin', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HOAI Projekt-Management</h1>
              <div className="text-sm text-gray-600">
                Gesamtkosten des Projekts (inkl. aller freigegebenen Positionen): 
                <span className="font-semibold ml-1">€{totalProjectSum.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Eingeloggt als: <span className="font-medium">{userRole}</span> ({user?.email})
              </div>
              {user?.role === 'ADMIN' && (
                <Button variant="outline" size="sm" onClick={openAdminDashboard}>
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard öffnen
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
              <UserRoleSelector currentRole={userRole} onRoleChange={setUserRole} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <MollieInvoiceButton
            projectId="project-1"
            projectName="Sample Project"
            items={approvedItems}
            clientEmail={user?.email}
            userRole={userRole}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            {canSeeTab('dashboard') && (
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            )}
            <TabsTrigger value="positions">Positionen</TabsTrigger>
            {canSeeTab('ffe') && (
              <TabsTrigger value="ffe">
                FF&E
                {hasFFEBudgetExceeded && (
                  <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />
                )}
              </TabsTrigger>
            )}
            {canSeeTab('comparison') && (
              <TabsTrigger value="comparison">Vergleich</TabsTrigger>
            )}
          </TabsList>

          {canSeeTab('dashboard') && (
            <TabsContent value="dashboard">
              <AdminDashboard 
                items={items} 
                onNavigateToPositions={() => setActiveTab('positions')}
              />
            </TabsContent>
          )}

          <TabsContent value="positions">
            <div className="space-y-6">
              {userRole === 'PARTNER' && <WelcomeMessage />}
              
              <ProjectTotalSummary 
                items={approvedItems} 
                userRole={userRole}
              />
              
              <div className="space-y-4">
                {costGroups.map(costGroup => {
                  const groupItems = items.filter(item => item.costGroup === costGroup);
                  return (
                    <CostGroupSection
                      key={costGroup}
                      costGroup={costGroup}
                      items={groupItems}
                      userRole={userRole}
                      onUpdateItem={updateItem}
                      onApproveForClient={approveForClient}
                    />
                  );
                })}
              </div>
              
              <ProjectTotalSummary 
                items={approvedItems} 
                userRole={userRole}
              />
            </div>
          </TabsContent>

          {canSeeTab('ffe') && (
            <TabsContent value="ffe">
              <FFESummaryView items={ffeItems} userRole={userRole} />
            </TabsContent>
          )}

          {canSeeTab('comparison') && (
            <TabsContent value="comparison">
              <ComparisonView items={items} onSelectVendor={selectVendor} />
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      <div className="text-center py-8 text-sm text-gray-500">
        <p>Embed-Code für Squarespace:</p>
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
          &lt;iframe src="{window.location.href}" width="100%" height="800px" frameborder="0"&gt;&lt;/iframe&gt;
        </code>
      </div>
    </div>
  );
};