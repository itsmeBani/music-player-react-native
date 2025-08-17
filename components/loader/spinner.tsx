import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {Loader} from "lucide-react-native"; // Make sure you have this installed

interface LoaderProps {
    start: boolean;
    color?:string,
    size?:number
}

const Spinner: React.FC<LoaderProps> = ({ start,color="white",size=15 }) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (start) {
            rotation.value = withRepeat(
                withTiming(360, { duration: 1000 }),
                -1,
                false
            );
        } else {
            cancelAnimation(rotation);
            rotation.value = 0;
        }
    }, [start]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={[styles.loader, animatedStyle]}>
            <Loader size={size}  color={color}/>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    loader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Spinner;
