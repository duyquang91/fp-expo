import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import React from "react";
import { TextInput, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    const themeColor = useColorScheme()

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', paddingLeft: 16, paddingRight: 16 }}>
            <ThemedText>Enter order id:</ThemedText>
            <TextInput clearButtonMode="always" style={{ color: themeColor === 'dark' ? '#fff' : '#000', borderWidth: 0.5, borderColor: 'gray', borderRadius: 4, padding: 8, marginTop:8 }} />
            <ThemedText onPress={_ => { router.push('/list') }}>Go</ThemedText>
        </SafeAreaView>
    )
}