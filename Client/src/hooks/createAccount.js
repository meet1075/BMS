import axiosInstance from "../api/axios.js";
import { useMutation } from "@tanstack/react-query";

const createAccount = async(accountData)=>{
    const response = await axiosInstance.post("accounts/create-account",
        {
            accountType:accountData
        },
        {
            withCredentials: true 
        }
    );
    return response.data;
}

export const useCreateAccount = () => {
    return useMutation({
        mutationFn:createAccount,
    })
}