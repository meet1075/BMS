import axiosInstance from "../api/axios";

const fetchAccountDetails=async(accountId)=>{
    const response = await axiosInstance.get(`accounts/get-account-details/${accountId}`);
    return response.data;
}

export default fetchAccountDetails;