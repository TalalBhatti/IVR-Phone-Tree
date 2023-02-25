const twilio = require('twilio');
require('dotenv').config('../config.env');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = client;