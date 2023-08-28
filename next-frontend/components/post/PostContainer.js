"use client";

import {Avatar} from "@mui/material";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import ChatBubbleOutlineTwoToneIcon from "@mui/icons-material/ChatBubbleOutlineTwoTone";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import styles from './post.module.scss';


function App() {
    return (
        <div className="container">
            <div className={styles["write-post-container"]}>
                <div className={styles["user-profile"]}>
                    <Avatar
                        src=""
                        className={styles["avatar-icon-small"]}
                        imgProps={{"class": "avatar-circular-img"}}
                        variant="circular"
                    />
                    <div className={styles["user-info"]}>
                        <p>Joe Johnson</p>
                        <small>Public<ArrowDropDownIcon/></small>
                    </div>
                </div>
                <div className={styles["post-input-container"]}>
                    <textarea rows="3" placeholder="What is on your mind?"/>
                    <div className={styles["post-action-container"]}>
                        <a href="#"><PhotoLibraryIcon/> Upload Photo</a>
                    </div>
                </div>
            </div>

            <div className={styles["post-container"]}>
                <div className={styles["user-profile"]}>
                    <Avatar
                        src=""
                        className={styles["avatar-icon-small"]}
                        imgProps={{"class": "avatar-circular-img"}}
                        variant="circular"
                    />
                    <div className={styles["user-info"]}>
                        <p>Joe Johnson</p>
                        <span>May 13 2022, 9:47 pm </span>
                    </div>
                </div>
                <p className={styles["post-text"]}> First Ever Post... <span> @Hu Tao </span></p>
                <img
                    src="https://i0.wp.com/butwhytho.net/wp-content/uploads/2023/04/Mashle-Magic-and-Muscle-Episode-1-%E2%80%94-But-Why-Tho.jpg?fit=800%2C410&ssl=1"
                    alt=''/>
                <div className={styles["post-row"]}>
                    <div className={styles["activity-icons"]}>
                        <div>
                            <FavoriteBorderTwoToneIcon/> 126
                        </div>
                        <div>
                            <ChatBubbleOutlineTwoToneIcon/> 5
                        </div>
                        <div>
                            <SendTwoToneIcon/> 2
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles["post-container"]}>
                <div className={styles["user-profile"]}>
                    <Avatar
                        src=""
                        className={styles["avatar-icon-small"]}
                        imgProps={{"class": "avatar-circular-img"}}
                        variant="circular"
                    />
                    <div className={styles["user-info"]}>
                        <p>Joe Johnson</p>
                        <span>May 13 2022, 9:47 pm </span>
                    </div>
                </div>
                <p className={styles["post-text"]}> First Ever Post... <span> @Hu Tao </span></p>
                <div className={styles["post-row"]}>
                    <div className={styles["activity-icons"]}>
                        <div className={styles["action-icon"]}>
                            <FavoriteBorderTwoToneIcon/> 126
                        </div>
                        <div>
                            <ChatBubbleOutlineTwoToneIcon/> 5
                        </div>
                        <div>
                            <SendTwoToneIcon/> 2
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

