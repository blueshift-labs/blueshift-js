// util.js

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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

function generateRequestUrl(protocol, hostname, apiKey, event, cookie, obj) {
  const unix = Math.round(new Date() / 1000);
  const randNum = Math.floor((Math.random() * 1000000) + 1);
  const ref = document.referrer;
  let requestString = `${protocol}://${hostname}/unity.gif?x=${apiKey}&t=${unix}&e=${event}&r=${encodeURIComponent(ref)}&z=${randNum}&k=${cookie}&u=${encodeURIComponent(window.location.href)}`;
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
};
