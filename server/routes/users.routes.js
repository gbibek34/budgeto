const express = require("express");
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/users.controller");

const router = express.Router();

router.get("/", getUsers); // Get all users
router.get("/:user_id", getUserById); // Get a user by ID
router.put("/:user_id", updateUser); // Update a user by ID
router.delete("/:user_id", deleteUser); // Delete a user by ID

module.exports = router;