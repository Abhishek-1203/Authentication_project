import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
export default function Navbar() {
    const navigate = useNavigate();
    const { userData, backendUrl, setIsLoggedin, setUserData } = useContext(AppContext);

    const logout=async ()=>{
        try{
            axios.defaults.withCredentials= true;
            const {data} = await axios.post(backendUrl+'/api/auth/logout');
            data.success && setIsLoggedin(false);
            data.success && setUserData(false);
            navigate('/')

        }catch(error){
            toast.error(error.message);
        }
    }
    const verifyEmail= async()=>{
        const {data} = await axios.post(`${backendUrl}/api/auth/sendverifyotp`, {}, { withCredentials: true });
        if(data.success){
            navigate('/email-verify');
            toast.success(data.message);
        }
    }
    const updatePassword = async()=>{
        navigate('/password-reset')
    }
    return (
        <nav>
            <h2>Authentication</h2>
            {userData ?
                <div className='profile'>
                    {userData.name[0].toUpperCase()}

                    <div className='profileOptions'>
                        <ul>
                            <li onClick={logout}>Logout</li>
                            <li onClick={updatePassword}>update password</li>
                            {!userData.isVerified && <li onClick={verifyEmail}>verify account</li>}

                        </ul>
                    </div>
                </div>
                :
                <button className='btn' onClick={() => {
                    navigate('/login')
                }}>Login<FaArrowRightLong /></button>
            }

        </nav>
    )
}