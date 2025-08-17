import React, {useState} from 'react';

import ProfileMenu from "../../components/ProfileMenu";

import {View, StyleSheet, FlatList, RefreshControl, Text, TouchableOpacity} from "react-native";
import {useQuery} from "@tanstack/react-query";
import {fetchUserPlaylists} from "../../query/fetchPlaylist";

import PlaylistCard from "../../components/playlistCard";

import MusicPlayerUi from "../../components/feature/MusicPlayerUi";
import CreatePlaylist from "../../components/feature/CreatePlaylist";
import {useRemovePlaylist} from "../../hooks/useDeletePlaylist";

function Library() {

    const {data, isLoading, refetch} = useQuery(fetchUserPlaylists())
    const [isOpenModal,setIsModalOpen]=useState(false)
     const [activePlaylistID,setActivePlaylistID]=useState<string |null>(null)

    const removePlaylist = useRemovePlaylist();


    const OpenPlaylistModal=(playlistID:string)=>{
        setActivePlaylistID(playlistID)
        setIsModalOpen(true)

    }

    const ClosePlaylistModal=()=>{
        setActivePlaylistID(null)
        setIsModalOpen(false)
    }

    const onSuccessRemove=async ()=>{
        await refetch()
        setIsModalOpen(false)
    }


    const HandleRemovePlaylist=()=>{
        removePlaylist.mutate({
            playlistId: activePlaylistID,
            onSuccessRemove
        });
    }


    const renderItem = ({item, index}: { item: SpotifyApi.PlaylistObjectFull; index: number }) => (
        <PlaylistCard onLongPress={OpenPlaylistModal}  key={index} item={item}/>
    );


    return (
        <View style={{backgroundColor: "#212121", flex: 1, zIndex: 1, paddingTop: 40, position: "relative"}}>
            <ProfileMenu/>

                <CreatePlaylist onSuccess={()=>refetch()}/>


            <View    style={{padding: 10, zIndex: -1}}>
                <FlatList numColumns={2}

                          contentContainerStyle={{paddingBottom: 150, position: "relative", gap: 7}}
                          showsVerticalScrollIndicator={false}
                          data={data?.items}
                          refreshControl={
                              <RefreshControl progressBackgroundColor={"#292929"} refreshing={isLoading}
                                              onRefresh={() => refetch()} colors={["#0e6"]}/>
                          }
                          renderItem={renderItem}
                          keyExtractor={(item) => item.id}
                          columnWrapperStyle={{gap: 7}}
                />
            </View>
            <MusicPlayerUi/>




            {isOpenModal &&
                <View style={{zIndex:3,alignItems:"center",justifyContent:"center",padding:10,position:"absolute",width:"100%",height:"100%",bottom:0,backgroundColor:"rgba(21,15,15,0.64)"}}>

                    <View style={{elevation:20,width:"90%",borderRadius:10,backgroundColor:"#212121",padding:20,borderWidth:0.2,borderColor:"white"}}>
                        <Text style={{color:"white",fontFamily:"PlusJakartaSans-Bold",fontSize:20}}>Remove Playlist</Text>
                        <Text style={{color:"white", fontSize:12,fontFamily:"PlusJakartaSans-Regular"}}>
                            Are you sure you want to remove this playlist? This will permanently delete it from your Spotify account and cannot be undone.
                         </Text>

                        <View style={{flexDirection:"row",justifyContent:"flex-end",paddingTop:30,gap:20}}>

                            <TouchableOpacity onPress={ClosePlaylistModal}><Text style={{color:"white",fontFamily:"PlusJakartaSans-SemiBold"}}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={HandleRemovePlaylist}><Text style={{color:"#df6d6d",fontFamily:"PlusJakartaSans-SemiBold"}}>Remove</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>

            }
        </View>
    );
}

export default Library;
const styles = StyleSheet.create({});