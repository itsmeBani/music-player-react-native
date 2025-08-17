
import {queryOptions} from "@tanstack/react-query";
import axios from "axios";
import apiClient, {API_BASE_URL} from "./AxiosClientConfig";

export const fetchUserPlaylists = () => {
    return queryOptions({
        queryKey: ["playlists"],
        queryFn: () => getAllUserPlaylists(),

    });
};

export const fetchUserLikedSongs = () => {
    return queryOptions({
        queryKey: ["liked-songs"],
        queryFn: () => getLikedSongs(),

    });
};

export const fetchPlayListTrack = (PlaylistID:string) => {
    return queryOptions({
        queryKey: ["playlist-tracks",PlaylistID],
        queryFn: () => getAllPlayListTrack(PlaylistID),

    });
};

export const fetchCoverPlaylistImage = (
    playlistID: string
) => {
    return queryOptions({
        queryKey: ["playlist-cover-image", playlistID],
        queryFn: () => getCoverImage(playlistID),
        enabled: !!playlistID,
    });
};

const getAllUserPlaylists = async () => {


     try {
         const response = await apiClient.get(`${API_BASE_URL}/me/playlists`);


         return response.data;
     }catch (e){
         console.log(e)

     }

};



const getLikedSongs=async ()=>{

    const response = await  axios.get(
        `${API_BASE_URL}/me/tracks?offset=0`,
        {
            params: {
                limit: 50,
            },
        }
    );


    return response.data
}




const getAllPlayListTrack = async (PlaylistID:string) => {


    try {
        const response = await apiClient.get(`${API_BASE_URL}/playlists/${PlaylistID}/tracks`);


        return response.data;
    }catch (e){
        console.log(e)
        return {error:"null"}
    }

};

const getCoverImage = async (playlistID: string) => {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/playlists/${playlistID}/images`);


        return response.data;
    } catch (e) {
        console.log(e);
        return { error: "Failed to fetch cover image" };
    }
};
