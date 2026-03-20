
import jwt from "jsonwebtoken";

const JWT_SECRET = "jwt-secret-key";

function authMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        res.status(403).send({
            message: "You are not loggged in"
        });
        return;
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        res.status(403).json({
            message: "Invalid token"
        });
        return;
    }

    const userID = decoded.userID;
    
    if (!userID) {
        res.status(403).json({
            message: "malformed token"
        })
        return;
    }

    req.userID = userID;

    next();
}

export { authMiddleware };