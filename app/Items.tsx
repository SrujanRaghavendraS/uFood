import { Text, View, FlatList ,Image} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import dishes from './dishes.json'

const Tab = createBottomTabNavigator();


function ItemList() {
  const renderItem = ({ item }) => (
    <View className="bg-purple-300 p-2 m-2 rounded-3xl shadow" >
      <Image source={{ uri: item.image }} className='w-full h-40 rounded-3xl' />
      <Text className="text-lg font-bold mt-2 text-pink-600">{item.name}</Text>
      <Text className="text-black-600">Cost: {item.basic_cost.toFixed(2)}</Text>
      <Text className="text-black-600">Rating: {item.reviews.rating}</Text>
    </View>
  );

  return (
    <FlatList
      data={dishes.dishes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
    />
  );
}

function Home() {
  return (
    <View className='flex-1 bg-purple-500'>
       <ItemList />
    </View>
  );
}

function Checkout() {
  return (
    <View className='flex-1 bg-purple-500'>
      
    </View>
  );
}

function Profile() {
  return (
    <View className='flex-1 bg-purple-500'>
      
    </View>
  );
}

const Items = () => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#9DBDFF',  
          },
          headerTintColor: '#F72798',  
          headerTitleStyle: {
            fontWeight: 'bold',     
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

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F72798', 
          tabBarInactiveTintColor: 'black', 
          tabBarStyle: {
            backgroundColor: '#9DBDFF', 
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Checkout" component={Checkout} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Items;
