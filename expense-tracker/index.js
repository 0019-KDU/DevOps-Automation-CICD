const express = require("express");
const { db } = require("./db.js");

const app = express();

const port = process.env.PORT || 3000;

//testing my endpoint use the dummy data

const expenses = [
  {
    name: "chirantha",
    amount: 1000,
  },
];

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await db();
});
