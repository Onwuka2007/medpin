import Joi from "joi";

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
const pcnLicenseRegex = /^[A-Za-z0-9/.-]{5,50}$/;
const cacRegRegex = /^[A-Za-z0-9/-]{3,50}$/;

export const pharmacyRegisterSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(128).required(),
    pharmacyName: Joi.string().trim().min(2).max(120).required(),
    phone: Joi.string().trim().pattern(phoneRegex).required(),
    address: Joi.string().trim().min(5).max(255).required(),
    city: Joi.string().trim().max(120).allow("").optional(),
    state: Joi.string().trim().min(2).max(120).required(),
    pcnLicenseNo: Joi.string().trim().pattern(pcnLicenseRegex).required(),
    cacRegNo: Joi.string().trim().pattern(cacRegRegex).required(),
    superintendentName: Joi.string().trim().min(2).max(120).required(),
    superintendentPcn: Joi.string().trim().pattern(pcnLicenseRegex).required(),
    nafdacNo: Joi.string().trim().max(50).allow("").optional(),
});

export const pharmacyLoginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).max(128).required(),
});

export const pharmacyRejectSchema = Joi.object({
    rejectionReason: Joi.string().trim().min(5).max(500).required(),
});
