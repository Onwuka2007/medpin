import httpStatus from "http-status";
import mongoose from "mongoose";
import Pharmacy from "../../models/pharmacy.js";

export const getPharmacyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: "Invalid pharmacy id",
            });
        }

        const pharmacy = await Pharmacy.findOne({ _id: id, role: "PHARMACY" }, { password: 0 });

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
            pharmacy,
        });
    } catch {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
