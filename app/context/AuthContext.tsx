'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
    id: string;
    email: string;
    name?: string;
    role?: string;
} | null;

interface AuthContextValue {
    user: User | undefined; // undefined while loading
    login: (userData: any) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            const data = await res.json();
            setUser(data?.user ?? null);
        } catch (err) {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData: any) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
