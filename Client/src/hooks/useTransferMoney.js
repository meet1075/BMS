import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const transferMoney = async ({ fromAccountId, toAccountNumber, amount, pin }) => {
  const response = await axiosInstance.patch(`/transactions/transfer/${fromAccountId}`, { toAccountNumber, amount, pin });
  return response.data;
};

export default function useTransferMoney() {
  return useMutation({
    mutationFn: transferMoney,
  });
} 