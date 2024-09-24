import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { StatusBar } from "expo-status-bar";
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const Homepage = () => {
  const navigation = useNavigation();

  const handleGetStarted = async () => {
    try {
      const response = await fetch('https://uf1.chirag973one.workers.dev/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === "OK") {
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Server Error', 'Something went wrong, please try again later.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Could not connect to the server.');
    }
  };

  return (
    <View className="flex-1 relative justify-center items-center bg-gray-200">
      {/* Upper Left Triangle */}
      <View style={styles.upperLeftTriangle} />
      {/* Lower Right Triangle */}
      <View style={styles.lowerRightTriangle} />
      
      <View className="flex-row items-center">
        <Text className='text-3xl text-black font-pblack'>uFood</Text>
        <LottieView
          source={require("../../animations/leaf.json")}
          style={{ width: 100, height: 100 }} // Adjust size as necessary
          autoPlay
          loop
        />
      </View>

      {/* Get Started Button */}
      <TouchableOpacity onPress={handleGetStarted}>
        <LottieView 
          source={require("../../animations/GetStartedButton.json")}
          style={{ width: 100, height: 100 }} 
          autoPlay
          loop
        />
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  upperLeftTriangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 300, // Adjust size as necessary
    borderBottomWidth: 300, // Adjust size as necessary
    borderLeftColor: '#F72798', // Upper left triangle color
    borderBottomColor: 'transparent',
  },
  lowerRightTriangle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderRightWidth: 300, // Adjust size as necessary
    borderTopWidth: 300, // Adjust size as necessary
    borderRightColor: '#9DBDFF', // Lower right triangle color
    borderTopColor: 'transparent',
  },
});

export default Homepage;
