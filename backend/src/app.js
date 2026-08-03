import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import compression from "compression";
import responseTime from "response-time";
import { ENV } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';
import rootRouter from './routes/index.js';

const app = express();

// Security headers and configurations
app.use(securityMiddleware());

// CORS configuration
const allowedOrigins = [
  ENV.CORS_ORIGIN,
  "http://localhost:5173",
  "https://blogweb-coral.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith(".vercel.app") || 
                      origin.startsWith("http://localhost:");
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
}));

// Standard Middlewares
app.use(responseTime());
app.use(requestLogger);
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// General API rate limiting
app.use("/api", generalLimiter);

// Root Router Registry
app.use('/api', rootRouter);

// Fallbacks and Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;