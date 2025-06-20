import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Trash2 } from 'lucide-react';
import { Project, ProjectUser, UserRole } from '@/types';

interface ProjectUserInviteProps {
  project: Project;
  projectUsers: ProjectUser[];
  onInviteUser: (email: string, role: UserRole, projectId: string) => void;
  onRemoveUser: (projectUserId: string) => void;
}

export function ProjectUserInvite({ 
  project, 
  projectUsers, 
  onInviteUser, 
  onRemoveUser 
}: ProjectUserInviteProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: '' as UserRole
  });

  const handleInvite = () => {
    if (inviteData.email && inviteData.role) {
      onInviteUser(inviteData.email, inviteData.role, project.id);
      setInviteData({ email: '', role: '' as UserRole });
      setIsInviteOpen(false);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'PARTNER': return 'default';
      case 'VENDOR': return 'secondary';
      case 'CLIENT': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PENDING': return 'secondary';
      case 'INACTIVE': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Projektbenutzer - {project.name}</CardTitle>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Benutzer einladen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Benutzer zu Projekt einladen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    placeholder="benutzer@beispiel.de"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rolle</Label>
                  <Select value={inviteData.role} onValueChange={(value: UserRole) => setInviteData({ ...inviteData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rolle auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PARTNER">Partner</SelectItem>
                      <SelectItem value="VENDOR">Vendor</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleInvite} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Einladung senden
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projectUsers.map((projectUser) => (
            <div key={projectUser.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium">{projectUser.userId}</p>
                  <p className="text-sm text-muted-foreground">
                    Eingeladen: {new Date(projectUser.invitedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(projectUser.role)}>
                  {projectUser.role}
                </Badge>
                <Badge variant={getStatusBadgeVariant(projectUser.status)}>
                  {projectUser.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveUser(projectUser.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {projectUsers.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Noch keine Benutzer zu diesem Projekt eingeladen.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}