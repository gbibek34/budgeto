const express = require("express");
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categories.controller");

const router = express.Router();

router.get("/", getCategories);           // GET all categories
router.get("/:category_id", getCategoryById);      // GET category by ID
router.post("/", createCategory);         // CREATE new category
router.put("/:category_id", updateCategory);       // UPDATE category
router.delete("/:category_id", deleteCategory);    // DELETE category

module.exports = router;