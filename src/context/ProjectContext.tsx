import { projectService } from '@/services/projectService';
import { Project } from '@/types/project';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type ProjectContextType = {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByClientId: (clientId: string) => Project[];
  isLoading: boolean;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (e) {
      console.error('Failed to load projects', e);
      Alert.alert('Error', 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    try {
      const newProject = await projectService.addProject(projectData);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (e) {
      console.error('Failed to add project', e);
      Alert.alert('Error', 'Failed to add project');
      throw e;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      await projectService.updateProject(updatedProject);
      // Reload to ensure we have the correct server/service state (timestamps etc)
      await loadProjects();
    } catch (e) {
      console.error('Failed to update project', e);
      Alert.alert('Error', 'Failed to update project');
      throw e;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error('Failed to delete project', e);
      Alert.alert('Error', 'Failed to delete project');
      throw e;
    }
  };

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const getProjectsByClientId = (clientId: string) => {
    return projects.filter((project) => project.clientId === clientId);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        getProjectsByClientId,
        isLoading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used inside ProjectProvider');
  return ctx;
}
