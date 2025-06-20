import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectItem, UserRole } from '@/types';

interface ProjectTotalSummaryProps {
  items: ProjectItem[];
  userRole: UserRole;
  position?: 'top' | 'bottom';
}

export const ProjectTotalSummary: React.FC<ProjectTotalSummaryProps> = ({ 
  items, 
  userRole, 
  position = 'top' 
}) => {
  const approvedItems = items.filter(item => item.approvedForClient);
  const totalSum = approvedItems.reduce((sum, item) => sum + item.totalSellingPrice, 0);

  if (userRole === 'VENDOR') return null;

  return (
    <Card className={`${position === 'top' ? 'mb-6' : 'mt-6'} bg-green-50 border-green-200`}>
      <CardContent className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Gesamtkosten des Projekts (inkl. aller freigegebenen Positionen)
          </h3>
          <div className="text-2xl font-bold text-green-900">
            €{totalSum.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};