import express from "express";
const router = express.Router();
import { register } from "../controllers/pharmacies/register.js";

//Define the route for pharmacy registration
router.post("/register", register);

//Export the router
export default router;
