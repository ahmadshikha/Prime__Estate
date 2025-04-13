import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const updateUser = (data) => {
    if (!data || !data.user) {
      console.error("Invalid data passed to updateUser", data);
      return;
    }
  
    setCurrentUser(data.user);
  
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    
    localStorage.setItem("user", JSON.stringify({
      ...userData,
      ...data.user,
      avatar: data.user.avatar
    }));
  
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Failed to clear localStorage", error);
    }
  };

  useEffect(() => {
    try {
      console.log("Updating localStorage", { currentUser, token });
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("user");
      }
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Failed to update localStorage", error);
    }
  }, [currentUser, token]);

  return (
    <AuthContext.Provider value={{ currentUser, token, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};