const dataBase = require('../config/db');
const User = require('../model/User/UserSchema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createAdminUser() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
        throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters in backend/.env.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('ADMIN_EMAIL must be a valid email address.');
    }

    await dataBase;
    await User.collection.createIndex(
        { firstAdminBootstrap: 1 },
        {
            unique: true,
            partialFilterExpression: { firstAdminBootstrap: true },
            name: 'unique_first_admin_bootstrap',
        },
    );
    const existingAdmin = await User.exists({ accountRole: 'admin' });
    if (existingAdmin) {
        throw new Error('An administrator already exists. Create additional administrators from the admin dashboard.');
    }
    const existing = await User.findOne({ email }).select('_id');
    if (existing) throw new Error('An account already uses ADMIN_EMAIL. Choose a new admin email.');

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
        name: 'Admin',
        email,
        password: passwordHash,
        accountRole: 'admin',
        firstAdminBootstrap: true,
    });
    console.log(`Administrator account created for ${email}.`);
}

createAdminUser()
    .catch((error) => {
        console.error(`Could not create administrator: ${error.message}`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
