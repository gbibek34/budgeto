import React, { useEffect, useState } from "react";
import DashLayout from "../layouts/DashLayout";
import Modal from "../components/Modal";
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from "../services/transactions";
import { getAccounts } from "../services/accounts";
import { getCategories } from "../services/categories";

const emptyForm = {
    transaction_type: "expense",
    source_account_id: "",
    target_account_id: "",
    category_id: "",
    amount: "",
    description: "",
    transaction_date: "",
};

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const userId = 1; // Replace with actual user id

    useEffect(() => {
        fetchAll();
    }, [userId]);

    async function fetchAll() {
        setLoading(true);
        try {
            const [txs, accs, cats] = await Promise.all([
                getTransactions(userId),
                getAccounts(userId),
                getCategories(userId),
            ]);
            setTransactions(txs || []);
            setAccounts(accs || []);
            setCategories(cats || []);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    }

    function openAddModal(type = "expense") {
        setModalMode("add");
        setEditingId(null);
        setForm({
            ...emptyForm,
            transaction_type: type,
            transaction_date: new Date().toISOString().slice(0, 10),
        });
        setIsModalOpen(true);
    }

    function openEditModal(tx) {
        setModalMode("edit");
        setEditingId(tx.transaction_id);
        setForm({
            transaction_type: tx.transaction_type,
            source_account_id: tx.source_account_id || "",
            target_account_id: tx.target_account_id || "",
            category_id: tx.category_id || "",
            amount: tx.amount,
            description: tx.description || "",
            transaction_date: tx.transaction_date || new Date().toISOString().slice(0, 10),
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        if (actionLoading) return;
        setIsModalOpen(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    function onChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = {
                user_id: userId,
                transaction_type: form.transaction_type,
                source_account_id: form.source_account_id ? Number(form.source_account_id) : null,
                target_account_id: form.target_account_id ? Number(form.target_account_id) : null,
                category_id: form.category_id ? Number(form.category_id) : null,
                amount: Number(form.amount),
                description: form.description,
                transaction_date: form.transaction_date,
            };

            // Validation (same as before)
            if (
                !payload.amount ||
                !payload.transaction_date ||
                (form.transaction_type === "expense" && !payload.source_account_id) ||
                (form.transaction_type === "income" && !payload.target_account_id) ||
                (form.transaction_type === "transfer" && (!payload.source_account_id || !payload.target_account_id)) ||
                !payload.transaction_type
            ) {
                alert("Please fill all required fields.");
                setActionLoading(false);
                return;
            }

            let response;
            if (modalMode === "add") {
                response = await createTransaction(payload);
            } else if (modalMode === "edit" && editingId) {
                response = await updateTransaction(editingId, payload);
            }
            // Update accounts state with returned accounts
            if (response && response.accounts) {
                setAccounts(response.accounts);
            }
            // Refresh transactions list
            await fetchAll();
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to save transaction");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDelete(transaction_id) {
        if (!window.confirm("Delete this transaction? This cannot be undone.")) return;
        setActionLoading(true);
        try {
            const response = await deleteTransaction(transaction_id);
            // Update accounts state with returned accounts
            if (response && response.accounts) {
                setAccounts(response.accounts);
            }
            // Refresh transactions list
            await fetchAll();
        } catch (err) {
            console.error(err);
            alert("Failed to delete transaction");
        } finally {
            setActionLoading(false);
        }
    }

    // Helpers
    const getAccountName = (id) => accounts.find((a) => a.account_id === id)?.name || "-";
    const getCategoryName = (id) => categories.find((c) => c.category_id === id)?.name || "-";
    const rowColor = (type) =>
        type === "income"
            ? "bg-green-50"
            : type === "expense"
                ? "bg-red-50"
                : "bg-blue-50";

    return (
        <DashLayout>
            <div className="p-6">
                <div className="flex flex-col mb-5 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                        <div className="text-2xl font-semibold">Transactions</div>
                        <p className="text-sm text-gray-500">View and manage your transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => openAddModal("income")}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            + Income
                        </button>
                        <button
                            onClick={() => openAddModal("expense")}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            + Expense
                        </button>
                        <button
                            onClick={() => openAddModal("transfer")}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            + Transfer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-3">Date</th>
                                <th className="py-2 px-3">Type</th>
                                <th className="py-2 px-3">Account(s)</th>
                                <th className="py-2 px-3">Category</th>
                                <th className="py-2 px-3 text-right">Amount</th>
                                <th className="py-2 px-3">Description</th>
                                <th className="py-2 px-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-gray-400">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.transaction_id} className={rowColor(tx.transaction_type)}>
                                        <td className="py-2 px-3 whitespace-nowrap">
                                            {tx.transaction_date
                                                ? new Date(tx.transaction_date).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="py-2 px-3 capitalize">{tx.transaction_type}</td>
                                        <td className="py-2 px-3">
                                            {tx.transaction_type === "transfer"
                                                ? `${getAccountName(tx.source_account_id)} → ${getAccountName(tx.target_account_id)}`
                                                : tx.transaction_type === "income"
                                                    ? getAccountName(tx.target_account_id)
                                                    : getAccountName(tx.source_account_id)}
                                        </td>
                                        <td className="py-2 px-3">{getCategoryName(tx.category_id)}</td>
                                        <td className="py-2 px-3 text-right font-semibold">
                                            {tx.transaction_type === "expense" ? "-" : ""}
                                            ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-2 px-3">{tx.description || "-"}</td>
                                        <td className="py-2 px-3 text-right">
                                            <button
                                                onClick={() => openEditModal(tx)}
                                                className="mr-2 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                                aria-label="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tx.transaction_id)}
                                                className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                                                aria-label="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Add/Edit Transaction */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={
                        modalMode === "add"
                            ? `Add ${form.transaction_type.charAt(0).toUpperCase() + form.transaction_type.slice(1)}`
                            : `Edit Transaction`
                    }
                    width="max-w-lg"
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                name="transaction_type"
                                value={form.transaction_type}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                                disabled={modalMode === "edit"}
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                                <option value="transfer">Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                name="transaction_date"
                                value={form.transaction_date}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        {form.transaction_type === "income" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">To Account</label>
                                <select
                                    name="target_account_id"
                                    value={form.target_account_id}
                                    onChange={onChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.account_id} value={acc.account_id}>
                                            {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {form.transaction_type === "expense" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">From Account</label>
                                <select
                                    name="source_account_id"
                                    value={form.source_account_id}
                                    onChange={onChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.account_id} value={acc.account_id}>
                                            {acc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {form.transaction_type === "transfer" && (
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">From</label>
                                    <select
                                        name="source_account_id"
                                        value={form.source_account_id}
                                        onChange={onChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select account</option>
                                        {accounts.map((acc) => (
                                            <option key={acc.account_id} value={acc.account_id}>
                                                {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">To</label>
                                    <select
                                        name="target_account_id"
                                        value={form.target_account_id}
                                        onChange={onChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select account</option>
                                        {accounts.map((acc) => (
                                            <option key={acc.account_id} value={acc.account_id}>
                                                {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">None</option>
                                {categories
                                    .filter((cat) =>
                                        form.transaction_type === "transfer"
                                            ? false
                                            : cat.category_type === form.transaction_type
                                    )
                                    .map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input
                                name="amount"
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="0.00"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <input
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                disabled={actionLoading}
                            >
                                {actionLoading
                                    ? "Saving..."
                                    : modalMode === "add"
                                        ? "Add Transaction"
                                        : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </DashLayout>
    );
};

export default Transactions;