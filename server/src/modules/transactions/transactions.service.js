const prisma = require("../../shared/lib/prisma")

class TransactionService {
    async executeTransaction(typeId, { user_id, source_account_id, target_account_id, amount, ...rest }) {
        const transaction = await prisma.transactions.create({
            data: {
                user_id,
                transaction_type_id: typeId,
                source_account_id: source_account_id || null,
                target_account_id: target_account_id || null,
                amount,
                ...rest
            }
        });

        const updates = {};

        if (typeId === 1) {
            updates.target_account = await this.increaseBalance(target_account_id, amount);
        } else if (typeId === 2) {
            updates.source_account = await this.decreaseBalance(source_account_id, amount);
        } else if (typeId === 3) {
            updates.source_account = await this.decreaseBalance(source_account_id, amount);
            updates.target_account = await this.increaseBalance(target_account_id, amount);
        }

        return { transaction, ...updates };
    }

    async updateTransaction(transaction_id, { amount, source_account_id, target_account_id, transaction_type_id, ...rest }) {
        const oldTx = await prisma.transactions.findUnique({
            where: { transaction_id: transaction_id }
        })
        if (!oldTx) {
            throw new Error(`Transaction ${transaction_id} not found!`);
        }

        // Reverse old transactions
        if (oldTx.transaction_type_id === 1) {
            await this.decreaseBalance(oldTx.target_account_id, oldTx.amount);
        } else if (oldTx.transaction_type_id === 2) {
            await this.increaseBalance(oldTx.source_account_id, oldTx.amount);
        } else if (oldTx.transaction_type_id === 3) {
            await this.increaseBalance(oldTx.source_account_id, oldTx.amount);
            await this.decreaseBalance(oldTx.target_account_id, oldTx.amount);
        }

        // Updating the information
        const updatedTransaction = await prisma.transactions.update({
            where: { transaction_id: transaction_id },
            data: {
                transaction_type_id,
                source_account_id: source_account_id || null,
                target_account_id: target_account_id || null,
                amount,
                ...rest
            }
        });

        // Executing the calculations
        const updates = {};

        if (transaction_type_id === 1) {
            updates.target_account = await this.increaseBalance(target_account_id, amount);
        } else if (transaction_type_id === 2) {
            updates.source_account = await this.decreaseBalance(source_account_id, amount);
        } else if (transaction_type_id === 3) {
            updates.source_account = await this.decreaseBalance(source_account_id, amount);
            updates.target_account = await this.increaseBalance(target_account_id, amount);
        }

        return { transaction: updatedTransaction, ...updates };
    }

    async deleteTransaction(transaction_id) {
        const transaction = await prisma.transactions.findUnique({
            where: { transaction_id: transaction_id }
        })
        if (!transaction) {
            throw new Error(`Transaction ${transaction_id} not found!`);
        }

        // Reverse old transaction
        if (transaction.transaction_type_id === 1) {
            await this.decreaseBalance(transaction.target_account_id, transaction.amount);
        } else if (transaction.transaction_type_id === 2) {
            await this.increaseBalance(transaction.source_account_id, transaction.amount);
        } else if (transaction.transaction_type_id === 3) {
            await this.increaseBalance(transaction.source_account_id, transaction.amount);
            await this.decreaseBalance(transaction.target_account_id, transaction.amount);
        }

        // Updating the information
        const deletedTransaction = await prisma.transactions.delete({
            where: { transaction_id: transaction_id }
        });

        return { transaction: deletedTransaction }
    }

    async increaseBalance(accountId, amount) {
        const account = await prisma.accounts.findUnique({
            where: { account_id: accountId }
        })

        if (!account) {
            throw new Error(`Account ${accountId} not found!`);
        }

        const updatedAccount = await prisma.accounts.update({
            where: { account_id: accountId },
            data: { balance: account.balance + amount }
        })

        return updatedAccount
    }

    async decreaseBalance(accountId, amount) {
        const account = await prisma.accounts.findUnique({
            where: { account_id: accountId }
        })

        if (!account) {
            throw new Error(`Account ${accountId} not found!`);
        }

        const newBalance = account.balance - amount
        if (newBalance < 0) {
            throw new Error(`Insufficient balance in account ${account.account_name}`);
        }

        const updatedAccount = await prisma.accounts.update({
            where: { account_id: accountId },
            data: { balance: newBalance }
        })

        return updatedAccount
    }
}

module.exports = new TransactionService()