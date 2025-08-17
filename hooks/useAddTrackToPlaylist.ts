import { useMutation } from '@tanstack/react-query';
import apiClient from "../query/AxiosClientConfig";
import { useNotifications } from "../app/toast-config/toast";
import axios from "axios";

type AddTracksPayload = {
    playlistId: string | undefined;
    uris: string[];
    position?: number;
    onSuccess:()=>void
};


async function isTrackInPlaylist(playlistId: string, trackUri: string) {
    let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    while (nextUrl) {
        const res = await apiClient.get(nextUrl);
        
        const exists = res.data.items.some(
            (item: any) => item.track?.uri === trackUri
        );

        if (exists) return true;
        
        nextUrl = res.data.next;
    }

    return false;
}


const addTrackToPlaylist = async ({
                                       playlistId,
                                       uris,
                                       position,
                                      onSuccess,
                                   }: AddTracksPayload) => {
    const { notify } = useNotifications();

    if (!uris || !playlistId) {
      throw new Error("Something Went Wrong");
   }

    const trackExists = await isTrackInPlaylist(playlistId, uris[0]);


    if (trackExists) {
        onSuccess()
        return notify('success', {
            params: {
                variant: "success",
                description: "Tracks is Already in the playlist",
            },
            config: {
                duration: 2000,
            },

        });

    }
    try {
        const response = await apiClient.post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                uris,
                position,
            }
        );
        if (response.data){
            notify('success', {
                params: {
                    variant: "success",
                    description: "Tracks added to playlist",
                },
                config: {
                    duration: 2000,
                },
            });
        }
    } catch (e) {
        throw e;
    }
};

export const useAddTrackToPlaylist = () => {
    const { notify } = useNotifications();

    return useMutation({
        mutationFn: addTrackToPlaylist,

        onError: () => {
            notify('error', {
                params: {
                    variant: "error",
                    description: "Failed to add tracks to playlist",
                },
                config: {
                    duration: 2000,
                },
            });
        },
    });
};
