import React from 'react';
import { YStack, Text, Button, View, useTheme, Image } from "tamagui";
import { Stack } from "expo-router";
import { useNavigation } from 'expo-router';


export default function ThankYouScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  //const { orderId } = route.params; // Assuming orderId is passed via route params

  const handlePlaceAnotherOrder = () => {
    navigation.navigate('Home');
  };

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
            <Text color={theme.color} fontSize={18} marginBottom={5}>Order ID:</Text>
            <Text color={theme.accentBackground} fontWeight="700" fontSize={28}>orderId</Text>
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