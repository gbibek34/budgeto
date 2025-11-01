import React, { useEffect, useState } from "react";
import DashLayout from "../layouts/DashLayout";
import Modal from "../components/Modal";
import {
    getAccounts,
    updateAccount,
    deleteAccount,
    createAccount
} from "../services/accounts";

const emptyForm = { name: "", account_type: "asset", balance: "" };

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
    const [form, setForm] = useState(emptyForm);
    const [editingAccountId, setEditingAccountId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const userId = 1;

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    async function fetchData() {
        setLoading(true);
        try {
            const accs = await getAccounts(userId);
            setAccounts(accs || []);
        } catch (err) {
            console.error("Failed to fetch accounts", err);
        } finally {
            setLoading(false);
        }
    }

    function openAddModal() {
        setModalMode("add");
        setForm(emptyForm);
        setEditingAccountId(null);
        setIsModalOpen(true);
    }

    function openEditModal(account) {
        setModalMode("edit");
        setEditingAccountId(account.account_id);
        setForm({
            name: account.name || "",
            account_type: account.account_type || "asset",
            balance: account.balance != null ? String(account.balance) : ""
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        if (actionLoading) return;
        setIsModalOpen(false);
        setEditingAccountId(null);
        setForm(emptyForm);
    }

    function onChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = {
                user_id: userId,
                name: (form.name || "").trim(),
                account_type: form.account_type,
                balance: form.balance === "" ? 0 : parseFloat(form.balance)
            };

            if (!payload.name) {
                alert("Name is required");
                return;
            }

            if (modalMode === "add") {
                await createAccount(payload);
            } else if (modalMode === "edit" && editingAccountId) {
                console.log(editingAccountId)
                await updateAccount(editingAccountId, payload);
            }

            await fetchData();
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to save account");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDelete(account_id) {
        if (!window.confirm("Delete this account? This cannot be undone.")) return;
        setActionLoading(true);
        try {
            await deleteAccount(account_id);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to delete account");
        } finally {
            setActionLoading(false);
        }
    }

    // map accounts by account_type
    const assets = accounts.filter(a => a.account_type === "asset");
    const savings = accounts.filter(a => a.account_type === "savings");
    const liabilities = accounts.filter(a => a.account_type === "liability");

    const sum = list => list.reduce((s, a) => s + Number(a.balance || 0), 0);
    const totalAssets = sum(assets);
    const totalSavings = sum(savings);
    const totalLiabilities = sum(liabilities);
    const netWorth = totalAssets + totalSavings - totalLiabilities;

    return (
        <DashLayout>
            <div className="p-6">
                <div className="flex flex-col mb-5 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                        <div className="text-2xl font-semibold">Your Accounts</div>
                        <p className="text-sm text-gray-500">Overview of all your financial accounts</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="mt-4 lg:mt-0 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                        + Add Account
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 mb-5 rounded shadow">
                    <div>
                        <div className="text-sm text-gray-500">Net Worth</div>
                        <div className="text-lg font-bold">{loading ? "--" : `$${netWorth.toLocaleString()}`}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Assets</div>
                        <div className="text-lg font-bold">{loading ? "--" : `$${totalAssets.toLocaleString()}`}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Savings</div>
                        <div className="text-lg font-bold">{loading ? "--" : `$${totalSavings.toLocaleString()}`}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Liability</div>
                        <div className="text-lg font-bold">{loading ? "--" : `$${totalLiabilities.toLocaleString()}`}</div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <section className="flex-1 bg-white p-5 rounded shadow">
                        <div className="text-lg font-bold mb-3">Assets</div>
                        {assets.length === 0 ? (
                            <div className="text-sm text-gray-400">No asset accounts.</div>
                        ) : (
                            assets.map(acc => (
                                <div key={acc.account_id} className="flex justify-between gap-2 items-center py-2 border-b last:border-b-0">
                                    <div className="flex flex-1 justify-between">
                                        <div>{acc.name}</div>
                                        <div className="font-medium">${Number(acc.balance || 0).toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(acc)}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                            aria-label={`Edit ${acc.name}`}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(acc.account_id)}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                            aria-label={`Delete ${acc.name}`}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="flex-1 bg-white p-5 rounded shadow">
                        <div className="text-lg font-bold mb-3">Savings</div>
                        {savings.length === 0 ? (
                            <div className="text-sm text-gray-400">No savings accounts.</div>
                        ) : (
                            savings.map(acc => (
                                <div key={acc.account_id} className="flex justify-between gap-2 items-center py-2 border-b last:border-b-0">
                                    <div className="flex flex-1 justify-between">
                                        <div>{acc.name}</div>
                                        <div className="font-medium">${Number(acc.balance || 0).toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(acc)}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                            aria-label={`Edit ${acc.name}`}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(acc.account_id)}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                            aria-label={`Delete ${acc.name}`}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="flex-1 bg-white p-5 rounded shadow">
                        <div className="text-lg font-bold mb-3">Liability</div>
                        {liabilities.length === 0 ? (
                            <div className="text-sm text-gray-400">No liability accounts.</div>
                        ) : (
                            liabilities.map(acc => (
                                <div key={acc.account_id} className="flex justify-between gap-2 items-center py-2 border-b last:border-b-0">
                                    <div className="flex flex-1 justify-between">
                                        <div>{acc.name}</div>
                                        <div className="font-medium">-${Number(acc.balance || 0).toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(acc)}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                            aria-label={`Edit ${acc.name}`}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(acc.account_id)}
                                            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                                            aria-label={`Delete ${acc.name}`}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalMode === "add" ? "Add Account" : "Edit Account"}
                    width="max-w-lg"
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                className="w-full border rounded px-3 py-2"
                                placeholder="e.g. Checking, Visa"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                name="account_type"
                                value={form.account_type}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="asset">Asset</option>
                                <option value="savings">Savings</option>
                                <option value="liability">Liability</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Balance</label>
                            <input
                                name="balance"
                                type="number"
                                step="0.01"
                                value={form.balance}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-2">
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
                                    {actionLoading ? "Saving..." : modalMode === "add" ? "Add Account" : "Save Changes"}
                                </button>
                            </div>

                            {modalMode === "edit" && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!editingAccountId) return;
                                        if (!window.confirm("Delete this account?")) return;
                                        setActionLoading(true);
                                        try {
                                            await deleteAccount(editingAccountId);
                                            await fetchData();
                                            closeModal();
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to delete account");
                                        } finally {
                                            setActionLoading(false);
                                        }
                                    }}
                                    className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                    disabled={actionLoading}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </form>
                </Modal>
            </div>
        </DashLayout>
    );
};

export default Accounts;