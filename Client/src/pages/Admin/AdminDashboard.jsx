import { LuUsers } from "react-icons/lu";
import { LuCreditCard } from "react-icons/lu";
import { GrTransaction } from "react-icons/gr";
import { FaUserLarge } from "react-icons/fa6";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../context/UserContext.jsx";
import fetchAllUser from "../../hooks/fetchAllUser.js";
import fetchAllAccounts from "../../hooks/fetchAllAccounts.js";
import fetchAllTransactions from "../../hooks/fetchAllTransactions.js";
import React, { useState } from 'react';

function AdminDashboard() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  // Fetch all users
  const {data: usersData, isLoading: usersLoading, error: usersError}=useQuery({
    queryKey: ['users'],
    queryFn: fetchAllUser,
    enabled: !!user?._id && user?.role === 'admin',
    onSuccess: (data) => {
      console.log('Admin Dashboard - Users data:', data);
    },
    onError: (error) => {
      console.error('Admin Dashboard - Error fetching users:', error);
    }
  })

  // Fetch all accounts
  const {data: accountsData, isLoading: accountsLoading, error: accountsError}=useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAllAccounts,
    enabled: !!user?._id && user?.role === 'admin',
    onSuccess: (data) => {
      console.log('Admin Dashboard - Accounts data:', data);
    },
    onError: (error) => {
      console.error('Admin Dashboard - Error fetching accounts:', error);
    }
  })

  // Fetch all transactions
  const {data: transactionsData, isLoading: transactionsLoading, error: transactionsError}=useQuery({
    queryKey: ['transactions'],
    queryFn: fetchAllTransactions,
    enabled: !!user?._id && user?.role === 'admin',
    onSuccess: (data) => {
      console.log('Admin Dashboard - Transactions data:', data);
    },
    onError: (error) => {
      console.error('Admin Dashboard - Error fetching transactions:', error);
    }
  })

  const users = usersData?.data || [];
  const accounts = accountsData?.data?.accounts || [];
  const transactions = transactionsData?.data?.transactions || [];
  
  console.log('Admin Dashboard - Current user:', user);
  console.log('Admin Dashboard - Users array:', users);
  console.log('Admin Dashboard - Accounts array:', accounts);
  console.log('Admin Dashboard - Transactions array:', transactions);

  const [isUser, setIsUser] = useState(true);
  const [isAccounts, setIsAccounts] = useState(false);
  const [isTransactions, setIsTransactions] = useState(false);
  const [filterType, setFilterType] = useState("All Types");

  // Filter transactions based on type
  const filteredTransactions = filterType === "All Types" 
    ? transactions 
    : transactions.filter(transaction => transaction.type === filterType.toLowerCase());

  if (usersLoading || accountsLoading || transactionsLoading) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen flex items-center justify-center'>
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (usersError || accountsError || transactionsError) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen flex items-center justify-center'>
        <div className="text-xl font-semibold text-red-600">
          Error loading data: {usersError?.message || accountsError?.message || transactionsError?.message}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen'>
      <div className="px-35  py-8">
        <h1 className="font-bold text-3xl  text-gray-900 pt-16 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, accounts, and monitor system activity</p>
        <div className='flex gap-10  pt-10 transition-all duration-300'>
            <p className={`flex font-semibold text-gray-600 rounded-xl p-2 items-center cursor-pointer gap-2 transition-all duration-300 ${isUser ? "bg-blue-200 text-black"  : "text-gray-900"}`
            } 
            onClick={() => {
              setIsUser(true);
              setIsAccounts(false);
              setIsTransactions(false);
            }}
            ><LuUsers /> Users</p>
            <p className={`flex font-semibold text-gray-600 rounded-xl p-2 items-center cursor-pointer transition-all duration-300 gap-2 ${isAccounts ? "bg-blue-200 text-black" : "text-gray-900 "}`}
            onClick={() => {
              setIsUser(false);
              setIsAccounts(true);
              setIsTransactions(false);
            }}
            ><LuCreditCard/>Accounts</p>
            <p className={`flex font-semibold text-gray-600 rounded-xl p-2 items-center cursor-pointer transition-all duration-300 gap-2 ${isTransactions ? "bg-blue-200 text-black" : "text-gray-900 "}`}
            onClick={() => {
              setIsUser(false);
              setIsAccounts(false);
              setIsTransactions(true);
            }}
            ><GrTransaction/>Transactions</p>
        </div>
        {
          isUser&&(
            <div className='mt-10 bg-white rounded-xl border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold  text-gray-800'>User Management</h2>
              <hr className="border-t border-gray-200  mt-4"/> 
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No users found</div>
              ) : (
                <div className="space-y-4 mt-6">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className=" bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                          <FaUserLarge className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-xl text-gray-900">{user.name}</p>
                          <p className="font-semibold text-gray-500">Role: {user.role}</p>
                          <p className="font-semibold text-gray-500">
                            {user.primaryAccount 
                              ? `Primary Account: ${user.primaryAccount.accountNumber}` 
                              : user.accounts && user.accounts.length > 0 
                                ? `Account: ${user.accounts[0].accountNumber}` 
                                : 'No accounts'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-900 font-semibold">Total Accounts: {user.totalAccounts || 0}</p>
                        <div className={`font-medium text-[12px] rounded-full px-2 py-1  ${
                          user.isActive 
                            ? 'bg-green-200 text-green-600' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }
        {
          isAccounts&&(
            <div className='mt-10 bg-white rounded-xl border border-gray-200 p-6'>
              <h2 className='text-2xl font-bold  text-gray-800'>Account Management</h2>
              <hr className="border-t border-gray-200  mt-4"/> 
              {accounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No accounts found</div>
              ) : (
                <div className="space-y-4 mt-6">
                  {accounts.map((account) => (
                    <div key={account._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className=" bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                          <LuCreditCard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-xl text-gray-900">{account.accountType} Account</p>
                          <p className="text-sm text-gray-500">Account Number: {account.accountNumber}</p>
                          <p className="text-sm text-gray-500">Created: {new Date(account.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center  gap-4">
                        <p className="text-xl text-gray-900 px-5 font-semibold">₹{account.balance}</p>
                        
                        <div className="flex gap-2">
                          <p className={`font-medium text-[12px] rounded-full px-2 py-1 ${
                            account.status === 'activate' 
                              ? 'text-green-600 bg-green-200' 
                              : 'text-red-600 bg-red-200'
                          }`}>
                            {account.status}
                          </p>
                          {account.isPrimary && (
                            <p className="font-medium text-[12px] text-amber-800 rounded-full bg-yellow-100 px-2 py-1">Primary</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }
        {
          isTransactions&&(
            <div className='mt-10 bg-white rounded-xl border border-gray-200 px-6 py-6'>
              <div className="flex items-center justify-between pr-4">
                <h2 className='text-2xl font-bold  text-gray-800'>Transaction Management</h2>
                <select 
                  className="border border-gray-300 rounded-md px-3 py-2" 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Deposit</option>
                  <option>Withdraw</option>
                  <option>Transfer</option>
                </select>
              </div>
              <hr className="border-t border-gray-200  mt-6"/> 
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No transactions found</div>
              ) : (
                <div className="space-y-4 mt-6">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                          <GrTransaction className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-xl text-gray-900">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.userId?.name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()} at {new Date(transaction.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {transaction.transactionId}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-xl text-gray-900 font-semibold">₹{transaction.amount}</p>
                        <p className={`font-medium text-[12px] rounded-full px-2 py-1 ${
                          transaction.status === 'successful' 
                            ? 'text-green-600 bg-green-200' 
                            : 'text-red-600 bg-red-200'
                        }`}>
                          {transaction.status}
                        </p>
                        <div className="flex items-center gap-2 text-md text-gray-500 font-semibold">
                          {transaction.type === 'transfer' && (
                            <>
                              <span>{transaction.fromAccountId?.accountNumber}</span>
                              <span>→</span>
                              <span>{transaction.toAccountId?.accountNumber}</span>
                            </>
                          )}
                          {transaction.type === 'deposit' && (
                            <>
                              {/* <span className="opacity-50">—</span> */}
                              <span>→</span>
                              <span>{transaction.toAccountId?.accountNumber}</span>
                            </>
                          )}
                          {transaction.type === 'withdraw' && (
                            <>
                              <span>{transaction.fromAccountId?.accountNumber}</span>
                              <span>→</span>
                              {/* <span className="opacity-50">—</span> */}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }
      </div>
    </div>

  )
}

export default AdminDashboard
