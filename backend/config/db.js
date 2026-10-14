const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGOOSE_URL = process.env.MONGOOSE_URL;

const data_base = mongoose.connect(MONGOOSE_URL);

module.exports = data_base;
