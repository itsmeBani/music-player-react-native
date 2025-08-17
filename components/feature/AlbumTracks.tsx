import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RootTabParamList} from "../../app/tab/tab-types/types";
import {useQuery} from "@tanstack/react-query";
import {fetchAlbumTracks} from "../../query/fetchTracks";
import {useAuth} from "../../context/AuthContext";
import TrackCard from "../TrackCard";
import {ChevronLeft} from "lucide-react-native";
import {useNavigation} from "@react-navigation/native";


import {useMusicPlayer} from "../../context/MusicPlayerContext";
import MusicPlayerUi from "./MusicPlayerUi";

type AlbumTracksProps = StackScreenProps<RootTabParamList, 'AlbumTracks'>;

function AlbumTracks({route}: AlbumTracksProps) {
    const {AlbumID} = route.params;
    const navigation = useNavigation()
    const {data, refetch, isLoading} = useQuery(fetchAlbumTracks(AlbumID))

    const {Play}=useMusicPlayer()




    const renderItem = ({item, index}: { item: SpotifyApi.AlbumObjectSimplified; index: number }) => (
        <TrackCard isDisplayMenu={false}
            onPlay={() => {Play(item?.uri)}}
            onMenuCLick={() => {}}
            albumImage={data?.images?.[0]?.url}
            songName={item?.name}
            key={index} artist={item?.artists[0].name}
            item={item}/>
    );
    return (
        <View style={style.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text><ChevronLeft strokeWidth={3} size={30} color={"white"}/></Text>
            </TouchableOpacity>
          <View style={{zIndex:-1}}>
              <FlatList
                  contentContainerStyle={{gap: 10, paddingTop: 10, paddingBottom: 160}}
                  showsVerticalScrollIndicator={false}
                  data={data?.tracks.items}
                  renderItem={renderItem}

                  refreshControl={
                      <RefreshControl progressBackgroundColor={"#292929"} refreshing={isLoading}
                                      onRefresh={() => refetch()} colors={["#0e6"]}/>
                  }

                  keyExtractor={(item) => item.id}

              />
          </View>

            <MusicPlayerUi/>
        </View>
    );
}

export default AlbumTracks;

const style = StyleSheet.create({
    container: {
        backgroundColor: "#212121",
        flex: 1,
        zIndex:1,
        paddingHorizontal: 10,
        paddingTop: 40,


    }
})