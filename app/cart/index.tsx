import { ScrollView, View, Text } from "tamagui";
import { Stack } from 'expo-router';

export default function Cart() {
    return (
        <>
            <Stack.Screen options={{ headerShown: true, title: "Cart" }} />
            <ScrollView>
                <View>
                    <Text>Cart</Text>
                </View>
            </ScrollView>
        </>
    )
}