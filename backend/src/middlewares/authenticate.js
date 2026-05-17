import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Authentication required",
        });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(httpStatus.UNAUTHORIZED).json({
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Invalid or expired token",
        });
    }
};
