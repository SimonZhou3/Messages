"use client";

import {useEffect, useState} from "react";
import styles from './settings.module.scss';
import {useRouter, usePathname, redirect} from 'next/navigation';
import {getUser} from "../../middleware/Authenticator";
import Loading from "../loading";

function SettingsLayout({children}) {
    const [isHover, setIsHover] = useState(false);
    const [active, setActive] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const activeTab = pathname.split("/").at(-1);
        if (activeTab && activeTab !== 'settings') {
            const element = document.getElementsByName(activeTab)[0];
            element?.classList.add('active-tab')
            setActive(element)
        }


    }, [])

    const handleMouseEnter = (e) => {
        setIsHover(true);
        e.target.classList.add(styles["hover"])
    }
    const handleMouseLeave = (e) => {
        setIsHover(false);
        e.target.classList.remove(styles["hover"])

    }

    const handleOnClick = (e) => {
        if (active !== null) {
            active?.classList.remove(styles["active-tab"]);
        }
        setActive(e);
        e.classList.add("active-tab");

        const path = "/settings/" + e.getAttribute('name');
        router.push(path);
    }

    const {user, isLoading, error} = getUser();
    if (isLoading) {
        return (<Loading/>)
    }

    if (!isLoading && (!user || error)) {
        redirect('/login')
    } else {
        return (
            <div className="container p-0 mt-3">
                <div className="row">
                    <div className="col-md-5 col-xl-4">
                        <div className={`card ${styles["card-bg"]}`}>
                            <div className={`card-header ${styles["card-bg"]}`}>
                                <h5 className="card-title mb-0">Profile Settings</h5>
                            </div>
                            <div className="list-group list-group-flush" role="tablist">
                                <a className={`list-group-item ${styles["card-bg"]}`} data-toggle="list"
                                   id="account-information" name="account"
                                   role="tab" onMouseEnter={(e) => {
                                    handleMouseEnter(e)
                                }} onMouseLeave={((e) => {
                                    handleMouseLeave(e)
                                })} onClick={(e) => {
                                    handleOnClick(e.target)
                                }}>
                                    Account Information
                                </a>
                                <a className={`list-group-item ${styles["card-bg"]}`} data-toggleb="list"
                                   id="change-password" name="password"
                                   role="tab" onMouseEnter={(e) => {
                                    handleMouseEnter(e)
                                }} onMouseLeave={((e) => {
                                    handleMouseLeave(e)
                                })} onClick={(e) => {
                                    handleOnClick(e.target)
                                }}>
                                    Change Password
                                </a>
                                <a className={`list-group-item ${styles["card-bg"]}`} data-toggleb="list"
                                   id="deactivate-account" name="deactivate"
                                   role="tab" onMouseEnter={(e) => {
                                    handleMouseEnter(e)
                                }} onMouseLeave={((e) => {
                                    handleMouseLeave(e)
                                })} onClick={(e) => {
                                    handleOnClick(e.target)
                                }}>
                                    Deactivate Account
                                </a>
                                <a className={`list-group-item ${styles["card-bg"]}`} data-toggle="list" id="options"
                                   name="options"
                                   role="tab" onMouseEnter={(e) => {
                                    handleMouseEnter(e)
                                }} onMouseLeave={((e) => {
                                    handleMouseLeave(e)
                                })} onClick={(e) => {
                                    handleOnClick(e.target)
                                }}>
                                    Options
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 col-xl-8">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsLayout;