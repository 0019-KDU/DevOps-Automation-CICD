var express = require("express");
const router = express.Router();
const Expense = require("../models/expense");

router.get("/test", (req, res) => {
  res.json({ message: "GET request to the /api/test endpoint" });
});

router.get("/expenses", async (req, res) => {
  console.log("Received GET /expenses request");
  try {
    const query = req.query;
    let result = [];

    if (query.amount) {
      const amount = parseFloat(query.amount); // Ensure it's a number
      if (isNaN(amount)) {
        return res.status(400).send({
          message: "Invalid 'amount' query parameter",
        });
      }

      result = await Expense.find({
        amount: { $gt: amount },
      });
    } else {
      result = await Expense.find();
    }

    res.status(200).send({
      data: result,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});
router.get("/expenses/:id", async (req, res) => {
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

router.post("/expenses", async (req, res) => {
  const params = req.body;

  // Validate required fields
  if (!params.name || typeof params.amount !== "number") {
    return res.status(400).send({
      error: true,
      errorMessage: "Name and amount are required, with amount being a number.",
    });
  }

  try {
    // Save the data to the database
    const data = new Expense({
      name: params.name,
      amount: params.amount,
    });

    const result = await data.save(); // Save the new expense

    // Return the created resource with 201 status
    return res.status(201).send({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error saving expense:", error); // Error handling and logging
    return res.status(500).send({
      error: true,
      errorMessage: "An internal server error occurred.",
    });
  }
});

router.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { name, amount } = req.body;

  // Validate required fields
  if (!name || typeof amount !== "number") {
    return res.status(400).send({
      error: true,
      errorMessage: "Name and amount are required, with amount being a number.",
    });
  }

  try {
    // Update the expense in the database
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { name, amount },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).send({
        error: true,
        errorMessage: "Expense not found.",
      });
    }

    // Return the updated resource with 200 status
    return res.status(200).send({
      success: true,
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).send({
      error: true,
      errorMessage: "An internal server error occurred.",
    });
  }
});

router.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.deleteOne({
      _id: req.params.id,
    });
    res.status(204).send({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
