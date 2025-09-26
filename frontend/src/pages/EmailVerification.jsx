import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './EmailVerification.css'
import { AppContext } from "../context/AppContext";

const EmailVerification = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const{backendUrl,userData,setUserData} = useContext(AppContext);

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(backendUrl+
                "/api/auth/verifyotp",
                { otp },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);
                setUserData({...userData,isVerified:true});
                setTimeout(() => navigate("/"), 500);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="verification-container">
            <h2>Email Verification</h2>
            <p>Please enter the OTP sent to your email</p>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setOtp(value);
                        }
                    }}
                    placeholder="Enter OTP"
                    maxLength={6}
                />

                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default EmailVerification;
