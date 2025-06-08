import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from './types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const [token, userStr] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user'),
      ]);
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setState({ token, user });
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, user: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('token', token),
        AsyncStorage.setItem('user', JSON.stringify(user)),
      ]);
      setState({ token, user });
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
      setState({ token: null, user: null });
    } catch (error) {
      console.error('Error removing auth state:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading }}>
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
