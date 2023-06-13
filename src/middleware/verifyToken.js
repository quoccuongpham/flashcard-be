const jwt = require("jsonwebtoken");

//?: Lấy token trong header, check xem token có hợp lệ hay không

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader.split(" ")[1];
    if (!token || authHeader === null) {
        return res.status(400).json({
            success: false,
            message: "Access token is not found",
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user_id = decoded.user_id;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid token!",
        });
    }
};

module.exports = verifyToken;
