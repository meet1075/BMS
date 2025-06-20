import { FaArrowTrendUp } from "react-icons/fa6";
import { FiCreditCard } from "react-icons/fi";
import { RiAccountBox2Fill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiWallet  } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import fetchAccountsByUser from "../hooks/fetchAccountsByUser.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AccountContext } from "../context/AccountContext.jsx";
import { useContext, useEffect } from "react";
import Accounts from "../data/accounts.js"; 
import { useUser } from "../context/UserContext.jsx";
function Dashboard() {
  const { user } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['accounts', user?._id],
    queryFn: () => fetchAccountsByUser(user._id),
    enabled: !!user?._id, 
  });

  const accounts = data?.data?.accounts || [];

  let totalbalance = 0;
  accounts.forEach((account) => {
    totalbalance += account.balance;
  });
  let activateaccounts=0
  accounts.map((ac)=>{ac.status==="activate"?activateaccounts++:activateaccounts=activateaccounts}).length
  
  let primaryAccount=accounts.length==0?"No Account": accounts.find((ac)=>ac.isPrimary===true)?.accountNumber ;
  console.log("User in Dashboard:", user);
console.log("Fetched accounts:", accounts);

  const queryClient = useQueryClient();

  const refetchAccounts = () => {
    queryClient.invalidateQueries({ queryKey: ['accounts', user?._id] });
  };

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen'>
      <div className="px-35  py-8">
        <h1 className="font-bold text-3xl text-gray-900 pt-16 mb-2">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Manage your accounts and transactions securely</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-35 py-8 ">
        <div  className=" bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm rounded-2xl p-6 flex items-center  justify-between">
          <div>
            <p className="text-blue-100 font-semibold">Total Balance</p>
            <p className="text-2xl font-bold text-white">Rs {totalbalance}/-</p>
          </div>
          <div className="text-blue-100 font-semibold text-3xl">
            <FaArrowTrendUp />
          </div>
        </div>
        <div  className="bg-white rounded-2xl p-6 flex items-center border border-gray-200 justify-between">
          <div>
            <p className="text-gray-600 font-semibold">Active Accounts</p>
            <p className="text-2xl font-bold text-gray-900">{activateaccounts}</p>
          </div>
          <div className="text-gray-600 font-semibold text-3xl">
            <FiCreditCard />
          </div>
        </div>
        <div  className="bg-white  rounded-2xl p-6 flex items-center border border-gray-200 justify-between">
          <div>
            <p className="text-gray-600 font-semibold">Primary Account</p>
            <p className="text-2xl font-bold text-gray-900">{primaryAccount}</p>
          </div>
          <div className="text-gray-600 font-semibold text-3xl">
            <RiAccountBox2Fill />
          </div>
        </div>
      </div>
      {accounts.length>0?
      <div>
        <div className="flex justify-between items-center py-4 px-35 ">
          <div className="text-gray-900 font-bold text-2xl">
            Your Accounts
          </div>
          <div  className=" text-white cursor-pointer hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-800  transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-semibold py-2 px-4 text-center">
            <Link to="/createaccount">
              <button className="flex items-center gap-3 cursor-pointer"><FiPlus className="text-xl"/> Add Account</button>
            </Link>
          </div>
        </div>

        <div className="px-35 py-4">
            {accounts.map((ac,index)=>(

          <div key={ac._id||index} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg mb-5">
          <div className="flex justify-between items-center px-6 py-3">
            <div  className="flex items-center gap-4">
              <div>
                {ac.accountType === "savings" ? (
                  <FiCreditCard className="rounded-xl p-2 bg-gradient-to-r from-blue-600 to-indigo-600 h-[40px] w-[45px] text-white" />
                ) : (
                  <PiWallet  className="rounded-xl p-2 bg-gradient-to-r from-blue-600 to-indigo-600 h-[40px] w-[45px] font-bold text-white" />
                )}
              </div>

              <div>
                <p className="text-gray-900 font-semibold text-lg">{ac.accountType}</p>
                <p className="text-gray-500">{ac.accountNumber}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="font-medium text-[12px] text-green-600 rounded-full bg-green-200 px-2 py-1">{ac.status}</p>
              <p className="font-medium rounded-full text-[12px] bg-yellow-100 text-amber-800 px-2 py-1">{ac.isPrimary===true?"Primary":"not Primary"}</p>
            </div>
          </div>
          <div className="flex justify-between items-center px-6 py-3 ">
            <div>
              <p className="flex items-center gap-2 text-gray-900 font-bold text-2xl">Rs {ac.balance}/- <AiOutlineEye className="text-xl text-gray-500"/></p>
            </div>
            <Link to={`/account-detail/${ac._id}`} key={ac._id}>
              <button className="flex items-center text-blue-600 hover:text-blue-700 transition-all duration-200 cursor-pointer font-semibold gap-2">
                View Details <FaArrowRightLong className="mt-1" />
              </button>
            </Link>

          </div>
          {/* <div>
            <div className="justify-between items-center px-6 py-3">
              <p className="text-gray-500">PIN: {ac.pin}</p>
            </div>
          </div> */}
          
          </div>
          ))}
        </div>
      </div>
      :
      <div className="px-35 py-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200  p-8">
          < FiCreditCard  className="text-gray-300 h-[100px] w-[50px] -mt-6"/>
          <p className="font-semibold text-xl text-gray-800">No accounts yet</p>
          <p className="text-gray-600 py-3">Create your first account to get started with banking</p>
          <Link to="/createaccount">
            <button className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg px-6 py-3 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 mt-2">Create Account</button>
          </Link>
        </div>
      </div>
}
   </div>
        
  )
}

export default Dashboard
