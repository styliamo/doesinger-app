import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Mail, Phone, FileText } from 'lucide-react';
import { Vendor, UserRole } from '@/types';

interface VendorManagementProps {
  vendors: Vendor[];
  userRole: UserRole;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onAddVendor: () => void;
}

const VendorManagement: React.FC<VendorManagementProps> = ({
  vendors,
  userRole,
  onUpdateVendor,
  onAddVendor
}) => {
  const canEdit = userRole === 'ADMIN' || userRole === 'PARTNER';

  const getStatusColor = (status: Vendor['status']) => {
    switch (status) {
      case 'invited': return 'bg-yellow-100 text-yellow-800';
      case 'offer_submitted': return 'bg-blue-100 text-blue-800';
      case 'awarded': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Vendor['status']) => {
    switch (status) {
      case 'invited': return 'Invited';
      case 'offer_submitted': return 'Offer Submitted';
      case 'awarded': return 'Awarded';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vendor Management</h3>
        {canEdit && (
          <Button onClick={onAddVendor} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">
                  {canEdit ? (
                    <Input
                      value={vendor.name}
                      onChange={(e) => onUpdateVendor(vendor.id, { name: e.target.value })}
                      className="font-semibold border-none p-0 h-auto"
                    />
                  ) : (
                    vendor.name
                  )}
                </CardTitle>
                <Badge className={getStatusColor(vendor.status)}>
                  {getStatusLabel(vendor.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {canEdit ? (
                  <Input
                    value={vendor.email}
                    onChange={(e) => onUpdateVendor(vendor.id, { email: e.target.value })}
                    className="text-sm border-none p-0 h-auto"
                  />
                ) : (
                  vendor.email
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {canEdit ? (
                  <Input
                    value={vendor.phone}
                    onChange={(e) => onUpdateVendor(vendor.id, { phone: e.target.value })}
                    className="text-sm border-none p-0 h-auto"
                  />
                ) : (
                  vendor.phone
                )}
              </div>
              {vendor.notes && (
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">Notes:</span>
                  </div>
                  {canEdit ? (
                    <Textarea
                      value={vendor.notes}
                      onChange={(e) => onUpdateVendor(vendor.id, { notes: e.target.value })}
                      className="text-sm min-h-[60px]"
                    />
                  ) : (
                    <p className="text-gray-600">{vendor.notes}</p>
                  )}
                </div>
              )}
              {canEdit && (
                <div className="pt-2">
                  <select
                    value={vendor.status}
                    onChange={(e) => onUpdateVendor(vendor.id, { status: e.target.value as Vendor['status'] })}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="invited">Invited</option>
                    <option value="offer_submitted">Offer Submitted</option>
                    <option value="awarded">Awarded</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorManagement;