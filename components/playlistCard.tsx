import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import PlaylistBaseObject = SpotifyApi.PlaylistObjectFull;
import {Music} from "lucide-react-native";
import {useNavigation} from "@react-navigation/native";
import {ScreenNavigationProp} from "../app/tab/tab-types/types";



interface PlaylistCardProp{
    item:PlaylistBaseObject
    onLongPress:(playlistID:string)=>void
}

function PlaylistCard({item,onLongPress} :PlaylistCardProp) {
 const navigation:ScreenNavigationProp=useNavigation()
    return (
        <TouchableOpacity onLongPress={()=>onLongPress(item?.id)} onPress={()=>navigation.navigate("UserPlayListTrack",{PlaylistID:item?.id})} style={styles.box}>
            <View style={{backgroundColor: "#212121",  borderRadius: 10,overflow:"hidden"}}>
                {item?.images ? <Image style={{height:120,flex:1}} src={item?.images?.[0].url}/>:
                    <View style={{justifyContent:"center",alignItems:"center"}}><Music height={120} width={50} strokeWidth={3} color={"white"} />
                    </View>

                }

            </View>

            <View style={{flex:1}}>

                <Text style={styles.title} lineBreakMode={"tail"} ellipsizeMode={"tail"} numberOfLines={1}>{item?.name}</Text>
                <Text style={styles.description}>Songs</Text>
                <Text style={styles.count}>{item?.tracks.total}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default PlaylistCard;
const styles = StyleSheet.create({
    box: {
        flex:1,

        padding: 10,
        backgroundColor:"#292929",
        borderColor:"white",
        borderWidth:0.1,
        gap:10,
        overflow: "hidden",

        borderRadius: 10
    },
    title: {
        color: "white",
        fontSize:12,

        overflow:"hidden",
        lineHeight:20   ,

        fontFamily: "PlusJakartaSans-Bold"

    }, description: {
        color: "white",
        fontFamily: "PlusJakartaSans-Regular",
        fontSize:9,

    },
    count: {
        color: "white",
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 14,
        lineHeight:20,

    }
});