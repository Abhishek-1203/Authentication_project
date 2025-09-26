import express from 'express';
import {userData} from '../controllers/userController.js';
import userAuth from '../middleware/usermiddleware.js';
import { isAuthenticated } from '../controllers/authController.js';


const userRouter = express.Router();

userRouter.get('/userdata',userAuth,userData);
userRouter.get('/isauthenticated',userAuth,isAuthenticated);

export default userRouter;