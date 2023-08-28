"use client";

import {useEffect, useState} from "react";
import {Alert, Avatar, AvatarGroup, Snackbar} from "@mui/material";
import styles from './profile.module.scss';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckIcon from '@mui/icons-material/Check';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PostContainer from "/components/post/PostContainer";
import CropModal from "/components/cropmodal.js";
import "/middleware/CropImage";
import {ref, uploadString, getDownloadURL} from 'firebase/storage';
import {updateUserCover, verifySelfProfile, getUser} from "../../middleware/Authenticator"
import {storage} from "/middleware/firebase"
import {useRouter, usePathname, redirect} from 'next/navigation';
import Loading from "../loading";
import Link from "next/link";


function App(props) {

    const {user, isLoading, error} = getUser();


    const navigate = useRouter();
    const location = usePathname();
    const FRIEND_VIEW_LIMIT = 6;

    const [userData, setUserData] = useState({})
    const [friendData, setFriendData] = useState([]);
    const [selfProfile, setSelfProfile] = useState(false);
    const [isFriends, setIsFriends] = useState(false);
    const [friendCount, setFriendCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [coverPhoto, setCoverPhoto] = useState('https://firebasestorage.googleapis.com/v0/b/login-authenticator-c5345.appspot.com/o/sunset.jpg?alt=media&token=0fb63ce1-6246-4561-b273-8756238e8f21');
    const [update, setUpdate] = useState(false);
    const [cropDimension, setCropDimension] = useState({});
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [severity, setSeverity] = useState(null);

    const handleShow = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const closeToastComponent = () => setOpenToast(false);
    const openToastComponent = () => setOpenToast(true);


    useEffect(() => {
        const getUser = (pathname) => {
            fetch(`https://localhost:8000/profile/${pathname}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            }).then((response) => {
                return response.json();
            }).then((resObject) => {
                console.log(resObject)
                if (resObject !== undefined) {
                    setUserData(resObject.user_metadata);
                    setFriendData(resObject.friend_data.friends);
                    setFriendCount(resObject.friend_data.count);
                    setSelfProfile(resObject.self_profile);
                    setIsFriends(resObject.is_friends);
                    setCoverPhoto(resObject.user_metadata.cover_photo ? resObject.user_metadata.cover_photo : coverPhoto);
                }
            }).catch(err => {
                console.log(err)
            });
        }
        getUser(location.split(('/'))[1]);
    }, [location, update])

    const handleUpload = (e) => {
        if (e.target.files[0]) {
            const uncroppedURL = URL.createObjectURL(e.target.files[0]);
            setCoverPhoto(uncroppedURL)
            e.target.value = null;
            handleShow();
        }
    }
    const receieveCroppedImage = async () => {
        const croppedImage = await getCroppedImg(coverPhoto, cropDimension);
        const imageRef = ref(storage, `${userData.id}/cover_photo.jpg`)
        uploadString(imageRef, croppedImage, 'data_url', {
            contentType: 'image/jpeg'
        }).then(() => {
            getDownloadURL(imageRef).then((url) => {
                updateUserCover(url)
                setUpdate(!update)
                setSeverity("success")
                setToastMessage('Cover Photo Changed')
                closeToastComponent()
                openToastComponent()
            })
        })
            .catch((error) => {
                setToastMessage(error.message)
                setSeverity('error')
            })
    }

    const receiveCroppedDimension = (crop) => {
        setCropDimension(crop);
    }
    const chooseImage = () => {
        document.getElementById("upload-cover").click()
    }

    if (isLoading) {
        return (<Loading/>)
    }
    if (!isLoading && (!user || error)) {
        redirect('/login')
    } else {

        return (
            <div className={styles["profile-container"]}>
                {/* Cover Photo */}
                <div>
                    <img
                        src={coverPhoto}
                        alt="cover-photo" className={styles["cover-image"]}/>
                    <input type="file" name="upload-cover" accept="image/*" id="upload-cover"
                           onChange={(e) => {
                               handleUpload(e)
                           }} hidden/>
                    <button className={styles["cover-photo-button"]} onClick={(e) => {
                        chooseImage(e)
                    }}>
                        <CameraAltIcon/>
                    </button>
                </div>
                <div className={styles["profile-details"]}>
                    <div className={styles["profile-details-left"]}>
                        <div className={styles["profile-detail-row"]}>
                            <div className="me-3">
                                <Avatar
                                    src={userData?.user_metadata?.avatar}
                                    className={"avatar-icon-medium"}
                                    imgProps={{"className": "avatar-square-img avatar-profile-outline"}}
                                    variant="square"
                                />
                            </div>
                            <div className="text-capitalize">
                                <h3>{userData?.first_name} {userData?.last_name}</h3>
                                <p>{friendData?.count} Friends {!selfProfile ? '-- 20 Mutual' : ''} </p>
                                <AvatarGroup max={4}>
                                    <Avatar alt="Travis Howard" src=""/>
                                    <Avatar alt="Cindy Baker" src=""/>
                                    <Avatar alt="Agnes Walker" src=""/>
                                    <Avatar alt="Trevor Henderson" src=""/>
                                </AvatarGroup>
                            </div>
                        </div>
                    </div>
                    <div className={styles["profile-details-right"]}>
                        {selfProfile ? <></> : (isFriends ?
                            <button type="button"><CheckIcon/>Friends <ArrowDropDownIcon/>
                            </button> : (
                                <div>
                                    <button type="button"><PersonAddIcon/>Add Friend
                                    </button>
                                    <button type="button"><MessageIcon/>Message
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={styles["profile-info"]}>
                    <div className={styles["info-col"]}>
                        <div className={styles["profile-intro"]}>
                            <h3>Biography</h3>
                            <p> {userData?.biography}</p>
                        </div>
                        <div className={styles["profile-intro"]}>
                            <div className={styles["title"]}>
                                <h3>Friends</h3>
                                <a href=""> All Friends </a>
                            </div>
                            <div className={styles["friend-box"]}>
                                {
                                    friendData?.map(function (item, i) {
                                        if (i < FRIEND_VIEW_LIMIT) {
                                            return (
                                                <Link
                                                    className={`text-capitalize d-flex text-center justify-content-center ${styles["friend-container"]} flex-column align-items-center me-2`}
                                                    href={`/${item.um_username}`}
                                                    scroll={false}
                                                >
                                                    <Avatar
                                                        src={item.um_avatar}
                                                        className={"avatar-icon-medium avatar-icon-hover"}
                                                        imgProps={{"class": "avatar-square-img"}}
                                                        variant="square"
                                                    />
                                                    {item.u_first_name + " " + item.u_last_name}
                                                </Link>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles["post-col"]}>
                        <PostContainer/>
                    </div>
                </div>
                <CropModal image={coverPhoto} openModal={openModal}
                           handleClose={handleClose} onSubmit={receieveCroppedImage}
                           onCropComplete={receiveCroppedDimension} ratio={5.6}/>
                <Snackbar
                    open={openToast}
                    autoHideDuration={3000}
                    onClose={closeToastComponent}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <Alert onClose={closeToastComponent} severity={severity} sx={{width: '100%'}}>
                        {toastMessage}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default App;