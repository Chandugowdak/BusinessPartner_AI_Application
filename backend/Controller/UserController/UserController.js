const User = require('../../model/User/UserSchema.js');


const UserLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({ message: "Login successful" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const UserRegister = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password, confirmPassword });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {UserLogin , UserRegister};