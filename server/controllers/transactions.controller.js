const pool = require("../database/db");

// Helper to update and return all accounts for a user
async function getUserAccounts(user_id) {
    const result = await pool.query("SELECT * FROM accounts WHERE user_id = $1", [user_id]);
    return result.rows;
}

// Create a new transaction (no changes needed here except for returning accounts)
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
            result = await pool.query(
                `INSERT INTO transactions (
                    user_id, source_account_id, target_account_id, category_id, amount, transaction_type, description, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
                [user_id, source_account_id, target_account_id, category_id, amount, transaction_type, description]
            );
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
        // Return transaction and updated accounts
        const accounts = await getUserAccounts(user_id);
        res.json({ transaction: result.rows[0], accounts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    const { transaction_id } = req.params;
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
        // 1. Fetch the old transaction
        const oldTxRes = await pool.query("SELECT * FROM transactions WHERE transaction_id = $1", [transaction_id]);
        if (oldTxRes.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        const oldTx = oldTxRes.rows[0];

        // 2. Reverse old transaction's effect
        if (oldTx.transaction_type === "transfer") {
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [oldTx.amount, oldTx.source_account_id]
            );
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [oldTx.amount, oldTx.target_account_id]
            );
        } else if (oldTx.transaction_type === "income") {
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [oldTx.amount, oldTx.target_account_id]
            );
        } else if (oldTx.transaction_type === "expense") {
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [oldTx.amount, oldTx.source_account_id]
            );
        }

        // 3. Update transaction
        const result = await pool.query(
            `UPDATE transactions SET
                source_account_id = $1,
                target_account_id = $2,
                category_id = $3,
                amount = $4,
                transaction_type = $5,
                description = $6
             WHERE transaction_id = $7 RETURNING *`,
            [
                source_account_id || null,
                target_account_id || null,
                category_id || null,
                amount,
                transaction_type,
                description,
                transaction_id
            ]
        );

        // 4. Apply new transaction's effect
        if (transaction_type === "transfer") {
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [amount, source_account_id]
            );
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [amount, target_account_id]
            );
        } else if (transaction_type === "income") {
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [amount, target_account_id]
            );
        } else if (transaction_type === "expense") {
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [amount, source_account_id]
            );
        }

        // 5. Return updated transaction and accounts
        const accounts = await getUserAccounts(user_id);
        res.json({ transaction: result.rows[0], accounts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        // 1. Fetch the transaction
        const txRes = await pool.query("SELECT * FROM transactions WHERE transaction_id = $1", [transaction_id]);
        if (txRes.rows.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        const tx = txRes.rows[0];

        // 2. Reverse its effect
        if (tx.transaction_type === "transfer") {
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [tx.amount, tx.source_account_id]
            );
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [tx.amount, tx.target_account_id]
            );
        } else if (tx.transaction_type === "income") {
            await pool.query(
                "UPDATE accounts SET balance = balance - $1 WHERE account_id = $2",
                [tx.amount, tx.target_account_id]
            );
        } else if (tx.transaction_type === "expense") {
            await pool.query(
                "UPDATE accounts SET balance = balance + $1 WHERE account_id = $2",
                [tx.amount, tx.source_account_id]
            );
        }

        // 3. Delete transaction
        await pool.query("DELETE FROM transactions WHERE transaction_id = $1", [transaction_id]);

        // 4. Return updated accounts
        const accounts = await getUserAccounts(tx.user_id);
        res.json({ message: "Transaction deleted", accounts });
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

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};