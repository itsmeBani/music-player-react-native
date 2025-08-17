import { useMutation } from '@tanstack/react-query';
import apiClient, {API_BASE_URL} from "../query/AxiosClientConfig";
import { useNotifications } from '../app/toast-config/toast';



const AddQueueTrack = async (uri: string) => {
 try {
     const response = await apiClient.post(`${API_BASE_URL}/me/player/queue?uri=${uri}`);
     console.log(response.data)
     return response.data;
 }catch (e) {
     console.log(e)
     throw e
 }
};

export const useAddQueueTrack = () => {
    const { notify } = useNotifications()

    return useMutation({
        mutationFn:async (uri: string | undefined) => {
            if (!uri) return
          await   AddQueueTrack(uri)
        },
        onSuccess:()=> {

            notify('queue', {
                params: {
                    variant:"success",
                    description:"Added to Queue"},
                config: {
                    duration: 2000,
                },
            })
        },
        onError:(error)=> {

            notify('error', {
                params: {
                    variant:"error",
                    description:"Something Went Wrong"},
                config: {
                    duration: 2000,
                },
            })
        }

    });
};
