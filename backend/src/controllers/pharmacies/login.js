import httpStatus from "http-status";
import Pharmacy from "../../models/pharmacy.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
    try {
        const { email, password } = req.validatedBody;
        const user = await Pharmacy.findOne({ email });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                statusCode: httpStatus.UNAUTHORIZED,
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                statusCode: httpStatus.UNAUTHORIZED,
                success: false,
                message: "Invalid credentials",
            });
        }

        const effectiveVerificationStatus = user.verificationStatus
            ?? (user.isVerified ? "approved" : "pending");

        if (effectiveVerificationStatus === "rejected") {
            return res.status(httpStatus.FORBIDDEN).json({
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: "Your pharmacy application was rejected.",
                rejectionReason: user.rejectionReason,
            });
        }

        if (effectiveVerificationStatus !== "approved") {
            return res.status(httpStatus.FORBIDDEN).json({
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: "Your pharmacy account is still under review.",
            });
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        res.status(httpStatus.OK).json({
            statusCode: httpStatus.OK,
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    verificationStatus: effectiveVerificationStatus,
                },
            },
        });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
