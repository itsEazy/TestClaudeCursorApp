/**
 * @format
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../src/LoginScreen';
import { API_BASE_URL } from '../src/config/api';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock Alert - using global react-native mock from jest-setup.js
const mockAlert = Alert.alert;

describe('LoginScreen Component', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should render login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    expect(getByText('Login')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('should show error when submitting empty credentials', async () => {
    const { getByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    expect(mockAlert).toHaveBeenCalledWith(
      'Error',
      'Please enter both username and password'
    );
  });

  it('should show error when submitting only username', async () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.press(submitButton);

    expect(mockAlert).toHaveBeenCalledWith(
      'Error',
      'Please enter both username and password'
    );
  });

  it('should show error when submitting only password', async () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    expect(mockAlert).toHaveBeenCalledWith(
      'Error',
      'Please enter both username and password'
    );
  });

  it('should call onLoginSuccess when login is successful', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        username: 'testuser',
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith('testuser');
    });

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });
  });

  it('should show error alert when login fails', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: false,
        message: 'Invalid credentials',
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, 'wronguser');
    fireEvent.changeText(passwordInput, 'wrongpass');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Login Failed',
        'Invalid credentials'
      );
    });

    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });

  it('should show network error when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Error',
        'Failed to connect to server'
      );
    });

    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });

  it('should show loading state during login', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        username: 'testuser',
      }),
    };

    // Create a promise that resolves after a delay
    const delayedPromise = new Promise(resolve =>
      setTimeout(() => resolve(mockResponse), 100)
    );
    mockFetch.mockReturnValue(delayedPromise as any);

    const { getByText, getByPlaceholderText, queryByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(queryByText('Submit')).toBeNull();
    });

    // Wait for login to complete
    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith('testuser');
    });
  });

  it('should trim whitespace from inputs', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        username: 'testuser',
      }),
    };
    mockFetch.mockResolvedValue(mockResponse as any);

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, '  testuser  ');
    fireEvent.changeText(passwordInput, '  password123  ');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password123',
        }),
      });
    });
  });

  it('should disable submit button while loading', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        username: 'testuser',
      }),
    };

    const delayedPromise = new Promise(resolve =>
      setTimeout(() => resolve(mockResponse), 100)
    );
    mockFetch.mockReturnValue(delayedPromise as any);

    const { getByText, getByPlaceholderText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    // Try to press the button again - it should be disabled
    fireEvent.press(submitButton);

    // Should only be called once
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
