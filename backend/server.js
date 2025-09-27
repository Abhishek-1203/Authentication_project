import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './config/mongodb.js';
import authRouter from './routes/authRoutes.js'; 
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
const allowedOrigins = []
connectDb();

app.use(express.json());
app.use(cors({origin:'https://projectauthentication.netlify.app',credentials:true}));
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/user',userRouter);

app.get('/',(req,res)=>{
    res.send("API is running...");
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
