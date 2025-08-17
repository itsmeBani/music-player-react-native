import {queryOptions} from "@tanstack/react-query";

import apiClient, {API_BASE_URL} from "./AxiosClientConfig";

export const fetchCurrentSpotifyUser= ()=>{
  return queryOptions({
      queryKey:["user"],
      queryFn:()=>getCurrentSpotifyUser(),

  })
}


const getCurrentSpotifyUser=async () => {
    return apiClient.get(
        `${API_BASE_URL}/me`, {
            method: 'GET',
        }
    )
};






