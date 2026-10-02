import api from "../../shared/api/client"

export async function getAccounts() {
    const response = await api.get("/accounts");
    return response.data.accounts;
}

export async function updateAccount(account_id, data) {
    const response = await api.put(`/accounts/${account_id}`, data);
    return response.data.account;
}

export async function deleteAccount(account_id) {
    const response = await api.delete(`/accounts/${account_id}`);
    return response.data.account;
}

export async function createAccount(data) {
    const response = await api.post("/accounts", data);
    return response.data.account;
}