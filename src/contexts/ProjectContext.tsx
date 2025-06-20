import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectUser, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  projectUsers: ProjectUser[];
  setSelectedProject: (project: Project | null) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  inviteUserToProject: (email: string, role: string, projectId: string) => Promise<void>;
  getUserProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([]);
  const { user } = useAuth();

  const getUserProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, owner_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      setProjects(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const inviteUserToProject = async (email: string, role: string, projectId: string) => {
    try {
      // Create user if doesn't exist
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert([{ email, role, status: 'PENDING' }])
        .select()
        .single();
      
      if (userError) throw userError;
      
      // Add to project
      const { error: projectUserError } = await supabase
        .from('project_users')
        .insert([{ project_id: projectId, user_id: userData.id, role, status: 'PENDING' }]);
      
      if (projectUserError) throw projectUserError;
      
      // Send invitation email (simplified)
      const project = projects.find(p => p.id === projectId);
      alert(`Einladung würde gesendet an: ${email}\nProjekt: ${project?.name}\nRolle: ${role}`);
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserProjects();
    }
  }, [user]);

  return (
    <ProjectContext.Provider value={{
      projects,
      selectedProject,
      projectUsers,
      setSelectedProject,
      createProject,
      inviteUserToProject,
      getUserProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}