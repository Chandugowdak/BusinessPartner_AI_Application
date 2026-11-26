const User = require('../model/User/UserSchema');

const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('accountRole');
        if (!user || user.accountRole !== 'admin') {
            return res.status(403).json({ message: 'Administrator access required' });
        }
        req.account = user;
        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Could not verify administrator access', error: err.message });
    }
};

const requireFeature = (feature) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('accountRole permissions');
        if (!user) return res.status(401).json({ message: 'User account not found' });
        if (user.accountRole !== 'admin' && user.permissions?.[feature] !== true) {
            return res.status(403).json({ message: 'You do not have permission to access this feature' });
        }
        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Could not verify feature access', error: err.message });
    }
};

const requireAnyFeature = (features) => async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('accountRole permissions');
        if (!user) return res.status(401).json({ message: 'User account not found' });
        if (user.accountRole !== 'admin' && !features.some((feature) => user.permissions?.[feature] === true)) {
            return res.status(403).json({ message: 'You do not have permission to access this feature' });
        }
        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Could not verify feature access', error: err.message });
    }
};

module.exports = { requireAdmin, requireFeature, requireAnyFeature };
