import axiosInstance from "../api/axios.js";
import { useMutation } from "@tanstack/react-query";

function userLogout() {
  const logoutUser= async()=>{
    const response = await axiosInstance.post('/users/logout', {
  }
    );
    return response.data;
  }
  return useMutation({
    mutationFn: logoutUser,})
}

export default userLogout
