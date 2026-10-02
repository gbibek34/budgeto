require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    origin: process.env.ORIGIN || "http://localhost:5173",
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
};

const requiredKeys = [
    'databaseUrl',
    'jwtSecret'
];

requiredKeys.forEach((key) => {
    if (!config[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
});

module.exports = Object.freeze(config);