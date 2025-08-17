import {QueryClient, useMutation} from '@tanstack/react-query';
import apiClient from '../query/AxiosClientConfig';
import { useNotifications } from '../app/toast-config/toast';


type PlaySpotifyTrackInput = {
    contextUri: string | undefined;
    progress_ms: number;
};


const getActiveSpotifyDevice = async (): Promise<string | null> => {
    try {
        const response = await apiClient.get('https://api.spotify.com/v1/me/player/devices');
        const devices = response.data.devices;
        const activeDevice = devices.find((device: any) => device.is_active);
        return activeDevice ? activeDevice.id : (devices[0]?.id || null);
    } catch (error) {
        console.error('Error fetching Spotify devices:', error);
        return null;
    }
};

export const useSpotifyPlayer = ({getPlayerState}: { getPlayerState: () => Promise<void> }) => {
    const queryClient = new QueryClient()
    const {notify} = useNotifications()
    const Play = useMutation<void, Error, PlaySpotifyTrackInput>({
        mutationFn: async ({contextUri, progress_ms}) => {

            if (!contextUri) return
            const deviceId = await getActiveSpotifyDevice();
            if (!deviceId) throw new Error('No active Spotify device found.');
            await apiClient.put(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {
                    uris: [contextUri],
                    position_ms: progress_ms,
                }
            );
        },
        onMutate: async () => await queryClient.cancelQueries({queryKey: ["current-track"]}),

        onSuccess: () => getPlayerState(),
        onError: (err) => {
            console.log('Error playing track:', err)

            notify('spotify_info', {
                params: {
                    variant: "info",
                    description: "Launch Spotify before using this feature"
                },
                config: {
                    duration: 5000,
                },
            })
        },
    });

    const Pause = useMutation<void, Error>({
        mutationFn: async () => {
            const deviceId = await getActiveSpotifyDevice();
            if (!deviceId) throw new Error('No active Spotify device found.');
            await apiClient.put(
                `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`
            );
        },
        onSuccess: () => getPlayerState(),
        onError: (err) => console.error('Error pausing track:', err),
    });

    const Next = useMutation<void, Error>({
        mutationFn: async () => {
            const deviceId = await getActiveSpotifyDevice();
            if (!deviceId) throw new Error('No active Spotify device found.');
            await apiClient.post(
                `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`
            );
        },
        onSuccess: () => getPlayerState(),
        onError: (err) => console.error('Error skipping to next:', err),
    });

    const Previous = useMutation<void, Error>({
        mutationFn: async () => {
            const deviceId = await getActiveSpotifyDevice();
            if (!deviceId) throw new Error('No active Spotify device found.');
            await apiClient.post(
                `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`
            );
        },
        onSuccess: () => getPlayerState(),
        onError: (err) => console.error('Error going to previous:', err),
    });

    return {Play, Pause, Next, Previous};
};
