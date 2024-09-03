import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, useColorScheme, Animated } from 'react-native';

const AuthPage = () => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const translateX = useState(new Animated.Value(isDarkMode ? 40 : 0))[0];

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isForgotPassword) {
      console.log('Forgot Password data:', formData.email);
    } else {
      console.log(isLogin ? 'Login data:' : 'Signup data:', formData);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setFormData({
      name: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const toggleDarkMode = () => {
    Animated.spring(translateX, {
      toValue: isDarkMode ? 0 : 40,
      useNativeDriver: false,
    }).start();
    setIsDarkMode(!isDarkMode);
  };

  const renderInput = (name, placeholder, secureTextEntry = false) => (
    <TextInput
      style={[
        styles.input,
        { backgroundColor: isDarkMode ? '#333' : 'white', color: isDarkMode ? 'white' : 'black' }
      ]}
      placeholder={placeholder}
      placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
      value={formData[name]}
      onChangeText={(value) => handleInputChange(name, value)}
      secureTextEntry={secureTextEntry && !showPassword}
    />
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#FFF5E6' }]}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={[styles.backButtonText, { color: isDarkMode ? '#F4A460' : '#F4A460' }]}>←</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.darkModeToggle, { backgroundColor: isDarkMode ? '#1e2761' : '#87CEFA' }]} 
        onPress={toggleDarkMode}
        activeOpacity={0.8}
      >
        {!isDarkMode && (
          <View style={styles.dayIcons}>
            <View style={styles.sunIcon} />
            <Text style={styles.cloudIcon}>☁️</Text>
            <Text style={styles.cloudIcon}>☁️</Text>
          </View>
        )}
        {isDarkMode && (
          <View style={styles.nightIcons}>
            <View style={styles.moonIcon} />
            <Text style={styles.starIcon}>✦</Text>
            <Text style={styles.starIcon}>✦</Text>
          </View>
        )}
        <Animated.View style={[styles.toggleButton, { transform: [{ translateX }] }]}>
          {isDarkMode ? (
            <View style={styles.moonIconInner} />
          ) : (
            <View style={styles.sunIconInner} />
          )}
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Image
          source={require('../../assets/images/bagel final.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {isForgotPassword ? (
          <>
            {renderInput('email', 'Enter your email')}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
              <Text style={styles.forgotPassword}>Back to Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {!isLogin && (
              <>
                {renderInput('name', 'Full Name')}
                {renderInput('age', 'Age')}
              </>
            )}
            {renderInput('email', 'Email')}
            <View style={styles.passwordContainer}>
              {renderInput('password', 'Password', true)}
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {!isLogin && renderInput('confirmPassword', 'Confirm Password', true)}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>{isLogin ? 'Log in' : 'Sign up'}</Text>
            </TouchableOpacity>
            {isLogin && (
              <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {!isForgotPassword && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
          <Text style={styles.toggleButtonText}>
            {isLogin ? 'Create new account' : 'Already have an account? Log in'}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.brandText, { color: isDarkMode ? '#F4A460' : '#F4A460' }]}>BEGLZ</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
  },
  darkModeToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 80,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    overflow: 'hidden',
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  nightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  sunIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    marginRight: 4,
  },
  sunIconInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
  },
  moonIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  moonIconInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  cloudIcon: {
    fontSize: 12,
    marginRight: 2,
    color: 'white',
  },
  starIcon: {
    fontSize: 10,
    color: 'white',
    marginLeft: 4,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    borderColor: '#F4A460',
    borderWidth: 1,
    borderRadius: 5,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
  },
  submitButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#F4A460',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#F4A460',
    marginTop: 10,
  },
  toggleButton: {
    width: '100%',
    padding: 15,
    borderColor: '#F4A460',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#F4A460',
  },
  brandText: {
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AuthPage;