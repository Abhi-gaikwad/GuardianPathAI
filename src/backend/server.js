// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");

// const app = express();
// connectDB(); // Connect to MongoDB

// app.use(express.json());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.use("/api/users", userRoutes);
// app.use("/api", require("./routes/feedbackRoutes")); 


// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
connectDB(); // Connect to MongoDB

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Session middleware
app.use(session({
  secret: "mysecretkey", // use a secure .env variable for production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/your_db_name",
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    secure: false, // set true in production (HTTPS)
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api", feedbackRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
