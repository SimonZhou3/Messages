"use client";

import styles from './messages.module.scss';
import {Avatar, Tooltip} from "@mui/material";
import "react-textarea-autosize";
import {useRouter, usePathname, redirect} from 'next/navigation';
import {useEffect, useRef, useState, createContext} from "react";
import React from 'react';
import {getChats} from "/middleware/operator";
import AddIcon from '@mui/icons-material/Add';
import FriendModal from './FriendModal';
import {motion} from "framer-motion";
import {getUser} from "../../middleware/Authenticator";
import Loading from "../loading";
import {io} from "socket.io-client";

export default function MessagesLayout({children, params}) {

    const navigate = useRouter();

    const [chat, setChat] = useState([])
    const [search, setSearch] = useState('');
    const [updated, setUpdated] = useState(false);
    const [updateRecent, setUpdateRecent] = useState(false);
    const [show, setShow] = useState(false);
    const socket = useRef(io("wss://localhost:9001", {secure: true}));

    const handleClose = () => {
        setShow(false)
    }
    const handleOpen = () => {
        setShow(true)
    }

    useEffect(() => {
            socket.current.on("updateMessageBar", (data) => {
                setUpdateRecent(!updateRecent);
            })
    })

    useEffect(() => {
        getChats().then((result) => {
            console.log(result)
            setChat(result)
        })
    }, [updateRecent]);

    const handleSearch = (e) => {
        if (e.target.value) {
            setUpdated(true)
        } else {
            setUpdated(false)
        }
        setSearch(e.target.value)
    }

    const timeStampDifference = (date) => {
        let seconds = Math.floor((new Date() - new Date(date).valueOf()) / 1000);

        let interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + "y";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + "m";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + "d";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + "h";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + "m";
        }
        return Math.floor(seconds) + "s";
    }

    const searchByName = (name) => {
        return name.toLowerCase().includes(search.toLowerCase());
    }

    const handleOpenChat = (chat_url) => {
        navigate.push(`/messages/${chat_url}`)
    }

    const {user, isLoading, isError} = getUser();

    if (isLoading) {
        return <Loading/>
    } else if (!user || isError) {
        navigate.push('/login');
    } else {

        if (user) {
            socket.current.emit("connectUser", user.user_id);
        }

        return (
            <motion.div
                className={styles["message-container"]}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}>
                <div className={styles["user-container"]}>
                    <div className="d-flex p-2" id="chat-header">
                        <h3 className="me-auto">
                            CHAT
                        </h3>
                        <Tooltip title="Create Group">
                            <button className={`ms-auto ${styles["chat-add-button"]}`} onClick={handleOpen}>
                                <AddIcon/>
                            </button>
                        </Tooltip>
                    </div>
                    <input type="text" className={`${styles["chat-search-bar"]} align-self-center`}
                           placeholder="Search for User"
                           value={search}
                           onChange={(e) => {
                               handleSearch(e);
                           }}/>

                    {chat?.map((item, i) => {
                        const name = item.chat.chat_type === 'private' ? item.private_metadata.first_name + ' ' + item.private_metadata.last_name : item.chat.chat_name;
                        if (searchByName(name)) {
                            if (item.chat.chat_type === 'private') {
                                return (
                                    <div className={styles["user-information-container"]} key={i} onClick={() => {
                                        handleOpenChat(item.private_metadata.user_id, item.chat.chat_id)
                                    }}>
                                        <Avatar
                                            src={item.private_metadata.avatar}
                                            className={"avatar-icon-message"}
                                            imgProps={{"className": "avatar-circular-img"}}
                                            variant="round"
                                        />
                                        <div className={styles["user-information-text-container"]}>
                                            <h6> {name}  </h6>
                                            {item.recent_message ?
                                                <div className="d-inline-flex w-100">
                                                    <div
                                                        className={styles["recent-message-container"]}>{item.recent_message?.message}</div>
                                                    <div
                                                        className={styles["recent-message-timestamp"]}> ∘ {timeStampDifference(item.recent_message?.created_at)}</div>
                                                </div> :
                                                <></>
                                            }
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div className={styles["user-information-container"]} key={i} onClick={() => {
                                        handleOpenChat(item.chat.chat_id, item.chat.chat_id)
                                    }}>
                                        <Avatar
                                            src={item.chat.chat_photo}
                                            className={"avatar-icon-message"}
                                            imgProps={{"className": "avatar-circular-img  avatar-profile-outline"}}
                                            variant="round"
                                        />
                                        <div className={styles["user-information-text-container"]}>
                                            <h6> {name} </h6>
                                            {item.recent_message ?
                                                <div className="d-inline-flex w-100">
                                                    <div
                                                        className={styles["recent-message-container"]}>{item.recent_message?.message}</div>
                                                    <div
                                                        className={styles["recent-message-timestamp"]}> ∘ {timeStampDifference(item.recent_message?.created_at)}</div>
                                                </div> :
                                                <></>
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        }
                    })}
                </div>

                    {children ? children :
                        <div className={styles["placeholder-text"]}> Select to start a chat </div>}
                    {show && <FriendModal show={show} handleClose={handleClose}/>}
            </motion.div>
        );
    }
}
