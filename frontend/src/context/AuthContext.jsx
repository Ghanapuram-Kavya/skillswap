import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbHealth, setDbHealth] = useState(null);

  // Load all users and initial active user (Kavya)
  const init = async () => {
    try {
      setLoading(true);
      const [usersRes, healthRes] = await Promise.all([
        api.getAllUsers(),
        api.getDbHealth()
      ]);

      if (usersRes.success) {
        setAllUsers(usersRes.data);
        // Default to Kavya
        const kavya = usersRes.data.find(u => u.userId === 'usr-kavya') || usersRes.data[0];
        setCurrentUser(kavya);
      }
      if (healthRes.success) {
        setDbHealth(healthRes.database);
      }
    } catch (err) {
      console.error('Error initializing AuthContext:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const switchUser = async (userId) => {
    try {
      const profileRes = await api.getUserProfile(userId);
      if (profileRes.success) {
        setCurrentUser(profileRes.data);
      }
    } catch (err) {
      console.error('Error switching user:', err);
    }
  };

  const refreshUser = async () => {
    if (!currentUser) return;
    try {
      const profileRes = await api.getUserProfile(currentUser.userId);
      if (profileRes.success) {
        setCurrentUser(profileRes.data);
      }
      const usersRes = await api.getAllUsers();
      if (usersRes.success) {
        setAllUsers(usersRes.data);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      allUsers,
      switchUser,
      refreshUser,
      dbHealth,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
