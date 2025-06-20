import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProjectItem, UserRole } from '@/types';
import { Paperclip, Check, X } from 'lucide-react';

interface ProjectTableProps {
  items: ProjectItem[];
  userRole: UserRole;
  onUpdateItem: (id: string, updates: Partial<ProjectItem>) => void;
  onApproveForClient: (id: string) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  items,
  userRole,
  onUpdateItem,
  onApproveForClient
}) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);

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
        return ['costGroup', 'description', 'quantity', 'unit', 'purchasePrice'].includes(field);
      case 'CLIENT':
        return ['costGroup', 'description', 'quantity', 'unit', 'sellingPriceUnit', 'totalSellingPrice'].includes(field);
      default:
        return false;
    }
  };

  const filteredItems = userRole === 'CLIENT' 
    ? items.filter(item => item.approvedForClient)
    : items;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {canSeeField('costGroup') && <TableHead>Kostengruppe</TableHead>}
            {canSeeField('description') && <TableHead>Beschreibung</TableHead>}
            {canSeeField('quantity') && <TableHead>Menge</TableHead>}
            {canSeeField('unit') && <TableHead>Einheit</TableHead>}
            {canSeeField('purchasePrice') && <TableHead>EK</TableHead>}
            {canSeeField('totalPurchasePrice') && <TableHead>Summe EK</TableHead>}
            {canSeeField('markupPercent') && <TableHead>Marge (%)</TableHead>}
            {canSeeField('sellingPriceUnit') && <TableHead>VK</TableHead>}
            {canSeeField('totalSellingPrice') && <TableHead>Summe VK</TableHead>}
            {canSeeField('category') && <TableHead>Kategorie</TableHead>}
            {userRole === 'ADMIN' && <TableHead>Aktionen</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id} className={item.category === 'FF&E' ? 'bg-orange-50' : ''}>
              {canSeeField('costGroup') && (
                <TableCell>
                  {canEdit('costGroup', item) ? (
                    <Input
                      value={item.costGroup}
                      onChange={(e) => onUpdateItem(item.id, { costGroup: e.target.value })}
                      className="w-20"
                    />
                  ) : (
                    item.costGroup
                  )}
                </TableCell>
              )}
              {canSeeField('description') && (
                <TableCell>
                  {canEdit('description', item) ? (
                    <Input
                      value={item.description}
                      onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                    />
                  ) : (
                    item.description
                  )}
                </TableCell>
              )}
              {canSeeField('quantity') && (
                <TableCell>
                  {canEdit('quantity', item) ? (
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, { quantity: Number(e.target.value) })}
                      className="w-20"
                    />
                  ) : (
                    item.quantity
                  )}
                </TableCell>
              )}
              {canSeeField('unit') && (
                <TableCell>
                  {canEdit('unit', item) ? (
                    <Input
                      value={item.unit}
                      onChange={(e) => onUpdateItem(item.id, { unit: e.target.value })}
                      className="w-16"
                    />
                  ) : (
                    item.unit
                  )}
                </TableCell>
              )}
              {canSeeField('purchasePrice') && (
                <TableCell>
                  {canEdit('purchasePrice', item) ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={item.purchasePrice}
                      onChange={(e) => onUpdateItem(item.id, { purchasePrice: Number(e.target.value) })}
                      className="w-24"
                    />
                  ) : (
                    `€${item.purchasePrice.toFixed(2)}`
                  )}
                </TableCell>
              )}
              {canSeeField('totalPurchasePrice') && (
                <TableCell>€{item.totalPurchasePrice.toFixed(2)}</TableCell>
              )}
              {canSeeField('markupPercent') && (
                <TableCell>
                  {userRole === 'ADMIN' ? (
                    <Input
                      type="number"
                      step="0.1"
                      value={item.markupPercent}
                      onChange={(e) => onUpdateItem(item.id, { markupPercent: Number(e.target.value) })}
                      className="w-20"
                    />
                  ) : (
                    `${item.markupPercent}%`
                  )}
                </TableCell>
              )}
              {canSeeField('sellingPriceUnit') && (
                <TableCell>€{item.sellingPriceUnit.toFixed(2)}</TableCell>
              )}
              {canSeeField('totalSellingPrice') && (
                <TableCell>€{item.totalSellingPrice.toFixed(2)}</TableCell>
              )}
              {canSeeField('category') && (
                <TableCell>
                  <Badge variant={item.category === 'FF&E' ? 'default' : 'secondary'}>
                    {item.category}
                  </Badge>
                </TableCell>
              )}
              {userRole === 'ADMIN' && (
                <TableCell>
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
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};