import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users } from 'lucide-react';
import { Project } from '@/types';

interface ProjectManagementProps {
  projects: Project[];
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

export function ProjectManagement({ projects, onCreateProject, onUpdateProject }: ProjectManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    budgetLimit: 0,
    ffeBudgetLimit: 20000,
    status: 'ACTIVE' as const,
    ownerId: ''
  });

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      onCreateProject(newProject);
      setNewProject({
        name: '',
        description: '',
        budgetLimit: 0,
        ffeBudgetLimit: 20000,
        status: 'ACTIVE',
        ownerId: ''
      });
      setIsCreateOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projektmanagement</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neues Projekt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neues Projekt erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Projektname</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="z.B. MOONS Musterzimmer"
                />
              </div>
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Projektbeschreibung..."
                />
              </div>
              <div>
                <Label htmlFor="ffeBudget">FF&E Budget (€)</Label>
                <Input
                  id="ffeBudget"
                  type="number"
                  value={newProject.ffeBudgetLimit}
                  onChange={(e) => setNewProject({ ...newProject, ffeBudgetLimit: Number(e.target.value) })}
                />
              </div>
              <Button onClick={handleCreateProject} className="w-full">
                Projekt erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>FF&E Budget:</span>
                  <span>€{project.ffeBudgetLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Erstellt:</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Bearbeiten
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-1" />
                  Benutzer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}