import { FiCreditCard } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";
import { MdArrowOutward, MdEmail } from "react-icons/md";
import { RiAccountCircleFill } from "react-icons/ri";
import { HiOutlineHashtag } from "react-icons/hi";
import { useParams } from "react-router-dom";
import React, { useContext, useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import fetchAccountDetails from "../hooks/fetchAccountDetails.js";
import { useQuery } from "@tanstack/react-query";

function AccountDetails() {
  const { user } = useUser();
  const { accountid } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["accountDetails", accountid],
    queryFn: () => fetchAccountDetails(accountid),
    enabled: !!accountid,
  });

  const account = data?.data?.account || {};
  const checkPrimary = account.isPrimary ? "Yes" : "No";
  const accountType = account.accountType === "savings" ? "Savings" : "Current";

  const [activeModal, setActiveModal] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  

  const handleTransaction = async (type) => {
    setIsProcessing(true);
    try {
      if (!amount || (type === "transfer" && !recipientAccount)) return;
      await new Promise((res) => setTimeout(res, 1000));
      alert(`${type} of Rs ${amount} ${type === 'transfer' ? `to ${recipientAccount}` : ''} done successfully!`);
      setActiveModal(null);
      setAmount("");
      setRecipientAccount("");
    } catch (err) {
      alert("Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen">
      <div>
        <div className="px-80 py-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm rounded-2xl p-6 mt-20">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <FiCreditCard className="rounded-xl p-2 bg-white/30 shadow-blur-sm h-[50px] w-[55px] text-white" />
                <div>
                  <h1 className="text-white text-2xl font-bold capitalize">{account.accountType}</h1>
                  <p className="text-blue-50">Account Number: {account.accountNumber}</p>
                </div>
              </div>
              <div>
                <p className="flex justify-center items-center gap-2 text-white text-3xl font-bold">
                  Rs {account.balance}/- <AiOutlineEye />
                </p>
                <p className="text-blue-100">Available Balance</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 px-6 py-3 gap-6">
                <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 flex items-center justify-between cursor-pointer" onClick={() => setActiveModal("deposit")}> 
                  <div>
                    <p className="text-white text-xl font-bold">Deposit</p>
                    <p className="text-2xl font-bold text-gray-800 pt-3">
                      <IoMdArrowRoundUp className="text-green-700 rounded-lg bg-green-200 w-7 h-7" />
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 flex items-center justify-between cursor-pointer" onClick={() => setActiveModal("withdraw")}> 
                  <div>
                    <p className="text-white text-xl font-bold">Withdraw</p>
                    <p className="text-2xl font-bold text-gray-800 pt-3">
                      <IoMdArrowRoundDown className="text-red-700 rounded-lg bg-red-200 w-7 h-7" />
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 flex items-center justify-between cursor-pointer" onClick={() => setActiveModal("transfer")}> 
                  <div>
                    <p className="text-white text-xl font-bold">Transfer</p>
                    <p className="text-2xl font-extrabold text-gray-800 pt-3">
                      <MdArrowOutward className="text-blue-700 rounded-lg bg-blue-200 w-7 h-7" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-80 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h1 className="text-gray-900 font-bold text-xl px-2">Account Information</h1>
              <div>
                <div className="flex gap-6 py-3 px-4">
                  <RiAccountCircleFill className="w-6 h-6 pt-3" />
                  <div>
                    <p className="text-gray-600">Account Holder</p>
                    <p className="text-gray-900 font-semibold">{user?.name}</p>
                  </div>
                </div>
                <div className="flex gap-6 py-3 px-4">
                  <MdEmail className="w-6 h-6 pt-3" />
                  <div>
                    <p className="text-gray-600">Email Address</p>
                    <p className="text-gray-900 font-semibold">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-6 py-3 px-4">
                  <HiOutlineHashtag className="w-6 h-6 pt-3" />
                  <div>
                    <p className="text-gray-600">Account Number</p>
                    <p className="text-gray-900 font-semibold">{account.accountNumber}</p>
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
                  <p className="text-gray-900 font-semibold">{new Date(account.createdAt).toLocaleDateString()}</p>
                </div>
                {/* <div className="flex justify-between items-center py-3 px-4">
                  <p className="text-gray-600">Total Transactions</p>
                  <p className="text-gray-900 font-semibold">{Transactions.length}</p>
                </div> */}
                <div className="flex justify-between items-center py-3 px-4">
                  <p className="text-gray-600">Available Balance</p>
                  <p className="text-green-600 text-lg font-bold">Rs {account.balance}/-</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{activeModal} Money</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                 
                  
                </div>

                {activeModal === "transfer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Account Number</label>
                    <input
                      type="text"
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter account number"
                    />
                  </div>
                )}
                 <div className="relative mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pin</label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your pin"
                        />
                  </div> 
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleTransaction(activeModal)}
                    disabled={isProcessing || !amount || (activeModal === "transfer" && !recipientAccount)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Processing..." : `${activeModal} Money`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountDetails;
