import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Input, Text, useTheme, View, ScrollView, Button, YStack, XStack } from "tamagui"
import { Stack, useRouter } from "expo-router"
import { supabase } from '~/lib/supabase'

export default function Signup() {
    const theme = useTheme()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })

    const validateForm = () => {
        let isValid = true
        const newErrors = { ...errors }

        if (!email) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid'
            isValid = false
        }

        if (!password) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            const {
                data: { session },
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
            })

            if (error) Alert.alert(error.message)
            if (!session && !error) {
                router.replace('/auth/login');
                Alert.alert('Please check your inbox for email verification!');
            }
            setLoading(false)
        }
    }

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: "Register",
                headerStyle: {
                    backgroundColor: theme.color8.val
                }
            }} />
            <ScrollView backgroundColor={theme.background}>
                <View paddingTop={40} height={'100%'} flex={1} flexDirection="column" alignItems="center">
                    <View marginTop={60}>
                        <Text color={theme.color} textAlign="center" fontWeight={'900'} fontSize={40}>Burger Lab Clone</Text>
                        <Text color={theme.color} marginTop={40} fontWeight={'700'} fontSize={20} textAlign="center">Food Clone App by the Students of the great Rana M. Ajmal</Text>
                    </View>
                    <View marginTop={40} backgroundColor={theme.background} padding={10} width={'95%'} borderRadius={10} style={{ shadowOpacity: 10, shadowColor: 'black' }}>
                        <XStack flexDirection="column">
                            <Input
                                placeholder="Enter Email"
                                backgroundColor={theme.color1}
                                marginVertical={5}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email ? <Text color="red" fontSize={12}>{errors.email}</Text> : null}
                        </XStack>
                        <XStack flexDirection="column">
                            <Input
                                placeholder="Enter Password"
                                backgroundColor={theme.color1}
                                marginVertical={5}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                            {errors.password ? <Text color="red" fontSize={12}>{errors.password}</Text> : null}
                        </XStack>
                        <XStack flexDirection="column">
                            <Input
                                placeholder="Confirm Password"
                                backgroundColor={theme.color1}
                                marginVertical={5}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                            {errors.confirmPassword ? <Text color="red" fontSize={12}>{errors.confirmPassword}</Text> : null}
                        </XStack>
                    </View>
                    <YStack marginTop={20} width={'95%'}>
                        <Button
                            backgroundColor={theme.accentBackground}
                            color={theme.color}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </YStack>
                </View>
            </ScrollView>
        </>
    )
}