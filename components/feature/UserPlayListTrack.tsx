import React, {useEffect, useState} from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootTabParamList } from "../../app/tab/tab-types/types";
import { useQueries } from "@tanstack/react-query";
import { fetchPlayListTrack, fetchCoverPlaylistImage } from "../../query/fetchPlaylist";
import { useAuth } from "../../context/AuthContext";
import TrackCard from "../TrackCard";
import {Award, ChevronLeft, ListMinus, ListMusicIcon} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "../SearchInput";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {useMusicPlayer} from "../../context/MusicPlayerContext";
import MusicPlayerUi from "./MusicPlayerUi";
import * as NavigationBar from 'expo-navigation-bar';
import {useDeleteTrackFromPlaylist} from "../../hooks/useRemoveTrackPlaylist";
import EmptyState from "../EmptyState";
type AlbumTracksProps = StackScreenProps<RootTabParamList, 'UserPlayListTrack'>;

function UserPlayListTrack({ route }: AlbumTracksProps) {
    const { PlaylistID } = route.params;

    const navigation = useNavigation();
    const [search,setSearch]=useState("")
    const results = useQueries({
        queries: [
            fetchPlayListTrack( PlaylistID),
            fetchCoverPlaylistImage(PlaylistID)
        ]
    });

    const [playlistTrackQuery, coverImageQuery] = results;

    const isLoading = playlistTrackQuery.isLoading || coverImageQuery.isLoading;
    const playlistTracks = playlistTrackQuery.data;
    const playlistCoverImage=coverImageQuery.data
    const {PlayPlaylist}=useMusicPlayer()
    console.log(PlaylistID)
    const { mutate, isPending } = useDeleteTrackFromPlaylist();
    const filteredTracks = playlistTracks?.items?.filter((item: { track: SpotifyApi.TrackObjectFull }) =>
        item?.track?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );
    const removeTrack = (uri:string) => {
        mutate({
            playlistId: PlaylistID,
            uri: uri,
            onSuccess:()=>playlistTrackQuery.refetch()

        });
    };

    useEffect(() => {
        async function configureNavigationBar(){
            await NavigationBar.setVisibilityAsync("hidden")
        }

        configureNavigationBar().then()
    }, [])

    const renderRightActions = (uri:string) => (
        <TouchableOpacity onPress={()=>removeTrack(uri)}
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: 70,

                borderTopRightRadius:5,
                borderBottomRightRadius:5,
                backgroundColor:"#df6d6d"

            }}


        ><ListMinus color={"white"}/>
            <Text style={{fontSize:10, color: "white", fontFamily:"PlusJakartaSans-Semibold" }}>Remove</Text>
        </TouchableOpacity>
    );
    const renderItem = ({ item, index }: { item: { track: SpotifyApi.TrackObjectFull }; index: number }) => (
    <Swipeable enableContextMenu={true}

        renderRightActions={()=>renderRightActions(item?.track?.uri)}
        overshootLeft={false}
        overshootRight={false}
    >
        <TrackCard isDisplayMenu={false}
                   onPlay={() => {PlayPlaylist(`spotify:playlist:${PlaylistID}`,index) }}
                   onMenuCLick={() => { }}
                   albumImage={item?.track?.album?.images?.[0]?.url ?? ""}
                   songName={item?.track?.name ?? ""}
                   key={index}
                   artist={item?.track?.artists?.[0]?.name ?? ""}
                   item={item}
        />
    </Swipeable>
    );



    return (
        <View style={style.container}>

            <TouchableOpacity style={{paddingBottom:10,paddingTop:30}} onPress={() => navigation.goBack()}>
                <Text>
                    <ChevronLeft strokeWidth={3} size={30} color={"white"} />
                </Text>
            </TouchableOpacity>


            {/*<Text>{JSON.stringify(playlistCoverImage?.[0]?.url)}</Text>*/}

            <SearchInput value={search} onChange={setSearch}  />

       <View style={{zIndex:-1,flex:1}}>
           <FlatList
               contentContainerStyle={{    gap: 10,paddingTop: 2,  paddingBottom:200,}}
               showsVerticalScrollIndicator={false}

               data={filteredTracks}
               renderItem={renderItem}

               refreshControl={
                   <RefreshControl
                       progressBackgroundColor={"#292929"}
                       refreshing={isLoading}
                       onRefresh={() => playlistTrackQuery.refetch()}
                       colors={["#0e6"]}
                   />
               }
               keyExtractor={(item) => item.track.id}
           />
       </View>

            {!isLoading && (playlistTracks?.items?.length <= 0 &&
                <EmptyState/>)}



                  <MusicPlayerUi/>



        </View>
    );
}

export default UserPlayListTrack;

const style = StyleSheet.create({
    container: {
        backgroundColor: "#212121",
        padding:10,

 flex:1,


        zIndex:1,

    },
    coverContainer: {
        alignItems: "center",
        marginBottom: 10,
    },
    coverImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});
