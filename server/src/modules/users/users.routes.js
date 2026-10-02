const express = require("express");
const auth = require("../../shared/lib/auth")
const {
    getUserById,
    updateUser,
    deleteUser
} = require("./users.controller");

const router = express.Router();

router.get("/me", auth.verifyUser, getUserById); // Get a user by ID
router.put("/me", auth.verifyUser, updateUser); // Update a user by ID
router.delete("/me", auth.verifyUser, deleteUser); // Delete a user by ID

module.exports = router;