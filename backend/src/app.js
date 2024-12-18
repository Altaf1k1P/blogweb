import express from 'express';
import cors from 'cors';
import cookieParser  from "cookie-parser";
import morgan from "morgan";

const app = express();

// Logging middleware 
app.use(morgan('dev'));

// Enable JSON parsing middleware for all routes

app.use(express.json({ limit: '16kb' }));

// Enable CORS for all routes

app.use(cors({
    origin: process.env.CORS_ORIGIN,  // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent in requests and responses  // some legacy browsers (IE11, various older browsers) choke on 204
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))
// Enable cookie-parser middleware
app.use(cookieParser());


 import userRouter from './routes/user.routes.js';
 import postRouter from './routes/post.routes.js';

 app.use('/api/auth', userRouter);
 app.use('/api', postRouter);

export default app;