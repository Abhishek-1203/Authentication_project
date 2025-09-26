import { useContext } from 'react'
import './Hero.css'
import { AppContext } from '../context/AppContext'

export default function Hero() {
    const { userData, isLoggedin } = useContext(AppContext);

    return (
        <div className='hero'>
            <h3>Hey {isLoggedin ? userData.name : 'Developer'} 👋</h3>
            <h1>Welcome to My Demo App</h1>
            <p>
                This project is a demo authentication system built with React and Node.js to showcase my full-stack skills.<br />
                It includes <b>Signup</b>, <b>Login</b>, <b>Logout</b>, <b>Password Reset</b>,<br />
                and <b>Email OTP Verification</b>.
            </p>
        </div>
    )
}
