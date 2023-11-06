"use client";
import styles from '../settings.module.scss';
import {Tooltip, Avatar, Snackbar, Alert} from "@mui/material";
import {useEffect, useState} from "react";
import CropModal from "../../../components/cropmodal.js";
import "/middleware/CropImage";
import {retrieveUserData, updateUserInformation, getUser} from "../../../middleware/Authenticator";
import {getCroppedImg} from '../../../middleware/CropImage';
import {ref, uploadString, getDownloadURL} from 'firebase/storage';
import {storage} from "/middleware/firebase"
import Loading from "../../loading";
import {redirect} from "next/navigation";

function App(props) {

    const {user, isLoading, error} = getUser();

    const [uncroppedLocalImage, setUncroppedLocalImage] = useState(''); // State where image is about to get cropped
    const [croppedLocalImage, setCroppedLocalImage] = useState('')
    const [imageChanged, setImageChanged] = useState(false)
    const [cropDimension, setCropDimension] = useState({})
    const [enableForm, setEnableForm] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [severity, setSeverity] = useState(null);
    const [buttonActive, setButtonActive] = useState(false)
    const [biographyText, setBiographyText] = useState('')
    const [locationText, setLocationText] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')


    const handleClose = () => setOpenModal(false);
    const handleShow = () => setOpenModal(true);
    const closeToastComponent = () => setOpenToast(false);
    const openToastComponent = () => setOpenToast(true);

    const chooseImage = (e) => {
        document.getElementById("upload-picture").click()
    }

    // This function should locally change the image but not update backend.
    const handleUpload = (e) => {
        if (e.target.files[0]) {
            const uncroppedURL = URL.createObjectURL(e.target.files[0]);
            setUncroppedLocalImage(uncroppedURL);
            // allows input to select same file for cropping
            e.target.value = null;
            handleShow();
        }
    }

    const receiveCroppedDimension = (crop) => {
        setCropDimension(crop);
    }

    const receiveCroppedImage = async () => {
        const croppedImage = await getCroppedImg(uncroppedLocalImage, cropDimension);
        setCroppedLocalImage(croppedImage)
        setImageChanged(true)
        handleButtonActivate(undefined, undefined, true)
    }

    const handleBiographyChange = (e) => {
        if (e.target.value !== null) {
            setBiographyText(e.target.value)
        }
        handleButtonActivate(e.target.value);
    }

    const handleLocationChange = (e) => {
        if (e.target.value !== null) {
            setLocationText(e.target.value)
        }
        handleButtonActivate(undefined, e.target.value);

    }

    const handleButtonActivate = (biography = biographyText, location = locationText, userImageChanged = imageChanged) => {
        if ((user.biography === biography || biography === '') && (user.location === location || location === '') && !userImageChanged) {
            setButtonActive(false)
        } else {
            setButtonActive(true)
        }
    }


    const handleSubmitForm = async (e) => {
        e.preventDefault()
        try {
            if (imageChanged) {
                const imageRef = ref(storage, `${user.user_id}/profile_picture.jpg`)
                uploadString(imageRef, croppedLocalImage, 'data_url', {
                    contentType: 'image/jpeg'
                }).then(() => {
                    getDownloadURL(imageRef).then((url) => {
                        updateUserInformation(url, biographyText, locationText)
                        props.onUpdateAvatar()
                    })
                })
                    .catch((error) => {
                        setToastMessage(error.message)
                        setSeverity('error')
                    })
            } else {
                try {
                    await updateUserInformation(croppedLocalImage, biographyText, locationText)
                } catch (err) {
                    console.log(err)
                }
            }
            setSeverity("success")
            setToastMessage('Account Information Saved')
            closeToastComponent()
            openToastComponent()
        } catch (error) {
            console.log(error)
            setSeverity("error")
            setToastMessage(error.message)
            closeToastComponent()
            openToastComponent()
        }
        setButtonActive(false)
        setEnableForm(false)
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log(user);
                setLocationText(user.user_metadata.location);
                setBiographyText(user.user_metadata.biography);
                setFirstName(user.first_name)
                setLastName(user.last_name)
                user.user_metadata.avatar ? setCroppedLocalImage(user.user_metadata.avatar) : setCroppedLocalImage('')
            } catch (err) {
            }
        }
        fetchUser();
    }, [user])

    if (isLoading) {
        return (<Loading/>)
    }
    if (!isLoading && (!user || error)) {
        redirect('/login')
    }  else {
        return (
            <div className={styles["fade-animation"]} id="account" role="tabpanel">
                <div className={`card ${styles["card-bg"]}`}>
                    <div className="card-header">
                        <div className="card-actions float-right">
                        </div>
                        <h5 className="card-title mb-0">Account Information</h5>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-row row">
                                <div className="col-lg">
                                    <div className="form-group col-md-10">
                                        <label htmlFor="inputFirstName">First name</label>
                                        <input type="text" className={styles["input-form-dark-disabled"]} id="inputFirstName"
                                               autoComplete="none"
                                               disabled
                                               placeholder="First name" value={firstName}/>
                                    </div>
                                    <div className="form-group col-md-10">
                                        <label htmlFor="inputLastName">Last name</label>
                                        <input type="text" className={styles["input-form-dark-disabled"]} id="inputLastName"
                                               autoComplete="none"
                                               disabled
                                               placeholder="Last name" value={lastName}/>
                                    </div>
                                </div>
                                <div className="col-sm d-flex justify-content-center row">
                                    <input type="file" name="upload-picture" accept="image/*" id="upload-picture"
                                           onChange={(e) => {
                                               handleUpload(e)
                                           }} hidden/>

                                    <Tooltip title={enableForm ? "Upload Image" : ""}>
                                        <Avatar
                                            onClick={(e) => {
                                                if (enableForm) {
                                                    chooseImage(e)
                                                }
                                            }}
                                            src={croppedLocalImage}
                                            className={"avatar-icon-large " + (enableForm ? "avatar-icon-hover" : "")}
                                            imgProps={{"className": "avatar-circular-img",}}
                                            variant="circular"
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="form-group col-md-10">
                                <label>Email</label>
                                <input type="email" className={styles["input-form-dark-disabled"]}
                                       id="inputEmail4"
                                       placeholder="Email" value={user.email}
                                       disabled
                                />
                            </div>
                            <div className="form-group col-md-10">
                                <label htmlFor="inputBiography">Biography</label>
                                <textarea className={styles["input-form-dark"]} id="inputBiography" autoComplete="none"
                                          onChange={(e) => {
                                              handleBiographyChange(e)
                                          }}
                                          disabled={!enableForm}
                                          placeholder="Biography" value={biographyText ? biographyText : ''}/>
                            </div>
                            <div className="form-group col-md-10">
                                <label htmlFor="inputLocation">Location</label>
                                <input type="text" className={styles["input-form-dark"]} id="inputLocation" autoComplete="none"
                                       onChange={(e) => {
                                           handleLocationChange(e)
                                       }}
                                       disabled={!enableForm}
                                       placeholder="Location" value={locationText ? locationText : ''}/>
                            </div>
                            <div className="d-flex justify-content-between mt-5">
                                <button disabled={!buttonActive} type="submit" className="btn btn-outline-danger"
                                        id="update-user" onClick={(e) => {
                                    handleSubmitForm(e)

                                }}>Save changes
                                </button>
                                {!enableForm ?
                                    <button type="button" className="btn btn-outline-primary"
                                            id="enable-form"
                                            onClick={() => {
                                                setEnableForm(true)
                                            }}
                                    > Edit Information
                                    </button>
                                    :
                                    <button type="button" className="btn btn-outline-primary"
                                            id="disable-form"
                                            onClick={() => {
                                                setEnableForm(false)
                                            }}
                                    > Cancel
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <CropModal image={uncroppedLocalImage} onCropComplete={receiveCroppedDimension} openModal={openModal}
                           ratio={1} shape={'round'}
                           handleClose={handleClose} onSubmit={receiveCroppedImage}/>

                {/* Success message if backend successfully stores data */}
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
