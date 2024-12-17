import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, useTheme, Card, YStack, Button, Input, Spinner } from "tamagui";
import { router, Stack } from 'expo-router';
import { Image, FlatList, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { getCurrentUser } from '../../lib/supabase';
import { getCartItems, updateCartItemQuantity, removeItemFromCart, CartItemProps } from '../actions/cartActions';
import { placeOrder } from '../actions/orderActions';

interface ContactDetails {
    address: string;
    phoneNumber: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardHolderName?: string;
}

const CartItem = ({ 
    item_id, 
    name, 
    price, 
    image, 
    quantity, 
    updateQuantity,
    isUpdating 
}: CartItemProps & { 
    image?: string, 
    updateQuantity: (id: number, quantity: number) => void,
    isUpdating: boolean 
}) => {
    const theme = useTheme();
    return (
        <View
            flex={1}
            flexDirection="row"
            justifyContent="space-between"
            backgroundColor={theme.color2}
            marginVertical={5}
            padding="$3"
            borderRadius="$3"
        >
            <View flex={1} flexDirection="row">
                <Card elevation={2}>
                    <Image
                        source={require('assets/item-burger.png')}
                        style={{ height: 80, width: 80 }}
                    />
                </Card>
                <View marginLeft="$3">
                    <Text fontSize={16} fontWeight="700" color={theme.color}>
                        {name}
                    </Text>
                    <Text color={theme.accentColor}>${price.toFixed(2)}</Text>
                </View>
            </View>
            <View flexDirection="column" justifyContent="space-between" alignItems="flex-end">
                <Text color={theme.color}>${(price * quantity).toFixed(2)}</Text>
                <View
                    backgroundColor={theme.accentBackground}
                    flexDirection="row"
                    padding="$2"
                    borderRadius="$3"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {isUpdating ? (
                        <Spinner size="small" color={theme.color} />
                    ) : (
                        <>
                            <Button
                                backgroundColor={theme.color10}
                                borderRadius={50}
                                padding={0}
                                height={30}
                                width={30}
                                alignItems="center"
                                justifyContent="center"
                                onPress={() => updateQuantity(item_id, Math.max(0, quantity - 1))}
                            >
                                <AntDesign name="minus" size={15} style={{ color: theme.color7.val }} />
                            </Button>
                            <Text color={theme.color} marginHorizontal={3} fontSize={15}>
                                {quantity}
                            </Text>
                            <Button
                                backgroundColor={theme.color10}
                                borderRadius={50}
                                padding={0}
                                height={30}
                                width={30}
                                alignItems="center"
                                justifyContent="center"
                                onPress={() => updateQuantity(item_id, quantity + 1)}
                            >
                                <AntDesign name="plus" size={15} style={{ color: theme.color7.val }} />
                            </Button>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

export default function Cart() {
    const theme = useTheme();
    const [items, setItems] = useState<CartItemProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | ''>('');
    const [contactDetails, setContactDetails] = useState<ContactDetails>({
        address: '',
        phoneNumber: ''
    });
    const [itemLoadingStates, setItemLoadingStates] = useState<{[key: number]: boolean}>({});
    const [cartItemsLoading, setCartItemsLoading] = useState(false);

    // Calculation constants
    const deliveryFee = 2.00;
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const grandTotal = subTotal + deliveryFee;

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = async () => {
        try {
            setCartItemsLoading(true);
            const user = await getCurrentUser();
            if (user) {
                const cartItems = await getCartItems(user.id);
                setItems(cartItems);
                // Reset loading states for items
                const initialLoadingStates = cartItems.reduce((acc, item) => {
                    acc[item.item_id] = false;
                    return acc;
                }, {} as {[key: number]: boolean});
                setItemLoadingStates(initialLoadingStates);
            }
        } catch (error) {
            console.error('Error loading cart items:', error);
            Alert.alert('Error', 'Failed to load cart items');
        } finally {
            setCartItemsLoading(false);
        }
    };

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        try {
            // Set loading state for specific item
            setItemLoadingStates(prev => ({...prev, [itemId]: true}));
            
            const user = await getCurrentUser();
            if (user) {
                if (newQuantity === 0) {
                    await removeItemFromCart(user.id, itemId);
                } else {
                    await updateCartItemQuantity(user.id, itemId, newQuantity);
                }
                await loadCartItems();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            Alert.alert('Error', 'Failed to update item quantity');
        } finally {
            // Reset loading state for specific item
            setItemLoadingStates(prev => ({...prev, [itemId]: false}));
        }
    };
    const validateInputs = (): boolean => {
        // Address validation
        if (!contactDetails.address || contactDetails.address.trim().length < 5) {
            Alert.alert('Invalid Address', 'Please enter a valid address');
            return false;
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contactDetails.phoneNumber)) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
            return false;
        }

        // Payment method validation
        if (!paymentMethod) {
            Alert.alert('Payment Method', 'Please select a payment method');
            return false;
        }

        // Card validation if card payment selected
        if (paymentMethod === 'Card') {
            const { cardNumber, expiryDate, cvv, cardHolderName } = contactDetails;

            // Card number validation
            if (!cardNumber || !/^[0-9]{16}$/.test(cardNumber)) {
                Alert.alert('Invalid Card Number', 'Please enter a valid 16-digit card number');
                return false;
            }

            // Expiry date validation
            if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
                Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MM/YY)');
                return false;
            }

            // CVV validation
            if (!cvv || !/^[0-9]{3}$/.test(cvv)) {
                Alert.alert('Invalid CVV', 'Please enter a valid 3-digit CVV');
                return false;
            }

            // Card holder name validation
            if (!cardHolderName || cardHolderName.trim().length < 3) {
                Alert.alert('Invalid Card Holder Name', 'Please enter a valid card holder name');
                return false;
            }
        }
        return true;
    };

    const handleConfirmPayment = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        try {
            const result = await placeOrder(
                {
                    total_price: grandTotal,
                    address: contactDetails.address,
                    phone_number: contactDetails.phoneNumber
                },
                items,
                paymentMethod
            );

            if (result.order) {
                router.replace({
                    pathname: '/confirm',
                    params: { orderNumber: result.order.order_number }
                });
            } else if (result.error) {
                Alert.alert('Order Failed', result.error.message);
            }
        } catch (error) {
            console.error('Order placement error:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: CartItemProps }) => (
        <CartItem 
            key={item.item_id} 
            {...item} 
            updateQuantity={updateQuantity} 
            isUpdating={itemLoadingStates[item.item_id] || false}
        />
    );

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: "Cart",
                headerStyle: {
                    backgroundColor: theme.color8.val
                }
            }} />
            <ScrollView backgroundColor={theme.background} contentContainerStyle={{ flexGrow: 1 }}>
                {/* Cart Items */}
                <View marginVertical={10}>
                    {cartItemsLoading ? (
                        <View alignItems="center" justifyContent="center" padding={20}>
                            <Spinner size="large" color={theme.accentBackground} />
                        </View>
                    ) : (
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.item_id.toString()}
                            ListEmptyComponent={
                                <View alignItems="center" justifyContent="center" padding={20}>
                                    <Text color={theme.color}>Your cart is empty</Text>
                                </View>
                            }
                        />
                    )}
                </View>

                {/* Order Summary */}
                <View backgroundColor={theme.color10} paddingHorizontal={10} borderRadius="$3" display={items.length === 0 ? 'none' : 'block'}>
                    <View marginVertical={5} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={16} fontWeight="900" color={'black'}>
                            Subtotal
                        </Text>
                        <Text fontSize={16} fontWeight="900" color={'black'}>
                            ${subTotal.toFixed(2)}
                        </Text>
                    </View>
                    <View marginVertical={5} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={14} fontWeight="800" color={'black'}>
                            Delivery Fee
                        </Text>
                        <Text fontSize={14} fontWeight="800" color={'black'}>
                            ${deliveryFee.toFixed(2)}
                        </Text>
                    </View>
                    <View marginVertical={5} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={18} fontWeight="900" color={'black'}>
                            Grand Total
                        </Text>
                        <Text fontSize={18} fontWeight="900" color={'black'}>
                            ${grandTotal.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Contact and Payment Details */}
                <YStack padding={20} space={20} display={items.length === 0 ? 'none' : 'block'}>
                    {/* Delivery Details Inputs */}
                    <YStack space={15}>
                        <Input
                            placeholder="Delivery Address"
                            value={contactDetails.address}
                            onChangeText={(text) => setContactDetails(prev => ({ ...prev, address: text }))}
                            backgroundColor={theme.color1}
                        />
                        <Input
                            placeholder="Phone Number"
                            keyboardType="numeric"
                            maxLength={10}
                            value={contactDetails.phoneNumber}
                            onChangeText={(text) => setContactDetails(prev => ({ ...prev, phoneNumber: text }))}
                            backgroundColor={theme.color1}
                        />
                    </YStack>

                    {/* Payment Method Selection */}
                    <Text fontWeight="900" fontSize={20} textAlign="center" color={theme.color}>
                        Select Payment Method
                    </Text>
                    <YStack space={15}>
                        <Button
                            onPress={() => setPaymentMethod('COD')}
                            backgroundColor={paymentMethod === 'COD' ? theme.accentBackground : theme.color10}
                            borderRadius={30}
                            paddingVertical={15}
                            height={52}
                        >
                            <Text fontWeight="600" fontSize={16} color={'black'}>
                                Cash on Delivery
                            </Text>
                        </Button>
                        <Button
                            onPress={() => setPaymentMethod('Card')}
                            backgroundColor={paymentMethod === 'Card' ? theme.accentBackground : theme.color10}
                            borderRadius={30}
                            paddingVertical={15}
                            height={52}
                        >
                            <Text fontWeight="600" fontSize={16} color={'black'}>
                                Credit/Debit Card
                            </Text>
                        </Button>
                    </YStack>

                    {/* Card Details */}
                    {paymentMethod === 'Card' && (
                        <YStack space={15} backgroundColor={theme.color2} padding={15} borderRadius="$3">
                            <Input
                                placeholder="Card Number"
                                keyboardType="numeric"
                                maxLength={16}
                                value={contactDetails.cardNumber}
                                onChangeText={(text) => setContactDetails(prev => ({ ...prev, cardNumber: text }))}
                                backgroundColor={theme.color1}
                            />
                            <Input
                                placeholder="Expiry Date (MM/YY)"
                                maxLength={5}
                                value={contactDetails.expiryDate}
                                onChangeText={(text) => setContactDetails(prev => ({ ...prev, expiryDate: text }))}
                                backgroundColor={theme.color1}
                            />
                            <Input
                                placeholder="CVV"
                                keyboardType="numeric"
                                maxLength={3}
                                value={contactDetails.cvv}
                                onChangeText={(text) => setContactDetails(prev => ({ ...prev, cvv: text }))}
                                backgroundColor={theme.color1}
                            />
                            <Input
                                placeholder="Card Holder Name"
                                value={contactDetails.cardHolderName}
                                onChangeText={(text) => setContactDetails(prev => ({ ...prev, cardHolderName: text }))}
                                backgroundColor={theme.color1}
                            />
                        </YStack>
                    )}

                    {/* Confirm Button */}
                    <Button
                        onPress={handleConfirmPayment}
                        backgroundColor={theme.accentBackground}
                        borderRadius={30}
                        paddingHorizontal={15}
                        height={52}
                        disabled={loading || items.length === 0}
                    >
                        {loading ? (
                            <Spinner size="small" color="black" />
                        ) : (
                            <Text fontWeight="600" fontSize={16} color={'black'}>
                                Confirm Payment
                            </Text>
                        )}
                    </Button>
                </YStack>
            </ScrollView>
        </>
    );
}