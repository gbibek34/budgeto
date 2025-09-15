const pool = require("../db");

// Create a new transaction (income, expense, or transfer)
const createTransaction = async (req, res) => {
    const {
        user_id,
        source_account_id,
        target_account_id,
        category_id,
        amount,
        transaction_type,
        description
    } = req.body;

    try {
        let result;
        if (transaction_type === "transfer") {
            // Insert transaction
            result = await pool.query(
                `INSERT INTO transactions (
            user_id, source_account_id, target_account_id, category_id, amount, transaction_type, description, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
                [user_id, source_account_id, target_account_id, category_id, amount, transaction_type, description]
            );
            // Update balances
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [amount, source_account_id]
            );
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [amount, target_account_id]
            );
        } else if (transaction_type === "income") {
            result = await pool.query(
                `INSERT INTO transactions (
            user_id, target_account_id, category_id, amount, transaction_type, description, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
                [user_id, target_account_id, category_id, amount, transaction_type, description]
            );
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [amount, target_account_id]
            );
        } else if (transaction_type === "expense") {
            result = await pool.query(
                `INSERT INTO transactions (
            user_id, source_account_id, category_id, amount, transaction_type, description, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
                [user_id, source_account_id, category_id, amount, transaction_type, description]
            );
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [amount, source_account_id]
            );
        } else {
            return res.status(400).json({ error: "Invalid transaction type" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
    const { user_id } = req.query;
    try {
        const result = await pool.query(
            `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_id DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a transaction by ID
const getTransactionById = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM transactions WHERE transaction_id = $1",
            [transaction_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    const {
        source_account_id,
        target_account_id,
        category_id,
        amount,
        transaction_type,
        description
    } = req.body;
    try {
        const result = await pool.query(
            `UPDATE transactions SET
                source_account_id = $1,
                target_account_id = $2,
                category_id = $3,
                amount = $4,
                transaction_type = $5,
                description = $6,
             WHERE transaction_id = $7 RETURNING *`,
            [source_account_id, target_account_id, category_id, amount, transaction_type, description, transaction_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM transactions WHERE transaction_id = $1 RETURNING *",
            [transaction_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted", transaction: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};