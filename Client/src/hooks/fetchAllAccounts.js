import axiosInstance from "../api/axios.js";

const fetchAllAccounts = async () => {
    const response = await axiosInstance.get('/accounts/get-all-accounts');
    return response.data;
}

export default fetchAllAccounts; 