import React from 'react';
import {Image, ListRenderItem, SectionListRenderItemInfo, Text, TouchableOpacity, View} from "react-native";
import AlbumObjectSimplified = SpotifyApi.AlbumObjectSimplified;
import {useNavigation} from "@react-navigation/native";
import {ScreenNavigationProp} from "../app/tab/tab-types/types";

function AlbumCard({item}:{item:AlbumObjectSimplified}) {

    const navigation:ScreenNavigationProp=useNavigation()
    return (
        <TouchableOpacity onPress={()=>navigation.navigate("AlbumTracks",{AlbumID:item?.id})} style={{height:180,width:140, padding:10,borderRadius:10,borderWidth:0.2,borderColor:"white",backgroundColor:"#292929"}}>
            <Image src={item?.images?.[0]?.url}  style={{flex:1,height:100,borderRadius:5}}/>
            <Text numberOfLines={1} style={{color:"white",fontFamily:"PlusJakartaSans-Bold"}}>{item?.name}</Text>
            <Text style={{color:"white",fontFamily:"PlusJakartaSans-Regular"}}>{item?.release_date.split('-')[0]}
                <Text style={{color:"white",fontFamily:"PlusJakartaSans-Regular",fontSize:10}}> •  {item?.artists[0].name}</Text>
            </Text>
        </TouchableOpacity>
    );
}

export default AlbumCard;