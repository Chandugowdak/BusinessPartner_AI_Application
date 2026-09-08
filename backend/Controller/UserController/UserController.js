const User = require('../../model/User/UserSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const PUBLIC_USER_FIELDS = '_id name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus';
const normalizeUrl = (value) => value?.trim().replace(/\/$/, '').toLowerCase();
const normalizePhone = (value) => value?.replace(/[\s()-]/g, '');
const hashGovernmentId = (value) => crypto.createHash('sha256').update(value.trim().toUpperCase()).digest('hex');
const getPublicUser = (user) => ({
    ...Object.fromEntries(PUBLIC_USER_FIELDS.split(' ').filter(Boolean).map((field) => [field, user[field]])),
    profileCompletion: user.getProfileCompletion(),
});


const UserLogin = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isHashMatch = await bcrypt.compare(password, user.password).catch(() => false);
        const isLegacyPasswordMatch = !isHashMatch && user.password === password;

        if (!isHashMatch && !isLegacyPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (isLegacyPasswordMatch) {
            user.password = await bcrypt.hash(password, 10);
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: "Login successful",
            token,
            user: getPublicUser(user),
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const UserRegister = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const normalizedEmail = email?.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password,10);

        const newUser = new User({ name: name?.trim(), email: normalizedEmail, password: hashPassword });
        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = { UserLogin, UserRegister, getPublicUser, hashGovernmentId, normalizePhone, normalizeUrl, PUBLIC_USER_FIELDS };