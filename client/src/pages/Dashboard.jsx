import DashLayout from "../layouts/DashLayout"
import React, { useEffect, useState } from "react";
import { getAccounts } from "../services/accounts";
// import { getTransactions } from "../services/transactions"; // Uncomment if implemented


const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    // const [transactions, setTransactions] = useState([]); // Uncomment if using
    const [loading, setLoading] = useState(true);
    const userId = 1;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const acc = await getAccounts(userId);
                setAccounts(acc);

                // If you have transactions:
                // const txs = await getTransactions(userId);
                // setTransactions(txs);
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId]);

    // Calculate Net Worth
    const totalAssets = accounts
        .filter(a => a.account_type === "asset" || a.account_type === "savings")
        .reduce((sum, a) => sum + Number(a.balance), 0);
    const totalLiabilities = accounts
        .filter(a => a.account_type === "liability")
        .reduce((sum, a) => sum + Number(a.balance), 0);
    const netWorth = totalAssets - totalLiabilities;

    // Placeholder values for income/expenses/transfers
    // Replace with real calculations if you have transactions data
    const thisMonthIncome = "--";
    const thisMonthExpenses = "--";
    const transfersMade = "--";

    return (
        <DashLayout>
            <div className="p-8 space-y-8">
                {/* Top Row: Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                        <span className="text-3xl mb-2">📌</span>
                        <h3 className="font-semibold text-lg mb-1">Total Balance (Net Worth)</h3>
                        <div className="text-2xl font-bold">
                            {loading ? "--" : `$${netWorth.toLocaleString()}`}
                        </div>
                        <div className="text-gray-500 text-sm">Assets – Liabilities</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                        <span className="text-3xl mb-2">💰</span>
                        <h3 className="font-semibold text-lg mb-1">This Month’s Income</h3>
                        <div className="text-2xl font-bold">${thisMonthIncome}</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                        <span className="text-3xl mb-2">💸</span>
                        <h3 className="font-semibold text-lg mb-1">This Month’s Expenses</h3>
                        <div className="text-2xl font-bold">${thisMonthExpenses}</div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center shadow">
                        <span className="text-3xl mb-2">🔁</span>
                        <h3 className="font-semibold text-lg mb-1">Transfers Made</h3>
                        <div className="text-2xl font-bold">${transfersMade}</div>
                    </div>
                </div>

                {/* Middle Row: Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2 bg-white rounded-xl p-6 shadow flex flex-col">
                        <h3 className="font-semibold text-lg mb-4">📈 Cashflow Graph</h3>
                        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg h-52 text-gray-400">
                            [Cashflow Graph Placeholder]
                        </div>
                        <div className="text-gray-500 text-sm mt-2">Income vs Expense trend</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow flex flex-col">
                        <h3 className="font-semibold text-lg mb-4">🗂 Spending by Category</h3>
                        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg h-52 text-gray-400">
                            [Pie/Bar Chart Placeholder]
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Budget Tracker Card */}
                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="font-semibold text-lg mb-4">🎯 Budget Tracker</h3>
                        <div className="mb-4">
                            <div className="mb-1">Groceries</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mb-1">Utilities</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm">[Add more categories]</div>
                    </div>
                    {/* Savings Goals Card */}
                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="font-semibold text-lg mb-4">💡 Savings Goals</h3>
                        <div className="mb-4">
                            <div className="mb-1">Vacation</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="mb-1">Emergency Fund</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-sm">[Add more goals]</div>
                    </div>
                    {/* Debts Card */}
                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="font-semibold text-lg mb-4">🏦 Debts</h3>
                        <div className="mb-4">
                            <div className="mb-1">Credit Card</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                            </div>
                            <div className="text-xs text-gray-500">50% repaid</div>
                        </div>
                        <div className="mb-4">
                            <div className="mb-1">Student Loan</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div className="bg-blue-700 h-2 rounded-full" style={{ width: "20%" }}></div>
                            </div>
                            <div className="text-xs text-gray-500">20% repaid</div>
                        </div>
                        <div className="text-gray-400 text-sm">[Add more debts]</div>
                    </div>
                </div>
            </div>
        </DashLayout>
    )
}

export default Dashboard