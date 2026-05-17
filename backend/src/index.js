import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import pharmacyRoutes from "./routes/pharmacies.js";
import httpStatus from "http-status";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const requiredEnvVars = ["JWT_SECRET", "JWT_EXPIRES_IN"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]?.trim());

if (missingEnvVars.length) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const app = express();

// CORS middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://yourfrontend.com",
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
}));

// Security middleware
app.use(helmet());

app.use(express.json());

app.use("/pharmacy", pharmacyRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", function (_, res) {
  res.send("Welcome to Medpin backend!");
});

// Catch 404
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: `The requested route ${req.originalUrl} does not exist.`,
  });
});

// Error handler
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    message: "Internal Server Error",
  });
});

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB();
});
