import Dashboard from './pages/Dashboard.jsx'
import {Routes, Route, useLocation} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Transaction from './pages/Transaction.jsx'
import Login from './pages/Login.jsx'
import AccountDetails from './pages/AccountDetails.jsx'
import AccountCreationModal from './components/AccountCreationModal.jsx'

function App() {
  const location=useLocation() ;
  const hideNavBar=location.pathname === "/";
  return (
    <>
    {!hideNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />}/> 
        <Route path="/account-detail/:id" element={<AccountDetails />} />
        <Route path="/createaccount" element={<AccountCreationModal />} />
      </Routes>  
    </>
  )
}

export default App
