const User = require('../../model/User/UserSchema.js');
const { getPublicUser, hashGovernmentId, normalizePhone, normalizeUrl, isValidPhone, PUBLIC_USER_FIELDS } = require('./UserController');

const HandleUserUpdate = async(req,res)=>{
    const { userId } = req.params;
    const { name, email, phone, linkedInUrl, xUrl, professionalField, role, governmentIdType, governmentId, photoUrl } = req.body;
    try{
         if (String(req.user.userId) !== String(userId)) {
          return res.status(403).json({ message: 'You can only update your own profile' });
         }
       const VerifyExistUser = await User.findById(userId);
       if(!VerifyExistUser){
        return res.status(404).json({ message: 'User not found' });
       }
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedName) return res.status(400).json({ message: 'Full name is required.' });
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (!role?.trim()) return res.status(400).json({ message: 'Choose a role for your profile.' });

    const updates = {
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizePhone(phone),
        linkedInUrl: normalizeUrl(linkedInUrl),
        xUrl: normalizeUrl(xUrl),
        professionalField: professionalField?.trim(),
        role: role?.trim(),
    };

    if (photoUrl !== undefined) {
        if (typeof photoUrl !== 'string') {
            return res.status(400).json({ message: 'Enter a valid HTTP or HTTPS photo URL.' });
        }
        const normalizedPhotoUrl = photoUrl.trim();
        if (normalizedPhotoUrl) {
            try {
                const parsedPhotoUrl = new URL(normalizedPhotoUrl);
                if (!['http:', 'https:'].includes(parsedPhotoUrl.protocol) || !parsedPhotoUrl.hostname || normalizedPhotoUrl.length > 2048) {
                    return res.status(400).json({ message: 'Enter a valid HTTP or HTTPS photo URL up to 2048 characters.' });
                }
            } catch {
                return res.status(400).json({ message: 'Enter a valid HTTP or HTTPS photo URL up to 2048 characters.' });
            }
        }
        updates.photoUrl = normalizedPhotoUrl;
    }

    if (!isValidPhone(updates.phone)) {
        return res.status(400).json({ message: 'Enter a valid phone number with 10 to 15 digits.' });
    }

    if (governmentId !== undefined && governmentId.trim() !== '') {
        if (!['aadhaar', 'pan', 'other'].includes(governmentIdType)) {
            return res.status(400).json({ message: 'Choose Aadhaar, PAN, or another ID type.' });
        }
        const normalizedId = governmentId?.trim().toUpperCase();
        const validId = governmentIdType === 'aadhaar'
            ? /^\d{12}$/.test(normalizedId)
            : governmentIdType === 'pan'
                ? /^[A-Z]{5}\d{4}[A-Z]$/.test(normalizedId)
                : /^[A-Z0-9-]{5,30}$/.test(normalizedId);
        if (!validId) {
            return res.status(400).json({ message: `Enter a valid ${governmentIdType} number.` });
        }
        updates.governmentIdType = governmentIdType;
        updates.governmentIdLast4 = normalizedId.slice(-4);
        updates.governmentIdHash = hashGovernmentId(normalizedId);
        updates.verificationStatus = 'pending';
    }

    const UpdateUser = await User.findByIdAndUpdate(userId,updates,{new:true, runValidators:true}).select(PUBLIC_USER_FIELDS);
       if(!UpdateUser){
        return res.status(400).json({ message: 'Failed to update user' });
       }else{
        res.status(200).json({ message: 'Profile updated. Identity verification is pending review.', user: getPublicUser(UpdateUser) });
       } 
    }
    catch(err){
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern || {})[0];
            const labels = { email: 'email address', phone: 'phone number', linkedInUrl: 'LinkedIn profile', xUrl: 'X profile', governmentIdHash: 'government ID' };
            return res.status(409).json({ message: `That ${labels[duplicateField] || 'profile detail'} is already linked to another account.` });
        }
        if (err.name === 'ValidationError') {
            const validationMessage = Object.values(err.errors).map((item) => item.message).join(' ');
            return res.status(400).json({ message: validationMessage || 'Please check your profile details.' });
        }
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
}

const ListUsers = async (req, res) => {
    try {
        const search = req.query.search?.trim();
        const role = req.query.role?.trim();
        const requestedPage = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const pageSize = Math.min(50, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 6));
        const filters = { _id: { $ne: req.user.userId } };
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filters.$or = [{ name: { $regex: escapedSearch, $options: 'i' } }, { role: { $regex: escapedSearch, $options: 'i' } }];
        }
        if (role) filters.role = role;
        const total = await User.countDocuments(filters);
        const totalPages = Math.ceil(total / pageSize);
        const page = totalPages ? Math.min(requestedPage, totalPages) : 1;
        const users = await User.find(filters).select(PUBLIC_USER_FIELDS).sort({ name: 1 }).skip((page - 1) * pageSize).limit(pageSize);
        res.status(200).json({
            users: users.map(getPublicUser),
            pagination: { page, pageSize, total, totalPages },
        });
    } catch (err) {
        res.status(500).json({ message: 'Could not load partners', error: err.message });
    }
};

module.exports = { HandleUserUpdate, ListUsers };