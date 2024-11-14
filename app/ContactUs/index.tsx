import React from 'react';
import { Linking } from 'react-native';
import { ScrollView, View, Text, Input, Button, YStack, XStack, useTheme ,Image } from "tamagui";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ContactUsScreen() {
  const theme = useTheme();

  const handleSend = () => {
    alert("Thank you! We'll get back to you soon.");
  };

  return (
    <ScrollView backgroundColor={theme.background}>
      <YStack alignItems="center" space={10}>
          <Image
            source={{ uri: 'https://console.indolj.io/upload/1715331669-1715322106.jpg' }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
          <Text color={theme.color} fontWeight="900" fontSize={40}>Contact Us</Text>
          <Text color={theme.color} fontSize={16} textAlign="center">
            Have questions? Reach out to us, and we'll be happy to help!
          </Text>
     

        <YStack space={20}>
          <YStack space={5}>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18}>Our Location</Text>
            <Text color={theme.color} fontSize={16}>
              123 Foodie Lane, BURGER LAB, FT 56789
            </Text>
          </YStack>

          <YStack space={5}>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18}>Phone</Text>
            <Text
              color={theme.color}
              fontSize={16}
              onPress={() => Linking.openURL('tel:+1234567890')}
            >
              +1 (234) 567-890
            </Text>
          </YStack>

          <YStack space={5}>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18}>Email</Text>
            <Text
              color={theme.color}
              fontSize={16}
              onPress={() => Linking.openURL('mailto:contact@restaurant.com')}
            >
              contact@restaurant.com
            </Text>
          </YStack>

          <YStack space={5}>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18}>Follow Us</Text>
            <XStack space={10}>
              <Icon name="logo-facebook" size={24} color="#3b5998" />
      
              <Icon name="logo-instagram" size={24} color="#e1306c" />
             
              <FontAwesome name="twitter" size={24} color="#55acee" />
            </XStack>
          </YStack>

          <YStack space={10}>
            <Text color={theme.accentBackground} fontWeight="600" fontSize={18}>Send Us a Message</Text>
            <Input placeholder="Your Name" backgroundColor={theme.color1} />
            <Input placeholder="Your Email" backgroundColor={theme.color1} />
            <Input
              placeholder="Your Message"
              backgroundColor={theme.color1}
              multiline
              numberOfLines={4}
              height={100}
            />
            <Button backgroundColor={theme.accentBackground} color={theme.color} onPress={handleSend} marginBottom={10}>
              Send Message
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}