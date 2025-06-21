import axiosInstance from "../api/axios.js";

const fetchAllUser = async () => {
    const response =await axiosInstance.get('/users/get-all-user');
    return response.data;
}
export default fetchAllUser;