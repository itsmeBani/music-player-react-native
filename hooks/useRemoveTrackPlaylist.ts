// deleteTrackFromPlaylist.ts
import {QueryObserverResult, useMutation} from '@tanstack/react-query';
import axios from 'axios';
import apiClient from "../query/AxiosClientConfig";
import {useNotifications} from "../app/toast-config/toast";

type DeleteTrackPayload = {
    playlistId: string;
    uri: string;
    snapshotId?: string;
    onSuccess:()=>void
};

const deleteTrackFromPlaylist = async ({
                                           playlistId,
                                           uri,
                                           snapshotId,
                                           onSuccess
                                       }: DeleteTrackPayload) => {


    const { notify } = useNotifications();


    if (!playlistId || !uri){
        throw new Error("Something Went Wrong")
    }
    try {
        const res = await apiClient.delete(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                data: {
                    tracks: [
                        {
                            uri,
                        },
                    ],
                    ...(snapshotId && { snapshot_id: snapshotId }),
                },
            }
        );
        if (res.data){
             onSuccess()
            notify('success', {
                params: {
                    variant: "success",
                    description: "Successfully Removed",
                },
                config: {
                    duration: 2000,
                },
            });
        }
    }catch (e : any) {
        if (e.status === 403) {
            throw new Error("Only owner can remove this Track")
        }
        throw e
    }
};

export const useDeleteTrackFromPlaylist = () => {
    const { notify } = useNotifications();

    return useMutation({
        mutationFn: deleteTrackFromPlaylist,
        onError:(error)=>{
            notify('error', {
                params: {
                    variant: "error",
                    description: error.message,
                },
                config: {
                    duration: 2000,
                },
            });
        },

    });
};
