import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axios";

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const accessToken = searchParams.get("accesstoken");
    if (accessToken) {
      localStorage.setItem("accesstoken", accessToken); 
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      axiosInstance.get("/users/current-customer")
        .then((res) => {
          setUser(res.data.data);
          const role = (res.data.data.role || '').toString().toLowerCase();
          navigate(role === 'admin' ? '/admin' : '/dashboard');
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
