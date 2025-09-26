import express from 'express';
import { login, register,logout, sendVerificationEmail,verifyEmail,isAuthenticated,sendResetOtp,resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userauth.js';

const authRouter = express.Router();
authRouter.post('/login',login);
authRouter.post('/register',register);
authRouter.post('/logout',logout);
authRouter.post('/sendverifyotp',userAuth,sendVerificationEmail);
authRouter.post('/verifyotp',userAuth,verifyEmail);


authRouter.post('/reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);

export default authRouter;