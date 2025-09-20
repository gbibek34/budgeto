-- USERS
CREATE TABLE users (
    user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ACCOUNTS (where money lives: bank, cash, credit card, loan, savings)
CREATE TABLE accounts (
    account_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) NOT NULL
        CHECK (account_type IN ('asset','liability','savings')),
    balance DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * from accounts;

-- CATEGORIES (what money is used for: food, rent, salary, etc.)
CREATE TABLE categories (
    category_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(user_id),
    name VARCHAR(50) NOT NULL,
    category_type VARCHAR(10) NOT NULL 
        CHECK (category_type IN ('income','expense')),
    is_fixed BOOLEAN DEFAULT FALSE, -- true = fixed, false = variable
    parent_category_id INT REFERENCES categories(category_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRANSACTIONS (movement of money, tagged with category + accounts)
CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(user_id),
    account_id INT NOT NULL REFERENCES accounts(account_id), -- source/target
    category_id INT REFERENCES categories(category_id),
    amount DECIMAL(12,2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL 
        CHECK (transaction_type IN ('income','expense','transfer')),
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * from transactions;
ALTER TABLE transactions DROP COLUMN transaction_date;

-- BUDGETS (planned vs actual)
CREATE TABLE budgets (
    budget_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(user_id),
    category_id INT NOT NULL REFERENCES categories(category_id),
    month_year DATE NOT NULL, -- e.g., '2025-09-01'
    amount DECIMAL(12,2) NOT NULL
);

-- SAVINGS GOALS
CREATE TABLE savings_goals (
    goal_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    saved_amount DECIMAL(12,2) DEFAULT 0.00,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEBTS
CREATE TABLE debts (
    debt_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL REFERENCES users(user_id),
    provider VARCHAR(100) NOT NULL, -- e.g., "Rogers Credit"
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    remaining_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS debts CASCADE;