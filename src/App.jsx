import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Inventory from './pages/Inventory'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="h-screen w-screen flex flex-col text-start items-start">
        <div className='h-9'>
          <NavBar />
        </div>
        <div className="flex-grow pt-5">
          {/* <RouterProvider router={router} /> */}
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/Dashboard" element={<Dashboard />} />
            <Route exact path="/Users" element={<Users />} />
            <Route exact path="/Profile" element={<Profile />} />
            <Route exact path="/Orders" element={<Orders />} />
            <Route exact path="/Inventory" element={<Inventory />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
