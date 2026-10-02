const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../../../generated/prisma/client.js");
const config = require('../config.js')

const connectionString = `${config.databaseUrl}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

module.exports = prisma;