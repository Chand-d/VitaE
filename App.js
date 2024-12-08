import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Amplify } from 'aws-amplify';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import awsconfig from './src/aws-exports';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import VerificationScreen from './components/VerificationScreen';
import MainScreen from './components/MainScreen';
import ForgotPasswordScreen from './components/ForgotPasswordscreen';
import ResultScreen from './components/Result';
import LibraryScreen from './components/library';
import ProfilePage from './components/ProfilePage';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={({ navigation, route }) => {
          const noHeaderScreens = ['Login', 'Signup', 'ForgotPassword', 'Verification'];
          const shouldHideHeader = noHeaderScreens.includes(route.name);

          return {
            headerShown: !shouldHideHeader,
            headerTitle: () => (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => navigation.navigate('Main')}
              >
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>VitaE</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                {/* Library Button */}
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}
                  onPress={() => navigation.navigate('Library')}
                >
                  <Ionicons name="library-outline" size={24} color="black" />
                  <Text style={{ fontSize: 16, marginLeft: 5 }}>Library</Text>
                </TouchableOpacity>
                {/* Profile Button */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfilePage')}
                >
                  <Ionicons name="person-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: {
              backgroundColor: 'white',
            },
            headerTintColor: '#333',
            headerLeft: null, // Removes the back button
            headerBackTitleVisible: false, // Hides the back title (just in case)
          };
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
