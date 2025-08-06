import type { User } from './types';

export const users: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password', 
        role: 'admin',
    },
    {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password',
        role: 'user',
    },
    {
        id: '3',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        role: 'user',
    },
    {
        id: '4',
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'password123',
        role: 'user',
    }
];
