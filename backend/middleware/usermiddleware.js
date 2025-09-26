import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal server error" });
    }
}
export default userAuth;