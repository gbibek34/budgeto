const express = require("express");
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categoriesController");

const router = express.Router();

router.get("/", getCategories);           // GET all categories
router.get("/:id", getCategoryById);      // GET category by ID
router.post("/", createCategory);         // CREATE new category
router.put("/:id", updateCategory);       // UPDATE category
router.delete("/:id", deleteCategory);    // DELETE category

module.exports = router;