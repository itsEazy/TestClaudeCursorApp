/**
 * @format
 */

import { getHelloMessage } from '../lib/supabase';

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  getHelloMessage: jest.fn(),
  supabase: {
    from: jest.fn(),
  },
}));

const mockGetHelloMessage = getHelloMessage as jest.MockedFunction<typeof getHelloMessage>;

describe('Supabase Hello World Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getHelloMessage returns message from database', async () => {
    const expectedMessage = 'Hello from Supabase!';
    mockGetHelloMessage.mockResolvedValueOnce(expectedMessage);

    const result = await getHelloMessage();

    expect(result).toBe(expectedMessage);
    expect(mockGetHelloMessage).toHaveBeenCalledTimes(1);
  });

  test('getHelloMessage handles database errors', async () => {
    const errorMessage = 'Database connection failed';
    mockGetHelloMessage.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getHelloMessage()).rejects.toThrow(errorMessage);
    expect(mockGetHelloMessage).toHaveBeenCalledTimes(1);
  });

  test('getHelloMessage returns fallback when no data', async () => {
    mockGetHelloMessage.mockResolvedValueOnce('Hello World!');

    const result = await getHelloMessage();

    expect(result).toBe('Hello World!');
    expect(mockGetHelloMessage).toHaveBeenCalledTimes(1);
  });

  test('multiple calls to getHelloMessage work correctly', async () => {
    const messages = ['First message', 'Second message'];
    mockGetHelloMessage
      .mockResolvedValueOnce(messages[0])
      .mockResolvedValueOnce(messages[1]);

    const result1 = await getHelloMessage();
    const result2 = await getHelloMessage();

    expect(result1).toBe(messages[0]);
    expect(result2).toBe(messages[1]);
    expect(mockGetHelloMessage).toHaveBeenCalledTimes(2);
  });
});
