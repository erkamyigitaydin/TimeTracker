import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Client } from '../types/client';

type ClientContextType = {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Client>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  isLoading: boolean;
};

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const STORAGE_KEY = '@clients';

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setClients(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load clients', e);
      Alert.alert('Error', 'Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const saveClients = async (clientList: Client[]) => {
    try {
      const jsonValue = JSON.stringify(clientList);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      setClients(clientList);
    } catch (e) {
      console.error('Failed to save clients', e);
      Alert.alert('Error', 'Failed to save clients');
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...clientData,
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    const newClients = [...clients, newClient];
    await saveClients(newClients);
    return newClient;
  };

  const updateClient = async (updatedClient: Client) => {
    const newClients = clients.map((client) =>
      client.id === updatedClient.id 
        ? { ...updatedClient, updatedAt: new Date().toISOString() } 
        : client
    );
    await saveClients(newClients);
  };

  const deleteClient = async (id: string) => {
    const newClients = clients.filter((client) => client.id !== id);
    await saveClients(newClients);
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
