import { LuFilter } from "react-icons/lu";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import { useState } from "react";
function Transaction() {
   const [showFilter, setShowFilter] = useState(false);
   
   
const transactions = [
  {
    id: 1,
    type: 'Deposit',
    amount: 10,
    date: 'Jun 14, 2025, 01:31 AM',
    status: 'completed',
    direction: 'up',
  },
  {
    id: 2,
    type: 'Withdraw',
    amount: 10,
    date: 'Jun 14, 2025, 01:31 AM',
    status: 'completed',
    direction: 'down',
  },
  {
    id: 3,
    type: 'Deposit',
    amount: 10,
    date: 'Jun 14, 2025, 01:31 AM',
    status: 'completed',
    direction: 'up',
  },
  {
    id: 4,
    type: 'transfer',
    amount: 10,
    date: 'Jun 14, 2025, 01:31 AM',
    status: 'completed',
    direction: 'up',
  },
];
const [filterType, setFilterType] = useState("All Types");

const filteredTransactions =
  filterType === "All Types"
    ? transactions
    : transactions.filter(
        (tx) => tx.type.toLowerCase() === filterType.toLowerCase()
      );

const depositCount=transactions.filter((tx)=>tx.type.toLowerCase() === 'deposit').length;
const withdrawCount=transactions.filter((tx)=>tx.type.toLowerCase() === 'withdraw').length;
const transferCount=transactions.filter((tx)=>tx.type.toLowerCase() === 'transfer').length;


  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen'>
      <div className="px-50 py-8 flex justify-between items-center">
        <div>
        <h1 className="font-bold text-3xl text-gray-900 pt-16 mb-2">Transaction History</h1>
        <p className="text-gray-600">View and manage all your transactions</p>
        </div>
        <div className="pt-15 ">
          <button onClick={() => setShowFilter((prev) => !prev)}  className="flex items-center gap-2 text-gray-600 border border-gray-200 font-semibold hover:bg-gray-50 py-2 px-3 rounded-lg bg-white transition-all duration-200"  ><LuFilter className="font-semibold"/> Filters</button>
        </div>
      </div>
      <div className="px-50 py-4 gap-6">
       
      {showFilter && (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <p className="text-lg font-semibold mb-4">Filter Transactions</p>

    <div className="grid grid-cols-2 gap-6">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
        <select className="w-full border border-gray-300 rounded-md px-3 py-2  ">
          <option>All Accounts</option>
          <option>savings - 9652972438</option>
          <option>savings - 3176817090</option>
        </select>
      </div>

      {/* Transaction Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 "   value={filterType}
  onChange={(e) => setFilterType(e.target.value)}>
          <option>All Types</option>
          <option>Deposit</option>
          <option>Withdraw</option>
          <option>Transfer</option>
        </select>
      </div>
    </div>
  </div>)}
</div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-50 py-4 ">
          <div  className=" bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm rounded-2xl p-6 flex items-center  justify-between">
            <div>
              <p className="text-blue-100 font-semibold">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{transactions.length}</p>
            </div>
          </div>
          <div  className="bg-white rounded-2xl p-6 flex items-center border border-gray-200 justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Deposits</p>
              <p className="text-2xl font-bold text-green-600">{depositCount}</p>
            </div>
          </div>
          <div  className="bg-white rounded-2xl p-6 flex items-center border border-gray-200 justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Withdrawals</p>
              <p className="text-2xl font-bold text-red-600">{withdrawCount}</p>
            </div>
          </div>
          <div className="bg-white  rounded-2xl p-6 flex items-center border border-gray-200 justify-between">
            <div>
              <p className="text-gray-600 font-semibold">Transfers</p>
              <p className="text-2xl font-bold text-blue-600">{transferCount}</p>
            </div>
          </div>
        </div>
      </div>
        {/* <div className="px-50 py-4">
          <div className=" bg-white rounded-xl border border-gray-200">
            <div>
            <p className="text-xl font-bold text-gray-800 p-6">3 Transactions</p>
            </div>
            <p className=" bg-white rounded-xl border border-gray-200"></p>
            <div  className="flex justify-between items-center px-6 py-3">
            <div  className="flex items-center gap-4">
            <div><IoMdArrowRoundUp  /></div>
            <div>
              <p className="text-md font-semibold text-gray-700">Deposit of 10</p>
              <div className="flex gap-3">
              <p className="">Jun 14, 2025, 01:31 AM</p>
              <p className="font-semibold">Deposit</p>
              <p className="py-1 bg-green-200 text-[11px] text-center items-center justify-center text-green-700 rounded-full px-3">completed</p>
              </div>
            </div>
            </div>
            <div>
              <p className="flex items-center gap-1 text-green-600 font-bold text-md"><FiPlus className="text-sm font-bold"/> Rs 10.00/-</p>
              <p className="text-[14px] text-gray-500 pt-2">Savings Account</p>
            </div>
          </div>
            <p className=" bg-white rounded-xl border border-gray-200"></p>
            <div  className="flex justify-between items-center px-6 py-3">
            <div  className="flex items-center gap-4">
            <div><IoMdArrowRoundDown /></div>
            <div>
              <p className="text-md font-semibold text-gray-700">withdraw of 10</p>
              <div className="flex gap-3">
              <p className="">Jun 14, 2025, 01:31 AM</p>
              <p className="font-semibold">Withdraw</p>
              <p className="py-1 bg-green-200 text-[11px] text-center items-center justify-center text-green-700 rounded-full px-3">completed</p>
              </div>
            </div>
            </div>
            <div>
              <p className="flex items-center gap-1 text-red-600 font-bold text-md"><FiMinus className="text-sm font-bold"/> Rs 10.00/-</p>
              <p className="text-[14px] text-gray-500 pt-2">Savings Account</p>
            </div>
          </div>
          <p className=" bg-white rounded-xl border border-gray-200"></p>
          </div>
        </div> */}
        
        <div className="px-50 py-4">
  <div className="bg-white rounded-xl border border-gray-200">
    <p className="text-xl font-bold text-gray-800 p-6">
      {filteredTransactions.length} Transactions
    </p>
    <hr className="border-t border-gray-200 mx-6" />

    
    {filteredTransactions.map((tx, index) => (
      <div key={tx.id || index}>
        {index !== 0 && <hr className="border-t border-gray-200 mx-6" />}
        <div className="flex justify-between items-center px-6 py-3">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <div className="text-xl">
              {tx.type.toLowerCase() === 'transfer' ? (
                <MdArrowOutward />
              ) : tx.type.toLowerCase() === 'deposit' ? (
                <IoMdArrowRoundUp />
              ) : (
                <IoMdArrowRoundDown />
              )}
            </div>
            <div>
              <p className="text-md font-semibold text-gray-700">
                {tx.type} of {tx.amount}
              </p>
              <div className="flex gap-3 text-sm text-gray-600">
                <p>{tx.date}</p>
                <p className="font-semibold capitalize">{tx.type}</p>
                <p className="py-1 bg-green-200 text-[11px] text-center items-center justify-center text-green-700 rounded-full px-3">
                  {tx.status}
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div>
            <p
              className={`flex items-center gap-1 font-bold text-md ${
                tx.type.toLowerCase() === 'withdraw'
                  ? 'text-red-600'
                  : tx.type.toLowerCase() === 'transfer'
                  ? 'text-blue-600'
                  : 'text-green-600'
              }`}
            >
              {tx.type.toLowerCase() === 'withdraw' ? (
                <FiMinus />
              ) : tx.type.toLowerCase() === 'transfer' ? (
                < FiMinus/>
              ) : (
                <FiPlus />
              )} Rs {tx.amount}.00/-
            </p>
            <p className="text-[14px] text-gray-500 pt-2">Savings Account</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
  )
}

export default Transaction

