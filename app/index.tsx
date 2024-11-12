import { Stack, Link } from 'expo-router';
import { useState } from 'react';
import { Button, Theme, useTheme, View } from 'tamagui';
import { Text } from "react-native";
import config from '~/tamagui.config';

export default function Home() {
  const theme = useTheme();
  return (
    <>
      {/* <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/index.tsx" title="Home" />
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button title="Show Details" />
        </Link>
      </Container> */}
      <View backgroundColor={theme.background} flex={1} flexDirection='row' alignItems='center' justifyContent='center' height={'full'}>
        <View>
          <Text className="text-red-500 text-center dark:text-blue-300">Hello World</Text>
          <Link href="/auth/signup" className="text-center">
            Sign Up
          </Link>
          <Link href="/auth/login" className="text-center">
            Log In
          </Link>
          <Button backgroundColor={theme.accentBackground} color={theme.color}>Hello World Button</Button>
        </View>
      </View>
    </>
  );
}
