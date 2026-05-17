import httpStatus from "http-status";

export const authorizeRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Authentication required",
        });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(httpStatus.FORBIDDEN).json({
            statusCode: httpStatus.FORBIDDEN,
            success: false,
            message: "You are not authorized to perform this action",
        });
    }

    next();
};
