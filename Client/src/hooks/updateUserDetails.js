import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const updateUserDetails = async (details) => {
  const response = await axiosInstance.patch('/users/update-details', details);
  return response.data;
};

export default function useUpdateUserDetails() {
  return useMutation({
    mutationFn: updateUserDetails,
  });
} 