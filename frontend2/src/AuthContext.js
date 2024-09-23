import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const AuthContext = createContext();

// Provide Context
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [expiryTime,setExpiryTime]=useState(null);
 
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('loggedInUser');
    const expirationTime=localStorage.getItem('ExpiryTime');
    if (storedToken && storedUser && expirationTime) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      setExpiryTime(expirationTime);
    }
  }, []);
  const login = (userData,authToken,expiresIn) => {
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    localStorage.setItem('ExpiryTime',expirationTime);
    setExpiryTime(expirationTime);
    setToken(authToken);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('ExpiryTime');
    localStorage.removeItem('loggedInUser');
    setToken(null);
    setUser(null);
    setExpiryTime(null);
    setIsLoggedIn(false);
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user ,token,expiryTime}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);
