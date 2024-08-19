
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Navbar'
import Products from './pages/Products'
import Add from './pages/Add'
import Footer from './components/Footer'
import Update from './pages/Update'
// import Logout from './pages/Logout'
import Profile from './pages/Profile'
import Signup from './pages/Signup'
import PrivateComponent from './pages/PrivateComponent'
import Login from "./pages/Login"
function App() {

  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path='/' element={<Products />} />
            <Route path='/add' element={<Add />} />
            <Route path='/update/:id' element={<Update />} />
            {/* <Route path='/logout' element={<Logout />} /> */}
            <Route path='/profile' element={<Profile />} />

          </Route>
            <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

        </Routes>
        <Footer />
      </BrowserRouter>


    </>
  )
}

export default App
