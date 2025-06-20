import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { useAppContext } from '@/contexts/AppContext';
import { Shield, Users, Truck, User } from 'lucide-react';

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'ADMIN': return <Shield className="h-4 w-4" />;
    case 'PARTNER': return <Users className="h-4 w-4" />;
    case 'VENDOR': return <Truck className="h-4 w-4" />;
    case 'CLIENT': return <User className="h-4 w-4" />;
    default: return null;
  }
};

const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'ADMIN': return 'bg-red-100 text-red-800';
    case 'PARTNER': return 'bg-blue-100 text-blue-800';
    case 'VENDOR': return 'bg-green-100 text-green-800';
    case 'CLIENT': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const UserRoleSelector: React.FC = () => {
  const { currentRole, setCurrentRole } = useAppContext();
  
  return (
    <div className="flex items-center gap-3">
      <Badge className={`${getRoleColor(currentRole)} flex items-center gap-1`}>
        {getRoleIcon(currentRole)}
        {currentRole}
      </Badge>
      
      <Select value={currentRole} onValueChange={setCurrentRole}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ADMIN">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </div>
          </SelectItem>
          <SelectItem value="PARTNER">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Partner
            </div>
          </SelectItem>
          <SelectItem value="VENDOR">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Vendor
            </div>
          </SelectItem>
          <SelectItem value="CLIENT">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Client
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};