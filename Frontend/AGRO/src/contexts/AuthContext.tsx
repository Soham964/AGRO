import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = apiService.getToken();
    if (token) {
      apiService.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // Token is invalid, clear it
          apiService.clearToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ username, password });
      apiService.setToken(response.token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      apiService.setToken(response.token);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 