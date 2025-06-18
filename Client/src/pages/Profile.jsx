import { FaArrowLeftLong } from "react-icons/fa6";
import { FaRegUserCircle  } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function Profile() {
    const handleUpdate = () => {
    alert('Profile Updated');         
    navigate('/dashboard');            
  };
    const navigate = useNavigate();
  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-indigo-50 md:min-h-screen min-h-screen'>
      <div >
        <div className="px-110 py-8">
        <div className="mt-20">
            <p className="text-blue-500 font-semibold flex gap-2 items-center" onClick={()=>navigate('/dashboard')}>< FaArrowLeftLong />Back to Dashboard</p>
            <div className="flex items-center gap-4 mt-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl w-14 h-14 p-3"><FaRegUserCircle  className="w-8 text-white  h-8"/></div>
                <div className="flex flex-col ">
                    <p className="text-3xl font-bold text-gray-900">User</p>
                    <p className="font-semibold text-gray-600 pl-1">user@gmail.com</p>
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

    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all" onClick={handleUpdate}>
      Update Profile
    </button>
  </div>
</div>

        </div>
      </div>
      </div>
    </div>
  )
}

export default Profile
