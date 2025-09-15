const pool = require("../db");

// Create a new user
const createUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO users (name, email, created_at)
             VALUES ($1, $2, NOW()) RETURNING *`,
            [name, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users ORDER BY user_id"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE users SET name = $1, email = $2
             WHERE user_id = $3 RETURNING *`,
            [name, email, user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM users WHERE user_id = $1 RETURNING *",
            [user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted", user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};