// index.js

const { merge } = require('webpack-merge');
const config = require('./config.js');
let identifierParams = {};

const {
  guid,
  getCookie,
  setCookie,
  sendRequest,
  generateRequestUrl,
} = require('./util.js');

function initialize(inputApiKey, inputHostname) {
  config.apiKey = inputApiKey;
  config.hostname = inputHostname;
}

function track(eventName, obj = {}) {
  if (!config.apiKey) {
    throw new Error('You must initialize the module with an API key before tracking an event.');
  }
  // merge identifier params with event params
  obj = { ...identifierParams, ...obj };
  // generate request string
  const requestUrl = generateRequestUrl(
    config.protocol,
    config.hostname,
    config.apiKey,
    eventName,
    obj,
  )
  sendRequest(requestUrl);
}

function identify(userProperties = {}) {
  if (!config.apiKey) {
    throw new Error('You must initialize the module with an API key before identifying a user.');
  }
  // remember only the most important identifier
  identifierParams = {};
  if (userProperties.email) {
    identifierParams.email = userProperties.email;
  } else if (userProperties.customer_id) {
    identifierParams.customer_id = userProperties.customer_id;
  } else if (userProperties.device_id) {
    identifierParams.device_id = userProperties.device_id;
  } else if (userProperties.phone_number) {
    identifierParams.phone_number = userProperties.phone_number;
  } else if (userProperties.user_uuid) {
    identifierParams.user_uuid = userProperties.user_uuid;
  }
  track("identify", { ...userProperties });
}

// Expose initialize, track, and identify
module.exports = {
  initialize,
  track,
  identify,
};
