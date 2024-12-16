import React, { useState } from 'react';
import { ScrollView, View, Text, Input, useTheme, Button, YStack, XStack } from "tamagui";
import { Stack, useRouter } from "expo-router";
import { supabase, logSupabaseError } from '../../lib/supabase';
import { Alert } from 'react-native';
import * as crypto from 'crypto-js';

export default function Login() {
    const theme = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) {
            return 'Password is required';
        }
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return '';
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        setErrors(prev => ({ ...prev, email: validateEmail(text) }));
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setErrors(prev => ({ ...prev, password: validatePassword(text) }));
    };

    async function handleLogin() {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setLoading(true);
        try {
            // Fetch user data from the database
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (userError) throw userError;

            if (userData) {
                // Hash the entered password
                const hashedPassword = crypto.SHA256(password).toString();

                // Compare the hashed password with the stored hash
                if (hashedPassword === userData.password_hash) {
                    // Passwords match, proceed with login
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password,
                    });

                    if (error) throw error;

                    if (data.user) {
                        Alert.alert("Success", "Logged in successfully!");
                        router.push('/');
                    } else {
                        throw new Error("User data not found");
                    }
                } else {
                    // Passwords don't match
                    throw new Error("Invalid email or password");
                }
            } else {
                throw new Error("User not found");
            }
        } catch (error: any) {
            logSupabaseError(error);
            Alert.alert("Error", error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                title: "Login",
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
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                borderColor={errors.email ? 'red' : theme.color1}
                            />
                            {errors.email ? <Text color="red" fontSize={12}>{errors.email}</Text> : null}
                        </XStack>
                        <XStack flexDirection="column">
                            <Input
                                placeholder="Enter Password"
                                backgroundColor={theme.color1}
                                marginVertical={5}
                                value={password}
                                onChangeText={handlePasswordChange}
                                secureTextEntry
                                borderColor={errors.password ? 'red' : theme.color1}
                            />
                            {errors.password ? <Text color="red" fontSize={12}>{errors.password}</Text> : null}
                        </XStack>
                    </View>
                    <YStack marginTop={20} width={'95%'} space={10}>
                        <Button
                            backgroundColor={theme.accentBackground}
                            color={theme.color}
                            onPress={handleLogin}
                            disabled={loading || !!errors.email || !!errors.password}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                        <Button backgroundColor={theme.background} color={theme.accentColor} borderColor={theme.accentColor}>
                            Register With Google
                        </Button>
                        <Button backgroundColor={theme.background} color={theme.accentColor} borderColor={theme.accentColor}>
                            Register With Facebook
                        </Button>
                    </YStack>
                </View>
            </ScrollView>
        </>
    )
}


