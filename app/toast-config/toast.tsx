import {Variant} from "react-native-notificated/lib/typescript/types";
import {Toast} from "../../components/toast";
import {createNotifications, ZoomInDownZoomOutUp} from "react-native-notificated";
import {CheckCircle2} from "lucide-react-native";
import React from "react";

type ToastVariant = {

    queue: Variant<typeof Toast>,
    spotify_info: Variant<typeof Toast>,
    error: Variant<typeof Toast>,
    success: Variant<typeof Toast>,
};
export const {useNotifications, NotificationsProvider} = createNotifications<ToastVariant>({
    isNotch: true,
    duration: 90000,
    variants: {
        queue: {
            component: Toast,
            config: {
                notificationPosition: 'top',
                duration: 5000,
            },
        }, spotify_info: {
            component: Toast,
            config: {
                notificationPosition: 'top',
                duration: 5000,
            },
        },
        error: {
            component: Toast,
            config: {
                notificationPosition: 'top',
                duration: 5000,
            },
        },
        success: {
            component: Toast,
            config: {
                notificationPosition: 'top',
                duration: 5000,
            },
        },
    },
    notificationPosition: 'top',
    animationConfig: ZoomInDownZoomOutUp,
    defaultStylesSettings: {
        darkMode: true,
        successConfig: {

            titleSize: 16,
            titleColor: '#212121',
            descriptionSize: 11,
            descriptionColor: '#212121',
            bgColor: "white",
            borderType: "no-border",
            borderRadius: 10,
            borderWidth: 1,
            leftIconSource: <CheckCircle2 color={"#85e0ba"} size={20} style={{padding: 20}}/>,
            defaultIconType: 'color',

        },
    },
})
