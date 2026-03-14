import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export function authenticateJWT(req, res, next) {
const authHeader = req.headers.authorization;
const bearerToken = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
	? authHeader.slice(7).trim()
	: null;
const fallbackToken = typeof req.headers.token === "string" ? req.headers.token : null;
const token = bearerToken || fallbackToken;

if (!token) {
	return res.status(401).json({ message: "Token is required" });
}

try {
	const decoded = jwt.verify(token, JWT_SECRET);
	req.user = decoded;
	next();
} catch (error) {
	return res.status(401).json({ message: "Invalid token" });
}
}
