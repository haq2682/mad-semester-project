import { ScrollView, View, Text, useTheme, Card } from "tamagui";
import { Stack } from 'expo-router';
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
                        <Text fontSize={16} fontWeight={700}>{title}</Text>
                    </View>
                </View>
                <View flex={1} flexDirection="column" justifyContent="space-between" alignItems="flex-end">
                    <View>
                        <Text>${price}</Text>
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
    const [items, setItems] = useState<CartItemsProps[]>([]);
    const [subTotal, setSubTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    let deliveryFee: number = 2.00;

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
            <ScrollView>
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
                        <Text fontSize={16} fontWeight={900}>Subtotal</Text>
                        <Text fontSize={16} fontWeight={900}>${subTotal}</Text>
                    </View>
                    <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={14} fontWeight={800}>Delivery Fee</Text>
                        <Text fontSize={14} fontWeight={800}>${deliveryFee}</Text>
                    </View>
                    <View marginVertical={2.5} flex={1} flexDirection="row" justifyContent="space-between">
                        <Text fontSize={18} fontWeight={900}>Grand Total</Text>
                        <Text fontSize={18} fontWeight={900}>${grandTotal}</Text>
                    </View>
                </View>
            </ScrollView >
        </>
    )
}