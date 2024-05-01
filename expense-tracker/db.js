const mongoose = require("mongoose");
const app = require("./index");
const port = process.env.PORT || 5000;
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB!......");

    // Start the server after a successful database connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}!`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB..?", err);
  });
