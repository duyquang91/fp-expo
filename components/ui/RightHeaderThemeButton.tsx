import React, { FC } from "react";
import { ThemedText } from "../ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Appearance, TouchableNativeFeedback } from "react-native";

export default function RightHeaderThemeButton() {
    return (
        <TouchableNativeFeedback onPress={_ => Appearance.setColorScheme(Appearance.getColorScheme() === 'light' ? 'dark' : 'light')}>
            <ThemedText><MaterialIcons name={Appearance.getColorScheme() === 'light' ? "light-mode" : "dark-mode"} /></ThemedText>
        </TouchableNativeFeedback>
    )
}