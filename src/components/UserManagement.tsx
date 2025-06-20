import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Users, Activity } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  last_active: string;
  created_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: 'Benutzer konnten nicht geladen werden.',
        variant: 'destructive',
      });
    }
  };

  const inviteUser = async () => {
    if (!newUserEmail || !newUserRole) {
      toast({
        title: 'Fehler',
        description: 'Bitte E-Mail und Rolle angeben.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          email: newUserEmail,
          role: newUserRole,
          status: 'invited'
        }]);
      
      if (error) throw error;
      
      toast({
        title: 'Erfolg',
        description: `Einladung an ${newUserEmail} gesendet.`,
      });
      
      setNewUserEmail('');
      setNewUserRole('');
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Erfolg',
        description: 'Benutzerrolle aktualisiert.',
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      invited: 'secondary',
      inactive: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Neuen Benutzer einladen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="benutzer@example.com"
              />
            </div>
            <div className="w-48">
              <Label htmlFor="role">Rolle</Label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Rolle wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={inviteUser} disabled={loading}>
                {loading ? 'Wird gesendet...' : 'Einladen'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Benutzerübersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-Mail</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Zuletzt aktiv</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.last_active 
                      ? new Date(user.last_active).toLocaleDateString('de-DE')
                      : 'Nie'
                    }
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Deaktivieren
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};