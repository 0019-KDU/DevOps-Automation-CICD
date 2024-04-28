const mongoose = require("mongoose");
const app = require("./index");
const port = process.env.PORT || 3000;
const dbName =
  "mongodb+srv://chirantha:12345u@cluster0.xcmczoo.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbName)
  .then(() => {
    console.log("Connected to MongoDB!");

    // Start the server after a successful database connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
