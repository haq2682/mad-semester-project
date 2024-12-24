import { Href, Link, usePathname, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Input, Text, useTheme, View, ScrollView, Stack, YStack, XStack, H4, Card, Separator, Button, Image as TamaguiImage, Spinner } from 'tamagui';
import { FlatList, Animated, Dimensions, Image, TouchableOpacity, Touchable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { logout, getCurrentUser } from '../lib/supabase';
import { searchItems } from '../app/actions/search';
import { fetchMenuCategories } from './actions/fetchMenuCategories';
import { fetchHotSales, fetchNewProducts } from './actions/fetchProducts';
import { LinearGradient } from 'expo-linear-gradient';


interface CardItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CategoryProps {
  id: string;
  title: string;
}

interface sidebarMenuItemsProps {
  path: Href<string>;
  title: string;
  onPress?: () => void;
}

interface SearchResultItemProps {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ menuItems: SearchResultItemProps[], menuCategories: any[] }>({ menuItems: [], menuCategories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [hotSales, setHotSales] = useState<CardItemProps[]>([]);
  const [newProducts, setNewProducts] = useState<CardItemProps[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [hotSalesLoading, setHotSalesLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const slideAnim = useState(new Animated.Value(-screenWidth * 0.8))[0];

  useEffect(() => {
    fetchCategories();
    checkLoginStatus();
    fetchProductSections();
  }, []);

  const checkLoginStatus = async () => {
    const user = await getCurrentUser();
    setIsLoggedIn(!!user);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    Animated.timing(slideAnim, {
      toValue: isOpen ? -screenWidth * 0.8 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error('Logout failed:', error.message);
    } else {
      setIsLoggedIn(false);
      toggleSidebar();
      router.push('/auth/login');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setIsSearching(false);
      setNoResultsFound(false);
      return;
    }
    setIsSearching(true);
    const results = await searchItems(query);
    if ('error' in results) {
      console.error(results.error);
      setNoResultsFound(true);
    } else {
      setSearchResults(results);
      setNoResultsFound(results.menuItems.length === 0 && results.menuCategories.length === 0);
    }
  };

  const fetchProductSections = async () => {
    setHotSalesLoading(true);
    const hotSalesProducts = await fetchHotSales();
    setHotSalesLoading(false);
    setNewLoading(true);
    const newProductsData = await fetchNewProducts();
    setNewLoading(false);

    setHotSales(hotSalesProducts.map(item => ({
      id: item.item_id,
      title: item.name,
      price: item.price,
      image: item.image
    })));

    setNewProducts(newProductsData.map(item => ({
      id: item.item_id,
      title: item.name,
      price: item.price,
      image: item.image
    })));
  };

  const getSidebarMenuItems = (): any[] => [
    { path: '/', title: 'Home' },
    { path: '/about', title: 'About' },
    { path: '/contact', title: 'Contact' },
    ...(isLoggedIn
      ? [{ path: '/cart', title: 'Cart' }, { path: '#', title: 'Log Out', onPress: handleLogout }]
      : [
        { path: '/auth/login', title: 'Login' },
        { path: '/auth/signup', title: 'Register' },
      ]),
  ];
  const renderCategoryItem = ({ item }: { item: CategoryProps }) => (
    <Link href={`/category/${item.id}`} asChild>
      <TouchableOpacity>
        <Stack
          bg={theme.accentColor}
          padding="$1"
          marginHorizontal="$2"
          borderRadius="$8"
          alignItems="center"
          justifyContent="center"
          width={120}
          height={58}
          shadowColor={theme.shadowColor}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.15}
          shadowRadius={10}
          pressStyle={{
            scale: 0.95,
            backgroundColor: theme.color3
          }}
          animation="quick"
        >
          <Text
            fontSize="$4"
            fontWeight="700"
            color='whitesmoke'
            textAlign="center"
            numberOfLines={2}
            letterSpacing={-0.5}
          >
            {item.title}
          </Text>
        </Stack>
      </TouchableOpacity>
    </Link>
  );

  const CardItem = ({ id, title, price, image }: CardItemProps) => (
    <Link href={`/item/${id}`} asChild>
      <Card
        elevate
        size="$4"
        scale={0.9}
        width={197}
        height={350}
        padding="2"
        marginLeft="$4"
        marginRight="$4"
        marginTop="$4"
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        animation="bouncy"
        backgroundColor="$background"
        borderRadius="$4"
      >
        <Card.Header padded>
          <Image 
            source={require('assets/item-burger.png')} 
            style={{ 
              width: '100%', 
              height: 180, 
              borderRadius: 12,
            }} 
            resizeMode="cover"
          />
        </Card.Header>
        <Card.Footer padded>
          <YStack space="$2">
            <Text fontSize="$6" color="$color" numberOfLines={3} fontWeight={"bold"}>
              {title}
            </Text>
            <XStack justifyContent="space-between" alignItems="center" >
              <Text fontSize="$6" fontWeight="bold" color="green" >
                ${price}
              </Text>
             
            </XStack>
            <Card
                bg={theme.accentColor}
                borderRadius="$10"
                alignItems='center'
                width={120}
                paddingHorizontal="$3"
                paddingVertical="$1.5"
                marginVertical="$2"
                marginLeft='$4'
              >
                <Text color="white"  fontSize="$6" fontWeight={"bold"} >
                  Order Now
                </Text>
              </Card>
          </YStack>
        </Card.Footer>
      </Card>
    </Link>
  );
    
  const renderFoodItem = ({ item, index }: { item: CardItemProps; index: number }) => (
    <XStack key={item.id} justifyContent="center" space="$4" marginBottom="$4" marginHorizontal="$1">
      <CardItem id={item.id} title={item.title} price={item.price} image={item.image} />
    </XStack>
  );

  const handleItemPress = (itemId: any) => {
    router.push(`/item/${itemId}`);
  };

  const fetchCategories = async () => {
    setCategoryLoading(true);
    try {
      const fetchedCategories = await fetchMenuCategories();
      const formattedCategories = fetchedCategories.map(category => ({
        id: category.category_id.toString(),
        title: category.name
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    finally {
      setCategoryLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <ScrollView backgroundColor={theme.background}>
      <View 
        paddingTop={50} 
        paddingBottom={15} 
        paddingHorizontal={15} 
        backgroundColor={theme.accentColor}
        shadowColor={theme.shadowColor}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <View flex={1} flexDirection='row' justifyContent='space-between' marginBottom={12}>
          <View flex={1} flexDirection='row' columnGap={12} alignItems='center'>
            <TouchableOpacity onPress={toggleSidebar}>
              <AntDesign name="menuunfold" color={theme.color} size={24} />
            </TouchableOpacity>
            <Text fontWeight="900" fontSize={18} color={theme.color}>Burger Lab Clone</Text>
          </View>
          <View>
            {isLoggedIn && (
              <Link href="/cart" asChild>
                <TouchableOpacity>
                  <FontAwesome6 name="cart-shopping" size={24} color={theme.color} />
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>
        <Input
          placeholder='Search your favorite food'
          size="$4"
          value={searchQuery}
          onChangeText={handleSearch}
          color={theme.color}
          borderColor={theme.borderColor}
          borderRadius="$6"
          paddingLeft="$4"
          paddingRight="$4"
        />
      </View>
      {isSearching ? (
        <YStack padding="$4" space="$4">
          {noResultsFound ? (
            <Text color={theme.color} textAlign="center" fontSize="$6">No results found</Text>
          ) : (
            <ScrollView>
              {/* Categories */}
              {searchResults.menuCategories.length > 0 && (
                <YStack space="$4">
                  <Text fontSize="$6" fontWeight="bold" color={theme.color}>
                    Categories
                  </Text>
                  {searchResults.menuCategories.map((category) => (
                    <TouchableOpacity key={category.category_id} onPress={() => router.replace(`/category/${category.category_id}`)}>
                      <Card key={category.category_id} padding="$4" marginBottom="$2">
                        <Text fontSize="$5" fontWeight="600" color={theme.color}>
                          {category.name}
                        </Text>
                        <Text fontSize="$4" color={theme.color} marginTop="$2">
                          {category.description}
                        </Text>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </YStack>
              )}

              {/* Menu Items */}
              {searchResults.menuItems.length > 0 && (
                <YStack space="$4" marginTop="$6">
                  <Text fontSize="$6" fontWeight="bold" color={theme.color}>
                    Menu Items
                  </Text>
                  {searchResults.menuItems.map((item) => {
                    return (
                      <TouchableOpacity key={item.item_id} onPress={() => handleItemPress(item.item_id)}>
                        <Card key={item.item_id} padding="$4" marginBottom="$2">
                          <XStack space="$4" alignItems="center">
                            {/* Image on the left */}
                            <Image source={require('assets/item-burger.png')} style={{ height: 100, width: 100, marginVertical: 12, borderRadius: 8, marginHorizontal: 'auto' }} />
                            {/* Item Details */}
                            <YStack flex={1} space="$2">
                              <Text fontSize="$5" fontWeight="bold" color={theme.color}>
                                {item.name}
                              </Text>
                              <Text fontSize="$4" color={theme.color} numberOfLines={2}>
                                {item.description}
                              </Text>
                              <Text fontSize="$4" fontWeight="600" color={theme.accentColor}>
                                ${item.price.toFixed(2)}
                              </Text>
                            </YStack>
                          </XStack>
                        </Card>
                      </TouchableOpacity>
                    )
                  })}
                </YStack>
              )}
            </ScrollView>
          )}
        </YStack>
      ) : (
        <>
          <Image source={require('assets/hot.jpg')} style={{ height: 176, marginVertical: 12, borderRadius: 8, marginHorizontal: 'auto', width: '98%', objectFit: 'fill' }} />
          <View>
            {categoryLoading && <Spinner size="large"/>}
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />
          </View>
          <View marginTop={10}>
            <LinearGradient
              colors={[theme.accentColor.val, theme.accentColor.val]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 12,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <H4 color='whitesmoke' textAlign='center' size="$8" >
                <FontAwesome6 name="fire" size={24} color='whitesmoke' /> Hot Sales
              </H4>
            </LinearGradient>
            {hotSalesLoading && <Spinner size="large"/>}
            <FlatList
              data={hotSales}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View marginTop={10}>
            <LinearGradient
              colors={[theme.accentColor.val, theme.accentColor.val]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 12,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <H4 color='whitesmoke' textAlign='center' size="$8" >
                <FontAwesome6 name="star" size={24} color='whitesmoke' /> New Arrivals
              </H4>
            </LinearGradient>
            {newLoading && <Spinner size="large"/>}
            <FlatList
              data={newProducts}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </>
      )}
      <Animated.View
        style={{
          position: 'absolute',
          width: screenWidth * 0.8,
          height: '100%',
          transform: [{ translateX: slideAnim }],
          backgroundColor: theme.accentBackground.val,
          zIndex: 2,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
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
                  data={getSidebarMenuItems()}
                  keyExtractor={(item: sidebarMenuItemsProps) => item.title}
                  renderItem={({ item }) => (
                    item.onPress ? (
                      <View padding="$4" marginVertical="$2" backgroundColor={theme.color2}>
                        <Text color={theme.color} onPress={item.onPress}>{item.title}</Text>
                      </View>
                    ) : (
                      <Link href={item.path} asChild onPress={toggleSidebar}>
                        <View padding="$4" marginVertical="$2" backgroundColor={isActive(item.path as string) ? theme.color3 : theme.color2}>
                          <Text color={isActive(item.path as string) ? theme.accentColor : theme.color}>{item.title}</Text>
                        </View>
                      </Link>
                    )
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

