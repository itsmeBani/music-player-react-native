import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, View, StyleSheet, TouchableOpacity, TextInput,Keyboard } from "react-native";
import { ListMusicIcon, PlusIcon } from "lucide-react-native";
import React, { useMemo, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import TitleIcon from "../TitleIcon";
import { useCreatePlaylist } from "../../hooks/useCreatePlaylist";
import {QueryObserverResult, RefetchOptions, useQuery} from "@tanstack/react-query";
import { fetchCurrentSpotifyUser } from "../../query/fetchUser";
import { useNotifications } from "../../app/toast-config/toast";
import * as z from "zod";

const playlistSchema = z.object({
    name: z.string().min(1, "Playlist name is required"),

});

type PlaylistFormData = z.infer<typeof playlistSchema>;

function CreatePlaylist({onSuccess} :{onSuccess : (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>}) {
    const { notify } = useNotifications();
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);

    const { data: spotifyUser } = useQuery(fetchCurrentSpotifyUser());
    const createPlaylist = useCreatePlaylist();

    const { control, handleSubmit, reset } = useForm<PlaylistFormData>({
        resolver: zodResolver(playlistSchema),
        defaultValues: {
            name: "",
        }
    });

    const handleSnapPress = () => {
        sheetRef.current?.snapToIndex(0);
    };

    const onSubmit = async (data: PlaylistFormData) => {
        if (!spotifyUser?.data?.id) {
            notify("error", {
                params: {
                    variant: "error",
                    description: "Failed to Create Playlist"
                },
                config: { duration: 2000 }
            });
            return;
        }

        createPlaylist.mutate({
            userId: spotifyUser?.data?.id,
            name: data.name,
            description:"",
            public: true,

        });

        reset();
        sheetRef.current?.close();
        Keyboard.dismiss();
        setTimeout(async ()=>{
            await onSuccess()
        },200)
    };

    return (
        <>
            <View style={{
                display: "flex",
                zIndex: -1,
                paddingHorizontal: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <TitleIcon icon={ListMusicIcon} name={"My Library"} />
                <TouchableOpacity onPress={handleSnapPress}
                                  style={{
                                      flexDirection: "row",
                                      paddingRight: 15,
                                      alignItems: "center",
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                      backgroundColor: "white",
                                      borderRadius: 100,
                                      marginRight: 15
                                  }}>
                    <PlusIcon size={20} strokeWidth={2} />
                    <Text style={{
                        fontFamily: "PlusJakartaSans-Bold",
                        fontSize: 13,
                        lineHeight: 20,
                        elevation: 20
                    }}>Create Playlist</Text>
                </TouchableOpacity>
            </View>

            <BottomSheet
                index={-1}
                ref={sheetRef}
                enablePanDownToClose={true}
                handleIndicatorStyle={{ backgroundColor: "#fff" }}
                backgroundStyle={{ backgroundColor: "#292929",borderColor:"white",borderWidth:0.4}}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
            >
                <BottomSheetView style={{ flex: 1, zIndex: 9999, paddingHorizontal: 20, gap: 10,paddingTop:40 }}>
                    <Text style={styles.title}>Create a Playlist</Text>
                    <Text style={styles.subtitle}>
                        Give your playlist a name and an optional description to start adding your favorite tracks.
                    </Text>

                    <Text style={styles.label}>Name of the Playlist</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <TextInput
                                    placeholder="playlist "
                                    placeholderTextColor="#aaa"
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </>
                        )}
                    />



                    <TouchableOpacity style={styles.createBtn} onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.createBtnText}>Create</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        </>
    );
}

export default CreatePlaylist;

const styles = StyleSheet.create({
    input: {
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: 10,
        borderRadius: 8,
        fontFamily: "PlusJakartaSans-Regular",
        borderWidth: 1,
        borderColor: "#444"
    },
    errorText: {
        color: "#df6d6d",
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 12,
        marginTop: 2
    },
    createBtn: {
        backgroundColor: "#1DB954",
        padding: 12,
        borderRadius: 8,
        fontFamily: "PlusJakartaSans-Regular",
        alignItems: "center",
        marginTop: 10
    },
    createBtnText: {
        color: "white",
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 16
    },  label: {
        color: '#dfdfdf',
        marginBottom: 4,

        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Medium',
    },    title: {
        fontSize: 30,
        textAlign: 'center',
        color: "white",
        fontFamily: "PlusJakartaSans-Bold"
    },
    subtitle: {
        fontSize: 14,
        paddingBottom: 10,
        color: "white",
        fontFamily: "PlusJakartaSans-Regular",
        textAlign: 'center',
    },
});
