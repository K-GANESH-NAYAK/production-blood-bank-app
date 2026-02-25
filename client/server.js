// 1️⃣ Load environment variables first
require("dotenv").config();

// 2️⃣ Import modules
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

// 3️⃣ Check environment variables (optional)
console.log("MONGO_URL:", process.env.MONGO_URL); // should print the full URI
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// 4️⃣ Connect to MongoDB
connectDB();

// 5️⃣ Create Express app
const app = express();

// 6️⃣ Middlewares
app.use(express.json()); // parse JSON bodies
app.use(cors({
  origin: "http://localhost:3000", // allow frontend dev server
  credentials: true
}));
app.use(morgan("dev"));

// 7️⃣ Routes
app.use("/api/v1/test", require("./routes/testroutes"));
app.use("/api/v1/auth", require("./routes/authroutes"));
app.use("/api/v1/inventory", require("./routes/inventoryroutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/AdminRoutes"));

// 8️⃣ Handle 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// 9️⃣ Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server Error", error: err.message });
});

// 10️⃣ Start server
const PORT = process.env.PORT || 8080;
const DEV_MODE = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`Node Server Running In ${DEV_MODE} mode on port ${PORT}`.bgBlue.white);
});
