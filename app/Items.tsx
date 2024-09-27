import { Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import dishes from './dishes.json';
import LottieView from 'lottie-react-native';

const Tab = createBottomTabNavigator();

function ItemList() {
  const screenWidth = Dimensions.get('window').width; // Get the screen width
  const itemWidth = screenWidth * 0.8; // Set item width to 80% of the screen width for better visibility

  const renderItem = ({ item }) => (
    <View
      className="bg-white p-6 rounded-lg shadow-md items-center"
      style={{
        width: itemWidth, // Dynamically set the width based on screen size
        marginHorizontal: 16, // Uniform spacing between items
        marginTop: 70, // Add a top margin
        marginBottom:100
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: itemWidth * 0.6, // Set image width to 60% of the container width
          height: itemWidth * 0.6, // Maintain aspect ratio
          borderRadius: 12, // Rounded corners
          marginBottom: 12, // Space between image and text
        }}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 16, color: '#555', marginBottom: 4 }}>
        Cost: ${item.basic_cost.toFixed(2)}
      </Text>
      <Text style={{ fontSize: 16, color: '#555' }}>Rating: {item.reviews.rating} ★</Text>
    </View>
  );

  return (
    <FlatList
      data={dishes.dishes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      horizontal={true} // Horizontal scrolling
      showsHorizontalScrollIndicator={false} // Hides the scroll indicator for a cleaner look
      contentContainerStyle={{
        paddingHorizontal: (screenWidth - itemWidth-40) / 2, // Centers the items
      }}
      snapToAlignment="center" // Ensures snapping to the center
      snapToInterval={itemWidth + 32} // Width of the container + margin/padding (adjust as per item width)
      decelerationRate="fast" // Makes the scrolling stop more quickly
      pagingEnabled={true} // Snaps exactly one item at a time
    />
  );
}

function Home() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Name and Price Container */}
      <View className="bg-white p-4 mb-2 shadow-md">
        <Text className="text-2xl font-semibold text-gray-900">Menu</Text>
        <Text className="text-lg text-gray-600">Scroll through our dishes!</Text>
      </View>

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
