import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('metamart-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const isAdmin = email === 'admin@gmail.com' && password === 'admin';
    
    if (email === 'admin@gmail.com' && password !== 'admin') {
      throw new Error('Invalid credentials for admin');
    }
    
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      isAdmin,
    };
    
    setUser(mockUser);
    localStorage.setItem('metamart-user', JSON.stringify(mockUser));
    return mockUser;
  };

  const signup = async (email, password, name) => {
    // Mock signup - replace with actual authentication
    const mockUser = {
      id: Date.now().toString(),
      email,
      name,
      isAdmin: false
    };
    
    setUser(mockUser);
    localStorage.setItem('metamart-user', JSON.stringify(mockUser));
    return mockUser;
  };

  const loginWithGoogle = async () => {
    // Mock Google OAuth - replace with actual Google OAuth implementation
    const mockUser = {
      id: 'google-' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      isAdmin: false,
      provider: 'google'
    };
    
    setUser(mockUser);
    localStorage.setItem('metamart-user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('metamart-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};