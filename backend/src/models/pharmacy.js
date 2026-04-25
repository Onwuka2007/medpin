import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
    {
        // Account
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        // Basic info
        pharmacyName: { type: String, required: true },
        slug: { type: String, unique: true, sparse: true },
        type: { type: String, default: "Retail pharmacy" },
        phone: { type: String, required: true, unique: true },
        whatsapp: { type: String },
        profileImage: { type: String },

        // Location
        address: { type: String, required: true },
        area: { type: String },
        city: { type: String },
        state: { type: String, required: true },
        landmark: { type: String },
        lat: { type: Number },
        lng: { type: Number },

        // Licensing & verification
        pcnLicenseNo: { type: String, required: true, unique: true },
        cacRegNo: { type: String, required: true, unique: true },
        superintendentName: { type: String, required: true },
        superintendentPcn: { type: String, required: true },
        nafdacNo: { type: String },

        // Operating info
        hours: {
            weekdays: { type: String },
            saturday: { type: String },
            sunday: { type: String },
        },
        services: [{ type: String }],
        acceptsInsurance: [{ type: String }],

        // Status
        isOpen: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
        verifiedAt: { type: Date },
        isOnline: { type: Boolean, default: false },
        isDelivery: { type: Boolean, default: false },
        lastSeenActiveAt: { type: Date },

        // Role & metrics
        role: { type: String, enum: ["PHARMACY"], default: "PHARMACY" },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
