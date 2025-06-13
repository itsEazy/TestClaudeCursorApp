/**
 * @format
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import App from '../App';
import { supabase } from '../lib/supabase';

// Mock Alert - using global react-native mock from jest-setup.js
const mockAlert = Alert.alert;

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock LoginScreen
const mockReact = React;
jest.mock('../src/LoginScreen', () => {
  return function MockLoginScreen({ onLoginSuccess }: { onLoginSuccess: (username: string) => void }) {
    return mockReact.createElement('View', { testID: 'login-screen' }, [
      mockReact.createElement('Text', { key: 'title' }, 'Mock Login Screen'),
      mockReact.createElement('Button', {
        key: 'login-button',
        testID: 'mock-login-button',
        title: 'Mock Login',
        onPress: () => onLoginSuccess('testuser'),
      }),
    ]);
  };
});

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should render login screen when not authenticated', () => {
      const { getByTestId } = render(<App />);
      expect(getByTestId('login-screen')).toBeTruthy();
    });

    it('should show main app after successful login', async () => {
      const { getByTestId, getByText } = render(<App />);

      const loginButton = getByTestId('mock-login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Welcome, testuser!')).toBeTruthy();
        expect(getByText('TestClaudeCursor')).toBeTruthy();
      });
    });
  });

  describe('Main App Functionality', () => {
    const renderAuthenticatedApp = async () => {
      const component = render(<App />);
      const loginButton = component.getByTestId('mock-login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(component.getByText('Welcome, testuser!')).toBeTruthy();
      });

      return component;
    };

    it('should fetch and display message from Supabase', async () => {
      const mockData = [
        { id: 1, java_string: 'Hello from Supabase!', created_at: '2023-01-01' },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      } as any);

      const { getByText } = await renderAuthenticatedApp();

      const getMessageButton = getByText('Get Message');
      fireEvent.press(getMessageButton);

      await waitFor(() => {
        expect(getByText('Hello from Supabase!')).toBeTruthy();
      });
    });

    it('should show loading state when fetching message', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockImplementation(() =>
          new Promise(resolve =>
            setTimeout(() => resolve({ data: [], error: null }), 100)
          )
        ),
      } as any);

      const { getByText } = await renderAuthenticatedApp();

      const getMessageButton = getByText('Get Message');
      fireEvent.press(getMessageButton);

      expect(getByText('Loading...')).toBeTruthy();
    });

    it('should handle error when fetching message fails', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Network error')),
      } as any);

      const { getByText } = await renderAuthenticatedApp();

      const getMessageButton = getByText('Get Message');
      fireEvent.press(getMessageButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Error',
          'Failed to fetch message: Network error'
        );
      });
    });

    it('should display fallback message when no records found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      } as any);

      const { getByText } = await renderAuthenticatedApp();

      const getMessageButton = getByText('Get Message');
      fireEvent.press(getMessageButton);

      await waitFor(() => {
        expect(getByText('No records found in table')).toBeTruthy();
      });
    });

    it('should erase message when erase button is pressed', async () => {
      const mockData = [
        { id: 1, java_string: 'Test message', created_at: '2023-01-01' },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      } as any);

      const { getByText, queryByText } = await renderAuthenticatedApp();

      // First get a message
      const getMessageButton = getByText('Get Message');
      fireEvent.press(getMessageButton);

      await waitFor(() => {
        expect(getByText('Test message')).toBeTruthy();
      });

      // Then erase it
      const eraseButton = getByText('Erase');
      fireEvent.press(eraseButton);

      await waitFor(() => {
        expect(queryByText('Test message')).toBeNull();
      });
    });

    it('should logout and return to login screen', async () => {
      const { getByText, getByTestId } = await renderAuthenticatedApp();

      const logoutButton = getByText('Logout');
      fireEvent.press(logoutButton);

      await waitFor(() => {
        expect(getByTestId('login-screen')).toBeTruthy();
      });
    });

    it('should use first record with java_string when multiple records exist', async () => {
      const mockData = [
        { id: 1, java_string: null, created_at: '2023-01-01' },
        { id: 2, java_string: 'Second message', created_at: '2023-01-02' },
        { id: 3, java_string: 'Third message', created_at: '2023-01-03' },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      } as any);

      const { getByText } = await renderAuthenticatedApp();

      const getMessageButton = getByText('Get Message');
      fireEvent.press(getMessageButton);

      await waitFor(() => {
        expect(getByText('Second message')).toBeTruthy();
      });
    });
  });
});
