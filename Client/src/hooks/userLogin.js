// import { useMutation } from "@tanstack/react-query"
// import axiosInstance from "../api/axios.js"
// function userLogin() {

//     const loginUser=async ({email, password})=>{
//         const response= await axiosInstance.post('/users/login', {
//             email,
//             password,
//             authType:'local'
//         })
//         return response.data;
//     }

//     return useMutation({
//         mutationFn:loginUser
//     })
// }

// export default userLogin
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios.js";

function userLogin() {
  const loginUser = async ({ email, password }) => {
    const response = await axiosInstance.post("/users/login", {
      email,
      password,
      authType: "local",
    });

    const data = response.data;

    if (!data.accessToken) {
      // Force error so onError handler is triggered
      throw new Error(data.message || "Login failed: Invalid credentials");
    }

    return data;
  };

  return useMutation({
    mutationFn: loginUser,
  });
}

export default userLogin;
