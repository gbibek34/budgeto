const prisma = require("../../shared/lib/prisma")
const transactionService = require("./transactions.service")

// Create a new transaction (no changes needed here except for returning accounts)
const createTransaction = async (req, res) => {
    const user_id = req.userInfo.user_id
    const {
        transaction_type_id,
        source_account_id,
        target_account_id,
        debt_id,
        goal_id,
        category_id,
        amount,
        transaction_title,
        transaction_description,
        transaction_date
    } = req.body;

    // Validation
    if (!transaction_type_id || !amount || !transaction_date) {
        return res.status(400).json({
            message: "Validation Failed!",
            error: "Missing required fields"
        })
    } else if (![1, 2, 3].includes(transaction_type_id)) {
        return res.status(400).json({
            message: "Validation Failed!",
            error: "Enter a valid transaction type"
        })
    }

    try {

        const result = await transactionService.executeTransaction(transaction_type_id, {
            user_id,
            source_account_id,
            target_account_id,
            debt_id,
            goal_id,
            category_id,
            amount,
            transaction_title,
            transaction_description,
            transaction_date
        });

        res.status(201).json({
            message: "Transaction Recorded!",
            ...result
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    const user_id = req.userInfo.user_id
    const { transaction_id } = req.params;
    const {
        transaction_type_id,
        source_account_id,
        target_account_id,
        debt_id,
        goal_id,
        category_id,
        amount,
        transaction_title,
        transaction_description,
        transaction_date
    } = req.body;

    // Validation
    if (!transaction_type_id || !amount || !transaction_date) {
        return res.status(400).json({
            message: "Validation Failed!",
            error: "Missing required fields"
        })
    } else if (![1, 2, 3].includes(transaction_type_id)) {
        return res.status(400).json({
            message: "Validation Failed!",
            error: "Enter a valid transaction type"
        })
    }

    try {
        const result = await transactionService.updateTransaction(transaction_id, {
            transaction_type_id,
            source_account_id,
            target_account_id,
            debt_id,
            goal_id,
            category_id,
            amount,
            transaction_title,
            transaction_description,
            transaction_date
        });

        res.status(201).json({
            message: "Transaction Updated!",
            ...result
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const result = await transactionService.deleteTransaction(transaction_id)

        res.status(201).json({
            message: "Transaction Deleted!",
            ...result
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
    const user_id = req.userInfo.user_id

    if (!user_id) {
        return res.status(400).json({
            message: "Validation Failed!",
            error: "user_id is required"
        });
    }

    try {
        const transactions = await prisma.transactions.findMany({
            where: { user_id: user_id },
            orderBy: { created_at: 'desc' }  // newest first
        });

        res.status(200).json({
            message: "Found transactions",
            transactions
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a transaction by ID
const getTransactionById = async (req, res) => {
    const { transaction_id } = req.params;
    try {
        const transaction = await prisma.transactions.findUnique({
            where: { transaction_id: transaction_id }
        });

        if (!transaction) {
            return res.status(404).json({
                error: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Found transaction",
            transaction
        });
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