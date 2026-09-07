const mongoose = require('mongoose');

const optionalUnique = { unique: true, sparse: true };

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        
    },
    phone: { type: String, ...optionalUnique },
    linkedInUrl: { type: String, ...optionalUnique },
    xUrl: { type: String, ...optionalUnique },
    professionalField: { type: String, trim: true },
    governmentIdType: { type: String, enum: ['aadhaar', 'pan', 'other'] },
    governmentIdLast4: { type: String },
    governmentIdHash: { type: String, ...optionalUnique, select: false },
    verificationStatus: { type: String, enum: ['not_started', 'pending', 'verified', 'rejected'], default: 'not_started' },
});

UserSchema.methods.getProfileCompletion = function getProfileCompletion() {
    const checks = [
        [this.name, 10], [this.email, 10], [this.phone, 15],
        [this.professionalField, 20],
        [this.governmentIdLast4 && this.verificationStatus !== 'rejected', 25],
        [this.linkedInUrl, 10], [this.xUrl, 10],
    ];
    return checks.reduce((total, [value, weight]) => total + (value ? weight : 0), 0);
};

module.exports = mongoose.model('User',UserSchema);