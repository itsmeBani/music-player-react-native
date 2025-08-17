import {QueryClient, useMutation} from '@tanstack/react-query';
import axios from 'axios';
import apiClient from "../query/AxiosClientConfig";
import {useNotifications} from "../app/toast-config/toast";

type CreatePlaylistPayload = {
    userId: string;
    name: string;
    description?: string;
    public?: boolean;

};

const createPlaylist = async ({
                                  userId,
                                  name,
                                  description,

                                  public: isPublic = true,
                              }: CreatePlaylistPayload) => {

  try {
      const response = await apiClient.post(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
              name: name,
              description: description,
              public: true
          },
      );


      return response.data;
  }catch (e) {
      console.log(e)
  }
};

export const useCreatePlaylist = () => {
    const { notify } = useNotifications()

    return useMutation({
        mutationFn: createPlaylist,
        onSuccess:()=>{

            notify('success', {
                params: {
                    variant:"success",
                    description:"Playlist created"},
                config: {
                    duration: 2000,
                },
            })
        }
    });
};
