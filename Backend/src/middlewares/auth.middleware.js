const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * @middleware authUser
 * @description Verifies JWT token from cookies and checks against the blacklist to prevent unauthorized access
 */
async function authUser(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = { authUser };