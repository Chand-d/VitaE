import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Auth } from 'aws-amplify';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleForgotPassword = async () => {
    try {
      await Auth.forgotPassword(email);
      setIsCodeSent(true);
      Alert.alert('Code sent', 'Please check your email for the verification code.');
    } catch (error) {
      console.log('Error sending code:', error);
      Alert.alert('Error', error.message || 'An error occurred while sending the reset code.');
    }
  };

  const handlePasswordReset = async () => {
    try {
      await Auth.forgotPasswordSubmit(email, confirmationCode, newPassword);
      Alert.alert('Password reset', 'Your password has been successfully reset!');
      navigation.navigate('Login'); // Navigate back to the login screen after success
    } catch (error) {
      console.log('Error resetting password:', error);
      Alert.alert('Error', error.message || 'An error occurred while resetting the password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {!isCodeSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#AAB7C4"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirmation Code"
            placeholderTextColor="#AAB7C4"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#AAB7C4"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
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
  title: {
    fontSize: 28, // Slightly larger for better emphasis
    fontWeight: 'bold',
    color: '#1565C0', // Deep blue font color
    marginBottom: 30, // More spacing for a cleaner look
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#90CAF9', // Lighter border color for a polished feel
    borderWidth: 1,
    marginBottom: 15, // Consistent spacing with the login screen
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    elevation: 2, // Subtle shadow for inputs
  },
  button: {
    backgroundColor: '#1E88E5', // Consistent blue color with the rest of the app
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 5, // Slight shadow for depth
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLoginText: {
    marginTop: 20,
    color: '#1E88E5',
    fontSize: 16, // Match font size with other links
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;