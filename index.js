const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDb = require("./config/db");
const userRouters = require("./routes/users");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://192.168.11.1:5500",
    ],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

connectDb();

// / => routing
app.get("/", (req, res) => {
  res.send("Welcome to our users management app.");
});
app.use("/api/users", userRouters);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
