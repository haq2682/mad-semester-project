import { Stack, Link } from 'expo-router';
import { Button, Text, View } from 'tamagui';

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
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Text>Hello World</Text>
      </View>
    </>
  );
}
