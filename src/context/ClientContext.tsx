import { clientService } from '@/services/clientService';
import { Client } from '@/types/client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type ClientContextType = {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Client>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  isLoading: boolean;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientService.getClients();
      setClients(data);
    } catch (e) {
      console.error('Failed to load clients', e);
      Alert.alert('Error', 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    try {
      const newClient = await clientService.addClient(clientData);
      setClients((prev) => [...prev, newClient]);
      return newClient;
    } catch (e) {
      console.error('Failed to add client', e);
      Alert.alert('Error', 'Failed to add client');
      throw e;
    }
  };

  const updateClient = async (updatedClient: Client) => {
    try {
      await clientService.updateClient(updatedClient);
      await loadClients(); // Reload to sync
    } catch (e) {
      console.error('Failed to update client', e);
      Alert.alert('Error', 'Failed to update client');
      throw e;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientService.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error('Failed to delete client', e);
      Alert.alert('Error', 'Failed to delete client');
      throw e;
    }
  };

  const getClientById = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        isLoading,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClients must be used inside ClientProvider');
  return ctx;
}
