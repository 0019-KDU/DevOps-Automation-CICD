const express = require("express");
const { db, Expense } = require("./db.js");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

//POST
app.post("/expenses", async (req, res) => {
  const params = req.body;
  if (!params.name || !params.amount) {
    res.status(400).send({
      error: true,
      errorMessage: "Please name and amount are required",
    });
  }
  //save these data to our databse
  const data = new Expense({
    name: params.name,
    amount: params.amount,
  });
  const result = await data.save();

  res.status(201).send({
    data: result,
  });
});

//GET(read)
app.get("/expenses", async (req, res) => {
  try {
    const query = req.query;
    let result = [];
    if (query.amount) {
      //find data above
      result = await Expense.find({
        amount: { $gt: query.amount },
      });
    } else {
      result = await Expense.find();
    }
    res.status(200).send({
      data: result,
    });
  } catch (error) {
    throw error;
  }
});

//read the one data
app.get("/expenses/:id", async (req, res) => {
  const id = req.params.id;
  const expense = await Expense.findById(id);
  if (!expense) {
    res.status(404).send({
      error: true,
      errorMessage: "Expense not found",
    });
  }
  res.status(200).send({
    data: expense,
  });
});

//PUT(update)
app.put("/expenses/:id", async (req, res) => {
  const filter = {
    _id: req.params.id,
  };
  //validation
  const update = { ...req.body };
  console.log({ update });
  const expense = await Expense.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });
  res.status(200).send({
    data: expense,
  });
});

//DELETE
app.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.deleteOne({
      _id: req.params.id,
    });
    res.status(200).send({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await db();
});
