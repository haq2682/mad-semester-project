import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, Text, YStack, XStack, useTheme, Card, ScrollView, Spinner } from 'tamagui';
import { FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

interface MenuItem {
    item_id: number;
    name: string;
    description: string | null;
    price: number;
    category_id: number | null;
    image: string;
    is_available: boolean;
}

export default function CategoryPage() {
    const { id } = useLocalSearchParams<{ id: number }>();
    const theme = useTheme();
    const router = useRouter();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categoryDetails, setCategoryDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchCategoryItems();
        }
    }, [id]);

    const fetchCategoryItems = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // First, fetch the category details
            const { data: categoryData, error: categoryError } = await supabase
                .from('menucategories')
                .select('*')
                .eq('category_id', id)
                .single();

            if (categoryError) {
                console.error('Error fetching category:', categoryError);
                setError('Failed to fetch category details');
                setIsLoading(false);
                return;
            }
            setCategoryDetails(categoryData);

            // Then, fetch items for this category
            const { data: itemsData, error: itemsError } = await supabase
                .from('menuitems')
                .select('*')
                .eq('category_id', categoryData.category_id)
                .eq('is_available', true);

            if (itemsError) {
                console.error('Error fetching items:', itemsError);
                setError('Failed to fetch category items');
                setIsLoading(false);
                return;
            }

            setItems(itemsData);
        } catch (error) {
            console.error('Error in fetchCategoryItems:', error);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleItemPress = (itemId: any) => {
        router.push(`/item/${itemId}`);
    };

    const renderMenuItem = ({ item }: { item: MenuItem }) => (
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
    );

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <YStack space="$4" padding="$4">
            {[1, 2, 3, 4].map((_, index) => (
                <Card
                    key={index}
                    elevation={2}
                    margin="$3"
                    padding="$3"
                >
                    <XStack space="$4" alignItems="center">
                        <View
                            width={100}
                            height={100}
                            backgroundColor="$gray4"
                            borderRadius={8}
                        />
                        <YStack flex={1} space="$2">
                            <View
                                height={20}
                                width="80%"
                                backgroundColor="$gray4"
                            />
                            <View
                                height={15}
                                width="60%"
                                backgroundColor="$gray4"
                            />
                            <View
                                height={15}
                                width="40%"
                                backgroundColor="$gray4"
                            />
                        </YStack>
                    </XStack>
                </Card>
            ))}
        </YStack>
    );

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: categoryDetails?.name || 'Category',
                headerStyle: {
                    backgroundColor: theme.color8.val
                },
                headerTintColor: theme.color.val
            }} />
            <ScrollView flex={1} backgroundColor={theme.background}>
                {isLoading ? (
                    <SkeletonLoader />
                ) : error ? (
                    <View
                        flex={1}
                        justifyContent="center"
                        alignItems="center"
                        padding="$4"
                    >
                        <Text
                            color={theme.color}
                            fontSize="$6"
                            textAlign="center"
                        >
                            {error}
                        </Text>
                        <TouchableOpacity
                            onPress={fetchCategoryItems}
                            style={{
                                marginTop: 20,
                                padding: 10,
                                backgroundColor: theme.color8.val,
                                borderRadius: 8
                            }}
                        >
                            <Text color={theme.color}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : items.length === 0 ? (
                    <View
                        padding="$4"
                        alignItems="center"
                    >
                        <Text color={theme.color}>No items found in this category</Text>
                    </View>
                ) : (
                    <FlatList
                        data={items}
                        renderItem={renderMenuItem}
                        keyExtractor={(item) => item.item_id.toString()}
                    />
                )}
            </ScrollView>
        </>
    );
}