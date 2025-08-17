import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ProfileMenu from '../../components/ProfileMenu';
import TopArtist from "../../components/feature/topArtist";
import RecentlyTrack from "../../components/feature/RecentlyTrack";
import FloatingPlayerUI from "../../components/feature/MusicPlayerUi";


function Home() {

    return (
        <View style={{ backgroundColor: '#212121', flex: 1,zIndex:1, paddingTop: 40 }}>
            <ProfileMenu />

            <View style={{height:250}}>
                <TopArtist/>
            </View>
            <View style={{flex:1}}>
                <RecentlyTrack/>

            </View>

                <FloatingPlayerUI/>

        </View>
    );
}

export default Home;
