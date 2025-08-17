import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import Layout from "./app/_layout";
import {useFonts} from "expo-font";
import AuthProvider from "./context/AuthContext";
import React, {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MusicPlayerProvider} from "./context/MusicPlayerContext";
import {NotificationsProvider} from "./app/toast-config/toast";
import {GestureHandlerRootView} from "react-native-gesture-handler";
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});


export default function App() {

    const [loaded, error] = useFonts({
        'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'PlusJakartaSans-BoldItalic': require('./assets/fonts/PlusJakartaSans-BoldItalic.ttf'),
        'PlusJakartaSans-Medium': require('./assets/fonts/PlusJakartaSans-Medium.ttf'),
        'PlusJakartaSans-SemiBold': require('./assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'PlusJakartaSans-Light': require('./assets/fonts/PlusJakartaSans-Light.ttf'),
        'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
        'Barlow-ExtraBoldItalic': require('./assets/fonts/Barlow-ExtraBoldItalic.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {

            SplashScreen.hideAsync().then();
        }
    }, [loaded, error]);

    if (!loaded) {
        return null
    }
    const queryClient = new QueryClient()
    return (
        <GestureHandlerRootView>

        <QueryClientProvider client={queryClient}>
            <NotificationsProvider/>
            <AuthProvider>
                <View style={styles.container}>

                  <MusicPlayerProvider>
                      <Layout/>
                      <StatusBar translucent={true} style={"light"}/>

                  </MusicPlayerProvider>

                </View>
            </AuthProvider>
        </QueryClientProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
