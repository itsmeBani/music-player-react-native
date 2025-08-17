import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {ScreenNavigationProp} from "../app/tab/tab-types/types";
import {useNavigation} from "@react-navigation/native";

interface EmptyStateProps{
    title:string,
    description:string,
    path:string
}


function EmptyState() {
    const navigation:ScreenNavigationProp=useNavigation()
    return (
        <View style={{flex:1,position:"absolute",width:"100%",top:"50%",justifyContent:"center",alignItems:"center"}}>

            <Text style={{ fontSize: 19, fontFamily: "PlusJakartaSans-Bold",color:"white" }}>
                This playlist is empty
            </Text>
            <Text style={{ fontSize: 13,lineHeight:12,paddingBottom:20,fontFamily: "PlusJakartaSans-Regular", marginTop: 5, color: "rgba(255,255,255,0.78)" }}>
                Start adding songs to enjoy your music here.
            </Text>
            <TouchableOpacity onPress={()=>navigation.navigate('AuthenticatedTabs')} style={{backgroundColor:"#0e6",width:"80%",paddingVertical:10,borderRadius:100,alignItems:"center"}}>
                <Text style={{fontFamily: "PlusJakartaSans-Bold",color:"#212121"}}>Go to Library</Text>
            </TouchableOpacity>

        </View>
    );
}

export default EmptyState;