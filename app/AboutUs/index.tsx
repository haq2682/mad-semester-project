import React from 'react';
import { Image } from 'react-native';
import { ScrollView, View, Text, YStack, useTheme } from "tamagui";

export default function AboutUsScreen() {
  const theme = useTheme();

  return (
    <ScrollView backgroundColor={theme.background}>
      <YStack paddingTop={40} paddingHorizontal={20} space={20} alignItems="center">
        <YStack alignItems="center" space={10}>
          <Image
            source={{ uri: 'https://console.indolj.io/upload/1715331669-1715322106.jpg' }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
          <Text color={theme.color} fontWeight="900" fontSize={40}>About Us</Text>
        </YStack>

        <YStack space={20} width="100%">
          <View>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18} marginBottom={10}>Our Story</Text>
            <Text color={theme.color} fontSize={16}>
              Welcome to our restaurant! Founded in 2021, we are committed to bringing fresh,
              high-quality dishes inspired by classic and contemporary cuisines. Our goal is to create
              an unforgettable dining experience for our guests.
            </Text>
          </View>

          <View>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18} marginBottom={10}>Our Mission</Text>
            <Text color={theme.color} fontSize={16}>
              We aim to serve delicious meals made with locally-sourced ingredients, crafted with care
              by our passionate chefs. Our mission is to make every meal a memorable experience.
            </Text>
          </View>

          <View>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18} marginBottom={10}>Our Team</Text>
            <Text color={theme.color} fontSize={16}>
              Our team is made up of talented chefs, friendly staff, and dedicated food lovers who share
              a passion for great cuisine and exceptional service. Together, we work to create a warm
              and welcoming atmosphere.
            </Text>
          </View>

          <YStack alignItems="center" space={10} marginTop={20}>
            <Text color={theme.accentBackground} fontWeight="700" fontSize={24}>Come Dine with Us!</Text>
            <Text color={theme.color} fontSize={16} textAlign="center" marginBottom={10}>
              Whether you're here for a quick lunch or a relaxed dinner, we're excited to serve you!
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}