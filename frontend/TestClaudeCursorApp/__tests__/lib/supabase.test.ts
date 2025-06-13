/**
 * @format
 */

import { getHelloMessage, supabase } from '../../lib/supabase';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
  })),
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Supabase Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHelloMessage', () => {
    it('should return message from Supabase when data exists', async () => {
      const mockData = {
        java_string: 'Hello from test!',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getHelloMessage();

      expect(result).toBe('Hello from test!');
      expect(mockSupabase.from).toHaveBeenCalledWith('TestClaudeCursorTable');
    });

    it('should return fallback message when data is null', async () => {
      const mockData = {
        java_string: null,
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getHelloMessage();

      expect(result).toBe('Hello World!');
    });

    it('should return fallback message when data is undefined', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: undefined,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getHelloMessage();

      expect(result).toBe('Hello World!');
    });

    it('should throw error when Supabase returns an error', async () => {
      const mockError = {
        message: 'Database connection failed',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      } as any);

      await expect(getHelloMessage()).rejects.toThrow(
        'Supabase error: Database connection failed'
      );
    });

    it('should query the correct record ID', async () => {
      const mockData = {
        java_string: 'Test message',
      };

      const mockEq = jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      await getHelloMessage();

      expect(mockSupabase.from).toHaveBeenCalledWith('TestClaudeCursorTable');
      expect(mockSelect).toHaveBeenCalledWith('java_string');
      expect(mockEq).toHaveBeenCalledWith('id', 2);
    });

    it('should handle network errors', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockRejectedValue(new Error('Network timeout')),
          }),
        }),
      } as any);

      await expect(getHelloMessage()).rejects.toThrow('Network timeout');
    });

    it('should handle empty string response', async () => {
      const mockData = {
        java_string: '',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getHelloMessage();

      expect(result).toBe('Hello World!');
    });

    it('should handle whitespace-only string response', async () => {
      const mockData = {
        java_string: '   ',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getHelloMessage();

      expect(result).toBe('   ');
    });
  });

  describe('Supabase Client Configuration', () => {
    it('should be configured with correct settings', () => {
      // Test that the supabase client is created with expected configuration
      expect(mockSupabase.from).toBeDefined();
    });
  });
});
