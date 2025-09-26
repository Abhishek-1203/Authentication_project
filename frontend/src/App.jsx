import './App.css'
import EmailVerification from './pages/EmailVerification'
import Home from './pages/Home'
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import PasswordReset from './pages/PasswordReset'
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/email-verify' element={<EmailVerification/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/password-reset' element= {<PasswordReset/>}/>
    </Routes>
     

    </>
  )
}

export default App
