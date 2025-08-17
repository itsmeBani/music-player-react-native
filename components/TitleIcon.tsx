
import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface HeaderWithIconProps {
    icon: React.ComponentType<{ color?: string; size?: number }>;
    name: string;
    iconColor?: string;
    iconBackground?: string;
}

const TitleIcon: React.FC<HeaderWithIconProps> = ({
                                                           icon: Icon,
                                                           name,
                                                           iconColor = "#85e0ba",
                                                           iconBackground = "#00311D",
                                                       }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.iconWrapper, { backgroundColor: iconBackground }]}>
                <Icon color={iconColor} />
            </View>
            <Text style={styles.title}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        gap: 10,
        paddingHorizontal: 10,
    } as ViewStyle,
    iconWrapper: {
        padding: 8,
        borderRadius: 10,
    } as ViewStyle,
    title: {
        color: "white",
        fontSize: 16,
        fontFamily: "PlusJakartaSans-Bold",
    } as TextStyle,
});

export default TitleIcon;
