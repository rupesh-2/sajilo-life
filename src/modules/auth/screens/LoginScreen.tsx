import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { authService } from "../services/authService";
import { useAuthStore } from "../../../core/store/authStore";
import { useRouter } from "expo-router";

export const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Please fill all fields");
        try {
            const { user, token } = await authService.login(email, password);
            setUser(user, token);
            router.replace("/(main)/orders"); // navigate to app
        } catch (err: any) {
            Alert.alert("Login failed", err.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text>Email:</Text>
            <TextInput value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
            <Text>Password:</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 10 }}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Go to Signup" onPress={() => router.push("/(auth)/signup")} />
        </V