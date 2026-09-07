const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const data_base = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
// Importing the userRoute
const userRoute = require('./router/UserRouter/Userroute');







app.use('/api/user', userRoute); // Mount the userRoute at /api/user

data_base
    .then(() => {
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Error connecting to the database: ${err.message}`);
    });