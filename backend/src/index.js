import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import pharmacyRoutes from "./routes/pharmacies.js";
import httpStatus from "http-status";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/pharmacy", pharmacyRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", function (_, res) {
  res.send("Welcome to Medpin backend!");
});

// Catch 404
app.use((_, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: "Route not found",
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
