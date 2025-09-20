import DashLayout from "../layouts/DashLayout";
import React, { useEffect, useState } from "react";
import {
    getAccounts,
    updateAccount,
    deleteAccount,
    createAccount
} from "../services/accounts";

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editBalance, setEditBalance] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({
        name: "",
        account_type: "asset",
        balance: ""
    });
    const userId = 1;

    useEffect(() => {
        fetchAccounts();
        // eslint-disable-next-line
    }, [userId]);

    async function fetchAccounts() {
        setLoading(true);
        try {
            const data = await getAccounts(userId);
            setAccounts(data);
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleEditClick = (account) => {
        setEditingId(account.account_id);
        setEditBalance(account.balance);
    };

    const handleEditSave = async (account) => {
        try {
            await updateAccount(account.account_id, {
                ...account,
                balance: parseFloat(editBalance)
            });
            setEditingId(null);
            fetchAccounts();
        } catch (err) {
            alert("Failed to update balance.");
        }
    };

    const handleDelete = async (account_id) => {
        if (!window.confirm("Delete this account?")) return;
        try {
            await deleteAccount(account_id);
            fetchAccounts();
        } catch (err) {
            alert("Failed to delete account.");
        }
    };

    const handleAddChange = (e) => {
        setAddForm({ ...addForm, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAccount({
                ...addForm,
                user_id: userId,
                balance: parseFloat(addForm.balance) || 0
            });
            setShowAdd(false);
            setAddForm({ name: "", account_type: "asset", balance: "" });
            fetchAccounts();
        } catch (err) {
            alert("Failed to add account.");
        }
    };

    return (
        <DashLayout>
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Accounts</h2>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => setShowAdd(true)}
                    >
                        + Add Account
                    </button>
                </div>
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Type</th>
                                    <th className="py-3 px-4 text-right">Balance</th>
                                    <th className="py-3 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(account => (
                                    <tr key={account.account_id} className="border-b last:border-b-0">
                                        <td className="py-3 px-4">{account.name}</td>
                                        <td className="py-3 px-4 capitalize">{account.account_type}</td>
                                        <td className="py-3 px-4 text-right">
                                            {editingId === account.account_id ? (
                                                <input
                                                    type="number"
                                                    value={editBalance}
                                                    onChange={e => setEditBalance(e.target.value)}
                                                    className="border rounded px-2 py-1 w-24 text-right"
                                                />
                                            ) : (
                                                <>${Number(account.balance).toLocaleString()}</>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center space-x-2">
                                            {editingId === account.account_id ? (
                                                <>
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        onClick={() => handleEditSave(account)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                        onClick={() => handleEditClick(account)}
                                                    >
                                                        Adjust Balance
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        onClick={() => handleDelete(account.account_id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {accounts.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-gray-400">
                                            No accounts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add Account Modal */}
                {showAdd && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Add Account</h3>
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-1 font-medium">Name</label>
                                    <input
                                        name="name"
                                        value={addForm.name}
                                        onChange={handleAddChange}
                                        required
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Type</label>
                                    <select
                                        name="account_type"
                                        value={addForm.account_type}
                                        onChange={handleAddChange}
                                        className="w-full border rounded px-3 py-2"
                                    >
                                        <option value="asset">Asset</option>
                                        <option value="liability">Liability</option>
                                        <option value="savings">Savings</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Balance</label>
                                    <input
                                        name="balance"
                                        type="number"
                                        value={addForm.balance}
                                        onChange={handleAddChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                        onClick={() => setShowAdd(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashLayout>
    );
}

export default Accounts;