import {BottomTabBarButtonProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNotifications, SlideInLeftSlideOutRight, ZoomInDownZoomOutUp} from 'react-native-notificated'

const Tab = createBottomTabNavigator();

import {PlatformPressable} from "@react-navigation/elements";
import React, {useCallback, useEffect, useRef} from 'react';
import Home from "./tab/home";
import GetStarted from "./tab/getStarted";

import {NavigationContainer, ParamListBase, RouteProp} from '@react-navigation/native';
import {CheckCircle2, CheckIcon, HomeIcon, LibraryIcon, PlayIcon} from "lucide-react-native";
import Play from "./tab/play";
import Library from "./tab/Library";

import {useAuth} from "../context/AuthContext";
import Login from "./tab/login";
import Register from "./tab/register";
import {Button, Text, View} from "react-native"
import {GestureHandlerRootView} from "react-native-gesture-handler";
import ProfileMenu from "../components/ProfileMenu";
import ArtistAlbums from "../components/feature/ArtistAlbums";
import {createStackNavigator} from '@react-navigation/stack';
import {RootTabParamList} from "./tab/tab-types/types";
import AlbumTracks from "../components/feature/AlbumTracks";
import UserPlayListTrack from "../components/feature/UserPlayListTrack";
import MusicPlayerUi from "../components/feature/MusicPlayerUi";
import AnimatedLoadingScreen from "../components/AnimatedLoadingScreen";



function Layout() {


    const Stack = createStackNavigator<RootTabParamList>();
    const {token,currentUser} = useAuth()

    if (token === undefined || currentUser === undefined) return <AnimatedLoadingScreen/>



    return (
        <View style={{flex: 1}}>

            <NavigationContainer>
                <Stack.Navigator>


                    {token && currentUser ?
                        <>

                            <Stack.Screen
                                name="AuthenticatedTabs"
                                component={AuthenticatedComponent}
                                options={{headerShown: false, animation: "slide_from_left"}}
                            />
                            <Stack.Screen
                                name="ArtistAlbums"
                                component={ArtistAlbums}
                                options={{headerShown: false, animation: "slide_from_right"}}

                            />
                            <Stack.Screen
                                name="AlbumTracks"
                                component={AlbumTracks}
                                options={{headerShown: false, animation: "slide_from_right"}}

                            />
                            <Stack.Screen
                                name="UserPlayListTrack"
                                component={UserPlayListTrack}
                                options={{headerShown: false, animation: "slide_from_right"}}

                            />

                        </>
                        : token && !currentUser ?
                            <>

                                <Stack.Screen
                                    name="Login" component={Login}
                                    options={{headerShown: false, animation: "slide_from_right"}}
                                />
                                <Stack.Screen
                                    name="Register" component={Register}
                                    options={{headerShown: false, animation: "slide_from_right"}}
                                />
                            </>
                            :

                            <Stack.Screen
                                name="getStarted"
                                component={GetStarted}
                                options={{headerShown: false}}
                            />

                    }


                </Stack.Navigator>


            </NavigationContainer>

        </View>
    );
}


const AuthenticatedComponent = () => {

    return (
        <View style={{flex: 1}}>

            <Tab.Navigator
                screenOptions={({route}: { route: RouteProp<ParamListBase, string> }) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        if (route.name === 'Home') return <HomeIcon color={color} size={25} strokeWidth={3}/>
                        if (route.name === 'Play') return <PlayIcon color={color} size={25} strokeWidth={3}/>
                        if (route.name === 'Library') return <LibraryIcon color={color} size={25} strokeWidth={3}/>
                    },

                    tabBarHideOnKeyboard:true,
                    tabBarActiveTintColor: '#00e673',
                    tabBarInactiveTintColor: '#a9a7a7',
                    headerShown: false,

                    tabBarStyle: {

                        backgroundColor: "#191919",
                        borderTopWidth: 0
                    },
                    tabBarLabelStyle: {
                        fontSize: 9,
                        position: "absolute",
                        bottom: 5,
                        fontFamily: "PlusJakartaSans-Bold"
                    },

                    tabBarButton: (props: BottomTabBarButtonProps) => <PlatformPressable
                        pressColor={"transparent"} {...props}/>
                })}


            >


                <>
                    <Tab.Screen name="Home" component={Home}/>
                    <Tab.Screen name="Play" component={Play}/>
                    <Tab.Screen name="Library" component={Library}/>

                </>


            </Tab.Navigator>


        </View>
    )

}


export default Layout;