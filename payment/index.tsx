import React, { useState } from 'react';
import { ScrollView, YStack, Text, Button, Input, View, XStack, useTheme } from "tamagui";

export default function PaymentMethodScreen({ navigation }) {
  const theme = useTheme();
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
      navigation.navigate('ThankYou');
    } else if (paymentMethod === 'Card') {
      if (
        cardDetails.cardNumber &&
        cardDetails.expiryDate &&
        cardDetails.cvv &&
        cardDetails.cardHolderName
      ) {
        alert('Payment successful!');
        navigation.navigate('ThankYou');
      } else {
        alert('Please fill in all card details.');
      }
    } else {
      alert('Please select a payment method.');
    }
  };

  return (
    <ScrollView backgroundColor={theme.background} contentContainerStyle={{ flexGrow: 1 }}>
      <YStack padding={20} space={20} flex={1}>
        <Text color={theme.color} fontWeight="900" fontSize={20} textAlign="center">
          Select Payment Method
        </Text>

        <YStack space={15}>
          <Button
            onPress={() => setPaymentMethod('COD')}
            backgroundColor={paymentMethod === 'COD' ? theme.accentBackground : theme.color1}
            borderColor={paymentMethod === 'COD' ? theme.color : 'black'}
            borderWidth={1}
            borderRadius={30}
            paddingVertical={15}
            height={52}
          >
            <Text color={theme.color} fontWeight="600" fontSize={16}>Cash on Delivery</Text>
          </Button>

          <Button
            onPress={() => setPaymentMethod('Card')}
            backgroundColor={paymentMethod === 'Card' ? theme.accentBackground : theme.color1}
            borderColor={paymentMethod === 'Card' ? theme.color : 'black'}
            borderWidth={1}
            borderRadius={30}
            paddingVertical={15}
            height={52}
          >
            <Text color={theme.color} fontWeight="600" fontSize={16}>Credit/Debit Card</Text>
          </Button>
        </YStack>

        {paymentMethod === 'Card' && (
          <YStack space={15} backgroundColor={theme.color1} padding={15} borderRadius={10}>
            <Input
              placeholder="Card Number"
              keyboardType="numeric"
              maxLength={16}
              onChangeText={(value) => setCardDetails({ ...cardDetails, cardNumber: value })}
              backgroundColor={theme.background}
              color={theme.color}
              fontSize={14}
            />
            <Input
              placeholder="Expiry Date (MM/YY)"
              maxLength={5}
              onChangeText={(value) => setCardDetails({ ...cardDetails, expiryDate: value })}
              backgroundColor={theme.background}
              color={theme.color}
              fontSize={14}
            />
            <Input
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              onChangeText={(value) => setCardDetails({ ...cardDetails, cvv: value })}
              backgroundColor={theme.background}
              color={theme.color}
              fontSize={14}
            />
            <Input
              placeholder="Card Holder Name"
              onChangeText={(value) => setCardDetails({ ...cardDetails, cardHolderName: value })}
              backgroundColor={theme.background}
              color={theme.color}
              fontSize={14}
            />
          </YStack>
        )}

        <YStack flex={1} justifyContent="flex-end">
          <Button
            onPress={handleConfirmPayment}
            backgroundColor={theme.accentBackground}
            borderRadius={30}
            paddingHorizontal={15}
            height={52}
           
           
          >
            <Text color={theme.color} fontWeight="600" fontSize={16}>Confirm Payment</Text>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  );
}