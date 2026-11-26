const User = require('../../model/User/UserSchema.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const PUBLIC_USER_FIELDS = '_id name email phone linkedInUrl xUrl professionalField role photoUrl governmentIdType governmentIdLast4 verificationStatus';
const AUTH_USER_FIELDS = `${PUBLIC_USER_FIELDS} accountRole permissions`;
const normalizeUrl = (value) => value?.trim().replace(/\/$/, '').toLowerCase();
const normalizePhone = (value) => value?.replace(/[\s()-]/g, '');
const isValidPhone = (value) => !value || /^\+?[0-9]{10,15}$/.test(value);
const hashGovernmentId = (value) => crypto.createHash('sha256').update(value.trim().toUpperCase()).digest('hex');
let firstAdminBootstrapIndex;
const ensureFirstAdminBootstrapIndex = () => {
    if (!firstAdminBootstrapIndex) {
        firstAdminBootstrapIndex = User.collection.createIndex(
            { firstAdminBootstrap: 1 },
            {
                unique: true,
                partialFilterExpression: { firstAdminBootstrap: true },
                name: 'unique_first_admin_bootstrap',
            },
        ).catch((error) => {
            firstAdminBootstrapIndex = null;
            throw error;
        });
    }
    return firstAdminBootstrapIndex;
};
const getPublicUser = (user, includeAccess = false) => ({
    ...Object.fromEntries(PUBLIC_USER_FIELDS.split(' ').filter(Boolean).map((field) => [field, user[field]])),
    ...(includeAccess ? { accountRole: user.accountRole, permissions: user.permissions } : {}),
    profileCompletion: user.getProfileCompletion(),
});


const UserLogin = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const requestedAccountRole = req.body.accountRole;
    if (requestedAccountRole !== undefined && !['user', 'admin'].includes(requestedAccountRole)) {
        return res.status(400).json({ message: 'Choose a valid account type.' });
    }
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

        if (requestedAccountRole && user.accountRole !== requestedAccountRole) {
            return res.status(403).json({ message: `This account is not registered as ${requestedAccountRole === 'admin' ? 'an administrator' : 'a user'}.` });
        }

        if (isLegacyPasswordMatch) {
            user.password = await bcrypt.hash(password, 10);
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: "Login successful",
            token,
            user: getPublicUser(user, true),
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const GetCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(AUTH_USER_FIELDS);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user: getPublicUser(user, true) });
    } catch (err) {
        return res.status(500).json({ message: 'Could not load your account', error: err.message });
    }
};

const GetAdminBootstrapStatus = async (req, res) => {
    try {
        await ensureFirstAdminBootstrapIndex();
        const adminExists = await User.exists({ accountRole: 'admin' });
        return res.status(200).json({ canRegisterAdmin: !adminExists });
    } catch (err) {
        return res.status(500).json({ message: 'Could not verify administrator registration status', error: err.message });
    }
};

const UserRegister = async (req, res) => {
    const {
        name,
        email,
        password,
        confirmPassword,
        accountRole = 'user',
    } = req.body;
    if (!['user', 'admin'].includes(accountRole)) {
        return res.status(400).json({ message: 'Choose a valid account type.' });
    }
    try {
        if (typeof password !== 'string' || password.length < (accountRole === 'admin' ? 12 : 8)) {
            return res.status(400).json({
                message: accountRole === 'admin'
                    ? 'Administrator passwords must contain at least 12 characters.'
                    : 'Passwords must contain at least 8 characters.',
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const normalizedEmail = email?.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (accountRole === 'admin') {
            await ensureFirstAdminBootstrapIndex();
            const adminExists = await User.exists({ accountRole: 'admin' });
            if (adminExists) {
                return res.status(403).json({
                    message: 'An administrator already exists. Only an existing administrator can create additional administrator accounts.',
                });
            }
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name: name?.trim(),
            email: normalizedEmail,
            password: hashPassword,
            accountRole,
            ...(accountRole === 'admin' ? { firstAdminBootstrap: true } : {}),
        });
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
        if (err.code === 11000 && err.keyPattern?.firstAdminBootstrap) {
            return res.status(403).json({
                message: 'An administrator already exists. Only an existing administrator can create additional administrator accounts.',
            });
        }
        if (err.code === 11000 && err.keyPattern?.email) {
            return res.status(409).json({ message: 'An account already uses that email address.' });
        }
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


module.exports = { UserLogin, UserRegister, GetCurrentUser, GetAdminBootstrapStatus, getPublicUser, hashGovernmentId, normalizePhone, normalizeUrl, isValidPhone, PUBLIC_USER_FIELDS, AUTH_USER_FIELDS };