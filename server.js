const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
require("colors");
const errorHanlder = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// DB connection
connectDB();

// Loading routes
const bootcamps = require("./routes/bootcamps");

const app = express();

// Body parser
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("combined"));

// Mounting API routes
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHanlder);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.yellow.red);
    // Close server and exit
    server.close(() => process.exit(1));
});
