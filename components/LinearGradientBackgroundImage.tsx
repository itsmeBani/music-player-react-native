import {ImageBackground, Text, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import React, {ReactNode} from "react";
interface LinearGradientBackgroundImageI {
    children:ReactNode
    imageUrl:string
}
export default function LinearGradientBackgroundImage({children,imageUrl}:LinearGradientBackgroundImageI){
    return (
        <ImageBackground style={{height: 260}} src={imageUrl}>
            <LinearGradient
                start={{x: 0, y: 1}}
                end={{x: 0, y: 0}}
                colors={['rgba(0,0,0,0.43)', 'rgba(0,0,0,0.57)', 'rgba(0,0,0,0.69)']}
                style={{flex: 1, padding: 15, justifyContent: "flex-end"}}

            >
                {children}
            </LinearGradient>

        </ImageBackground>
    )
}