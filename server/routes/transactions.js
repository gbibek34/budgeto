const express = require("express");
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transactionsController");

const router = express.Router();

router.post("/", createTransaction); // Create a new transaction
router.get("/", getTransactions); // Get all transactions for a user (expects user_id in query)
router.get("/:transaction_id", getTransactionById); // Get a transaction by ID
router.put("/:transaction_id", updateTransaction); // Update a transaction
router.delete("/:transaction_id", deleteTransaction); // Delete a transaction

module.exports = router;