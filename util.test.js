const {
  guid,
  getCookie,
  setCookie,
  generateRequestUrl,
} = require('./util');

const cookieUUID = '935430ac-a189-0cfb-f7c4-89b71e94b539';
const browserCookie = `_bs=${cookieUUID}; path=/; domain=.test.com; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Strict; Secure`;

describe('guid', () => {
  it('should return a string with 36 characters', () => {
    const generatedGuid = guid();
    expect(generatedGuid).toHaveLength(36);
  });
});

describe('getCookie', () => {
  beforeAll(() => {
    Object.defineProperty(global, 'document', {
      value: {
        cookie: browserCookie,
      },
      writable: true,
    });
  });

  afterAll(() => {
    delete global.document;
  });

  it('should return the value of the cookie', () => {
    const cookieValue = getCookie('_bs');
    expect(cookieValue).toBe(cookieUUID);
  });
});

describe('setCookie', () => {
  beforeAll(() => {
    Object.defineProperty(global, 'document', {
      value: {
        cookie: ''
      },
      writable: true,
    });
  });

  afterAll(() => {
    delete global.document;
  });

  it('should set cookie with Secure flag in browser environment', () => {
    const cookieName = '_bs';
    const cookieValue = cookieUUID;
    const expireDays = 30;

    setCookie(cookieName, cookieValue, expireDays);

    expect(global.document.cookie).toContain(`${cookieName}=${encodeURIComponent(cookieValue)}`);
    expect(global.document.cookie).toContain(';path=/');
    expect(global.document.cookie).toContain(';SameSite=Strict');
    expect(global.document.cookie).toContain(';Secure');
  });
});

describe('generateRequestUrl for Browser', () => {
  const TEST_API_KEY = 'test-api-key';
  const TEST_HOSTNAME = 'api.test.com';
  const TEST_EVENT = 'test_event';
  const TEST_PROPERTIES = { email: 'test@test.com', prop1: 'value1' };

  beforeAll(() => {
    Object.defineProperty(global, 'document', {
      value: {
        cookie: browserCookie,
        referrer: 'test-referrer',
      },
      writable: true,
    });
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          href: 'test-location',
        }
      },
      writable: true,
    });
  });

  afterAll(() => {
    delete global.document;
    delete global.window;
  });

  it('should throw error if required parameters are missing', () => {
    expect(() =>
      generateRequestUrl(
        null,
        TEST_HOSTNAME,
        TEST_API_KEY,
        TEST_EVENT,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
    expect(() =>
      generateRequestUrl(
        'https',
        null,
        TEST_API_KEY,
        TEST_EVENT,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
    expect(() =>
      generateRequestUrl(
        'https',
        TEST_HOSTNAME,
        null,
        TEST_EVENT,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
    expect(() =>
      generateRequestUrl(
        'https',
        TEST_HOSTNAME,
        TEST_API_KEY,
        null,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
  });

  it('should generate request URL for browser environment', () => {
    const url = generateRequestUrl('https', TEST_HOSTNAME, TEST_API_KEY, TEST_EVENT, TEST_PROPERTIES);

    expect(url).toContain('https://api.test.com/unity.gif?x=test-api-key');
    expect(url).toContain('&e=test_event');
    expect(url).toContain(`&k=${cookieUUID}`);
    expect(url).toContain('&email=test%40test.com');
    expect(url).toContain('&prop1=value1');
  });

  it('should set cookie and generate url for browser environment', () => {
    Object.defineProperty(global, 'document', {
      value: {
        cookie: '',
        referrer: 'test-referrer',
      },
      writable: true,
    });

    const url = generateRequestUrl(
      'https',
      TEST_HOSTNAME,
      TEST_API_KEY,
      TEST_EVENT,
      TEST_PROPERTIES
    );

    expect(url).toContain('https://api.test.com/unity.gif?x=test-api-key');
    expect(url).toContain('&e=test_event');
    // assume some value must be set for cookies
    expect(url).toContain('&k=');
    expect(url).toContain('&email=test%40test.com');
    expect(url).toContain('&prop1=value1');
  });
});

describe('generateRequestUrl for Non-Browser', () => {
  const TEST_API_KEY = 'test-api-key';
  const TEST_HOSTNAME = 'api.test.com';
  const TEST_EVENT = 'test_event';
  const TEST_PROPERTIES = {
    email: 'test@test.com',
    prop1: 'value1',
    cookie: cookieUUID,
    referrer: 'test-referrer',
  };

  beforeAll(() => {
    // Ensure non-browser environment by removing window and document
    global.window = undefined;
    global.document = undefined;
  });

  it('should throw error if required parameters are missing', () => {
    expect(() =>
      generateRequestUrl(
        null,
        TEST_HOSTNAME,
        TEST_API_KEY,
        TEST_EVENT,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
    expect(() =>
      generateRequestUrl(
        'https',
        null,
        TEST_API_KEY,
        TEST_EVENT,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
    expect(() =>
      generateRequestUrl(
        'https',
        TEST_HOSTNAME,
        null,
        TEST_EVENT,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
    expect(() =>
      generateRequestUrl(
        'https',
        TEST_HOSTNAME,
        TEST_API_KEY,
        null,
        TEST_PROPERTIES
      )
    ).toThrow('Missing required parameters.');
  });

  it('should set cookie and generate url for non-browser environment', () => {
    const url = generateRequestUrl(
      'https',
      TEST_HOSTNAME,
      TEST_API_KEY,
      TEST_EVENT,
      TEST_PROPERTIES
    );

    expect(url).toContain('&prop1=value1');
    expect(url).toContain('https://api.test.com/unity.gif?x=test-api-key');
    expect(url).toContain('&e=test_event');
    expect(url).toContain(`&k=${cookieUUID}`);
    expect(url).toContain('&email=test%40test.com');
    expect(url).toContain('&r=test-referrer');
  });
});
