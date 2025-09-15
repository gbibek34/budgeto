const pool = require("../db");

// Create a new account
const createAccount = async (req, res) => {
    const { user_id, name, account_type, balance } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO accounts (user_id, name, account_type, balance, created_at)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [user_id, name, account_type, balance]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all accounts for a user
const getAccounts = async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            "SELECT * FROM accounts WHERE user_id = $1 ORDER BY account_id",
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get an account by ID
const getAccountById = async (req, res) => {
    const { account_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM accounts WHERE account_id = $1",
            [account_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Update an account
const updateAccount = async (req, res) => {
    const { account_id } = req.params;
    const { name, account_type, balance } = req.body;
    try {
        const result = await pool.query(
            `UPDATE accounts SET name = $1, account_type = $2, balance = $3
             WHERE account_id = $4 RETURNING *`,
            [name, account_type, balance, account_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete an account
const deleteAccount = async (req, res) => {
    const { account_id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM accounts WHERE account_id = $1 RETURNING *",
            [account_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json({ message: "Account deleted", account: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { getAccounts, createAccount, getAccountById, updateAccount, deleteAccount }