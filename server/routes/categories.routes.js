const express = require("express");
const auth = require("../utils/auth")
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", auth.verifyUser, getCategories);           // GET all categories
router.get("/:category_id", auth.verifyUser, getCategoryById);      // GET category by ID
router.post("/", auth.verifyUser, createCategory);         // CREATE new category
router.put("/:category_id", auth.verifyUser, updateCategory);       // UPDATE category
router.delete("/:category_id", deleteCategory);    // DELETE category

module.exports = router;