import React, { useState } from 'react';
import { Image } from 'react-native';
import { Stack, Link } from 'expo-router';
import { Input, Text, useTheme, View, ScrollView, Button, YStack, XStack } from "tamagui";

export default function ItemDetailsScreen() {
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <ScrollView backgroundColor={theme.background}>
      <View paddingTop={20} height={'100%'} flex={1} flexDirection="column" alignItems="center">
        <View marginTop={20} width="95%" alignItems="center">
          <Image
            source={{ uri: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg' }}
            style={{ width: '90%', height: 250, borderRadius: 10, borderColor: 'black', borderWidth: 1, shadowOpacity: 0.1, shadowColor: 'black' }}
            resizeMode="cover"
          />
        </View>

        <View marginTop={20} backgroundColor={theme.background} padding={10} width={'95%'} borderRadius={10} style={{ shadowOpacity: 0.1, shadowColor: 'black' }}>
          <Text color={theme.color} fontWeight="900" fontSize={30} marginBottom={10}>"item_name"</Text>
          <Text color={theme.color} fontSize={16} marginBottom={20}>"A burger is a classic sandwich consisting of a juicy, seasoned patty—often beef—grilled to perfection and nestled between a soft, toasted bun."</Text>

          <XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
            <Text color={theme.color} fontSize={18} fontWeight="600">"category"</Text>
            <Text color={theme.color} fontSize={24} fontWeight="bold">$"price"</Text>
          </XStack>

          <XStack alignItems="center" justifyContent="space-between" marginBottom={20} marginTop={10}>
            <Text color={theme.color} fontSize={18}>Quantity:</Text>
            <XStack alignItems="center" backgroundColor={theme.color1} borderRadius={25} padding={5} marginTop={5}>
              <Button onPress={handleDecrement} size="$2" circular backgroundColor={theme.accentBackground}>
                -
              </Button>
              <Text color={theme.color} fontSize={20} fontWeight="bold" marginHorizontal={15}>
                {quantity}
              </Text>
              <Button onPress={handleIncrement} size="$2" circular backgroundColor={theme.accentBackground}>
                +
              </Button>
            </XStack>
          </XStack>
        </View>

        <View marginTop={20} width={'95%'}>
          <Button backgroundColor={theme.accentBackground} color={theme.color}>
            Add to Cart
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}