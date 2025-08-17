

import {queryOptions} from "@tanstack/react-query";
import axios from "axios";
const API_BASE_URL = 'https://api.spotify.com/v1';

type AccessTokenType=string | null | undefined
export const fetchCurrentSpotifyUser= (accessToken: AccessTokenType)=>{
  return queryOptions({
      queryKey:["user"],
      queryFn:()=>getCurrentSpotifyUser(accessToken)
  })
}


const getCurrentSpotifyUser=async (accessToken:AccessTokenType) => {
    return axios.get(
        `${API_BASE_URL}/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            method: 'GET',
        }
    )
};