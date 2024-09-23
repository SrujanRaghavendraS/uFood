import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from 'expo-router';

const SignIn = () => {
  const urls = ['https://uf1.chirag973one.workers.dev']
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email'); 
 

  const handleEvent = async () => {
    if(step!=='email'){
      
        const response1=await fetch ( urls[0]+'/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gmail: email ,pass:password}),
      });
      const data2=await response1.json();
      console.log(data2)
      if(data2.msg==="Correct Password"){
        Alert.alert("Login Successful");
      }
      else{
        Alert.alert('Wrong Password');
      }
      
    }


    if (step === 'email') {
      if (!email) {
        Alert.alert('Email cannot be blank');
        return;
      }
      
      try {
        const response = await fetch(urls[0] + '/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gmail: email }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data)
        
        if (data.msg === 'User Exists') {
          setStep('password');
        } else {
          Alert.alert('Redirecting to sign up');
          navigation.navigate('SignUp'); 
        }
      } catch (error) {
        console.error("Error during email check:", error);
        Alert.alert("An error occurred. Please try again.");
      }
      
    }
  };

  return (
    // @ts-ignore
    <View className="flex-1 justify-center items-center bg-gray-200 relative">
    {/*@ts-ignore*/}
      <View style={styles.leftRectangle} />
    {/*@ts-ignore*/}
      <View style={styles.rightRectangle} />

      <View className="w-11/12  p-6 rounded-3xl shadow-md backdrop-blur-xl bg-violet-500">
        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-2xl font-pblack text-white mr-2 text-center">Sign In</Text>
          <LottieView
            source={require("../animations/key.json")}
            style={{ width: 50, height: 50 }}
            autoPlay
            loop
          />
        </View>

        {step === 'email' ? (
          <TextInput
            className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-blue-400"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="white"
            inputMode='email'
          />
        ) : (
          <TextInput 
          className="w-full p-3 border border-gray-300 rounded-full mb-4 text-white bg-slate-700"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholderTextColor="gray"
        />
        )}

        <TouchableOpacity className="bg-pink-400 p-2 rounded-full w-full items-center mb-6 " onPress={handleEvent}>
          <Text className="text-white font-pblack">{step === 'email' ? 'Next' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = ({
  leftRectangle: {
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
  rightRectangle: {
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

export default SignIn;
