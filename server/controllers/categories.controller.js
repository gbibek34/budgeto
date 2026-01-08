const pool = require("../database/db");

// Create a new category
const createCategory = async (req, res) => {
    const { user_id, name, category_type, is_fixed, parent_category_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO categories (user_id, name, category_type, is_fixed, parent_category_id, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [user_id, name, category_type, is_fixed, parent_category_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all categories for a user
const getCategories = async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            "SELECT * FROM categories WHERE user_id = $1 ORDER BY category_id",
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
    const { category_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM categories WHERE category_id = $1",
            [category_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { category_id } = req.params;
    const { name, category_type, is_fixed, parent_category_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE categories SET name = $1, category_type = $2, is_fixed = $3, parent_category_id = $4
             WHERE category_id = $5 RETURNING *`,
            [name, category_type, is_fixed, parent_category_id, category_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { category_id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM categories WHERE category_id = $1 RETURNING *",
            [category_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted", category: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};