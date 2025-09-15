const express = require("express");
const router = express.Router();
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionsController");

// Create a new transaction
router.post("/", createTransaction);

// Get all transactions for a user (expects user_id in query)
router.get("/", getTransactions);

// Get a transaction by ID
router.get("/:transaction_id", getTransactionById);

// Update a transaction
router.put("/:transaction_id", updateTransaction);

// Delete a transaction
router.delete("/:transaction_id", deleteTransaction);

module.exports = router;