import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const depositMoney = async ({ accountId, amount, pin }) => {
  const response = await axiosInstance.patch(`/transactions/deposit/${accountId}`, { amount, pin });
  return response.data;
};

export default function useDepositMoney() {
  return useMutation({
    mutationFn: depositMoney,
  });
} 