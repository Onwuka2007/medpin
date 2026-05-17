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
        } = req.validatedBody;

        // Check for duplicates across unique fields in one query
        const existing = await Pharmacy.findOne({
            $or: [{ email }, { phone }, { pcnLicenseNo }, { cacRegNo }],
        });

        if (existing) {
            let field = "email";
            if (existing.phone === phone) field = "phone number";
            else if (existing.pcnLicenseNo === pcnLicenseNo) field = "PCN license number";
            else if (existing.cacRegNo === cacRegNo) field = "CAC registration number";

            return res.status(httpStatus.CONFLICT).json({
                statusCode: httpStatus.CONFLICT,
                success: false,
                message: `A pharmacy with this ${field} is already registered.`,
            });
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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
            verificationStatus: "pending",
            rejectionReason: null,
            ...(nafdacNo ? { nafdacNo } : {}),
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
                verificationStatus: pharmacy.verificationStatus,
            },
        });

    } catch (error) {
        if (error?.code === 11000) {
            return res.status(httpStatus.CONFLICT).json({
                statusCode: httpStatus.CONFLICT,
                success: false,
                message: "A pharmacy with one of the supplied unique fields already exists.",
            });
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Server error. Please try again.",
        });
    }
};
