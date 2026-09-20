const Contact = require('../model/Contact/ContactSchema');

const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !subject || !message) return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
        const contact = await Contact.create({ user: req.user?.userId || null, name, email, phone, subject, message });
        res.status(201).json({ message: 'Message sent successfully.', contactId: contact._id });
    } catch (error) {
        res.status(500).json({ message: 'Unable to send message.', error: error.message });
    }
};

module.exports = { createContact };
