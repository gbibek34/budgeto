const jwt = require("jsonwebtoken");
const prisma = require('./prisma')
const config = require('../config')

module.exports.verifyUser = async function (req, res, next) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const data = jwt.verify(token, config.jwtSecret);

        // Find user in Postgres using Prisma
        const user = await prisma.users.findUnique({
            where: { user_id: data.user_id },
            select: {
                user_id: true,
                email: true,
                username: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid token: user not found" });
        }

        req.userInfo = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Invalid token", error: err });
    }
};