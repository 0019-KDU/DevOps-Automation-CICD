const request = require("supertest");
const Expense = require("../models/expense"); // Correct model name
const app = require("../index");
const mongoose = require("mongoose");

// Use async/await instead of callbacks in `beforeEach` and `afterEach`
beforeEach(async () => {
  await mongoose.connect(
    "mongodb+srv://chirantha:12345u@cluster0.xcmczoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Expense.deleteMany({}); // Instead of dropDatabase
    await mongoose.connection.close();
  }
});

//!GET Api test
test("GET /api/expenses without query parameters returns all expenses", async () => {
  // console.log("Cleaning up existing data...");
  // await Expense.deleteMany({}); // Ensure the database is clean

  console.log("Creating test data...");
  // Create two unique expenses
  await Expense.create({ name: `Expense ${Date.now()}`, amount: 120 });
  await Expense.create({ name: `Expense ${Date.now() + 1}`, amount: 150 });

  // Fetch all expenses
  const response = await request(app).get("/api/expenses");

  expect(response.status).toBe(200); // Check the status
  expect(Array.isArray(response.body.data)).toBe(true); // Check if the data is an array
  expect(response.body.data.length).toBe(2); // Verify the number of expenses
});
test("GET /api/expenses/:id returns an expense when given a valid ID", async () => {
  // Create a test expense
  const newExpense = await Expense.create({
    name: "Test Expense",
    amount: 100,
  });

  // Fetch the expense by ID
  const response = await request(app)
    .get(`/api/expenses/${newExpense._id}`) // Use the valid ID
    .expect(200); // Expecting 200 OK

  // Check if the response contains the expected data
  expect(response.body.data).toBeTruthy(); // The data field should be present
  expect(response.body.data.name).toBe("Test Expense");
  expect(response.body.data.amount).toBe(100);
});

//!POST Api test
test("POST /api/expenses creates a new expense", async () => {
  const data = { name: "test expense", amount: 150 };

  const response = await request(app).post("/api/expenses").send(data);

  // Check the response status
  expect(response.status).toBe(201);

  // Check the response data
  expect(response.body.success).toBe(true);
  expect(response.body.data).toBeTruthy();
  expect(response.body.data.name).toBe(data.name);
  expect(response.body.data.amount).toBe(data.amount);

  // Ensure the expense is in the database
  const expense = await Expense.findById(response.body.data._id);
  expect(expense).toBeTruthy();
  expect(expense.name).toBe(data.name);
  expect(expense.amount).toBe(data.amount);
});

//!PUT Api test
test("PUT /api/expenses/:id updates an existing expense", async () => {
  // Create an expense to update
  const initialExpense = await Expense.create({
    name: "Initial Expense",
    amount: 100,
  });

  // Data to update the expense
  const updateData = { name: "Updated Expense", amount: 200 };

  // Perform PUT request
  const response = await request(app)
    .put(`/api/expenses/${initialExpense._id}`)
    .send(updateData)
    .expect(200); // Expecting 200 OK

  // Verify the updated expense in the database
  const updatedExpense = await Expense.findById(initialExpense._id);
  expect(updatedExpense).toBeTruthy(); // Ensure the expense still exists
  expect(updatedExpense.name).toBe("Updated Expense"); // Verify the updated name
  expect(updatedExpense.amount).toBe(200); // Verify the updated amount
});

//!DELETE Api test
test("DELETE /api/expenses/:id deletes an expense", async () => {
  // Create an expense to delete
  const newExpense = await Expense.create({
    name: "Expense to Delete",
    amount: 100,
  });

  const response = await request(app)
    .delete(`/api/expenses/${newExpense._id}`) // Perform DELETE request
    .expect(204); // Expecting 204 No Content

  // Ensure the expense was deleted from the database
  const deletedExpense = await Expense.findById(newExpense._id);
  expect(deletedExpense).toBeNull(); // Should be null after deletion
});
