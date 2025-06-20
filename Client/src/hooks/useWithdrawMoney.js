import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const withdrawMoney = async ({ accountId, amount, pin }) => {
  const response = await axiosInstance.patch(`/transactions/withdraw/${accountId}`, { amount, pin });
  return response.data;
};

export default function useWithdrawMoney() {
  return useMutation({
    mutationFn: withdrawMoney,
  });
} 