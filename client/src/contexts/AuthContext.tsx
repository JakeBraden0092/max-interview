import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApolloClient } from '@apollo/client';

// Type definitions
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileCompleted: boolean;
  surveyCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Default context values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {
    throw new Error('login function not implemented');
  },
  register: async () => {
    throw new Error('register function not implemented');
  },
  logout: () => {},
  updateUser: () => {},
});

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
interface AuthProviderProps {
  children: React.ReactNode;
  client: ApolloClient<any>;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, client }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Verify token with the server (can be expanded later)
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const userData: User = {
        id: '1',
        email,
        firstName: 'Demo',
        lastName: 'User',
        profileCompleted: false,
        surveyCompleted: false,
      };

      // Store auth data
      const token = 'demo-token-' + Math.random().toString(36).substring(2);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (email: string, password: string): Promise<User> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful registration
      const userData: User = {
        id: '1',
        email,
        profileCompleted: false,
        surveyCompleted: false,
      };

      // Store auth data
      const token = 'demo-token-' + Math.random().toString(36).substring(2);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Reset Apollo store to clear cached queries
    client.resetStore().catch(err => {
      console.error('Error resetting Apollo cache on logout:', err);
    });
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;