const User = require('../../model/User/UserSchema');
const bcrypt = require('bcrypt');
const { getPublicUser, AUTH_USER_FIELDS } = require('./UserController');

const FEATURE_KEYS = [
    'home',
    'jobs',
    'findPartners',
    'connections',
    'requests',
    'emailHistory',
    'emailConfiguration',
    'emailScheduler',
];

const listManagedUsers = async (req, res) => {
    try {
        const users = await User.find({ accountRole: 'user' })
            .select(AUTH_USER_FIELDS)
            .sort({ name: 1 });
        return res.status(200).json({ users: users.map((user) => getPublicUser(user, true)) });
    } catch (err) {
        return res.status(500).json({ message: 'Could not load users', error: err.message });
    }
};

const updateUserPermissions = async (req, res) => {
    const { userId } = req.params;
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
        return res.status(400).json({ message: 'Provide a permissions object.' });
    }
    if (Object.keys(permissions).some((key) => !FEATURE_KEYS.includes(key))
        || FEATURE_KEYS.some((key) => typeof permissions[key] !== 'boolean')) {
        return res.status(400).json({ message: 'Provide a boolean permission for every available feature.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId, accountRole: 'user' },
            { $set: { permissions } },
            { new: true, runValidators: true },
        ).select(AUTH_USER_FIELDS);
        if (!user) return res.status(404).json({ message: 'Standard user not found' });
        return res.status(200).json({ message: 'Permissions updated.', user: getPublicUser(user, true) });
    } catch (err) {
        return res.status(500).json({ message: 'Could not update permissions', error: err.message });
    }
};

const createManagedAdmin = async (req, res) => {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const { password, confirmPassword } = req.body;

    if (!name) return res.status(400).json({ message: 'Full name is required.' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    if (typeof password !== 'string' || password.length < 12) {
        return res.status(400).json({ message: 'Administrator passwords must contain at least 12 characters.' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: passwordHash, accountRole: 'admin' });
        return res.status(201).json({
            message: 'Administrator account created.',
            user: getPublicUser(user, true),
        });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(409).json({ message: 'An account already uses that email address.' });
        }
        if (err.name === 'ValidationError') {
            const validationMessage = Object.values(err.errors).map((item) => item.message).join(' ');
            return res.status(400).json({ message: validationMessage || 'Please check the account details.' });
        }
        return res.status(500).json({ message: 'Could not create administrator account', error: err.message });
    }
};

module.exports = { listManagedUsers, updateUserPermissions, createManagedAdmin };
