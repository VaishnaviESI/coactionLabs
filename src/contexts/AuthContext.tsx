import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User;
  isAdmin: boolean;
}

const defaultUser: User = {
  id: 'user-1',
  name: 'JSmith',
  email: 'jsmith@company.com',
  isAdmin: true, // For demo purposes, user is admin
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<User>(defaultUser);

  return (
    <AuthContext.Provider value={{ user, isAdmin: user.isAdmin }}>
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
