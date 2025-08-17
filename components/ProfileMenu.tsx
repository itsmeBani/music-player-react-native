import React, {useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import {useAuth} from "../context/AuthContext";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {useQuery} from "@tanstack/react-query";
import {fetchCurrentSpotifyUser} from "../query/fetchUser";
import {BadgeAlert, VerifiedIcon} from "lucide-react-native";

function ProfileMenu() {

    const {Logout, currentUser,VerifyEmail} = useAuth();

    const {data} = useQuery(fetchCurrentSpotifyUser());

    const sheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ["36%"], []);

    const handleSnapPress = () => {
        sheetRef.current?.snapToIndex(0);
    };

    return (
        <>
            <View
                style={{
                    display: "flex",
                    zIndex: -1,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{height: 35, width: 35, alignItems: "center"}}></View>

                <View>
                    <Text style={{fontFamily: "PlusJakartaSans-Bold", color: "white"}}>
                        Music Player
                    </Text>
                </View>

                <TouchableOpacity onPress={handleSnapPress}>

                    {data?.data?.images[0]?.url ?
                    <Image
                        src={data?.data?.images[0]?.url}
                        style={{
                            height: 35,
                            width: 35,
                            backgroundColor: "#191919",
                            borderRadius: 100,
                            alignItems: "center",
                        }}
                    /> : <View  style={{
                            height: 35,
                            width: 35,

                            backgroundColor: "#6366F1",
                            borderRadius: 100,
                            justifyContent:"center",
                            alignItems: "center",
                        }}>
                            <Text style={{fontSize:17,lineHeight:20,color:"white",fontFamily:"PlusJakartaSans-Bold"}}>{currentUser?.userName.charAt(0)}</Text>
                        </View>}
                </TouchableOpacity>
            </View>

            <BottomSheet
                index={-1}
                ref={sheetRef}
                enablePanDownToClose={true}
                handleIndicatorStyle={{backgroundColor: "#fff"}}
                backgroundStyle={{
                    backgroundColor: "#292929",
                    borderColor: "white",
                    borderWidth: 0.3,
                }}
                style={{backgroundColor: "#212121"}}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
            >
                <BottomSheetView
                    style={{flex: 1, zIndex: 9999, paddingHorizontal: 20, gap: 10}}
                >
                    <View style={{flexDirection: "row", gap: 20}}>
                        <View style={style.avatarContainer}>

                            {data?.data?.images[0]?.url ?
                            <Image src={data?.data?.images[0]?.url} style={{flex: 1}}/>


                          :  <View  style={{

                                flex:1,
                                    backgroundColor: "#6366F1",
                                 borderRadius: 100,
                                justifyContent:"center",
                                alignItems: "center",
                            }}>
                                <Text style={{fontSize:50,lineHeight:50,color:"white",fontFamily:"PlusJakartaSans-Bold"}}>{currentUser?.userName.charAt(0)}</Text>
                            </View>
                            }
                        </View>
                        <View style={{justifyContent: "flex-start", alignItems: "flex-start"}}>
                            <Text style={style.name}>{currentUser?.userName}</Text>
                            <Text style={style.email}>{currentUser?.email}</Text>

                            {currentUser?.emailConfirmed ?
                                <TouchableOpacity style={[style.badge, {borderColor: "#0e6"}]}>
                                    <VerifiedIcon size={18} color={"#0e6"}/>
                                    <Text style={[style.badgeText, {color: "#0e6"}]}>Verified</Text>
                                </TouchableOpacity>
                                :

                                <TouchableOpacity onPress={VerifyEmail} style={[style.badge, {borderColor: "rgba(251,248,83,0.59)"}]}>
                                    <BadgeAlert size={18} color={"rgba(251,248,83,0.59)"}/>
                                    <Text style={[style.badgeText, {color: "rgba(251,248,83,0.59)"}]}>Verify</Text>
                                </TouchableOpacity>}
                        </View>
                    </View>

                    <View style={{alignItems: "flex-end"}}>
                        <TouchableOpacity onPress={Logout} style={style.logoutBtn}>
                            <Text style={style.logoutBtnText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </>
    );
}

export default ProfileMenu;

const style = StyleSheet.create({
    avatarContainer: {
        width: 100,
        height: 100,
        overflow: "hidden",
        backgroundColor: "#212121",
        borderRadius: 100,
    },
    name: {
        color: "white",
        fontSize: 22,
        fontFamily: "PlusJakartaSans-Bold",
    },
    email: {
        color: "white",
        fontFamily: "PlusJakartaSans-Regular",
    },
    logoutBtn: {
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    logoutBtnText: {
        fontFamily: "PlusJakartaSans-Bold",
        lineHeight: 25,
    },
    badge: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        gap: 3,
        marginTop: 5,
        borderRadius: 100,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    badgeText: {
        fontFamily: "PlusJakartaSans-Regular",
        lineHeight: 19,
    },
});
