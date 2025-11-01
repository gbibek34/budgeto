const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const usersRoutes = require("./routes/users")
const accountsRoutes = require("./routes/accounts")
const categoriesRoutes = require("./routes/categories")
const transactionsRoutes = require("./routes/transactions")

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // change to your front-end origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});