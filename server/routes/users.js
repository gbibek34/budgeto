const express = require("express");
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/usersController");

const router = express.Router();

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Get a user by ID
router.get("/:user_id", getUserById);

// Update a user by ID
router.put("/:user_id", updateUser);

// Delete a user by ID
router.delete("/:user_id", deleteUser);

module.exports = router;