import { Input, Text, useTheme, View, ScrollView, Button, YStack } from "tamagui";

export default function Signup() {
    const theme = useTheme();
    return (
        <>
            <ScrollView backgroundColor={theme.background}>
                <View paddingTop={40} height={'100%'} flex={1} flexDirection="column" alignItems="center">
                    <View marginTop={60}>
                        <Text color={theme.color} textAlign="center" fontWeight={'900'} fontSize={40}>Burger Lab Clone</Text>
                        <Text color={theme.color} marginTop={40} fontWeight={'700'} fontSize={20} textAlign="center">Food Clone App by the Students of the great Rana M. Ajmal</Text>
                    </View>
                    <View marginTop={40} backgroundColor={theme.background} padding={10} width={'95%'} borderRadius={10} style={{ shadowOpacity: 10, shadowColor: 'black' }}>
                        <Input placeholder="Enter Full Name" backgroundColor={theme.color1} marginVertical={5} />
                        <Input placeholder="Enter Username" backgroundColor={theme.color1} marginVertical={5} />
                        <Input placeholder="Enter Email" backgroundColor={theme.color1} marginVertical={5} />
                        <Input placeholder="Enter Password" backgroundColor={theme.color1} marginVertical={5} />
                        <Input placeholder="Confirm Password" backgroundColor={theme.color1} marginVertical={5} />
                    </View>
                    <View marginTop={20} width={'95%'}>
                        <Button backgroundColor={theme.accentBackground} color={theme.color}>Submit</Button>
                    </View>
                </View >
            </ScrollView >
        </>
    )
}