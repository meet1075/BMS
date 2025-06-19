import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accesstoken = localStorage.getItem("accesstoken");
    if (accesstoken) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accesstoken}`;
      axiosInstance.get("/users/current-customer")
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
