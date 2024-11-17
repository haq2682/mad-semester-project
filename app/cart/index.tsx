import { ScrollView, View, Text, useTheme, Card, YStack, Button, Input } from "tamagui";
import { router, Stack, useNavigation } from 'expo-router';
import { Image } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect, useState } from "react";

interface CartItemsProps {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

const cartItems: CartItemsProps[] = [
    { id: 1, title: 'Chili Tomatina', price: 9.99, image: 'https://picsum.photos', quantity: 1 },
    { id: 2, title: 'Zinger Burger', price: 5.99, image: 'https://picsum.photos', quantity: 3 },
    { id: 3, title: 'Chicken Burger', price: 2.99, image: 'https://picsum.photos', quantity: 2 },
    { id: 4, title: 'Anday Wala Burger', price: 1.99, image: 'https://picsum.photos', quantity: 1 },
    { id: 5, title: 'Patty Burger', price: 2.99, image: 'https://picsum.photos', quantity: 2 },
    { id: 6, title: 'Dragon Sauce Burger', price: 2.99, image: 'https://picsum.photos', quantity: 1 },
]

const CartItem = ({ id, title, price, image, quantity, updateQuantity }: { id: number, title: string, price: number, image: string, quantity: number, updateQuantity: (id: number, quantity: number) => null }) => {
    const theme = useTheme();
    return (
        <>
            <View flex={1} flexDirection="row" justifyContent="space-between" backgroundColor={theme.background075} marginVertical={2.5} padding="$3">
                <View flex={1} flexDirection="row">
                    <Card elevation={2}>
                        <Image source={require('assets/item-burger.png')} className="h-20 w-20" />
                    </Card>
                    <View marginTop="$2" marginLeft="$3">
                        <Text fontSize={16} fontWeight={700} color={theme.color}>{title}</Text>
                    </View>
                </View>
                <View flex={1} flexDirection="column" justifyContent="space-between" alignItems="flex-end">
                    <View>
                        <Text color={theme.color}>${price}</Text>
                    </View>
                    <View backgroundColor={theme.accentBackground} flex={1} flexDirection="row" flexGrow={0} marginBottom={10} paddingHorizontal="$2" paddingVertical="$2" borderRadius={10} justifyContent="space-between" alignItems="center">
                        <View backgroundColor={theme.background} borderRadius={100} padding="$1" aspectRatio={1} alignItems="center" justifyContent="center" onPress={() => updateQuantity(id, quantity - 1)}>
                            <AntDesign name="minus" size={15} style={{ color: theme.accentColor.val }} />
                        </View>
                        <View>
                            <Text color={"white"} marginHorizontal={3} fontSize={15}>{quantity}</Text>
                        </View>
                        <View backgroundColor={theme.background} borderRadius={100} padding="$1" aspectRatio={1} alignItems="center" justifyContent="center" onPress={() => updateQuantity(id, quantity + 1)}>
                            <AntDesign name="plus" size={15} style={{ color: theme.accentColor.val }} />
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

export default function Cart() {
    const theme = useTheme();
    const navigation = useNavigation();
    const [items, setItems] = useState<CartItemsProps[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    let deliveryFee: number = 2.00;
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
            router.replace('/confirm')
        } else if (paymentMethod === 'Card') {
            if (
                cardDetails.cardNumber &&
                cardDetails.expiryDate &&
                cardDetails.cvv &&
                cardDetails.cardHolderName
            ) {
                alert('Payment successful!');
                router.replace('/confirm')
            } else {
                alert('Please fill in all card details.');
            }
        } else {
            alert('Please select a payment method.');
        }
    };

    function updateQuantity(itemId: number, newQuantity: number): null {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
        return null;
    }

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
                    backgroundColor: theme.color8.val
                }
            }} />
            <ScrollView backgroundColor={theme.background} contentContainerStyle={{ flexGrow: 1 }}>
                <View marginVertical={10}>
                    {
                        items.map((item) => {
                            return (
                                <CartItem key={item.id} {...item} updateQuantity={updateQuantity} />
                            )
                        })
                    }
                </View>
                <View backgroundColor={theme.color3} paddingHorizontal={10}>
                    <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={16} fontWeight={900} color={theme.color}>Subtotal</Text>
                        <Text fontSize={16} fontWeight={900} color={theme.color}>${subTotal}</Text>
                    </View>
                    <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={14} fontWeight={800} color={theme.color}>Delivery Fee</Text>
                        <Text fontSize={14} fontWeight={800} color={theme.color}>${deliveryFee}</Text>
                    </View>
                    <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={18} fontWeight={900} color={theme.color}>Grand Total</Text>
                        <Text fontSize={18} fontWeight={900} color={theme.color}>${grandTotal}</Text>
                    </View>
                </View>
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
            </ScrollView >
        </>
    )
}