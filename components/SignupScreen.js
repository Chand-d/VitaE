import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { Auth } from 'aws-amplify';
import DateTimePicker from '@react-native-community/datetimepicker';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // New state for date picker

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          name,
          birthdate, // The birthdate is now selected via the date picker
          gender,
        },
      });
      navigation.navigate('Verification', { username });
    } catch (error) {
      console.log('Error signing up:', error);
      Alert.alert('Error', error.message || 'An error occurred while signing up.');
    }
  };

  const genderOptions = ['Male', 'Female', 'Other'];

  // Handler for date selection
  const handleDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(false); // Close the picker
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setBirthdate(formattedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#AAB7C4"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#AAB7C4"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#AAB7C4"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#AAB7C4"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#AAB7C4"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Birthdate Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsDatePickerVisible(true)}
        >
          <Text style={{ color: birthdate ? '#000' : '#AAB7C4' }}>
            {birthdate || 'Select Birthdate'}
          </Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        <Modal
          visible={isDatePickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsDatePickerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={birthdate ? new Date(birthdate) : new Date()}
                mode="date"
                display="calendar"
                onChange={handleDateChange}
              />
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setIsDatePickerVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Gender Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsGenderPickerVisible(true)}
        >
          <Text style={{ color: gender ? '#000' : '#AAB7C4' }}>
            {gender || 'Select Gender'}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={isGenderPickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsGenderPickerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setGender(option);
                    setIsGenderPickerVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setIsGenderPickerVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>

        {/* Add some padding at the bottom so that the content can be scrolled above the keyboard */}
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background color
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0', // Deep blue color
    marginBottom: 30,
  },
  input: {
    width: '100%',
    minHeight: 50,
    borderColor: '#90CAF9', // Light blue border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    elevation: 2,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1E88E5', // Rich blue button color
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    color: '#1565C0',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000088', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  modalOption: {
    padding: 20,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#1E88E5', // Rich blue color
  },
  modalCancel: {
    padding: 20,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 18,
    color: '#1565C0',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
