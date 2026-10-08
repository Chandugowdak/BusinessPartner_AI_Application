const cron = require('node-cron');
const Say_Hello = require('./SimpleFunction');

const StartCrone = ()=>{
    cron.schedule('* * * * *', () => {
        Say_Hello();
    });
}

module.exports = StartCrone;