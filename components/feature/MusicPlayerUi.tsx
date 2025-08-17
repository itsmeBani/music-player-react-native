import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import BottomSheet, {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {PauseIcon, PlayIcon, SkipBack, SkipForward} from 'lucide-react-native';
import {useMusicPlayer} from "../../context/MusicPlayerContext";
import useListenOnChangeTrack from "../../hooks/useListenOnChangeTrack";

function MusicPlayerUi() {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
   const {currentTrackData,Next,Play,Previos,Pause,Resume}=useMusicPlayer()
    const snapPoints = useMemo(() => ['10%'], [currentTrackData]);

    const {playerState}=useListenOnChangeTrack()
    useEffect(() => {
        currentTrackData?.refetch()
    }, [playerState]);


    return (

        <BottomSheet containerStyle={{zIndex:-1}}
                     index={currentTrackData?.data ? 0 : -1}
            ref={bottomSheetRef}

            snapPoints={snapPoints}
            backgroundStyle={{
                backgroundColor: '#006239',
                borderColor: '#00e673',
                borderWidth: 1,
                padding: 10,

                borderRadius: 10,

            }}
            handleIndicatorStyle={{backgroundColor: "white"}}
            handleStyle={{paddingTop: 10, paddingBottom: 0}}
        >
            <BottomSheetView  style={{flex:1}} >
                <View
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        padding: 10,

                        paddingTop: 0
                    }}
                >
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Image src={currentTrackData?.data?.item?.album?.images?.[0]?.url}
                            style={{
                                backgroundColor: '#212121',
                                height: 45,
                                width: 45,

                                borderRadius: 5,
                            }}
                        />
                        <View style={{justifyContent: 'center'}}>
                            <Text numberOfLines={1}
                                style={{
                                    width:140,
                                    color: 'white',
                                    fontFamily: 'PlusJakartaSans-Bold',
                                    fontSize: 12,
                                }}
                            >
                                {currentTrackData?.data?.item?.name}

                            </Text>
                            <Text
                                style={{
                                    color: 'white',
                                    fontFamily: 'PlusJakartaSans-Regular',
                                    fontSize: 10,

                                    lineHeight: 12,
                                }}>

                                {currentTrackData?.data?.item?.album?.artists?.[0]?.name}
                            </Text>
                        </View>
                    </View>

              <View style={{flexDirection:"row",height:"100%"}}>
                  <TouchableOpacity onPress={Previos} style={{padding:10,height:"100%"}}>
                      <SkipBack strokeWidth={3} color="white"/>
                  </TouchableOpacity>

                  {currentTrackData?.data?.is_playing ?
                      <TouchableOpacity onPress={Pause} style={{padding:10,height:"100%"}}>
                          <PauseIcon  strokeWidth={3} color="white"/>
                      </TouchableOpacity>:
                      <TouchableOpacity onPress={Resume} style={{padding:10,height:"100%"}}>
                          <PlayIcon  strokeWidth={3} color="white"/>
                      </TouchableOpacity>

                  }

                  <TouchableOpacity onPress={Next} style={{padding:10,height:"100%"}}>
                      <SkipForward   strokeWidth={3} color="white"/>
                  </TouchableOpacity>
              </View>

                </View>

                <View >

                </View>
            </BottomSheetView>
        </BottomSheet>

    );
}

export default MusicPlayerUi;
