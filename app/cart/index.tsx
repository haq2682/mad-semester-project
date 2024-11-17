import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Card, YStack, Button, Input } from "tamagui";
import { Stack, useNavigation } from 'expo-router';
import { Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const cartItems: CartItemProps[] = [
  { id: 1, title: 'Chili Tomatina', price: 9.99, image: 'https://picsum.photos/200', quantity: 1 },
  { id: 2, title: 'Zinger Burger', price: 5.99, image: 'https://picsum.photos/200', quantity: 3 },
  { id: 3, title: 'Chicken Burger', price: 2.99, image: 'https://picsum.photos/200', quantity: 2 },
  { id: 4, title: 'Anday Wala Burger', price: 1.99, image: 'https://picsum.photos/200', quantity: 1 },
  { id: 5, title: 'Patty Burger', price: 2.99, image: 'https://picsum.photos/200', quantity: 2 },
  { id: 6, title: 'Dragon Sauce Burger', price: 2.99, image: 'https://picsum.photos/200', quantity: 1 },
];

const CartItem = ({ id, title, price, image, quantity, updateQuantity }: CartItemProps & { updateQuantity: (id: number, quantity: number) => void }) => {
  return (
    <View flex={1} flexDirection="row" justifyContent="space-between" backgroundColor="$background075" marginVertical={2.5} padding="$3">
      <View flex={1} flexDirection="row">
        <Card elevation={2}>
          <Image source={{ uri: image }} style={{ height: 80, width: 80 }} />
        </Card>
        <View marginTop="$2" marginLeft="$3">
          <Text fontSize={16} fontWeight="700">{title}</Text>
        </View>
      </View>
      <View flex={1} flexDirection="column" justifyContent="space-between" alignItems="flex-end">
        <Text>${price.toFixed(2)}</Text>
        <View backgroundColor="$accentBackground" flexDirection="row" marginBottom={10} paddingHorizontal="$2" paddingVertical="$2" borderRadius={10} justifyContent="space-between" alignItems="center">
          <Button backgroundColor="$background" borderRadius={100} padding="$1" onPress={() => updateQuantity(id, quantity - 1)}>
            <AntDesign name="minus" size={15} color="$accentColor" />
          </Button>
          <Text color="white" marginHorizontal={3} fontSize={15}>{quantity}</Text>
          <Button backgroundColor="$background" borderRadius={100} padding="$1" onPress={() => updateQuantity(id, quantity + 1)}>
            <AntDesign name="plus" size={15} color="$accentColor" />
          </Button>
        </View>
      </View>
    </View>
  );
};

export default function Cart() {
  const navigation = useNavigation();
  const [items, setItems] = useState<CartItemProps[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const deliveryFee = 2.00;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });

  const handleConfirmPayment = () => {
    if (paymentMethod === 'COD') {
      alert('Cash on Delivery selected!');
      navigation.navigate('confirm');
    } else if (paymentMethod === 'Card') {
      if (
        cardDetails.cardNumber &&
        cardDetails.expiryDate &&
        cardDetails.cvv &&
        cardDetails.cardHolderName
      ) {
        alert('Payment successful!');
        navigation.navigate('confirm');
      } else {
        alert('Please fill in all card details.');
      }
    } else {
      alert('Please select a payment method.');
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  useEffect(() => {
    setItems(cartItems);
  }, []);

  useEffect(() => {
    const newSubTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubTotal(newSubTotal);
    setGrandTotal(newSubTotal + deliveryFee);
  }, [items]);

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "Cart",
        headerStyle: {
          backgroundColor: "$color8",
        }
      }} />
      <ScrollView backgroundColor="$background" contentContainerStyle={{ flexGrow: 1 }}>
        <View marginVertical={10}>
          {items.map((item) => (
            <CartItem key={item.id} {...item} updateQuantity={updateQuantity} />
          ))}
        </View>
        <View backgroundColor="$color3" paddingHorizontal={10}>
          <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
            <Text fontSize={16} fontWeight="900">Subtotal</Text>
            <Text fontSize={16} fontWeight="900">${subTotal.toFixed(2)}</Text>
          </View>
          <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
            <Text fontSize={14} fontWeight="800">Delivery Fee</Text>
            <Text fontSize={14} fontWeight="800">${deliveryFee.toFixed(2)}</Text>
          </View>
          <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
            <Text fontSize={18} fontWeight="900">Grand Total</Text>
            <Text fontSize={18} fontWeight="900">${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
        <YStack padding={20} space={20} flex={1}>
          <Text fontWeight="900" fontSize={20} textAlign="center">
            Select Payment Method
          </Text>

          <YStack space={15}>
            <Button
              onPress={() => setPaymentMethod('COD')}
              backgroundColor={paymentMethod === 'COD' ? '$accentBackground' : '$color1'}
              borderColor={paymentMethod === 'COD' ? '$color' : 'black'}
              borderWidth={1}
              borderRadius={30}
              paddingVertical={15}
              height={52}
            >
              <Text fontWeight="600" fontSize={16}>Cash on Delivery</Text>
            </Button>

            <Button
              onPress={() => setPaymentMethod('Card')}
              backgroundColor={paymentMethod === 'Card' ? '$accentBackground' : '$color1'}
              borderColor={paymentMethod === 'Card' ? '$color' : 'black'}
              borderWidth={1}
              borderRadius={30}
              paddingVertical={15}
              height={52}
            >
              <Text fontWeight="600" fontSize={16}>Credit/Debit Card</Text>
            </Button>
          </YStack>

          {paymentMethod === 'Card' && (
            <YStack space={15} backgroundColor="$color1" padding={15} borderRadius={10}>
              <Input
                placeholder="Card Number"
                keyboardType="numeric"
                maxLength={16}
                onChangeText={(value) => setCardDetails({ ...cardDetails, cardNumber: value })}
                backgroundColor="$background"
                fontSize={14}
              />
              <Input
                placeholder="Expiry Date (MM/YY)"
                maxLength={5}
                onChangeText={(value) => setCardDetails({ ...cardDetails, expiryDate: value })}
                backgroundColor="$background"
                fontSize={14}
              />
              <Input
                placeholder="CVV"
                keyboardType="numeric"
                maxLength={3}
                onChangeText={(value) => setCardDetails({ ...cardDetails, cvv: value })}
                backgroundColor="$background"
                fontSize={14}
              />
              <Input
                placeholder="Card Holder Name"
                onChangeText={(value) => setCardDetails({ ...cardDetails, cardHolderName: value })}
                backgroundColor="$background"
                fontSize={14}
              />
            </YStack>
          )}

          <YStack flex={1} justifyContent="flex-end">
            <Button
              onPress={handleConfirmPayment}
              backgroundColor="$accentBackground"
              borderRadius={30}
              paddingHorizontal={15}
              height={52}
            >
              <Text fontWeight="600" fontSize={16}>Confirm Payment</Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
