import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {useSpotifyPlayer} from "../hooks/useSpotifyPlayer";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {fetchCurrentPlayTrack} from "../query/fetchTracks";
import {useAddQueueTrack} from "../hooks/useAddQueueTrack";

interface CurrentlyPlayingObject {
    timestamp: number;
    device: SpotifyApi.UserDevice;
    actions: SpotifyApi.ActionsObject;
    progress_ms: number | null;
    is_playing: boolean;
    item: SpotifyApi.TrackObjectFull;
    context: SpotifyApi.ContextObject | null;
    currently_playing_type: "track";
}

interface MusicPlayerContextType {
    Play: (TrackUri: string) => void
    currentTrackData: UseQueryResult<CurrentlyPlayingObject> | undefined
    Next: () => void
    Previos: () => void
    Resume: () => void
    Pause: () => void
    AddToQueue: (uri:string | undefined) => void
    PlayPlaylist: (PlaylistID:string,offset?:number) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);


export const useMusicPlayer = (): MusicPlayerContextType => {
    const context = useContext(MusicPlayerContext);
    if (!context) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
    return context;
};

export const MusicPlayerProvider = ({children}: { children: ReactNode }) => {

    const currentTrackData: UseQueryResult<CurrentlyPlayingObject> = useQuery(fetchCurrentPlayTrack())


    const getPlayerState=async ()=>{
        await new Promise((res) => setTimeout(res, 300));
        await currentTrackData.refetch()
    }

    const player = useSpotifyPlayer({getPlayerState});
    const queue=useAddQueueTrack()




    const Play = async (TrackUri: string) => {

        player.Play.mutate({
            contextUri: TrackUri,
            progress_ms: 0,


        });

    }

    const PlayPlaylist=(playlistID:string,offset?:number)=>{
        player.PlayPlaylist.mutate({
            contextUri: playlistID,
            progress_ms: 0,
            offset:offset
        });
    }

    const Next =async () => {
        player.Next.mutate();
    }

    const Previos = async () => {
        player.Previous.mutate();
    }

    const Pause = async () => {
        player.Pause.mutate();

    }
    const Resume = async () => {



        player.Play.mutate({
            contextUri: currentTrackData?.data?.item?.uri,
            progress_ms: currentTrackData?.data?.progress_ms ?? 0,
        })


    }


    const AddToQueue=(uri:string | undefined)=>{
     if (!uri) return
        queue.mutate(uri)
    }


    return (
        <MusicPlayerContext.Provider
            value={{
                Play,
                currentTrackData,
                Next,
                Previos,
                Pause,
                Resume,
                AddToQueue,
                PlayPlaylist


        }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};
