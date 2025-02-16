import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import dishData from '../app/dishes.json';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { Alert } from 'react-native';


const componentIcons = {
  "Tomatoes": "🍅",
  "Carrot": "🥕",
  "Soy Sauce": "🍶",
  "Peas": "🟢",
  "Dry Fruits": "🥜",
  "Fruits": "🍎",
  "Vegetables": "🥦",
  "Sprouts": "🌿",
  "Pizza Base": "🍕",
  "Tomato Sauce": "🍅",
  "Cheese": "🧀",
  "Bell Peppers": "🌶️",
  "Rice": "🍚",
  "Curd": "🥛",
  "Salt": "🧂",
  "Coriander": "🌿",
};

export const CustomizeDish = ({ route }) => {
  const { dishId } = route.params;
  const navigation = useNavigation();
  const selectedDish = dishData.dishes.find(dish => dish.id === dishId);

  // Ensure selectedDish and its components are defined
  const components = selectedDish?.components || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuantities, setSelectedQuantities] = useState(
    Array(components.length).fill('0')
  );
  const [totalPrice, setTotalPrice] = useState(selectedDish?.basic_cost || 0);
  const [nutrientValues, setNutrientValues] = useState({ carbs: 0, fats: 0 });

  const hopValue = useSharedValue(0);

  const hopAnimation = () => {
    hopValue.value = withSpring(10, { damping: 2, stiffness: 150 }, () => {
      hopValue.value = withSpring(0);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: hopValue.value }],
    };
  });

  const calculateDynamicValues = useCallback(() => {
    if (!selectedDish) return;

    let total = selectedDish.basic_cost || 0;
    let carbs = selectedDish?.basic_carbs || 0;
    let fats = selectedDish?.basic_fats || 0;

    selectedQuantities.forEach((quantity, index) => {
      if (quantity !== '0') {
        const priceKey =
          quantity === 'Low' ? 'component Price Low' :
          quantity === 'Medium' ? 'component Price Medium' :
          'component Price High';

        total += selectedDish[priceKey]?.[index] || 0;

        const componentData = components[index];
        if (componentData) {
          carbs += quantity === 'Low' ? selectedDish.carbs.Low[index] :
                   quantity === 'Medium' ? selectedDish.carbs.Medium[index] :
                   selectedDish.carbs.High[index];

          fats += quantity === 'Low' ? selectedDish.fats.Low[index] :
                  quantity === 'Medium' ? selectedDish.fats.Medium[index] :
                  selectedDish.fats.High[index];
        }
      }
    });

    setTotalPrice(parseFloat(total.toFixed(2)));
    setNutrientValues({ carbs, fats });
  }, [selectedQuantities, selectedDish, components]);

  useEffect(() => {
    calculateDynamicValues();
  }, [selectedQuantities, calculateDynamicValues]);

  const handleQuantitySelection = (level, index) => {
    setSelectedQuantities((prev) => {
      const updatedQuantities = [...prev];
      updatedQuantities[index] = level;
      return updatedQuantities;
    });
    hopAnimation();
  };

  const handleCheckout = () => {
    if (!selectedDish) return;
  
    const orderSummary = selectedQuantities
      .map((quantity, index) => {
        if (quantity !== '0') {
          return `${components[index]}: ${quantity}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n");
  
    Alert.alert(
      "Order Summary",
      `Dish: ${selectedDish.name}\nTotal Price: ₹${totalPrice.toFixed(2)}\n\nSelected Components:\n${orderSummary || "No extra components selected."}`,
      [
        { text: "OK", onPress: () => navigation.navigate("Kitchen") } // Navigate after closing alert
      ]
    );
  };

  const getQuantityMultiplier = (quantity) => {
    switch (quantity) {
      case '0': return 1; // Display 1 icon when quantity is 0
      case 'Low': return 1; // Display 1 icon for Low
      case 'Medium': return 2; // Display 2 icons for Medium
      case 'High': return 3; // Display 3 icons for High
      default: return 0;
    }
  };

  if (!selectedDish) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Dish not found!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F3F4F6' }}>
      {/* Nutrient Bars */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Carbohydrates</Text>
        <View style={{ backgroundColor: '#E5E7EB', height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ width: `${nutrientValues.carbs}%`, height: '100%', backgroundColor: '#3B82F6' }} />
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, marginTop: 8 }}>Fats</Text>
        <View style={{ backgroundColor: '#E5E7EB', height: 10, borderRadius: 5, overflow: 'hidden' }}>
          <View style={{ width: `${nutrientValues.fats}%`, height: '100%', backgroundColor: '#F59E0B' }} />
        </View>
      </View>

      {/* 3D Model Placeholder */}
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
        {components[currentIndex] ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {Array(getQuantityMultiplier(selectedQuantities[currentIndex])).fill().map((_, i) => (
              <Animated.Text key={i} style={[{ fontSize: 80, marginLeft: -30 }, animatedStyle]}>
                {componentIcons[components[currentIndex]]}
              </Animated.Text>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            Select a Component
          </Text>
        )}
      </View>

      {/* Dish Details */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
        {selectedDish.name}
      </Text>

      {/* Scrollable Component Selection */}
      <FlatList
        data={components}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              backgroundColor: currentIndex === index ? '#3B82F6' : '#E0F2FE',
              padding: 16,
              borderRadius: 8,
              marginHorizontal: 10,
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => setCurrentIndex(index)}
          >
            <MaterialIcons
              name={currentIndex === index ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={currentIndex === index ? 'white' : 'black'}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: currentIndex === index ? 'white' : 'black' }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Quantity Selection */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 0 }}>
        {['0', 'Low', 'Medium', 'High'].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => handleQuantitySelection(level, currentIndex)}
            style={{
              backgroundColor: selectedQuantities[currentIndex] === level ? '#3B82F6' : '#E5E7EB',
              padding: 12,
              borderRadius: 8,
              marginHorizontal: 8,
            }}
          >
            <Text style={{ color: selectedQuantities[currentIndex] === level ? 'white' : 'black', fontSize: 16 }}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Price and Checkout */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <TouchableOpacity style={{ backgroundColor: '#F87171', padding: 12, borderRadius: 8 }}>
          <MaterialIcons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Total Price: ₹ {totalPrice.toFixed(2)}
        </Text>
        <TouchableOpacity style={{ backgroundColor: '#22C55E', padding: 12, borderRadius: 8 }} onPress={handleCheckout}>
          <MaterialIcons name="check" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomizeDish;