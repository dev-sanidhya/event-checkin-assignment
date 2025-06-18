import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/queries';
import { useAuthStore } from '../store/authStore';
import { connectSocket } from '../lib/socket';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await loginMutation({
        variables: {
          email: email.trim(),
          password: password || 'dummy_password', // Mock password
        },
      });

      if (data?.login) {
        login(data.login.token, data.login.user);
        connectSocket();
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('dummy_password');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Event Check-In</Text>
        <Text style={styles.subtitle}>Welcome! Please sign in to continue</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password (optional for demo)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickLogin}>
          <Text style={styles.quickLoginTitle}>Quick Login (Demo):</Text>
          <TouchableOpacity
            style={styles.quickLoginButton}
            onPress={() => handleQuickLogin('john@example.com')}
          >
            <Text style={styles.quickLoginText}>Login as John</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickLoginButton}
            onPress={() => handleQuickLogin('jane@example.com')}
          >
            <Text style={styles.quickLoginText}>Login as Jane</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickLoginButton}
            onPress={() => handleQuickLogin('bob@example.com')}
          >
            <Text style={styles.quickLoginText}>Login as Bob</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickLogin: {
    alignItems: 'center',
  },
  quickLoginTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  quickLoginButton: {
    backgroundColor: '#34C759',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickLoginText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

