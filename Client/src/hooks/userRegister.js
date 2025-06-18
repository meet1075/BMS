import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios.js";


function userRegister() {
    const registerUser=async({name, email, password ,address, contact})=>{
        const response = axiosInstance.post('/users/register', {
            name,
            email,
            password,
            address,
            contact,
            authType: 'local'
        });
        return response.data;
    }
    return useMutation({
        mutationFn: registerUser
    });
}

export default userRegister
