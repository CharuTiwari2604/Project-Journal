const dotenv = require('dotenv');
dotenv.config(); // load variables from .env

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Routes
const authrouter = require('./routes/authRoutes');
const journalRouter = require('./routes/profilepageRoutes');
const calenderRouter = require('./routes/calenderRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
  origin: ["https://project-journal-qflnawb0z-charu-tiwaris-projects.vercel.app", 'http://localhost:5173'], 
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/api', authrouter);
app.use("/api/journal", journalRouter);
app.use('/api/calendar', calenderRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  if (res.headersSent) return next(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
    const port = process.env.PORT || 7000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
