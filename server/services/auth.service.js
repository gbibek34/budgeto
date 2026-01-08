const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

const tokenGen = (user_id, email) => {
    return jwt.sign({ user_id, email }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const registerService = async (data) => {

    // Check for existing username
    const existingUser = await prisma.users.findUnique({
        where: { username: data.username }
    })

    // Check for existing email
    const existingEmail = await prisma.users.findUnique({
        where: { email: data.email }
    })

    if (existingUser) {
        throw new Error('Username already exists');
    } else if (existingEmail) {
        throw new Error('Email already exists');
    } else {

        //Hashing password
        const hashedPassword = await bcrypt.hash(data.cpassword, 10)

        // Saving/Creating the user
        const user = await prisma.users.create({
            data: {
                email: data.email,
                username: data.username,
                password_hash: hashedPassword,
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: data.phone_number
            }
        })

        // Generate JWT token
        const token = tokenGen(user.user_id, user.email)

        return { user, token };
    }
}

const loginService = async (data) => {
    // Check for user
    const user = await prisma.users.findUnique({
        where: { username: data.username }
    })

    if (!user) {
        throw new Error('Invalid username!');
    } else {
        const valid = await bcrypt.compare(data.password, user.password_hash)
        if (!valid) {
            throw new Error('Invalid credentials!');
        } else {

            // Generate JWT token
            const token = tokenGen(user.user_id, user.email)

            return { user, token }
        }
    }
}

module.exports = { registerService, loginService }