const express = require("express");
const cors = require("cors");
const path = require("path"); //an shortcut for directing path in our seystem
require("dotenv").config();

const connectDb = require("./config/db");
const userRouters = require("./routes/users");
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const allowOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://192.168.11.1:5500",
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean); //A way of removing items that are not true from our array

app.use(express.json());
app.use(
  cors({
    // origin-> the original call that came to out ip (the ip that trying to access)

    origin: (origin, callback) => {
      if (!origin || allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policies"));
      }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

connectDb();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET, is not defiend in environment varabiles");
  process.exit(1); //This command will stop the server
  // Why we are stoping the server?
  // becouse in this position we are not working locally and without a secret key we cannot have the server continue to run
}

// / => routing
// app.get("/", (req, res) => {
//   res.send("Welcome to our users management app.");
// });

// the states of the server:
app.get("/health", (req, res) => {
  const dbStates = [
    "connected",
    "disconnected",
    "connecting",
    "disconnecting ",
  ];

  // Here we are checking if the db is connected: Basically we are checking the states here
  const dbConnected = mongoose.connection.readyState == 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "error",
    db: dbStates[mongoose.connections.readyState],
    runTime: `${Math.floor(process.uptime())}s`, //The process.uptime() method returns the number of seconds the current Node.js process has been running
    // why we are willing to send the number of seconed that the server is runing?
    // for the diagnostika - to check if the server faield before
    environment: process.env.NODE_ENV || "developement",
  });
});

app.use("/api/users", userRouters);
app.use(express.static(path.join(__dirname, "/public"))); //To open the fronted to our server project

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
