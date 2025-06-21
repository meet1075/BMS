import { useState } from "react";
import { BsBank } from "react-icons/bs";
import { MdEmail, MdLockOutline, MdPhone, MdHome } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import userLogin from "../hooks/userLogin.js";
import userRegister from "../hooks/userRegister";
import userGoogleLogin from "../hooks/userGoogleLogin";
import { useUser } from "../context/UserContext.jsx";
import axiosInstance from "../api/axios.js";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
const [msg, setMsg] = useState({ text: "", type: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate: loginUser } = userLogin();
  const { mutate: registerUser } = userRegister();
  // const { mutate: googleLogin } = userGoogleLogin();
const { setUser } = useUser();
  const handleSubmit = (e) => {
  e.preventDefault();
 
  if (!email || !password || (!isLogin && (!name || !contact || !address))) {
    setMsg({text:"Please fill in all required fields." , type:"error"});
    return;
  }

 
  if (!email.endsWith("@gmail.com")) {
    setMsg({text:"Email must be a proper Gmail address." , type:"error"});
    return;
  }

  
  if (!isLogin && !/^\d{10}$/.test(contact)) {
    setMsg({text:"Contact number must be a 10-digit number." , type:"error"});
    return;
  }

  const userData = {
    name,
    email,
    password,
    contact,
    address,
  };

  if (isLogin) {
  loginUser(
    { email, password },
    {
      onSuccess: (data) => {
        if (!data.accessToken) {
    console.error("No accessToken in response!");
    setMsg({ text: "Login failed: no token", type: "error" });
    return;
  }
        console.log("LOGIN SUCCESS:", data);
        localStorage.setItem("accesstoken", data.accessToken);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        setUser(data.user);
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || "Login failed";
        setMsg({ text: msg, type: "error" });
      },
    }
  );
}else {
    registerUser(userData, {
      onSuccess: () => {
        setIsLogin(true);
        setMsg({ text: "Registration successful! Please log in.", type: "success" });
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || "Registration failed";
        setMsg({ text: msg, type: "error" });
      },
    });
  }
};


const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/api/v1/users/google";
};


  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center px-4 min-h-screen">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold mb-4 rounded-2xl w-16 h-16 inline-flex items-center justify-center bg-white/10 shadow-blur-sm">
          <BsBank className="h-[24px] w-[24px] text-white" />
        </div>
        <h1 className="text-white font-bold text-3xl">SecureBank</h1>
        <p className="text-blue-200">Your trusted banking partner</p>
      </div>
      {msg.text && (
  <p
    className={`text-sm -mb-4 rounded-xl bg-white  p-1 ${
      msg.type === "success" ? "text-green-600" : "text-red-600"
    }`}
  >
    {msg.text}
  </p>
)}

      <div className="bg-white/10 w-full max-w-md backdrop-blur-sm rounded-2xl p-8 border border-white/20 mt-6">
        <div className="flex gap-4 text-[17px] justify-between w-full h-12 items-center font-semibold text-md mb-6 rounded-lg bg-white/10">
          <div
            className={`w-1/2 h-full flex items-center justify-center rounded-lg cursor-pointer ${
              isLogin ? "bg-white text-gray-900" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </div>
          <div
            className={`w-1/2 h-full flex items-center justify-center rounded-lg cursor-pointer ${
              !isLogin ? "bg-white text-gray-900" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">Contact Number</label>
              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MdHome className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <MdLockOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
          >
            {isLogin ? "Sign In" : "Create Account"}
            
          </button>

          {isLogin &&(
            <div className="relative my-1">
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-300">
                Or continue with
              </span>
            </div>
          </div>)}
        {isLogin &&(
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/10 hover:bg-white/20 border mt-4 border-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            
          >
            <FcGoogle className="h-5 w-5" />
            <span>Google</span>
          </button>)}
        </form>
      </div>
    </div>
  );
}

export default Login;
