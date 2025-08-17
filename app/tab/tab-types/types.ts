import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import UserPlayListTrack from "../../../components/feature/UserPlayListTrack";

export type RootTabParamList = {
    Register: undefined;
    Login:undefined
    Home:undefined,
    ArtistAlbums:{ ArtistID: string }
    AuthenticatedTabs:undefined
    getStarted:undefined
    AlbumTracks:{ AlbumID: string }
    UserPlayListTrack:{PlaylistID:string}

};

export type ScreenNavigationProp = BottomTabNavigationProp<
    RootTabParamList
>;
export type NavigationProps = {
    navigation: ScreenNavigationProp;

};