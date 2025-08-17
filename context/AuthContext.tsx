import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useAuthRequest, makeRedirectUri, AuthRequestPromptOptions, AuthSessionResult} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {z} from "zod";
import {refreshAccessToken} from "../query/AxiosClientConfig";
import axios from "axios";
import {useNotifications} from "../app/toast-config/toast"
import {REDIRECT_URI, SPOTIFY_CLIENT_ID,BACKEND_AUTH_BASE_URL, SPOTIFY_CLIENT_SECRET, SPOTIFY_DISCOVERY} from "../constant";

WebBrowser.maybeCompleteAuthSession();

const registerSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

interface User {
    userName: string;
    email: string;
    emailConfirmed: boolean;
    roles: string[];
    spotifyId: string;
    id:string
}

interface AuthInterface {
    promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
    token: string | null | undefined;
    registerSchema: typeof registerSchema;
    loginSchema: typeof loginSchema;
    RegisterUser: (data: RegisterFormData) => Promise<void>;
    loadingRegister: boolean;
    loadingLogin: boolean;
    currentUser: User | null | undefined
    VerifyEmail:()=>void,
    LoginWithEmailPassword: (data: LoginFormData) => Promise<void>;
    Logout: () => Promise<void>;
}


const AuthContext = createContext<AuthInterface | undefined>(undefined);

export default function AuthProvider({children}: { children: ReactNode }) {
    const [token, setToken] = useState<string | null | undefined>(undefined);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
    const {notify} = useNotifications()

    const AUTH_BASE_URL = BACKEND_AUTH_BASE_URL
    const discovery = SPOTIFY_DISCOVERY;
    const [request, response, promptAsync] = useAuthRequest({
        clientId: SPOTIFY_CLIENT_ID,
        usePKCE: false,
        clientSecret:  SPOTIFY_CLIENT_SECRET,
        scopes: [
            "user-read-email",
            "user-library-read",
            "user-read-recently-played",
            "user-top-read",
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-public",
            "playlist-modify-private",
            "user-read-playback-state",
            "user-modify-playback-state",
            "streaming"
        ],

        redirectUri: REDIRECT_URI
    }, discovery);


    const exchangeCodeForToken = async (code: string) => {
        try {
            const body = new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET,
            });

            const tokenResponse = await fetch(discovery.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });
            console.log(response)
            const tokenData = await tokenResponse.json();

            if (tokenData.access_token) {
                const expirationTime = Date.now() + tokenData.expires_in * 1000;

                await AsyncStorage.setItem("access_token", tokenData.access_token);
                await AsyncStorage.setItem("refresh_token", tokenData.refresh_token);
                await AsyncStorage.setItem("expiration_time", expirationTime.toString());

                setToken(tokenData.access_token);
            } else {
                console.error("Failed to obtain access token:", tokenData);
            }
        } catch (e) {
            console.error("Error exchanging code for token:", e);
        }
    };


    const getCurrentUserRole: () => Promise<void> = async () => {
        const user_token = await AsyncStorage.getItem("user_token");

        try {
            const response = await axios.get(`${AUTH_BASE_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${user_token}`,
                },
            });
            console.log("Response:", response.data);
            setCurrentUser(response.data)
        } catch (error) {
            console.error("Error fetching data:", error);
            setCurrentUser(null)
        }

    }

    const getToken: () => void = async () => {
        const accessToken = await AsyncStorage.getItem("access_token");
        const expiration = await AsyncStorage.getItem("expiration_time");

        if (expiration && Date.now() > parseInt(expiration)) {
            console.log("Access token expired. Refreshing...");
            const newAccessToken = await refreshAccessToken();
            setToken(newAccessToken);
        } else {
            setToken(accessToken)
        }
    }


    useEffect(() => {
        if (response?.type === 'success') {
            const {code} = response.params;
            console.log("Authorization code:", code);
            exchangeCodeForToken(code).then();
        } else if (response?.type === 'error') {
            console.error('Authentication failed:', response.params.error_description);
        }
    }, [response]);


    useEffect(() => {
        getToken();
        getCurrentUserRole().then()
    }, [response]);


    const LoginWithEmailPassword = async (data: LoginFormData) => {
        setLoadingLogin(true);


        try {
            const response = await axios.post(`${AUTH_BASE_URL}/api/account/login`,
                {
                    email: data.email,
                    password: data.password,
                }
            )

            if (response.data) {
                await AsyncStorage.setItem("user_token", response.data.token);

                notify('success', {
                    params: {
                        variant: "success",
                        "description": "User successfully authenticated"
                    },
                    config: {
                        duration: 2000,
                    },
                })
                await getCurrentUserRole()
            }


        } catch (e) {
            console.log("error", e)
            notify('error', {
                params: {
                    variant: "error",
                    description: "Invalid username or password. Please try again"
                },
                config: {
                    duration: 2000,
                },
            })
        } finally {
            setLoadingLogin(false)
        }
    };

    const RegisterUser = async (data: RegisterFormData) => {
        setLoadingRegister(true);

        try {
            const response = await axios.post(`${AUTH_BASE_URL}/api/account/register-test`,
                {
                    email: data.email,
                    password: data.password,
                    userName: data.username,
                    spotifyToken: token,
                    ClientUri: `${AUTH_BASE_URL}/confirmEmail`
                }
            )


            if (response.data[0]?.code) {
                notify('error', {
                    params: {
                        variant: "error",
                        description: response?.data[0]?.description
                    },
                    config: {
                        duration: 2000,
                    },
                })
            } else {

                notify('success', {
                    params: {
                        variant: "success",
                        description: "User created"
                    },
                    config: {
                        duration: 2000,
                    },
                })
            }


        } catch (e) {
            console.log("error", e)
            notify('error', {
                params: {
                    variant: "error",
                    description: "Something Went Wrong"
                },
                config: {
                    duration: 2000,
                },
            })
        } finally {
            setLoadingRegister(false)
        }
    };

    const VerifyEmail=async ()=>{
        if (!currentUser?.id) {
            notify('error', {
                params: {
                    variant: "error",
                    description: "Can't Verify Email"
                },
                config: {
                    duration: 2000,
                },
            })
            return
        }
           try {
               const EmailAuthResponse = await axios.post(`${AUTH_BASE_URL}/api/account/SendAuthEmail`,
                   {
                       UserId:currentUser?.id,
                       ClientUri: `${AUTH_BASE_URL}/confirmEmail`

                   }
               )
               notify('success', {
                   params: {
                       variant: "success",
                       description: `Link sent to ${currentUser?.email}`
                   },
                   config: {
                       duration: 2000,
                   },
               })
               console.log(EmailAuthResponse.data)
           }catch (e) {
               console.log(e)
           }
    }

    const Logout = async () => {
        try {
            await AsyncStorage.multiRemove(["access_token", "refresh_token", "expiration_time", "user_token"]);
            setToken(null);
            setCurrentUser(null)
            console.log("Logged out.");
        } catch (e) {
            console.log("Logout error:", e);
        }
    };

    return (
        <AuthContext.Provider value={{
            VerifyEmail,
            currentUser,
            promptAsync,
            token,
            registerSchema,
            loginSchema,
            RegisterUser,
            loadingRegister,
            loadingLogin,
            LoginWithEmailPassword,
            Logout
        }}>
            {children}

        </AuthContext.Provider>
    );
}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside the AuthContextProvider");
    }
    return context;
};
