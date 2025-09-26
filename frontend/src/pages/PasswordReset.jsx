import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import "./PasswordReset.css";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
    const { backendUrl } = useContext(AppContext);

    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();
    const sendOtp = async () => {
        if (!email) {
            toast.error("Enter your email first");
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/reset-otp`,
                { email },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);
                setOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/reset-password`,
                { email, otp, newPassword },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(data.message);
                navigate('/')
                setEmail("");
                setOtp("");
                setNewPassword("");
                setOtpSent(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="reset-container">
            <h2>Password Reset</h2>
            <form onSubmit={otpSent ? handleReset : (e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    required
                />

                {!otpSent && (
                    <button type="button" onClick={sendOtp}>
                        Send OTP
                    </button>
                )}

                {otpSent && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Reset Password</button>
                    </>
                )}
            </form>
        </div>
    );
};

export default PasswordReset;
