import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Auth } from 'aws-amplify';

const ProfilePage = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalSummary: '',
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const attributes = user.attributes;
      setUserInfo({
        username: user.username || '',
        fullName: attributes.name || '',
        email: attributes.email || '',
        phone: attributes.phone_number || '',
        location: attributes['custom:location'] || '',
        professionalSummary: attributes['custom:professional_summary'] || '',
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
      Alert.alert(
        'Error',
        'Could not fetch user information. Please try again later.'
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      Alert.alert('Signed Out', 'You have been signed out successfully.');
      navigation.navigate('Login'); // Redirect to login screen
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}> Your Profile</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={userInfo.username}
          editable={false}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={userInfo.fullName}
          editable={false}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={userInfo.email}
          editable={false}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={userInfo.phone}
          editable={false}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={userInfo.location}
          editable={false}
        />

        <Text style={styles.label}>Professional Summary</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: '#f0f0f0' }]}
          value={userInfo.professionalSummary}
          editable={false}
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal:50,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
