import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons'; // Importing icon library
import dishData from '../app/dishes.json'; // Import your JSON file
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Text key={i} style={i < rating ? styles.filledStar : styles.emptyStar}>
        ★
      </Text>
    );
  }
  return stars;
};

export const CustomizeDish = ({ route }) => {
  const { dishId } = route.params; // Get the selected dish ID passed from the home page
  const navigation = useNavigation(); // Initialize navigation

  // Find the selected dish from the JSON
  const selectedDish = dishData.dishes.find(dish => dish.id === dishId);

  // Initialize state for component quantities (0/Low/Medium/High)
  const [componentQuantities, setComponentQuantities] = useState(
    selectedDish.components.map(() => '0') // Default to '0' for all components
  );

  // Initialize state for total price
  const [totalPrice, setTotalPrice] = useState(selectedDish.basic_cost);

  // Function to handle quantity change (0 -> Low -> Medium -> High)
  const updateQuantity = (index, change) => {
    const newQuantities = [...componentQuantities];
    const quantities = ['0', 'Low', 'Medium', 'High'];
    let currentIndex = quantities.indexOf(newQuantities[index]);
    currentIndex = (currentIndex + change + 4) % 4; // Cycle through 0, Low, Medium, High
    newQuantities[index] = quantities[currentIndex];
    setComponentQuantities(newQuantities);
  };

  // Calculate dynamic price based on selected quantity
  const calculateDynamicPrice = (index) => {
    const quantity = componentQuantities[index];
    switch (quantity) {
      case '0':
        return 0; // No additional cost
      case 'Low':
        return selectedDish['component Price Low'][index];
      case 'Medium':
        return selectedDish['component Price medium'][index];
      case 'High':
        return selectedDish['components Price High'][index];
      default:
        return 0;
    }
  };

  // Update total price whenever component quantities change
  useEffect(() => {
    const newTotalPrice = componentQuantities.reduce((total, _, index) => {
      return total + calculateDynamicPrice(index);
    }, selectedDish.basic_cost);
    
    // Round the total price to 2 decimal points
    setTotalPrice(Math.round(newTotalPrice * 100) / 100);
  }, [componentQuantities]);

  const renderComponent = ({ item, index }) => (
    <View style={styles.componentContainer}>
      <Text style={styles.componentText}>{item}</Text>
      
      <View style={styles.sizeContainer}>
        {/* Display all three prices in the same container */}
        <Text style={styles.priceText}>0: ₹0.00</Text>
        <Text style={styles.priceText}>Low: ₹{selectedDish['component Price Low'][index].toFixed(2)}</Text>
        <Text style={styles.priceText}>Medium: ₹{selectedDish['component Price medium'][index].toFixed(2)}</Text>
        <Text style={styles.priceText}>High: ₹{selectedDish['components Price High'][index].toFixed(2)}</Text>
        
        <Text style={styles.selectedQuantity}>Selected: {componentQuantities[index]}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(index, -1)} style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{componentQuantities[index]}</Text>
          <TouchableOpacity onPress={() => updateQuantity(index, 1)} style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Function to handle the tick button click
  const handleCheckout = () => {
    
    // Prepare data to be passed to Checkout
    const checkoutData = {
      selectedDish,
      componentQuantities,
      totalPrice,
    };
    // // Navigate to Checkout and pass the data
    navigation.navigate('Checkout', { checkoutData });
  };

  return (
    <View style={styles.container}>
      {/* Dish details */}
      <Image source={{ uri: selectedDish.image }} style={styles.dishImage} />
      <View style={styles.dishHeader}>
        <Text style={styles.dishName}>{selectedDish.name}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(Math.round(selectedDish.reviews.rating))}
        </View>
      </View>
      <Text style={styles.dishCost}>Base Price: ₹{selectedDish.basic_cost.toFixed(2)}</Text>

      {/* Horizontal scrollable components list */}
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={selectedDish.components}
        renderItem={renderComponent}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.componentList}
        snapToAlignment="start" // Snap to start of each item
        snapToInterval={320} // Width of the item + margin
      />

      {/* Display the total price and buttons */}
      <View style={styles.totalPriceContainer}>
        <TouchableOpacity style={styles.crossButton}>
          <MaterialIcons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.totalPriceText}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.tickButton} onPress={handleCheckout}>
          <MaterialIcons name="check" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  dishImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  filledStar: {
    color: '#FFD700', // Gold color for filled stars
    fontSize: 20,
  },
  emptyStar: {
    color: '#D3D3D3', // Light gray color for empty stars
    fontSize: 20,
  },
  dishCost: {
    fontSize: 18,
    marginBottom: 16,
  },
  componentList: {
    paddingBottom: 16,
    paddingHorizontal: 16, // Added padding on the left and right
  },
  componentContainer: {
    width: 300, // Width of each component container
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 10, // Margin between containers
    marginBottom: -14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  componentText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  sizeContainer: {
    alignItems: 'center',
  },
  selectedQuantity: {
    fontSize: 16,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: '#1EB1FC',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
  },
  quantityValue: {
    fontSize: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dynamicPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  tickButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
  },
  crossButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default CustomizeDish;
