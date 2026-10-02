import { useState } from "react"
import { useFetch } from "../../shared/hooks/useFetch"

import Modal from "../../shared/components/Modal"
import DashLayout from "../../layouts/DashLayout"

import { getAccounts, createAccount } from "./Accounts.api"
import { ACCOUNT_LIST } from "../../shared/constants/accounts"

const emptyForm = {
    account_name: "",
    account_type: "checking",
    balance: 0
}

const AccountsPage = () => {
    const { data: accounts, loading, error } = useFetch(getAccounts)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState(null)

    function onChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
    }

    if (loading) return <DashLayout><div className="p-6">Loading accounts…</div></DashLayout>
    if (error) return <DashLayout><div className="p-6 text-red-600">{error}</div></DashLayout>

    const netWorth = accounts.reduce((sum, acc) => {
        return sum + Number(acc.balance)
    }, 0)

    return (
        <DashLayout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Your Accounts</h1>
                <p className="text-sm text-gray-500">Overview of all your financial accounts</p>

                <div className="bg-white rounded shadow p-4 my-5">
                    <div className="text-sm text-gray-500">Net Worth</div>
                    <div className="text-lg font-bold">${netWorth.toLocaleString()}</div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                    {ACCOUNT_LIST.map((type) => {

                        const group = accounts.filter((acc) => acc.account_type === type.value)

                        return (
                            <section key={type.value} className="flex-1 bg-white p-5 rounded shadow">
                                <h2 className="text-lg font-bold mb-3">{type.label}</h2>

                                {group.length === 0 ? (
                                    <p className="text-sm text-gray-400">No {type.label} accounts yet.</p>
                                ) : (
                                    group.map((acc) => (
                                        <div key={acc.account_id} className="flex justify-between py-2 border-b last:border-b-0">
                                            <span>{acc.account_name}</span>
                                            <span className="font-medium">
                                                ${Number(acc.balance).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </section>
                        )
                    })}
                </div>
            </div>
        </DashLayout>
    )
}

export default AccountsPage