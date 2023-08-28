"use client";

import {Inter} from 'next/font/google';
import styles from './app.module.scss';
import 'bootstrap/dist/css/bootstrap.css';
import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import Navbar from '../components/navigation-bar/Nav';
import {useRouter, usePathname} from "next/navigation";
import {useTheme} from "next-themes";
import {Providers} from "./providers";
import './global.scss';
import {getUser} from "../middleware/Authenticator";

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'Messenger',
    description: '',
};


export default function RootLayout({children, params}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatarChanged, setAvatarChanged] = useState(false)
    const [updateNotification, setUpdateNotification] = useState(false)
    const {theme, setTheme} = useTheme();


    const socket = useRef(io("wss://localhost:9001", {secure: true}));
    const router = useRouter();

    const onAvatarUpdate = () => {
        setAvatarChanged(!avatarChanged);
    }

    useEffect(() => {
        socket.current.on("receiveNotification", (data) => {
            console.log('we receive Notification');
            params.updateNotification = updateNotification;
            setUpdateNotification(!updateNotification);
        })
    })

    params.updateNotification = updateNotification;

    const {user, isLoading} = getUser();
    if (user) {
        socket.current.emit("connectUser", user.user_id);
    }
    const pathname = usePathname();
    return (
        <html lang="en" suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true} className={styles["body-structure"]}>
        <Providers>
            {pathname !== '/login' && pathname !== '/register' && <Navbar user={user} avatarChanged={avatarChanged} loading={isLoading} theme={theme}/>}
            {children}
        </Providers>
        </body>
        </html>
    );
}


