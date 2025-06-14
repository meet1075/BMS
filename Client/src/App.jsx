import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Transaction from './pages/Transaction.jsx'
import { Link } from 'react-router-dom';



function App() {
  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />}/> 
      </Routes>  
    </>
  )
}

export default App
