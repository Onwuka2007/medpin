import httpStatus from "http-status";
import Pharmacy from "../../models/pharmacy.js";

const parseBooleanQuery = (value) => {
    if (value === undefined) return undefined;
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
};

const allowedStatuses = new Set(["pending", "approved", "rejected"]);

export const listPharmacies = async (req, res) => {
    try {
        const verified = parseBooleanQuery(req.query.verified);
        const status = req.query.status;

        if (verified === null) {
            return res.status(httpStatus.BAD_REQUEST).json({
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: "Query parameter 'verified' must be 'true' or 'false'.",
            });
        }

        if (status !== undefined && !allowedStatuses.has(status)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: "Query parameter 'status' must be 'pending', 'approved', or 'rejected'.",
            });
        }

        const filter = { role: "PHARMACY" };
        if (status === "approved") {
            filter.$or = [
                { verificationStatus: "approved" },
                { verificationStatus: { $exists: false }, isVerified: true },
            ];
        } else if (status === "pending") {
            filter.$or = [
                { verificationStatus: "pending" },
                { verificationStatus: { $exists: false }, isVerified: false },
            ];
        } else if (status === "rejected") {
            filter.verificationStatus = "rejected";
        }
        if (verified !== undefined) {
            filter.isVerified = verified;
        }

        const pharmacies = await Pharmacy.find(filter, { password: 0 })
            .sort({ createdAt: -1 });

        return res.status(httpStatus.OK).json({
            statusCode: httpStatus.OK,
            success: true,
            count: pharmacies.length,
            pharmacies,
        });
    } catch {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
