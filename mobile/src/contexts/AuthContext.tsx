import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthContextType {
	token: string | null;
	user: User | null;
	login: (token: string, user: User) => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadToken();
	}, []);

	const loadToken = async () => {
		try {
			const [tokenStr, userStr] = await Promise.all([
				AsyncStorage.getItem('token'),
				AsyncStorage.getItem('user'),
			]);

			if (tokenStr && userStr) {
				const parsedUser = JSON.parse(userStr);
				setToken(tokenStr);
				setUser(parsedUser);
			}
		} catch (error) {
			console.error('Error loading auth state:', error);
		} finally {
			setLoading(false);
		}
	};

	const login = async (newToken: string, newUser: User) => {
		try {
			await Promise.all([
				AsyncStorage.setItem('token', newToken),
				AsyncStorage.setItem('user', JSON.stringify(newUser)),
			]);
			setToken(newToken);
			setUser(newUser);
		} catch (error) {
			console.error('Error saving auth state:', error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await Promise.all([
				AsyncStorage.removeItem('token'),
				AsyncStorage.removeItem('user'),
			]);
			setToken(null);
			setUser(null);
		} catch (error) {
			console.error('Error clearing auth state:', error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider value={{ token, user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
