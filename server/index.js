const config = require('./src/shared/config')
const app = require("./src/app")

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});