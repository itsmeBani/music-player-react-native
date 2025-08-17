import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

function TopAlbums() {

    return (
        <View style={{ gap: 10, padding: 20 }}>
            <Text style={style.title}>Top Albums</Text>




        </View>
    );
}

export default TopAlbums;

const style = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 20,
        paddingHorizontal: 10,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    button: {
        backgroundColor: '#1DB954',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
