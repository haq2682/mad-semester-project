import { ScrollView, View, Text, Input, useTheme, Button } from "tamagui";

export default function Login() {
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
                        <Input placeholder="Enter Username" backgroundColor={theme.color1} marginVertical={5} />
                        <Input placeholder="Enter Password" backgroundColor={theme.color1} marginVertical={5} />
                    </View>
                    <View marginTop={20} width={'95%'}>
                        <Button backgroundColor={theme.accentBackground} color={theme.color}>Submit</Button>
                        <Button backgroundColor={theme.background} color={theme.accentColor} marginTop={10} borderColor={theme.accentColor}>Register With Google</Button>
                        <Button backgroundColor={theme.background} marginTop={10} color={theme.accentColor} borderColor={theme.accentColor}>Register With Facebook</Button>
                    </View>
                </View >
            </ScrollView >
        </>
    )
}