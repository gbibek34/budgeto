const prisma = require("../../shared/lib/prisma")

// Get a user by ID
const getUserById = async (req, res) => {
    const user_id = req.userInfo.user_id
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: user_id }
        })
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ message: "User found!", user })
    } catch (err) {
        console.error("Fetch user error:", err.message);
        res.status(500).json({ error: err });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const user_id = req.userInfo.user_id
    const { first_name, last_name, phone_number, email, username } = req.body;
    try {
        const user = await prisma.users.update({
            where: { user_id: user_id },
            data: {
                email,
                username,
                first_name,
                last_name,
                phone_number
            }
        })
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ message: "User updated!", user })
    } catch (err) {
        console.error("Update user error:", err.message);
        res.status(500).json({ error: err });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const user_id = req.userInfo.user_id
    try {
        const user = await prisma.users.delete({
            where: { user_id: user_id }
        })
        res.json({ message: "User deleted", user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getUserById,
    updateUser,
    deleteUser
};