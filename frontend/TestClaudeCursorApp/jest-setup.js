// Mock react-native globally
jest.mock('react-native', () => {
  // Create a safe mock that doesn't require actual react-native components
  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((options) => options.ios),
      Version: '14.0',
    },
    Alert: {
      alert: jest.fn(),
    },
    // Mock all commonly used components as simple View-like objects
    View: 'View',
    Text: 'Text',
    TextInput: 'TextInput',
    Button: 'Button',
    TouchableOpacity: 'TouchableOpacity',
    ActivityIndicator: 'ActivityIndicator',
    SafeAreaView: 'SafeAreaView',
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => style),
    },
    Modal: 'Modal',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    Image: 'Image',
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
  };
});

// Additional mocks for specific modules that might be problematic
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(options => options.ios),
  Version: '14.0',
}));

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill/auto', () => {});
