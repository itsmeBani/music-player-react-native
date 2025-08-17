import React from 'react';
import {View} from "react-native";
import LottieView from "lottie-react-native";

function AnimatedLoadingScreen() {
    return (
        <View style={{flex:1,backgroundColor:"#191919",alignItems:"center",justifyContent:"center"}}>


            <View style={{height:110,width:110}}>
                <LottieView speed={0.3} style={{height:110,width:110}} source={require('../assets/Recording.json')} autoPlay loop />
            </View>

        </View>
    );
}

export default AnimatedLoadingScreen;