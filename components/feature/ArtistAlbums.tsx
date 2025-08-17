import React, {useMemo, useRef} from 'react';
import {
    StyleSheet, TouchableOpacity, View, Text, ImageBackground, FlatList, RefreshControl, Image
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NavigationProps, RootTabParamList, ScreenNavigationProp} from "../../app/tab/tab-types/types";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {ChevronLeft, PlayIcon} from "lucide-react-native";
import {useQueries, useQuery} from "@tanstack/react-query";
import {fetchCurrentArtist} from "../../query/fetchArtists";
import {useAuth} from "../../context/AuthContext";
import {LinearGradient} from "expo-linear-gradient";
import {fetchAllTrackByArtist, fetchArtistTopTracks} from "../../query/fetchTracks";
import AlbumCard from "../AlbumCard";
import TrackCard from "../TrackCard";
import LottieView from 'lottie-react-native';
import AudioWavesAnimation from  "../../assets/AudioWave.json"
import BottomSheet, {
    BottomSheetFlatList,
    BottomSheetScrollView,
    BottomSheetView,
    BottomSheetVirtualizedList
} from "@gorhom/bottom-sheet";
import {StackScreenProps} from "@react-navigation/stack";
import LinearGradientBackgroundImage from "../LinearGradientBackgroundImage";
import MusicPlayerUi from "./MusicPlayerUi";
import {useMusicPlayer} from "../../context/MusicPlayerContext";
import AnimatedLoadingScreen from "../AnimatedLoadingScreen";
type ArtistAlbumsProps = StackScreenProps<RootTabParamList, 'ArtistAlbums'>;

