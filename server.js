// server.js
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();

//mongodb connection
connectDB();

const app = express();
// Enable CORS
app.use(cors({
  origin: "http://localhost:3000" // your React frontend URL
}));


// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Sample route
app.use("/api/v1/user",require("./routes/userRoutes"));
app.use('/api/v1/admin',require('./routes/adminRoutes'));
app.use('/api/v1/doctor',require('./routes/doctorRoutes'));

// Environment variables
const PORT = process.env.PORT || 8080;
const MODE = process.env.NODE_ENV || 'development';

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running in ${MODE} mode on port ${PORT}`.bgGreen.white
  );
});
