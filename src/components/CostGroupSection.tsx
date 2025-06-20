import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectItem, UserRole } from '@/types';
import { ChevronDown, ChevronUp, Paperclip, Check, X, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CostGroupSectionProps {
  costGroup: string;
  items: ProjectItem[];
  userRole: UserRole;
  onUpdateItem: (id: string, updates: Partial<ProjectItem>) => void;
  onApproveForClient: (id: string) => void;
  onAddItemToCostGroup: (costGroup: string) => void;
}

export const CostGroupSection: React.FC<CostGroupSectionProps> = ({
  costGroup,
  items,
  userRole,
  onUpdateItem,
  onApproveForClient,
  onAddItemToCostGroup
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const canEdit = (field: string, item: ProjectItem) => {
    switch (userRole) {
      case 'ADMIN':
        return true;
      case 'PARTNER':
        return ['purchasePrice', 'quantity'].includes(field);
      case 'VENDOR':
        return ['purchasePrice'].includes(field) && item.vendorId === 'current-vendor';
      case 'CLIENT':
        return false;
      default:
        return false;
    }
  };

  const canSeeField = (field: string) => {
    switch (userRole) {
      case 'ADMIN':
        return true;
      case 'PARTNER':
        return !['markupPercent', 'sellingPriceUnit', 'totalSellingPrice'].includes(field);
      case 'VENDOR':
        return ['costGroup', 'costGroupPosition', 'description', 'quantity', 'unit', 'purchasePrice', 'totalPurchasePrice'].includes(field);
      case 'CLIENT':
        return ['costGroup', 'costGroupPosition', 'description', 'quantity', 'unit', 'sellingPriceUnit', 'totalSellingPrice'].includes(field);
      default:
        return false;
    }
  };

  const filteredItems = userRole === 'CLIENT' 
    ? items.filter(item => item.approvedForClient)
    : items;

  const groupTotal = filteredItems.reduce((sum, item) => {
    if (userRole === 'CLIENT' || userRole === 'ADMIN') {
      return sum + item.totalSellingPrice;
    }
    return sum + item.totalPurchasePrice;
  }, 0);

  return (
    <Card className="mb-4 bg-gray-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Kostengruppe {costGroup}
          </CardTitle>
          <div className="flex items-center gap-2">
            {(userRole === 'ADMIN' || userRole === 'PARTNER') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddItemToCostGroup(costGroup)}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Neue Position zu KG {costGroup}
              </Button>
            )}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {(!isCollapsed || !isMobile) && (
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className={`p-3 rounded border ${item.category === 'FF&E' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {canSeeField('costGroupPosition') && (
                    <div>
                      <label className="text-xs text-gray-500">Position</label>
                      <div className="font-mono text-sm">{item.costGroupPosition}</div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500">Beschreibung</label>
                    <div className="font-medium">{item.description}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Menge</label>
                    <div>{item.quantity} {item.unit}</div>
                  </div>
                  {canSeeField('purchasePrice') && (
                    <div>
                      <label className="text-xs text-gray-500">EK</label>
                      {canEdit('purchasePrice', item) ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={item.purchasePrice}
                          onChange={(e) => onUpdateItem(item.id, { purchasePrice: Number(e.target.value) })}
                          className="h-8"
                        />
                      ) : (
                        <div>€{item.purchasePrice.toFixed(2)}</div>
                      )}
                    </div>
                  )}
                  {canSeeField('totalPurchasePrice') && (
                    <div>
                      <label className="text-xs text-gray-500">Summe EK</label>
                      <div>€{item.totalPurchasePrice.toFixed(2)}</div>
                    </div>
                  )}
                  {canSeeField('sellingPriceUnit') && (
                    <div>
                      <label className="text-xs text-gray-500">VK</label>
                      <div>€{item.sellingPriceUnit.toFixed(2)}</div>
                    </div>
                  )}
                  {canSeeField('totalSellingPrice') && (
                    <div>
                      <label className="text-xs text-gray-500">Summe VK</label>
                      <div>€{item.totalSellingPrice.toFixed(2)}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={item.category === 'FF&E' ? 'default' : 'secondary'}>
                    {item.category}
                  </Badge>
                  {userRole === 'ADMIN' && (
                    <div className="flex gap-2">
                      {item.pdfUrl && (
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant={item.approvedForClient ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onApproveForClient(item.id)}
                      >
                        {item.approvedForClient ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-300">
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-800">
                Summe Kostengruppe {costGroup}: €{groupTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};