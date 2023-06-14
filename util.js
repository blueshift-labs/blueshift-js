// util.js

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCookie(c_name) {
  const cookieArray = document.cookie.split(';').map(cookie => cookie.trim());
  for (const cookieString of cookieArray) {
    const [name, value] = cookieString.split('=');
    if (name === c_name) {
      return decodeURIComponent(value);
    }
  }
}

function setCookie(c_name, value, expireDays) {
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + expireDays);
  const c_value = `${encodeURIComponent(value)}${(expireDays == null) ? '' : `;expires=${expiresDate.toUTCString()}`};path=/;SameSite=Strict;`;
  document.cookie = `${c_name}=${c_value}`;
}

function sendRequest(request) {
  const img = new Image(1, 1);
  img.src = request;
}

function hasIdentifier(cookie, eventObj) {
  if (cookie || eventObj.email || eventObj.customer_id || eventObj.device_id || eventObj.phone_number || eventObj.user_uuid) {
    return true
  }
  return false
}

function generateRequestUrl(protocol, hostname, apiKey, event, obj) {
  const unix = Math.round(new Date() / 1000);
  const randNum = Math.floor((Math.random() * 1000000) + 1);
  const ref = isBrowser() ? document.referrer : '';
  // manage cookie
  let cookie = null;
  let cookieString = '';
  if (isBrowser()) {
    cookie = getCookie('_bs');
    if (cookie === undefined) {
      cookie = guid();
      setCookie('_bs', cookie, 365);
    }
    cookieString = `&k=${cookie}`
  }
  // make sure the request has an identifier
  if (!hasIdentifier(cookie, obj)) {
    throw new Error(`Request for '${event}' event is missing an identifier`);
  }
  // generate url
  let requestString = `${protocol}://${hostname}/unity.gif?x=${apiKey}&t=${unix}&e=${event}&r=${encodeURIComponent(ref)}&z=${randNum}${cookieString}&u=${encodeURIComponent(isBrowser() ? window.location.href : '')}`;
  for (const key in obj) {
    const v = obj[key];
    if (typeof v === "object") {
      requestString += `&${key}_json=${encodeURIComponent(JSON.stringify(v))}`;
    } else {
      requestString += `&${key}=${encodeURIComponent(v)}`;
    }
  }
  return requestString
}

module.exports = {
  guid,
  getCookie,
  setCookie,
  sendRequest,
  generateRequestUrl,
  isBrowser,
};
