import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import dishData from '../app/dishes.json';
import { useNavigation } from '@react-navigation/native';

export const CustomizeDish = ({ route }) => {
  const { dishId } = route.params;
  const navigation = useNavigation();
  const selectedDish = dishData.dishes.find(dish => dish.id === dishId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuantities, setSelectedQuantities] = useState(
    Array(selectedDish.components.length).fill('0')
  );
  const [totalPrice, setTotalPrice] = useState(selectedDish.basic_cost);
  const flatListRef = useRef(null);

  // Function to calculate the dynamic price based on selected quantities
  const calculateDynamicPrice = useCallback(() => {
    let total = selectedDish.basic_cost;
    selectedQuantities.forEach((quantity, index) => {
      if (quantity !== '0') {
        const priceKey =
          quantity === 'Low'
            ? 'component Price Low'
            : quantity === 'Medium'
            ? 'component Price Medium'
            : 'component Price High';

        total += selectedDish[priceKey]?.[index] || 0;
      }
    });
    setTotalPrice(parseFloat(total.toFixed(2))); // Round to 2 decimal places
  }, [selectedQuantities, selectedDish]);

  useEffect(() => {
    calculateDynamicPrice();
  }, [selectedQuantities, calculateDynamicPrice]);

  // Handle FlatList scrolling updates
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  // Function to handle quantity selection for a component
  const handleQuantitySelection = (level) => {
    setSelectedQuantities((prev) => {
      const updatedQuantities = [...prev];
      updatedQuantities[currentIndex] = level;
      return updatedQuantities;
    });
  };

  const handleCheckout = () => {
    const checkoutData = { selectedDish, selectedQuantities, totalPrice };
    navigation.navigate('Checkout', { checkoutData });
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F3F4F6' }}>
      {/* Horizontal Nutrient Bars */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Carbohydrates</Text>
        <View style={{ backgroundColor: '#E5E7EB', height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ width: '60%', height: '100%', backgroundColor: '#3B82F6' }} />
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, marginTop: 8 }}>Fats</Text>
        <View style={{ backgroundColor: '#E5E7EB', height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ width: '40%', height: '100%', backgroundColor: '#F59E0B' }} />
        </View>
      </View>

      {/* Empty Card for 3D Models */}
      <View
        style={{
          width: '100%',
          height: 200,
          backgroundColor: '#E5E7EB',
          borderRadius: 12,
          marginBottom: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          Empty Card for 3D Models
        </Text>
      </View>

      {/* Dish Details */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        {selectedDish.name}
      </Text>

      {/* Components List */}
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={selectedDish.components}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              backgroundColor: currentIndex === index ? '#E0F2FE' : 'white',
              padding: 16,
              borderRadius: 8,
              shadowOpacity: 0.2,
              marginHorizontal: 8,
              width: 250,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
              {item}
            </Text>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({ length: 260, offset: 260 * index, index })}
        snapToAlignment="start"
        snapToInterval={260}
      />

      {/* Quantity Selection Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
        {['0', 'Low', 'Medium', 'High'].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => handleQuantitySelection(level)}
            style={{
              backgroundColor: selectedQuantities[currentIndex] === level ? '#3B82F6' : '#E5E7EB',
              padding: 12,
              borderRadius: 8,
              marginHorizontal: 8,
            }}
          >
            <Text
              style={{
                color: selectedQuantities[currentIndex] === level ? 'white' : 'black',
                fontSize: 16,
              }}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Price and Checkout Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
        }}
      >
        <TouchableOpacity
          style={{ backgroundColor: '#F87171', padding: 12, borderRadius: 8 }}
        >
          <MaterialIcons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Total Price: ₹ {totalPrice.toFixed(2)}
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#22C55E', padding: 12, borderRadius: 8 }}
          onPress={handleCheckout}
        >
          <MaterialIcons name="check" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomizeDish;
