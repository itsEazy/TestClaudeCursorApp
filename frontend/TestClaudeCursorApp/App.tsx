import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { supabase } from './lib/supabase';
import LoginScreen from './src/LoginScreen';

function App(): React.JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  const fetchHelloMessage = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching from Supabase using SDK...');

      // First, let's see what records exist
      const { data: allData, error: allError } = await supabase
        .from('TestClaudeCursorTable')
        .select('*');

      console.log('All records:', allData);
      console.log('All records error:', allError);

      if (allData && allData.length > 0) {
        // Use the first record that has a java_string
        const record = allData.find(row => row.java_string) || allData[0];
        const messageFromDB = record?.java_string || 'Hello World!';
        console.log('Successfully fetched message:', messageFromDB);
        setMessage(messageFromDB);
      } else {
        console.log('No records found in table');
        setMessage('No records found in table');
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      Alert.alert(
        'Error',
        `Failed to fetch message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const eraseMessage = () => {
    setMessage('');
  };

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setMessage('');
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TestClaudeCursor</Text>
        <Text style={styles.welcomeText}>Welcome, {currentUser}!</Text>

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

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>
            Logout
          </Text>
        </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: '#95a5a6',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
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
