// apiClient.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = '70dfbbfacbc940c18b0ed206c231efdb';
const CLIENT_SECRET = '595ac8b9fb9d4fddade20acc7c4687d5';

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (!refreshToken) {
            console.warn("No refresh token found.");
            return null;
        }

        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const response = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const data = await response.json();

        if (data.access_token) {
            const newExpiration = Date.now() + data.expires_in * 1000;

            await AsyncStorage.setItem("access_token", data.access_token);
            await AsyncStorage.setItem("expiration_time", newExpiration.toString());

            return data.access_token;
        } else {
            console.error("Failed to refresh access token:", data);
            return null;
        }
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
};

const apiClient = axios.create();

apiClient.interceptors.request.use(async (config) => {
    try {
        let accessToken = await AsyncStorage.getItem('access_token');
        const expiration = await AsyncStorage.getItem('expiration_time');

        const now = Date.now();
        const isExpired = expiration ? now >= parseInt(expiration) : true;

        if (!accessToken || isExpired) {

            console.log('Access token missing or expired. Refreshing...');
            const newToken = await refreshAccessToken();

            if (!newToken) {
                console.warn('Unable to refresh token. Redirecting to login (optional).');
                return Promise.reject(new Error('Unable to refresh token'));
            }

            accessToken = newToken;
            console.log(accessToken)
        }


        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;  
    } catch (error) {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
});

export default apiClient;
export const API_BASE_URL = 'https://api.spotify.com/v1';
