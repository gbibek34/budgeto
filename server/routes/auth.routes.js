const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register); // Create a new user & create session
router.post("/login", login); // Login & create session

module.exports = router;