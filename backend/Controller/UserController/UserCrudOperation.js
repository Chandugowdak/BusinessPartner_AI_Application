const User = require('../../model/User/UserSchema.js');
const { getPublicUser, hashGovernmentId, normalizePhone, normalizeUrl, PUBLIC_USER_FIELDS } = require('./UserController');



const HandleUserUpdate = async(req,res)=>{
    const { userId } = req.params;
     const { name, email, phone, linkedInUrl, xUrl, professionalField, governmentIdType, governmentId } = req.body;
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


module.exports = { HandleUserUpdate };