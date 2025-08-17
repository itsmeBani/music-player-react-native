

import { queryOptions } from "@tanstack/react-query";
import apiClient, {API_BASE_URL} from "./AxiosClientConfig";



export const TopArtistsQuery = () => {
    return queryOptions({
        queryKey: ["top-artists"],
        queryFn: () => getTopArtists(),
    });
};

export const fetchCurrentArtist = (ArtistID:string) => {
    return queryOptions({
        queryKey: ["current-artists",ArtistID],
        queryFn: () => getCurrentArtist(ArtistID),

    });
};


const getCurrentArtist=async (ArtistID:string)=>{
    const response = await apiClient.get(`${API_BASE_URL}/artists/${ArtistID}`);

    return response.data;
}


export const getTopArtists = async () => {
    const response = await apiClient.get(`${API_BASE_URL}/me/top/artists`);
    return response.data;
};
