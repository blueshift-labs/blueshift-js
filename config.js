// config.js

let config = {
  apiKey: process.env.API_KEY || null,
  hostname: process.env.HOSTNAME || null,
  protocol: process.env.PROTOCOL || 'https',
};

module.exports = config;
