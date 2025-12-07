import { Role } from '@/constants/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const SESSION_KEY = '@auth_session';

export type User = {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: Role;
};

export const authService = {
    // --- User Management (Simulating a Database) ---

    async getUsers(): Promise<User[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(USERS_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to load users', e);
            return [];
        }
    },

    async saveUsers(users: User[]): Promise<void> {
        try {
            await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (e) {
            console.error('Failed to save users', e);
            throw e;
        }
    },

    async register(fullName: string, email: string, password: string, role: Role): Promise<User> {
        const users = await this.getUsers();

        if (users.some((u) => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            id: Date.now().toString() + Math.random().toString(36),
            fullName,
            email,
            password,
            role
        };

        await this.saveUsers([...users, newUser]);
        return newUser;
    },

    async login(email: string, password: string): Promise<User> {
        const users = await this.getUsers();
        const user = users.find((u) => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid credentials');
        }
        return user;
    },

    // --- Session Management (Simulating Session/Token Storage) ---

    async getSession(): Promise<User | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(SESSION_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch {
            return null;
        }
    },

    async setSession(user: User): Promise<void> {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    },

    async clearSession(): Promise<void> {
        await AsyncStorage.removeItem(SESSION_KEY);
    }
};
