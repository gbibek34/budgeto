const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    apiTimeout: import.meta.env.VITE_API_TIMEOUT || 5000,
    env: import.meta.env.MODE,
};

if (!config.apiUrl) {
    throw new Error(
        'Missing VITE_API_URL in .env'
    );
}

export default Object.freeze(config);