const tracker = require('./index');
const { sendRequest, generateRequestUrl } = require('./util');

// Mock the utility functions
jest.mock('./util', () => ({
  sendRequest: jest.fn(),
  generateRequestUrl: jest.fn(),
  guid: jest.fn(),
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

describe('Tracking Module', () => {
  const TEST_API_KEY = 'test-api-key';
  const TEST_HOSTNAME = 'api.test.com';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the module state
    tracker.initialize(TEST_API_KEY, TEST_HOSTNAME);
  });

  describe('initialize', () => {
    it('should properly initialize with API key and hostname', () => {
      tracker.initialize('new-api-key', 'new.hostname.com');
      expect(() => tracker.track('test_event')).not.toThrow();
    });
  });

  describe('track', () => {
    it('should throw error if not initialized', () => {
      tracker.initialize(null, null);
      expect(() => tracker.track('test_event')).toThrow('You must initialize the module with an API key');
    });

    it('should call generateRequestUrl and sendRequest with correct parameters', () => {
      const eventName = 'test_event';
      const properties = { prop1: 'value1' };

      generateRequestUrl.mockReturnValue('https://test.url');

      tracker.track(eventName, properties);

      expect(generateRequestUrl).toHaveBeenCalledWith(
        'https',
        TEST_HOSTNAME,
        TEST_API_KEY,
        eventName,
        properties
      );
      expect(sendRequest).toHaveBeenCalledWith('https://test.url');
    });
  });

  describe('identify', () => {
    it('should throw error if not initialized', () => {
      tracker.initialize(null, null);
      expect(() => tracker.identify({ email: 'test@test.com' })).toThrow('You must initialize the module with an API key');
    });

    it('should track identify event with user properties', () => {
      const userProps = { email: 'test@test.com', name: 'Test User' };

      generateRequestUrl.mockReturnValue('https://test.url');

      tracker.identify(userProps);

      expect(generateRequestUrl).toHaveBeenCalledWith(
        'https',
        TEST_HOSTNAME,
        TEST_API_KEY,
        'identify',
        userProps
      );
      expect(sendRequest).toHaveBeenCalledWith('https://test.url');
    });

    it('should prioritize email as identifier', () => {
      const userProps = {
        email: 'test@test.com',
        customer_id: '12345',
        device_id: 'device123'
      };

      tracker.identify(userProps);

      // Track another event to verify the stored identifier
      tracker.track('test_event');

      expect(generateRequestUrl).toHaveBeenLastCalledWith(
        'https',
        TEST_HOSTNAME,
        TEST_API_KEY,
        'test_event',
        expect.objectContaining({ email: 'test@test.com' })
      );
    });
  });
});
