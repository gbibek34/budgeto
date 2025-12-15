const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./generated/prisma/client.js");

const dotenv = require("dotenv");

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

module.exports = prisma;