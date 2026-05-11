import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useOktaAuth } from '@okta/okta-react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useOktaAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState?.isAuthenticated && authState.user) {
      setUser({
        id: authState.user.sub || 'unknown',
        name: authState.user.name || authState.user.email?.split('@')[0] || 'User',
        email: authState.user.email || '',
        isAdmin: false,
      });
    }
    setLoading(false);
  }, [authState]);

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.isAdmin || false, loading }}>
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
