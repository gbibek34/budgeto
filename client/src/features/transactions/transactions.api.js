import api from "../../shared/api/client"

// Create a new transaction
export const createTransaction = async (data) => {
    const res = await api.post("/transactions", data);
    return res.data;
};

// Get all transactions for a user
export const getTransactions = async () => {
    const res = await api.get("/transactions");
    return res.data.transactions;
};

// Get a transaction by ID
export const getTransactionById = async (transaction_id) => {
    const res = await api.get(`/transactions/${transaction_id}`);
    return res.data.transaction;
};

// Update a transaction
export const updateTransaction = async (transaction_id, data) => {
    const res = await api.put(`/transactions/${transaction_id}`, data);
    return res.data;
};

// Delete a transaction
export const deleteTransaction = async (transaction_id) => {
    const res = await api.delete(`/transactions/${transaction_id}`);
    return res.data.transaction;
};