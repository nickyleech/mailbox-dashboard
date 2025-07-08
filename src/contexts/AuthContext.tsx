'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  PublicClientApplication, 
  AccountInfo, 
  AuthenticationResult,
  InteractionRequiredAuthError,
  SilentRequest
} from '@azure/msal-browser';
import { msalConfig, loginRequest } from '@/config/auth';
import { GraphService, MSALAuthenticationProvider } from '@/services/graphClient';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  graphService: GraphService | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [graphService, setGraphService] = useState<GraphService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();
        setMsalInstance(instance);

        // Check if user is already logged in
        const accounts = instance.getAllAccounts();
        if (accounts.length > 0) {
          setUser(accounts[0]);
          setIsAuthenticated(true);
          await setupGraphService(instance, accounts[0]);
        }
      } catch (err) {
        console.error('Failed to initialize MSAL:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeMsal();
  }, []);

  const setupGraphService = async (instance: PublicClientApplication, account: AccountInfo) => {
    try {
      const getTokenSilently = async (): Promise<string> => {
        const silentRequest: SilentRequest = {
          ...loginRequest,
          account: account,
        };

        try {
          const response = await instance.acquireTokenSilent(silentRequest);
          return response.accessToken;
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            const response = await instance.acquireTokenPopup(loginRequest);
            return response.accessToken;
          }
          throw error;
        }
      };

      const authProvider = new MSALAuthenticationProvider(getTokenSilently);
      const service = new GraphService(authProvider);
      setGraphService(service);
    } catch (err) {
      console.error('Failed to setup Graph service:', err);
      setError('Failed to setup Microsoft Graph service');
    }
  };

  const login = async () => {
    if (!msalInstance) {
      setError('Authentication not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: AuthenticationResult = await msalInstance.loginPopup(loginRequest);
      
      if (response.account) {
        setUser(response.account);
        setIsAuthenticated(true);
        await setupGraphService(msalInstance, response.account);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!msalInstance) return;

    try {
      setLoading(true);
      await msalInstance.logoutPopup();
      setUser(null);
      setIsAuthenticated(false);
      setGraphService(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    graphService,
    loading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};