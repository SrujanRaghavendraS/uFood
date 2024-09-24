import { Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <View>
      <></>
    </View>
  );
}

function Checkout() {
  return (
    <View>
      <></>
    </View>
  );
}

function Profile() {
  return (
    <View>
      <></>
    </View>
  );
}

const Items = () => {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#9DBDFF',  // Set background color of the header
          },
          headerTintColor: '#F72798',   // Set color of the header text
          headerTitleStyle: {
            fontWeight: 'bold',       // Make the title bold
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Checkout') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            // Return the appropriate icon
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F72798', 
          tabBarInactiveTintColor: 'black', 
          tabBarStyle: {
            backgroundColor: '#9DBDFF', // Set the background color of the navigation bar
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Checkout" component={Checkout} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      
  );
};

export default Items;
