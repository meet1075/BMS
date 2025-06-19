import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage on first render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const accesstoken = localStorage.getItem("accesstoken");
    if (accesstoken) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accesstoken}`;
      axiosInstance.get("/users/current-customer")
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem("user", JSON.stringify(res.data.data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        });
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  // Helper to set user and persist to localStorage
  const setAndPersistUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Helper to logout and clear user
  const logoutAndClearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accesstoken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider value={{ user, setUser: setAndPersistUser, logoutAndClearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
