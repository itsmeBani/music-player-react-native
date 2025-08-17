import React, {useMemo, useRef, useState} from 'react';

import {SafeAreaView} from "react-native-safe-area-context";
import ProfileMenu from "../../components/ProfileMenu";
import {FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import SearchInput from "../../components/SearchInput";
import {useDebounce} from '../../hooks/useDebounce';
import {useQuery} from "@tanstack/react-query";
import {SearchTracks} from "../../query/fetchTracks";
import {useAuth} from "../../context/AuthContext";
import PlaylistCard from "../../components/playlistCard";
import TrackCard from "../../components/TrackCard";
import BottomSheet, {BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";

import {useMusicPlayer} from "../../context/MusicPlayerContext";
import MusicPlayerUi from "../../components/feature/MusicPlayerUi";
import {ListPlus, Music, Music2Icon, PlusCircle} from "lucide-react-native";
import {useAddQueueTrack} from "../../hooks/useAddQueueTrack";
import {useNotifications} from "react-native-notificated";
import {fetchUserPlaylists} from "../../query/fetchPlaylist";
import {useAddTrackToPlaylist} from "../../hooks/useAddTrackToPlaylist";
import Spinner from "../../components/loader/spinner";


function Play() {

    const {Play, AddToQueue} = useMusicPlayer()
    const {data: playlistData} = useQuery(fetchUserPlaylists())

    const [searchTrack, setSearchTrack] = useState("Arthur Nery")
    const debouncedSearchTerm = useDebounce(searchTrack, 600);
    const [currentTrackItem, setCurrentTrackItem] = useState<SpotifyApi.TrackObjectFull | null>(null)
    const {data, isLoading, refetch} = useQuery(SearchTracks(debouncedSearchTerm))
    const menuBottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["43",], [currentTrackItem]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>()
    const { mutate: addTracks, data:addtrackData,isPending } = useAddTrackToPlaylist();

    const TrackMenu = (item: SpotifyApi.TrackObjectFull) => {
        if (!item) return
        setCurrentTrackItem(item)
        menuBottomSheetRef.current?.snapToIndex(0);


    }


    const AddTrackToPlayList=()=>{
        addTracks({
            playlistId: selectedPlaylistId,
            uris: [currentTrackItem?.uri ?? ""],
            onSuccess:()=>menuBottomSheetRef.current?.close()
        });
    }

    const AddSongQueue=()=>{
        AddToQueue(currentTrackItem?.uri)
        menuBottomSheetRef.current?.close()
    }

    const renderItem = ({item, index}: { item: SpotifyApi.TrackObjectFull; index: number }) => (

        <TrackCard
            onPlay={() => {
                Play(item.uri)
            }}
            songName={item?.name}
            artist={item?.artists?.[0].name}
            albumImage={item?.album?.images?.[0].url}
            onMenuCLick={() => TrackMenu(item)}
            key={index}
            item={item}/>
    );


    return (
        <View style={{backgroundColor: "#212121", zIndex: 1, flex: 1, paddingTop: 40, position: "relative"}}>
            <ProfileMenu/>
            <View style={{paddingHorizontal: 10, flex: 1, zIndex: -1, paddingTop: 10}}>
                <SearchInput value={searchTrack} onChange={setSearchTrack}/>

                <FlatList
                    contentContainerStyle={{position: "relative", gap: 10, paddingTop: 10, paddingBottom: 160}}
                    showsVerticalScrollIndicator={false}
                    data={data?.tracks?.items}
                    renderItem={renderItem}

                    refreshControl={
                        <RefreshControl progressBackgroundColor={"#292929"} refreshing={isLoading}
                                        onRefresh={() => refetch()} colors={["#0e6"]}/>
                    }

                    keyExtractor={(item) => item.id}

                />


            </View>
            <BottomSheet enableOverDrag={false} onClose={() => setCurrentTrackItem(null)} index={-1}
                         ref={menuBottomSheetRef} enablePanDownToClose={true}
                         handleIndicatorStyle={{backgroundColor: "#fff"}}
                         backgroundStyle={{backgroundColor: "#191919"}}
                         style={{backgroundColor: "#212121", flex: 1}}
                         snapPoints={snapPoints}
                         enableContentPanningGesture={false}
                         containerStyle={{zIndex: 1, overflow: "visible"}}
                         enableDynamicSizing={false}
            >
                <BottomSheetView style={{flex: 1, overflow: "visible", zIndex: 9999, paddingHorizontal: 20, gap: 10}}>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                        <View style={{
                            width: 60,
                            height: 60,
                            backgroundColor: "#191919",
                            borderRadius: 10,
                            overflow: "hidden"
                        }}>
                            <Image src={currentTrackItem?.album?.images?.[0]?.url} style={{flex: 1}}/>
                        </View>

                        <View>

                            <Text ellipsizeMode={"tail"} numberOfLines={1}
                                  style={{color: "white", fontFamily: "PlusJakartaSans-SemiBold", fontSize: 13}}>
                                {currentTrackItem?.name}
                            </Text>
                            <Text style={{
                                color: "white",
                                fontSize: 12,
                                fontFamily: "PlusJakartaSans-Regular"
                            }}>Song.{currentTrackItem?.artists?.[0]?.name}
                            </Text>



                        </View>
                    </View>


                    <View style={{gap: 10, flex: 1}}>

                        <TouchableOpacity onPress={AddSongQueue}
                                          style={{flexDirection: "row", alignItems: "center", gap: 10}}><ListPlus
                            strokeWidth={1.5} size={35} color={"white"}/><Text
                            style={{color: "rgba(255,255,255,0.83)", fontFamily: "PlusJakartaSans-Bold"}}>Add to
                            Queue</Text></TouchableOpacity>
                        <Text
                            style={{color: "rgba(255,255,255,0.83)", fontFamily: "PlusJakartaSans-Bold"}}>Add to
                            Playlist</Text>


                        <BottomSheetScrollView horizontal={true} contentContainerStyle={{gap: 10, paddingVertical: 10}}
                                               showsHorizontalScrollIndicator={false}>
                            {playlistData?.items?.map((item: SpotifyApi.PlaylistObjectFull, index: number) => {
                                return <TouchableOpacity onPress={() => setSelectedPlaylistId(item?.id)} key={index}
                                                     >

                                    {item?.images?.[0].url ?      <Image style={{
                                        width: 50,
                                        borderColor:item?.id === selectedPlaylistId ?"#0e6" : "transparent",
                                        borderWidth:item?.id === selectedPlaylistId ?2 : 0,
                                        borderRadius: 5,
                                        height: 50,

                                    }} src={item?.images?.[0].url}/> :

                                    <View style={{width: 50,
                                        borderColor:item?.id === selectedPlaylistId ?"#0e6" : "transparent",
                                        borderWidth:item?.id === selectedPlaylistId ?2 : 0,
                                        borderRadius: 5,
                                        alignItems:"center",
                                        justifyContent:"center",
                                        paddingRight:3,
                                        backgroundColor:"#292929",
                                        height: 50,}}>
                                        <Music color={"white"}/>

                                    </View>
                                    }

                                    <Text numberOfLines={1} style={{
                                        width: 50,
                                        fontFamily: "PlusJakartaSans-Regular",
                                        color: "#fff",
                                        fontSize: 10
                                    }}>{item?.name}</Text>
                                </TouchableOpacity>
                            })}
                        </BottomSheetScrollView>

                        <View style={{justifyContent: "flex-end", alignItems: "flex-end"}}>
                            {selectedPlaylistId &&
                                <TouchableOpacity onPress={AddTrackToPlayList} style={{
                                    backgroundColor: 'white',
                                    height:30,
                                    width:80,
                                    alignItems:"center",
                                    paddingVertical: 3,
                                    justifyContent:"center",
                                    paddingHorizontal: 16,
                                    borderRadius: 100,
                                }}><Text style={{fontFamily: "PlusJakartaSans-SemiBold", color: "#212121"}}>{isPending ? <Spinner size={16}  color={"#212121"}  start={isPending}/> :"Add"}</Text>
                                </TouchableOpacity>}
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet>

            <MusicPlayerUi/>
        </View>
    );
}

export default Play;