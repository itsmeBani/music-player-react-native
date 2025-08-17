
import {queryOptions} from "@tanstack/react-query";
import apiClient, {API_BASE_URL} from "./AxiosClientConfig";

export const SearchTracks=(query:string)=>{
    return queryOptions({
        queryKey:["search-tracks",query],
        queryFn:()=>SearchTrack(query),
        enabled:!!query
    })
}

export const fetchAllTrackByArtist=(ArtistID:string)=>{
    return queryOptions({
        queryKey:["artist-albums",ArtistID],
        queryFn:()=>getAllTrackByArtist(ArtistID),
        enabled:!!ArtistID
    })
}

export const fetchArtistTopTracks=(ArtistID:string)=>{
    return queryOptions({
        queryKey:["artist-top-tracks",ArtistID],
        queryFn:()=>getArtistTopTracks(ArtistID),
        enabled:!!ArtistID
    })
}

export const fetchAlbumTracks=(AlbumID:string)=>{
    return queryOptions({
        queryKey:["Album-Tracks",AlbumID],
        queryFn:()=>getAlbumTracks(AlbumID),

    })
}

export const fetchCurrentPlayTrack=()=>{
    return queryOptions({
        queryKey:["current-track"],
        queryFn:()=>getCurrentTrack(),

    })
}

export const fetchRecentlyPlayedTrack=()=>{
    return queryOptions({
        queryKey:["recent-played-track"],
        queryFn:()=>getRecentlyPlayedTrack(),

    })
}



const SearchTrack=async (query:string)=>{
    const response=await apiClient.get(`${API_BASE_URL}/search?q=${query}&type=track&include_external=aud`)

    return response.data

}



const getAllTrackByArtist=async (ArtistID:string)=>{
    const response=await apiClient.get(`${API_BASE_URL}/artists/${ArtistID}/albums`)

    return response.data
}


const getArtistTopTracks=async (ArtistID:string)=> {
    const response = await apiClient.get(`${API_BASE_URL}/artists/${ArtistID}/top-tracks`)

    return response.data
}


const getAlbumTracks=async (AlbumID:string)=> {
    const response = await apiClient.get(`${API_BASE_URL}/albums/${AlbumID}`)

    return response.data
}


export const getCurrentTrack=async ()=> {
    const response = await apiClient.get(`${API_BASE_URL}/me/player`)
    console.log(response.data.item?.name)
    return response.data
}

const  getRecentlyPlayedTrack=async ()=>{
    const response = await apiClient.get(`${API_BASE_URL}/me/player/recently-played?limit=6`)
    return response.data
}



