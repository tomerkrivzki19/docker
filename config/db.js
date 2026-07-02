// The main setup of the db
const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sv1keaz.mongodb.net/`,
    );
    console.log("Connected succesfuly");
  } catch (error) {
    console.log("DB connection failed :", error);
  }
}

module.exports = connectDb;
