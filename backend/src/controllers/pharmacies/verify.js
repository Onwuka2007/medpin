import httpStatus from "http-status";
import mongoose from "mongoose";
import Pharmacy from "../../models/pharmacy.js";

export const verifyPharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: "Invalid pharmacy id",
            });
        }

        const pharmacy = await Pharmacy.findByIdAndUpdate(
            id,
            {
                isVerified: true,
                verificationStatus: "approved",
                rejectionReason: null,
                verifiedAt: new Date(),
            },
            { new: true }
        );

        if (!pharmacy) {
            return res.status(httpStatus.NOT_FOUND).json({
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "Pharmacy not found",
            });
        }

        return res.status(httpStatus.OK).json({
            statusCode: httpStatus.OK,
            success: true,
            message: "Pharmacy verified successfully",
            pharmacy: {
                id: pharmacy._id,
                pharmacyName: pharmacy.pharmacyName,
                email: pharmacy.email,
                isVerified: pharmacy.isVerified,
                verificationStatus: pharmacy.verificationStatus,
                rejectionReason: pharmacy.rejectionReason,
                verifiedAt: pharmacy.verifiedAt,
            },
        });
    } catch {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
