// import axiosInstance from "../api/axios.js";

// const fetchTransactionData = async (userId) => {
//     const response = await axiosInstance.get(`transactions/get-transaction-data/${userId}`);
//     return response.data;
// }
// export default fetchTransactionData;

import axiosInstance from "../api/axios.js";

const fetchTransactionData = async (userId, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.type && filters.type.toLowerCase() !== "all types") {
    params.append("type", filters.type.toLowerCase());
  }

  if (filters.accountNumber && filters.accountNumber !== "all") {
    params.append("accountNumber", filters.accountNumber);
  }

  const url = `transactions/get-transaction-data/${userId}?${params.toString()}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export default fetchTransactionData;
