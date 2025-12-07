import { Client } from '@/types/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@clients';

export const clientService = {
    async getClients(): Promise<Client[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to load clients', e);
            throw e;
        }
    },

    async saveClients(clients: Client[]): Promise<void> {
        try {
            const jsonValue = JSON.stringify(clients);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error('Failed to save clients', e);
            throw e;
        }
    },

    async addClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
        const clients = await this.getClients();
        const now = new Date().toISOString();

        // Server-side ID simulation
        const newClient: Client = {
            ...clientData,
            id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: now,
            updatedAt: now,
        };

        await this.saveClients([...clients, newClient]);
        return newClient;
    },

    async updateClient(updatedClient: Client): Promise<void> {
        const clients = await this.getClients();
        const newClients = clients.map((client) =>
            client.id === updatedClient.id
                ? { ...updatedClient, updatedAt: new Date().toISOString() }
                : client
        );
        await this.saveClients(newClients);
    },

    async deleteClient(id: string): Promise<void> {
        const clients = await this.getClients();
        const newClients = clients.filter((client) => client.id !== id);
        await this.saveClients(newClients);
    }
};
