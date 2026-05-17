import httpStatus from "http-status";

export const validateRequest = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Validation failed",
            errors: error.details.map((detail) => detail.message),
        });
    }

    req.validatedBody = value;
    next();
};
