import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Transaction from './pages/Transaction.jsx'


function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />}/> 
      </Routes>  
    </>
  )
}

export default App
