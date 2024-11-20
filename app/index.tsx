import { Href, Link, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Input, Text, Theme, useTheme, View, ScrollView, Stack, YStack, XStack, H4, Card } from 'tamagui';
import { FlatList, Animated, Dimensions, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface CardItemProps {
  id: number;
  title: string;
  price: number;
}

interface CategoryProps {
  id: string;
  title: string;
}

interface sidebarMenuItemsProps {
  path: Href<string>,
  title: string,
}

const categoryData: CategoryProps[] = [
  { id: '1', title: 'Category 1' },
  { id: '2', title: 'Category 2' },
  { id: '3', title: 'Category 3' },
  { id: '4', title: 'Category 4' },
  { id: '5', title: 'Category 5' },
];

const itemData: CardItemProps[] = [
  { id: 1, title: 'Card 1', price: 10 },
  { id: 2, title: 'Card 2', price: 12 },
  { id: 3, title: 'Card 3', price: 5 },
  { id: 4, title: 'Card 4', price: 8 },
  { id: 5, title: 'Card 5', price: 15 },
  { id: 6, title: 'Card 6', price: 15 },
];

const sidebarMenuItems: sidebarMenuItemsProps[] = [
  { path: '/', title: 'Home' },
  { path: '/profile', title: 'Profile' },
  { path: '/cart', title: 'Cart' },
  { path: '/about', title: 'About' },
  { path: '/contact', title: 'Contact' },
  { path: '/auth/login', title: 'Login' },
  { path: '/auth/signup', title: 'Register' },
];

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const theme = useTheme();
  const router = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-screenWidth * 0.8))[0];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    Animated.timing(slideAnim, {
      toValue: isOpen ? -screenWidth * 0.8 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderCategoryItem = ({ item }: { item: CategoryProps }) => (
    <Stack
      bg={theme.color10}
      padding="$2"
      marginHorizontal="$2"
      borderRadius="$4"
      alignItems="center"
      justifyContent="center"
      width={100}
    >
      <Text fontSize="$5" fontWeight="600" color={'black'}>
        {item.title}
      </Text>
    </Stack>
  );

  const CardItem = ({ id, title, price }: CardItemProps) => (
    <Link href={`/item/${id}`} asChild>
      <Card elevation={2} size="$4" bordered hoverStyle={{ scale: 0.925 }} pressStyle={{ scale: 0.85 }} animation='bouncy'>
        <H4 paddingRight={90} paddingLeft={15} paddingTop={5}>{title}</H4>
        <Card.Footer padded height={150} flex={1} flexDirection='row' alignItems='flex-end' justifyContent='flex-end'>
          <View>
            <Card elevation={1} padding={10}><Text borderRadius="$10" color={theme.color}>${price}</Text></Card>
          </View>
        </Card.Footer>
        <Card.Background>
          <Image source={require('assets/item-burger.png')} style={{ height: 160, width: 160, marginVertical: 12, marginHorizontal: 'auto' }} />
        </Card.Background>
      </Card>
    </Link>
  );

  const renderFoodItem = ({ item, index }: { item: CardItemProps; index: number }) => (
    <XStack key={item.id} justifyContent="center" space="$4" marginBottom="$4" marginHorizontal="$1">
      <CardItem id={item.id} title={item.title} price={item.price} />
    </XStack>
  );

  const isActive = (path: string) => router === path;

  return (
    <ScrollView backgroundColor={theme.background}>
      <View paddingTop={50} paddingBottom={15} paddingHorizontal={10} backgroundColor={theme.color8}>
        <View flex={1} flexDirection='row' justifyContent='space-between' marginBottom={7}>
          <View flex={1} flexDirection='row' columnGap={10} alignItems='center'>
            <AntDesign name="menuunfold" color={'black'} size={18} onPress={toggleSidebar} />
            <Text fontWeight={900} fontSize={15}>Burger Lab Clone</Text>
          </View>
          <View>
            <Link href="/cart" asChild>
              <FontAwesome6 name="cart-shopping" size={18} />
            </Link>
          </View>
        </View>
        <Input placeholder='Search your favorite food' size={'$2'} />
      </View>
      <Image source={require('assets/banner.jpg')} style={{ height: 176, marginVertical: 12, borderRadius: 8, marginHorizontal: 'auto', width: '98%', objectFit: 'fill' }} />
      <View>
        <FlatList
          data={categoryData}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
      <View marginTop={10}>
        <YStack space="$2" padding="$4">
          <FlatList
            data={itemData}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ alignItems: 'center' }}
          />
        </YStack>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          width: screenWidth * 0.8,
          height: '100%',
          transform: [{ translateX: slideAnim }],
          backgroundColor: theme.accentBackground.val,
          zIndex: 2,
        }}
      >
        <YStack marginTop={40}>
          <YStack space>
            <View width={'100%'}
              style={{
                flex: 1,
                position: 'relative',
              }}
              marginBottom={10}
            >
              <AntDesign
                name="close"
                size={24}
                style={{
                  color: 'black',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
                onPress={toggleSidebar}
              />
              <View marginTop="$4">
                <FlatList
                  data={sidebarMenuItems}
                  keyExtractor={(item: sidebarMenuItemsProps) => item.title}
                  renderItem={({ item }) => (
                    <Link href={item.path} asChild onPress={toggleSidebar}>
                      <View padding="$4" marginVertical="$2" backgroundColor={isActive(item.path as string) ? theme.color3 : theme.color2}>
                        <Text color={isActive(item.path as string) ? theme.accentColor : theme.color}>{item.title}</Text>
                      </View>
                    </Link>
                  )}
                />
              </View>
            </View>
          </YStack>
        </YStack>
      </Animated.View>
    </ScrollView>
  );
}
