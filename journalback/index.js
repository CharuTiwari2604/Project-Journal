const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authrouter = require('./routes/authRoutes');
const journalRouter = require('./routes/profilepageRoutes');

const app = express();

// Middleware
app.use(express.json()); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS setup (for local frontend)
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//routes
app.use('/api', authrouter);
app.use("/api/journal", journalRouter);
app.use('/api/calendar', require('./routes/calenderRoutes'));      //extra

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  if (res.headersSent) return next(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 7000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

