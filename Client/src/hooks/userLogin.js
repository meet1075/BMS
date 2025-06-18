import { useMutation } from "@tanstack/react-query"
import axiosInstance from "../api/axios.js"
function userLogin() {

    const loginUser=async ({email, password})=>{
        const response=axiosInstance.post('/users/login', {
            email,
            password,
            authType:'local'
        })
        return response.data;
    }

    return useMutation({
        mutationFn:loginUser
    })
}

export default userLogin
