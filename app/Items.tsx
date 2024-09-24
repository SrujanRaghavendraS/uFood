import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import dishes from './dishes.json';
import LottieView from 'lottie-react-native';
const Tab = createBottomTabNavigator();

function ItemList() {
  const renderItem = ({ item }) => (
    <View className="bg-white p-4 m-3 rounded-lg shadow-md flex-row items-center">
      <Image 
        source={{ uri: item.image }} 
        className="w-28 h-28 rounded-lg" 
        style={{ marginRight: 12 }} // Adds spacing between image and text
      />
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-900 mb-1">{item.name}</Text>
        <Text className="text-gray-600 mb-1">Cost: ${item.basic_cost.toFixed(2)}</Text>
        <Text className="text-gray-600 mb-1">Rating: {item.reviews.rating} ★</Text>

        {/* Customize Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#0077B6', 
            paddingVertical: 8, 
            paddingHorizontal: 16, 
            borderRadius: 8, 
            marginTop: 8
          }}
          onPress={() => alert(`Customizing: ${item.name}`)}
        >
          <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
            Customize Your Food
          </Text>
          
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={dishes.dishes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      contentContainerStyle={{ paddingBottom: 16 }} // Adds bottom padding to prevent last item from being cut off
    />
  );
}

function Home() {
  return (
    <View className="flex-1 bg-gray-100 p-2">
      <ItemList />
    </View>
  );
}

function Checkout() {
  return (
    <View className="flex-1 bg-gray-100 p-2">
      {/* Add Checkout content here */}
    </View>
  );
}

function Profile() {
  return (
    <View className="flex-1 bg-gray-100 p-2">
      {/* Add Profile content here */}
    </View>
  );
}

const Items = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Checkout') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0077B6', // Blue when tab is active
          tabBarInactiveTintColor: '#8E8E93', // Gray when tab is inactive
          tabBarStyle: {
            backgroundColor: '#F1F5F9',  // Light gray for a neutral base
          },
        })}
      >
        <Tab.Screen 
  name="Home" 
  component={Home} 
  options={{
    headerTitle: () => (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Text className='font-pblack text-3xl text-violet-400'>uFood</Text> 
        <LottieView 
          source={require('../animations/leaf.json')} 
          autoPlay
          loop
          style={{ width: 50, height: 50 }}
        />
      </View>
    ),
    headerStyle: {
      backgroundColor: '#F1F5F9',
    },
  }}  
/>
        <Tab.Screen name="Checkout" component={Checkout} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Items;
