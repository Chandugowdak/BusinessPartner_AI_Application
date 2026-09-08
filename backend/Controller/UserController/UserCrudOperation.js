const User = require('../../model/User/UserSchema.js');
const { getPublicUser, hashGovernmentId, normalizePhone, normalizeUrl, PUBLIC_USER_FIELDS } = require('./UserController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDirectory = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });
const photoUpload = multer({
    storage: multer.diskStorage({
        destination: uploadDirectory,
        filename: (_req, file, callback) => callback(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`),
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => callback(null, file.mimetype.startsWith('image/')),
});


const HandleUserUpdate = async(req,res)=>{
    const { userId } = req.params;
    const { name, email, phone, linkedInUrl, xUrl, professionalField, role, governmentIdType, governmentId } = req.body;
    try{
         if (req.user.userId !== userId) {
          return res.status(403).json({ message: 'You can only update your own profile' });
         }
       const VerifyExistUser = await User.findById(userId);
       if(!VerifyExistUser){
        return res.status(404).json({ message: 'User not found' });
       }
    const updates = {
        name: name?.trim(),
        email: email?.trim().toLowerCase(),
        phone: normalizePhone(phone),
        linkedInUrl: normalizeUrl(linkedInUrl),
        xUrl: normalizeUrl(xUrl),
        professionalField: professionalField?.trim(),
        role: role?.trim(),
    };

    if (governmentId !== undefined || governmentIdType !== undefined) {
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
            return res.status(409).json({ message: 'Phone, social profile, or government ID is already linked to another account.' });
        }
        res.status(500).json({ message: 'Error updating user', error: err });
    }
}

const ListUsers = async (req, res) => {
    try {
        const search = req.query.search?.trim();
        const role = req.query.role?.trim();
        const filters = { _id: { $ne: req.user.userId } };
        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filters.$or = [{ name: { $regex: escapedSearch, $options: 'i' } }, { role: { $regex: escapedSearch, $options: 'i' } }];
        }
        if (role) filters.role = role;
        const users = await User.find(filters).select(PUBLIC_USER_FIELDS).sort({ name: 1 }).limit(100);
        res.status(200).json({ users: users.map(getPublicUser) });
    } catch (err) {
        res.status(500).json({ message: 'Could not load partners', error: err.message });
    }
};

const UploadProfilePhoto = [photoUpload.single('photo'), async (req, res) => {
    try {
        if (req.user.userId !== req.params.userId) return res.status(403).json({ message: 'You can only update your own profile' });
        if (!req.file) return res.status(400).json({ message: 'Choose an image up to 5 MB.' });
        const user = await User.findByIdAndUpdate(req.params.userId, { photoUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` }, { new: true }).select(PUBLIC_USER_FIELDS);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Profile photo updated.', user: getPublicUser(user) });
    } catch (err) {
        res.status(400).json({ message: 'Could not upload profile photo', error: err.message });
    }
}];

module.exports = { HandleUserUpdate, ListUsers, UploadProfilePhoto };