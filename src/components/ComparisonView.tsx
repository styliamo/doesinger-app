import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ProjectItem } from '@/types';
import { FileText, Check } from 'lucide-react';

interface ComparisonViewProps {
  items: ProjectItem[];
  onSelectVendor: (itemId: string, vendorId: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  items,
  onSelectVendor
}) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({});

  const costGroups = [...new Set(items.map(item => item.costGroup))].sort();

  const getVendorSubmissions = (costGroup: string) => {
    const groupItems = items.filter(item => item.costGroup === costGroup);
    const vendors = [...new Set(groupItems.map(item => item.vendorId).filter(Boolean))];
    
    return vendors.map(vendorId => {
      const vendorItems = groupItems.filter(item => item.vendorId === vendorId);
      return {
        vendorId,
        items: vendorItems,
        totalPrice: vendorItems.reduce((sum, item) => sum + item.totalSellingPrice, 0)
      };
    });
  };

  const handleSelectVendor = (itemId: string, vendorId: string) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: vendorId }));
    onSelectVendor(itemId, vendorId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Angebotsvergleich</h2>
        <p className="text-muted-foreground">Vergleichen Sie alle eingereichten Angebote pro Kostengruppe</p>
      </div>
      
      {costGroups.map(costGroup => {
        const submissions = getVendorSubmissions(costGroup);
        
        if (submissions.length === 0) return null;
        
        return (
          <Card key={costGroup}>
            <CardHeader>
              <CardTitle>Kostengruppe {costGroup}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Position</th>
                      {submissions.map(submission => (
                        <th key={submission.vendorId} className="text-center p-2 min-w-[150px]">
                          <div className="font-semibold">{submission.vendorId}</div>
                          <div className="text-sm text-muted-foreground">
                            €{submission.totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(item => item.costGroup === costGroup && item.status === 'SUBMITTED').map(item => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                          </div>
                        </td>
                        {submissions.map(submission => {
                          const vendorItem = submission.items.find(vi => vi.id === item.id);
                          const isSelected = selectedItems[item.id] === submission.vendorId;
                          
                          return (
                            <td key={submission.vendorId} className="p-2 text-center">
                              {vendorItem ? (
                                <div className="space-y-2">
                                  <div className="font-semibold">
                                    €{vendorItem.purchasePrice.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Total: €{vendorItem.totalSellingPrice.toFixed(2)}
                                  </div>
                                  {vendorItem.pdfUrl && (
                                    <Button variant="ghost" size="sm">
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <div className="flex items-center justify-center">
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => handleSelectVendor(item.id, submission.vendorId!)}
                                    />
                                    <span className="ml-2 text-xs">Auswählen</span>
                                  </div>
                                  {isSelected && (
                                    <Badge variant="default" className="text-xs">
                                      <Check className="h-3 w-3 mr-1" />
                                      Ausgewählt
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <div className="text-muted-foreground text-sm">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {costGroups.every(cg => getVendorSubmissions(cg).length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Noch keine Angebote eingereicht</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};