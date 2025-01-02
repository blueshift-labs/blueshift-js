// config.js

let config = {
  apiKey: null,
  hostname: null,
  protocol: 'https',
};

if (typeof process !== 'undefined') {
  config = {
    apiKey: process.env.API_KEY || null,
    hostname: process.env.HOSTNAME || null,
    protocol: process.env.PROTOCOL || 'https',
  };
}

module.exports = config;
