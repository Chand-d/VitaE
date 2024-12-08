import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Auth } from 'aws-amplify';

const VerificationScreen = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { username } = route.params;

  const handleVerification = async () => {
    try {
      await Auth.confirmSignUp(username, verificationCode);
      Alert.alert('Success', 'Account verified successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.log('Error confirming sign up', error);
      Alert.alert('Error', error.message || 'An error occurred during verification.');
    }
  };

  const handleResendCode = async () => {
    try {
      await Auth.resendSignUp(username);
      Alert.alert('Success', 'Verification code resent successfully.');
    } catch (error) {
      console.log('Error resending code: ', error);
      Alert.alert('Error', error.message || 'An error occurred while resending the code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>Enter the verification code sent to your email</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        placeholderTextColor="#AAB7C4"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
        <Text style={styles.resendButtonText}>Resend Code</Text>
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
    backgroundColor: '#fff', // Light blue background color
  },
  title: {
    fontSize: 28, // Larger font for title consistency
    fontWeight: 'bold',
    color: '#000', // Deep blue color for emphasis
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000', // Medium blue color for consistency
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000', // Light blue border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded corners
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    elevation: 2, // Subtle shadow for the input
  },
  button: {
    backgroundColor: '#000', // Consistent rich blue button color
    padding: 15,
    borderRadius: 10, // Rounded corners
    width: '100%',
    alignItems: 'center',
    elevation: 5, // Shadow for button depth
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 20,
  },
  resendButtonText: {
    color: '#1E88E5', // Same color for consistency across the app
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerificationScreen;