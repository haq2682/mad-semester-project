import React, { useEffect, useState } from 'react';
import { YStack, Text, Button, View, useTheme, Image } from "tamagui";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { getOrderDetails, OrderProps } from '../actions/orderActions';
import { ActivityIndicator } from 'react-native';

export default function ThankYouScreen() {
  const theme = useTheme();
  const { orderNumber } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderNumber) {
          throw new Error('No order number provided');
        }

        const orderDetails = await getOrderDetails(Number(orderNumber));

        if (orderDetails) {
          setOrder(orderDetails);
        } else {
          throw new Error('Could not fetch order details');
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  const handlePlaceAnotherOrder = () => {
    router.replace('/');
  };

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={theme.background}>
        <ActivityIndicator size="large" color={theme.accentBackground.val} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <YStack
        flex={1}
        backgroundColor={theme.background}
        paddingHorizontal={20}
        paddingVertical={40}
        alignItems="center"
        justifyContent="center"
      >
        <Text color={theme.color} fontSize={18} textAlign="center">
          {error || 'Failed to load order details'}
        </Text>
        <Button
          marginTop={20}
          backgroundColor={theme.accentBackground}
          color={theme.color}
          onPress={() => router.replace('/')}
        >
          Go Back Home
        </Button>
      </YStack>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: "Order Confirmed",
        headerStyle: {
          backgroundColor: theme.color8.val
        }
      }} />
      <YStack
        flex={1}
        backgroundColor={theme.background}
        paddingHorizontal={20}
        paddingVertical={40}
        alignItems="center"
        justifyContent="space-between"
      >
        <Image
          source={{ uri: 'https://console.indolj.io/upload/1715331669-1715322106.jpg' }}
          width={120}
          height={120}
          borderRadius={60}
        />

        <YStack alignItems="center" space={20}>
          <Text color={theme.color} fontWeight="900" fontSize={40}>Thank You!</Text>
          <Text color={theme.color} fontSize={18} textAlign="center">
            Your order has been placed successfully.
          </Text>

          <View
            backgroundColor={theme.color1}
            paddingHorizontal={30}
            paddingVertical={20}
            borderRadius={15}
            shadowColor={theme.color}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={10}
          >
            <Text color={theme.color} fontSize={18} marginBottom={5}>Order Number:</Text>
            <Text color={theme.accentBackground} fontWeight="700" fontSize={28}>
              {order.order_number}
            </Text>

            <Text color={theme.color} fontSize={16} marginTop={10}>Delivery Details:</Text>
            <Text color={theme.color} fontSize={14}>
              Address: {order.address}
            </Text>
            <Text color={theme.color} fontSize={14}>
              Phone: {order.phone_number}
            </Text>
          </View>

          {/* Order Summary */}
          <View
            backgroundColor={theme.color1}
            paddingHorizontal={30}
            paddingVertical={20}
            borderRadius={15}
            width="100%"
          >
            <Text color={theme.color} fontSize={18} marginBottom={10}>Order Summary:</Text>
            {order.items?.map((item) => (
              <View key={item.item_id} flexDirection="row" justifyContent="space-between" marginBottom={5}>
                <Text color={theme.color} fontSize={14}>
                  {item.name} x {item.quantity}
                </Text>
                <Text color={theme.color} fontSize={14}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View
              borderTopWidth={1}
              borderTopColor={theme.color}
              marginTop={10}
              paddingTop={10}
              flexDirection="row"
              justifyContent="space-between"
            >
              <Text color={theme.color} fontWeight="700" fontSize={16}>
                Total
              </Text>
              <Text color={theme.color} fontWeight="700" fontSize={16}>
                ${order.total_price.toFixed(2)}
              </Text>
            </View>
          </View>
        </YStack>

        <Button
          backgroundColor={theme.accentBackground}
          color={theme.color}
          onPress={handlePlaceAnotherOrder}
          size="$5"
          borderRadius={30}
          paddingHorizontal={30}
          shadowColor={theme.color}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.2}
          shadowRadius={5}
          hoverStyle={{ opacity: 0.8 }}
          pressStyle={{ scale: 0.95 }}
        >
          Place Another Order
        </Button>
      </YStack>
    </>
  );
}