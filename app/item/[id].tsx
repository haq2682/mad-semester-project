import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, useTheme, View, ScrollView, Button, XStack, Spinner } from "tamagui";
import { fetchItemDetails, ItemDetails } from '../actions/fetchItemDetails';
import { getCurrentUser } from '../../lib/supabase';
import { addItemToCart } from '../actions/cartActions';

export default function ItemDetailsScreen() {
  const [quantity, setQuantity] = useState(1);
  const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [putting, setPutting] = useState(false);
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetchDetails() {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);

      if (!id || typeof id !== 'string') {
        setError('Invalid item ID');
        setLoading(false);
        return;
      }

      try {
        const details = await fetchItemDetails(id);
        if (details) {
          setItemDetails(details);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchDetails();
  }, [id]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    if (!itemDetails || !itemDetails.item_id) {
      alert('Item details not available. Please try again.');
      return;
    }

    try {
      setPutting(true);
      const user = await getCurrentUser();
      if (user && user.id) {
        await addItemToCart(user.id, {
          item_id: itemDetails.item_id,
          quantity,
          price: itemDetails.price,
          name: itemDetails.name,
        });
        alert('Item added to cart successfully!');
      } else {
        alert('User not found. Please log in again.');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
    finally {
      setPutting(false);
    }
  };

  if (loading) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={theme.background}>
        <Spinner size="large" color={theme.color} />
      </View>
    );
  }

  if (error || !itemDetails) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={theme.background}>
        <Text color={theme.color} fontSize={18} textAlign="center">{error || 'Item not found'}</Text>
        <Button
          onPress={() => router.back()}
          marginTop={20}
          backgroundColor={theme.accentBackground}
        >
          <Text color={theme.color}>Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        title: itemDetails.name,
        headerStyle: {
          backgroundColor: theme.color8.val
        },
        headerTintColor: theme.color.val
      }} />
      <ScrollView backgroundColor={theme.background}>
        <View paddingTop={20} height={'100%'} flex={1} flexDirection="column" alignItems="center">
          <View marginTop={20} width="95%" alignItems="center">
            <Image
              source={require('assets/item-burger.png')}
              style={{ width: '90%', height: 250, borderRadius: 10, borderColor: 'black', borderWidth: 1, shadowOpacity: 0.1, shadowColor: 'black' }}
              resizeMode="cover"
            />
          </View>

          <View marginTop={20} backgroundColor={theme.background} padding={10} width={'95%'} borderRadius={10} style={{ shadowOpacity: 0.1, shadowColor: 'black' }}>
            <Text color={theme.color} fontWeight="900" fontSize={30} marginBottom={10}>{itemDetails.name}</Text>
            <Text color={theme.color} fontSize={16} marginBottom={20}>{itemDetails.description}</Text>

            <XStack justifyContent="space-between" alignItems="center" marginBottom={20}>
              <Text color={theme.color} fontSize={18} fontWeight="600">{itemDetails.MenuCategories?.name}</Text>
              <Text color={theme.color} fontSize={24} fontWeight="bold">${itemDetails.price.toFixed(2)}</Text>
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

          {!isLoggedIn ? (
            <View
              marginTop={20}
              width={'95%'}
              backgroundColor={theme.color1}
              padding={15}
              borderRadius={10}
              alignItems="center"
            >
              <Text
                color={theme.color}
                fontSize={16}
                textAlign="center"
                marginBottom={10}
              >
                You need to be logged in to add items to your cart
              </Text>
              <Link href="/auth/login" asChild>
                <Button
                  backgroundColor={theme.accentBackground}
                  color={theme.color}
                >
                  Go to Login
                </Button>
              </Link>
            </View>
          ) : (
            <View marginTop={20} width={'95%'}>
              <Button
                onPress={handleAddToCart}
                backgroundColor={theme.accentBackground}
                color={theme.color}
                disabled={putting}
              >
                {putting ? 'Adding...' : 'Add to Cart'}
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

