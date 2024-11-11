import { Stack, Link } from 'expo-router';
import { Button, Theme } from 'tamagui';
import { View, Text } from "react-native";

export default function Home() {
  return (
    <>
      {/* <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home" />
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title="Show Details" />
        </Link>
      </Container> */}
      <View className="flex flex-row items-center justify-center h-full">
        <View>
          <Text className="text-red-500 text-center dark:text-red-300">Hello World</Text>
          <Link href="/about" className="text-center">
            About Page
          </Link>
          <Button>Hello World Button</Button>
        </View>
      </View>
    </>
  );
}
