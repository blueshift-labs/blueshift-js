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
  fetch(request, {
    method: 'GET',
    mode: 'no-cors',
  });
}

function hasIdentifier(cookie, eventObj) {
  if (cookie || eventObj.email || eventObj.customer_id || eventObj.device_id || eventObj.phone_number || eventObj.user_uuid) {
    return true
  }
  return false
}


function generateRequestUrl(protocol, hostname, apiKey, event, obj) {
  const unix = Math.round(new Date() / 1000);
  const randNum = Math.floor(Math.random() * 1000000 + 1);

  // Validate input
  if (!protocol || !hostname || !apiKey || !event) {
    throw new Error('Missing required parameters.');
  }

  // Strategy for browser environment
  function generateBrowserRequest() {
    const ref = document.referrer || '';
    let cookie = getCookie('_bs');
    let cookieString = '';

    if (cookie === undefined) {
      cookie = guid();
      setCookie('_bs', cookie, 365);
    }
    cookieString = `&k=${cookie}`;

    if (!hasIdentifier(cookie, obj)) {
      throw new Error(`Request for '${event}' event is missing an identifier`);
    }

    let requestString = `${protocol}://${hostname}/unity.gif?x=${apiKey}&t=${unix}&e=${event}&r=${encodeURIComponent(
      ref
    )}&z=${randNum}${cookieString}&u=${encodeURIComponent(
      window.location.href
    )}`;
    requestString = appendObjectParams(requestString, obj);
    return requestString;
  }

  // Strategy for non-browser environment
  function generateNonBrowserRequest() {
    debugger;
    const eventObjKeys = Object.keys(obj);
    const remainingAttrs = { ...obj };

    let cookie = null;
    let cookieStr = '';
    if (eventObjKeys.includes('cookie')) {
      cookie = remainingAttrs.cookie
      cookieStr = `&k=${remainingAttrs.cookie}`;
      delete remainingAttrs.cookie;
    }

    let ref = '';
    if (eventObjKeys.includes('referrer')) {
      ref = remainingAttrs.referrer || '';
      delete remainingAttrs.referrer;
    }

    if (!hasIdentifier(cookieStr, remainingAttrs)) {
      throw new Error(`Request for '${event}' event is missing an identifier`);
    }

    let requestString = `${protocol}://${hostname}/unity.gif?x=${apiKey}&t=${unix}&e=${event}&r=${encodeURIComponent(ref)}&z=${randNum}${cookieStr}`;

    if (eventObjKeys.includes('url')) {
      requestString += `&u=${encodeURIComponent(remainingAttrs.url)}`;
      delete remainingAttrs.url;
    }

    requestString = appendObjectParams(requestString, remainingAttrs);

    return requestString;
  }

  // Helper to append object parameters
  function appendObjectParams(requestString, obj) {
    for (const key in obj) {
      const v = obj[key];
      if (typeof v === 'object') {
        requestString += `&${key}_json=${encodeURIComponent(
          JSON.stringify(v)
        )}`;
      } else {
        requestString += `&${key}=${encodeURIComponent(v)}`;
      }
    }
    return requestString;
  }

  // Decide based on environment
  return isBrowser() ? generateBrowserRequest() : generateNonBrowserRequest();
}

module.exports = {
  guid,
  getCookie,
  setCookie,
  sendRequest,
  generateRequestUrl,
  isBrowser,
};
