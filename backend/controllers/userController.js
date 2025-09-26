import User from '../models/userModel.js';

export const userData = async(req,res)=>{
    const userId = req.userId;
    console.log(userId);
    try {
        const user = await User.findById(userId);
        res.json({success:true,userData:{
            name:user.name,
            email:user.email,
            isVerified:user.isVerified
        }});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Internal server error"});
    }
}