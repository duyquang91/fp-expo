import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React from "react";
import { TextInput, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
    const themeColor = useColorScheme()

    const processLink = (link: string) => {
        console.log("Processing link:", link);
        // Fetch the URL to get the redirect
        fetch(link, { method: 'HEAD', redirect: 'follow' }).then(response => {
            // Get the final URL after redirection
            const finalUrl = response.url;
            console.log("Redirected to:", finalUrl);

            // Extract orderId from the redirected URL
            const orderIdMatch = finalUrl.match(/orderId=([^&]*)/);
            const orderId = orderIdMatch ? orderIdMatch[1] : null;

            if (orderId) {
                console.log("Extracted orderId:", orderId);
                return orderId;
            } else {
                console.log("No orderId found in the URL");
                return null;
            }
        }).catch(error => {
            console.error("Error fetching URL:", error);
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', padding: 24 }}>
            <ThemedText>Enter order id:</ThemedText>
            <TextInput onSubmitEditing={e => {
                processLink(e.nativeEvent.text)
            }} 
            clearButtonMode="always" 
            style={{ color: themeColor === 'dark' ? '#fff' : '#000', borderWidth: 0.5, borderColor: 'gray', borderRadius: 4, padding: 8, marginTop:8 }} />
            <ThemedText darkColor={Colors.dark.tint} lightColor={Colors.light.tint} style={{paddingTop: 8}} onPress={_ => { router.push('/list') }}>Continue</ThemedText>
        </SafeAreaView>
    )
}