function ArtistAlbums({route}: ArtistAlbumsProps) {
    const {ArtistID} = route.params;
    const navigation: ScreenNavigationProp = useNavigation()
    const {Play,AddToQueue}=useMusicPlayer()
    const response = useQueries({
        queries: [
            fetchCurrentArtist(ArtistID),
            fetchAllTrackByArtist(ArtistID),
            fetchArtistTopTracks(ArtistID)
        ]
    })



    const TopSongBottomRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50", "80"], []);


    const OpenTopSongs = () => {
        TopSongBottomRef.current?.snapToIndex(1);
    }
    const [currentArtist, album,topTracks] = response
    const currentArtistData: SpotifyApi.ArtistObjectFull = currentArtist.data
    const AlbumData: SpotifyApi.ArtistsAlbumsResponse = album.data
   const TopTracksData=topTracks.data

    if (currentArtist.isFetching) return <AnimatedLoadingScreen/>

    const renderItem = ({item, index}: { item: SpotifyApi.TrackObjectFull; index: number }) => (
        <TrackCard
            isDisplayMenu={false}
            artist={item?.artists?.[0]?.name}
            songName={item?.name}
            albumImage={item?.album?.images?.[0]?.url}
            onPlay={()=>{Play(item?.uri)}} onMenuCLick={() => {}} key={index} item={item}/>
    );


    return (
        <View style={style.container}>
          <View style={{zIndex:-1}}>
              <LinearGradientBackgroundImage imageUrl={currentArtistData?.images?.[0].url}>
                  <Text style={style.artistName}>{currentArtistData?.name}</Text>
                  <View style={{flexDirection: "row", gap: 40}}>
                      <View>
                          <Text style={{
                              color: "#ffffff",
                              fontFamily: "PlusJakartaSans-Bold",
                              marginTop: 4,
                              fontSize: 19,

                          }}>

                              {currentArtistData?.followers.total.toLocaleString()}

                          </Text>
                          <Text style={{
                              color: "rgba(255,255,255,0.7)",
                              fontFamily: "PlusJakartaSans-Regular",
                              marginTop: 4,
                              fontSize: 12,

                          }}>

                              followers

                          </Text>

                      </View>
                      <View>
                          <Text style={{
                              color: "#ffffff",
                              fontFamily: "PlusJakartaSans-Bold",
                              marginTop: 4,
                              fontSize: 19,


                          }}>

                              {currentArtistData?.popularity.toLocaleString()}

                          </Text>
                          <Text style={{
                              color: "rgba(255,255,255,0.7)",
                              fontFamily: "PlusJakartaSans-Regular",
                              marginTop: 4,
                              fontSize: 12,


                          }}>

                              Popularity

                          </Text>


                      </View>
                  </View>
              </LinearGradientBackgroundImage>
              <TouchableOpacity style={style.backbtn} onPress={() => navigation.goBack()}>
                  <Text><ChevronLeft strokeWidth={3} size={30} color={"white"}/></Text>
              </TouchableOpacity>


              <View style={{padding: 0, paddingBottom: 10}}>
                  <Text style={{
                      color: "white",
                      fontFamily: "PlusJakartaSans-Bold",
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      fontSize: 25
                  }}>Albums</Text>

                  <FlatList
                      horizontal={true}
                      refreshControl={
                          <RefreshControl progressBackgroundColor={"#292929"} refreshing={album.isLoading}
                                          onRefresh={() => album.refetch()} colors={["#0e6"]}/>
                      }
                      contentContainerStyle={{ gap: 10, paddingLeft: 15}}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}

                      data={AlbumData?.items}
                      renderItem={({item}) => {
                          return <AlbumCard item={item}/>
                      }}
                      keyExtractor={(item) => item.id}

                  />



              </View>




              <Text style={{
                  color: "white",
                  fontFamily: "PlusJakartaSans-Bold",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  fontSize: 25
              }}>Top Tracks</Text>

              <View style={{padding:10}}>
                  <View style={{flexDirection:"column",padding:20,borderRadius:10,backgroundColor:"#0a59b0"}}>



                      <View style={{flexDirection:"row",alignItems:"center"}}>
                          <View style={{flex:1}}>
                              <Text style={{color:"white",fontSize:20,fontFamily:"PlusJakartaSans-Bold"}}>{currentArtistData?.name}</Text>
                              <Text style={{color:"white",fontSize:12,fontFamily:"PlusJakartaSans-Regular"}}>Discover the most popular and trending songs by this artist</Text>

                          </View>

                          <TouchableOpacity onPress={OpenTopSongs} style={{backgroundColor:"white",padding:10,borderRadius:100}}>
                              <Text style={{fontFamily:"PlusJakartaSans-Bold",elevation:10}}><PlayIcon color={"#212121"} strokeWidth={2}/></Text>
                          </TouchableOpacity>
                      </View>
                  </View>

              </View>
          </View>

            <BottomSheet index={-1} ref={TopSongBottomRef}    enablePanDownToClose={true}
                         handleIndicatorStyle={{backgroundColor: "#fff"}}
                         backgroundStyle={{backgroundColor: "#212121"}}
                        containerStyle={{zIndex:-1}}
                         snapPoints={snapPoints}
                         enableDynamicSizing={false}
            >
                <BottomSheetFlatList showsVerticalScrollIndicator={false}
                    data={TopTracksData?.tracks}
                                     refreshControl={
                                         <RefreshControl progressBackgroundColor={"#292929"} refreshing={topTracks.isLoading}
                                                         onRefresh={() => topTracks.refetch()} colors={["#0e6"]}/>
                                     }
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{position: "relative", gap: 10, paddingTop: 10, padding: 10,paddingBottom:130}}
                />
            </BottomSheet>

             <MusicPlayerUi/>

        </View>
    );
}

export default ArtistAlbums;


const style = StyleSheet.create({
    container: {
        backgroundColor: "#212121",
        flex: 1,
        zIndex:1,

    },
    backbtn: {
        position: "absolute",
        top: 40,
        left: 10,
        elevation: 10
    },
    artistName: {
        color: "white",
        fontSize: 28,
        fontFamily: "PlusJakartaSans-Bold"
    }
})