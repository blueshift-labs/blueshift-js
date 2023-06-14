// index.js

const config = require('./config.js');

function initialize(inputApiKey, inputHostname) {
  config.apiKey = inputApiKey;
  config.hostname = inputHostname;
}

function track(event) {
  if (!config.apiKey) {
    throw new Error('You must initialize the module with an API key before tracking an event.');
  }

  // Your tracking logic here. For example:
  console.log(`Tracking event: ${event}`);
}

function identify(userId) {
  if (!config.apiKey) {
    throw new Error('You must initialize the module with an API key before identifying a user.');
  }

  // Your identifying logic here. For example:
  console.log(`Identifying user: ${userId}`);
}

// Expose initialize, track, and identify
module.exports = {
  initialize,
  track,
  identify,
};
