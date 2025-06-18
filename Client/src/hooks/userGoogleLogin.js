import axiosInstance from "../api/axios.js";
import { useMutation } from "@tanstack/react-query";

function userGoogleLogin() {
  const googleLogin=async ({googleId,email})=>{
    const response = axiosInstance.post('/users/google', {
      googleId,
      email,
      authType: 'google'
    });
    return response.data;
  }
    return useMutation({
        mutationFn: googleLogin
    });
}

export default userGoogleLogin
