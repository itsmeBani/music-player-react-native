import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React from "react";
import {AudioLines} from "lucide-react-native";
import {useAuth} from "../../context/AuthContext";

function GetStarted() {
    const {promptAsync}=useAuth()
    return (
        <View style={{backgroundColor:"#191919",flex:1}}>
            <View style={{zIndex:1,position:"absolute",backgroundColor:"rgba(0,0,0,0.56)",width:"100%",height:"100%"}}/>
          <View style={{flex:1,display:"flex"}}>
              <View style={{flex:1,overflow:"visible",padding:30,alignItems:"center",justifyContent:"center"}}>
                  <Image style={{position:"absolute",top:50,height:"100%",width:"130%",objectFit:"contain"}} source={require('../../assets/headphone-image.png')} />
              </View>

              <SafeAreaView style={styles.contentWrapper}>
                  <AudioLines style={{marginBottom:10}} size={32} color={"white"} strokeWidth={1.75} />
                  <Text style={styles.title}>
                      Step Into a World Where Every Beat Tells Your Story
                  </Text>
                  <Text style={styles.subtitle}>
                      Stream your favorite tracks, discover hidden gems, and feel music like never before.
                  </Text>
                  <TouchableOpacity onPress={()=>promptAsync()} activeOpacity={0.8} style={styles.button}>
                      <Text style={styles.buttonText}>Start Listening</Text>
                  </TouchableOpacity>
              </SafeAreaView>


          </View>
        </View>
    );
}

export default GetStarted;


const styles =StyleSheet.create({
    logoContainer:{
    },
    contentWrapper: {
        paddingHorizontal:18,
        zIndex:1,
        paddingBottom:20
    },
    title: {
        fontSize: 29,
        textAlign:"auto",
  paddingBottom:10,
        color: '#0e6',
        lineHeight: 31,
        fontFamily:"PlusJakartaSans-Bold"
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(224,224,224,0.83)',
        fontFamily:"PlusJakartaSans-Regular",
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {

        width:"100%",
        backgroundColor: '#1DB954',
        paddingVertical: 10,
        alignItems:"center",
        paddingHorizontal: 32,
        borderRadius: 25,
    },
    buttonText: {
        lineHeight: 31,
        color: 'white',
        fontFamily:"PlusJakartaSans-Bold",
        fontSize: 16,
    },
})