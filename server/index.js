import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/connectDb.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/genrate.route.js";
import pdfRouter from "./routes/pdf.route.js";
import paymentRouter from "./routes/payment.route.js";
import adminRouter from "./routes/admin.route.js";

dotenv.config();

const app = express();

// Trust proxy for Render reverse proxy (required for secure cookies and accurate rate limiting)
app.set("trust proxy", 1);

// 2. Helmet HTTP Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// 3. CORS Configuration (Explicit White-listed Origin, Credentials Allowed)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://jovac-project-rosy.vercel.app",
  "https://client-nine-sigma-45.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean).map(url => url.replace(/\/$/, ""));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, "");
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app") ||
      cleanOrigin.includes("localhost")
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 4. Request Payload Size Limits (DoS Protection)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// 5. Rate Limiting (Brute-force & Abuse Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Max 50 requests per IP per 15 minutes for auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts from this IP, please try again after 15 minutes." }
});

const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Max 600 requests per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down." }
});

app.use("/api/auth", authLimiter);
app.use("/api", generalApiLimiter);

// 6. Health Check Route
app.get("/", (req, res) => {
  res.json({ status: "healthy", message: "NoteX Secure Backend Running 🚀" });
});

// 7. Protected & Authenticated Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

// 8. Global Error Handling Middleware (No Stack Leak in Production)
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler:", err.message);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "An internal server error occurred" : (err.message || "Internal server error")
  });
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`✅ Secure Server running on port ${PORT}`);
  });
};

startServer();