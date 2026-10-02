const express = require('express');
const config = require('./shared/config')
const cors = require('cors');


const app = express();

const authRoutes = require("./modules/auth/auth.routes")
const usersRoutes = require("./modules/users/users.routes")
const accountsRoutes = require("./modules/accounts/accounts.routes")
const categoriesRoutes = require("./modules/categories/categories.routes")
// const debtsRoutes = require("./modules/debts/debts.routes")
// const budgetsRoutes = require("./modules/budgets/budgets.routes")
// const savingsRoutes = require("./modules/savings_goals/savings_goals.routes")
const transactionsRoutes = require("./modules/transactions/transactions.routes")

// Middleware
app.use(cors({
    origin: config.origin, // change to your front-end origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/categories", categoriesRoutes);
// app.use("/api/debts", debtRoutes);
// app.use("/api/budgets", budgetsRoutes);
// app.use("/api/savings_goals", savingsRoutes);
app.use("/api/transactions", transactionsRoutes);

module.exports = app