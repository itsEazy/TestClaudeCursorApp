/**
 * @format
 */

// Mock fetch globally
global.fetch = jest.fn();

describe('Hello World Button Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetch function is mocked and can be called', async () => {
    const mockResponse = { message: 'Hello World!' };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const response = await fetch('http://localhost:8080/hello');
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/hello');
    expect(data.message).toBe('Hello World!');
  });

  test('fetch handles error responses', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const response = await fetch('http://localhost:8080/hello');
    
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/hello');
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  test('fetch handles network errors', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(fetch('http://localhost:8080/hello')).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/hello');
  });
});
