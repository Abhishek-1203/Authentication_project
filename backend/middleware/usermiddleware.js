import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("hi");
        
        if (!token) {
            return res.json({ success: false, message: "Unauthorizeds" });
        }
        console.log("hello");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.json({ success: false, message: "Unauthorizedz" });
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error" });
    }
}
export default userAuth;
