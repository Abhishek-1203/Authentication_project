import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Please enter all fields" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'user already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        (async () => {
            const info = await transporter.sendMail({
                from: '"Abhishek"<hellodairy17@gmail.com>',
                to: email,
                subject: "Authentication website",
                html: "<b>Welcome to authentication website</b>",
            });

            console.log("Message sent:", info.messageId);
        })();
        res.json({ success: true, message: "user registered successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "user does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ success: true, message: "user logged in successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    res.json({ success: true, message: "user logged out successfully" });
}

export const sendVerificationEmail = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ success: false, message: "User id is required" });
    }
    try {
        const user = await User.findById(userId);
        if (user.isVerified) {
            return res.json({ success: false, message: "User is already verified" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        (async () => {
            const info = await transporter.sendMail({
                from: '"Authentiaction"<hellodairy17@gmail.com>',
                to: user.email,
                subject: "Verification OTP",
                html: `<b>your account verification otp is ${otp}</b>`,
            });

            console.log("Message sent:", info.messageId);
        })();
        res.json({ success: true, message: "Verification email sent successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Please enter all fields" });
    }
    try {
        const user = await User.findById(userId);
        if (user.isVerified) {
            return res.json({ success: false, message: "User is already verified" });
        }
        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP has expired" });
        }
        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        res.json({ success: true, message: "User is authenticated" });
    }
    catch (error) {
        res.json({ success: false, message: "Internal server error" });
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetPasswordOtpExpireAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        (async () => {
            const info = await transporter.sendMail({
                from: '"Abhishek"<hellodairy17@gmail.com>',
                to: user.email,
                subject: "Reset password OTP",
                html: `<b>your password reset otp is ${otp}</b>`,
            });

            console.log("Message sent:", info.messageId);
        })();
        res.json({ success: true, message: "Reset OTP sent successfully" });
    }
    catch (error) {
        res.json({ success: false, message: "Internal server error" });
    }
}

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"Please enter all fields"});
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false,message:"User does not exist"});
        }
        if(user.resetOtp !== otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.resetPasswordOtpExpireAt < Date.now()){
            return res.json({success:false,message:"OTP has expired"});
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetPasswordOtpExpireAt = 0;
        await user.save();
        res.json({success:true,message:"Password reset successfully"}); 
    }catch(error){
        res.json({success:false,message:"Internal server error"});
    }
}
