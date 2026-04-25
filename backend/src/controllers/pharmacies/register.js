import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import Pharmacy from "../../models/pharmacy.js";

export const register = async (req, res) => {
    try {
        const {
            email,
            password,
            pharmacyName,
            phone,
            address,
            city,
            state,
            pcnLicenseNo,
            cacRegNo,
            superintendentName,
            superintendentPcn,
            nafdacNo,
        } = req.body;

        // Validate required fields
        const requiredFields = {
            email, password, pharmacyName, phone,
            address, state, pcnLicenseNo, cacRegNo,
            superintendentName, superintendentPcn,
        };

        // Send error if fields are missing
        const missing = Object.entries(requiredFields).filter(([_, v]) => !v).map(([k]) => k);

        if (missing.length) {
            return res.status(httpStatus.BAD_REQUEST).json({
                statusCode: httpStatus.BAD_REQUEST,
                success: false,
                message: `Missing required fields: ${missing.join(", ")}`,
            });
        }

        // Check for duplicates across unique fields in one query
        const existing = await Pharmacy.findOne({
            $or: [{ email }, { phone }, { pcnLicenseNo }, { cacRegNo }],
        });

        if (existing) {
            let field = "email";
            if (existing.phone === phone) field = "phone number"
            else if (existing.pcnLicenseNo === pcnLicenseNo) field = "PCN license number"
            else if (existing.cacRegNo === cacRegNo) field = "CAC registration number";

            return res.status(httpStatus.CONFLICT).json({
                statusCode: httpStatus.CONFLICT,
                success: false,
                message: `A pharmacy with this ${field} is already registered.`,
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // create pharmacy user
        const pharmacy = await Pharmacy.create({
            email,
            password: hashedPassword,
            pharmacyName,
            phone,
            address,
            city,
            state,
            pcnLicenseNo,
            cacRegNo,
            superintendentName,
            superintendentPcn,
            ...(nafdacNo && { nafdacNo }),
        });

        return res.status(httpStatus.CREATED).json({
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Registration submitted. Your pharmacy is under review.",
            pharmacy: {
                id: pharmacy._id,
                pharmacyName: pharmacy.pharmacyName,
                email: pharmacy.email,
                isVerified: pharmacy.isVerified,
            },
        });

    } catch (error) {
        console.error("registerPharmacy error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
