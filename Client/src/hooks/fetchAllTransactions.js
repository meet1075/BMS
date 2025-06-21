import axiosInstance from "../api/axios.js";

const fetchAllTransactions = async () => {
    const response = await axiosInstance.get('/transactions/transactions');
    return response.data;
}

export default fetchAllTransactions; 