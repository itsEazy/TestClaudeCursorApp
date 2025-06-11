import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';

function App(): React.JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_BASE_URL = Platform.select({
    android: 'http://10.0.2.2:8080',
    ios: 'http://localhost:8080',
  });

  const fetchHelloMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/hello`);
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        Alert.alert('Error', 'Failed to fetch message from server');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server. Make sure the backend is running on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  const eraseMessage = () => {
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TestClaudeCursor</Text>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={fetchHelloMessage}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Get Message'}
          </Text>
        </TouchableOpacity>

        {message ? (
          <TouchableOpacity
            style={[styles.button, styles.eraseButton]}
            onPress={eraseMessage}
          >
            <Text style={styles.buttonText}>
              Erase
            </Text>
          </TouchableOpacity>
        ) : null}

        {message ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  eraseButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    minWidth: 200,
  },
  messageText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#27ae60',
    textAlign: 'center',
  },
});

export default App;
