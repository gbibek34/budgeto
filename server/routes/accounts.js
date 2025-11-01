const express = require("express");
const {
    getAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
} = require("../controllers/accountsController");

const router = express.Router();

router.get("/", getAccounts); // Get all accounts for a user (expects user_id in query)
router.get("/:account_id", getAccountById); // Get a single account by account_id
router.post("/", createAccount); // Create a new account
router.put("/:account_id", updateAccount); // Update an account by account_id
router.delete("/:account_id", deleteAccount); // Delete an account by account_id

module.exports = router;