const {
  guid,
  getCookie,
  generateRequestUrl,
} = require('./util');

jest.mock('./util', () => {
  const originalModule = jest.requireActual('./util');
  return {
    ...originalModule,
    isBrowser: jest.fn(),
  };
});

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
        cookie: '_bs=test-cookie',
      },
      writable: true,
    });
  });

  it('should return the value of the cookie', () => {
    const cookieValue = getCookie('_bs');
    expect(cookieValue).toBe('test-cookie');
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
        cookie: '_bs=test-cookie',
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it('should generate request URL for browser environment', () => {
    const url = generateRequestUrl('https', TEST_HOSTNAME, TEST_API_KEY, TEST_EVENT, TEST_PROPERTIES);

    expect(url).toContain('https://api.test.com/unity.gif?x=test-api-key');
    expect(url).toContain('&e=test_event');
    expect(url).toContain('&k=test-cookie');
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
