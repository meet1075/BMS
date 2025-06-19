import { FiCreditCard } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { MdArrowOutward , MdEmail} from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { HiOutlineHashtag } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";
import React, { useContext } from 'react';
import { useUser } from "../context/UserContext.jsx";
import { useState } from "react";
function AccountDetails() {
    const { user } = useUser();
    const {id}=useParams();
    const {accounts, transactions} = useContext(AccountContext);
    const account = accounts.find((ac)=> ac.id === parseInt(id));
    const transaction = transactions.filter((tx) => tx.AccountNumber === account.number);
let checkPrimary= account.isPrimary ? "Yes" : "No";   
let accountType=account.type === "Savings Account" ? "Savings" : "Current";
    
  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen'>
      <div >
        <div className="px-80  py-8">
            <div className='bg-gradient-to-r from-blue-500  to-indigo-600 shadow-sm rounded-2xl p-6 mt-20 '>
                <div className="flex items-center justify-between px-6">
                <div className='flex items-center gap-4'>
                    <div><FiCreditCard className="rounded-xl p-2 bg-white/30 shadow-blur-sm h-[50px] w-[55px] text-white" /></div>
                    <div>
                        <h1 className='text-white text-2xl font-bold capitalize'>{ account.type}</h1>
                        <p className='text-blue-50'>Account Number:{account.number}</p>
                    </div>
                </div>
                <div>
                    <p className="flex justify-center items-center gap-2 text-white text-3xl font-bold">Rs {account.balance}/- <AiOutlineEye /></p>
                    <p className="text-blue-100">Available Balance</p>
                </div> 
                </div>
                <div  className='mt-3'>
                    <div className=" grid grid-cols-1 md:grid-cols-3 px-6 py-3 gap-6">
                        <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 flex  items-center justify-between">
                            <div className=" justify-center items-center gap-4">
                                <p className="text-white text-xl font-bold">Deposit</p>
                                <p className="text-2xl font-bold text-gray-800 pt-3 "><IoMdArrowRoundUp className="text-green-700 rounded-lg bg-green-200 w-7 h-7 "/></p>
                            </div>
                        </div>
                        <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 flex  items-center justify-between">
                            <div>
                                <p className="text-white text-xl font-bold">Withdraw</p>
                                <p className="text-2xl font-bold text-gray-800 pt-3"><IoMdArrowRoundDown className=" text-red-700 rounded-lg bg-red-200 w-7 h-7 "/></p>
                            </div>
                        </div>
                        <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 flex  items-center justify-between">
                            <div>
                                <p className="text-white text-xl font-bold">Transfer</p>
                                <p className="text-2xl font-extrabold text-gray-800 pt-3"><MdArrowOutward className="text-blue-700 rounded-lg bg-blue-200 w-7 h-7 "/></p>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
        <div  className="px-80 py-8">
            <div  className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h1 className="text-gray-900 font-bold text-xl px-2">Account Information</h1>
                       <div>
                        <div className="flex gap-6 py-3 px-4">
                            <p className="pt-3"><RiAccountCircleFill className="w-6 h-6"/></p>
                            <div className="flex flex-col">
                                <p className="text-gray-600">Account Holder</p>
                                <p className="text-gray-900 font-semibold">{ user?.name}</p>
                            </div>
                        </div>
                        <div className="flex gap-6 py-3 px-4">
                            <p className="pt-3"><MdEmail className="w-6 h-6"/></p>
                            <div>
                                <p className="text-gray-600">Email Address</p>
                                <p className="text-gray-900 font-semibold">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-6 py-3 px-4">
                            <p className="pt-3"><HiOutlineHashtag className="w-6 h-6"/></p>
                            <div>
                                <p className="text-gray-600">Account Number</p>
                                <p className="text-gray-900 font-semibold">{account.number}</p>
                            </div>
                        </div>
                             <hr className="border-t border-gray-200 mx-6" />
                             <div className="px-4 py-3">
                               <div className="flex justify-between items-center py-2">
                                <p className="text-gray-600">Account Status</p>
                                <p className="font-medium text-[12px] text-green-600 rounded-full bg-green-200 px-2 py-1">{account.status}</p>
                               </div>
                               <div className="flex justify-between items-center">
                                <p className="text-gray-800">Primary Account</p>
                                <p className="font-medium rounded-full text-[12px] bg-yellow-100 text-amber-800 px-3 py-1">{checkPrimary}</p>
                               </div>
                             </div>
                       </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h1 className="text-gray-900 font-bold text-xl px-2">Account Summary</h1>
                     <div>
                        <div className="flex justify-between items-center py-3 px-4">
                            <p className="text-gray-600">Account Type</p>
                            <p className="text-gray-900 font-semibold">{accountType}</p>
                        </div>
                        <div className="flex justify-between items-center py-3 px-4">
                            <p className="text-gray-600">Created Date</p>
                            <p className="text-gray-900 font-semibold">{account.createdAt}</p>
                        </div>
                        <div  className="flex justify-between items-center py-3 px-4">
                            <p className="text-gray-600">Total Transactions</p>
                            <p className="text-gray-900 font-semibold">{transaction.length}</p>
                        </div>
                        <div  className="flex justify-between items-center py-3 px-4">
                            <p className="text-gray-600">Available Balance</p>
                            <p className="text-green-600 text-lg font-bold">Rs {account.balance}/-</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default AccountDetails
