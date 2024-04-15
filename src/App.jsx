import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import Profile from './pages/Profile'
import Deck from './pages/Deck'
import Users from './pages/Users'
import {  Routes, Route} from 'react-router-dom'

function App() {
  return (
    <>
      <div className="h-screen w-screen flex flex-col text-start items-start">
        <div className='h-9'>
          <NavBar />
        </div>
        <div className="flex-grow pt-5">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/Users" element={<Users />} />
            <Route exact path="/Profile" element={<Profile />} />
            <Route exact path="/Deck" element={<Deck />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
