import "dotenv/config";
import express from "express";
import cors from "cors";
import brandRouter from "./routes/brandRouter";
import setupLogger from "./logger/logger";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import errorHandler from "./middlewares/errorHandler";

const PORT = process.env.PORT;

const app = express();
const { loggerMiddleware } = setupLogger();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(express.json());
app.use(loggerMiddleware);

app.use("/api/brands", brandRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
