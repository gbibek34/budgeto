const pool = require("../database/db");
const prisma = require("../config/prisma")

// console.log(Object.keys(prisma));
// console.log(prisma);

const createAccount = async (req, res) => {
    const user_id = req.userInfo.user_id
    const { account_name, account_type, balance } = req.body

    // Basic validation
    if (!account_name || !account_type || !balance) {
        return res.status(400).json({ message: "Validation Failed!", error: "Missing required fields" })
    } else if (account_type != "checking" && account_type != "savings") {
        return res.status(400).json({ message: "Validation Failed!", error: "Enter a valid account type" })
    }

    try {
        const account = await prisma.accounts.create({
            data: {
                user_id,
                account_name,
                account_type,
                balance
            }
        })

        res.status(201).json({ message: "Account Created!", account })
    } catch (err) {
        console.error("Create account error:", err);
        res.status(500).json({ error: err })
    }
}

// Get all accounts for a user
const getAccounts = async (req, res) => {
    const user_id = req.userInfo.user_id;
    try {
        const result = await prisma.accounts.findMany({
            where: { user_id: user_id }
        })
        res.json(result);
    } catch (err) {
        console.error("Create account error:", err.message);
        res.status(500).json({ error: err });
    }
};

// Get an account by ID
const getAccountById = async (req, res) => {
    const { account_id } = req.params;
    try {
        const result = await prisma.accounts.findUnique({
            where: { account_id: account_id }
        })
        if (result.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err });
    }
};

// Update an account
const updateAccount = async (req, res) => {
    const { account_id } = req.params;
    const { account_name, account_type, balance } = req.body;
    try {
        const result = await prisma.accounts.update({
            where: { account_id: account_id },
            data: {
                account_name,
                account_type,
                balance
            }
        })
        if (result.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err });
    }
};

// Delete an account
const deleteAccount = async (req, res) => {
    const { account_id } = req.params;
    try {
        const result = await prisma.accounts.delete({
            where: { account_id: account_id }
        })
        if (result.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json({ message: "Account deleted", account: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err });
    }
};

module.exports = {
    getAccounts,
    createAccount,
    getAccountById,
    updateAccount,
    deleteAccount
}