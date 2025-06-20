import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProjectItem, UserRole } from '@/types';
import { AlertTriangle, Package } from 'lucide-react';

interface FFESummaryViewProps {
  costItems: ProjectItem[];
  userRole: UserRole;
}

const FFESummaryView: React.FC<FFESummaryViewProps> = ({ costItems, userRole }) => {
  // Filter FF&E items
  const ffeItems = costItems.filter(item => item.category === 'FF&E');
  
  // Calculate total selling price for FF&E items
  const totalFFESellingPrice = ffeItems.reduce((sum, item) => {
    if (userRole === 'CLIENT' && !item.approvedForClient) {
      return sum;
    }
    return sum + item.totalSellingPrice;
  }, 0);

  // Budget limit
  const BUDGET_LIMIT = 20000;
  const isOverBudget = totalFFESellingPrice > BUDGET_LIMIT;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            FF&E Zusammenfassung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ffeItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Keine FF&E-Positionen vorhanden
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Kostengruppe</th>
                        <th className="text-left p-2">Beschreibung</th>
                        <th className="text-right p-2">Menge</th>
                        <th className="text-right p-2">Einheit</th>
                        {userRole !== 'CLIENT' && (
                          <th className="text-right p-2">EK</th>
                        )}
                        <th className="text-right p-2">Summe VK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ffeItems.map(item => {
                        if (userRole === 'CLIENT' && !item.approvedForClient) {
                          return null;
                        }
                        return (
                          <tr key={item.id} className="border-b bg-orange-50 hover:bg-orange-100">
                            <td className="p-2 font-mono text-sm">{item.costGroup}</td>
                            <td className="p-2">{item.description}</td>
                            <td className="p-2 text-right">{item.quantity}</td>
                            <td className="p-2 text-right">{item.unit}</td>
                            {userRole !== 'CLIENT' && (
                              <td className="p-2 text-right">
                                {formatCurrency(item.purchasePrice)}
                              </td>
                            )}
                            <td className="p-2 text-right font-semibold">
                              {formatCurrency(item.totalSellingPrice)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      Aktuelle FF&E-Gesamtsumme:
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatCurrency(totalFFESellingPrice)}
                    </span>
                  </div>
                  
                  {isOverBudget && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>⚠️ Budgetüberschreitung:</strong> FF&E-Kosten liegen über dem Limit von {formatCurrency(BUDGET_LIMIT)}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { FFESummaryView };
export default FFESummaryView;