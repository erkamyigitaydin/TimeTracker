import { Project } from '@/types/project';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@projects';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to load projects', e);
            throw e;
        }
    },

    async saveProjects(projects: Project[]): Promise<void> {
        try {
            const jsonValue = JSON.stringify(projects);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error('Failed to save projects', e);
            throw e;
        }
    },

    async addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        const projects = await this.getProjects();
        const now = new Date().toISOString();

        // We simulate ID generation here.
        const newProject: Project = {
            ...projectData,
            id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
            updatedAt: now,
        };

        await this.saveProjects([...projects, newProject]);
        return newProject;
    },

    async updateProject(updatedProject: Project): Promise<void> {
        const projects = await this.getProjects();
        const newProjects = projects.map((project) =>
            project.id === updatedProject.id
                ? { ...updatedProject, updatedAt: new Date().toISOString() }
                : project
        );
        await this.saveProjects(newProjects);
    },

    async deleteProject(id: string): Promise<void> {
        const projects = await this.getProjects();
        const newProjects = projects.filter((project) => project.id !== id);
        await this.saveProjects(newProjects);
    }
};
