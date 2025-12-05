import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Project } from '../types/project';

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

const STORAGE_KEY = '@projects';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setProjects(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load projects', e);
      Alert.alert('Error', 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProjects = async (projectList: Project[]) => {
    try {
      const jsonValue = JSON.stringify(projectList);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      setProjects(projectList);
    } catch (e) {
      console.error('Failed to save projects', e);
      Alert.alert('Error', 'Failed to save projects');
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    const newProjects = [...projects, newProject];
    await saveProjects(newProjects);
    return newProject;
  };

  const updateProject = async (updatedProject: Project) => {
    const newProjects = projects.map((project) =>
      project.id === updatedProject.id 
        ? { ...updatedProject, updatedAt: new Date().toISOString() } 
        : project
    );
    await saveProjects(newProjects);
  };

  const deleteProject = async (id: string) => {
    const newProjects = projects.filter((project) => project.id !== id);
    await saveProjects(newProjects);
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
