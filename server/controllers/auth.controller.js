const { registerService, loginService } = require("../services/auth.service")

// Register User
const register = async (req, res) => {
    try {
        const { email, username, password, cpassword } = req.body;

        if (!email, !username, !password, !cpassword) {
            return res.status(400).json({ message: "Validation Failed!", error: "Add all required fields" })
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ message: "Validation Failed!", error: "Invalid email" })
        } else if (password !== cpassword) {
            return res.status(400).json({ message: "Validation Failed!", error: "Passwords don't match" })
        } else if (cpassword.length < 8) {
            return res.status(400).json({ message: "Validation Failed!", error: "Password must be at least 8 characters long" })
        } else {
            //Creating user using service
            const { user, token } = await registerService(req.body);

            //Omit password from response
            const { password_hash, ...userWithoutPassword } = user;

            res.status(201).json({ message: "User Registered!", user: userWithoutPassword, token });

        }
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Registration Failed!", error: `${err.message}` });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username, !password) {
            return res.status(400).json({ message: "Validation Failed!", error: "Add all required fields" })
        } else {
            //Creating user using service
            const { user, token } = await loginService(req.body);

            //omit password from response
            const { password_hash, ...userWithoutPassword } = user;

            res.status(201).json({ message: "Logged In!", user: userWithoutPassword, token });
        }
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: "Login Failed!", error: `${err.message}` });
    }
}

module.exports = { register, login }