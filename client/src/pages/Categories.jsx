import React, { useEffect, useState } from "react";
import DashLayout from "../layouts/DashLayout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categories";

const emptyForm = {
    transaction_type_id: 2,
    category_name: "",
    is_fixed: false,
    parent_category_id: "",
};

const sortCategories = (categories, sortBy, sortOrder) => {
    return [...categories].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (sortBy === "category_name") {
            valA = valA?.toLowerCase() || "";
            valB = valB?.toLowerCase() || "";
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
};

const Categories = () => {
    const { user } = useAuth();
    const userId = user?.user_id
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [form, setForm] = useState(emptyForm);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Sorting state for each table
    const [incomeSort, setIncomeSort] = useState({ sortBy: "category_name", sortOrder: "asc" });
    const [expenseSort, setExpenseSort] = useState({ sortBy: "category_name", sortOrder: "asc" });

    useEffect(() => {
        fetchData();
    }, [userId]);

    async function fetchData() {
        setLoading(true);
        try {
            const cats = await getCategories(userId);
            setCategories(cats || []);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        } finally {
            setLoading(false);
        }
    }

    function openAddModal(type = 2) {
        setModalMode("add");
        setForm({ ...emptyForm, transaction_type_id: type });
        setEditingCategoryId(null);
        setIsModalOpen(true);
    }

    function openEditModal(category) {
        setModalMode("edit");
        setEditingCategoryId(category.category_id);
        setForm({
            transaction_type_id: category.transaction_type_id || 2,
            category_name: category.category_name || "",
            is_fixed: !!category.is_fixed,
            parent_category_id: category.parent_category_id || "",
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        if (actionLoading) return;
        setIsModalOpen(false);
        setEditingCategoryId(null);
        setForm(emptyForm);
    }

    function onChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = {
                user_id: userId,
                transaction_type_id: Number(form.transaction_type_id),
                category_name: (form.category_name || "").trim(),
                is_fixed: !!form.is_fixed,
                parent_category_id: form.parent_category_id === "" ? null : form.parent_category_id,
            };

            if (!payload.category_name) {
                alert("Category name is required");
                return;
            }

            if (modalMode === "add") {
                await createCategory(payload);
            } else if (modalMode === "edit" && editingCategoryId) {
                await updateCategory(editingCategoryId, payload);
            }

            await fetchData();
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to save category");
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDelete(category_id) {
        if (!window.confirm("Delete this category? This cannot be undone.")) return;
        setActionLoading(true);
        try {
            await deleteCategory(category_id);
            await fetchData();
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to delete category");
        } finally {
            setActionLoading(false);
        }
    }

    // Helper: Build tree structure for categories and sub-categories
    function buildCategoryTree(list) {
        const map = {};
        list.forEach((cat) => (map[cat.category_id] = { ...cat, children: [] }));
        const roots = [];
        list.forEach((cat) => {
            if (cat.parent_category_id) {
                map[cat.parent_category_id]?.children.push(map[cat.category_id]);
            } else {
                roots.push(map[cat.category_id]);
            }
        });
        return roots;
    }

    // Render category rows recursively
    function renderCategoryRows(categories, level = 0, type = "expense") {
        return categories.map((cat) => (
            <React.Fragment key={cat.category_id}>
                <tr className={level === 0 ? "bg-gray-50" : ""}>
                    <td className="py-2 px-3 w-full" style={{ paddingLeft: `${1 + (level * 2)}rem` }}>
                        {cat.category_name}
                    </td>
                    <td className="py-2 px-3 text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${cat.is_fixed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {cat.is_fixed ? "Fixed" : "Variable"}
                        </span>
                    </td>
                    <td className="py-2 px-3 text-right flex">
                        <button
                            onClick={() => openEditModal(cat)}
                            className="mr-2 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            aria-label={`Edit ${cat.category_name}`}
                        >
                            ✏️
                        </button>
                        <button
                            onClick={() => handleDelete(cat.category_id)}
                            className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            aria-label={`Delete ${cat.category_name}`}
                        >
                            🗑️
                        </button>
                    </td>
                </tr>
                {cat.children && cat.children.length > 0 && renderCategoryRows(cat.children, level + 1, type)}
            </React.Fragment>
        ));
    }

    // Separate and sort categories
    const incomeCategories = categories.filter((cat) => cat.transaction_type_id === 1);
    const expenseCategories = categories.filter((cat) => cat.transaction_type_id === 2);

    const sortedIncome = sortCategories(incomeCategories, incomeSort.sortBy, incomeSort.sortOrder);
    const sortedExpense = sortCategories(expenseCategories, expenseSort.sortBy, expenseSort.sortOrder);

    const incomeTree = buildCategoryTree(sortedIncome);
    const expenseTree = buildCategoryTree(sortedExpense);

    // Sorting handlers
    const handleSort = (type, sortBy) => {
        if (type === 1) {
            setIncomeSort((prev) => ({
                sortBy,
                sortOrder: prev.sortBy === sortBy ? (prev.sortOrder === "asc" ? "desc" : "asc") : "asc",
            }));
        } else {
            setExpenseSort((prev) => ({
                sortBy,
                sortOrder: prev.sortBy === sortBy ? (prev.sortOrder === "asc" ? "desc" : "asc") : "asc",
            }));
        }
    };

    // Sort icon
    const sortIcon = (currentSort, column) =>
        currentSort.sortBy === column ? (currentSort.sortOrder === "asc" ? "▲" : "▼") : "";

    return (
        <DashLayout>
            <div className="p-6">
                <div className="flex flex-col mb-5 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                        <div className="text-2xl font-semibold">Categories</div>
                        <p className="text-sm text-gray-500">Manage your income and expense categories</p>
                    </div>
                    <div>
                        <button
                            onClick={() => openAddModal(2)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            + Add Category
                        </button>
                    </div>
                </div>

                {/* Income Table */}
                <div className="mb-8">
                    <div className="text-lg font-bold mb-2 text-green-700">Income Categories</div>
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th
                                        className="py-2 px-3 w-full cursor-pointer select-none"
                                        onClick={() => handleSort("income", "category_name")}
                                    >
                                        Name {sortIcon(incomeSort, "category_name")}
                                    </th>
                                    <th
                                        className="py-2 px-3 text-right cursor-pointer select-none whitespace-nowrap"
                                        onClick={() => handleSort("income", "is_fixed")}
                                    >
                                        Fixed/Variable {sortIcon(incomeSort, "is_fixed")}
                                    </th>
                                    <th className="py-2 px-3 text-right">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-400">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : incomeTree.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-400">
                                            No income categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    renderCategoryRows(incomeTree, 0, "income")
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Table */}
                <div>
                    <div className="text-lg font-bold mb-2 text-blue-700">Expense Categories</div>
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th
                                        className="py-2 px-3 w-full cursor-pointer select-none"
                                        onClick={() => handleSort("expense", "category_name")}
                                    >
                                        Name {sortIcon(expenseSort, "category_name")}
                                    </th>
                                    <th
                                        className="py-2 px-3 text-right cursor-pointer select-none whitespace-nowrap"
                                        onClick={() => handleSort("expense", "is_fixed")}
                                    >
                                        Fixed/Variable {sortIcon(expenseSort, "is_fixed")}
                                    </th>
                                    <th className="py-2 px-3 text-right">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-400">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : expenseTree.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-400">
                                            No expense categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    renderCategoryRows(expenseTree, 0, "expense")
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalMode === "add" ? "Add Category" : "Edit Category"}
                    width="max-w-lg"
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                name="transaction_type_id"
                                value={form.transaction_type_id}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                                disabled={modalMode === "edit"}
                            >
                                <option value="1">Income</option>
                                <option value="2">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                name="category_name"
                                value={form.category_name}
                                onChange={onChange}
                                required
                                className="w-full border rounded px-3 py-2"
                                placeholder="e.g. Food, Rent, Salary"
                            />
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_fixed"
                                    checked={form.is_fixed}
                                    onChange={onChange}
                                    className="mr-2"
                                />
                                Fixed (recurring)
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Parent Category</label>
                            <select
                                name="parent_category_id"
                                value={form.parent_category_id}
                                onChange={onChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">None</option>
                                {categories
                                    .filter(
                                        (cat) =>
                                            cat.category_id !== editingCategoryId &&
                                            cat.transaction_type_id === form.transaction_type_id // only allow same type as parent
                                    )
                                    .map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                            </select>
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
                                    {actionLoading
                                        ? "Saving..."
                                        : modalMode === "add"
                                            ? "Add Category"
                                            : "Save Changes"}
                                </button>
                            </div>
                            {modalMode === "edit" && (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(editingCategoryId)}
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

export default Categories;