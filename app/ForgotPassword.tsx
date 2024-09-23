import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleEvent = () => {
    if (!email) {
      Alert.alert('Email field cannot be blank');
      return;
    }
    if (otpVisible) {
      Alert.alert(`We have sent a mail to change the password to ${email}`);
      navigation.navigate('SignIn');
      return;
    }
    setOtpVisible(true);
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move to the next input if the current one is filled
    if (value.length === 1 && index < 3) {
      const nextInput = index + 1;
      newOtp[nextInput] = ""; 
      setOtp(newOtp);
    }

    setOtp(newOtp);
  };

  return (
    <View className="flex-1 justify-center items-center bg-black relative">
      {/* Background Rectangles */}
      <View style={styles.leftRectangle} />
      <View style={styles.rightRectangle} />

      <View className="w-11/12 bg-black p-6 rounded-lg shadow-md">
        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-2xl font-pblack text-white mr-2 text-center">
            {otpVisible ? 'Enter OTP' : 'Enter your email'}
          </Text>
        </View>

        {!otpVisible ? (
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-slate-700"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="gray"
            inputMode='email'
          />
        ) : (
          <View className="flex-row justify-between mb-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                className="w-12 h-12 border border-gray-300 rounded text-center text-white bg-slate-700 mx-1"
                placeholder="*"
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          className="bg-green-400 p-2 rounded-full w-full items-center mb-6"
          onPress={handleEvent}
        >
          <Text className="text-black font-pblack">
            {otpVisible ? 'Submit OTP' : 'Generate OTP'}
          </Text>
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
    width: '50%', 
    height: '100%', 
    backgroundColor: 'slategray', 
  },
  rightRectangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%', 
    height: '100%', 
    backgroundColor: 'slateblue', 
  },
});

export default ForgotPassword;
