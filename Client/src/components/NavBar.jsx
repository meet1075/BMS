import { FiCreditCard } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="bg-white flex justify-between items-center px-35 w-full h-[60px] fixed shadow-sm">
        <div className="text-blue-600 font-bold text-xl flex items-center cursor-pointer gap-2"><BsBank className=" rounded-xl p-2 bg-gradient-to-r from-blue-500 to-indigo-700 h-[40px] w-[45px]  text-white "/> SecureBank</div>
        <div className="flex flex-row gap-4 ">
            <button className="font-medium text-gray-700 flex items-center gap-2 cursor-pointer"onClick={()=>{navigate('/dashboard')}}><FiCreditCard className="h-5 w-6 items-center mt-1"/> Dashboard</button>
            <button className="font-medium text-gray-700 items-center justify-center cursor-pointer p-2" onClick={()=>{navigate('/transaction')}}>Transactions</button>
            <button className="font-semibold text-gray-800 rounded-full w-25 h-10 bg-[#F3F4F6] hover:bg-[#e2e2ea] items-center cursor-pointer justify-center p-2 px-[13px]">John Doe</button>
        </div>
      </div>
    </div>
  )
}

export default NavBar
