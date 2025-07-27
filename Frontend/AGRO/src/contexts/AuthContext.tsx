import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithOTP: (email: string, otpCode: string) => Promise<boolean>;
  sendOTP: (email: string, purpose?: 'login' | 'registration') => Promise<boolean>;
  verifyOTP: (email: string, otpCode: string, purpose?: 'login' | 'registration') => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
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

  const loginWithOtp = async (username: string, phoneNumber: string, role: 'buyer' | 'seller' = 'buyer'): Promise<boolean> => {
    try {
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: 1,
        username: username,
        email: `${username}@example.com`,
        first_name: username,
        last_name: "User",
        role: role,
        phone: phoneNumber,
        location: "Mumbai",
        is_verified: true,
        date_joined: new Date().toISOString()
      };
      
      // Set a mock token
      apiService.setToken('mock-token-' + Date.now());
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('OTP login failed:', error);
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

  const sendOTP = async (email: string, purpose: 'login' | 'registration' = 'login'): Promise<boolean> => {
    try {
      setIsLoading(true);
      await apiService.sendOTP({ email, purpose });
      console.log(`OTP sent to ${email} for ${purpose}`);
      return true;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otpCode: string, purpose: 'login' | 'registration' = 'login'): Promise<boolean> => {
    try {
      setIsLoading(true);
      await apiService.verifyOTP({ email, otp_code: otpCode, purpose });
      console.log(`OTP verified for ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOTP = async (email: string, otpCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.loginWithOTP({ email, otp_code: otpCode });
      
      if (response.user) {
        setUser(response.user);
        localStorage.setItem('token', response.token);
        console.log('Login with OTP successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login with OTP failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithOTP,
    sendOTP,
    verifyOTP,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 