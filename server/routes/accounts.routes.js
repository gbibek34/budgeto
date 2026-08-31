const express = require("express");
const auth = require("../utils/auth")
const {
    getAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
} = require("../controllers/accounts.controller");

const router = express.Router();

router.post("/", auth.verifyUser, createAccount); // Create a new account
router.get("/", auth.verifyUser, getAccounts); // Get all accounts for a user (expects user_id in query)
router.get("/:account_id", auth.verifyUser, getAccountById); // Get a single account by account_id
router.put("/:account_id", auth.verifyUser, updateAccount); // Update an account by account_id
router.delete("/:account_id", auth.verifyUser, deleteAccount); // Delete an account by account_id

module.exports = router;