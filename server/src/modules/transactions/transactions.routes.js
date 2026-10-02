const express = require("express");
const auth = require("../../shared/lib/auth")
const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require("./transactions.controller");

const router = express.Router();

router.post("/", auth.verifyUser, createTransaction); // Create a new transaction
router.get("/", auth.verifyUser, getTransactions); // Get all transactions for a user (expects user_id in query)
router.get("/:transaction_id", auth.verifyUser, getTransactionById); // Get a transaction by ID
router.put("/:transaction_id", auth.verifyUser, updateTransaction); // Update a transaction
router.delete("/:transaction_id", auth.verifyUser, deleteTransaction); // Delete a transaction

module.exports = router;