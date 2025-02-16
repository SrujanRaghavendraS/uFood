import { Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import dishes from './dishes.json';
import LottieView from 'lottie-react-native';
import { CustomizeDish } from '../app/CustomizeDish';

// Create the tab navigator
const Tab = createBottomTabNavigator();

// Create the stack navigator
const Stack = createStackNavigator();

// ItemList component to display the list of dishes
function ItemList() {
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth * 0.8;
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("CustomizeDish", { dishId: item.id })}>
      <View className="bg-white p-6 rounded-lg shadow-md items-center" style={{ width: itemWidth, marginHorizontal: 16, marginTop: 70, marginBottom: 100 }}>
        <Image source={{ uri: item.image }} className="w-3/5 h-3/5 rounded-lg mb-3" />
        <Text className="text-xl font-bold text-gray-800 mb-1">{item.name}</Text>
        <Text className="text-lg text-gray-700 mb-1">Cost: ${item.basic_cost.toFixed(2)}</Text>
        <Text className="text-lg text-gray-700">Rating: {item.reviews.rating} ★</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={dishes.dishes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: (screenWidth - itemWidth - 40) / 2 }}
      snapToAlignment="center"
      snapToInterval={itemWidth + 32}
      decelerationRate="fast"
      pagingEnabled={true}
    />
  );
}

// Home component containing the ItemList
function Home() {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-white p-4 mb-2 shadow-md">
        <Text className="text-2xl font-semibold text-gray-900">Menu</Text>
        <Text className="text-lg text-gray-600">Scroll through our dishes!</Text>
      </View>
      <ItemList />
    </View>
  );
}

// Kitchen component (currently empty)
function Kitchen() {
  return (
    <View className="flex-1 bg-gray-100 p-2">
      {/* Add Kitchen content here */}
    </View>
  );
}

// Main Items component to set up navigation
const Items = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CustomizeDish" component={CustomizeDish} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// MainTabs component for tab navigation
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Kitchen') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0077B6',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { backgroundColor: '#F1F5F9' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => (
            <View className="flex-row justify-between items-center w-full">
              <Text className="font-black text-3xl text-violet-400">uFood</Text>
              <LottieView
                source={require('../animations/leaf.json')}
                autoPlay
                loop
                className="w-12 h-12"
              />
            </View>
          ),
          headerStyle: { backgroundColor: '#F1F5F9' },
        }}
      />
      <Tab.Screen name="Kitchen" component={Kitchen} />
    </Tab.Navigator>
  );
};

export default Items;