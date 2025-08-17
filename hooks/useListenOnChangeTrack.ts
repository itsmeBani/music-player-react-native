import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from "../query/AxiosClientConfig";

interface SpotifyTrack {
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
    duration_ms: number;
    uri: string;
}

interface SpotifyPlayer {
    is_playing: boolean;
    item: SpotifyTrack | null;
    progress_ms: number;
    device: {
        id: string;
        name: string;
        type: string;
        volume_percent: number;
    };
}

interface ServerToClientEvents {
    initial_state: (player: SpotifyPlayer) => void;
    track_change: (player: SpotifyPlayer) => void;
    spotify_connect_error: (error: { message: string; stack?: string }) => void; // Add this event
}

interface ClientToServerEvents {
    initiate: (payload: { accessToken: string }) => void;
}

export default function useRealtimePlayerState() {
    const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [playerState, setPlayerState] = useState<SpotifyPlayer | null>(null);

    useEffect(() => {
        let isMounted = true;

        const connectSocket = async () => {
            // 1. Get token from storage
            let accessToken = await AsyncStorage.getItem('access_token');
            const expiration = await AsyncStorage.getItem('expiration_time');

            const now = Date.now();
            const isExpired = expiration ? now > parseInt(expiration) : true;

            // 2. Refresh token if expired or missing
            if (!accessToken || isExpired) {
                console.log('Access token missing or expired. Refreshing...');
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    console.warn('Unable to refresh access token.');
                    return;
                }
                accessToken = newToken;
            }

            if (!isMounted || !accessToken) return;

            // 3. Connect to socket
            socketRef.current = io('http://192.168.8.33:3002/connect', {
                transports: ['websocket'],
            });

            // 4. Emit initiate with token
            socketRef.current.emit('initiate', { accessToken });

            // 5. Listen for initial state
            socketRef.current.on('initial_state', (player) => {
                setPlayerState(player);
            });

            // 6. Listen for track changes
            socketRef.current.on('track_change', (player) => {
                console.log('Realtime track change:', player);
                setPlayerState(player);
            });

            // 7. Listen for custom Spotify connect errors from server
            socketRef.current.on('spotify_connect_error', (err) => {
                console.error('Spotify socket error received:', err);
            });
        };

        connectSocket().then();

        return () => {
            isMounted = false;
            socketRef.current?.disconnect();
        };
    }, []);

    return { playerState };
}
