const jwt = require("jsonwebtoken");
const prisma = require('../config/prisma')
const dotenv = require("dotenv");

dotenv.config();

module.exports.verifyUser = async function (req, res, next) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);

        // Find user in Postgres using Prisma
        const user = await prisma.users.findUnique({
            where: { user_id: data.user_id }
        });

        if (!user) {
            return res.status(401).json({ msg: "Invalid token: user not found" });
        }

        req.userInfo = user;
        next();
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: "Invalid token", error: e });
    }
};