import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard } from 'react-icons/fi';
import { FaPiggyBank } from 'react-icons/fa';
import { useCreateAccount } from '../hooks/createAccount.js';
function AccountCreationModal() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const[msg,setMsg]=useState("");
  const { mutate: createAccount } = useCreateAccount();
  const handleCreate=()=>{
    if(!selectedType) return;
    createAccount(selectedType,{
      onSuccess:(data)=>{
        const {pin}=data.data;
        const mesg= setMsg(`Account created successfully! your PIN is ${pin}.`);
        setTimeout(() => {
          setMsg("");
        
        setSelectedType(null);
        navigate("/dashboard")
        }, 60000);
      },
      onError:(error)=>{
        const mesg=setMsg(`Failed to create account: ${error.response?.data?.message || error.message}`);
      }
    })
  }
  const handleClose = () => {
    navigate('/dashboard');
  };

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      <div 
        className="fixed inset-0  bg-opacity-10 backdrop-blur-sm"
        onClick={handleClose}
      />
     
      <div className="relative bg-blue-200 rounded-2xl border border-gray-200  p-8 w-full max-w-lg mx-4 shadow-xl flex flex-col items-stretch">
        {msg && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
            <p className="text-sm">{msg}</p>
          </div>
        )}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2">Create New Account</h2>
        <p className="text-gray-600 mb-6">Choose the type of account you'd like to create</p>
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setSelectedType('savings')}
            className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all duration-150 text-left ${selectedType === 'savings' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
          >
            <span className="text-3xl text-blue-600"><FiCreditCard /></span>
            <span>
              <span className="block font-semibold text-lg">Savings Account</span>
              <span className="block text-gray-500 text-sm">Perfect for saving money with competitive interest rates</span>
            </span>
          </button>
          <button
            onClick={() => setSelectedType('current')}
            className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all duration-150 text-left ${selectedType === 'current' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
          >
            <span className="text-3xl text-blue-600"><FaPiggyBank /></span>
            <span>
              <span className="block font-semibold text-lg">Current Account</span>
              <span className="block text-gray-500 text-sm">Ideal for daily transactions and business use</span>
            </span>
          </button>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2 rounded-lg border bg-white border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!selectedType}
            className={`flex-1 py-2 rounded-lg font-semibold text-white transition ${selectedType ? 'bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500' : 'bg-gradient-to-r from-blue-500 to-indigo-400 cursor-not-allowed'}`}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountCreationModal; 