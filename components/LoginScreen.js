import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Auth } from 'aws-amplify';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await Auth.signIn(email, password);
      navigation.navigate('Main');
    } catch (error) {
      console.log('Error signing in:', error);
      Alert.alert('Error', error.message || 'An error occurred while signing in.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Sign In Header */}
      <Text style={styles.headerText}>Welcome Back!</Text>
      <Text style={styles.subHeaderText}>Sign in to continue</Text>

      {/* Sign In Form */}
      <TextInput
        style={styles.input}
        placeholder="Enter your Username or Email"
        placeholderTextColor="#AAB7C4"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        placeholderTextColor="#AAB7C4"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Footer Text */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD', // Light blue background color
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0', // Deep blue color
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#5E92F3', // Medium blue color
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#90CAF9', // Light blue border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    elevation: 1,
  },
  button: {
    backgroundColor: '#1E88E5', // Rich blue button color
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Button shadow for depth
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotText: {
    marginTop: 20,
    color: '#1565C0',
    fontSize: 16,
  },
  signupText: {
    marginTop: 15,
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
