import api from "./api";

// Create a new category
export const createCategory = async (data) => {
    const res = await api.post("/categories", data);
    return res.data;
};

// Get all categories for a user
export const getCategories = async (user_id) => {
    const res = await api.get("/categories", { params: { user_id } });
    return res.data;
};

// Get a category by ID
export const getCategoryById = async (category_id) => {
    const res = await api.get(`/categories/${category_id}`);
    return res.data;
};

// Update a category
export const updateCategory = async (category_id, data) => {
    const res = await api.put(`/categories/${category_id}`, data);
    return res.data;
};

// Delete a category
export const deleteCategory = async (category_id) => {
    const res = await api.delete(`/categories/${category_id}`);
    return res.data;
};