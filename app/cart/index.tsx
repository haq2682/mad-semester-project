import { ScrollView, View, Text, useTheme, Card, YStack, Button, Input } from "tamagui";
import { router, Stack } from 'expo-router';
import { Image } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from "react";

interface CartItemProps {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

const cartItems: CartItemProps[] = [
    { id: 1, title: 'Chili Tomatina', price: 9.99, image: 'https://picsum.photos/200', quantity: 1 },
    { id: 2, title: 'Zinger Burger', price: 5.99, image: 'https://picsum.photos/200', quantity: 3 },
    { id: 3, title: 'Chicken Burger', price: 2.99, image: 'https://picsum.photos/200', quantity: 2 },
    { id: 4, title: 'Anday Wala Burger', price: 1.99, image: 'https://picsum.photos/200', quantity: 1 },
    { id: 5, title: 'Patty Burger', price: 2.99, image: 'https://picsum.photos/200', quantity: 2 },
    { id: 6, title: 'Dragon Sauce Burger', price: 2.99, image: 'https://picsum.photos/200', quantity: 1 },
];

const CartItem = ({ id, title, price, image, quantity, updateQuantity }: CartItemProps & { updateQuantity: (id: number, quantity: number) => void }) => {
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
                    <Image source={{ uri: image }} style={{ height: 80, width: 80 }} />
                </Card>
                <View marginLeft="$3">
                    <Text fontSize={16} fontWeight="700" color={theme.color}>
                        {title}
                    </Text>
                </View>
            </View>
            <View flexDirection="column" justifyContent="space-between" alignItems="flex-end">
                <Text color={theme.color}>${price.toFixed(2)}</Text>
                <View
                    backgroundColor={theme.accentBackground}
                    flexDirection="row"
                    padding="$2"
                    borderRadius="$3"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button
                        backgroundColor={theme.color10}
                        borderRadius={50}
                        padding={0}
                        height={30}
                        width={30}
                        alignItems="center"
                        justifyContent="center"
                        onPress={() => updateQuantity(id, quantity - 1)}
                    >
                        <AntDesign name="minus" size={15} style={{ color: theme.accentColor.val }} />
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
                        onPress={() => updateQuantity(id, quantity + 1)}
                    >
                        <AntDesign name="plus" size={15} style={{ color: theme.accentColor.val }} />
                    </Button>
                </View>
            </View>
        </View>
    );
};

export default function Cart() {
    const theme = useTheme();
    const [items, setItems] = useState<CartItemProps[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const deliveryFee = 2.00;
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

    const updateQuantity = (itemId: number, newQuantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(0, newQuantity) } : item
            )
        );
    };

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
                    {items.map((item) => (
                        <CartItem key={item.id} {...item} updateQuantity={updateQuantity} />
                    ))}
                </View>
                <View backgroundColor={theme.color10} paddingHorizontal={10} borderRadius="$3">
                    <View marginVertical={5} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={16} fontWeight="900" color={theme.color}>
                            Subtotal
                        </Text>
                        <Text fontSize={16} fontWeight="900" color={theme.color}>
                            ${subTotal.toFixed(2)}
                        </Text>
                    </View>
                    <View marginVertical={5} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={14} fontWeight="800" color={theme.color}>
                            Delivery Fee
                        </Text>
                        <Text fontSize={14} fontWeight="800" color={theme.color}>
                            ${deliveryFee.toFixed(2)}
                        </Text>
                    </View>
                    <View marginVertical={5} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={18} fontWeight="900" color={theme.color}>
                            Grand Total
                        </Text>
                        <Text fontSize={18} fontWeight="900" color={theme.color}>
                            ${grandTotal.toFixed(2)}
                        </Text>
                    </View>
                </View>
                <YStack padding={20} space={20}>
                    <Text fontWeight="900" fontSize={20} textAlign="center" color={theme.color}>
                        Select Payment Method
                    </Text>
                    {/* Payment Buttons */}
                    <YStack space={15}>
                        <Button
                            onPress={() => setPaymentMethod('COD')}
                            backgroundColor={paymentMethod === 'COD' ? theme.accentBackground : theme.color10}
                            borderRadius={30}
                            paddingVertical={15}
                            height={52}
                        >
                            <Text fontWeight="600" fontSize={16} color={theme.color}>
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
                            <Text fontWeight="600" fontSize={16} color={theme.color}>
                                Credit/Debit Card
                            </Text>
                        </Button>
                    </YStack>
                    {/* Card Details */}
                    {paymentMethod === 'Card' && (
                        <YStack space={15} backgroundColor={theme.color2} padding={15} borderRadius="$3">
                            <Input placeholder="Card Number" keyboardType="numeric" maxLength={16} backgroundColor={theme.color1} />
                            <Input placeholder="Expiry Date (MM/YY)" maxLength={5} backgroundColor={theme.color1} />
                            <Input placeholder="CVV" keyboardType="numeric" maxLength={3} backgroundColor={theme.color1} />
                            <Input placeholder="Card Holder Name" backgroundColor={theme.color1} />
                        </YStack>
                    )}
                    {/* Confirm Button */}
                    <Button
                        onPress={handleConfirmPayment}
                        backgroundColor={theme.accentBackground}
                        borderRadius={30}
                        paddingHorizontal={15}
                        height={52}
                    >
                        <Text fontWeight="600" fontSize={16} color={theme.color}>
                            Confirm Payment
                        </Text>
                    </Button>
                </YStack>
            </ScrollView>
        </>
    );
}
