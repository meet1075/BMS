import { useState, useRef, useEffect } from "react";
import { FiCreditCard, FiSettings, FiLogOut } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import userLogout from "../hooks/userLogout.js";
function NavBar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {mutate: logoutUser} = userLogout();
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { user, logoutAndClearUser } = useUser();
  let userRole=user?.role
  {user?.name, userRole }

  const handleLogout=()=>{
    logoutUser({},{
      onSuccess:()=>{
        logoutAndClearUser();
        navigate("/");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.")
      }
    })
  }

  return (
    <div className="relative">
      <div className="bg-white flex justify-between items-center px-35 w-full h-[60px] fixed shadow-sm z-50">
        <div
          className="text-blue-600 font-bold text-xl flex items-center cursor-pointer gap-2"onClick={() => navigate("/dashboard")}>
          <BsBank className="rounded-xl p-2 bg-gradient-to-r from-blue-500 to-indigo-700 h-[40px] w-[45px] text-white" />SecureBank
        </div>
        <div className="flex flex-row gap-4 items-center relative" ref={dropdownRef}>
          {userRole === "admin" ? (
            <button
              className="hover:text-blue-700 font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              Admin Dashboard
            </button>
          ) : (
            <>
              <button
                className="hover:text-blue-700 font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <button
                className="hover:text-blue-700 font-medium text-gray-700 cursor-pointer p-2"
                onClick={() => navigate("/transaction")}
              >
                Transactions
              </button>
            </>
          )}
          <button onClick={() => setDropdownOpen(!dropdownOpen)}className="font-semibold text-gray-800 rounded-full w-25 h-10 bg-[#F3F4F6] hover:bg-[#e2e2ea] px-[13px]">
            {user?.name}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-[60px] w-48 bg-white  rounded-xl shadow-md py-2 z-50">
              <button onClick={() => {
                  navigate("/profile");
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"><FiSettings /> Profile Settings
              </button>
              <button onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 flex items-center gap-2">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
