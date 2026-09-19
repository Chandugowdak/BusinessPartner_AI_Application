const bcrypt = require('bcrypt');
const dataBase = require('../config/db');
const User = require('../model/User/UserSchema');

const demoUsers = [
    { name: 'Maya Chen', email: 'maya.demo@example.com', role: 'Founder', professionalField: 'Sustainable retail', phone: '+919876543210', linkedInUrl: 'https://linkedin.com/in/maya-chen-demo', xUrl: 'https://x.com/mayachendemo', photoUrl: 'https://i.pravatar.cc/160?img=47' },
    { name: 'Arjun Mehta', email: 'arjun.demo@example.com', role: 'Investor', professionalField: 'Fintech and growth', phone: '+919876543211', linkedInUrl: 'https://linkedin.com/in/arjun-mehta-demo', xUrl: 'https://x.com/arjunmehtademo', photoUrl: 'https://i.pravatar.cc/160?img=12' },
    { name: 'Sofia Williams', email: 'sofia.demo@example.com', role: 'Mentor', professionalField: 'Product strategy', phone: '+919876543212', linkedInUrl: 'https://linkedin.com/in/sofia-williams-demo', xUrl: 'https://x.com/sofiawilliamsdemo', photoUrl: 'https://i.pravatar.cc/160?img=32' },
    { name: 'Noah Okafor', email: 'noah.demo@example.com', role: 'Professional', professionalField: 'Supply chain', phone: '+919876543213', linkedInUrl: 'https://linkedin.com/in/noah-okafor-demo', xUrl: 'https://x.com/noahokafordemo', photoUrl: 'https://i.pravatar.cc/160?img=68' },
];

async function seed() {
    await dataBase;
    const password = await bcrypt.hash('DemoPartner123!', 10);
    for (const details of demoUsers) {
        await User.findOneAndUpdate({ email: details.email }, { $set: { ...details, password, governmentIdType: 'other', governmentIdLast4: '0000', verificationStatus: 'verified' } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }
    console.log(`Seeded ${demoUsers.length} demo users. Password: DemoPartner123!`);
    process.exit(0);
}

seed().catch((error) => { console.error(error); process.exit(1); });