const pool = require("../database/db");
const prisma = require("../config/prisma")

// Create a new category
const createCategory = async (req, res) => {
    const user_id = req.userInfo.user_id
    const { transaction_type_id, category_name, is_fixed, parent_category_id } = req.body;

    if (!transaction_type_id || !category_name) {
        return res.status(400).json({ message: "Validation Failed!", error: "Missing required fields" })
    }

    try {
        const category = await prisma.categories.create({
            data: {
                user_id,
                transaction_type_id,
                category_name,
                is_fixed,
                parent_category_id
            }
        })

        res.status(201).json({ message: "Category Created!", category })
    } catch (err) {
        console.error("Create category error", err);
        res.status(500).json({ error: err });
    }
};

// Get all categories for a user
const getCategories = async (req, res) => {
    const user_id = req.userInfo.user_id;
    try {
        const result = await prisma.categories.findMany({
            where: { user_id: user_id }
        })
        res.json(result);
    } catch (err) {
        cconsole.error("Create account error:", err.message);
        res.status(500).json({ error: err });
    }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
    const { category_id } = req.params;
    try {
        const result = await prisma.categories.findUnique({
            where: { category_id: category_id }
        })
        if (result.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { category_id } = req.params;
    const { transaction_type_id, category_name, is_fixed, parent_category_id } = req.body;
    try {
        const result = await prisma.categories.update({
            where: { category_id: category_id },
            data: {
                transaction_type_id,
                category_name,
                is_fixed,
                parent_category_id
            }
        })
        if (result.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { category_id } = req.params;
    try {
        const result = await prisma.categories.delete({
            where: { category_id: category_id }
        })
        if (result.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted", category: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};