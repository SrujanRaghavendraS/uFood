import { Text, View, FlatList, Image, TouchableOpacity, Dimensions,StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 
import dishes from './dishes.json';
import LottieView from 'lottie-react-native';
import {CustomizeDish} from '../app/CustomizeDish';
import { useState } from 'react';
import { Alert } from 'react-native';
// Create the tab navigator
const Tab = createBottomTabNavigator();

// Create the stack navigator
const Stack = createStackNavigator();

// ItemList component to display the list of dishes
function ItemList() {
  const screenWidth = Dimensions.get('window').width; // Get the screen width
  const itemWidth = screenWidth * 0.8; // Set item width to 80% of the screen width for better visibility
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("CustomizeDish", { dishId: item.id })}>
      <View
        className="bg-white p-6 rounded-lg shadow-md items-center"
        style={{
          width: itemWidth, // Dynamically set the width based on screen size
          marginHorizontal: 16, // Uniform spacing between items
          marginTop: 70, // Add a top margin
          marginBottom: 100,
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
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={dishes.dishes}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
      horizontal={true} // Horizontal scrolling
      showsHorizontalScrollIndicator={false} // Hides the scroll indicator for a cleaner look
      contentContainerStyle={{
        paddingHorizontal: (screenWidth - itemWidth - 40) / 2, // Centers the items
      }}
      snapToAlignment="center" // Ensures snapping to the center
      snapToInterval={itemWidth + 32} // Width of the container + margin/padding (adjust as per item width)
      decelerationRate="fast" // Makes the scrolling stop more quickly
      pagingEnabled={true} // Snaps exactly one item at a time
    />
  );
}

// Home component containing the ItemList
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

// Checkout component (currently empty)
function Checkout({ route }) {
  const { checkoutData } = route.params; // Get the data passed from CustomizeDish
  const [isOrderDeleted, setIsOrderDeleted] = useState(false); // State to track order deletion
  const [isconfirmed,setisconfirmed]=useState(false);
  const navigation = useNavigation();
  // Function to handle order deletion
  const handleDeleteOrder = () => {
    setIsOrderDeleted(true); // Update the state to indicate the order has been deleted
  };

  // Function to handle order confirmation
  const handleConfirmOrder = async () => {
    if (isconfirmed) {
      // If the order is already confirmed, navigate to the Kitchen
      navigation.navigate("Kitchen");
    } else {
      // If not confirmed, set the state to true and show the alert
      setisconfirmed(true); // Update the state to indicate the order is confirmed
  
      Alert.alert(
        'Order Confirmed',
        'We are redirecting you to our kitchen where you can view the live process of how your food is cooked',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Kitchen on OK
              navigation.navigate("Kitchen");
            }
          }
        ],
        { cancelable: false }
      );
    }
  };
  

  return (
    <View style={styles.container}>
      {isOrderDeleted ? (
        <Text style={styles.message}>No Orders to checkout</Text> // Display message when order is deleted
      ) : (
        <View style={styles.orderContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleDeleteOrder}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.dishName}>{checkoutData.selectedDish.name}</Text>
          <Text style={styles.totalPrice}>
            Total Price: ₹{checkoutData.totalPrice.toFixed(2)}
          </Text>

          <Text style={styles.subtitle}>Selected Components:</Text>
          {checkoutData.componentQuantities.map((quantity, index) => (
            <Text key={index} style={styles.componentText}>
              {checkoutData.selectedDish.components[index]}: {quantity}
            </Text>
          ))}

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={ handleConfirmOrder} // Disable if confirmed
             // Disable the button if order is confirmed
          >
            <Text style={styles.confirmButtonText}>
              {isconfirmed ? 'Take me to Kitchen' : 'Confirm Order'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}



// Profile component (currently empty)
function Kitchen() {
  return (
    <View className="flex-1 bg-gray-100 p-2">
      {/* Add Profile content here */}
    </View>
  );
}

// CustomizeDish component for customizing a dish


// Main Items component to set up navigation
const Items = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CustomizeDish" component={CustomizeDish}   />
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
          } else if (route.name === 'Checkout') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Kitchen') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0077B6', // Blue when tab is active
        tabBarInactiveTintColor: '#8E8E93', // Gray when tab is inactive
        tabBarStyle: {
          backgroundColor: '#F1F5F9', // Light gray for a neutral base
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
      <Tab.Screen name="Kitchen" component={Kitchen} />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Set default background color
  },
  orderContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f8f8f8', // You can change this to any color if needed
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'red', // You can change this color if needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dishName: {
    fontSize: 20,
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  componentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  message: {
    fontSize: 20,
    color: 'gray',
    textAlign: 'center', // Center the text
  },
  confirmButton: {
    marginTop: 20, // Space between the order details and the button
    backgroundColor: '#0077B6', // Button color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', // Center the text inside the button
  },
  confirmButtonText: {
    color: 'white', // Text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default Items;
