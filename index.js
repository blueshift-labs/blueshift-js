// index.js

const config = require('./config.js');
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
  // manage cookie
  let cookie = getCookie('_bs');
  if (cookie === undefined) {
    cookie = guid();
    setCookie('_bs', cookie, 365);
  }
  // generate request string
  const requestUrl = generateRequestUrl(
    config.protocol,
    config.hostname,
    config.apiKey,
    eventName,
    cookie,
    obj,
  )
  sendRequest(requestUrl);
}

function identify(userProperties = {}) {
  if (!config.apiKey) {
    throw new Error('You must initialize the module with an API key before identifying a user.');
  }
  track("identify", { ...userProperties });
}

// Expose initialize, track, and identify
module.exports = {
  initialize,
  track,
  identify,
};
