import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axios";

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token); 
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axiosInstance.get("/users/current-customer")
        .then((res) => {
          setUser(res.data.user);
          navigate("/dashboard");
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return <p className="text-white mt-10 text-center">Logging in...</p>;
}

export default OAuthCallback;
