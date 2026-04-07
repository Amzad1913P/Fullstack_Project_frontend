import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile } from '../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    return fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
