import express from "express";
const router = express.Router();
import { register } from "../controllers/pharmacies/register.js";
import { login } from "../controllers/pharmacies/login.js";
import { verifyPharmacy } from "../controllers/pharmacies/verify.js";
import { listPharmacies } from "../controllers/pharmacies/list.js";
import { getPharmacyById } from "../controllers/pharmacies/getById.js";
import { rejectPharmacy } from "../controllers/pharmacies/reject.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { loginRateLimiter } from "../middlewares/loginRateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { pharmacyLoginSchema, pharmacyRegisterSchema, pharmacyRejectSchema } from "../validators/pharmacyAuth.js";

//Define the route for pharmacy registration
router.post("/register", validateRequest(pharmacyRegisterSchema), register);
router.post("/login", loginRateLimiter, validateRequest(pharmacyLoginSchema), login);
router.get("/all", authenticate, authorizeRole("ADMIN"), listPharmacies);
router.get("/:id", authenticate, authorizeRole("ADMIN"), getPharmacyById);
router.patch("/:id/verify", authenticate, authorizeRole("ADMIN"), verifyPharmacy);
router.patch("/:id/reject", authenticate, authorizeRole("ADMIN"), validateRequest(pharmacyRejectSchema), rejectPharmacy);

//Export the router
export default router;