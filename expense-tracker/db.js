const dbName =
  "mongodb+srv://chirantha:12345u@cluster0.xcmczoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(dbName);
    console.log("Connected to database");
  } catch (error) {
    console.log("Error in connecting to database");
    console.log({ error });
  }
};

module.exports = { db };
