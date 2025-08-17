import React from 'react';
import {
    Image,
    StyleSheet,
    View,
    Text,
    ImageSourcePropType,
    ScrollView,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {TopArtistsQuery} from "../../query/fetchArtists";
import {useAuth} from "../../context/AuthContext";
import {LinearGradient} from "expo-linear-gradient";
import {useNavigation} from "@react-navigation/native";
import {ScreenNavigationProp} from "../../app/tab/tab-types/types";
import {Award, Clock} from "lucide-react-native";
import TitleIcon from "../TitleIcon";

interface ArtistCardProps{

}
function formatFollowers(followersCount:number) {
    if (followersCount >= 1000000) {
        return (followersCount / 1000000).toFixed(1) + 'M';
    } else if (followersCount >= 1000) {
        return (followersCount / 1000).toFixed(1) + 'k';
    } else {
        return followersCount.toString();
    }
}




const ArtistCard = ({items}: { items: SpotifyApi.ArtistObjectFull }) => {
    const navigation: ScreenNavigationProp= useNavigation();

    return(
        <TouchableOpacity onPress={()=>navigation.navigate('ArtistAlbums', { ArtistID: items.id })}>
            <ImageBackground      src={items.images?.[0]?.url}
                                  style={{

                                      width: 150,
                                      flex:1,
                                      overflow:"hidden",

                                      borderRadius: 10,
                                  }}
            >

                <LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 0, y: 0}}
                    colors={['rgba(0,0,0,0.79)', 'rgba(0,0,0,0.48)','rgba(0,0,0,0)']}
                    style={{flex:1,justifyContent:'flex-end',padding:15,}}

                >
                    <Text style={{
                        color: "white",
                        fontFamily: "PlusJakartaSans-Bold",
                        fontSize: 15,
                    }}>
                        {items?.name}

                    </Text>
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <View>
                            <Text style={{
                                color: "white",
                                fontFamily: "PlusJakartaSans-Bold",
                                marginTop: 4,
                                fontSize:15 ,

                            }}>

                                {formatFollowers(items?.followers.total)}

                            </Text>
                            <Text style={{
                                color: "white",
                                fontFamily: "PlusJakartaSans-Regular",
                                marginTop: 4,
                                fontSize:12,

                            }}>

                                followers

                            </Text>

                        </View>
                        <View>
                            <Text style={{
                                color: "#ffffff",
                                fontFamily: "PlusJakartaSans-Bold",
                                marginTop: 4,
                                fontSize:15,


                            }}>

                                {items?.popularity.toLocaleString()}

                            </Text>
                            <Text style={{
                                color: "#fff",
                                fontFamily: "PlusJakartaSans-Regular",
                                marginTop: 4,
                                fontSize:12,


                            }}>

                                Popularity

                            </Text>


                        </View>
                    </View>


                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}
function TopArtist() {
    const {data} = useQuery(TopArtistsQuery());
    return (
        <View style={{flex:1,zIndex:-1,gap:10}}>

            <TitleIcon icon={Award} name={"My Top Artists"}/>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12,paddingLeft:10}}>
                {data?.items.map((item: SpotifyApi.ArtistObjectFull,index:number )=>{
                    return <ArtistCard items={item} key={index}/>
                })}

            </ScrollView>


        </View>
    );
}

export default TopArtist;


const style = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        position: "relative"
    },
    avatar: {
        flex: 1,
        borderRadius: 100,
    },
    tooltip: {
        position: "absolute",
        top: -10,
        right: -40,
        flexWrap: "wrap"
    }, name: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        fontSize: 9,
        borderRadius: 100,
        backgroundColor: "white",
        fontFamily: "PlusJakartaSans-Bold",

    }, title: {
        color: "white",
        fontSize:16,
        fontFamily: "PlusJakartaSans-Bold",
    },
})