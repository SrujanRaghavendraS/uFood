import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';

const SignUp = () => {
  const urls = ['https://uf1.chirag973one.workers.dev']
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSignUp = async () => {
   
    if (!fullName || !email || !phoneNumber || !password || !rePassword) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }
  
    if (password !== rePassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch(urls[0] + '/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gmail: email, pass: password }), 
      });
  
      const data = await response.json();
  
      if (data.err === 0) {
        Alert.alert('Success', 'Sign-up successful!');
      } else {
        Alert.alert('Error', data.message || 'Sign-up failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-black relative">
      {/* Background Rectangles */}
      <View style={styles.leftRectangle} />
      <View style={styles.rightRectangle} />

      <View className="w-11/12 bg-black p-6 rounded-lg shadow-md">
        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-2xl font-pblack text-white mr-2 text-center">Sign Up</Text>
          <LottieView
            source={require("../animations/key.json")}
            style={{ width: 50, height: 50 }} 
            autoPlay
            loop
          />
        </View>

        <TextInput 
          className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-slate-700"
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          keyboardType="default"
          placeholderTextColor="gray"
          inputMode='text'
        />

        <TextInput 
          className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-slate-700"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="gray"
          inputMode='email'
        />

        <TextInput 
          className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-slate-700"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          placeholderTextColor="gray"
          inputMode='numeric'
        />

        <TextInput 
          className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-slate-700"
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />

        <TextInput 
          className="w-full p-3 border border-gray-300 rounded-full mb-6 text-white bg-slate-700"
          placeholder="Re-Enter Password"
          value={rePassword}
          onChangeText={setRePassword}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />

        <TouchableOpacity 
          className="bg-green-400 p-2 rounded-full w-full items-center mb-6"
          onPress={handleSignUp}
        >
          <Text className="text-black font-pblack">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftRectangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%', // Half the width
    height: '100%', // Full height
    backgroundColor: '#F72798', // Adjust color as needed (blue)
  },
  rightRectangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%', // Half the width
    height: '100%', // Full height
    backgroundColor: '#9DBDFF', // Adjust color as needed (orange)
  },
});

export default SignUp;
