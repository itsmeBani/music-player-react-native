import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Alert, FlatList, RefreshControl} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {fetchRecentlyPlayedTrack} from "../../query/fetchTracks";
import TrackCard from "../TrackCard";
import {useMusicPlayer} from "../../context/MusicPlayerContext";
import {Badge, Clock, TimerIcon} from "lucide-react-native";
import TitleIcon from "../TitleIcon";

function RecentlyTrack() {
    const {data, isLoading, refetch} = useQuery(fetchRecentlyPlayedTrack())
    const {Play} = useMusicPlayer()

    const renderItem = ({item, index}: { item: {track:SpotifyApi.TrackObjectFull}; index: number }) => (

        <TrackCard isDisplayMenu={false}
            onPlay={() => {
                Play(item.track?.uri)
            }}
            songName={item?.track.name}
            artist={item?.track.artists?.[0].name}
            albumImage={item?.track.album?.images?.[0].url}
            onMenuCLick={() => {
            }}
            key={index}
            item={item}/>
    );
    return (
        <View style={{flex:1,zIndex:-1,gap:10}}>


            <TitleIcon icon={Clock} name={"Recently Played"}/>
                <FlatList
                    contentContainerStyle={{position: "relative", gap: 10,paddingHorizontal:10, paddingBottom: 100}}
                    showsVerticalScrollIndicator={false}
                    data={data?.items}
                    renderItem={renderItem}

                    refreshControl={
                        <RefreshControl progressBackgroundColor={"#292929"} refreshing={isLoading}
                                        onRefresh={() => refetch()} colors={["#0e6"]}/>
                    }

                    keyExtractor={(item,index) => index?.toString()}

/>
        </View>
    );
}

export default RecentlyTrack;

const style = StyleSheet.create({
    title: {
        color: 'white',
        fontSize: 16,

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
