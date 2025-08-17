import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import React from "react";
import {AudioLines} from "lucide-react-native";
import {useAuth} from "../../context/AuthContext";


function Login() {
    const {promptAsync}=useAuth()
    return (
        <SafeAreaView style={{backgroundColor:"#191919",flex:1,padding:16}}>
          <View style={{flex:1,display:"flex"}}>
              <View style={{flex:1}}>


              </View>
              <AudioLines size={32} color={"white"} strokeWidth={1.75} />
              <View style={styles.contentWrapper}>
                  <Text style={styles.title}>
                      Step Into a World Where Every Beat Tells Your Story
                  </Text>
                  <Text style={styles.subtitle}>
                      Stream your favorite tracks, discover hidden gems, and feel music like never before.
                  </Text>
                  <TouchableOpacity onPress={()=>promptAsync()} activeOpacity={0.8} style={styles.button}>
                      <Text style={styles.buttonText}>Start Listening</Text>
                  </TouchableOpacity>
              </View>


          </View>
        </SafeAreaView>
    );
}

export default Login;


const styles =StyleSheet.create({
    logoContainer:{

    },
    contentWrapper: {
        paddingTop:13,
        paddingBottom:20
    },
    title: {
        fontSize: 29,
        textAlign:"auto",
  paddingBottom:10,
        color: '#1DB954',
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