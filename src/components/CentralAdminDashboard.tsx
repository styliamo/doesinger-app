import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Project, User } from '@/types';
import { Users, FolderPlus, Calendar, CreditCard, Settings, AlertTriangle } from 'lucide-react';

interface CentralAdminDashboardProps {
  onClose?: () => void;
}

const CentralAdminDashboard: React.FC<CentralAdminDashboardProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [projectsResponse, usersResponse] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false })
      ]);

      if (projectsResponse.data) setProjects(projectsResponse.data);
      if (usersResponse.data) setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProjectName,
          description: '',
          status: 'ACTIVE',
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProjects([data, ...projects]);
        setNewProjectName('');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const duplicateProject = async (sourceProject: Project) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: `${sourceProject.name} (Kopie)`,
          description: sourceProject.description,
          status: 'ACTIVE',
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProjects([data, ...projects]);
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Zugriff verweigert</h2>
          <p className="text-gray-600">Sie haben keine Berechtigung für das Admin-Dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Lade Dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Eingeloggt als: Admin ({user?.email})
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Projekte</TabsTrigger>
          <TabsTrigger value="users">Benutzer</TabsTrigger>
          <TabsTrigger value="customers">Kunden</TabsTrigger>
          <TabsTrigger value="timeline">Zeitpläne</TabsTrigger>
          <TabsTrigger value="payments">Zahlungen</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5" />
                Projekte verwalten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Neues Projekt erstellen..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
                <Button onClick={createProject}>Erstellen</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projektname</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erstellt</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(project.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateProject(project)}
                        >
                          Duplizieren
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Benutzerverwaltung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-Mail</TableHead>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registriert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Kundenverwaltung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Kundenverwaltung wird implementiert...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Zeitpläne & Fristen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Gantt-Chart wird implementiert...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Zahlungsüberblick
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Zahlungsintegration wird implementiert...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CentralAdminDashboard;
export { CentralAdminDashboard };