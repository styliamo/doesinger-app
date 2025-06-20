import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectItem, UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProjectSummaryProps {
  items: ProjectItem[];
  userRole: UserRole;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ items, userRole }) => {
  const filteredItems = userRole === 'CLIENT' 
    ? items.filter(item => item.approvedForClient)
    : items;

  const summaryByCostGroup = filteredItems.reduce((acc, item) => {
    const group = item.costGroup.split('.')[0]; // Get main group (e.g., "610" from "610.5")
    if (!acc[group]) {
      acc[group] = {
        totalPurchase: 0,
        totalSelling: 0,
        count: 0
      };
    }
    acc[group].totalPurchase += item.totalPurchasePrice;
    acc[group].totalSelling += item.totalSellingPrice;
    acc[group].count += 1;
    return acc;
  }, {} as Record<string, { totalPurchase: number; totalSelling: number; count: number }>);

  const totalPurchase = filteredItems.reduce((sum, item) => sum + item.totalPurchasePrice, 0);
  const totalSelling = filteredItems.reduce((sum, item) => sum + item.totalSellingPrice, 0);
  const totalMargin = totalSelling - totalPurchase;
  const marginPercent = totalPurchase > 0 ? (totalMargin / totalPurchase) * 100 : 0;

  const getCostGroupName = (code: string) => {
    const names: Record<string, string> = {
      '610': 'Ausstattung',
      '611': 'Allgemeine Einrichtung', 
      '612': 'Besondere Einrichtung',
      '620': 'Sonstige Maßnahmen'
    };
    return names[code] || `Kostengruppe ${code}`;
  };

  return (
    <div className="space-y-4">
      {/* Cost Group Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(summaryByCostGroup).map(([group, summary]) => (
          <Card key={group}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {getCostGroupName(group)}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                {summary.count} Positionen
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {(userRole === 'ADMIN' || userRole === 'PARTNER') && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Summe EK:</span>
                    <span className="font-medium">€{summary.totalPurchase.toFixed(2)}</span>
                  </div>
                )}
                {(userRole === 'ADMIN' || userRole === 'CLIENT') && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Summe VK:</span>
                    <span className="font-medium text-green-600">€{summary.totalSelling.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Gesamtsumme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(userRole === 'ADMIN' || userRole === 'PARTNER') && (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  €{totalPurchase.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Gesamt EK</div>
              </div>
            )}
            
            {(userRole === 'ADMIN' || userRole === 'CLIENT') && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  €{totalSelling.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {userRole === 'CLIENT' ? 'Gesamtpreis' : 'Gesamt VK'}
                </div>
              </div>
            )}
            
            {userRole === 'ADMIN' && (
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  €{totalMargin.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  Marge ({marginPercent.toFixed(1)}%)
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};