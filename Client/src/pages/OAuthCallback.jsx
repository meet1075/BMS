import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token); 
      const user = parseJwt(token);         
      setUser(user);                        
      navigate("/dashboard");              
    } else {
      navigate("/login");
    }
  }, []);

  return <p className="text-white mt-10 text-center">Logging in...</p>;
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = atob(base64Url);
    return JSON.parse(base64);
  } catch (err) {
    return null;
  }
}

export default OAuthCallback;
