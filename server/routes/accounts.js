const express = require("express");
const {
    getAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
} = require("../controllers/accountsController");

const router = express.Router();

// Get all accounts for a user (expects user_id in query)
router.get("/", getAccounts);

// Get a single account by account_id
router.get("/:id", getAccountById);

// Create a new account
router.post("/", createAccount);

// Update an account by account_id
router.put("/:id", updateAccount);

// Delete an account by account_id
router.delete("/:id", deleteAccount);

module.exports = router;