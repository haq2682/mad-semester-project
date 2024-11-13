import { Input, Button, ScrollView, useTheme, View, Text } from 'tamagui'
import { Stack } from 'expo-router'

export default function Profile() {
    const theme = useTheme();
    return (
        <ScrollView backgroundColor={theme.background}>
            <Stack.Screen options={{
                headerShown: true,
                title: "Profile Settings",
                headerStyle: {
                    backgroundColor: theme.color8.val
                }
            }} />
            <View flex={1} justifyContent='center' alignItems='center'>
                <View backgroundColor={theme.background} padding={10} width={'95%'} borderRadius={10} style={{ shadowOpacity: 10, shadowColor: 'black' }}>
                    <Input value={'Sample Full Name'} placeholder="Enter Full Name" backgroundColor={theme.color1} marginVertical={5} />
                    <Input value={'SampleUserName'} placeholder="Enter Username" backgroundColor={theme.color1} marginVertical={5} />
                    <Input value={'SampleEmail@gmail.com'} placeholder="Enter Email" backgroundColor={theme.color1} marginVertical={5} />
                    <Input value={'Sample Address'} placeholder="Address" backgroundColor={theme.color1} marginVertical={5} />
                </View>
                <View marginTop={20} width={'95%'} space>
                    <Button backgroundColor={theme.accentBackground} color={theme.color}>Update</Button>
                    <Button backgroundColor={theme.color8} color={theme.color}>Log Out</Button>
                    <Button backgroundColor={'red'} color={'black'}>Delete Account</Button>
                </View>
            </View>
        </ScrollView>
    )
}