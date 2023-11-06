"use client";

import {Avatar, Fab, TextareaAutosize, Tooltip} from "@mui/material";
import styles from '../messages.module.scss';
import InfoIcon from "@mui/icons-material/Info";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import BurstModeOutlinedIcon from "@mui/icons-material/BurstModeOutlined";
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import React, {useEffect, useRef, useState} from "react";
import {io} from 'socket.io-client';
import {getMessages, sendMessage} from "/middleware/operator";
import {useRouter, usePathname} from "next/navigation";
import {getUser} from "../../../middleware/Authenticator";
import Loading from "../../loading";
import Image from "next/image";
import Link from "next/link";


export default function Chat() {

    const {user, isLoading, isError} = getUser();

    if (isLoading) {
        return <Loading/>
    } else if (!user || isError) {
        useRouter().push('/login');
    } else {

        const [loading, setLoading] = useState(true);
        const [toggleEmoji, setToggleEmoji] = useState(false);
        const [previousMessages, setPreviousMessages] = useState([]);
        const [message, setMessage] = useState('');
        const [selfId, setSelfId] = useState('');
        const [chatroom, setChatroom] = useState('');
        const [chatroomUsers, setChatroomUsers] = useState('');
        const [chatroomId, setChatroomId] = useState('');
        const [messageLimit, setMessageLimit] = useState(1);
        const [initialScrollHeight, setInitialScrollHeight] = useState(0);
        const [isMaxMessages, setIsMaxMessages] = useState(false);
        const [update, setUpdate] = useState(false);
        const [messageSent, setMessageSent] = useState(false);
        const [avatar, setAvatar] = useState('');
        const [chatName, setChatName] = useState('');
        const [images, setImages] = useState([]);

        const [textHasChanged, setTextHasChanged] = useState(false)
        const location = usePathname().split('/');
        const chatId = location[location.length - 1];
        const navigate = useRouter();


        const messageRef = useRef(null);
        const socket = useRef(io("wss://localhost:9001", {secure: true}));

        const renderImages = () => {
            return images.map((item, i) => {
                return (
                    <div>
                        <Image src={item} className={styles["textarea-input-image"]} width={48} height={48} alt={item}/>
                        <RemoveCircleRoundedIcon className={styles["image-removal-button"]}/>
                    </div>
                )
            })
        }

        /* on initial rendering, change scroll position */
        const scrollToPosition = () => {
            if (messageLimit === 1) {
                const container = messageRef.current;
                setInitialScrollHeight(container.scrollHeight);
                container.scrollTop = container.scrollHeight;
            } else {
                const container = messageRef.current;
                if (container.scrollHeight !== initialScrollHeight) {
                    setScrollHeight(container.scrollHeight - initialScrollHeight);
                    setInitialScrollHeight(container.scrollHeight);
                    container.scrollTop = (container.scrollHeight - initialScrollHeight)
                }
            }
        }

        const chooseImage = (e) => {
            document.getElementById("upload-picture").click()
        }

        const handleUpload = (e) => {
            if (e.target.files[0]) {
                const image = URL.createObjectURL(e.target.files[0]);
                setImages([...images, image]);
                e.target.value = null;
            }
        }
        useEffect(() => {
            if (chatroomId !== '') {
                const connectionQuery = {
                    chatroomId: chatroomId,
                    userId: user.user_id
                }
                socket.current.emit('addUser', connectionQuery);
            }
        }, [user, chatroomId])

        useEffect(() => {
            socket.current.on("getMessage", () => {
                setUpdate(!update)
            })
        })

        useEffect(() => {
            const container = messageRef.current;
            container.scrollTop = container.scrollHeight;
        }, [messageSent])

        const handleUpdateScrollMessage = (event) => {
            if (event.currentTarget.scrollTop <= 0 && !isMaxMessages) {
                const container = messageRef.current;
                setInitialScrollHeight(container.scrollHeight);
                setMessageLimit(messageLimit + 1);
            }
        }

        useEffect(() => {
            setMessage('');
            setImages([]);
            getMessages(chatId, messageLimit).then((response) => {
                if (response.messages.length === previousMessages.length) {
                    setIsMaxMessages(true);
                }
                setSelfId(user.user_id);
                setPreviousMessages(response.messages)
                setChatroom(response.chat_metadata)
                setChatroomUsers(response.chat_metadata.users)
                if (response.chat_metadata.chat_type === 'private') {
                    setChatroomId(response.chat_metadata.chat_id)
                    setAvatar(response.private_metadata.avatar);
                    setChatName(response.private_metadata.first_name + ' ' + response.private_metadata.last_name)
                } else {
                    setChatroomId(response.chat_metadata.chat_id);
                    setAvatar(response.chat_metadata.chat_photo);
                    setChatName(response.chat_metadata.chat_name);
                }
                setLoading(false);
            })
            const input = document.querySelector("textarea")
            input.focus()
        }, [chatId, update, messageLimit])

        useEffect(() => {
            scrollToPosition()
        }, [previousMessages])

        const handleTextChange = (emoji = null, e) => {
            if (e.target.value || emoji) {
                setTextHasChanged(true)
            } else {
                setTextHasChanged(false)
            }
            if (!emoji) {
                setMessage(e.target.value)
            } else {
                const input = document.getElementById('message-input')
                const text = input.value;
                const cursor_position = input.selectionStart;
                const finalMessage = text.substring(0, cursor_position) + emoji.native + text.substring(cursor_position, text.length);
                setMessage(finalMessage)
                input.focus();
                input.selectionStart = cursor_position + 1;
            }
        }

        const submitMessage = async (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                setMessage(message + '\r\n')
            } else if (e.key === 'Enter' && (message.replace(/\s/g, '').length > 0 || images.length > 0)) {
                e.preventDefault()
                const messageData = {
                    chat: chatroom,
                    text: message,
                    images: images
                }
                try {
                    await sendMessage(messageData)
                    const emitMessage = {
                        chatroomId: chatroomId,
                        self: selfId,
                        text: message,
                        images: images,
                        users: chatroomUsers,
                    }
                    socket.current.emit("sendMessage", emitMessage)
                    setMessage('')
                    e.target.value = '';
                    const message_copy = {
                        chatChatId: chatroomId,
                        created_at: new Date(),
                        images: images ?? [],
                        message: message,
                        userUserId: selfId,
                        seen: false,
                    }
                    setMessageSent(!messageSent)
                    setPreviousMessages([...previousMessages, message_copy]);
                } catch (err) {
                    console.log(err)
                }
            }
        }

        const getTimeDifference = (time1, time2) => {
            let prev = new Date(time1);
            let curr = new Date(time2);
            return prev.valueOf() - curr.valueOf() > 600000;
        }

        const formatTimeStamp = (timestamp) => {
            return new Date(timestamp).toLocaleString("en-US", {timeZone: "America/Los_Angeles"}).replace(/:\d\d /, ' ')
        }

        const formatText = () => {
            let stack = [];
            let previousMessage = null;
            if (previousMessages.length > 0) {
                previousMessages.map((item, i) => {
                    if (previousMessage == null) {
                        stack.push(
                            <span key={item.created_at}>{formatTimeStamp(item.created_at)}</span>
                        )
                    } else if (getTimeDifference(item.created_at, previousMessage.created_at)) {
                        stack.push(
                            <span key={item.created_at}>{formatTimeStamp(item.created_at)}</span>)
                    }
                    if (selfId === item.userUserId) {
                        previousMessage = item
                        stack.push(
                            <Tooltip title={formatTimeStamp(item.created_at)} placement="left" key={item.message_id}
                                     followCursor={true}
                                     enterDelay={600}
                            >
                                <div className={styles["chat-bubble-self"]} key={item.created_at}>
                                    {item.message}
                                </div>
                            </Tooltip>
                        )
                    } else {
                        previousMessage = item
                        stack.push(
                            <div className={styles["chat-bubble-other-container"]} key={item.message_id}>
                                <div className={styles["chat-bubble-other-avatar"]}>
                                    <Link href={`/${item.username}`}>
                                        <Avatar
                                            src={item.avatar}
                                            className={"avatar-icon-extra-small"}
                                            imgProps={{"className": "avatar-square-img"}}
                                            variant="round"
                                        />
                                    </Link>
                                </div>
                                <Tooltip title={formatTimeStamp(item.created_at)} placement="right" followCursor={true}
                                         enterDelay={700}
                                         enterDelay={600}
                                >
                                    <div className={styles["chat-bubble-other"]}>
                                        {item.message}
                                    </div>
                                </Tooltip>
                            </div>
                        )
                    }
                })
                return stack;
            } else if (!loading) {
                return (<div className={"justify-content-center p-2 text-center"}> Start the Conversation! </div>)
            }
        }

        return (
            <div className={styles["group-chat-container"]}>
                <div className={styles["user-detail-container"]}>
                    <Avatar
                        src={avatar}
                        className={"avatar-icon-small"}
                        variant="round"
                    />
                    <span>
                        {chatName}
                    </span>
                    <InfoIcon id="info-icon" fontSize='medium' className={"ms-auto me-3"}/>
                </div>
                <div className={styles["chat-container"]} ref={messageRef} onScroll={(e) => {
                    handleUpdateScrollMessage(e)
                }}>
                    {formatText()}
                </div>
                <div className={styles["text-input-container"]}>
                    <input type="file" name="upload-picture" accept="image/*" id="upload-picture"
                           onChange={(e) => {
                               handleUpload(e)
                           }} hidden/>
                    <BurstModeOutlinedIcon onClick={(e) => {
                        chooseImage(e)
                    }}/>
                    {toggleEmoji ? <Picker data={data} onEmojiSelect={handleTextChange}/> : <></>}
                    <EmojiEmotionsOutlinedIcon className={styles["textarea-emoji-button"]} onClick={() => {
                        setToggleEmoji(!toggleEmoji)
                    }}/>
                    <div className={styles["textarea-container"]}>
                        {images.length > 0 ? (
                                <div className={styles["textarea-image-container"]}>
                                    {renderImages()}
                                </div>
                            ) :
                            <></>
                        }
                        <TextareaAutosize maxRows={3} placeholder='Aa' className={styles["textarea-input-container"]}
                                          value={message} id="message-input"
                                          onChange={(e) => {
                                              handleTextChange(null, e)
                                          }} onKeyDown={(e) => {
                            submitMessage(e)
                        }}/>
                    </div>
                </div>
            </div>
        );
    }
}
