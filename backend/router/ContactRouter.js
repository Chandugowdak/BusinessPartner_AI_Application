const express = require('express');
const { createContact } = require('../Controller/ContactController');

const contactRoute = express.Router();
contactRoute.post('/', createContact);

module.exports = contactRoute;
