import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectItem } from '@/types';
import { AlertTriangle, FileText, TrendingUp, Package } from 'lucide-react';
import { InvoiceModule } from './InvoiceModule';
import { PaymentReminder } from './PaymentReminder';
import { useAuth } from '@/contexts/AuthContext';
import { useProject } from '@/contexts/ProjectContext';

interface AdminDashboardProps {
  items: ProjectItem[];
  onNavigateToPositions: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  items,
  onNavigateToPositions
}) => {
  const { user } = useAuth();
  const { selectedProject } = useProject();
  
  const approvedItems = items.filter(item => item.approvedForClient);
  const ffeItems = items.filter(item => item.category === 'FF&E');
  const draftItems = items.filter(item => item.status === 'DRAFT' || item.status === 'SUBMITTED');
  
  const totalProjectSum = approvedItems.reduce((sum, item) => sum + item.totalSellingPrice, 0);
  const totalFFESum = ffeItems.reduce((sum, item) => sum + item.totalSellingPrice, 0);
  
  const vendorSubmissions = items.reduce((acc, item) => {
    if (item.vendorId && item.status === 'SUBMITTED') {
      acc[item.vendorId] = (acc[item.vendorId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Payment Reminders */}
      <PaymentReminder user={user} />
      
      {/* Invoice Module */}
      <InvoiceModule project={selectedProject} user={user} />
      
      {/* Existing Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projekt-Gesamtsumme</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalProjectSum.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Freigegebene VK-Positionen</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FF&E-Gesamtsumme</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalFFESum.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
            {totalFFESum > 20000 && (
              <div className="flex items-center text-red-600 text-xs mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Budgetüberschreitung
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eingereichte Angebote</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.values(vendorSubmissions).reduce((a, b) => a + b, 0)}</div>
            <p className="text-xs text-muted-foreground">{Object.keys(vendorSubmissions).length} Vendors</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Positionen</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftItems.length}</div>
            <p className="text-xs text-muted-foreground">Entwurf/Eingereicht</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onNavigateToPositions} size="lg">
          Zu Positionen springen
        </Button>
      </div>
    </div>
  );
};