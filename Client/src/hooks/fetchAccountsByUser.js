import axiosInstance from "../api/axios.js";

const fetchAccountsByUser = async (userId) => {
  const response = await axiosInstance.get(`accounts/get-all-accounts-by-user/${userId}`);
  return response.data;
};

export default fetchAccountsByUser;
