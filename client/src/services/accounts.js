import api from "./api";

export async function getAccounts(user_id) {
    const response = await api.get("/accounts", {
        params: { user_id }
    });
    return response.data;
}

export async function updateAccount(account_id, data) {
    const response = await api.put(`/accounts/${account_id}`, data);
    return response.data;
}

export async function deleteAccount(account_id) {
    const response = await api.delete(`/accounts/${account_id}`);
    return response.data;
}

export async function createAccount(data) {
    const response = await api.post("/accounts", data);
    return response.data;
}