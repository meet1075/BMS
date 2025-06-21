import Dashboard from './pages/Dashboard.jsx'
import {Routes, Route, useLocation} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Transaction from './pages/Transaction.jsx'
import Login from './pages/Login.jsx'
import AccountDetails from './pages/AccountDetails.jsx'
import AccountCreationModal from './components/AccountCreationModal.jsx'
import Profile from './pages/Profile.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
function App() {
  const location=useLocation() ;
  const hideNavBar=location.pathname === "/";
  return (
    <>
    {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          } />
        <Route path="/admin" element={
          <AdminProtectedRoute>
          <AdminDashboard />
          </AdminProtectedRoute>
          } />
        <Route path="/transaction" element={
          <ProtectedRoute>
          <Transaction />
          </ProtectedRoute>
          }/> 
        <Route path="/account-detail/:accountid" element={
          <ProtectedRoute>
          <AccountDetails />
          </ProtectedRoute>
          } />
        <Route path="/createaccount" element={
          <ProtectedRoute>
          <AccountCreationModal />
          </ProtectedRoute>
          } />
        <Route path="/profile" element={
          <ProtectedRoute>
          <Profile />
          </ProtectedRoute>
          } />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

      </Routes>  
    </>
  )
}

export default App
