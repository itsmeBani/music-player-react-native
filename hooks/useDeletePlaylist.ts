import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import {useNotifications} from "../app/toast-config/toast";
import apiClient from "../query/AxiosClientConfig";

type removePlayListProp={
    playlistId: string | null,
    onSuccessRemove:()=>void
}
const removePlaylist=async ({playlistId,onSuccessRemove}:removePlayListProp)=> {
    const { notify } = useNotifications();

    if (!playlistId) {
        throw new Error("Something Went Wrong");
    }

    try {
        const response=await apiClient.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`);
        //if no error the response is empty
        if (!response.data){
            onSuccessRemove()
            notify('success', {
                params: {
                    variant: "success",
                    description: "Successfully Remove",
                },
                config: {
                    duration: 1000,
                },
            });
        }
    }catch (e){
        throw e
    }
}


export const useRemovePlaylist = () => {
    const { notify } = useNotifications();

    return useMutation({
        mutationFn:removePlaylist,
        onError: (error: any) => {
            notify('error', {
                params: {
                    variant: "error",
                    description: error,
                },
                config: {
                    duration: 2000,
                },
            });
            },
    });
};

