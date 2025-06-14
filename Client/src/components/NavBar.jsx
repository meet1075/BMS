import { FiCreditCard } from "react-icons/fi";

function NavBar() {
  return (
    <div>
      <div className="bg-white flex justify-between items-center px-35 h-[60px] sticky shadow-sm">
        <div className="text-blue-600 font-bold text-xl flex items-center cursor-pointer gap-2"><FiCreditCard className=" rounded-xl p-2 bg-blue-600 h-[40px] w-[45px]  text-white "/> SecureBank</div>
        <div className="flex flex-row gap-4 ">
            <div className="font-medium text-gray-700 flex items-center gap-2 cursor-pointer"><FiCreditCard className="h-5 w-6 items-center mt-1"/> Dashboard</div>
            <div className="font-medium text-gray-700 items-center justify-center cursor-pointer p-2">Transactions</div>
            <div className="font-semibold text-gray-800 rounded-full w-25 h-10 bg-[#F3F4F6] hover:bg-[#e2e2ea] items-center cursor-pointer justify-center p-2 px-[13px]">John Doe</div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
