import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onProjectChange: (projectId: string) => void;
  className?: string;
}

export function ProjectSelector({ 
  projects, 
  selectedProjectId, 
  onProjectChange, 
  className 
}: ProjectSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium">Projekt:</span>
      <Select value={selectedProjectId || ''} onValueChange={onProjectChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Projekt auswählen" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}