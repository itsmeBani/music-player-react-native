import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {EllipsisVertical} from "lucide-react-native";

interface TrackCardProps<TData> {
    item: TData,
    onMenuCLick: () => void,
    onPlay: () => void,
    songName: string,
    artist: string
    albumImage:string
    isDisplayMenu?:boolean
}


function TrackCard<TData>({item, onMenuCLick, onPlay, songName, artist,albumImage,isDisplayMenu=true}: TrackCardProps<TData>) {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "#292929",
            borderColor: "rgba(255,255,255,0.32)",
            borderWidth: 0.2,
            borderRadius: 7,
            gap: 5,
            padding: 10
        }}>


            <TouchableOpacity onLongPress={onMenuCLick} onPress={onPlay} style={{flex: 1, flexDirection: "row", gap: 10}}>


                <Image src={albumImage}
                       style={{
                           width: 55,
                           borderRadius: 6,
                           aspectRatio: 1
                       }}/>


                <View style={{gap: 3, paddingRight: 10, width: "70%"}}>

                    <Text ellipsizeMode={"tail"} numberOfLines={1}
                          style={{color: "white", fontFamily: "PlusJakartaSans-SemiBold", fontSize: 12}}>
                        {songName}
                    </Text>
                    <Text style={{
                        color: "white",
                        fontSize: 11,
                        fontFamily: "PlusJakartaSans-Regular"
                    }}>Song.{artist}
                    </Text>
                </View>

            </TouchableOpacity>

            {isDisplayMenu &&
            <TouchableOpacity onPress={onMenuCLick}
                              style={{width: 30, height: 50, alignItems: "center", justifyContent: "center"}}>
                <EllipsisVertical color={"white"} size={20}/>
            </TouchableOpacity>
            }
        </View>
    );
}

export default TrackCard;