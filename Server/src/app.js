import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {ApiErrors} from './utils/ApiErrors.js';
import passport from 'passport';
import session from 'express-session';
import "./auth/passport.js"
const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static('public'))
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret",
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

import userRoutes from './routes/user.routes.js';
import accountRoutes from './routes/account.routes.js';
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message);
  const statusCode = err instanceof ApiErrors ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export {app}