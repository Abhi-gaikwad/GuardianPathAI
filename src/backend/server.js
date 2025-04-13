const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
connectDB(); // Connect to MongoDB

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/users", userRoutes);
app.use("/api", require("./routes/feedbackRoutes")); 


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));