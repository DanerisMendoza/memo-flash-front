import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import Profile from './pages/Profile'
import Deck from './pages/Deck'
import Users from './pages/Users'
import { Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import PublicRoutes from './utils/PublicRoutes'

function App() {
  return (
    <>
      <div className="h-screen w-screen flex flex-col text-start items-start">
        <div className='h-9'>
          <NavBar />
        </div>
        <div className="flex-grow pt-5">
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/Users" element={<Users />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Deck" element={<Deck />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
