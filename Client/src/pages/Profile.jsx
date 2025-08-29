import { FaArrowLeftLong } from "react-icons/fa6";
import { FaRegUserCircle  } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useUpdateUserDetails from "../hooks/updateUserDetails";
import { useUser } from "../context/UserContext";
import { useState } from "react";

function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [address, setAddress] = useState(user?.address || "");
    const [contact, setContact] = useState( user?.contact||"");
    const [msg, setMsg] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const updateUser = useUpdateUserDetails();

    const handleUpdate = async () => {
      setIsProcessing(true);
      setMsg("");
      try {
        const details = { email, address, contact };
        const res = await updateUser.mutateAsync(details);
        setMsg("Profile updated successfully!");
        // Optionally update user context
        if (res?.data) setUser(res.data);
        setTimeout(() => navigate('/dashboard'), 1200);
      } catch (err) {
        setMsg(err?.response?.data?.message || "Update failed");
      } finally {
        setIsProcessing(false);
      }
    };

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen'>
      <div >
        <div className="px-110 py-8">
        <div className="mt-20">
            <p className="text-blue-500 font-semibold flex gap-2 items-center" onClick={()=>navigate('/dashboard')}>< FaArrowLeftLong />Back to Dashboard</p>
            <div className="flex items-center gap-4 mt-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl w-14 h-14 p-3"><FaRegUserCircle  className="w-8 text-white  h-8"/></div>
                <div className="flex flex-col ">
                    <p className="text-3xl font-bold text-gray-900">{name}</p>
                    <p className="font-semibold text-gray-600 pl-1">{email}</p>
                </div>
            </div>
            <div className="mt-10 bg-white p-8 rounded-2xl shadow-md max-w-2xl">
  <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Profile</h2>

  {/* Personal Information */}
  <div>
    <p className="text-lg font-semibold text-gray-800 mb-3">Personal Information</p>
    <div className="mb-5">
      <label className="block mb-1 font-medium text-gray-700">Full Name</label>
      <div className="flex items-center border border-gray-200  rounded-lg px-3 py-2">
        <FaRegUser className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="User"
          className="w-full outline-none"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled
        />
      </div>
    </div>
    <div className="mb-5">
      <label className="block mb-1 font-medium text-gray-700">Email Address</label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
        <MdEmail className="text-gray-400 mr-2 " />
        <input
          type="email"
          placeholder="email"
          className="w-full outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled 
        />
      </div>
    </div>
    <div className="mb-5">
      <label className="block mb-1 font-medium text-gray-700">Address</label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
        <input
          type="text"
          placeholder="Address"
          className="w-full outline-none"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
    </div>
    <div className="mb-5">
      <label className="block mb-1 font-medium text-gray-700">Contact</label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
        <input
          type="number"
          placeholder="Contact"
          className="w-full outline-none"
          value={contact}
          onChange={e => setContact(e.target.value)}
        />
      </div>
    </div>
  </div>

  {/* Change Password */}
  <div className="mt-8">
    <p className="text-lg font-semibold text-gray-800 mb-3">Change Password</p>
    <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password</p>

    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">Current Password</label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
        
        <input
          type="password"
          placeholder="Enter current password"
          className="w-full outline-none"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">New Password</label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
        
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full outline-none"
        />
      </div>
    </div>

    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all" onClick={handleUpdate} disabled={isProcessing}>
      {isProcessing ? "Updating..." : "Update Profile"}
    </button>
    {msg && <div className={`mt-3 text-center rounded-lg p-2 ${msg.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{msg}</div>}
  </div>
</div>

        </div>
      </div>
      </div>
    </div>
  )
}

export default Profile