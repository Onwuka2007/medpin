import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        statusCode: httpStatus.TOO_MANY_REQUESTS,
        success: false,
        message: "Too many login attempts. Try again later.",
    },
});
